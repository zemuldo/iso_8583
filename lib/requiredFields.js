const helpers = require('./helpers');

module.exports = function(data, required_fields_file) {

  const json = require(required_fields_file || './mock/required-fields.json');
  const message_code = data[0];
  const processing_code = data[3];
  const key = 'required_fields';

  const required_fields = helpers.findRequiredFields({json, key, processing_code, message_code});
  const iso_fields = helpers.extractBits(data);
  const missing_fields = helpers.matchValues({iso_fields, required_fields});

  if (missing_fields.length > 0) {
    return {error: 'Processing code: ' + processing_code + ' - Missing required fields: ' + missing_fields};
  } 

  return true;

};