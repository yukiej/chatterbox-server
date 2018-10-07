var handler = require('../request-handler');
var expect = require('chai').expect;
var _ = require('underscore');
var stubs = require('./Stubs');

describe('Node Server Request Listener Function', function() {
  it('NEW Should answer OPTIONS requests for /classes/messages with a 200 status code', function() {
    var req = new stubs.request('/classes/messages', 'OPTIONS');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    const optionsInfo = JSON.parse(res._data);
    expect(res._responseCode).to.equal(200);
    expect('GET' in optionsInfo).to.equal(true);
    expect('POST' in optionsInfo).to.equal(true);
    expect(res._ended).to.equal(true);
  });

  it('Should answer GET requests for /classes/messages with a 200 status code', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
  });

  it('Should send back parsable stringified JSON', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(JSON.parse.bind(this, res._data)).to.not.throw();
    expect(res._ended).to.equal(true);
  });

  it('Should send back an object', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.be.an('object');
    expect(res._ended).to.equal(true);
  });

  it('Should send an object containing a `results` array', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.have.property('results');
    expect(parsedBody.results).to.be.an('array');
    expect(res._ended).to.equal(true);
  });

  it('Should accept posts to /classes/messages', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    expect(res._ended).to.equal(true);
  });

  it('NEW: Should return message after successful POST', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);
    const responseMessage = JSON.parse(res._data);

    expect(res._responseCode).to.equal(201);
    expect(responseMessage.username).to.equal('Jono');
    expect(responseMessage.text).to.equal('Do my bidding!');
    expect(res._ended).to.equal(true);
  });

  it('Should respond with messages that were previously posted', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);
    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data).results;
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('Jono');
    expect(messages[0].text).to.equal('Do my bidding!');
    expect(res._ended).to.equal(true);
  });

  it('Should 404 when asked for a nonexistent file', function() {
    var req = new stubs.request('/arglebargle', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);
    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
  });

  it('NEW: Should scrub inputs from client', function() {
    var stubMsg = {
      username: 'Curly, Larry & Moe',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data).results;
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('Curly, Larry &amp; Moe');
    expect(messages[0].text).to.equal('Do my bidding!');
    expect(res._ended).to.equal(true);
  });

  it('NEW: Should give each message a unique identifier', function() {
    var stubMsg = {
      username: 'new friend',
      text: 'Lets go!'
    };
    var reqP = new stubs.request('/classes/messages', 'POST', stubMsg);
    var resP = new stubs.response();
    handler.requestHandler(reqP, resP);

    expect(resP._responseCode).to.equal(201);

    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    const messages = JSON.parse(res._data).results;
    const ids = _.map(messages, (message) => message.objectId);

    expect(messages.length).to.be.above(0);
    expect(_.uniq(ids).length).to.equal(messages.length);
    expect(res._ended).to.equal(true);
  });

  it('NEW: Should sort messages by request flag createdAt', function() {
    req = new stubs.request('/classes/messages', 'GET', { order: '-createdAt' });
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data).results;
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('yuki');
    expect(messages[0].text).to.equal('Im first!');
    expect(messages[2].username).to.equal('lisa');
    expect(messages[2].text).to.equal('hihihi');
    expect(res._ended).to.equal(true);
  });

  it('NEW: Should sort messages by request flag objectId', function() {
    req = new stubs.request('/classes/messages', 'GET', { order: '-objectId' });
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data).results;
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('lisa');
    expect(messages[0].text).to.equal('fun times');
    expect(messages[2].username).to.equal('yuki');
    expect(messages[2].text).to.equal('cool');
    expect(res._ended).to.equal(true);
  });

  it('NEW: Should return messages even if request flag does not exist', function() {
    req = new stubs.request('/classes/messages', 'GET', { order: '-garbage' });
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data).results;
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('lisa');
    expect(messages[0].text).to.equal('fun times');
    expect(messages[2].username).to.equal('yuki');
    expect(messages[2].text).to.equal('cool');
    expect(res._ended).to.equal(true);
  });

});
