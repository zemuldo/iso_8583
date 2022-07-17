// @ts-nocheck

import { DefaultError } from './../src/errors';
import { requiredFieldsSchema } from './../src/mock/requiredFields';
import Main from '../src/ISO8583';

/*
Support custom iso 8583 formats
Support Case: Field 3 of 9 length,
*/
test('validateMessage() should return true, message valid', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000000',
    4: '000000005000',
    7: '0911131411',
  };

  let customFormats = {
    '1': {
      ContentType: 'an',
      Label: 'Bitmap',
      LenType: 'fixed',
      MaxLen: 8,
    },
    '3': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 9,
    },
  };

  let isopack = new Main(data, customFormats);
  expect(isopack.validateMessage()).toEqual(true);
});

test('getTransStatus() should return Issuer or switch inoperative as the status of transaction', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000000',
    4: '000000005000',
    7: '0911131411',
    39: '91',
  };


  let customFormats = {
    '3': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 9,
    },
  };

  let isopack = new Main(data, customFormats);
  expect(isopack.getTransStatus()).toStrictEqual('Issuer or switch inoperative');
});

/*
  hasPecialFields test () test cases
 */
test('hasPecialFields test detect special fields', () => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
  };

  let isopack = new Main(data);
  expect(isopack.hasSpecialFields).toStrictEqual(false);
});

test('hasPecialFields test detect special fields and Custom format defined', () => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
    129: '12',
  };

  let customFormats = {
    '129': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 2,
    },
  };

  let isopack = new Main(data, customFormats);
  expect(isopack.hasSpecialFields).toStrictEqual(true);
  expect(isopack.validateMessage()).toStrictEqual(true);
});

test('hasPecialFields test detect special fields BUT no custom format', () => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
    129: '12',
  };

  let isopack = new Main(data);
  expect(isopack.hasSpecialFields).toStrictEqual(true);
  expect(isopack.validateMessage()).toStrictEqual(false);
});

/**
 * assembleBitMap() test cases
 */
test('assembleBitMap() should return error object if no MTI', () => {
  let data = {
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let message = new Main(data);
  const result = message.assembleBitMap();
  expect(result).toBeInstanceOf(Error);
  expect(result.error).toStrictEqual('bitmap error, iso message type undefined or invalid');
});
test('checkMTI() should return true, iso 1987 support', () => {
  let data = {
    0: '0200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  expect(message.checkMTI()).toStrictEqual(true);
});
test('checkMTI() should return true, iso 1993 support', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  expect(message.checkMTI()).toStrictEqual(true);
});

test('checkMTI() should return true, iso 2003 support', () => {
  let data = {
    0: '2200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  expect(message.checkMTI()).toStrictEqual(true);
});

test('checkMTI() should return false, iso unsupported mti', () => {
  let data = {
    0: '3200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  expect(message.checkMTI()).toStrictEqual(false);
});

test('assembleBitMap() should return bitmap binary represenation 1', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  expect(message.checkMTI()).toStrictEqual(true);

  const expected = new Uint8Array([
    1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  expect(message.assembleBitMap()).toStrictEqual(expected);
});

test('assembleBitMap() should return bitmap binary represenation 1 - No Secondary bitmap', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  message.optionalSecondaryBitmap = true;
  expect(message.checkMTI()).toStrictEqual(true);

  const expected = new Uint8Array([
    0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  expect(message.assembleBitMap()).toStrictEqual(expected);
});

test('assembleBitMap() should return bitmap binary represenation 2', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
    129: '12',
  };

  let customFormats = {
    '129': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 2,
    },
  };

  const message = new Main(data, customFormats);
  expect(message.checkMTI()).toStrictEqual(true);
  expect(message.hasSpecialFields).toStrictEqual(true);
  expect(message.validateMessage()).toStrictEqual(true);
  const expected = new Uint8Array([
    1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  expect(message.assembleBitMap()).toStrictEqual(expected);
});

/**
 * getBitMapHex() test cases
 */
test('getBitMapHex() should return bitmap for a message with a single field', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
  };

  let message = new Main(data);
  expect(message.getBitMapHex()).toStrictEqual('c0000000000000000000000000000000');
});

test('getBitMapHex() should return bitmap for a message with two fields', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
  };

  let message = new Main(data);
  expect(message.getBitMapHex()).toStrictEqual('e0000000000000000000000000000000');
});

