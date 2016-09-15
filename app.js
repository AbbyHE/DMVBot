const express = require('express');
const config = require('config');

var app = express();

app.set('port', (process.env.PORT || 5000));

/*
 * Some constants
 *
 */
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN
  ? process.env.VALIDATION_TOKEN
  : config.get('validationToken');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
  ? process.env.PAGE_ACCESS_TOKEN
  : config.get('pageAccessToken');

/*
 * Kitty welcome screen
 *
 */
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/assets/coffee_cat.jpg');
});

/*
 * Wehbook verification
 *
 */
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

/*
 * Listen to webhook events
 *
 */
app.post('/webhook', function(req, res) {
  var data = req.body;

  if (data.object == 'page') {
    data.entry.forEach(function(pageEntry) {
      pageEntry.messaging.forEach(function(event) {
        if (event.message) {
          var senderID = event.sender.id;
          var messageData = {
            recipient: {
              id: senderID
            },
            message: {
              text: 'hualala',
              metadata: 'DEVELOPER_DEFINED_METADATA'
            }
          };
          callSendAPI(messageData);
        } else {
          console.log('Received unsupported messagingEvent: ', messagingEvent);
        }
      });
    });
    res.sendStatus(200);
  }
});

/*
 * Call Messenger send API
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  }, function(error, res, body) {
    if (error) {
      console.error(res.error);
    }
  });
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
