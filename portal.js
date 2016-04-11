'use strict';

const got = require('got');
const emojiList = require('emoji-list');
const config = require('./config.json');
const log = config.logging;


function sendMessages (token, teams, payload, callback) {
  const teamTokens = Object.keys(teams);
  let responseCount = 1;

  teamTokens.forEach(e => {
    if (e !== token) {

      got(teams[e].incomingWebhookUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        retries: 2
      }).then((response) => {
        log && console.log(`Message to ${teams[e].name} ${response.statusCode} {response.body}`);

        if (++responseCount === teamTokens.length) {
            return callback();
        }
      }).catch((error) => {
        log && console.log(`Message to ${teams[e].name} ${error.response.statusCode} {error.response.body}`);
      });
    }
  });
}

function getEmoji (userId) {
  // this is probably slow
  let charCodeArray = [];
  let emoji;

  for (let i = 0; i < userId.length; i++) {
    charCodeArray.push(userId.charCodeAt(i));
  }

  emoji = emojiList[charCodeArray.join('') % emojiList.length];

  return emoji;
}

module.exports = function (body, callback) {
  log && console.log(new Date(), body);

  body = body || {};

  const teams = config.teams;
  const token = body.token;
  const userId = body.user_id || '';
  let payload;

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
    console.log(body, teams, token);
    return callback(new Error('Invalid token'));
  }
};
