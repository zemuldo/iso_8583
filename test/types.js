import test from 'ava';
import types from '../lib/types.js';

test('should return error if options has no ContentType', t => {
  t.deepEqual(types({}), {error: 'type undefined is not implemented on field undefined'});
});

test('should process \'a\' type', t => {
  const options = {'ContentType': 'a'};
  const data = 'ABCD';

  t.true(types(options, data));
});

test('should return false in case of \'a\' type invalid data', t => {
  const options = {'ContentType': 'a'};
  const data = 'A1';
  const field = 2;

  t.deepEqual(types(options, data, field), {error: 'while processing field 2: provided data is not of type \'a\''});
});

test('should process numeric (\'n\') type', t => {
  const options = {'ContentType': 'n'};
  const data = '0123456789';

  t.true(types(options, data));
});

test('should return false in case of \'n\' type invalid data', t => {
  const options = {'ContentType': 'n'};
  const data = '01234567890z';
  const field = 16;

  t.deepEqual(types(options, data, field), {error: 'while processing field 16: provided data is not of type \'n\''});
});

test('should process binary data representation (\'b\') type', t => {
  const options = {'ContentType': 'b'};
  const data = 'DEADBEAF300';

  t.true(types(options, data));
});

test('should return false in case of \'b\' type invalid data', t => {
  const options = {'ContentType': 'b'};
  const data = 'Invalid DATA';
  const field = 77;

  t.deepEqual(types(options, data, field), {error: 'while processing field 77: provided data is not of type \'b\''});
});

test('should process numeric and special characters (\'ns\') type', t => {
  const options = {'ContentType': 'ns'};
  const data = '1293801928+_--=.,';

  t.true(types(options, data));
});

test('should return false in case of \'ns\' type invalid data', t => {
  const options = {'ContentType': 'ns'};
  const data = '+_--=.,ASD';
  const field = 93;

  t.deepEqual(types(options, data, field), {error: 'while processing field 93: provided data is not of type \'ns\''});
});

test('should process special characters (\'s\') type', t => {
  const options = {'ContentType': 's'};
  const data = '></////+_--=.,~';

  t.true(types(options, data));
});

test('should return false in case of \'s\' type invalid data', t => {
  const options = {'ContentType': 's'};
  const data = '+_--=.,ASD';
  const field = 93;

  t.deepEqual(types(options, data, field), {error: 'while processing field 93: provided data is not of type \'s\''});
});

test('should process alphanumeric (\'an\') type', t => {
  const options = {'ContentType': 'an'};
  const data = 'asdasdakjlk1238719283ASDASDLK';

  t.true(types(options, data));
});

test('should return false in case of \'an\' type invalid data', t => {
  const options = {'ContentType': 'an'};
  const data = 'AS.,ASDaadasd';
  const field = 9;

  t.deepEqual(types(options, data, field), {error: 'while processing field 9: provided data is not of type \'an\''});
});

test('should process alphanumeric with special characters (\'ans\') type', t => {
  const options = {'ContentType': 'ans'};
  const data = 'asdasdakjlk1238719283ASDASDLK-=-=-=-,.,.,/.,<><><><><>';

  t.true(types(options, data));
});

test('should return false in case of \'ans\' type invalid data', t => {
  const options = {'ContentType': 'ans'};
  const data = 'AS.,ASDaadasd\x01';
  const field = 9;

  t.deepEqual(types(options, data, field), {error: 'while processing field 9: provided data is not of type \'ans\''});
});

test('should process alphanumeric with pad character (\'anp\') type', t => {
  const options = {'ContentType': 'anp'};
  const data = 'asd80  DEADBEAF 1337';

  t.true(types(options, data));
});

test('should return false in case of \'anp\' type invalid data', t => {
  const options = {'ContentType': 'anp'};
  const data = '=-=<>.,.';
  const field = 98;

  t.deepEqual(types(options, data, field), {error: 'while processing field 98: provided data is not of type \'anp\''});
});

test('should process \'x+n\' type (a prefix of C followed by numeric characters)', t => {
  const options = {'ContentType': 'x+n'};
  const data = 'C0000198500';

  t.true(types(options, data));
});

test('should process \'x+n\' type (a prefix of D followed by numeric characters)', t => {
  const options = {'ContentType': 'x+n'};
  const data = 'D0004198500';

  t.true(types(options, data));
});


test('should return false in case of \'x+n\' type invalid data', t => {
  const options = {'ContentType': 'x+n'};
  const data = 'X09180938019';
  const field = 103;

  t.deepEqual(types(options, data, field), {error: 'while processing field ' + field + ': provided data is not of type \'' + options.ContentType + '\''});
});

test('should return false in case of \'x+n\' type invalid amount data', t => {
  const options = {'ContentType': 'x+n'};
  const data = 'C09180938ABCD';
  const field = 103;

  t.deepEqual(types(options, data, field), {error: 'while processing field ' + field + ': provided data is not of type \'' + options.ContentType + '\''});
});


