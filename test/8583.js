import test from 'ava';
import Main from '../lib/8583.js';

/*
Support custom iso 8583 formats
Support Case: Field 3 of 9 length,
*/
test('validateMessage() should return true, message valid', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000000',
    4: '000000005000',
    7: '0911131411'
  };

  let customFormats = {
    '1': {
      ContentType: 'an',
      Label: 'Bitmap',
      LenType: 'fixed',
      MaxLen: 8
    },
    '3': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 9
    }
  };

  let isopack = new Main(data,customFormats);
  t.is(isopack.validateMessage(), true);
});

test('getTransStatus() should return Issuer or switch inoperative as the status of transaction', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000000',
    4: '000000005000',
    7: '0911131411',
    39: '91'
  };

  let customFormats = {
    '3': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 9
    }
  };

  let isopack = new Main(data,customFormats);
  t.is(isopack.getTransStatus(), 'Issuer or switch inoperative');
});


/*
  hasPecialFields test () test cases
 */
test('hasPecialFields test detect special fields', t => {
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
  t.is(isopack.hasSpecialFields, false);
});

test('hasPecialFields test detect special fields and Custom format defined', t => {
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
    129: '12'
  };

  let customFormats = {
    '129': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 2
    }
  };



  let isopack = new Main(data,customFormats);
  t.is(isopack.hasSpecialFields, true);
  t.is(isopack.validateMessage(), true);
});

test('hasPecialFields test detect special fields BUT no custom format', t => {
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
    129: '12'
  };

  let isopack = new Main(data);
  t.is(isopack.hasSpecialFields, true);
  t.is(isopack.validateMessage(), false);
});


/**
 * assembleBitMap() test cases
 */
test('assembleBitMap() should return error object if no MTI', t => {
  let data = {
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
  };

  let message = new Main(data);
  t.deepEqual(message.assembleBitMap(), {error: 'bitmap error, iso message type undefined or invalid'});
});
test('checkMTI() should return true, iso 1987 support', t => {
  let data = {
    0: '0200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  t.true(message.checkMTI());
});
test('checkMTI() should return true, iso 1993 support', t => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  t.true(message.checkMTI());
});

test('checkMTI() should return true, iso 2003 support', t => {
  let data = {
    0: '2200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  t.true(message.checkMTI());
});

test('checkMTI() should return false, iso unsupported mti', t => {
  let data = {
    0: '3200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  t.false(message.checkMTI());
});

test('assembleBitMap() should return bitmap binary represenation 1', t => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
  };

  const message = new Main(data);
  t.true(message.checkMTI());

  const expected = new Uint8Array([
    1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 
  ]);
  t.deepEqual(message.assembleBitMap(), expected);
});

test('assembleBitMap() should return bitmap binary represenation 2', t => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    6: '000000005000',
    129: '12'
  };

  let customFormats = {
    '129': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 2
    }
  };

  const message = new Main(data,customFormats);
  t.true(message.checkMTI());
  t.is(message.hasSpecialFields, true);
  t.is(message.validateMessage(), true);
  const expected = new Uint8Array([1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ]);
  t.deepEqual(message.assembleBitMap(), expected);
});

/**
 * getBitMapHex() test cases
 */
test('getBitMapHex() should return bitmap for a message with a single field', t => {
  let data = {
    0: '1200',
    2: '4761739001010119',
  };

  let message = new Main(data);
  t.is(message.getBitMapHex(), 'c0000000000000000000000000000000');
});

test('getBitMapHex() should return bitmap for a message with two fields', t => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
  };

  let message = new Main(data);
  t.is(message.getBitMapHex(), 'e0000000000000000000000000000000');
});

test('getBitMapHex() should return bitmap for a message with three fields', t => {
  let data = {
    0: '1200',
    2: '4761739001010119',
    3: '000000',
    4: '0000000000000'
  };

  let message = new Main(data);
  t.is(message.getBitMapHex(), 'f0000000000000000000000000000000');
});


test('getBitMapHex() should return bitmap for a random field set', t => {
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
  t.is(message.getBitMapHex(), 'f40006c1a08000000000000000000000');
});

/**
 * buildBitmapBuffer()i
 */
test('buildBitmapBuffer() should build ASCII bitmap buffer', t => {
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
  t.is(message.getBitMapHex(), bitmap);

  let ascii_array = [];
  bitmap.toUpperCase().split('').forEach(char => {
    ascii_array.push(char.charCodeAt(0));
  });

  const expected = Buffer.from(ascii_array);
  t.deepEqual(message.buildBitmapBuffer(bitmap, 'ascii'), expected);
});

