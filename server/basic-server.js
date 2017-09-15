/* Import node's http module: */
const http = require('http');
const handler = require('./request-handler');
const express = require('express');
const app = express();
const path = require('path');
const results = require('./messages');
const bodyParser = require('body-parser');
const router = express.Router();
const handlePOST = handler.handlePOST;

console.log('handlePOST is', handlePOST);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* serves main page */
app.get('/', function(req, res) {
  res.sendFile(path.resolve('../client/index.html'));
});

app.post('/classes/messages', function(req, res) {
  // const resultObj = JSON.parse(Object.keys(req.body)[0]);
  // resultObj.createdAt = new Date();
  // resultObj.objectId = results.length ? results[results.length - 1].objectId + 1 : 1;
  // results.push(resultObj);
  // const { method, url } = req;
  // const responseBody = { method, url };
  // responseBody.body = resultObj;
  res.json(handlePOST(req, res));
});

app.get('/classes/messages*', function(req, res) { //TODO: Handle queries
  const query = req.query;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.setHeader('Content-Type', 'application/json');
  const { method, url } = req;
  const responseBody = { method, url};
  if (query.order === '-createdAt') {
    const reversedResults = results.slice().reverse();
    responseBody.results = reversedResults;
  } else {
    responseBody.results = results;
  }
  res.json(responseBody);
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
