/* Import node's http module: */
const http = require('http');
const handler = require('./request-handler');
const express = require("express");
const app = express();
const path = require('path');
const results = require('./messages');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* serves main page */
app.get("/", function(req, res) {
  console.log('dirname is', __dirname + '/../client');
  res.sendFile(path.resolve('../client/index.html'));
});



app.post("/classes/messages", function(req, res) {
  console.log('request body is', Object.keys(req.body)[0]);
  const resultObj = JSON.parse(Object.keys(req.body)[0]);
  resultObj.createdAt = new Date();
  resultObj.objectId = results.length ? results[results.length - 1].objectId + 1 : 1;
  results.push(resultObj);
  const { method, url } = req;
  const responseBody = { method, url };
  responseBody.body = resultObj;
  res.json(responseBody);
});










app.get("/classes/messages*", function(req, res) { //TODO: Handle queries
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
app.get(/^(.+)$/, function(req, res){
  console.log('static file request : ' + req.params[0]);
  res.sendFile(path.resolve('../client') + req.params[0]);
});


app.options("/*", function(req, res, next){
  console.log('Asking for options');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});



var port = 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});




// if (path === '/' || path.match(/\.(?=css$|js$|gif$)/g) !== null) {
//   let base = '../client';
//   base += path === '/' ? '/index.html' : path;
//   fs.readFile(base, function (err, data) {
//     if (err) {
//       return console.error(err);
//     }
//     response.end(data.toString());
//   });
// } else
// if (!url.startsWith("/classes/messages")) {
//   console.log('WRONG URL', url);
//   response.writeHead(404, headers);
//   response.end();
// } else if (method === 'GET' || method === "OPTIONS") {
//   response.writeHead(200, headers);
//   let responseBody;
//   if (queryArray.query['order'] && queryArray.query['order'] === '-createdAt') {
//     const reverseResults = results.slice().reverse();
//     responseBody = { method, url };
//     responseBody.results = reverseResults;
//   } else {
//     responseBody = { method, url, results };
//   }
//   response.end(JSON.stringify(responseBody));
// } else if (method === 'POST') {
//   let body = [];
//
//   request.on('data', (chunk) => {
//     body.push(chunk);
//   });
//
//   request.on('error', (err) => {
//     // This prints the error message and stack trace to `stderr`.
//     console.error(err.stack);
//     response.end('Error 404');
//   });
//
//   request.on('end', () => {
//     const resultObj = JSON.parse(body.toString());
//     resultObj.createdAt = new Date();
//     resultObj.objectId = results.length ? results[results.length - 1].objectId + 1 : 1;
//     results.push(resultObj);
//     response.writeHead(201, headers);
//     const responseBody = { method, url };
//     responseBody.body = resultObj;
//     response.end(JSON.stringify(responseBody));
//   });
// } else if (method === 'DELETE') { //NOTE: To delete, pass in object id url?objectId=[num]
//   let deletedMessage;
//   let isFound = false;
//   if (queryArray.query['objectId']) {
//     const targetId = Number(queryArray.query['objectId']);
//     for (let i = 0; i < results.length; i++) {
//       if (results[i].objectId === targetId) {
//         deletedMessage = results.splice(i, 1);
//         isFound = true;
//       }
//     }
//     if (isFound) {
//       response.writeHead(201, headers);
//       const responseBody = { method, url };
//       responseBody.body = deletedMessage;
//       response.end(JSON.stringify(responseBody));
//     } else {
//       response.writeHead(400, headers);
//       response.end();
//     }
//   } else {
//     response.writeHead(400, headers);
//     response.end();
//   }
//
// }
