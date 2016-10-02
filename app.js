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
  if (data.object === 'page') {
    data.entry.forEach(function(pageEntry) {
      pageEntry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log('Received unsupported event: ', event);
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
  var senderID = event.sender.id;
  var message = event.message;

  if (message.is_echo) {
    return;
  }

  if (message.quick_reply) {
    var payload = message.quick_reply.payload;
    var command = payload.split(' ');
    if (command[0] === 'next') {
      sendQuestion(senderID);
    } else if (command[0] === 'retry') {
      sendQuestion(senderID, command[1]);
    } else {
      var question = questionBank.getQuestion(command[0]);
      if (question.answer_key === command[1]) {
        sendNextQuestion(senderID);
      } else {
        sendRetryOrNextQuestion(senderID, command[0]);
      }
    }
  } else {
    // By default, ask user a question
    sendQuestion(senderID);
  }
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
      text: messageText
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a question with Quick Reply buttons.
 *
 */
function sendQuestion(recipientId, idx) {
  var question;
  if (idx === undefined) {
    var result = questionBank.getRandomQuestion();
    question = result.question;
    idx = result.idx;
  } else {
    question = questionBank.getQuestion(idx);
  }
  var text = question.question_text
    + '\n[A] ' + question.options[0]
    + '\n[B] ' + question.options[1]
    + '\n[C] ' + question.options[2];
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text,
      quick_replies: [
        {
          content_type: 'text',
          title: 'A',
          payload: idx + ' 0'
        },
        {
          content_type: 'text',
          title: 'B',
          payload: idx + ' 1'
        },
        {
          content_type: 'text',
          title: 'C',
          payload: idx + ' 2'
        }
      ]
    }
  };

  callSendAPI(messageData);
}

function sendNextQuestion(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'Woah, you got it right!',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Next Question',
          payload: 'next'
        }
      ]
    }
  };

  callSendAPI(messageData);
}

function sendRetryOrNextQuestion(recipientId, idx) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'Oops, wrong answer.',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Next Question',
          payload: 'next'
        },
        {
          content_type: 'text',
          title: 'Retry',
          payload: 'retry' + ' ' + idx
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
