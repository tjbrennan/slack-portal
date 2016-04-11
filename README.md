Slack Portal
===============

Creates a link between two or more teams in slack.

Can be deployed as a server or AWS Lambda.

Configure an outgoing webhook and incoming webhook to point to a single channel on each team. This channel will be the "portal". Add the necessary info to `config.json` once this is completed (team name is optional and only used for logging and sanity), then direct each outgoing webhook to the server.

Use `npm run zip` to create a zip for upload to AWS Lambda.
