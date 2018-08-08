import test from 'ava';
import required from '../lib/required.js';

test('should return required is not implemented on processing code: undefined', t => {
  let data = {};
  
  t.deepEqual(required(data), 'required is not implemented on processing code: undefined');
});

test('should return required is not implemented on processing code: 000001', t => {
  let data = {
    0: '',
    2: '',
    3: '000001'
  };

  t.deepEqual(required(data), 'required is not implemented on processing code: 000001');
});

test('should return error - fields [0, 2, 4] is required - is missing 4', t => {
  let data = {
    0: 'a',
    2: 'b',
    3: '000000'
  };

  t.deepEqual(required(data), {error: 'Processing code: 000000 - Missing required fields: 4'});
});

test('should return error - field [0] is required - is missing 0', t => {
  let data = {
    2: 'b',
    3: '000002',
    999999: 'c'
  };

  t.deepEqual(required(data), {error: 'Processing code: 000002 - Missing required fields: 0'});
});

test('should return true - fields [0, 2, 4] is required', t => {
  let data = {
    0: 'a',
    2: 'b',
    3: '000000',
    4: 'c'
  };

  t.is(required(data), true);
});

test('should return error - fields [3, 7] is required for 0100 message code - is missing 7', t => {
  let data = {
    0: '0100',
    2: 'b',
    3: '999999',
    4: 'c'
  };

  t.deepEqual(required(data), {error: 'Processing code: 999999 - Missing required fields: 7'});
});

test('should return error - fields [3, 7, 11] is required for 0500 message code - 11', t => {
  let data = {
    0: '0500',
    2: 'b',
    3: '999999',
    4: 'c',
    7: 'd'
  };

  t.deepEqual(required(data), {error: 'Processing code: 999999 - Missing required fields: 11'});
});

test('should return true - fields [3, 7, 11] is required for 0500', t => {
  let data = {
    0: '0500',
    2: 'b',
    3: '999999',
    4: 'c',
    7: 'lol',
    11: 'lol1'
  };

  t.is(required(data), true);
});