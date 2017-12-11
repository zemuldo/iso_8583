import test from 'ava';
import Main from '../lib/8583.js';

/**
 * getTType() test cases
 */
test('should return proper transaction type description for type 00', t => {
  let data = { 3: '000000' };
  let isopack = new Main(data);
  t.is(isopack.getTType(), 'Goods and services');
});

test('should return proper transaction type description for type 01', t => {
  let data = { 3: '010200' };
  let isopack = new Main(data);
  t.is(isopack.getTType(), 'Cash withdrawal');
});

test('should return error if transaction type is not defined', t => {
  let data = { 2: '4444555566667777' };
  let isopack = new Main(data);
  t.deepEqual(isopack.getTType(), {error: 'transaction type not defined in message',});
});

test('getTransactionType() should be an alias to getTType()', t => {
  let data = { 3: '020100' };
  let isopack = new Main(data);
  t.deepEqual(isopack.getTType(), isopack.getTransactionType());
});


/**
 * getAccType() test cases
 */

test('getAccType() should return error if transaction type is not defined', t => {
  let data = { 2: '4444555566667777' };
  let isopack = new Main(data);
  t.deepEqual(isopack.getAccType(), {error: 'transaction type not defined in message',});
});

test('getAccType() should return proper 00 account type', t => {
  let data = { 3: 'xx00xx' };
  let isopack = new Main(data);
  t.is(isopack.getAccType(), 'Default – unspecified');
});

test('getAccType() should return proper 10 account type', t => {
  let data = { 3: 'xx10xx' };
  let isopack = new Main(data);
  t.is(isopack.getAccType(), 'Savings account');
});

test('getAccountTypeFrom() should be an alias to getAccType()', t => {
  let data = { 3: 'xx20xx' };
  let isopack = new Main(data);
  t.deepEqual(isopack.getAccType(), isopack.getAccountTypeFrom());
});


/**
 * getAccountTypeTo() test cases
 */
test('getAccountTypeTo() should return error if transaction type is not defined', t => {
  let data = { 2: '4444555566667777' };
  let isopack = new Main(data);
  t.deepEqual(isopack.getAccountTypeTo(), {error: 'transaction type not defined in message',});
});

test('getAccountTypeTo() should return proper 30 account type', t => {
  let data = { 3: 'xxxx30' };
  let isopack = new Main(data);
  t.is(isopack.getAccountTypeTo(), 'Credit account');
});

/**
 * validateMessage() test cases
 */
test('validateMessage() should validate generic message from README', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411',
    12: '131411',
    13: '0911',
    14: '2212',
    18: '4111',
    22: '051',
    23: '001',
    25: '00',
    26: '12',
    32: '423935',
    33: '111111111',
    35: '4761739001010119D22122011758928889',
    41: '12345678',
    42: 'MOTITILL_000001',
    43: 'My Termianl Business                    ',
    49: '404',
    52: '7434F67813BAE545',
    56: '1510',
    123: '91010151134C101',
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
});

/**
 * getMTI() test cases
 */
test('getMti() should return proper MTI for 0100', t => {
  let data = {
    0: '0100',
    2: '4761739001010119'
  };
  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.getMti(), '0100');
});
test('getMti() should return proper MTI for 1820', t => {
  let data = {
    0: '0800',
    70: '001'
  };
  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.getMti(), '0800');
});
test('getMti() should return proper MTI for 1820', t => {
  let data = {
    0: '1899',
    70: '001'
  };
  let isopack = new Main(data);
  t.is(isopack.validateMessage(), false);
});

/**
 * expand message Test Cases
 */
test('validateMessage() then rebuildExtensions() should validate generic message from README', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411',
    12: '131411',
    13: '0911',
    14: '2212',
    18: '4111',
    22: '051',
    23: '001',
    25: '00',
    26: '12',
    32: '423935',
    33: '111111111',
    35: '4761739001010119D22122011758928889',
    41: '12345678',
    42: 'MOTITILL_000001',
    43: 'My Termianl Business                    ',
    49: '404',
    52: '7434F67813BAE545',
    56: '1510',
    123: '91010151134C101',
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.rebuildExtensions(), true);
  t.is(isopack.Msg['127.25.30'], 'BAC24959');
});

/**
 * Generate Buffer message and Unpack
 */
test('validateMessage() then rebuildExtensions() should validate generic message from README', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411',
    12: '131411',
    13: '0911',
    14: '2212',
    18: '4111',
    22: '051',
    23: '001',
    25: '00',
    26: '12',
    32: '423935',
    33: '111111111',
    35: '4761739001010119D22122011758928889',
    41: '12345678',
    42: 'MOTITILL_000001',
    43: 'My Termianl Business                    ',
    49: '404',
    52: '7434F67813BAE545',
    56: '1510',
    123: '91010151134C101',
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.getBufferMessage().byteLength.toString(), '468');
  let buffer = isopack.getBufferMessage();
  t.is(new Main().getIsoJSON(buffer,{})['127.25.30'],'BAC24959');
});


