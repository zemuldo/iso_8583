
import required from '../src/requiredFields';


test('should return error - fields [0, 2, 4] is required - is missing 4', () => {
  let data = {
    0: 'a',
    2: 'b',
    3: '000000'
  };

  expect(required(data, null)).toStrictEqual({ error: 'Processing code: 000000 - Missing required fields: 4' });
});

test('should return error - field [0] is required - is missing 0', () => {
  let data = {
    2: 'b',
    3: '000002',
    999999: 'c'
  };

  expect(required(data, null)).toStrictEqual({ error: 'Processing code: 000002 - Missing required fields: 0' });
});

test('should return true - fields [0, 2, 4] is required', () => {
  let data = {
    0: 'a',
    2: 'b',
    3: '000000',
    4: 'c'
  };

  expect(required(data, null)).toStrictEqual(true);
  
});

test('should return error - fields [3, 7] is required for 0100 message code - is missing 7', () => {
  let data = {
    0: '0100',
    2: 'b',
    3: '999999',
    4: 'c'
  };

  expect(required(data, null)).toStrictEqual({ error: 'Processing code: 999999 - Missing required fields: 7' });
});

test('should return error - fields [3, 7, 11] is required for 0500 message code - is missing 11', () => {
  let data = {
    0: '0500',
    2: 'b',
    3: '999999',
    4: 'c',
    7: 'd'
  };

  expect(required(data, null)).toStrictEqual({ error: 'Processing code: 999999 - Missing required fields: 11' });
});

test('should return true - fields [3, 7, 11] is required for 0500', () => {
  let data = {
    0: '0500',
    2: 'b',
    3: '999999',
    4: 'c',
    7: 'lol',
    11: 'lol1'
  };

  expect(required(data, null)).toStrictEqual(true);
});

test('should return error - fields [1, 2] is required for 0000 message code - is missing 1, 2 - with custom file', () => {
  let data = {
    0: '0000',
    3: '888888'
  };
  const file = '../src/mock/required-fields.custom.json';

  expect(required(data, file)).toStrictEqual({ error: 'Processing code: 888888 - Missing required fields: 1,2' });
});

test('should return true - fields [3, 4] is required for 9999 message code - with custom file', () => {
  let data = {
    0: '9999',
    3: '888888',
    4: 'c'
  };
  const file = '../src/mock/required-fields.custom.json';

  expect(required(data, null)).toStrictEqual(true);
});