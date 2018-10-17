

const bunyan = require('bunyan');

const log = bunyan.createLogger({
  level: 'debug',
  name: 'cardnet',
});

module.exports = log;
