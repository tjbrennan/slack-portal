'use strict';

const portal = require('./portal');
const querystring = require('querystring');


exports.handle = function (event, context, callback) {
  const body = querystring.parse(event.body);

  portal(body, callback);
}
