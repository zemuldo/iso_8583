import { DefaultError } from './../errors';
import { ISO8583JSONMessageType } from './../ISO8583Base';
import * as Types from './../t';
import formats from './formats';

export const validateSpecialFields = (msg: ISO8583JSONMessageType, customFormats: Types.CustomFormatT) => {
  const fields = Object.keys(msg);
  let i = 0;
  for (i; i < fields.length; i++) {
    // @ts-ignore
    // @ts-ignore
    if (formats[fields[i]] && !customFormats[fields[i]]) {
      return new DefaultError(`Special field ${fields[i]} has no custom formats`);
    }
  }
  if (i === fields.length) {
    return true;
  }
};
export const detectSpecial = (msg: ISO8583JSONMessageType) => {
  const state = false;
  const fields = Object.keys(msg);
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
