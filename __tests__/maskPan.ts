import maskPan from '../src/maskPan';
import Iso8583 from '../src/ISO8583';

test('should return error ', () => {
  const masked = maskPan('456789345678', '***');

  expect(masked).toStrictEqual({ error: 'unknown pan masking format' });
});

test('should mask pan and leave the first 4', () => {
  const masked = maskPan('456789345678', '4**');

  expect(masked).toStrictEqual('4567********');
});

test('should mask pan and leave the last 4', () => {
  const masked = maskPan('456789345678', '**4');

  expect(masked).toStrictEqual('********5678');
});

test('should mask pan and leave the middle 4 12 length PAN, ',() => {

  const masked = maskPan('456789345678', '*4*');

  expect(masked).toStrictEqual('****8934****');
});

test('should mask pan and leave the middle 4 16 length PAN',() => {

  const masked = maskPan('456789345678555', '*4*');

  expect(masked).toStrictEqual('*****93456*****');
});

// Testing on Main

test('should mask pan and leave the middle 4 on main export',() => {

  const isoPack = new Iso8583();
  const masked = isoPack.maskPan('456789345678555', '*4*');

  expect(masked).toStrictEqual('*****93456*****');
});
