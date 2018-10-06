const fs = require('fs');
const path = require('path');

const messageFile = path.resolve(__dirname, 'data/messages.json');
const messages = JSON.parse(fs.readFileSync(messageFile, 'utf8'));

const messageCleaner = ({username = '',
  text = '', 
  roomname = '', 
  createdAt = Date.now(), 
  objectId = Object.keys(messages).length
}) => {
  messages.results.splice(0, 0, {username, text, roomname, createdAt, objectId}); 
};

exports.handleMessagePost = (request, response) => {
  let requestBody = '';
  request.on('data', data => requestBody += data);
  request.on('end', () => {
    messageCleaner(JSON.parse(requestBody));
  });

  // augment object with TOD and ID

};

exports.handleMessagesGet = (request, response) => {
  return JSON.stringify(messages);
};
