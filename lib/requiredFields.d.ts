import { DefaultError } from './errors';
import { ISO8583JSONMessageType } from './ISO8583Base';
import { RequiredFieldSchemaT } from './t';
export default function (data: ISO8583JSONMessageType, requiredFieldsConfig?: RequiredFieldSchemaT | null): true | DefaultError;
