const winston = require('winston');

const { config } = winston;
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp() {
        return new Date().toISOString();
      },
      formatter(options) {
        return `${options.timestamp()} ${
          config.colorize(options.level, options.level.toUpperCase())} ${
          options.message ? options.message : ''
        }${config.colorize(options.level, (options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''))}`;
      },
      prettyPrint: true,
    }),
  ],
});
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  debug: 'green',
});

const loggDispatch = (level, log) => {
  if (process.env.NODE_ENV !== 'test') logger[level](log);
};

module.exports = {
  error: (mess) => {
    loggDispatch('error', { mess, worker: { pid: process.pid } });
  },
  warn: (mess) => {
    loggDispatch('warn', { mess, worker: { pid: process.pid } });
  },
  success: (mess) => {
    loggDispatch('info', { mess, worker: { pid: process.pid } });
  },
  system: (mess) => {
    loggDispatch('log', { mess, worker: { pid: process.pid } });
  },
  fail: (mess) => {
    loggDispatch('log', { mess, worker: { pid: process.pid } });
  },
  internal: (mess) => {
    loggDispatch('info', { mess, worker: { pid: process.pid } });
  },
  info: (mess) => {
    loggDispatch('info', { mess, worker: { pid: process.pid } });
  },
  verb: (mess) => {
    loggDispatch('info', { mess, worker: { pid: process.pid } });
  },
  debug: (mess) => {
    loggDispatch('info', { mess, worker: { pid: process.pid } });
  },
  status: (mess) => {
    loggDispatch('info', { mess, worker: { pid: process.pid } });
  },
  timeout: (mess) => {
    loggDispatch('error', { mess, worker: { pid: process.pid } });
  },
  sql: (mess) => {
    loggDispatch('info', { mess, worker: { pid: process.pid } });
  },
  db: (mess) => {
    loggDispatch('info', {
      task: mess.task || 'unspcified', query: mess.query, mess: mess.mess, worker: { pid: process.pid },
    });
  },
  bus: (mess, bus) => {
    loggDispatch(`${bus.vehicleID}`, { mess, bus, worker: { pid: process.pid } });
  },
};
