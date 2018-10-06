const fs = require('fs');

exports.handleMessagePost = (request, response) => {
  let requestBody = '';
  request.on('data', data => requestBody += data);
  request.on('end', () => {
    console.log(requestBody);
  });// augment object with TOD and ID
};

exports.handleMessagesGet = (request, response) => {
  const data = '{}';
  return data;
};
