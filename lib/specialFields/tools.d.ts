import { DefaultError } from './../errors';
import { ISO8583JSONMessageType } from './../ISO8583Base';
import * as Types from './../t';
export declare const validateSpecialFields: (msg: ISO8583JSONMessageType, customFormats: Types.CustomFormatsT) => true | DefaultError | undefined;
export declare const detectSpecial: (msg: ISO8583JSONMessageType) => boolean;
