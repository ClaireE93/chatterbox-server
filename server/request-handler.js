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











exports.handlePOST = handlePOST;
