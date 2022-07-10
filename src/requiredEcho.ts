import { RequiredFieldSchemaT } from './t';
import { ISO8583JSONMessageType } from './ISO8583Base';
const helpers = require('./helpers');
export default function (json: any, iso_send: ISO8583JSONMessageType, iso_answer: ISO8583JSONMessageType) {
  const message_code = iso_send[0];
  const processing_code = iso_send[3];
  const key = 'required_echo';

  const required_fields = helpers.findRequiredFields(json, key, processing_code, message_code);

  for (let i = 0; i < required_fields.length; i++) {
    const field = required_fields[i];

    if (iso_send[field] !== iso_answer[field]) {
      return false;
    }
  }

  return true;
};
