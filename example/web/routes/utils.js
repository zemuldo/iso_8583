const EventEmitter = require('events');
const Iso_8583 = require('../../../lib/8583');
const client = require('../../client');

class OnDataEmitter extends EventEmitter { }
const onThisData = new OnDataEmitter();

module.exports = {
  onThisData,
  sender: message => new Promise((resolve) => {
    const mess = new Iso_8583(message);
    const buffer = mess.getBufferMessage();
    const tras_unique = `${message['42']}_${message['11']}_${message['37']}`;

    // write to socket
    client.write(buffer);

    // Create event listener to litsten for response message event.
    onThisData.on(tras_unique, (isoRes) => {
      resolve(isoRes);
      onThisData.removeAllListeners(tras_unique);
    });
  })
    .then(success => success)
    .catch(e => e),
};
