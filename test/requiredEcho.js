import test from 'ava';
import requiredEcho from '../lib/requiredEcho.js';

test('should return false', t => {

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
  
  t.deepEqual(requiredEcho({ json, iso_send, iso_answer }), false);
});


test('should return true 0, 2', t => {

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
  
  t.deepEqual(requiredEcho({ json, iso_send, iso_answer }), true);
});


test('should return true 2', t => {

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
  
  t.deepEqual(requiredEcho({ json, iso_send, iso_answer }), true);
});

