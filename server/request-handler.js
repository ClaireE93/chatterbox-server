const results = require('./messages');


const handlePOST = (req, res) => {
  const resultObj = JSON.parse(Object.keys(req.body)[0]);
  resultObj.createdAt = new Date();
  resultObj.objectId = results.length ? results[results.length - 1].objectId + 1 : 1;
  results.push(resultObj);
  const { method, url } = req;
  const responseBody = { method, url };
  responseBody.body = resultObj;
  return responseBody;
};

const handleGET = (req, res) => {
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

  return responseBody;
};

exports.handlePOST = handlePOST;
exports.handleGET = handleGET;
