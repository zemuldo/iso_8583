import { CustomFormatT } from './t';
import { DefaultError } from './errors';
/**
  * @method
  * @param {object} format The field format configuration
  * @param {string} data String of data on a field of ISO 8583 message
  * @param {string} field an ISO 8583 field
  * @returns {boolean} true
  * @returns {object} {error: 'some error'}
  * @example checkDataType({
    ContentType: 'n',
    Label: 'Primary account number (PAN)',
    LenType: 'llvar',
    MaxLen: 19,
    MinLen: 1
  }, "4462881486386377", 3) -> true
  * @example checkDataType({
    ContentType: 'n',
    Label: 'Primary account number (PAN)',
    LenType: 'llvar',
    MaxLen: 19,
    MinLen: 1
  }, "446288148638637X", 3) -> { error: 'while processing field 3 : provided data is not of type n'}
  */
export default function checkDataType(format: CustomFormatT, _data: string | null, field: string | number): boolean | DefaultError;