test('getBitMapHex() should return bitmap for a message with three fields', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '0000000000000',
  };

  let message = new Main(data);
  expect(message.getBitMapHex()).toStrictEqual('f0000000000000000000000000000000');
});

test('getBitMapHex() should return bitmap for a random field set', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
    22: '051',
    23: '001',
    25: '00',
    26: '12',
    32: '423935',
    33: '111111111',
    35: '4761739001010119D22122011758928889',
    41: '12345678',
  };

  let message = new Main(data);
  expect(message.getBitMapHex()).toStrictEqual('f40006c1a08000000000000000000000');
});

/**
 * buildBitmapBuffer()i
 */
test('buildBitmapBuffer() should build ASCII bitmap buffer', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
    22: '051',
    23: '001',
    25: '00',
    26: '12',
    32: '423935',
    33: '111111111',
    35: '4761739001010119D22122011758928889',
    41: '12345678',
  };

  const message = new Main(data);
  const bitmap = 'f40006c1a08000000000000000000000';
  expect(message.getBitMapHex()).toStrictEqual(bitmap);

  let ascii_array: string[] = [];
  bitmap
    .toUpperCase()
    .split('')
    .forEach((char: string) => {
      // @ts-ignore
      ascii_array.push(char.charCodeAt(0));
    });

  // @ts-ignore
  const expected = Buffer.from(ascii_array);
  expect(message.buildBitmapBuffer(bitmap, 'ascii')).toStrictEqual(expected);
});

test('buildBitmapBuffer() should build HEX bitmap buffer', () => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
    22: '051',
    23: '001',
    25: '00',
    26: '12',
    32: '423935',
    33: '111111111',
    35: '4761739001010119D22122011758928889',
    41: '12345678',
  };

  const message = new Main(data);
  const bitmap = 'f40006c1a08000000000000000000000';
  expect(message.getBitMapHex()).toStrictEqual(bitmap);

  const expected = Buffer.from([0xf4, 0x00, 0x06, 0xc1, 0xa0, 0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect(message.buildBitmapBuffer(bitmap, 'hex')).toStrictEqual(expected);
});

/**
 * getLenBuffer() test cases
 */

test('getLenBuffer() should return length 0', () => {
  const message = new Main();
  const expected = Buffer.from([0x00, 0x00]);

  expect(message.getLenBuffer(0)).toStrictEqual(expected);
});

test('getLenBuffer() should return length 1', () => {
  const message = new Main();
  const expected = Buffer.from([0x00, 0x01]);

  expect(message.getLenBuffer(1)).toStrictEqual(expected);
});

test('getLenBuffer() should return length 15', () => {
  const message = new Main();
  const expected = Buffer.from([0x00, 0x0f]);

  expect(message.getLenBuffer(15)).toStrictEqual(expected);
});

test('getLenBuffer() should return length 317', () => {
  const message = new Main();
  const expected = Buffer.from([0x01, 0x3d]);

  expect(message.getLenBuffer(317)).toStrictEqual(expected);
});

/**
 * checkMTI()
 */
