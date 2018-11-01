/**
 * Created by danstan on 8/1/17.
 */
const net = require('net');

const client = new net.Socket();
const Iso_8583 = require('../../lib/8583');

const log = require('../tools/logger');
const helpers = require('../tools/helpers');
const config = require('../config/env');

const host = config[process.env.NODE_ENV];

const timeout = 3000;
let retrying = false;

// Functions to handle client events
// connector
function makeConnection() {
  client.connect(host.port, host.address);
}
function connectEventHandler() {
  log.info('***** connected ******');
  log.info({
    port: client.remotePort,
    host: client.remoteAddress,
  }, 'connected to inter-switch postillion postbridge');
  retrying = false;
}
function dataEventHandler() {
}
function endEventHandler() {
  // console.log('end');
}
function timeoutEventHandler() {
  // console.log('timeout');
}
function drainEventHandler(data) {
  const thisMti = data.slice(2, 6).toString();
  const iso = new Iso_8583().getIsoJSON(data);
  switch (thisMti) {
    case '0800':
      const new_0800_0810 = {
        0: '0810',
        39: '00',
        70: iso['70'],
      };
      helpers.attachDiTimeStamps(new_0800_0810);
      return client.write(new Iso_8583(new_0800_0810).getBufferMessage(), () => {
        log.info('Message write finish');
      });
    default:
      return false;
  }
}
function errorEventHandler(e) {
  log.error(`Connection error ${e.code}`);
  if (e.code === 'ECONNREFUSED') {
    log.error({ error: 'Remote Server Refused' });
    log.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  } else if (e.code === 'EHOSTUNREACH') {
    log.error('could not reach postbridge node');
    log.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  } else if (e.code === 'ETIMEDOUT') {
    // might want to set back up the connection
    log.error('EHOSTUNREACH error connection with postilion timed out...');
    log.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  } else if (e.code === 'EPIPE') {
    log.error('the FIN has been sent from the other side');
    log.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  } else {
    log.error(e.code);
    log.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  }

  if (!retrying) {
    retrying = true;
  }
  setTimeout(makeConnection, timeout);
}
function closeEventHandler() {
  if (retrying) return false;
  log.error('Server closed');
  log.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  if (!retrying) {
    retrying = true;
  }
  return setTimeout(makeConnection, timeout);
}
// Start Eevent Listeners
client.on('connect', connectEventHandler);
client.on('data', dataEventHandler);
client.on('end', endEventHandler);
client.on('timeout', timeoutEventHandler);
client.on('drain', drainEventHandler);
client.on('error', errorEventHandler);
client.on('close', closeEventHandler);

// Connect to remote server
log.info('***** connecting ******');
makeConnection();

module.exports = client;
