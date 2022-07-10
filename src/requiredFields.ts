import { DefaultError } from './errors';
import { ISO8583JSONMessageType } from './ISO8583Base';
import { RequiredFieldSchemaT } from './t';
import * as helpers from './helpers';

// Breaking change: No dynmaic file import. Pass the config
export default function (data: ISO8583JSONMessageType, requiredFieldsConfig: RequiredFieldSchemaT | undefined) {
  
  const message_code = data[0];
  const processing_code = data[3];
  const key = 'required_fields';

  const required_fields = helpers.findRequiredFields(requiredFieldsConfig, key, processing_code, message_code);
  const iso_fields = helpers.extractBits(data);
  const missing_fields = helpers.matchValues(iso_fields, required_fields);
  
  if (missing_fields.length > 0) {
    return new DefaultError('Processing code: ' + processing_code + ' - Missing required fields: ' + missing_fields);
  }

  return true;
};
