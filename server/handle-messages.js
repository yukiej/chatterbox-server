const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const messageFile = path.resolve(__dirname, 'data/messages.json');
const messages = JSON.parse(fs.readFileSync(messageFile, 'utf8'));

const messageCleaner = ({username = '',
  text = '', 
  roomname = '', 
  createdAt = Date.now(), 
  objectId = Object.keys(messages.results).length
}) => {
  username = _.escape(username);
  text = _.escape(text);
  roomname = _.escape(roomname);
  messages.results.splice(0, 0, {username, text, roomname, createdAt, objectId}); 
};

const messageSorter = (flag) => {
  if (flag in messages.results[0]) {
    messages.results.sort((m1, m2) => {
      if (m1[flag] < m2[flag]) {
        return -1;
      } else if (m1[flag] > m2[flag]) {
        return 1;
      } else {
        return 0;
      }
    });
  }
};

exports.writeMessages = () => {
  fs.writeFile(messageFile, JSON.stringify(messages), 'utf8', () => {});
};

exports.handleMessagePost = (request, response) => {
  let requestBody = '';
  request.on('data', data => requestBody += data);
  request.on('end', () => {
    messageCleaner(JSON.parse(requestBody));
  });

  return JSON.stringify(messages.results[0]);
};

exports.handleMessagesGet = (request, response) => {
  let requestBody = '';
  request.on('data', data => requestBody += data);
  request.on('end', () => {
    if (requestBody !== '') {
      const orderFlag = JSON.parse(requestBody).order.substring(1);
      messageSorter(orderFlag);
    }
  });
  
  return JSON.stringify(messages);
};
