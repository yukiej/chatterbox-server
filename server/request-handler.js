const url = require('url');
const _ = require('underscore');

const { handleMessagePost, handleMessagesGet } = require('./handle-messages.js');

const routes = ['/classes/messages'];

// These headers will allow Cross-Origin Resource Sharing (CORS).
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

const requestHandler = (request, response) => {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  let statusCode = 200;
  let responseText = '';

  const urlParts = url.parse(request.url);

  if (_.contains(routes, urlParts.pathname)) {
    if (request.method === 'POST') {
      statusCode = 201;
      responseText = handleMessagePost(request, response);
    } else if (request.method === 'GET') {
      responseText = handleMessagesGet(request, response);
    }
  } else {
    statusCode = 404;
    responseText = 'URL not found';
  }

  const headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  response.writeHead(statusCode, headers);
  response.end(responseText);
};

exports.requestHandler = requestHandler;