test('should validate all basic MTIs for ISO8583:1987', () => {
  [
    '0100',
    '0110',
    '0101',
    '0120',
    '0121',
    '0130',
    '0200',
    '0201',
    '0202',
    '0203',
    '0210',
    '0212',
    '0220',
    '0221',
    '0230',
    '0320',
    '0321',
    '0322',
    '0323',
    '0330',
    '0332',
    '0400',
    '0401',
    '0410',
    '0420',
    '0421',
    '0430',
    '0500',
    '0501',
    '0510',
    '0520',
    '0521',
    '0522',
    '0532',
    '0523',
    '0530',
    '0600',
    '0601',
    '0610',
    '0620',
    '0621',
    '0630',
    '0800',
    '0801',
    '0810',
    '0820',
  ].forEach((mti) => {
    let data = { 0: mti };
    let message = new Main(data);
    expect(message.checkMTI()).toStrictEqual(true);
  });
});

test('should validate all basic MTIs for ISO8583:1993', () => {
  [
    '1100',
    '1110',
    '1101',
    '1120',
    '1121',
    '1130',
    '1200',
    '1201',
    '1202',
    '1203',
    '1210',
    '1212',
    '1220',
    '1221',
    '1230',
    '1320',
    '1321',
    '1322',
    '1323',
    '1330',
    '1332',
    '1400',
    '1401',
    '1410',
    '1420',
    '1421',
    '1430',
    '1500',
    '1501',
    '1510',
    '1520',
    '1521',
    '1522',
    '1532',
    '1523',
    '1530',
    '1600',
    '1601',
    '1610',
    '1620',
    '1621',
    '1630',
    '1800',
    '1801',
    '1810',
    '1820',
  ].forEach((mti) => {
    let data = { 0: mti };
    let message = new Main(data);
    expect(message.checkMTI()).toStrictEqual(true);
  });
});

/**
 * getFieldDescription()
 */
test('getFieldDescription() should return empty object when field not passed in', () => {
  expect(Main.getFieldDescription()).toStrictEqual({});
});

test('getFieldDescription() should the field description for a single field', () => {
  expect(Main.getFieldDescription(2)).toStrictEqual({ 2: 'Primary account number (PAN)' });
});

test('getFieldDescription() should return empty object if field description does not exist', () => {
  expect(Main.getFieldDescription(330)).toStrictEqual({});
});

test('getFieldDescription() should return empty object when the empty array is passed in empty', () => {
  expect(Main.getFieldDescription([])).toStrictEqual({});
});

test('getFieldDescription() should return empty object when the empty array is passed in pan, pc, amount', () => {
  const expected = {
    2: 'Primary account number (PAN)',
    3: 'Processing code',
    4: 'Amount, transaction',
  };

  expect(Main.getFieldDescription([2, 3, 4])).toStrictEqual(expected);
});

test('getFieldDescription() should return include only existing field descriptions', () => {
  const expected = {
    12: 'Time, local transaction (hhmmss)',
    22: 'Point of service entry mode',
    54: 'Additional amounts',
  };

  expect(Main.getFieldDescription([12, 22, 54, 777])).toStrictEqual(expected);
  expect(Main.getFieldDescription(null)).toStrictEqual({});
});

/**
 * getTType() test cases
 */
test('should return proper transaction type description for type 00', () => {
  let data = { 3: '000000' };
  let isopack = new Main(data);
  expect(isopack.getTType()).toStrictEqual('Goods and services');
});

test('should return proper transaction type description for type 01', () => {
  let data = { 3: '010200' };
  let isopack = new Main(data);
  expect(isopack.getTType()).toStrictEqual('Cash withdrawal');
});

test('should return error if transaction type is not defined', () => {
  let data = { 2: '4444555566667777' };
  let isopack = new Main(data);
  const result = isopack.getTType();
  expect(result).toBeInstanceOf(Error);
  expect(result.error).toStrictEqual('transaction type not defined in message');
});

test('getTransactionType() should be an alias to getTType()', () => {
  let data = { 3: '020100' };
  let isopack = new Main(data);
  expect(isopack.getTType()).toStrictEqual(isopack.getTransactionType());
});

/**
 * getAccType() test cases
 */

test('getAccType() should return error if transaction type is not defined', () => {
  let data = { 2: '4444555566667777' };
  let isopack = new Main(data);
  const result = isopack.getTType();
  expect(result).toBeInstanceOf(Error);
  expect(result.error).toStrictEqual('transaction type not defined in message');
});

