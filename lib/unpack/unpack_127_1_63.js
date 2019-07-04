const T = require('../tools');
const formats = require('../formats');

/**
 * Unpack fields 127.0-63 from an ISO 8583 encoded string into a JSON
 * @method unpack_127_1_63
 * @memberof module:Message-UnPackage
 */
module.exports = function (slice_127, isoJSON) {
  let len = slice_127.slice(0, 6);
  slice_127 = slice_127.slice(6, slice_127.length);
  let bitmap = T.getHex(slice_127.slice(0, 8).toString('hex'))
    .split('')
    .map(Number);
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
            isoJSON[subField] = slice_127
              .slice(0, this_format.MaxLen / 2)
              .toString('hex');
            slice_127 = slice_127.slice(
              this_format.MaxLen / 2,
              slice_127.length
            );
          } else {
            isoJSON[subField] = slice_127
              .slice(0, this_format.MaxLen)
              .toString();
            slice_127 = slice_127.slice(this_format.MaxLen, slice_127.length);
          }
        } else {
          let thisLen = T.getLenType(this_format.LenType);
          if (!this_format.MaxLen)
            return T.toErrorObject(['max length not implemented for ', this_format.LenType, subField]);
          if (this.Msg[subField] && this.Msg[subField].length > this_format.MaxLen)
            return T.toErrorObject(['invalid length of data on field ', subField]);
          if (thisLen === 0) {
            throw T.toErrorObject(['field ', subField, ' format not implemented']);
          } else {
            let len = slice_127.slice(0, thisLen).toString();
            slice_127 = slice_127.slice(thisLen, slice_127.length);
            isoJSON[subField] = slice_127.slice(0, Number(len)).toString();
            slice_127 = slice_127.slice(Number(len), slice_127.length);
          }
        }
      } else return T.toErrorObject(['field', subField, ' format not implemented']);
    }
  }

  return {
    json: isoJSON,
    remSlice: slice_127
  };
};