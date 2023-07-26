// @ts-nocheck
import * as Types from '../t';
import T from '../tools';
import formats from '../formats';

/**
 * Unpack fields 0-127 from an ISO 8583 encoded string into a JSON
 * @method unpack_0_127
 * @memberof module:Message-UnPackage
 */
export default function (incoming: Buffer, isoJSON: Types.KeyValueStringT, config: Types.KeyValueT) {
  if (Buffer.isBuffer(incoming)) {
    const mti = incoming.slice(0, 4).toString();
    isoJSON['0'] = mti;

    if (!this._checkMTI(mti)) {
      return T.toErrorObject('failed to unpack at get mti');
    }

    let bitmapEnd;

    // Does data contain a secondary bitmap?
    const secondaryBitmap = this.hasSecondaryBitmap(incoming.slice(4, 8), config);
    if (secondaryBitmap === false) bitmapEnd = 12;
    else bitmapEnd = 20;

    if (config.bitmapEncoding === 'utf8') bitmapEnd = (bitmapEnd - 4) * 2 + 4;

    const slice = incoming.slice(4, bitmapEnd).toString(config.bitmapEncoding || 'hex');
    const bitmap = T.getHex(slice).split('').map(Number);

    let thisBuff = incoming.slice(bitmapEnd, incoming.byteLength);
    for (let field = 2; field <= bitmap.length; field++) {
      if (bitmap[field - 1] === 1) {
        // format defined
        const this_format = this.formats[field] || formats[field];
        if (!config.custom127Encoding && field === 127) {
          const get127Exts = this.unpack_127_1_63(thisBuff, isoJSON);
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
            const thisLen = T.getLenType(this_format.LenType);
            if (!this_format.MaxLen)
              return T.toErrorObject(['max length not implemented for ', this_format.LenType, field]);
            if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) {
              return T.toInvalidLengthErrorObject(field, this.Msg[field].length);
            }
            if (thisLen === 0) {
              return T.toErrorObject(['field ', field, ' format not implemented']);
            } else {
              if (config.custom127Encoding && field === 127) {
                isoJSON[field] = thisBuff.subarray(0).toString(config.custom127Encoding);
              } else {
                const lenBuff: Buffer = thisBuff.subarray(0, thisLen);
                const lenString: string = lenBuff.toString();
                let len: number = Number(lenString);
                if (isNaN(len)) { // with certain lengths you get NAN and readUIntBE seems to work in those cases, not sure why...
                  len = lenBuff.readUIntBE(0, thisLen);
                }
                thisBuff = thisBuff.subarray(thisLen, thisBuff.byteLength);
                isoJSON[field] = thisBuff.subarray(0, len).toString(config.bitmapEncoding || 'hex');
                thisBuff = thisBuff.subarray(Number(len), thisBuff.byteLength);
              }
            }
          }
        } else return T.toErrorObject(['field ', field, ' format not implemented']);
      }
    }

    return isoJSON;
  } else return T.toErrorObject(['expecting buffer but got ', typeof incoming]);
};
