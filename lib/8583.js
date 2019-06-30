const formats = require('./formats');
const msgTypes = require('./msgTypes');
const jxon = require('jxon');
const types = require('./types');
const requiredFields = require('./requiredFields');
const requiredEcho = require('./requiredEcho');
let {attachDiTimeStamps} = require('./helpers');
let {validateFields, getLenType, getHex, getResType, getTransType, getAccType, getTranStatus} = require('./tools');
const {validateSpecialFields, detectSpecial} = require('./specialFields/tools');
const maskPan = require('./maskPan');
const toSafeLog = require('./safeToLog');

class Main {
  // ***tested***
  constructor(object, customFormats, requiredFieldsSchema) {
    if (object) {
      this.MsgType = object[0];
      this.Msg = object;
    } else {
      this.MsgType = null;
      this.Msg = {};
    }
    /* This allows custom iso 8583 formats implementation */
    this.formats = customFormats || {};

    this.hasSpecialFields = detectSpecial(this.Msg, this.formats);

    this.bitmaps = null;
    this.fields = {};

    this.requiredFieldsSchema = requiredFieldsSchema;

    this.maskPan = maskPan.bind(this);
    this.toSafeLog = toSafeLog.bind(this);
  }

  static getFieldDescription(f, customFormats) {
    let cFormats = customFormats || {};
    let descriptions = {};

    if (!f) {
      return descriptions;
    }

    if (Array.isArray(f)) {
      for (let field of f) {
        let this_format = cFormats[field] || formats[field];
        if (this_format)
          descriptions[field] = this_format.Label;
      }

    } else {
      let this_format = cFormats[f] || formats[f];
      if (this_format)
        descriptions[f] = this_format.Label;
    }
    return descriptions;
  }

  toRetransmit(){
    let mti = this.Msg['0'];
    let append = parseInt(mti[3],10)+1;
    let new_mti = mti.slice(0,3)+append;
    this.Msg['0'] = new_mti;
    return this.Msg;
  }

  toResponse(){
    let mti = this.Msg['0'];
    let type = parseInt(mti[2],10)+1;
    let new_mti = mti.slice(0,2)+type+mti.slice(3,4);
    this.Msg['0'] = new_mti;
    return this.Msg;
  }

  toAdvice(){
    let mti = getResType(this.Msg['0']);
    let append = parseInt(mti.slice(2,4),10)+10;
    let new_mti = mti.slice(0,2)+append;
    this.Msg['0'] = new_mti;
    return this.Msg;
  }

  checkSpecialFields() {
    return validateSpecialFields(this.Msg, this.formats);
  }

  getLenBuffer(len) {
    let buf1 = this.getTCPHeaderBuffer(parseInt((Number(len) / 256), 10));
    let buf2 = this.getTCPHeaderBuffer((parseInt((Number(len) % 256), 10)));
    return Buffer.concat([buf1, buf2]);
  }

  /**
   * [getTType description]
   * @return {[type]} [description]
   */
  getTType() {
    if (this.Msg['3'])
      return getTransType(this.Msg['3'].slice(0, 2));
    else
      return {error: 'transaction type not defined in message'};
  }

  /**
   * [getTransactionType description]
   * @return {[type]} [account type description string, e.g. 'Credit account']
   */
  getTransactionType() {
    return this.getTType();
  }

  /**
   * [getAccType description]
   * @return {[type]} [account type description string, e.g. 'Credit account']
   */
  getAccType() {
    if (this.Msg['3'])
      return getAccType(this.Msg['3'].slice(2, 4));
    else
      return {error: 'transaction type not defined in message'};
  }

  /**
   * [getAccountTypeFrom wrapper to getAccType()]
   * @return {[type]} [account type description string, e.g. 'Credit account']
   */
  getAccountTypeFrom() {
    return this.getAccType();
  }

  /**
   * [getAccountTypeTo description]
   * @return {[type]} [account type description string, e.g. 'Credit account']
   */
  getAccountTypeTo() {
    if (this.Msg['3'])
      return getAccType(this.Msg['3'].slice(4, 6));
    else
      return {error: 'transaction type not defined in message'};
  }

  getTransStatus() {
    if (this.Msg['39'])
      return getTranStatus(this.Msg['39']);
    else
      return {error: 'transaction status not defined in message'};
  }

