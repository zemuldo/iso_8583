import test from 'ava';
import helpers from '../lib/helpers.js';

test('should return', t => {

  const json = [
    {
      "processing_code": "000000",
      "required_fields": [0, 2, 4]
    }
  ]
  const processing_code = '000000'
  const key = 'required_fields'
  const result = [0, 2, 4]

  t.deepEqual(helpers.findFieldsByProcessCode({ json, key, processing_code }), result );

});

test('should return', t => {

  const json = [
    {
      "processing_code": "000000",
      "required_fields": [0, 2, 5]
    }
  ]
  const processing_code = '000000'
  const key = 'required_fields'
  const result = [0, 2, 5]

  t.deepEqual(helpers.findFieldsByProcessCode({ json, key, processing_code }), result);

});

test('should return', t => {

  const json = [
    {
      "processing_code": "000000",
      "required_fields": [0, 2, 5]
    },
    {
      "processing_code": "000001",
      "required_fields": [0, 2, 6]
    }
  ]
  const processing_code = '000001'
  const key = 'required_fields'
  const result = [0, 2, 6]

  t.deepEqual(helpers.findFieldsByProcessCode({ json, key, processing_code }), result);

});

