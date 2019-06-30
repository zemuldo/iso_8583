const T = require('../tools');
const formats = require('../formats');

/**
 * Unpack fields 127.25.0-127 from an ISO 8583 encoded string into a JSON
 * @method unpack_127_25_1_63
 * @memberof module:Message-UnPackage
 */
module.exports = function (slice_127_25, isoJSON) {
  if (slice_127_25.byteLength < 10) {
    return {
      json: isoJSON,
      remSlice: slice_127_25
    };
  } else {
    let len = slice_127_25.slice(0, 4);
    slice_127_25 = slice_127_25.slice(4, slice_127_25.length);
    let bitmap = T.getHex(slice_127_25.slice(0, 16).toString())
      .split('')
      .map(Number);
    slice_127_25 = slice_127_25.slice(16, slice_127_25.length);
    for (let i = 0; i < 34; i++) {
      if (bitmap[i] === 1) {
        let subField = '127.25.' + (i + 1);
        let this_format = this.formats[subField] || formats[subField];
        if (this_format) {
          if (this_format.LenType === 'fixed') {
            if (this_format.ContentType === 'b') {
              isoJSON[subField] = slice_127_25
                .slice(0, this_format.MaxLen / 2)
                .toString('hex');
              slice_127_25 = slice_127_25.slice(
                this_format.MaxLen / 2,
                slice_127_25.length
              );
            } else {
              isoJSON[subField] = slice_127_25
                .slice(0, this_format.MaxLen)
                .toString();
              slice_127_25 = slice_127_25.slice(
                this_format.MaxLen,
                slice_127_25.length
              );
            }
          } else {
            let thisLen = T.getLenType(this_format.LenType);
            if (!this_format.MaxLen)
              return T.toErrorObject(['max length not implemented for ', this_format.LenType], subField);
            if (this.Msg[subField] && this.Msg[subField].length > this_format.MaxLen)
              return T.toErrorObject(['invalid length of data on field ', subField]);
            if (thisLen === 0) {
              throw T.toErrorObject(['field ', subField, ' format not implemented']);
            } else {
              let len = slice_127_25.slice(0, thisLen).toString();
              slice_127_25 = slice_127_25.slice(thisLen, slice_127_25.length);
              isoJSON[subField] = slice_127_25
                .slice(0, Number(len))
                .toString();
              slice_127_25 = slice_127_25.slice(
                Number(len),
                slice_127_25.length
              );
            }
          }
        } else {
          return T.toErrorObject(['field ', subField, ' format not implemented']);
        }
      }
    }

    return {
      json: isoJSON,
      remSlice: slice_127_25
    };
  }
};