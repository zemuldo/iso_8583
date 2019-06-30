const T = require('../tools');
const formats = require('../formats');

/**
 * Assemble fields 127.25.0-63 into ISO 8583 encoded string
 * @method assemble0_127_25_extensions
 * @memberof module:Message-Package
 */
module.exports = function () {
  let buff = Buffer.alloc(16, this.Msg['127.25.1']);
  let bitmaps_127 = this.assembleBitMap_127_25();
  for (let i = 1; i < 40; i++) {
    let field = '127.25.' + (Number(i) + 1);
    let this_format = this.formats[field] || formats[field];
    if (bitmaps_127[i] === 1) {
      if (field === '127.25.1') {
        continue;
      }
      if (!this.Msg[field]) {
        return T.toErrorObject(['Field ', field, ' in bitmap but not in json']);
      }
      if (this_format) {
        if (this_format.LenType === 'fixed') {
          if (this_format.ContentType === 'b') {
            if (this_format.MaxLen === this.Msg[field].length) {
              let size = this_format.MaxLen / 2;
              let thisBuff = Buffer.alloc(size, this.Msg[field], 'hex');
              buff = Buffer.concat([buff, thisBuff]);
            } else return T.toErrorObject(['invalid length of data on field ', field]);
          }
        } else {
          if (this_format.MaxLen === this.Msg[field].length) {
            let thisBuff = Buffer.alloc(
              this.Msg[field].length,
              this.Msg[field]
            );
            buff = Buffer.concat([buff, thisBuff]);
          } else return T.toErrorObject(['invalid length of data on field ', field]);
        }
      } else {
        let thisLen = T.getLenType(this_format.LenType);
        if (!this_format.MaxLen)
          return T.toErrorObject(['max length not implemented for ', this_format.LenType, field]);

        if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen)
          return {
            error: 'invalid length of data on field ' + field
          };
        if (thisLen === 0) {
          return {
            error: 'field ' + field + ' has no field implementation'
          };
        } else {
          let actualLength = this.Msg[field].length;
          let padCount = thisLen - actualLength.toString().length;
          let lenIndicator = actualLength.toString();
          for (let i = 0; i < padCount; i++) {
            lenIndicator = 0 + lenIndicator;
          }
          let thisBuff = Buffer.alloc(
            this.Msg[field].length + lenIndicator.length,
            lenIndicator + this.Msg[field]
          );
          buff = Buffer.concat([buff, thisBuff]);
        }
      }
    } else
      return {
        error: 'field ' + field + ' has invalid data'
      };
  }


  let padCount = T.getLenType(formats['127.25'].LenType);
  let actualLen = buff.byteLength.toString();
  let x = padCount - actualLen.length;
  for (let i = 0; i < x; i++) actualLen = '0' + actualLen;

  let lenBuff = Buffer.alloc(actualLen.length, actualLen);
  return Buffer.concat([lenBuff, buff]);
}