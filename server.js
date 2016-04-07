'use strict';

var http = require('http');
var querystring = require('querystring')
var portal = require('./portal');


function handle (req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk;
    });

    req.on('end', function() {
        portal(querystring.parse(body), function(error) {
          res.end(JSON.stringify({
            text: error || ''
          }));
        });
    });

  } else {
    return res.end();
  }
}

var port = process.env.PORT || 8888;
var server = http.createServer(handle);

server.listen(port, function() {
  console.log('Slack portal ' + port);
});
