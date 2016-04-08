'use strict';

var got = require('got');
var emojiList = require('emoji-list');
var config = require('./config.json');
var log = config.logging;


function sendMessages (token, teams, payload, callback) {
  var teamTokens = Object.keys(teams);
  var responseCount = 1;

  teamTokens.forEach(function(e) {
    if (e !== token) {
      console.log(teams[e], payload);
      got(teams[e].incomingWebhookUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        retries: 2
      }, function(error, data, response) {
        log && console.log([
          'Message',
          'to',
          teams[e].name,
          response.statusCode,
          error || data
        ].join(' '));

        if (++responseCount === teamTokens.length) {
            return callback();
        }
      });
    }
  });
}

function getEmoji (userId) {
  var sum = 0;

  for (var i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }

  return emojiList[sum % emojiList.length];
}

module.exports = function (body, callback) {
  log && console.log(new Date(), body);

  body = body || {};

  var teams = config.teams;
  var token = body.token;
  var userId = body.user_id || '';
  var payload;

  if (teams[token]) {
    // modifying this may result in an infinite loop
    if (body.user_name !== 'slackbot') {
      payload = {
        username: body.user_name,
        text: body.text,
        icon_emoji: getEmoji(userId)
      };

      sendMessages(token, teams, payload, callback);
    } else {
      return callback();
    }
  } else {
    return callback(new Error('Invalid token'));
  }
};
