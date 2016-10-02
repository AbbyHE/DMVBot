var db = [
  {
    question_text: "You may drive off of the paved roadway to pass another vehicle:",
    answer_key: 2,
    options: [
      'If the shoulder is wide enough to accommodate your vehicle.',
      'If the vehicle ahead of you is turning left.',
      'Under no circumstances.'
    ]
  },
  {
    question_text: 'You are approaching a railroad crossing with no warning devices and are unable to see 400 feet down the tracks in one direction. The speed limit is:',
    answer_key: 0,
    options: [
      '15 mph.',
      '20 mph.',
      '25 mph.'
    ]
  },
  {
    question_text: 'When parking your vehicle parallel to the curb on a level street:',
    answer_key: 1,
    options: [
      'Your front wheels must be turned toward the street.',
      'Your wheels must be within 18 inches of the curb.',
      'One of your rear wheels must touch the curb.'
    ]
  },
  {
    question_text: 'A white painted curb means:',
    answer_key: 1,
    options: [
      'Loading zone for freight or passengers.',
      'Loading zone for passengers or mail only.',
      'Loading zone for freight only.'
    ]
  },
  {
    question_text: 'California\'s "Basic Speed Law" says:',
    answer_key: 1,
    options: [
      'You should never drive faster than posted speed limits.',
      'You should never drive faster than is safe for current conditions.',
      'The maximum speed limit in California is 70 mph on certain freeways.'
    ]
  },
  {
    question_text: 'When driving in fog, you should use your:',
    answer_key: 2,
    options: [
      'Fog lights only.',
      'High beams.',
      'Low beams.'
    ]
  }
];

var QuestionBank = function () {};

QuestionBank.prototype.getRandomQuestion = function() {
  var idx = Math.floor(db.length * Math.random());
  return {
    idx: idx,
    question: db[idx]
  };
};

QuestionBank.prototype.getQuestion = function(idx) {
  return db[idx];
};

module.exports = new QuestionBank();
