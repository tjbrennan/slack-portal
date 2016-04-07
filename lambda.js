'use strict';

var portal = require('./portal');
var querystring = require('querystring');


exports.handle = function (event, context) {
  var body = querystring.parse(event.body);
  portal(body, function(error) {
    if (error) {
      context.fail(error);
    } else {
      context.succeed();
    }
  });
}
