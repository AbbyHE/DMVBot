const
  bodyParser = require('body-parser'),
  config = require('config'),
  express = require('express'),
  request = require('request');

var
  app = express(),
  questionBank = require('./question_bank.js');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());

/*
 * Some constants
 *
 */
const APP_SECRET = process.env.APP_SECRET
  ? process.env.APP_SECRET
  : config.get('appSecret');

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
  console.log(data);
  if (data.object === 'page') {
    data.entry.forEach(function(pageEntry) {
      pageEntry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Received unsupported event: ", event);
        }
      });
    });
    res.sendStatus(200);
  }
});

/*
 * Handle received messages
 *
 */
function receivedMessage(event) {
  console.log(event);
  var senderID = event.sender.id;
  var message = event.message;
  var quickReply = message.quick_reply;

  if (message.is_echo) {
    return;
  }

  // if (quickReply) {
    console.log("quick reply response");
    sendTextMessage(senderID, "Quick reply tapped");
  // } else {
  //   console.log("other response");
  //   // By default, always send a question.
    var question = questionBank.getRandomQuestion();
    console.slog('question');
    console.slog(question);
  //   sendQuestion(senderID, question);
  // }
}

/*
 * Send a text message.
 *
 */
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: 'DEVELOPER_DEFINED_METADATA'
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a question with Quick Reply buttons.
 *
 */
function sendQuestion(recipientId, question) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: question['question_text'],
      metadata: 'DEVELOPER_DEFINED_METADATA',
      quick_replies: [
        {
          'content_type': '[A] ' + question['options'][0],
          'title': "A",
          'payload': '0',
        },
        {
          'content_type': '[B] ' + question['options'][1],
          'title': 'B',
          'payload': '1'
        },
        {
          'content_type': '[C] ' + question['options'][2],
          'title': 'C',
          'payload': '2'
        }
      ]
    }
  };

  callSendAPI(messageData);
}

/*
 * Call Messenger send API
 *
 */
function callSendAPI(messageData) {
  console.log("sending...");
  request({
    uri: 'https://graph.facebook.com/v2.7/me/messages',
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