  attachTimeStamp() {
    if (this.Msg['0']) {
      let state = this.validateMessage(this.Msg);
      if (state.error) {
        return state;
      } else {
        this.Msg = attachDiTimeStamps(this.Msg);
        return this.Msg;
      }
    } else {
      return {error: 'mti error'};
    }

  }

  //BITMAP FORMAT
  validateMessage() {
    let valid = false;
    let state = this.assembleBitMap();
    let validDate = validateFields(this.Msg, this.formats);
    let validateRequiredFields = requiredFields(this.Msg, this.requiredFieldsSchema);
    let specialValidate = validateSpecialFields(this.Msg, this.formats);
    //expects array of 0s & 1s and data-json object
    if (!state.error && !validDate.error && !specialValidate.error && !validateRequiredFields.error) {
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
              } else {
                return {error: 'invalid length of data on field ' + field};
              }

            } else {
              let thisLen = getLenType(this_format.LenType);
              if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + field};
              if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + field};
              if (thisLen === 0) {
                return {error: 'field' + field + ' has no field implementation'};
              } else {
                valid = true;
              }
            }
          } else {
            return {error: 'field ' + field + ' has invalid data'};
          }

        }
      }
      return valid;
    } else {
      return valid;
    }

  }

  validateEcho({iso_send, iso_answer}) {

    const json = require(this.requiredFieldsSchema);

    return requiredEcho({json, iso_answer, iso_send});

  }

  // ***tested***
  checkMTI() {
    if (msgTypes(this.Msg['0']))
      return true;
    else
      return false;
  }

  _checkMTI(mti) {
    if (msgTypes(mti))
      return true;
    else
      return false;
  }

  getMti() {
    let state = this.checkMTI();
    if (state) {
      let mti = this.MsgType;
      if (mti === null || mti === undefined) {
        return {error: 'mti undefined in message'};
      } else {
        if (this.checkMTI()) {
          let _mti;

          if (!this.Msg['0']) {
            if (!this.MsgType) {
              return {code: 667, error: 'mti undefined on field 0'};
            } else {
              _mti = this.MsgType;
            }
          } else {
            _mti = this.Msg['0'];
          }
          let mti = new Uint8Array(4);
          for (let i = 0; i < 4; i++) {
            mti[i] = parseInt(_mti[i], 10);
          }
          return mti.join('');
        } else {
          return {error: 'invalid mti'};
        }
      }
    } else {
      return {error: 'mti undefined on field 0'};
    }


  }

  getResMTI() {
    if (this.MsgType) {
      return getResType(this.MsgType);
    }

  }

  rebuildExtensions_127_25() {
    if (this.Msg['127.25']) {
      let dataString = this.Msg['127.25'];
      let bitmap_127 = getHex(dataString.slice(0, 16)).split('').map(Number);
      this.Msg['127.25.1'] = dataString.slice(0, 16);
      dataString = dataString.slice(16, dataString.length);
      for (let i = 0; i < bitmap_127.length; i++) {
        if (bitmap_127[i] === 1) {
          let field = '127.25.' + (Number(i) + 1);
          let this_format = this.formats[field] || formats[field];
          if (this_format.LenType === 'fixed') {
            this.Msg[field] = dataString.slice(0, this_format.MaxLen);
            dataString = dataString.slice(this_format.MaxLen, dataString.length);
          } else {
            let thisLen = getLenType(this_format.LenType);
            if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + field};
            if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + field};
            if (thisLen === 0) {
              throw {error: 'field ' + field + ' format not implemented'};
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
      let bitmap_127 = getHex(dataString.slice(0, 16)).split('').map(Number);
      this.Msg['127.1'] = dataString.slice(0, 16);
      dataString = dataString.slice(16, dataString.length);
      for (let i = 0; i < bitmap_127.length; i++) {
        if (bitmap_127[i] === 1) {
          let field = '127.' + (Number(i) + 1);
          let this_format = this.formats[field] || formats[field];
          if (this_format.LenType === 'fixed') {
            this.Msg[field] = dataString.slice(0, this_format.MaxLen);
            dataString = dataString.slice(this_format.MaxLen, dataString.length);
          } else {
            let thisLen = getLenType(this_format.LenType);
            if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + field};
            
            if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + field};
            if (thisLen === 0) {
              throw {error: 'field ' + field + ' format not implemented'};
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

  assembleBitMap() {
    if (this.checkMTI()) {
      let upper = this.hasSpecialFields?193:128;
      let _map = new Uint8Array(upper);
      let fields = Object.keys(this.Msg);

      _map[0] = 1;
      // construct 128 bit mask
      for (let i = 0; i < fields.length; i++) {
        let field = parseInt(fields[i], 10);
        if (field > 1) {
          _map[field - 1] = 1;
        }
      }
      this.bitmaps = _map;
      return _map;
    } else
      return {error: 'bitmap error, iso message type undefined or invalid'};
  }

  assembleBitMap_127() {
    let extend = this.rebuildExtensions();
    let state = this.checkMTI();
    if (state && !extend.error) {
      if (this.Msg['0'] && state) {
        let _map = new Uint8Array(64);
        for (let i = 0; i < _map.length; i++) {
          let field = '127.' + (i + 1);

          if (this.Msg[field]) {
            _map[i] = 1;
          }
        }
        return _map;
      } else {
        return {error: 'bitmap error, iso message type undefined or invalid'};
      }
    } else {
      return {error: 'bitmap error, iso message type undefined or invalid'};
    }
  }

  assembleBitMap_127_25() {
    let extend = this.rebuildExtensions();
    let state = this.checkMTI();

    if (state && !extend.error) {
      if (this.Msg['0'] && state) {
        let _map = new Uint8Array(64);
        for (let i = 0; i < _map.length; i++) {
          let field = '127.25.' + (i + 1);

          if (this.Msg[field]) {
            _map[i] = 1;
          }
        }
        return _map;
      } else {
        return {error: 'bitmap error, iso message type undefined or invalid'};
      }
    } else {
      return {error: 'bitmap error, iso message type undefined or invalid'};
    }
  }

  assembleBitMap_127_125() {
    let extend = this.rebuildExtensions();
    let state = this.checkMTI();
    if (state && !extend.error) {
      if (this.Msg['0'] && state) {
        let _map = new Uint8Array(64);
        for (let i = 0; i < _map.length; i++) {
          let field = '127.25.' + (i + 1);
          if (this.Msg[field]) {
            _map[i] = 1;
          }
        }
        return _map;
      } else {
        return {error: 'bitmap error, iso message type undefined or invalid'};
      }
    } else {
      return {error: 'bitmap error, iso message type undefined or invalid'};
    }

  }

  // ***tested***
  getBmpsBinary() {
    let state = this.assembleBitMap();
    if (state.error) {
      return state.error;
    } else {
      if (!this.Msg['0']) {
        return {error: 'message type error, empty or undefined'};
      } else {
        let _map = new Uint8Array(128);
        let fields = Object.keys(this.Msg);

        _map[0] = 1;
        // construct 128 bit mask
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

  getBitMapHex_127_ext_25() {
    this.rebuildExtensions();
    let state = this.assembleBitMap_127_125();
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
      } else {
        return {error: 'bitmap error, expecting 128 length unit array'};
      }
    }
  }

  getBitMapFields() {
    let bitmap = [];
    let fields = Object.keys(this.Msg);
    for (let i = 1; i < fields.length; i++) {
      let field = parseInt(fields[i], 10);
      if (field > 1)
        bitmap.push(field);
    }

    return bitmap;
  }

  unpack_127_25_1_63(slice_127_25, isoJSON) {
    if (slice_127_25.byteLength < 10) {
      return {json: isoJSON, remSlice: slice_127_25};
    } else {
      let len = slice_127_25.slice(0, 4);
      slice_127_25 = slice_127_25.slice(4, slice_127_25.length);
      let bitmap = getHex(slice_127_25.slice(0, 16).toString()).split('').map(Number);
      slice_127_25 = slice_127_25.slice(16, slice_127_25.length);
      for (let i = 0; i < 34; i++) {
        if (bitmap[i] === 1) {
          let subField = '127.25.' + (i + 1);
          let this_format = this.formats[subField] || formats[subField];
          if (this_format) {
            if (this_format.LenType === 'fixed') {
              if (this_format.ContentType === 'b') {
                isoJSON[subField] = slice_127_25.slice(0, this_format.MaxLen / 2).toString('hex');
                slice_127_25 = slice_127_25.slice(this_format.MaxLen / 2, slice_127_25.length);
              } else {
                isoJSON[subField] = slice_127_25.slice(0, this_format.MaxLen).toString();
                slice_127_25 = slice_127_25.slice(this_format.MaxLen, slice_127_25.length);
              }
            } else {
              let thisLen = getLenType(this_format.LenType);
              if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + subField};
              
              if (this.Msg[subField] && this.Msg[subField].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + subField};
              if (thisLen === 0) {
                throw {error: 'field ' + subField + ' format not implemented'};
              } else {
                //check length of iso field
                let len = slice_127_25.slice(0, thisLen).toString();
                slice_127_25 = slice_127_25.slice(thisLen, slice_127_25.length);
                isoJSON[subField] = slice_127_25.slice(0, Number(len)).toString();
                slice_127_25 = slice_127_25.slice(Number(len), slice_127_25.length);
              }
            }
          } else {
            return {error: 'field ' + subField + ' format not implemented'};
          }
        }
      }

      return {json: isoJSON, remSlice: slice_127_25};
    }

  }

  unpack_127_1_63(slice_127, isoJSON) {
    let len = slice_127.slice(0, 6);
    slice_127 = slice_127.slice(6, slice_127.length);
    let bitmap = getHex(slice_127.slice(0, 8).toString('hex')).split('').map(Number);
    slice_127 = slice_127.slice(8, slice_127.length);
    for (let i = 0; i < 40; i++) {
      if (bitmap[i] === 1) {
        let subField = '127.' + (i + 1);
        let this_format = this.formats[subField] || formats[subField];
        if (subField === '127.25') {
          let get127_25Exts = this.unpack_127_25_1_63(slice_127, isoJSON);
          if (get127_25Exts.error) {
            return get127_25Exts;
          } else {
            isoJSON = get127_25Exts.json;
            slice_127 = get127_25Exts.remSlice;
            continue;
          }
        }
        if (this_format) {
          if (this_format.LenType === 'fixed') {
            if (formats[subField].ContentType === 'b') {
              isoJSON[subField] = slice_127.slice(0, this_format.MaxLen / 2).toString('hex');
              slice_127 = slice_127.slice(this_format.MaxLen / 2, slice_127.length);
            } else {
              isoJSON[subField] = slice_127.slice(0, this_format.MaxLen).toString();
              slice_127 = slice_127.slice(this_format.MaxLen, slice_127.length);
            }
          } else {
            let thisLen = getLenType(this_format.LenType);
            if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + subField};
            
            if (this.Msg[subField] && this.Msg[subField].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + subField};
            if (thisLen === 0) {
              throw {error: 'field ' + subField + ' format not implemented'};
            } else {
              //check length of iso field
              let len = slice_127.slice(0, thisLen).toString();
              slice_127 = slice_127.slice(thisLen, slice_127.length);
              isoJSON[subField] = slice_127.slice(0, Number(len)).toString();
              slice_127 = slice_127.slice(Number(len), slice_127.length);
            }
          }
        } else {
          return {error: 'field' + subField + ' format not implemented'};
        }
      }
    }

    return {json: isoJSON, remSlice: slice_127};
  }

  hasSecondaryBitmap (primaryBitmapBuffer, config){
    const bitmap = getHex(primaryBitmapBuffer.toString(config.bitmapEncoding || 'hex')).split('').map(Number);
    return bitmap[0] === 1;
  }

  // **tested****
  unpack_127(incoming, isoJSON, config) {
    if (Buffer.isBuffer(incoming)) {
      let mti = incoming.slice(0, 4).toString();
      isoJSON['0'] = mti;

      if (!this._checkMTI(mti)) {
        return {error: 'failed to unpack at get mti'};
      }

      let bitmapEnd;

      // Does data contain a secondary bitmap?
      const secondaryBitmap = this.hasSecondaryBitmap(incoming.slice(4, 8), config);
      if (secondaryBitmap === false) bitmapEnd = 12;
      else bitmapEnd = 20;

      if (config.bitmapEncoding==='utf8') bitmapEnd = 36;


      const bitmap = getHex(incoming.slice(4, bitmapEnd).toString(config.bitmapEncoding || 'hex')).split('').map(Number);

      let thisBuff = incoming.slice(bitmapEnd, incoming.byteLength);
      for (let i = 1; i < bitmap.length; i++) {

        if (bitmap[i] === 1) {
          //format defined
          let field = i + 1;
          let this_format = this.formats[field] || formats[field];
          if (field === 127) {
            let get127Exts = this.unpack_127_1_63(thisBuff, isoJSON);
            if (get127Exts.error) {
              return get127Exts;
            } else {
              isoJSON = get127Exts.json;
              thisBuff = get127Exts.remSlice;
              continue;
            }
          }
          if (this_format) {
            if (this_format.LenType === 'fixed') {
              if (this_format.ContentType === 'b') {
                isoJSON[field] = thisBuff.slice(0, this_format.MaxLen / 2).toString('hex');
                thisBuff = thisBuff.slice(this_format.MaxLen / 2, thisBuff.byteLength);
              } else {
                isoJSON[field] = thisBuff.slice(0, this_format.MaxLen).toString();
                thisBuff = thisBuff.slice(this_format.MaxLen, thisBuff.byteLength);
              }
            } else {
              let thisLen = getLenType(this_format.LenType);
              if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + field};
              
              if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + field};
              if (thisLen === 0) {
                throw {error: 'field ' + field + ' format not implemented'};
              } else {
                //check length of iso field
                let len = thisBuff.slice(0, thisLen).toString();
                thisBuff = thisBuff.slice(thisLen, thisBuff.byteLength);
                isoJSON[field] = thisBuff.slice(0, Number(len)).toString();
                thisBuff = thisBuff.slice(Number(len), thisBuff.byteLength);
              }
            }
          } else {
            return {error: 'field' + field + ' format not implemented'};
          }
        }
      }

      return {json: isoJSON, remSlice: thisBuff};
    } else {
      return {error: 'expecting buffer but got ' + typeof incoming};
    }

  }

  getIsoJSON(buffer, _config) {
    const config = _config || {};
    if (Buffer.isBuffer(buffer)) {
      let len1 = parseInt(buffer.slice(0, 1).toString('hex'), 16);
      let len2 = parseInt(buffer.slice(1, 2).toString('hex'), 16);
      let actualLen = (256 * len1) + len2;
      // No 2 byte length indicator
      if (config.lenHeader === false) buffer = buffer.slice(0, buffer.byteLength);
      // Consider 2 byte length indicator
      else buffer = buffer.slice(2, buffer.byteLength);
      let iso = this.unpack_127(buffer, {}, config);
      if (iso.error) {
        return iso;
      } else {
        return iso.json;
      }
    } else {
      return {error: 'expecting buffer but got ' + typeof buffer};
    }

  }

  assemble127_25_extensions() {
    let buff = Buffer.alloc(16, this.Msg['127.25.1']);
    let bitmaps_127 = this.assembleBitMap_127_125();
    for (let i = 1; i < 40; i++) {
      let field = '127.25.' + (Number(i) + 1);
      let this_format = this.formats[field] || formats[field];
      if (bitmaps_127[i] === 1) {
        if (field === '127.25.1') {
          continue;
        }
        if (!this.Msg[field]) {
          return {error: 'Field ' + field + ' in bitmap but not in json'};
        }
        if (this_format) {
          if (this_format.LenType === 'fixed') {
            if (this_format.ContentType === 'b') {
              if (this_format.MaxLen === this.Msg[field].length) {
                let size = this_format.MaxLen / 2;
                let thisBuff = Buffer.alloc(size, this.Msg[field], 'hex');
                buff = Buffer.concat([buff, thisBuff]);
              } else {
                return {error: 'invalid length of data on field ' + field};
              }
            } else {
              if (this_format.MaxLen === this.Msg[field].length) {
                let thisBuff = Buffer.alloc(this.Msg[field].length, this.Msg[field]);
                buff = Buffer.concat([buff, thisBuff]);
              } else {
                return {error: 'invalid length of data on field ' + field};
              }
            }
          } else {
            let thisLen = getLenType(this_format.LenType);
            if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + field};
            
            if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + field};
            if (thisLen === 0) {
              return {error: 'field ' + field + ' has no field implementation'};
            } else {
              let actualLength = this.Msg[field].length;
              let padCount = thisLen - actualLength.toString().length;
              let lenIndicator = actualLength.toString();
              for (let i = 0; i < padCount; i++) {
                lenIndicator = 0 + lenIndicator;
              }
              let thisBuff = Buffer.alloc(this.Msg[field].length+lenIndicator.length, lenIndicator + this.Msg[field]);
              buff = Buffer.concat([buff, thisBuff]);
            }
          }
        } else
          return {error: 'field ' + field + ' has invalid data'};

      }
    }

    let padCount = getLenType(formats['127.25'].LenType);
    let actualLen = buff.byteLength.toString();
    let x = padCount - actualLen.length;
    for (let i = 0; i < x; i++)
      actualLen = '0' + actualLen;

    let lenBuff = Buffer.alloc(actualLen.length, actualLen);
    return Buffer.concat([lenBuff, buff]);
  }

  assemble127_extensions() {
    let mtiCheck = this.checkMTI();
    let validate = this.validateMessage(this.Msg);
    let state = this.rebuildExtensions();
    //expects array of 0s & 1s and data-json object
    if (mtiCheck && validate && state) {
      let bitmaps_127 = this.assembleBitMap_127();
      let bmpsHex = this.getBitMapHex_127_ext();
      let buff = Buffer.alloc(8, bmpsHex, 'hex');
      for (let i = 0; i < bitmaps_127.length; i++) {
        let field = '127.' + (Number(i) + 1);
        if (bitmaps_127[i] === 1) {
          if (field === '127.25') {
            let _25_buff = this.assemble127_25_extensions();
            if (!_25_buff.error) {
              if (_25_buff.byteLength > 12) {
                buff = Buffer.concat([buff, _25_buff]);
                continue;
              } else {
                continue;
              }
            }
          }

          if (!this.Msg[field]) {
            return {error: 'Field ' + field + ' in bitmap but not in json'};
          }
          let this_format = this.formats[field] || formats[field];
          if (this_format) {
            let state = types(this_format, this.Msg[field], field);
            if (state.error) {
              return state;
            }
            if (this_format.LenType === 'fixed') {
              if (formats[field].ContentType === 'b') {
                if (this_format.MaxLen === this.Msg[field].length) {
                  let size = this_format.MaxLen / 2;
                  let thisBuff = Buffer.alloc(size, this.Msg[field], 'hex');
                  buff = Buffer.concat([buff, thisBuff]);
                } else {
                  return {error: 'invalid length of data on field ' + field};
                }
              } else {
                if (this_format.MaxLen === this.Msg[field].length) {
                  let thisBuff = Buffer.alloc(this.Msg[field].length, this.Msg[field]);
                  buff = Buffer.concat([buff, thisBuff]);
                } else {
                  return {error: 'invalid length of data on field ' + field};
                }
              }
            } else {
              let thisLen = getLenType(this_format.LenType);
              if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + field};
              
              if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + field};
              if (thisLen === 0) {
                return {error: 'field' + field + ' has no field implementation'};

              } else {
                let actualLength = this.Msg[field].length;
                let padCount = thisLen - actualLength.toString().length;
                let lenIndicator = actualLength.toString();
                for (let i = 0; i < padCount; i++)
                  lenIndicator = 0 + lenIndicator;

                let thisBuff = Buffer.alloc(this.Msg[field].length+lenIndicator.length, lenIndicator + this.Msg[field]);
                buff = Buffer.concat([buff, thisBuff]);
              }
            }
          } else
            return {error: 'field ' + field + ' not implemented'};
        }
      }

      let padCount = getLenType(formats['127'].LenType);
      let actualLen = buff.byteLength.toString();
      let x = padCount - actualLen.length;
      for (let i = 0; i < x; i++)
        actualLen = '0' + actualLen;

      let bitmapBuff = buff.slice(0, 8);
      let lenBuff = Buffer.alloc(actualLen.length, actualLen);
      let dataBuff = buff.slice(8, buff.byteLength);
      return Buffer.concat([lenBuff, bitmapBuff, dataBuff]);
    } else
      return {error: 'Invalid Message in 127 extensions'};
  }

  buildBitmapBuffer(bitmap, type) {
    if (type === 'ascii')
      return Buffer.alloc(32, bitmap.toUpperCase());
    else
      return Buffer.alloc(16, bitmap, 'hex');
  }

  assemble0_127_Fields() {
    let bitMapCheck = this.getBitMapHex();
    let state = this.assembleBitMap();
    let validDate = validateFields(this.Msg, this.formats);
    let specialValidate = validateSpecialFields(this.Msg, this.formats);
    let state2 = this.rebuildExtensions();
    let mti = this.getMti();
    //expects array of 0s & 1s and data-json object
    if (!state.error && !validDate.error && !specialValidate.error && !bitMapCheck.error && !mti.error) {
      let mtiBuffer = Buffer.alloc(4, mti);

      let buff;
      if (formats['1'].ContentType === 'an')
        buff = this.buildBitmapBuffer(bitMapCheck, 'ascii');
      else
        buff = this.buildBitmapBuffer(bitMapCheck, 'hex');

      buff = Buffer.concat([mtiBuffer, buff]);

      let counter = 0;
      for (let i = 1; i < this.bitmaps.length; i++) {
        counter++;
        let field = i + 1;
        if (this.bitmaps[i] === 1) {
          //present
          if (field === 127) {
            let _127_exetnsions = this.assemble127_extensions();
            if (!_127_exetnsions.error) {
              if (_127_exetnsions.byteLength > 12) {
                buff = Buffer.concat([buff, _127_exetnsions]);
                continue;
              } else {
                continue;
              }
            } else {
              return _127_exetnsions;
            }
          }
          if (!this.Msg[field]) {
            return {error: 'Field ' + field + ' in bitmap but not in json'};
          }
          let this_format = this.formats[field] || formats[field];
          let state = types(this_format, this.Msg[field], field);
          if (state.error) {
            return state;
          }
          if (this_format) {
            if (this_format.LenType === 'fixed') {
              if (this_format.ContentType === 'b') {
                if (this_format.MaxLen === this.Msg[field].length) {
                  let size = this_format.MaxLen / 2;
                  let thisBuff = Buffer.alloc(size, this.Msg[field], 'hex');
                  buff = Buffer.concat([buff, thisBuff]);
                } else {
                  return {error: 'invalid length of data on field ' + field};
                }
              } else {
                if (this_format.MaxLen === this.Msg[field].length) {
                  let thisBuff = Buffer.alloc(this.Msg[field].length, this.Msg[field]);
                  buff = Buffer.concat([buff, thisBuff]);
                } else {
                  return {error: 'invalid length of data on field ' + field};
                }
              }
            } else {
              let thisLen = getLenType(this_format.LenType);
              if (!this_format.MaxLen) return {error: 'max length not implemented for ' + this_format.LenType + field};
              
              if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) return {error: 'invalid length of data on field ' + field};
              if (thisLen === 0) {
                return {error: 'field' + field + ' has no field implementation'};
              } else {
                let actualLength = this.Msg[field].length;
                let padCount = thisLen - actualLength.toString().length;
                let lenIndicator = actualLength.toString();
                for (let i = 0; i < padCount; i++) {
                  lenIndicator = 0 + lenIndicator;
                }
                let thisBuff = Buffer.alloc(this.Msg[field].length+lenIndicator.length, lenIndicator + this.Msg[field]);
                buff = Buffer.concat([buff, thisBuff]);
              }
            }
          } else {
            return {error: 'field ' + field + ' has invalid data'};
          }

        }
      }

      return Buffer.concat([buff]);
    } else {
      return state;
    }

  }

  getTCPHeaderBuffer(indicator) {
    let integer = Number(indicator);
    return Buffer.alloc(1, integer, 'hex');
  }

  getBufferMessage() {
    let _0_127_Buffer = this.assemble0_127_Fields();
    if (_0_127_Buffer.error) {
      return _0_127_Buffer;
    } else {
      let len_0_127_1 = this.getTCPHeaderBuffer(parseInt((Number(_0_127_Buffer.byteLength) / 256), 10));
      let len_0_127_2 = this.getTCPHeaderBuffer((parseInt((Number(_0_127_Buffer.byteLength) % 256), 10)));
      return Buffer.concat([len_0_127_1, len_0_127_2, _0_127_Buffer]);
    }
  }

  getRawMessage() {
    return this.assemble0_127_Fields();
  }

  //XML FORMAT
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
    //field_127_002
    //field_127_025_024
    if (field.length > 12 && field.length < 14) {
      return '127' + '.' + Number(field.split('field_127_')[1]);
    } else if (field.length > 14) {
      return '127' + '.' + Number(field.split('_')[2]) + '.' + Number(field.split('_')[3]);
    } else {
      return Number(field.split('field_')[1]);
    }

  }

  addField(number, data) {
    if (!this.Msg)
      return {error: 'message undefined'};
    let this_format = this.formats[number] || formats[number];
    if (!this_format)
      return {error: 'field ' + number + ' not implemented'};

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

  // from xml
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
        // prepare MTI
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
      } else {
        return {error: 'could not parse xml'};
      }


    } else {
      return {error: 'xml is not properly encoded'};
    }

  }

  // to xml
  getXMLString() {
    const header = '<?xml version="1.0" encoding="UTF-8"?>';

    if (!this.MsgType || !msgTypes(this.MsgType)) {
      return {error: 'mti undefined or invalid'};
    } else {
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