test('buildBitmapBuffer() should build HEX bitmap buffer', t => {
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
  t.is(message.getBitMapHex(), bitmap);

  const expected =Buffer.from([0xF4, 0x00, 0x06, 0xC1, 0xA0, 0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
  t.deepEqual(message.buildBitmapBuffer(bitmap, 'hex'), expected);
});

/**
 * getLenBuffer() test cases
 */

test('getLenBuffer() should return length 0', t => {
  const message = new Main();
  const expected =Buffer.from([0x00, 0x00]);

  t.deepEqual(message.getLenBuffer(0), expected);
});

test('getLenBuffer() should return length 1', t => {
  const message = new Main();
  const expected =Buffer.from([0x00, 0x01]);

  t.deepEqual(message.getLenBuffer(1), expected);
});

test('getLenBuffer() should return length 15', t => {
  const message = new Main();
  const expected =Buffer.from([0x00, 0x0F]);

  t.deepEqual(message.getLenBuffer(15), expected);
});

test('getLenBuffer() should return length 317', t => {
  const message = new Main();
  const expected =Buffer.from([0x01, 0x3D]);

  t.deepEqual(message.getLenBuffer(317), expected);
});

/**
 * checkMTI()
 */
test('should validate all basic MTIs for ISO8583:1987', t => {
  [ '0100','0110','0101','0120','0121','0130',
    '0200','0201','0202','0203','0210','0212','0220','0221','0230',
    '0320','0321','0322','0323','0330','0332',
    '0400','0401','0410','0420','0421','0430',
    '0500','0501','0510','0520','0521','0522','0532','0523','0530',
    '0600','0601','0610','0620','0621','0630',
    '0800','0801','0810','0820'].forEach( mti => {
    let data = { 0: mti };
    let message = new Main(data);
    t.true(message.checkMTI());
  });
});

test('should validate all basic MTIs for ISO8583:1993', t => {
  [ '1100','1110','1101','1120','1121','1130',
    '1200','1201','1202','1203','1210','1212','1220','1221','1230',
    '1320','1321','1322','1323','1330','1332',
    '1400','1401','1410','1420','1421','1430',
    '1500','1501','1510','1520','1521','1522','1532','1523','1530',
    '1600','1601','1610','1620','1621','1630',
    '1800','1801','1810','1820'].forEach( mti => {
    let data = { 0: mti };
    let message = new Main(data);
    t.true(message.checkMTI());
  });
});

/**
 * getFieldDescription()
 */
test('getFieldDescription() should return empty object when field not passed in', t => {
  t.deepEqual(Main.getFieldDescription(), {});
});

test('getFieldDescription() should the field description for a single field', t => {
  t.deepEqual(Main.getFieldDescription(2), {2: 'Primary account number (PAN)'});
});

test('getFieldDescription() should return empty object if field description does not exist', t => {
  t.deepEqual(Main.getFieldDescription(330), {});
});

test('getFieldDescription() should return empty object when the empty array is passed in empty', t => {
  t.deepEqual(Main.getFieldDescription([]), {});
});

test('getFieldDescription() should return empty object when the empty array is passed in pan, pc, amount', t => {
  const expected = {
    2: 'Primary account number (PAN)',
    3: 'Processing code',
    4: 'Amount, transaction'
  };

  t.deepEqual(Main.getFieldDescription([2, 3, 4]), expected);
});

test('getFieldDescription() should return include only existing field descriptions', t => {
  const expected = {
    12: 'Time, local transaction (hhmmss)',
    22: 'Point of service entry mode',
    54: 'Additional amounts'
  };

  t.deepEqual(Main.getFieldDescription([12, 22, null, 54, 777]), expected);
});

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

test('validateMessage() variable length should get error', t => {
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
    127: '000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959'
  };

  let isopack = new Main(data);
  t.deepEqual(isopack.validateMessage(), {error: 'invalid length of data on field 32'});
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
test('validateMessage() then rebuildExtensions() should validate generic message from README, test length', t => {
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
  t.is(isopack.validateMessage(), true);
  t.is(isopack.getBufferMessage().byteLength.toString(), '468');
  let buffer = isopack.getBufferMessage();
  t.is(new Main().getIsoJSON(buffer,{})['127.25.30'],'BAC24959');
});

/**
 * Generate Buffer message and Unpack
 */
test('with metadata validateMessage() then rebuildExtensions() should validate generic message from README, test length', t => {
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
  t.is(isopack.metaData, staticMeta);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.getBufferMessage().byteLength.toString(), '479');
  let buffer = isopack.getBufferMessage();
  t.is(new Main().setMetadata(staticMeta).getIsoJSON(buffer,{})['127.25.30'],'BAC24959');
});


// getBitMapFields() test cases
test('getBitMapFields() should return the array of active (enabled) fields in a bitmap, except MTI and Bitmap field', t => {
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
  t.is(isopack.validateMessage(), true);
  t.deepEqual(isopack.getBitMapFields(), [2, 3, 4, 7, 12, 13, 14, 18, 22, 23, 25, 26, 32, 33, 35, 41, 42, 43, 49, 52, 56, 123, 127]);
});

// Test Retransmit
test('toRetransmit() should return new message with appropriate retransmit MTI, 0101', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toRetransmit()['0'], '0101');
});


