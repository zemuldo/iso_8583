/**
 * Created by danstan on 8/1/17.
 */
const net = require('net');

const client = new net.Socket();
const Iso_8583 = require('../../lib/8583');

const helpers = require('../tools/helpers');
const config = require('../config/env');

const host = config[process.env.NODE_ENV || 'development'];

const timeout = 3000;
let retrying = false;

// Functions to handle client events
// connector
function makeConnection() {
  client.connect(host.port, host.address);
}
function connectEventHandler() {
  console.info('***** connected ******');
  console.info({
    port: client.remotePort,
    host: client.remoteAddress,
  }, 'connected to postillion postbridge');
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
        console.info('Message write finish');
      });
    default:
      return false;
  }
}
function errorEventHandler(e) {
  console.error(`Connection error ${e.code}`);
  if (e.code === 'ECONNREFUSED') {
    console.error({ error: 'Remote Server Refused' });
    console.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  } else if (e.code === 'EHOSTUNREACH') {
    console.error('could not reach postbridge node');
    console.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  } else if (e.code === 'ETIMEDOUT') {
    // might want to set back up the connection
    console.error('EHOSTUNREACH error connection with postilion timed out...');
    console.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  } else if (e.code === 'EPIPE') {
    console.error('the FIN has been sent from the other side');
    console.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  } else {
    console.error(e.code);
    console.info(`Reconnecting... in ${timeout / 1000} Seconds`);
  }

  if (!retrying) {
    retrying = true;
  }
  setTimeout(makeConnection, timeout);
}
function closeEventHandler() {
  if (retrying) return false;
  console.error('Server closed');
  console.info(`Reconnecting... in ${timeout / 1000} Seconds`);
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
console.info('***** connecting ******');
makeConnection();

module.exports = client;
