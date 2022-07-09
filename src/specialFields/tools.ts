import * as Types from './../t';
import formats from './formats';

export const validateSpecialFields = (msg: Types.KeyValueT, customFormats: Types.KeyValueStringT) => {
  let fields = Object.keys(msg);
  let i = 0;
  for (i; i < fields.length; i++) {
    // @ts-ignore
    // @ts-ignore
    if (formats[fields[i]] && !customFormats[fields[i]]) {
      return { error: `Special field ${fields[i]} has no custom formats` };
    }
  }
  if (i === fields.length) {
    return true;
  }
};
export const detectSpecial = (msg: Types.KeyValueStringT) => {
  let state = false;
  let fields = Object.keys(msg);
  let i = 0;
  for (i; i < fields.length; i++) {
    // @ts-ignore
    if (formats[fields[i]]) {
      return true;
    }
  }
  if (i === fields.length) {
    return state;
  }

  return state
};