test('toRetransmit() should return new message with appropriate retransmit MTI, 0201', t => {
  let data = {
    0: '0200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toRetransmit()['0'], '0201');
});

test('toRetransmit() should return new message with appropriate retransmit MTI, 0411', t => {
  let data = {
    0: '0410',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toRetransmit()['0'], '0411');
});

test('toRetransmit() should return new message with appropriate retransmit MTI, 0421', t => {
  let data = {
    0: '0420',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toRetransmit()['0'], '0421');
});

// Test Response
test('toResponse() should return new message with appropriate retransmit MTI, 0110', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toResponse()['0'], '0110');
});


test('toResponse() should return new message with appropriate retransmit MTI, 0210', t => {
  let data = {
    0: '0200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toResponse()['0'], '0210');
});

test('toResponse() should return new message with appropriate retransmit MTI, 0420', t => {
  let data = {
    0: '0410',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toResponse()['0'], '0420');
});

test('toResponse() should return new message with appropriate retransmit MTI, 0430', t => {
  let data = {
    0: '0420',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toResponse()['0'], '0430');
});

test('toResponse() should return new message with appropriate retransmit MTI, 0440', t => {
  let data = {
    0: '0430',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toResponse()['0'], '0440');
});

// Test Advise
test('toAdvice() should return new message with appropriate retransmit MTI, 0120', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toAdvice()['0'], '0120');
});

test('toAdvice() should return new message with appropriate retransmit MTI, 0220', t => {
  let data = {
    0: '0200',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toAdvice()['0'], '0220');
});

test('toAdvice() should return new message with appropriate retransmit MTI, 0420', t => {
  let data = {
    0: '0400',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.toAdvice()['0'], '0420');
});

test('should return false - fields [3, 4] is required for 888888 - with custom file config after new Main()', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '888888'
  };

  let isopack = new Main(data);
  isopack.requiredFieldsSchema = '../lib/mock/required-fields.custom.json';
  t.is(isopack.validateMessage(), false);
});

test('should return error to validate required fields', t => {
  let data = {
    3: '000000'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), false);
});


test('should return false - fields [3, 4] is required for 888888 message code - is missing 4 - with custom file', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '888888'
  };
  let customFormats = {};
  const file = '../lib/mock/required-fields.custom.json';

  let isopack = new Main(data, customFormats, file);
  t.is(isopack.validateMessage(), false);
});


test('should return true - fields [3, 4] is required for 9999 message code - with custom file', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000',
  };
  let customFormats = {};
  const file = '../lib/mock/required-fields.custom.json';

  let isopack = new Main(data, customFormats, file);
  t.is(isopack.validateMessage(), true);
});


test('should return true - with custom file config after new Main()', t => {
  let data = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000'
  };

  let isopack = new Main(data);
  isopack.requiredFieldsSchema = '../lib/mock/required-fields.custom.json';
  t.is(isopack.validateMessage(), true);
});


test('should return false to validate required echo fields', t => {

  const iso_send = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000'
  };

  const iso_answer = {
    0: '0200',
    2: '4761739001010119',
    3: '888888',
    4: '9999999999999'
  };

  let isopack = new Main();
  isopack.requiredFieldsSchema = '../lib/mock/required-fields.custom.json';

  t.is(isopack.validateEcho({iso_send, iso_answer}), false);

});

test('should return true to validate required echo fields', t => {

  const iso_send = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000'
  };

  const iso_answer = {
    0: '0200',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000'
  };

  let isopack = new Main();
  isopack.requiredFieldsSchema = '../lib/mock/required-fields.custom.json';

  t.is(isopack.validateEcho({iso_send, iso_answer}), true);

});

