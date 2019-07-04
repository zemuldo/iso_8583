const T = require('../tools');
const formats = require('../formats');
const types = require('../types');

/**
 * Assemble fields 127.0-63 into ISO 8583 encoded string
 * @method assemble0_127_extensions
 * @memberof module:Message-Package
 */
module.exports = function () {
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
            return {
              error: 'Field ' + field + ' in bitmap but not in json'
            };
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
                  return {
                    error: 'invalid length of data on field ' + field
                  };
                }
              } else {
                if (this_format.MaxLen === this.Msg[field].length) {
                  let thisBuff = Buffer.alloc(
                    this.Msg[field].length,
                    this.Msg[field]
                  );
                  buff = Buffer.concat([buff, thisBuff]);
                } else {
                  return {
                    error: 'invalid length of data on field ' + field
                  };
                }
              }
            } else {
              let thisLen = T.getLenType(this_format.LenType);
              if (!this_format.MaxLen)
                return {
                  error: 'max length not implemented for ' +
                    this_format.LenType +
                    field
                };

              if (
                this.Msg[field] &&
                this.Msg[field].length > this_format.MaxLen
              )
                return {
                  error: 'invalid length of data on field ' + field
                };
              if (thisLen === 0) {
                return {
                  error: 'field' + field + ' has no field implementation'
                };
              } else {
                let actualLength = this.Msg[field].length;
                let padCount = thisLen - actualLength.toString().length;
                let lenIndicator = actualLength.toString();
                for (let i = 0; i < padCount; i++)
                  lenIndicator = 0 + lenIndicator;

                let thisBuff = Buffer.alloc(
                  this.Msg[field].length + lenIndicator.length,
                  lenIndicator + this.Msg[field]
                );
                buff = Buffer.concat([buff, thisBuff]);
              }
            }
          } else
            return {
              error: 'field ' + field + ' not implemented'
            };
        }
      }

      let padCount = T.getLenType(formats['127'].LenType);
      let actualLen = buff.byteLength.toString();
      let x = padCount - actualLen.length;
      for (let i = 0; i < x; i++) actualLen = '0' + actualLen;

      let bitmapBuff = buff.slice(0, 8);
      let lenBuff = Buffer.alloc(actualLen.length, actualLen);
      let dataBuff = buff.slice(8, buff.byteLength);
      return Buffer.concat([lenBuff, bitmapBuff, dataBuff]);
    } else
      return T.toErrorObject('Invalid Message in 127 extensions');
  }