test('getAccType() should return proper 00 account type', () => {
  let data = { 3: 'xx00xx' };
  let isopack = new Main(data);
  expect(isopack.getAccType()).toStrictEqual('Default – unspecified');
});

test('getAccType() should return proper 10 account type', () => {
  let data = { 3: 'xx10xx' };
  let isopack = new Main(data);
  expect(isopack.getAccType()).toStrictEqual('Savings account');
});

test('getAccountTypeFrom() should be an alias to getAccType()', () => {
  let data = { 3: 'xx20xx' };
  let isopack = new Main(data);
  expect(isopack.getAccType()).toStrictEqual(isopack.getAccountTypeFrom());
});

/**
 * getAccountTypeTo() test cases
 */
test('getAccountTypeTo() should return error if transaction type is not defined', () => {
  let data = { 2: '4444555566667777' };
  let isopack = new Main(data);
  expect(isopack.getAccType()).toEqual(new DefaultError('transaction type not defined in message'));
});

test('getAccountTypeTo() should return proper 30 account type', () => {
  let data = { 3: 'xxxx30' };
  let isopack = new Main(data);
  expect(isopack.getAccountTypeTo()).toStrictEqual('Credit account');
});

/**
 * validateMessage() test cases
 */
test('validateMessage() should validate generic message from README', () => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
});

test('validateMessage() variable length should get error', () => {
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
    32: '423935555555555555555555555555',
    33: '111111111',
    35: '4761739001010119D22122011758928889',
    41: '12345678',
    42: 'MOTITILL_000001',
    43: 'My Termianl Business                    ',
    49: '404',
    52: '7434F67813BAE545',
    56: '1510',
    123: '91010151134C101',
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
  };

  let isopack = new Main(data);
  const results = isopack.validateMessage();
  expect(results).toBeInstanceOf(Error);
  expect(results.error).toStrictEqual('invalid length of data on field 32');
});

/**
 * getMTI() test cases
 */
test('getMti() should return proper MTI for 0100', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
  };
  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.getMti()).toStrictEqual('0100');
});
test('getMti() should return proper MTI for 1820', () => {
  let data = {
    0: '0800',
    70: '001',
  };
  let isopack = new Main(data);

  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.getMti()).toStrictEqual('0800');
});

/**
 * expand message Test Cases
 */
test('validateMessage() then rebuildExtensions() should validate generic message from README', () => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.rebuildExtensions()).toStrictEqual(true);
  expect(isopack?.Msg?.['127.25.30']).toStrictEqual('BAC24959');
});

/**
 * Generate Buffer message and Unpack
 */
test('validateMessage() then rebuildExtensions() should validate generic message from README, test length', () => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
  };

  let isopack = new Main(data);

  expect(isopack.validateMessage()).toStrictEqual(true);
  const _buffer = isopack.getBufferMessage();
  expect(_buffer.byteLength).toStrictEqual(468);
  const decoded = new Main().getIsoJSON(_buffer, {});
  expect(decoded['127.25.30']).toStrictEqual('BAC24959');
});

/**
 * Generate Buffer message and Unpack
 */
test('with metadata validateMessage() then rebuildExtensions() should validate generic message from README, test length', () => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
  };
  const staticMeta = 'ISO70100000';
  let isopack = new Main(data);
  isopack.setMetadata(staticMeta);
  expect(isopack.metaData).toStrictEqual(staticMeta);
  expect(isopack.validateMessage()).toStrictEqual(true);
  const _buffer = isopack.getBufferMessage();
  expect(_buffer.byteLength).toStrictEqual(479);
  const decoded = new Main().setMetadata(staticMeta).getIsoJSON(_buffer, {});
  expect(decoded['127.25.30']).toStrictEqual('BAC24959');
});

