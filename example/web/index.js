

const express = require('express');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const config = require('../config/env');
const pos_route = require('./routes/pos');

const configs = config[process.env.NODE_ENV || 'development'];

const app = express();
app.post(('/'), (req, res) => {
  res.send({ status: 'ok' });
});

app.use(bodyParser.json());
app.use(xmlparser());

app.use('/pos', pos_route);

app.listen(configs.httpPort, () => {
  console.info({
    MESS: `Web server running at http://localhost:${configs.httpPort}`,
  });
});

module.exports = app;
