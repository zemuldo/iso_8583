const formatd = require('date-fns/format');

const util = {};

util.getPostillionLength = (buf) => {
  const div = buf[0];
  const rem = buf[1];

  return (256 * div) + rem;
};

util.extractPostillionData = (sent) => {
  // the data is two bytes shorter than what is sent
  const buf = Buffer.from(sent.length - 2);

  // the first to bytes represents the length, the rest is data
  for (let i = 2; i < sent.length; i += 1) {
    buf[i - 2] = sent[i];
  }

  return buf;
};

util.attachPostillionLength = (_data) => {
  let data = null;

  // make sure _data is a buffer, if it's a string convert
  if (!Buffer.isBuffer(_data)) {
    if (typeof (_data) === 'string') {
      data = Buffer.from(_data);
    }
  } else {
    data = _data;
  }

  // data is represented by two bytes
  const length = Buffer.alloc(2);
  length[0] = data.length / 256;
  length[1] = data.length % 256;

  return Buffer.concat([length, data]);
};

util.attachDiTimeStamps = (obj) => {
  const time = new Date();
  if (!obj['7']) obj['7'] = formatd(time, 'MMDDhhmmss');
  if (!obj['12']) obj['12'] = formatd(time, 'hhmmss');
  if (!obj['13']) obj['13'] = formatd(time, 'MMDD');

  return obj;
};

module.exports = util;
