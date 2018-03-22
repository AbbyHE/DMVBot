const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  request = require('request');

var
  app = express(),
  questionBank = require('./question_bank.js'),
  responseBank = require('./response_bank.js');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json({ verify: verifyRequestSignature }));

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
  const data = req.body;
  if (data.object === 'page') {
    data.entry.forEach(function(pageEntry) {
      console.log('one new message coming');
      pageEntry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback) {
          receivedPostback(event);
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
  const senderID = event.sender.id;
  const message = event.message;
  const referral = event.referral;

  if (message.is_echo) {
    return;
  }

  if (referral) {
    console.log("referral");
    console.log(referral.ref);
  }

  if (message.quick_reply) {
    const payload = message.quick_reply.payload;
    const command = payload.split(' ');
    if (command[0] === 'next') {
      sendQuestion(senderID);
    } else if (command[0] === 'retry') {
      sendQuestion(senderID, parseInt(command[1]));
    } else {
      const question = questionBank.getQuestion(parseInt(command[0]));
      if (question.answer_key == command[1]) {
        sendNextQuestion(senderID);
      } else {
        sendRetryOrNextQuestion(senderID, command[0]);
      }
    }
  } else if (message.text) {
    sendExplanationAndNextQuestion(senderID);
  } else {
    // By default, ask user a question
    sendQuestion(senderID);
  }
}

/*
 * Handle received postback
 *
 */
function receivedPostback(event) {
  const senderID = event.sender.id;
  const payload = event.postback.payload;
  if (payload === 'next' || payload === 'NEW_USER') {
    sendQuestion(senderID);
  }
}

/*
 * Send a text message.
 *
 */
function sendTextMessage(recipientId, messageText) {
  const messageData = {
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
  const text = responseBank.getRandomRightAnwserReply();
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text,
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

function sendExplanationAndNextQuestion(recipientId) {
  const text = responseBank.getRandomPlayDumbReply();
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text,
      quick_replies: [
        {
          content_type: 'text',
          title: 'Yes',
          payload: 'next'
        }
      ]
    }
  };

  callSendAPI(messageData);
}

function sendRetryOrNextQuestion(recipientId, idx) {
  const text = responseBank.getRandomWrongAnwserReply();
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text,
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

/*
 * Verify that the callback came from Facebook.
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    console.error("Couldn't validate the signature.");
    throw new Error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
