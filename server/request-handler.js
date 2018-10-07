const url = require('url');
const _ = require('underscore');

const { handleMessagePost, handleMessagesGet, messageOptions } = require('./handle-messages.js');
const { options, routes } = require('./options.js');
const { handleSite, isSite } = require('./handle-site.js');

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

  const extension = url.parse(request.url).pathname;

  const headers = defaultCorsHeaders;
  let contentType = 'application/json';
  if (request.method === 'GET' && isSite(extension)) {
    ({ responseText, contentType } = handleSite(request, response, extension));
  } else if (request.method === 'POST' && extension === routes.messages) {
    statusCode = 201;
    responseText = handleMessagePost(request, response);
  } else if (request.method === 'GET' && extension === routes.messages) {
    responseText = handleMessagesGet(request, response);
  } else if (request.method === 'OPTIONS') {
    if (options[extension]) {
      responseText = JSON.stringify(options[extension]);
    } else {
      responseText = 'This url does not exist.';
    }
  } else {
    statusCode = 404;
    responseText = 'URL not found';
  }

  headers['Content-Type'] = contentType;
  response.writeHead(statusCode, headers);
  response.end(responseText);
};

exports.requestHandler = requestHandler;
