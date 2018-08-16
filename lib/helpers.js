const moment = require('moment');

let util = {};

util.getPostillionLength = function(buf) {
  let div = buf[0];
  let rem = buf[1];

  return (256 * div) + rem;
};

util.extractPostillionData = function (sent) {
  // the data is two bytes shorter than what is sent
  let buf = new Buffer(sent.length - 2);

  // the first to bytes represents the length, the rest is data
  for (let i = 2; i < sent.length; i++) {
    buf[i - 2] = sent[i];
  }

  return buf;
};

util.attachPostillionLength = function (_data) {
  let data = null;

  // make sure _data is a buffer, if it's a string convert
  if (!Buffer.isBuffer(_data)) {
    if (typeof(_data) === 'string') {
      data = Buffer(_data);
    }
  } else {
    data = _data;
  }

  // data is represented by two bytes
  let length = new Buffer(2);
  length[0] = data.length / 256;
  length[1] = data.length % 256;

  return Buffer.concat([length, data]);
};

util.attachDiTimeStamps = function (obj) {
  if (!obj['7'] || !obj['12'] || !obj['13']){
    let time = moment(new Date());
    obj['7'] = time.format('MMDDhhmmss');
    obj['12'] = time.format('hhmmss');
    obj['13'] = time.format('MMDD');
  }
  return obj;
};

util.findRequiredFields = function({ json, key, processing_code, message_code }) {

  let requiredFields = []

  for ( let i = 0; i < json.length; i++ ) {
    if (json[i]['processing_code'] === processing_code) {

      requiredFields = json[i][key];

      if ( typeof requiredFields[0] === 'object' ) {
        for (let key in requiredFields[0]) {

          if ( key === message_code) {
            requiredFields = requiredFields[0][key];
          }

        }
      }

    }
  }

  return requiredFields;

}

util.matchValues = function({ required_fields, iso_fields }) {

  let missing_fields = required_fields;
  
  // Refactory to use .filter()
  for ( let b=0; b < required_fields.length; b++ ) {
    for ( let i=0; i < iso_fields.length; i++ ) {

      if ( required_fields[b] === iso_fields[i] ) {
        missing_fields.splice( b, 1 );
      }

    }
  }

  return missing_fields;
}

module.exports = util;
