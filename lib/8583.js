const H = require('./helpers');
const T = require('./tools');
const formats = require('./formats');
const msgTypes = require('./msgTypes');
const jxon = require('jxon');
const types = require('./types');
const requiredFields = require('./requiredFields');
const requiredEcho = require('./requiredEcho');
const SpT = require('./specialFields/tools');
const maskPan = require('./maskPan');
const toSafeLog = require('./safeToLog');

/**
 * Set of methods for unpacking TCP message encoded in ISO 8583 format. Members of Main Class
 * @module Message-UnPackage
 */
const unpack_0_127 = require('./unpack/unpack_0_127');
const unpack_127_1_63 = require('./unpack/unpack_127_1_63');
const unpack_127_25_1_63 = require('./unpack/unpack_127_25_1_63');

/**
 * Set of methods for assembling the bitmaps for message field 0-127, 127.0-63, 127.25.0-39. Members of Main Class
 * @module Bitmap-Assemble
 */
const assembleBitMap = require('./bitmap/assembleBitMap');
const assembleBitMap_127 = require('./bitmap/assembleBitMap_127');
const assembleBitMap_127_25 = require('./bitmap/assembleBitMap_127_25');

/**
 * Set of methods for packing JSON message into a Buffer message. Members of Main Class
 * @module Message-Package
 */
const assemble0_127_Fields = require('./pack/assemble0_127_Fields');
const assemble127_extensions = require('./pack/assemble127_extensions');
const assemble127_25_extensions = require('./pack/assemble127_25_extensions');


/**
 * Main ISO 8583 Class used to create a new message object with formating methods.
 * @param {object} message - An ISO 8583 message in JSON format.
 * @param {object} customFormats - Custom ISO 8583 format definitions.
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message types.
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */
class Main {
  constructor(message, customFormats, requiredFieldsSchema) {
    if (message) {
      this.MsgType = message[0];
      this.Msg = message;
    } else {
      this.MsgType = null;
      this.Msg = {};
    }
    this.formats = customFormats || {};

    this.hasSpecialFields = SpT.detectSpecial(this.Msg, this.formats);

    this.bitmaps = null;
    this.fields = {};

    this.requiredFieldsSchema = requiredFieldsSchema;

    this.maskPan = maskPan.bind(this);
    this.toSafeLog = toSafeLog.bind(this);

    this.assembleBitMap = assembleBitMap.bind(this);
    this.assembleBitMap_127 = assembleBitMap_127.bind(this);
    this.assembleBitMap_127_25 = assembleBitMap_127_25.bind(this);

    this.unpack_0_127 = unpack_0_127.bind(this);
    this.unpack_127_1_63 = unpack_127_1_63.bind(this);
    this.unpack_127_25_1_63 = unpack_127_25_1_63.bind(this);

    this.assemble0_127_Fields = assemble0_127_Fields.bind(this);
    this.assemble127_extensions = assemble127_extensions.bind(this);
    this.assemble127_25_extensions = assemble127_25_extensions.bind(this);
  }

  static getFieldDescription(fields, customFormats) {
    let cFormats = customFormats || {};
    let descriptions = {};

    if (!fields) {
      return descriptions;
    }

    if (Array.isArray(fields)) {
      for (let field of fields) {
        let this_format = cFormats[field] || formats[field];
        if (this_format) descriptions[field] = this_format.Label;
      }
    } else {
      let this_format = cFormats[fields] || formats[fields];
      if (this_format) descriptions[fields] = this_format.Label;
    }
    return descriptions;
  }

  /**
   * Convert an ISO 8583 message to a retransmit type; Append the retransmit MTI.
   * @function 
   * @returns {object} New ISO 8583 message with a retransmit MTI.
   * @example toRetransmit({'0': '0100', ...}) -> {'0': '0101', ...}
   */
  toRetransmit() {
    let mti = this.Msg['0'];
    let append = parseInt(mti[3], 10) + 1;
    let new_mti = mti.slice(0, 3) + append;
    this.Msg['0'] = new_mti;
    return this.Msg;
  }

