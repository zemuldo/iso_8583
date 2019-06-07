import test from 'ava';

const maskPan = require('../lib/maskPan');
const Iso8583 = require('../lib/8583');

test('should return error', t => {

  const masked = maskPan('456789345678', '***');

  t.deepEqual(masked, { error: 'unknown pan masking format' });
});

test('should mask pan and leave the first 4', t => {

  const masked = maskPan('456789345678', '4**');

  t.deepEqual(masked, '4567********');
});

test('should mask pan and leave the last 4', t => {

  const masked = maskPan('456789345678', '**4');

  t.deepEqual(masked, '********5678');
});

test('should mask pan and leave the middle 4 12 length PAN, ', t => {

  const masked = maskPan('456789345678', '*4*');

  t.deepEqual(masked, '****8934****');
});

test('should mask pan and leave the middle 4 16 length PAN', t => {

  const masked = maskPan('456789345678555', '*4*');

  t.deepEqual(masked, '*****93456*****');
});

// Testing on Main

test('should mask pan and leave the middle 4 on main export', t => {

  const isoPack = new Iso8583();
  const masked = isoPack.maskPan('456789345678555', '*4*');

  t.deepEqual(masked, '*****93456*****');
});