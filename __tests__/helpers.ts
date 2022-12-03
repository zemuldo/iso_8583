
import * as helpers from '../src/helpers';



// ********************************
// findRequiredFields()
// ********************************

test('should return required_fields inside array on processing code 000000, fields 0, 2, 4', () => {

  const json = [
    {
      'processing_code': '000000',
      'required_fields': [0, 2, 4]
    }
  ];
  const processing_code = '000000';
  const key = 'required_fields';
  const expected = [0, 2, 4];

  const actual = helpers.findRequiredFields(json, key, processing_code, null);

  expect(actual).toStrictEqual(expected);

});

test('should return required_fields inside array on processing code 000000 , fields 0, 2, 5', () => {

  const json = [
    {
      'processing_code': '000000',
      'required_fields': [0, 2, 5]
    }
  ];
  const processing_code = '000000';
  const key = 'required_fields';
 const expected = [0, 2, 5];

  const actual = helpers.findRequiredFields(json, key, processing_code, null);
  expect(actual).toStrictEqual(expected);

});

test('should return required_fields inside array on processing code 000001', () => {

  const json = [
    {
      'processing_code': '000000',
      'required_fields': [0, 2, 5]
    },
    {
      'processing_code': '000001',
      'required_fields': [0, 2, 6]
    }
  ];
  const processing_code = '000001';
  const key = 'required_fields';
 const expected = [0, 2, 6];

 const actual = helpers.findRequiredFields(json, key, processing_code, null);
 expect(actual).toStrictEqual(expected);

});


test('should return required_fields inside array on processing code 888889 and message_code 9999', () => {

  const json = [
    {
      'processing_code': '888889',
      'required_fields': [
        {
          '0000': [1, 2],
          '0110': [3, 4],
          '9999': [3, 4]
        }
      ]
    }
  ];
  const processing_code = '888889';
  const key = 'required_fields';
  const message_code = '9999';
 const expected = [3, 4];

  const actual = helpers.findRequiredFields(json, key, processing_code, message_code);
  expect(actual).toStrictEqual(expected);

});

test('should return required_fields inside array on processing code 888888 and message_code 0110', () => {

  const json = [
    {
      'processing_code': '888888',
      'required_fields': [
        {
          '0000': [1, 2],
          '0110': [3, 4]
        }
      ]
    }
  ];
  const processing_code = '888888';
  const key = 'required_fields';
  const message_code = '0110';
 const expected = [3, 4];

  const actual = helpers.findRequiredFields(json, key, processing_code, message_code);
  expect(actual).toStrictEqual(expected);

});

test('should return required_fields inside array on processing code 000000', () => {

  const json = [
    {
      'processing_code': '000000',
      'required_fields': [0, 2, 4]
    }
  ];
  const processing_code = '000001';
  const key = 'required_fields';

  const actual = helpers.findRequiredFields(json, key, processing_code, null);
  expect(actual).toStrictEqual([]);

});


// ********************************
// matchValues()
// ********************************


test('should return [0] for match two arrays: [0] [1]', () => {

  const required_fields = [0];
  const iso_fields = [1];
  
  const actual = helpers.matchValues(required_fields, iso_fields);
  expect(actual).toStrictEqual([0]);

});


test('should return [] for match two arrays: [0] [0]', () => {

  const required_fields = [0];
  const iso_fields = [0];

  expect(helpers.matchValues(required_fields, iso_fields)).toStrictEqual([] );

});


test('should return [15, 18] for match two arrays: [0, 10, 15, 18, 20] [0, 10, 20, 30]', () => {

  const required_fields = [0, 10, 15, 18, 20];
  const iso_fields = [0, 10, 20, 30];

  expect(helpers.matchValues(required_fields, iso_fields)).toStrictEqual([15, 18] );

});


test('should return [15, 18, 45, 46, 47] for match two arrays: [0, 10, 15, 18, 20, 45, 46, 47] [0, 10, 20, 30]', () => {

  const required_fields = [0, 10, 15, 18, 20, 45, 46, 47];
  const iso_fields = [0, 10, 20, 30];

  expect(helpers.matchValues(required_fields, iso_fields)).toStrictEqual([15, 18, 45, 46, 47] );

});


// ********************************
// extractBits()
// ********************************


test('should return [0, 3] for bit let data = { 0: 0000, 3: 888888 };', () => {

  let data = {
    0: '0000',
    3: '888888'
  };

 const expected = [0, 3];

  expect(helpers.extractBits(data)).toStrictEqual(expected );

});

test('should return [1, 3] for bit let data = { 1: 0000, 3: 888888 };', () => {

  let data = {
    1: '0000',
    3: '888888'
  };

 const expected = [1, 3];

  expect(helpers.extractBits(data)).toStrictEqual(expected);

});

test('should return [0] for bit let data = {};', () => {

  expect(helpers.extractBits({})).toStrictEqual([]);

});