test('message with optional secondary bitmap', () => {
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
  };
  const staticMeta = 'ISO70100000';
  let isopack = new Main(data);
  isopack.setMetadata(staticMeta);
  isopack.optionalSecondaryBitmap = true;
  expect(isopack.metaData).toStrictEqual(staticMeta);
  expect(isopack.validateMessage()).toStrictEqual(true);
  const _buffer = isopack.getBufferMessage();
  expect(_buffer.byteLength).toStrictEqual(220);
  let buffer = isopack.getBufferMessage();
  expect(isopack.getIsoJSON(buffer, {})['49']).toStrictEqual('404');
  expect(new Main().setMetadata(staticMeta).getIsoJSON(buffer, {})['49']).toStrictEqual('404');
});

// getBitMapFields() test cases
test('getBitMapFields() should return the array of active (enabled) fields in a bitmap, except MTI and Bitmap field', () => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.getBitMapFields()).toStrictEqual([
    2, 3, 4, 7, 12, 13, 14, 18, 22, 23, 25, 26, 32, 33, 35, 41, 42, 43, 49, 52, 56, 123, 127,
  ]);
});

// Test Retransmit
test('toRetransmit() should return new message with appropriate retransmit MTI, 0101', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toRetransmit()).toStrictEqual({ ...data, '0': '0101' });
});

test('toRetransmit() should return new message with appropriate retransmit MTI, 0201', () => {
  let data = {
    0: '0200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toRetransmit()).toStrictEqual({ ...data, '0': '0201' });
});

test('toRetransmit() should return new message with appropriate retransmit MTI, 0411', () => {
  let data = {
    0: '0410',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toRetransmit()).toStrictEqual({ ...data, '0': '0411' });
});

test('toRetransmit() should return new message with appropriate retransmit MTI, 0421', () => {
  let data = {
    0: '0420',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toRetransmit()).toStrictEqual({ ...data, '0': '0421' });
});

// Test Response
test('toResponse() should return new message with appropriate retransmit MTI, 0110', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toResponse()).toStrictEqual({ ...data, '0': '0110' });
});

test('toResponse() should return new message with appropriate retransmit MTI, 0210', () => {
  let data = {
    0: '0200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toResponse()).toStrictEqual({ ...data, '0': '0210' });
});

test('toResponse() should return new message with appropriate retransmit MTI, 0420', () => {
  let data = {
    0: '0410',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toResponse()).toStrictEqual({ ...data, '0': '0420' });
});

test('toResponse() should return new message with appropriate retransmit MTI, 0430', () => {
  let data = {
    0: '0420',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toResponse()).toStrictEqual({ ...data, '0': '0430' });
});

test('toResponse() should return new message with appropriate retransmit MTI, 0440', () => {
  let data = {
    0: '0430',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toResponse()).toStrictEqual({ ...data, '0': '0440' });
});

// Test Advise
test('toAdvice() should return new message with appropriate retransmit MTI, 0120', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toAdvice()).toStrictEqual({ ...data, '0': '0120' });
});

test('toAdvice() should return new message with appropriate retransmit MTI, 0220', () => {
  let data = {
    0: '0200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toAdvice()).toStrictEqual({ ...data, '0': '0220' });
});

test('toAdvice() should return new message with appropriate retransmit MTI, 0420', () => {
  let data = {
    0: '0400',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.toAdvice()).toStrictEqual({ ...data, '0': '0420' });
});

test('should return false - fields [3, 4] is required for 888888 - with custom file config after new Main()', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
  };

  let isopack = new Main(data);
  isopack.requiredFieldsSchema = requiredFieldsSchema;
  expect(isopack.validateMessage()).toStrictEqual(false);
});

test('should return error to validate required fields', () => {
  let data = {
    3: '000000',
  };

  let isopack = new Main(data);
  expect(isopack.validateMessage()).toStrictEqual(false);
});

test('should return false - fields [3, 4] is required for 888888 message code - is missing 4 - with custom file', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
  };
  let customFormats = {};

  // @ts-ignore
  let isopack = new Main(data, customFormats, requiredFieldsSchema);
  expect(isopack.validateMessage()).toStrictEqual(false);
});

