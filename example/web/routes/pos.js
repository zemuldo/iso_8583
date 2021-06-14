

const express = require('express');
const Iso_8583 = require('../../../lib/8583');
const helpers = require('../../tools/helpers');
const client = require('../../client');
const { sender, onThisData } = require('./utils');

const mandatory = [{ name: 42, error: 'Terminal id is required for this transaction' }];

const router = express();

const validator = (body) => {
  for (const field of mandatory) {
    if (!body[field.name]) throw field.error;
  }
};

// TCP Client data event listener that handles data event by the client.
client.on('data', (data) => {
  const thisMti = data.slice(2, 6).toString();
  const iso = new Iso_8583().getIsoJSON(data);

  // If message ie network message, just respond with status online.
  if (thisMti === '0800' || thisMti === '0810' || thisMti === '0801') {
    const new_0800_0810 = {
      0: '0810',
      39: '00',
      70: iso['70'],
    };
    helpers.attachDiTimeStamps(new_0800_0810);
    client.write(new Iso_8583(new_0800_0810).getBufferMessage());
  } else {
    // Save the data to redis in memory
    // Emmit the data received event for this data.
    onThisData.emit(`${iso['42']}_${iso['11']}_${iso['37']}`, iso);
  }
});
router.post(('/'), async (req, res) => {
  try {
    if (!client.writable) throw { error: 'processor unavailable, contact support', code: 404 };

    await validator(req.body);
    // check if socket writer util has an error
    const response = await sender(req.body);
    if (response.error) throw { ...response, code: response.code || 400 };

    res.status(200).send(response);

    // Delete transactio from memory.
  } catch (e) {
    // Delete transactio from memory.
    res.status(e.code || 500).send({ error: e.error || 'internal server error' });
  }
});
module.exports = router;
