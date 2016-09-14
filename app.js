var express = require('express');
var app = express();

app.get('/', function(req,res) {
    res.send('Hello world');
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'dmvbot') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

var server = app.listen(3000, function() {
    console.log("We have started our server on port 3000");
});