test('should return true - fields [3, 4] is required for 9999 message code - with custom file', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };
  let customFormats = {};

  // @ts-ignore
  let isopack = new Main(data, customFormats, requiredFieldsSchema);
  expect(isopack.validateMessage()).toStrictEqual(true);
});

test('should return true - with custom file config after new Main()', () => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };

  let isopack = new Main(data);
  isopack.requiredFieldsSchema = requiredFieldsSchema;
  expect(isopack.validateMessage()).toStrictEqual(true);
});

test('should return false to validate required echo fields', () => {
  const iso_send = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };

  const iso_answer = {
    0: '0200',
    2: '4761739001010119',
    3: '888888',
    4: '9999999999999',
  };

  let isopack = new Main();
  isopack.requiredFieldsSchema = requiredFieldsSchema;

  expect(isopack.validateEcho(iso_send, iso_answer)).toStrictEqual(false);
});

test('should return true to validate required echo fields', () => {
  const iso_send = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };

  const iso_answer = {
    0: '0200',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };

  let isopack = new Main();
  isopack.requiredFieldsSchema = requiredFieldsSchema;
  expect(isopack.validateEcho(iso_send, iso_answer)).toStrictEqual(true);
});

test('should return false to validate required echo AND required fields', () => {
  const iso_send = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };

  const iso_answer = {
    0: '0200',
    2: '4761739001010119',
    3: '888888',
    4: '9999999999999',
  };

  let isopack = new Main(iso_send);

  isopack.requiredFieldsSchema = requiredFieldsSchema;
  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.validateEcho(iso_send, iso_answer)).toStrictEqual(false);
});

test('should return true to validate required echo AND required fields', () => {
  const iso_send = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };

  const iso_answer = {
    0: '0200',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };

  let isopack = new Main(iso_send);
  isopack.requiredFieldsSchema = requiredFieldsSchema;

  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.validateEcho(iso_send, iso_answer)).toStrictEqual(true);
});

test('should handle data encoded in plain text utf8 including the bitmap case 1', () => {
  const isopack = new Main();
  const isoString = '0800822000000000000004000000000000001125161336000255301';
  const config = { lenHeader: false, lenHeaderEncoding: 'utf8', bitmapEncoding: 'utf8', secondaryBitmap: false };
  const message = isopack.getIsoJSON(Buffer.alloc(isoString.length, isoString), config);

  expect(message[0]).toStrictEqual('0800');
  expect(message[7]).toStrictEqual('1125161336');
});

test('should handle data encoded in plain text utf8 including the bitmap case 2', () => {
  const isopack = new Main();
  const isoString = '0800822000000800000004000000000000000904003641670011f8f2f4f6f0f0f6f7f0f0f1f10301';
  const config = { lenHeader: false, lenHeaderEncoding: 'utf8', bitmapEncoding: 'utf8', secondaryBitmap: false };
  const message = isopack.getIsoJSON(Buffer.alloc(isoString.length, isoString), config);

  expect(message[0]).toStrictEqual('0800');
});

test('should fail, length indicator not included and not disabled', () => {
  const isopack = new Main();
  const isoString = '0800822000000000000004000000000000001125161336000255301';
  const config = { lenHeaderEncoding: 'utf8', bitmapEncoding: 'utf8', secondaryBitmap: false };
  const message = isopack.getIsoJSON(Buffer.alloc(isoString.length, isoString), config);

  // @ts-ignore
  expect(message.error).toStrictEqual('failed to unpack at get mti');
});

test('should unpack data that has no secondary bitmap', () => {
  const isopack = new Main();
  const buffer = Buffer.from(
    '303830302220010000800000393930303030303832333135313731363030303030313833313030303030303031',
    'hex',
  );
  const config = { lenHeader: false };
  const message = isopack.getIsoJSON(buffer, config);

  expect(message[0]).toStrictEqual('0800');
  expect(message[7]).toStrictEqual('0823151716');
  expect(message[11]).toStrictEqual('000001');
  expect(message[41]).toStrictEqual('00000001');
});

