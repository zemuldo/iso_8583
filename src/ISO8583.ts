import { KeyValueStringT } from './t';
// @ts-ignore
import jxon from 'jxon';
import * as Types from './t';
import ISO8583Base from './ISO8583Base';
import formats from './formats';
import requiredFields from './requiredFields';
import requiredEcho from './requiredEcho';
import types from './types';
import T from './tools';
import takeStaticMeta from './unpack/take_static_metadata';
import msgTypes from './msgTypes';
import * as H from './helpers';

import * as SpT from './specialFields/tools';
import addStaticMetaData from './pack/addStaticMetaData';
import { DefaultError } from './errors';

/**
 * Main ISO 8583 Class used to create a new message object with formating methods.
 * @param {object} message - An ISO 8583 message in JSON format.
 * @param {object} customFormats - Custom ISO 8583 format definitions.
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message types.
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */
export default class ISO8583 extends ISO8583Base {
  dataString: string = '';
  constructor(
    message?: Types.ISOMessageT,
    customFormats?: Types.CustomFormatT,
    requiredFieldsSchema?: Types.RequiredFieldSchemaT,
  ) {
    super(message, customFormats, requiredFieldsSchema);
  }

  static getFieldDescription(fields?: string | string[] | number | number[] | null, customFormats?: Types.CustomFormatT) {
    const cFormats = customFormats || {};
    const descriptions: Types.KeyValueStringT = {};

    if (!fields) {
      return descriptions;
    }

    if (Array.isArray(fields)) {
      for (const field of fields) {
        const this_format = cFormats[field] || formats[field];
        if (this_format) descriptions[field] = this_format.Label;
      }
    } else {
      const this_format = cFormats[fields] || formats[fields];
      if (this_format) descriptions[fields] = this_format.Label;
    }
    return descriptions;
  }

  setMetadata(metaData: string) {
    this.metaData = metaData;
    return this;
  }

  /**
   * Convert an ISO 8583 message to a retransmit type; Append the retransmit MTI.
   * @function
   * @returns {object} New ISO 8583 message with a retransmit MTI.
   * @example toRetransmit({'0': '0100', ...}) -> {'0': '0101', ...}
   */
  toRetransmit() {
    if (!this.Msg) return this.throwMessageUndef();
    const mti: any = this.Msg['0'];
    const append = parseInt(mti[3], 10) + 1;
    const new_mti = mti.slice(0, 3) + append;
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
    if (!this.Msg) return this.throwMessageUndef();
    const mti: any = this.Msg['0'];
    const type = parseInt(mti[2], 10) + 1;
    const new_mti = mti.slice(0, 2) + type + mti.slice(3, 4);
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
    if (!this.Msg) return this.throwMessageUndef();
    const mti = T.getResType(this.Msg['0']);
    if (!mti) return { error: 'mti invalid' };
    const append = parseInt(mti.slice(2, 4), 10) + 10;
    const new_mti = mti.slice(0, 2) + append;
    this.Msg['0'] = new_mti;
    return this.Msg;
  }

  checkSpecialFields() {
    if(!this.Msg) return this.throwMessageUndef();
    return SpT.validateSpecialFields(this.Msg, this.formats);
  }

  getLenBuffer(len: number) {
    const buf1 = T.getTCPHeaderBuffer(Math.floor(len / 256));
    const buf2 = T.getTCPHeaderBuffer(Math.floor(len % 256));
    return Buffer.concat([buf1, buf2]);
  }

  getTType() {
    if (!this.Msg) return this.throwMessageUndef();
    if (this.Msg['3']) return T.getTransType(this.Msg['3'].slice(0, 2));
    else return T.toErrorObject(['transaction type not defined in message']);
  }

  getTransactionType() {
    return this.getTType();
  }

  getAccType() {
    if (!this.Msg) return this.throwMessageUndef();
    if (this.Msg['3']) return T.getAccType(this.Msg['3'].slice(2, 4));
    else return T.toErrorObject(['transaction type not defined in message']);
  }

  getAccountTypeFrom() {
    return this.getAccType();
  }

  getAccountTypeTo() {
    if (!this.Msg) return this.throwMessageUndef();
    if (this.Msg['3']) return T.getAccType(this.Msg['3'].slice(4, 6));
    else return T.toErrorObject(['transaction type not defined in message']);
  }

  getTransStatus() {
    if (!this.Msg) return this.throwMessageUndef();
    if (this.Msg['39']) return T.getTranStatus(this.Msg['39']);
    else return T.toErrorObject(['transaction status not defined in message']);
  }

