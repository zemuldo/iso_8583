import test from 'ava';
import helpers from '../lib/helpers.js';

test('should return required_fields inside array on processing code 000000', t => {

  const json = [
    {
      "processing_code": "000000",
      "required_fields": [0, 2, 4]
    }
  ]
  const processing_code = '000000'
  const key = 'required_fields'
  const result = [0, 2, 4]

  t.deepEqual( helpers.findRequiredFields({ json, key, processing_code }), result );

});

test('should return required_fields inside array on processing code 000000 (2)', t => {

  const json = [
    {
      "processing_code": "000000",
      "required_fields": [0, 2, 5]
    }
  ]
  const processing_code = '000000'
  const key = 'required_fields'
  const result = [0, 2, 5]

  t.deepEqual( helpers.findRequiredFields({ json, key, processing_code }), result );

});

test('should return required_fields inside array on processing code 000001', t => {

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

  t.deepEqual( helpers.findRequiredFields({ json, key, processing_code }), result );

});

test('should return required_fields inside array on processing code 888888 and message_code 0110', t => {

  const json = [
    {
      "processing_code": "888888",
      "required_fields": [
        {
          "0000": [1, 2],
          "0110": [3, 4]
        }
      ]
    }
  ]
  const processing_code = '888888'
  const key = 'required_fields'
  const message_code = '0110'

  t.deepEqual( helpers.findRequiredFields({ json, key, processing_code, message_code }), [3, 4] );

});



test('should return [0] for match two arrays: [0] [1]', t => {

  const required_fields = [0]
  const iso_fields = [1]

  t.deepEqual( helpers.matchValues({ required_fields, iso_fields }), [0] );

});


test('should return [] for match two arrays: [0] [0]', t => {

  const required_fields = [0]
  const iso_fields = [0]

  t.deepEqual( helpers.matchValues({ required_fields, iso_fields }), [] );

});


test('should return [15, 18] for match two arrays: [0, 10, 15, 18, 20] [0, 10, 20, 30]', t => {

  const required_fields = [0, 10, 15, 18, 20]
  const iso_fields = [0, 10, 20, 30]

  t.deepEqual( helpers.matchValues({ required_fields, iso_fields }), [15, 18] );

});


test('should return [15, 18, 45, 46, 47] for match two arrays: [0, 10, 15, 18, 20, 45, 46, 47] [0, 10, 20, 30]', t => {

  const required_fields = [0, 10, 15, 18, 20, 45, 46, 47]
  const iso_fields = [0, 10, 20, 30]

  t.deepEqual( helpers.matchValues({ required_fields, iso_fields }), [15, 18, 45, 46, 47] );

});