/**
 * Module for validating field data types.
 * @module DataTypes
 */

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
function checkDataType (format, data, field) {
  const regex = {
    'a': /[A-Z]/i ,
    'n': /[0-9]/i ,
    'b': /[0-9ABCDEF]/i ,
    'p': /[*#]/i ,
    'an': /[0-9a-z]/i ,
    'ans': /[0-9a-z-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i ,
    'ns': /[0-9-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i ,
    's': /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i ,
    'anp': /[0-9a-z*#\x20]/i ,
    'x+n': /[0-9]/i ,
  };

  const type = format.ContentType;

  switch (type){
    case 'a':
    case 'n':
    case 'b':
    case 'an':
    case 'ans':
    case 'ns':
    case 's':
    case 'p':
    case 'anp':
      for (let i = 0; i < data.length; i++)
        if (!data[i].match(regex[type]))
          return { error: 'while processing field ' + field + ': provided data is not of type \'' + type + '\''};
      return true;

    case 'x+n':
    {
      let state = false;
      if (data[0].match(/[c,d]/i)){
        for (let i = 2; i < data.length; i++){
          if (data[i].length === 1 && data[i].match(regex[type]))
            state = true;
          else
            return { error: 'while processing field ' + field + ': provided data is not of type \'' + type + '\''};
        }
      } else 
        return { error: 'while processing field ' + field + ': provided data is not of type \'' + type + '\''};

      return true;
    }

    case 'z':
      return true;

    default:
      return {error: 'type ' + type + ' is not implemented on field ' + field};
  }
}

module.exports = checkDataType;