  /**
   * Convert an ISO 8583 message to a response type; Append the response MTI.
   * @function 
   * @returns {object} New ISO 8583 message with a response MTI.
   * @example toResponse({'0': '0100', ...}) -> {'0': '0110', ...}
   */
  toResponse() {
    let mti = this.Msg['0'];
    let type = parseInt(mti[2], 10) + 1;
    let new_mti = mti.slice(0, 2) + type + mti.slice(3, 4);
    this.Msg['0'] = new_mti;
    return this.Msg;
  }

  /**
   * Convert an ISO 8583 message to an advise type; Append the an advise MTI.
   * @function 
   * @returns {object} New ISO 8583 message with an advise MTI.
   * @example toAdvice({'0': '0100', ...}) -> {'0': '0120', ...}
   */
  toAdvice() {
    let mti = T.getResType(this.Msg['0']);
    let append = parseInt(mti.slice(2, 4), 10) + 10;
    let new_mti = mti.slice(0, 2) + append;
    this.Msg['0'] = new_mti;
    return this.Msg;
  }

  checkSpecialFields() {
    return SpT.validateSpecialFields(this.Msg, this.formats);
  }

  getLenBuffer(len) {
    let buf1 = T.getTCPHeaderBuffer(parseInt(Number(len) / 256, 10));
    let buf2 = T.getTCPHeaderBuffer(parseInt(Number(len) % 256, 10));
    return Buffer.concat([buf1, buf2]);
  }

 
  getTType() {
    if (this.Msg['3']) return T.getTransType(this.Msg['3'].slice(0, 2));
    else return T.toErrorObject(['transaction type not defined in message']);
  }

  getTransactionType() {
    return this.getTType();
  }


  getAccType() {
    if (this.Msg['3']) return T.getAccType(this.Msg['3'].slice(2, 4));
    else return T.toErrorObject(['transaction type not defined in message']);
  }

  getAccountTypeFrom() {
    return this.getAccType();
  }

  getAccountTypeTo() {
    if (this.Msg['3']) return T.getAccType(this.Msg['3'].slice(4, 6));
    else return T.toErrorObject(['transaction type not defined in message']);
  }

  getTransStatus() {
    if (this.Msg['39']) return T.getTranStatus(this.Msg['39']);
    else return T.toErrorObject(['transaction status not defined in message']);
  }

  attachTimeStamp() {
    if (this.Msg['0']) {
      let state = this.validateMessage(this.Msg);
      if (state.error) {
        return state;
      } else {
        this.Msg = H.attachDiTimeStamps(this.Msg);
        return this.Msg;
      }
    } else return T.toErrorObject(['mti error']);
  }