test('should return false to validate required echo AND required fields', t => {

  const iso_send = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000'
  };

  const iso_answer = {
    0: '0200',
    2: '4761739001010119',
    3: '888888',
    4: '9999999999999'
  };

  let isopack = new Main(iso_send);
  isopack.requiredFieldsSchema = '../lib/mock/required-fields.custom.json';

  t.is(isopack.validateMessage(), true);
  t.is(isopack.validateEcho({iso_send, iso_answer}), false);

});

test('should return true to validate required echo AND required fields', t => {

  const iso_send = {
    0: '0100',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000'
  };

  const iso_answer = {
    0: '0200',
    2: '4761739001010119',
    3: '888888',
    4: '000000005000'
  };

  let isopack = new Main(iso_send);
  isopack.requiredFieldsSchema = '../lib/mock/required-fields.custom.json';

  t.is(isopack.validateMessage(), true);
  t.is(isopack.validateEcho({iso_send, iso_answer}), true);

});


test('should handle data encoded in plain text utf8 including the bitmap case 1', t=> {

  const isopack = new Main();
  const isoString = '0800822000000000000004000000000000001125161336000255301';
  const config = {lenHeader: false, lenHeaderEncoding: 'utf8', bitmapEncoding: 'utf8', secondaryBitmap: false, };
  const message = isopack.getIsoJSON(new Buffer.alloc(isoString.length, isoString), config);
  
  t.is(message[0], '0800');
  t.is(message[7], '1125161336');
});

test('should handle data encoded in plain text utf8 including the bitmap case 2', t=> {

  const isopack = new Main();
  const isoString = '0800822000000800000004000000000000000904003641670011f8f2f4f6f0f0f6f7f0f0f1f10301';
  const config = {lenHeader: false, lenHeaderEncoding: 'utf8', bitmapEncoding: 'utf8', secondaryBitmap: false, };
  const message = isopack.getIsoJSON(new Buffer.alloc(isoString.length, isoString), config);
  
  t.is(message[0], '0800');
});

test('should fail, length indicator not included and not disabled', t=> {

  const isopack = new Main();
  const isoString = '0800822000000000000004000000000000001125161336000255301';
  const config = { lenHeaderEncoding: 'utf8', bitmapEncoding: 'utf8', secondaryBitmap: false, };
  const message = isopack.getIsoJSON(new Buffer.alloc(isoString.length, isoString), config);
  
  t.is(message.error, 'failed to unpack at get mti');
});

test('should unpack data that has no secondary bitmap', t=> {
  
  const isopack = new Main();
  const buffer = new Buffer.from('303830302220010000800000393930303030303832333135313731363030303030313833313030303030303031', 'hex');
  const config = {lenHeader: false};
  const message = isopack.getIsoJSON(buffer, config);
  
  t.is(message[0], '0800');
  t.is(message[7], '0823151716');
  t.is(message[11], '000001');
  t.is(message[41], '00000001');
});

test('should puck unpack data with field 127.25 as XML', t=> {
  
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
    '127.25': '<IccData><IccRequest><AmountAuthorized>000000002341</AmountAuthorized><AmountOther>000000000000</AmountOther><ApplicationIdentifier>14A0000000031010</ApplicationIdentifier><ApplicationInterchangeProfile>5000</ApplicationInterchangeProfile><ApplicationTransactionCounter>0008</ApplicationTransactionCounter><Cryptogram>D17AC224D703ED03</Cryptogram><CryptogramInformationData>80</CryptogramInformationData><InterfaceDeviceSerialNumber>3332303030303632</InterfaceDeviceSerialNumber><IssuerApplicationData>1406011203A09800</IssuerApplicationData><TerminalApplicationVersionNumber>0096</TerminalApplicationVersionNumber><TerminalVerificationResult>4280000800</TerminalVerificationResult><TransactionCurrencyCode>404</TransactionCurrencyCode><TransactionDate>201008</TransactionDate><TransactionSequenceCounter>800000144</TransactionSequenceCounter><TransactionType>00</TransactionType><UnpredictableNumber>9FACCF09</UnpredictableNumber></IccRequest></IccData>'
  };

  let isopack = new Main(data);
  t.is(isopack.validateMessage(), true);
  t.is(isopack.getBufferMessage().byteLength.toString(), '1189');
  let buffer = isopack.getBufferMessage();
  t.is(new Main().getIsoJSON(buffer,{})['127.25'], data['127.25']);
});