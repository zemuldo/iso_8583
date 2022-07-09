
import types from '../src/types';

function customAssert(a: any, b: any) {
  return expect(a).toStrictEqual(b);
}

test('should return error if options has no ContentType', () => {
  customAssert(types({}, null, undefined), {error: 'type undefined is not implemented on field undefined'});
});

test('should process \'a\' type', () => {
  const options = {'ContentType': 'a'};
  const data = 'ABCD';

  customAssert(types(options, data, '0'), true);
});

test('should return false in case of \'a\' type invalid data', () => {
  const options = {'ContentType': 'a'};
  const data = 'A1';
  const field = 2;

  customAssert(types(options, data, field), {error: 'while processing field 2: provided data is not of type \'a\''});
});

test('should process numeric (\'n\') type', () => {
  const options = {'ContentType': 'n'};
  const data = '0123456789';

  customAssert(types(options, data, '0'), true);
});

test('should return false in case of \'n\' type invalid data', () => {
  const options = {'ContentType': 'n'};
  const data = '01234567890z';
  const field = 16;

  customAssert(types(options, data, field), {error: 'while processing field 16: provided data is not of type \'n\''});
});

test('should process binary data representation (\'b\') type', () => {
  const options = {'ContentType': 'b'};
  const data = 'DEADBEAF300';

  customAssert(types(options, data, '0'), true);
});

test('should return false in case of \'b\' type invalid data', () => {
  const options = {'ContentType': 'b'};
  const data = 'Invalid DATA';
  const field = 77;

  customAssert(types(options, data, field), {error: 'while processing field 77: provided data is not of type \'b\''});
});

test('should process numeric and special characters (\'ns\') type', () => {
  const options = {'ContentType': 'ns'};
  const data = '1293801928+_--=.,';

  customAssert(types(options, data, '0'), true);
});

test('should return false in case of \'ns\' type invalid data', () => {
  const options = {'ContentType': 'ns'};
  const data = '+_--=.,ASD';
  const field = 93;

  customAssert(types(options, data, field), {error: 'while processing field 93: provided data is not of type \'ns\''});
});

test('should process special characters (\'s\') type', () => {
  const options = {'ContentType': 's'};
  const data = '></////+_--=.,~';

  customAssert(types(options, data, '0'), true);
});

test('should return false in case of \'s\' type invalid data', () => {
  const options = {'ContentType': 's'};
  const data = '+_--=.,ASD';
  const field = 93;

  customAssert(types(options, data, field), {error: 'while processing field 93: provided data is not of type \'s\''});
});

test('should process alphanumeric (\'an\') type', () => {
  const options = {'ContentType': 'an'};
  const data = 'asdasdakjlk1238719283ASDASDLK';

  customAssert(types(options, data, '0'), true);
});

test('should return false in case of \'an\' type invalid data', () => {
  const options = {'ContentType': 'an'};
  const data = 'AS.,ASDaadasd';
  const field = 9;

  customAssert(types(options, data, field), {error: 'while processing field 9: provided data is not of type \'an\''});
});

test('should process alphanumeric with special characters (\'ans\') type', () => {
  const options = {'ContentType': 'ans'};
  const data = 'asdasdakjlk1238719283ASDASDLK-=-=-=-,.,.,/.,<><><><><>';

  customAssert(types(options, data, '0'), true);
});

test('should return false in case of \'ans\' type invalid data', () => {
  const options = {'ContentType': 'ans'};
  const data = 'AS.,ASDaadasd\x01';
  const field = 9;

  customAssert(types(options, data, field), {error: 'while processing field 9: provided data is not of type \'ans\''});
});

test('should process alphanumeric with pad character (\'anp\') type', () => {
  const options = {'ContentType': 'anp'};
  const data = 'asd80  DEADBEAF 1337';

  customAssert(types(options, data, '0'), true);
});

test('should return false in case of \'anp\' type invalid data', () => {
  const options = {'ContentType': 'anp'};
  const data = '=-=<>.,.';
  const field = 98;

  customAssert(types(options, data, field), {error: 'while processing field 98: provided data is not of type \'anp\''});
});

test('should process \'x+n\' type (a prefix of C followed by numeric characters)', () => {
  const options = {'ContentType': 'x+n'};
  const data = 'C0000198500';

  customAssert(types(options, data, '0'), true);
});

test('should process \'x+n\' type (a prefix of D followed by numeric characters)', () => {
  const options = {'ContentType': 'x+n'};
  const data = 'D0004198500';

  customAssert(types(options, data, '0'), true);
});


test('should return false in case of \'x+n\' type invalid data', () => {
  const options = {'ContentType': 'x+n'};
  const data = 'X09180938019';
  const field = 103;

  customAssert(types(options, data, field), {error: 'while processing field ' + field + ': provided data is not of type \'' + options.ContentType + '\''});
});

test('should return false in case of \'x+n\' type invalid amount data', () => {
  const options = {'ContentType': 'x+n'};
  const data = 'C09180938ABCD';
  const field = 103;

  customAssert(types(options, data, field), {error: 'while processing field ' + field + ': provided data is not of type \'' + options.ContentType + '\''});
});