test('should puck unpack data with field 127.25 as XML', () => {
  let data = {
    '0': '0100',
    '2': '4761739001010010',
    '3': '000000',
    '4': '000000002341',
    '11': '000001',
    '14': '2212',
    '18': '4789',
    '22': '051',
    '23': '001',
    '25': '00',
    '26': '12',
    '32': '108600',
    '35': '4761739001010010D22122011143844489',
    '41': '12000014',
    '42': 'TERMINAL_000001',
    '43': 'TERMINAL Merchant 1 0000000 NAIROBI KE  ',
    '49': '404',
    '56': '1510',
    '123': '51010151134C101',
    '127.25':
      '<IccData><IccRequest><AmountAuthorized>000000002341</AmountAuthorized><AmountOther>000000000000</AmountOther><ApplicationIdentifier>14A0000000031010</ApplicationIdentifier><ApplicationInterchangeProfile>5000</ApplicationInterchangeProfile><ApplicationTransactionCounter>0008</ApplicationTransactionCounter><Cryptogram>D17AC224D703ED03</Cryptogram><CryptogramInformationData>80</CryptogramInformationData><InterfaceDeviceSerialNumber>3332303030303632</InterfaceDeviceSerialNumber><IssuerApplicationData>1406011203A09800</IssuerApplicationData><TerminalApplicationVersionNumber>0096</TerminalApplicationVersionNumber><TerminalVerificationResult>4280000800</TerminalVerificationResult><TransactionCurrencyCode>404</TransactionCurrencyCode><TransactionDate>201008</TransactionDate><TransactionSequenceCounter>800000144</TransactionSequenceCounter><TransactionType>00</TransactionType><UnpredictableNumber>9FACCF09</UnpredictableNumber></IccRequest></IccData>',
  };

  let isopack = new Main(data);

  expect(isopack.validateMessage()).toStrictEqual(true);
  expect(isopack.getBufferMessage().byteLength).toStrictEqual(1189);
  let buffer = isopack.getBufferMessage();
  expect(new Main().getIsoJSON(buffer, {})['127.25']).toStrictEqual(data['127.25']);
});

test('Encode, Decode Message with extensions', () => {
  let data = {
    '0': '0100',
    '2': '4761739001010119',
    '3': '000000',
    '4': '000000005000',
    '7': '0911131411',
    '12': '131411',
    '13': '0911',
    '14': '2212',
    '18': '4111',
    '22': '051',
    '23': '001',
    '25': '00',
    '26': '12',
    '32': '423935',
    '33': '111111111',
    '35': '4761739001010119D22122011758928889',
    '41': '12345678',
    '42': 'MOTITILL_000001',
    '43': 'My Termianl Business                    ',
    '49': '404',
    '52': '7434F67813BAE545',
    '56': '1510',
    '123': '91010151134C101',
    '127':
      '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
    '127.1': '0000008000000000',
    '127.25':
      '7E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
    '127.25.1': '7E1E5F7C00000000',
    '127.25.2': '000000005000',
    '127.25.3': '000000000000',
    '127.25.4': 'A0000000031010',
    '127.25.5': '5C00',
    '127.25.6': '0128',
    '127.25.7': 'FF00',
    '127.25.12': '61F379D43D5AEEBC',
    '127.25.13': '80',
    '127.25.14': '00000000000000001E0302031F00',
    '127.25.15': '020300',
    '127.25.18': '06010A03A09000',
    '127.25.20': '008C',
    '127.25.21': 'E0D0C8',
    '127.25.22': '404',
    '127.25.23': '21',
    '127.25.24': '0280048800',
    '127.25.26': '404',
    '127.25.27': '170911',
    '127.25.28': '00000147',
    '127.25.29': '60',
    '127.25.30': 'BAC24959',
  };
  const b = new Main(data).encode();
  expect(b.byteLength.toString()).toStrictEqual('468');

  const json = new Main(b).decode();
  expect(json['127.25.30']).toStrictEqual('BAC24959');
});