  attachTimeStamp() {
    if (!this.Msg) return this.throwMessageUndef();
    if (this.Msg['0']) {
      const state = this.validateMessage();
      if (state instanceof   Error) {
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
    if (!this.Msg) return false;
    let valid = false;
    const state = this.assembleBitMap();
    const validDate = T.validateFields(this);
    const validateRequiredFields = requiredFields(this.Msg, this.requiredFieldsSchema);
    const specialValidate = SpT.validateSpecialFields(this.Msg, this.formats);

    if (
      !(state instanceof   Error) &&
      !(validDate instanceof   Error) &&
      !(specialValidate instanceof   Error) &&
      !(validateRequiredFields instanceof   Error)
    ) {
      for (let i = 1; i < this.bitmaps.length; i++) {
        const field = i + 1;
        if (this.bitmaps[i] === 1) {
          if (!this.Msg[field]) {
            continue;
          }

          const this_format = this.formats[field] || formats[field];
          const state = types(this_format, this.Msg[field], field);
          if (state instanceof Error) {
            return false;
          }
          if (this_format) {
            if (this_format.LenType === 'fixed') {
              if (this_format.MaxLen === this.Msg[field].length) {
                valid = true;
              } else return T.toErrorObject(['invalid length of data on field ', field]);
            } else {
              const thisLen = T.getLenType(this_format.LenType);
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

  validateEcho(iso_send: KeyValueStringT, iso_answer: KeyValueStringT) {
    return requiredEcho(this.requiredFieldsSchema, iso_answer, iso_send);
  }

  checkMTI() {
    if (!this.Msg) return this.throwMessageUndef();
    if (msgTypes(this.Msg['0'])) return true;
    else return false;
  }

  _checkMTI(mti: string) {
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
    if (!this.Msg) return this.throwMessageUndef();
    const state = this.checkMTI();
    if (state) {
      const mti = this.MsgType;
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
    if (!this.Msg) return this.throwMessageUndef();
    if (this.Msg['127.25'] && T.isXmlEncoded(this.Msg['127.25'])) {
      return this.validateMessage();
    }
    if (this.Msg['127.25']) {
      let dataString = this.Msg['127.25'];
      const bitmap_127 = T.getHex(dataString.slice(0, 16)).split('').map(Number);
      this.Msg['127.25.1'] = dataString.slice(0, 16);
      dataString = dataString.slice(16, dataString.length);
      for (let i = 0; i < bitmap_127.length; i++) {
        if (bitmap_127[i] === 1) {
          const field = '127.25.' + (Number(i) + 1);

          const this_format = this.formats[field] || formats[field];
          if (this_format.LenType === 'fixed') {
            this.Msg[field] = dataString.slice(0, this_format.MaxLen);
            dataString = dataString.slice(this_format.MaxLen, dataString.length);
          } else {
            const thisLen = T.getLenType(this_format.LenType);
            if (!this_format.MaxLen)
              return T.toErrorObject(['max length not implemented for ', this_format.LenType, field]);
            if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen)
              return T.toErrorObject(['invalid length of data on field ', field]);
            if (thisLen === 0) {
              throw T.toErrorObject(['field ', field, ' format not implemented']);
            } else {
              // check length of iso field
              const len = dataString.slice(0, thisLen).toString();
              dataString = dataString.slice(thisLen, dataString.length);
              this.Msg[field] = dataString.slice(0, Number(len)).toString();
              dataString = dataString.slice(Number(len), dataString.length);
            }
          }
        }
      }
    }

    return this.validateMessage();
  }

  // ***tested***
  rebuildExtensions() {
    if (!this.Msg) return this.throwMessageUndef();

    this.dataString = '';
    if (this.Msg['127']) {
      let dataString = this.Msg['127'];
      const bitmap_127 = T.getHex(dataString.slice(0, 16)).split('').map(Number);
      this.Msg['127.1'] = dataString.slice(0, 16);
      dataString = dataString.slice(16, dataString.length);
      for (let i = 0; i < bitmap_127.length; i++) {
        if (bitmap_127[i] === 1) {
          const field = '127.' + (Number(i) + 1);

          const this_format = this.formats[field] || formats[field];
          if (this_format.LenType === 'fixed') {
            this.Msg[field] = dataString.slice(0, this_format.MaxLen);
            dataString = dataString.slice(this_format.MaxLen, dataString.length);
          } else {
            const thisLen = T.getLenType(this_format.LenType);
            if (!this_format.MaxLen)
              return T.toErrorObject(['max length not implemented for ', this_format.LenType, field]);

            if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen)
              return T.toErrorObject(['invalid length of data on field ', field]);
            if (thisLen === 0) {
              throw T.toErrorObject(['field ', field, ' format not implemented']);
            } else {
              // check length of iso field
              const len = dataString.slice(0, thisLen).toString();
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
    if (!this.Msg) return this.throwMessageUndef();
    const state = this.assembleBitMap();

    if (state instanceof   Error) {
      return state.error;
    } else {
      if (!this.Msg['0']) {
        return T.toErrorObject('message type error, empty or undefined');
      } else {
        const _map = new Uint8Array(128);
        const fields = Object.keys(this.Msg);

        _map[0] = 1;
        for (let i = 0; i < fields.length; i++) {
          const field = parseInt(fields[i], 10);
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
    const state = this.assembleBitMap_127();

    if (state instanceof   Error) {
      return state;
    } else {
      let map = '';
      const maps = [];
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
      return maps.join('');
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
    const state = this.assembleBitMap_127_25();

    if (state instanceof   Error) {
      return state;
    } else {
      let map = '';
      const maps = [];
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
      return maps.join('');
    }
  }

  getBitMapHex() {
    const state = this.assembleBitMap();

    if (state.error) {
      return state.error;
    } else {
      if (this.bitmaps !== null && msgTypes(this.MsgType)) {
        let map = '';
        const maps = [];
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
        return this.bitmaps.length, maps.join('');
      } else return T.toErrorObject('bitmap error, expecting 128 length unit array');
    }
  }

  getBitMapFields() {
    const bitmap = [];

    if (!this.Msg) return this.throwMessageUndef();

    const fields = Object.keys(this.Msg);
    for (let i = 1; i < fields.length; i++) {
      const field = parseInt(fields[i], 10);
      if (field > 1) bitmap.push(field);
    }

    return bitmap;
  }

  hasSecondaryBitmap(primaryBitmapBuffer: Buffer, config: Types.Config) {
    const binary = primaryBitmapBuffer.toString(config.bitmapEncoding || 'hex');
    const bitmap = T.getHex(binary).split('').map(Number);
    return bitmap[0] === 1;
  }

  /**
   * Convert an ISO 8583 message buffer to JSON, Refer to configuration ::Deprecated
   * @deprecated Will be removed in the next version, use decode instead
   * @param {buffer} buffer ISO 8583 encoded buffer
   * @param {object} config Custom conf configurations. Can be { lenHeaderEncoding: 'utf8'/'hex', bitmapEncoding: 'utf8'/'hex', secondaryBitmap: false/true, }
   * @returns {object} ISO 8583 JSON
   * @returns {object} Object with property error
   * @example new Main().getIsoJSON(buffer, config) -> {...}
   * @example new Main().getIsoJSON(buffer, config) -> {error: 'some error message'}
   */
  getIsoJSON(buffer: Buffer, config: Types.KeyValueT) {
    const _config = config || {};

    if (Buffer.isBuffer(buffer)) {
      if (_config.lenHeader === false) {
        buffer = buffer.slice(0, buffer.byteLength);
      } else {
        buffer = buffer.slice(2, buffer.byteLength);
      }
      buffer = takeStaticMeta(this, buffer);
      const iso = this.unpack_0_127(buffer, {}, _config);

      if (iso instanceof   Error) {
        return iso;
      } else {
        return iso;
      }
    } else {
      return T.toErrorObject(['expecting buffer but got ', typeof buffer]);
    }
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
  decode() {
    let buffer = this.BufferMsg;
    const _config = this.config || {};

    if (Buffer.isBuffer(buffer)) {
      if (_config.lenHeader === false) {
        buffer = buffer.slice(0, buffer.byteLength);
      } else {
        buffer = buffer.slice(2, buffer.byteLength);
      }
      buffer = takeStaticMeta(this, buffer);

      const iso = this.unpack_0_127(buffer, {}, _config);

      if (iso.error) {
        return iso;
      } else {
        return iso;
      }
    } else {
      return T.toErrorObject(['expecting buffer but got ', typeof buffer]);
    }
  }

  buildBitmapBuffer(bitmap: string, type: string) {
    if (type === 'ascii') return Buffer.alloc(bitmap.length, bitmap.toUpperCase());
    else return Buffer.alloc(bitmap.length / 2, bitmap, 'hex');
  }

  /**
   * @deprecated will be removed in next version. Use encode instead
   * @param {buffer} buffer ISO 8583 encoded buffer
   * @param {object} config Custom conf configurations
   * @returns {buffer} ISO 8583 encoded Buffer
   * @returns {object} Object with property error
   * @example new Main(SomeValidMessage,customFormats, []).getBufferMessage() -> <Buffer 01 11 30 31 30 30 f2 ...
   * @example new Main(SomeInvalidMessage,customFormats, []).getBufferMessage() -> {error: 'some error message'}
   */
  getBufferMessage() {
    // console.warn('getBufferMessage will be removed in next version. Use encode instead');
    const staticMetadataBuf = addStaticMetaData(this);
    const _0_127_Buffer = this.assemble0_127_Fields();
    if (_0_127_Buffer instanceof   Error) {
      return _0_127_Buffer;
    } else {
      const len_0_127_1 = T.getTCPHeaderBuffer(Math.floor(_0_127_Buffer.byteLength / 256));
      const len_0_127_2 = T.getTCPHeaderBuffer(Math.floor(_0_127_Buffer.byteLength % 256));
      return Buffer.concat([len_0_127_1, len_0_127_2, staticMetadataBuf, _0_127_Buffer]);
      // return Buffer.concat([len_0_127_1, len_0_127_2, _0_127_Buffer]);
    }
  }

  /**
   *
   * @returns {buffer} ISO 8583 encoded Buffer
   * @returns {object} Object with property error
   * @example new Main(SomeValidMessage,customFormats, []).getBufferMessage() -> <Buffer 01 11 30 31 30 30 f2 ...
   * @example new Main(SomeInvalidMessage,customFormats, []).getBufferMessage() -> {error: 'some error message'}
   */
  encode() {
    const staticMetadataBuf = addStaticMetaData(this);
    const _0_127_Buffer = this.assemble0_127_Fields();

    if (_0_127_Buffer instanceof   Error) {
      return _0_127_Buffer;
    } else {
      const len_0_127_1 = T.getTCPHeaderBuffer(Math.floor(Number(_0_127_Buffer.byteLength) / 256));
      const len_0_127_2 = T.getTCPHeaderBuffer(Math.floor(Number(_0_127_Buffer.byteLength) % 256));
      return Buffer.concat([len_0_127_1, len_0_127_2, staticMetadataBuf, _0_127_Buffer]);
      // return Buffer.concat([len_0_127_1, len_0_127_2, _0_127_Buffer]);
    }
  }

  getRawMessage() {
    return this.assemble0_127_Fields();
  }

  expandFields(field: number | string) {
    let str = field.toString();
    if (str.length < 3) {
      const pad = 3 - str.length;
      for (let i = 0; i < pad; i++) {
        str = '0' + str;
      }
      return 'Field_' + str;
    } else if (str.length > 3 && str.length < 7) {
      let field = 'Field_127_';
      const ext = str.split('127.')[1];
      let pad = 3 - ext.length;
      while (pad > 0) {
        field += '0';
        pad--;
      }
      return field + ext;
    } else if (str.length > 6) {
      let field = 'Field_127_25_';
      const ext = str.split('127.25.')[1];
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

  contractField(field: string) {
    field = field.toLowerCase();
    if (field.length > 12 && field.length < 14) {
      return '127' + '.' + Number(field.split('field_127_')[1]);
    } else if (field.length > 14) {
      return '127' + '.' + Number(field.split('_')[2]) + '.' + Number(field.split('_')[3]);
    } else {
      return Number(field.split('field_')[1]);
    }
  }

  addField(field: string | number, data: string) {
    if (!this.Msg) return T.toErrorObject('message undefined');

    const this_format = this.formats[field] || formats[field];
    if (!this_format) return T.toErrorObject('field ' + field + ' not implemented');
    const state = types(this_format, this.Msg[field].toString(), field);

    if (field === 0 || field === '0') {
      this.Msg['0'] = data;
      this.MsgType = data;
      return true;
    } else {
      if (state instanceof   Error) {
        return state;
      } else {
        this.Msg[field.toString()] = data;
        this.fields[this.expandFields(field)] = data;
        return true;
      }
    }
  }

  addFromDiObject() {
    for (const key in this.Msg) {
      if (this.Msg.hasOwnProperty(key)) {
        const state = this.addField(key, this.Msg[key]);
        if (state instanceof   Error) {
          return state;
        }
      }
    }

    return true;
  }

  getJsonFromXml(xmString: string) {
    if (xmString) {
      const obj = jxon.stringToJs(xmString);
      if (obj.Iso8583PostXml) {
        const iso = obj.Iso8583PostXml;
        const res: Types.KeyValueStringT = {};
        // prepare MTI
        const mti = iso.MsgType.toString();
        res['0'] = mti;

        for (const key in iso.Fields) {
          if (iso.Fields.hasOwnProperty(key)) {
            const item = this.contractField(key);
            res[item] = iso.Fields[key];
          }
        }

        return res;
      } else if (obj.iso8583postxml) {
        const iso = obj.iso8583postxml;
        const res: Types.KeyValueStringT = {};
        let mti = '';
        mti = iso.msgtype.toString();
        if (mti.length === 3) {
          mti = '0' + mti;
        }
        res['0'] = mti;

        for (const key in iso.fields) {
          if (iso.fields.hasOwnProperty(key)) {
            const item = this.contractField(key);
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
      const state = this.addFromDiObject();
      if (state instanceof   Error) {
        return state;
      } else {
        return (
          header +
          jxon.jsToString({
            MsgType: this.MsgType,
            Fields: this.fields,
          })
        );
      }
    }
  }

  throwMessageUndef() {
    throw Error('Message is not valid or is undefined');
  }
}
