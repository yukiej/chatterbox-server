const fs = require('fs');
const path = require('path');

const messageFile = path.resolve(__dirname, 'data/messages.json');

exports.handleMessagePost = (request, response) => {
  let requestBody = '';
  request.on('data', data => requestBody += data);
  request.on('end', () => {
    console.log(requestBody);
  });// augment object with TOD and ID
};

exports.handleMessagesGet = (request, response) => {
  const data = fs.readFileSync(messageFile, 'utf8');
  console.log(data);
  return data;
};
