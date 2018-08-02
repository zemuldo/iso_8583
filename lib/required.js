module.exports = function(data) {

  const required_fields_by_processing_code = [
    {
      processing_code: '000000',
      required_fields: [0, 1, 2, 4]
    },
    {
      processing_code: '000009',
      required_fields: [0]
    }
  ];

  const processing_code = data[3];
  const required_fields = findRequiredfields(required_fields_by_processing_code, processing_code);

  if (!required_fields) return 'required is not implemented on processing code: ' + processing_code;

  const missing_fields = filterMissingfields(data, required_fields);

  function findRequiredfields(arr, value) {
    for (let i=0; i < arr.length; i++) {
      if (arr[i]['processing_code'] === value) {
        return arr[i].required_fields;
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

  if (missing_fields) {
    return {error: 'Processing code: ' + processing_code + ' - Missing required fields: ' + missing_fields};
  } 

  return true;

};
