import test from 'ava';
import required from '../lib/required.js';

test('should return error because required is not implemented on processing code: 000001', t => {
  let data = {};
  
  t.deepEqual(required(data), 'required is not implemented on processing code: undefined');
});

test('should return error because required is not implemented on processing code: 000001', t => {
  let data = {
    0: '',
    2: '',
    3: '000001'
  };

  t.deepEqual(required(data), 'required is not implemented on processing code: 000001');
});

test('should return error because fields [0, 1, 2, 4] is required but dont have 1 in the data', t => {
  let data = {
    0: 'a',
    2: 'b',
    3: '000000',
    4: 'c'
  };

  t.deepEqual(required(data), {error: 'Processing code: 000000 - Missing required fields: 1'});
});

test('should return error because fields [0, 1, 2, 4] is required but dont have 1 and 4 in the data', t => {
  let data = {
    0: 'a',
    2: 'b',
    3: '000000'
  };

  t.deepEqual(required(data), {error: 'Processing code: 000000 - Missing required fields: 1,4'});
});

test('should return error because fields [0] is required', t => {
  let data = {
    2: 'b',
    3: '000009',
    999999: 'lol'
  };

  t.deepEqual(required(data), {error: 'Processing code: 000009 - Missing required fields: 0'});
});
