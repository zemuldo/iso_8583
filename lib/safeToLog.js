const defaultUnsafeToLogField = {
  '2': 'Primary Account Number',
  '34': 'Primary account number, extended',
  '35': 'Track 2 Data',
  '36': 'Track 3 Data',
  '45': 'Track 1 Data',
  '52': 'Personal identification number data (Pin Block)',
  '53': 'Security related control information',
  '127.2.5': 'ICC Data',
  '127': 'ICC DATA plus other sub fields'
};

module.exports = function (config, data, panMaskFormat) {
  const obj = data || this.Msg;
  const toSafeConfig = config || defaultUnsafeToLogField;
  const msg = Object.assign(obj);
  for (const field in toSafeConfig) {
    if (field === '2') {
      const maskedPan = this.maskPan(msg[field], panMaskFormat || '**4', '*');
      msg[field] = maskedPan;
    } else delete msg[field];
  }
  return msg;
};