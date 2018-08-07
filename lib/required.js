const required_fields_by_processing_code = require("../config/required-fields.json");

module.exports = function(data) {

  
  const processing_code = data[3];
  const message_code = data[0];
  const required_fields = findRequiredfields(required_fields_by_processing_code, processing_code, message_code);

  if (!required_fields) return 'required is not implemented on processing code: ' + processing_code;

  const missing_fields = filterMissingfields(data, required_fields);

  function findRequiredfields(arr, processing_code, message_code) {
    for (let i=0; i < arr.length; i++) {
      if (arr[i]['processing_code'] === processing_code) {
        let required_fields = arr[i].required_fields;
        if (typeof required_fields[0] === 'object') {
          for (let key in required_fields[0]) {
            if (message_code === key) {
              required_fields = arr[i].required_fields[0][key]
            }
          }
        }
        return required_fields;
      }
    }
  }

  function filterMissingfields(data, missing_fields) {
    missing_fields.forEach(function(field) {
      for (let key in data) {
        if (field === parseInt(key, 10)) {
          missing_fields = missing_fields.filter(e => e !== field);
        }
      }
    });
    return missing_fields;
  }

  if (missing_fields.length > 0) {
    return {error: 'Processing code: ' + processing_code + ' - Missing required fields: ' + missing_fields};
  } 

  return true;

};
