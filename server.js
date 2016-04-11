'use strict';

const http = require('http');
const querystring = require('querystring')
const portal = require('./portal');


function handle (req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', function() {
        portal(querystring.parse(body), (error) => {
          res.end(JSON.stringify({
            text: error || ''
          }));
        });
    });

  } else {
    return res.end();
  }
}

const port = process.env.PORT || 8888;
const server = http.createServer(handle);

server.listen(port, () => {
  console.log(`Slack portal ${port}`);
});
