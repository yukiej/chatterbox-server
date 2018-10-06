const url = require('url');
const fs = require('fs');

const handleMessages = (request, response) => {
  console.log('Got to handle messages', request.method);
  if (request.method === 'POST') {
    //TO DO: check for data size
    let requestBody = '';
    request.on('data', data => requestBody += data);
    request.on('end', () => {
      console.log(requestBody);

    });// augment object with TOD and ID
  } else if (request.method === 'GET') {
    // return all messages in the response

    // sort by something if the user wants
  }

};

const routes = {
  '/classes/messages': handleMessages,
};

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
  console.log('headers', request.headers);
  const route = routes[urlParts.pathname];

  if (route) {
    route(request, response);
    responseText = 'Successful!';
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
