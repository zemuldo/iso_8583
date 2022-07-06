const helpers = require('./helpers');
module.exports = function({json, iso_send, iso_answer}) {

  const message_code = iso_send[0];
  const processing_code = iso_send[3];
  const key = 'required_echo';

  const required_fields = helpers.findRequiredFields({json, key, processing_code, message_code});

  for ( let i = 0; i < required_fields.length; i++ ) {

    const field = required_fields[i];

    if (iso_send[field] !== iso_answer[field]) {
      return false;
    }

  }
  
  return true;
};