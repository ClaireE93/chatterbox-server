/* Import node's http module: */
const http = require('http');
const handler = require('./request-handler');
const express = require('express');
const app = express();
const path = require('path');
const results = require('./messages');
const bodyParser = require('body-parser');
const router = express.Router();
const {handlePOST, handleGET} = handler;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* serves main page */
app.get('/', function(req, res) {
  res.sendFile(path.resolve('../client/index.html'));
});

app.post('/classes/messages', function(req, res) {
  res.json(handlePOST(req, res));
});

app.get('/classes/messages*', function(req, res) { //TODO: Handle queries
  res.json(handleGET(req, res));
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res) {
  res.sendFile(path.resolve('../client') + req.params[0]);
});


app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

const port = 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});
