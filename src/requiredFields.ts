import { DefaultError } from './errors';
import { ISO8583JSONMessageType } from './ISO8583Base';
import { RequiredFieldSchemaT } from './t';
import * as helpers from './helpers';

const defaultRequiredFieldsSchema: any = [
  {
    processing_code: '000000',
    required_fields: [0, 2, 4],
  },
  {
    processing_code: '000002',
    required_fields: [0],
  },
  {
    processing_code: '999999',
    required_fields: [
      {
        '0100': [3, 7],
        '0500': [3, 7, 11],
      },
    ],
  },
];

// Breaking change: No dynmaic file import. Pass the config
export default function (data: ISO8583JSONMessageType, requiredFieldsConfig: RequiredFieldSchemaT | null = defaultRequiredFieldsSchema) {
  const conf = requiredFieldsConfig || defaultRequiredFieldsSchema;
  
  const message_code = data[0];
  const processing_code = data[3];
  const key = 'required_fields';

  const required_fields = helpers.findRequiredFields(conf, key, processing_code, message_code);
  const iso_fields = helpers.extractBits(data);
  const missing_fields = helpers.matchValues(required_fields, iso_fields);
  
  if (missing_fields.length > 0) {
    return new DefaultError('Processing code: ' + processing_code + ' - Missing required fields: ' + missing_fields);
  }

  return true;
};
