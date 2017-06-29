const rightAnwserReplies = [
  'Woah, you got it right!',
  'Bingo! You are right.',
  'Yes! That\'s the right answer.'
];

const wrongAnwserReplies = [
  'Oops, wrong answer.',
  'Hmm... that doesn\'t seem right.'
];

const playDumbReplies = [
  'What do I know? I am just a dumb bot. But I can help prepare for your DMV written tests. Would you like a sample question?',
  'I am not sure I undestand that. But hey, how about a sample DMV question?',
  'My AI is still developing. But I can help prepare for your DMV written tests. Would you like a sample question?'
];

function getRandomRightAnwserReply() {
  var idx = Math.floor(rightAnwserReplies.length * Math.random());
  return {
    idx: idx,
    reply: rightAnwserReplies[idx]
  };
};

function getRandomWrongAnwserReply() {
  var idx = Math.floor(wrongAnwserReplies.length * Math.random());
  return {
    idx: idx,
    reply: wrongAnwserReplies[idx]
  };
};

function getRandomPlayDumbReply() {
  var idx = Math.floor(playDumbReplies.length * Math.random());
  return {
    idx: idx,
    reply: playDumbReplies[idx]
  };
};

module.exports = {
  getRandomRightAnwserReply,
  getRandomWrongAnwserReply,
  getRandomPlayDumbReply
};
