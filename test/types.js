import test from 'ava';
import types from '../lib/types.js';

test('should return error if options has no ContentType', t => {
  t.deepEqual(types({}), {error: 'type undefined is not implemented on field undefined'});
});

test('should process \'a\' type', t => {
  const options = {'ContentType': 'a'};
  const data = 'ABCD';
  const field = 2;

  t.true(types(options, data, field));
});

test('should return false in case of \'a\' type invalid data', t => {
  const options = {'ContentType': 'a'};
  const data = 'ABCD';
  const field = 2;

  t.true(types(options, data, field), {});
});