  /**
   * Check if message is valid.
   * @returns {boolean} true
   * @returns {boolean} false
   * @example new Main(SomeValidMessage,customFormats, []).validateMessage() -> true
   * @example new Main(SomeInvalidMessage,customFormats, []).validateMessage() -> false
   */
  validateMessage() {
    let valid = false;
    let state = this.assembleBitMap();
    let validDate = T.validateFields(this.Msg, this.formats);
    let validateRequiredFields = requiredFields(
      this.Msg,
      this.requiredFieldsSchema
    );
    let specialValidate = SpT.validateSpecialFields(this.Msg, this.formats);
    if (
      !state.error &&
      !validDate.error &&
      !specialValidate.error &&
      !validateRequiredFields.error
    ) {
      let counter = 0;
      for (let i = 1; i < this.bitmaps.length; i++) {
        counter++;
        let field = i + 1;
        if (this.bitmaps[i] === 1) {
          if (!this.Msg[field]) {
            continue;
          }
          let this_format = this.formats[field] || formats[field];
          let state = types(this_format, this.Msg[field], field);
          if (state.error) {
            return state;
          }
          if (this_format) {
            if (this_format.LenType === 'fixed') {
              if (this_format.MaxLen === this.Msg[field].length) {
                valid = true;
              } else return T.toErrorObject(['invalid length of data on field ', field]);
            } else {
              let thisLen = T.getLenType(this_format.LenType);
              if (!this_format.MaxLen)
                return T.toErrorObject(['max length not implemented for ', this_format.LenType, field]);
              if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen)
                return T.toErrorObject(['invalid length of data on field ', field]);
              if (thisLen === 0) {
                return T.toErrorObject(['field', field, ' has no field implementation']);
              } else {
                valid = true;
              }
            }
          } else {
            return T.toErrorObject(['field ', field, ' has invalid data']);
          }
        }
      }
      return valid;
    } else {
      return valid;
    }
  }

  validateEcho({iso_send,iso_answer}) {
    const json = require(this.requiredFieldsSchema);

    return requiredEcho({
      json,
      iso_answer,
      iso_send
    });
  }

  checkMTI() {
    if (msgTypes(this.Msg['0'])) return true;
    else return false;
  }

  _checkMTI(mti) {
    if (msgTypes(mti)) return true;
    else return false;
  }

  /**
   * Get the Message Type Identifier (MTI)
   * @returns {buffer} ISO 8583 encoded Buffer
   * @returns {object} Object with property error
   * @example new Main(SomeValidMessage,customFormats, []).getMti() -> 0100
   * @example new Main(SomeInvalidMessage,customFormats, []).getMti() -> {error: 'some error message'}
   */
  getMti() {
    let state = this.checkMTI();
    if (state) {
      let mti = this.MsgType;
      if (mti === null || mti === undefined) {
        return T.toErrorObject(['mti undefined in message']);
      } else {
        if (this.checkMTI()) {
          let _mti;

          if (!this.Msg['0']) {
            if (!this.MsgType) return T.toErrorObject(['mti undefined on field 0']);
            else _mti = this.MsgType;
          } else _mti = this.Msg['0'];
          const mti = new Uint8Array(4);
          for (let i = 0; i < 4; i++) {
            mti[i] = parseInt(_mti[i], 10);
          }
          return mti.join('');
        } else {
          return T.toErrorObject(['invalid mti']);
        }
      }
    } else {
      return T.toErrorObject(['mti undefined on field 0']);
    }
  }

  getResMTI() {
    if (this.MsgType) {
      return T.getResType(this.MsgType);
    }
  }

  rebuildExtensions_127_25() {
    if (this.Msg['127.25']) {
      let dataString = this.Msg['127.25'];
      let bitmap_127 = T.getHex(dataString.slice(0, 16))
        .split('')
        .map(Number);
      this.Msg['127.25.1'] = dataString.slice(0, 16);
      dataString = dataString.slice(16, dataString.length);
      for (let i = 0; i < bitmap_127.length; i++) {
        if (bitmap_127[i] === 1) {
          let field = '127.25.' + (Number(i) + 1);
          let this_format = this.formats[field] || formats[field];
          if (this_format.LenType === 'fixed') {
            this.Msg[field] = dataString.slice(0, this_format.MaxLen);
            dataString = dataString.slice(
              this_format.MaxLen,
              dataString.length
            );
          } else {
            let thisLen = T.getLenType(this_format.LenType);
            if (!this_format.MaxLen)
              return T.toErrorObject(['max length not implemented for ', this_format.LenType, field]);
            if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen)
              return T.toErrorObject(['invalid length of data on field ', field]);
            if (thisLen === 0) {
              throw T.toErrorObject(['field ', field, ' format not implemented']);
            } else {
              //check length of iso field
              let len = dataString.slice(0, thisLen).toString();
              dataString = dataString.slice(thisLen, dataString.length);
              this.Msg[field] = dataString.slice(0, Number(len)).toString();
              dataString = dataString.slice(Number(len), dataString.length);
            }
          }
        }
      }
    }

    return this.validateMessage(this.Msg);
  }

  // ***tested***
  rebuildExtensions() {
    this.dataString = '';
    if (this.Msg['127']) {
      let dataString = this.Msg['127'];
      let bitmap_127 = T.getHex(dataString.slice(0, 16))
        .split('')
        .map(Number);
      this.Msg['127.1'] = dataString.slice(0, 16);
      dataString = dataString.slice(16, dataString.length);
      for (let i = 0; i < bitmap_127.length; i++) {
        if (bitmap_127[i] === 1) {
          let field = '127.' + (Number(i) + 1);
          let this_format = this.formats[field] || formats[field];
          if (this_format.LenType === 'fixed') {
            this.Msg[field] = dataString.slice(0, this_format.MaxLen);
            dataString = dataString.slice(
              this_format.MaxLen,
              dataString.length
            );
          } else {
            let thisLen = T.getLenType(this_format.LenType);
            if (!this_format.MaxLen)
              return T.toErrorObject(['max length not implemented for ', this_format.LenType, field]);

            if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen)
              return T.toErrorObject(['invalid length of data on field ', field]);
            if (thisLen === 0) {
              throw T.toErrorObject(['field ', field, ' format not implemented']);
            } else {
              //check length of iso field
              let len = dataString.slice(0, thisLen).toString();
              dataString = dataString.slice(thisLen, dataString.length);
              this.Msg[field] = dataString.slice(0, Number(len)).toString();
              dataString = dataString.slice(Number(len), dataString.length);
            }
          }
        }
      }
    }
    return this.rebuildExtensions_127_25();
  }

  /**
   * Gets the bitmap of entire message field 0 to 127
   * @returns {string} The bitmap of fields 0-127 in binary form
   * @returns {object} Object with property error
   * @example new Main(SomeValidMessage,customFormats, []).getBmpsBinary() -> 1111001000111.....
   * @example new Main(SomeInvalidMessage,customFormats, []).getBmpsBinary() -> {error: 'some error message'}
   */
  getBmpsBinary() {
    let state = this.assembleBitMap();
    if (state.error) {
      return state.error;
    } else {
      if (!this.Msg['0']) {
        return T.toErrorObject('message type error, empty or undefined');
      } else {
        let _map = new Uint8Array(128);
        let fields = Object.keys(this.Msg);

        _map[0] = 1;
        for (let i = 0; i < fields.length; i++) {
          let field = parseInt(fields[i], 10);
          if (field > 1) {
            _map[field - 1] = 1;
          }
        }
        this.bitmaps = _map;
        return this.bitmaps.join('');
      }
    }
  }

  /**
   * Gets the bitmap of fields 127.0 to 127.63
   * @returns {string} The bitmap of fields 127.0 to 127.63 in binary form
   * @returns {object} Object with property error
   * @example new Main(SomeValidMessage,customFormats, []).getBitMapHex_127_ext() -> 8000008000000000
   * @example new Main(SomeInvalidMessage,customFormats, []).getBitMapHex_127_ext() -> {error: 'some error message'}
   */
  getBitMapHex_127_ext() {
    let state = this.assembleBitMap_127();
    if (state.error) {
      return state;
    } else {
      let map = '';
      let maps = [];
      let counter = 0;
      for (let i = 0; i < state.length; i++) {
        counter++;
        map += state[i];
        if (counter === 4) {
          maps.push(parseInt(map, 2).toString(16));
          counter = 0;
          map = '';
        }
      }
      return 16, maps.join('');
    }
  }

  /**
   * Gets the bitmap of fields 127.25.0 to 127.63
   * @returns {string} The bitmap of fields 127.25.0 to 127.25.63 in binary form
   * @returns {object} Object with property error
   * @example new Main(SomeValidMessage,customFormats, []).getBitMapHex_127_ext_25() -> fe1e5f7c00000000
   * @example new Main(SomeInvalidMessage,customFormats, []).getBitMapHex_127_ext_25() -> {error: 'some error message'}
   */
  getBitMapHex_127_ext_25() {
    this.rebuildExtensions();
    let state = this.assembleBitMap_127_25();
    if (state.error) {
      return state;
    } else {
      let map = '';
      let maps = [];
      let counter = 0;
      for (let i = 0; i < state.length; i++) {
        counter++;
        map += state[i];
        if (counter === 4) {
          maps.push(parseInt(map, 2).toString(16));
          counter = 0;
          map = '';
        }
      }
      return 16, maps.join('');
    }
  }

  getBitMapHex() {
    let state = this.assembleBitMap();
    if (state.error) {
      return state.error;
    } else {
      if (this.bitmaps !== null && msgTypes(this.MsgType)) {
        let map = '';
        let maps = [];
        let counter = 0;
        for (let i = 0; i < this.bitmaps.length; i++) {
          counter++;
          map += this.bitmaps[i];
          if (counter === 4) {
            maps.push(parseInt(map, 2).toString(16));
            counter = 0;
            map = '';
          }
        }
        return 16, maps.join('');
      } else return T.toErrorObject('bitmap error, expecting 128 length unit array');
    }
  }

  getBitMapFields() {
    let bitmap = [];
    let fields = Object.keys(this.Msg);
    for (let i = 1; i < fields.length; i++) {
      let field = parseInt(fields[i], 10);
      if (field > 1) bitmap.push(field);
    }

    return bitmap;
  }

  
  hasSecondaryBitmap(primaryBitmapBuffer, config) {
    const binary = primaryBitmapBuffer.toString(config.bitmapEncoding || 'hex');
    const bitmap = T.getHex(binary)
      .split('')
      .map(Number);
    return bitmap[0] === 1;
  }

  /**
   * Convert an ISO 8583 message buffer to JSON, Refer to configuration
   * @param {buffer} buffer ISO 8583 encoded buffer
   * @param {object} config Custom conf configurations. Can be { lenHeaderEncoding: 'utf8'/'hex', bitmapEncoding: 'utf8'/'hex', secondaryBitmap: false/true, }
   * @returns {object} ISO 8583 JSON
   * @returns {object} Object with property error
   * @example new Main().getIsoJSON(buffer, config) -> {...}
   * @example new Main().getIsoJSON(buffer, config) -> {error: 'some error message'}
   */
  getIsoJSON(buffer, config) {
    const _config = config || {};
    if (Buffer.isBuffer(buffer)) {
      if (_config.lenHeader === false)
        buffer = buffer.slice(0, buffer.byteLength);
      else buffer = buffer.slice(2, buffer.byteLength);
      let iso = this.unpack_0_127(buffer, {}, _config);
      if (iso.error) return iso;
      else return iso.json;
    } else return T.toErrorObject(['expecting buffer but got ', typeof buffer]);
  }

  buildBitmapBuffer(bitmap, type) {
    if (type === 'ascii') return Buffer.alloc(32, bitmap.toUpperCase());
    else return Buffer.alloc(16, bitmap, 'hex');
  }

  /**
   * 
   * @param {buffer} buffer ISO 8583 encoded buffer
   * @param {object} config Custom conf configurations
   * @returns {buffer} ISO 8583 encoded Buffer
   * @returns {object} Object with property error
   * @example new Main(SomeValidMessage,customFormats, []).getBufferMessage() -> <Buffer 01 11 30 31 30 30 f2 ...
   * @example new Main(SomeInvalidMessage,customFormats, []).getBufferMessage() -> {error: 'some error message'}
   */
  getBufferMessage() {
    let _0_127_Buffer = this.assemble0_127_Fields();
    if (_0_127_Buffer.error) {
      return _0_127_Buffer;
    } else {
      let len_0_127_1 = T.getTCPHeaderBuffer(
        parseInt(Number(_0_127_Buffer.byteLength) / 256, 10)
      );
      let len_0_127_2 = T.getTCPHeaderBuffer(
        parseInt(Number(_0_127_Buffer.byteLength) % 256, 10)
      );
      return Buffer.concat([len_0_127_1, len_0_127_2, _0_127_Buffer]);
    }
  }

  getRawMessage() {
    return this.assemble0_127_Fields();
  }

  expandFields(field) {
    let str = field.toString();
    if (str.length < 3) {
      let pad = 3 - str.length;
      for (let i = 0; i < pad; i++) {
        str = '0' + str;
      }
      return 'Field_' + str;
    } else if (str.length > 3 && str.length < 7) {
      let field = 'Field_127_';
      let ext = str.split('127.')[1];
      let pad = 3 - ext.length;
      while (pad > 0) {
        field += '0';
        pad--;
      }
      return field + ext;
    } else if (str.length > 6) {
      let field = 'Field_127_25_';
      let ext = str.split('127.25.')[1];
      let pad = 3 - ext.length;
      while (pad > 0) {
        field += '0';
        pad--;
      }
      return field + ext;
    } else {
      return 'Field_' + str;
    }
  }

  contractField(field) {
    field = field.toLowerCase();
    if (field.length > 12 && field.length < 14) {
      return '127' + '.' + Number(field.split('field_127_')[1]);
    } else if (field.length > 14) {
      return (
        '127' +
        '.' +
        Number(field.split('_')[2]) +
        '.' +
        Number(field.split('_')[3])
      );
    } else {
      return Number(field.split('field_')[1]);
    }
  }

  addField(number, data) {
    if (!this.Msg)
      return T.toErrorObject('message undefined');
    let this_format = this.formats[number] || formats[number];
    if (!this_format) return T.toErrorObject('field ', number, ' not implemented');
    let state = types(this_format, this.Msg[number].toString(), number);

    if (number === 0) {
      this.Msg['0'] = data;
      this.MsgType = data;
      return true;
    } else {
      if (state.error) {
        return state;
      } else {
        this.Msg[number.toString()] = data;
        this.fields[this.expandFields(number)] = data;
        return true;
      }
    }
  }

  addFromDiObject() {
    for (let key in this.Msg) {
      if (this.Msg.hasOwnProperty) {
        let state = this.addField(key, this.Msg[key]);
        if (state.error) {
          return state;
        }
      }
    }

    return true;
  }

  getJsonFromXml(string) {
    if (string) {
      let obj = jxon.stringToJs(string);
      if (obj.Iso8583PostXml) {
        let iso = obj.Iso8583PostXml;
        let res = {};
        // prepare MTI
        let mti = iso.MsgType.toString();
        res['0'] = mti;

        for (let key in iso.Fields) {
          if (iso.Fields.hasOwnProperty(key)) {
            let item = this.contractField(key);
            res[item] = iso.Fields[key];
          }
        }

        return res;
      } else if (obj.iso8583postxml) {
        let iso = obj.iso8583postxml;
        let res = {};
        let mti = '';
        mti = iso.msgtype.toString();
        if (mti.length === 3) {
          mti = '0' + mti;
        }
        res['0'] = mti;

        for (let key in iso.fields) {
          if (iso.fields.hasOwnProperty(key)) {
            let item = this.contractField(key);
            res[item] = iso.fields[key];
          }
        }

        return res;
      } else return T.toErrorObject('could not parse xml');
    } else return T.toErrorObject('xml is not properly encoded');
  }

  getXMLString() {
    const header = '<?xml version="1.0" encoding="UTF-8"?>';

    if (!this.MsgType || !msgTypes(this.MsgType)) return T.toErrorObject('mti undefined or invalid'); 
    else {
      let state = this.addFromDiObject();
      if (state.error) {
        return state;
      } else {
        let d = {};
        d['Iso8583PostXml'] = {
          MsgType: this.MsgType,
          Fields: this.fields
        };
        return header + jxon.jsToString(d);
      }
    }
  }
}

module.exports = Main;