
import requiredEcho from '../src/requiredEcho';

test('should return false', () => {

  const json = [
    {
      'processing_code': '000001',
      'required_echo': [3]
    }
  ];
  const iso_send = {
    0: '',
    2: '',
    3: '000001'
  };
  const iso_answer = {
    0: '110',
    2: '',
    4: '000002'
  };
  
  expect(requiredEcho(json, iso_send, iso_answer)).toStrictEqual(false);
});


test('should return true 0, 2', () => {

  const json = [
    {
      'processing_code': '000001',
      'required_echo': [3]
    }
  ];
  const iso_send = {
    0: '',
    2: '',
    3: '000001'
  };
  const iso_answer = {
    0: '110',
    2: '',
    3: '000001'
  };
  
  expect(requiredEcho(json, iso_send, iso_answer)).toStrictEqual(true);
});


test('should return true 2', () => {

  const json = [
    {
      'processing_code': '000001',
      'required_echo': [4, 5]
    },
    {
      'processing_code': '000002',
      'required_echo': [5]
    }
  ];
  const iso_send = {
    0: '0100',
    2: '',
    3: '000001',
    4: '000001',
    5: 'asd'
  };
  const iso_answer = {
    0: '0110',
    2: '',
    3: '000002',
    4: '000001',
    5: 'asd'
  };
  
  expect(requiredEcho(json, iso_send, iso_answer)).toStrictEqual(true);
});

