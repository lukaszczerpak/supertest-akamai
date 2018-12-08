const supertest = require('supertest');
const use = require('superagent-use');
const captureError = require('supertest-capture-error');

const PRAGMA = [
  'akamai-x-get-cache-key',
  'akamai-x-cache-on',
  'akamai-x-cache-remote-on',
  'akamai-x-get-extracted-values',
  'akamai-x-get-true-cache-key',
  'akamai-x-check-cacheable',
  'akamai-x-serial-no',
  'akamai-x-get-request-id'
].join(',');

var akamaiRequest = function (host) {
  return function akamaiRequest (req) {
    req.header.host = host;
    req.header.pragma = PRAGMA;
    return req;
  };
};

module.exports = function (url, connectTo) {
  let targetUrl = url;
  let originalHost;

  if (connectTo) {
    // eslint-disable-next-line no-useless-escape
    let matches = url.match(/^(https?):\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    let proto = matches && matches[1];
    originalHost = matches && matches[2];
    targetUrl = `${proto}://${connectTo}`;
  }

  let request = use(supertest(targetUrl))
    .use(captureError((error, test) => {
      error.message += ` at ${test.url}\n` +
                    `Response Status:\n${test.res.statusCode}\n` +
                    `Response Headers:\n${JSON.stringify(test.res.headers, null, 2)}\n` +
                    `Response Body:\n${test.res.text || '<empty>\n'}`;
      error.stack = ''; // this is useless anyway
    })
    );

  if (connectTo) {
    request.use(akamaiRequest(originalHost));
  }

  return request;
};
