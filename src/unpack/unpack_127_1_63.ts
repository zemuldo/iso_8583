// @ts-nocheck
import T from '../tools';
import formats from '../formats';

function unpackKeyValueStringField(self, slice_127, isoJSON) {
  const length = parseInt(slice_127.slice(0, 6).toString(), 10);
  slice_127 = slice_127.slice(6, slice_127.length);
  if (!self.embededProperties.exclude127Bitmap) {
    slice_127 = slice_127.slice(8, slice_127.length);
  } 

  const dataString = slice_127.slice(0, length).toString();
  slice_127 = slice_127.slice(length, slice_127.length);

  const data = dataString?.split('; ');
  if (data.length < 2) {
    return {
      json: isoJSON,
      remSlice: slice_127,
    };
  }
  // @ts-ignore
  data.reduce((_ignored, s) => {
    const kv = s?.split('=');

    const k = kv[0];

    const v = kv.slice(1, kv.length).join('=');
    // @ts-ignore
    isoJSON[`127.${k}`] = v;
  }, {});
  return {
    json: isoJSON,
    remSlice: slice_127,
  };
}
/**
 * Unpack fields 127.0-63 from an ISO 8583 encoded string into a JSON
 * @method unpack_127_1_63
 * @memberof module:Message-UnPackage
 */
export default function (slice_127, isoJSON) {
   if (this.embededProperties.field_127_25_key_value_string) {
     return unpackKeyValueStringField(this, slice_127, isoJSON);
   }
  slice_127 = slice_127.slice(6, slice_127.length);
  //const bitmap = T.getHex(slice_127.slice(0, 8).toString('hex')).split('').map(Number);
  let bitmap = "";
  if(this.formats['127.1'] != undefined)
  { 
    if (this.formats['127.1'].ContentType === 'an')
    {
      bitmap = T.getHex(slice_127.slice(0, 16).toString('ascii'))
      .split('')
      .map(Number);
      slice_127 = slice_127.slice(16, slice_127.length);
    }
  }
  else
  {
    bitmap = T.getHex(slice_127.slice(0, 8).toString('hex'))
    .split('')
    .map(Number);
    slice_127 = slice_127.slice(8, slice_127.length);
  }
 
  for (let i = 0; i < 40; i++) {
    if (bitmap[i] === 1) {
      const subField = '127.' + (i + 1);
      const this_format = this.formats[subField] || formats[subField];
      if (subField === '127.25') {
        const get127_25Exts = this.unpack_127_25_1_63(slice_127, isoJSON);
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
          const thisLen = T.getLenType(this_format.LenType);
          if (!this_format.MaxLen)
            return T.toErrorObject(['max length not implemented for ', this_format.LenType, subField]);
          if (this.Msg[subField] && this.Msg[subField].length > this_format.MaxLen)
            return T.toInvalidLengthErrorObject(subField, this.Msg[field].length);
          if (thisLen === 0) {
            throw T.toErrorObject(['field ', subField, ' format not implemented']);
          } else {
            const len = slice_127.slice(0, thisLen).toString();
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
    remSlice: slice_127,
  };
};