test('Encode, Decode', () => {

    let data = {
      '0': '0100',
      '2': '4761739001010119',
      '3': '000000',
      '4': '000000005000',
      '7': '0911131411',
      '12': '131411',
      '13': '0911',
      '14': '2212',
      '18': '4111',
      '22': '051',
      '23': '001',
      '25': '00',
      '26': '12',
      '32': '423935',
      '33': '111111111',
      '35': '4761739001010119D22122011758928889',
      '41': '12345678',
      '42': 'MOTITILL_000001',
      '43': 'My Termianl Business                    ',
      '49': '404',
      '52': '7434F67813BAE545',
      '56': '1510',
      '123': '91010151134C101',
      '127':
        '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
      '127.1': '0000008000000000',
      '127.25':
        '7E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959',
      '127.25.1': '7E1E5F7C00000000',
      '127.25.2': '000000005000',
      '127.25.3': '000000000000',
      '127.25.4': 'A0000000031010',
      '127.25.5': '5C00',
      '127.25.6': '0128',
      '127.25.7': 'FF00',
      '127.25.12': '61F379D43D5AEEBC',
      '127.25.13': '80',
      '127.25.14': '00000000000000001E0302031F00',
      '127.25.15': '020300',
      '127.25.18': '06010A03A09000',
      '127.25.20': '008C',
      '127.25.21': 'E0D0C8',
      '127.25.22': '404',
      '127.25.23': '21',
      '127.25.24': '0280048800',
      '127.25.26': '404',
      '127.25.27': '170911',
      '127.25.28': '00000147',
      '127.25.29': '60',
      '127.25.30': 'BAC24959',
    };
  const b = new Main(data).encode();
  expect(b.byteLength.toString()).toStrictEqual('468');

  const json = new Main(b).decode();
  expect(json['127.25.30']).toStrictEqual('BAC24959');
});


test('Rebuild 127.25 extensions', () => {
  let data = {
    '0': '0100',
    '2': '4761739001010119',
    '3': '000000',
    '4': '000000005000',
    '7': '0911131411',
    '12': '131411',
    '13': '0911',
    '14': '2212',
    '18': '4111',
    '22': '051',
    '23': '001',
    '25': '00',
    '26': '12',
    '32': '423935',
    '33': '111111111',
    '35': '4761739001010119D22122011758928889',
    '41': '12345678',
    '42': 'MOTITILL_000001',
    '43': 'My Termianl Business                    ',
    '49': '404',
    '52': '7434f67813bae545',
    '56': '1510',
    '123': '91010151134C101',
    '127.1': '0000008000000000',
    '127.25.2': '000000008000',
    '127.25.3': '900000000000',
    '127.25.4': 'A0000000031010',
    '127.25.5': '5C00',
    '127.25.6': '0128',
    '127.25.7': 'FF00',
    '127.25.12': '61F379D43D5AEEBC',
    '127.25.13': '80',
    '127.25.14': '00000000000000001E0302031F00',
    '127.25.15': '020300',
    '127.25.18': '06010A03A09000',
    '127.25.20': '008C',
    '127.25.21': 'E0D0C8',
    '127.25.22': '404',
    '127.25.23': '21',
    '127.25.24': '0280048800',
    '127.25.26': '404',
    '127.25.27': '170911',
    '127.25.28': '00000147',
    '127.25.29': '60',
    '127.25.30': 'BAC24959',
  };

  const buf = new Main(data).assemble127_25_extensions();
  expect(196).toStrictEqual(buf.byteLength);

  const {json} = new Main(data).unpack_127_25_1_63(buf, {});
  expect(json['127.25.30']).toStrictEqual('BAC24959');
});

