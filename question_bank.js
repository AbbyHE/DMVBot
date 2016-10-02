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
  },
  {
    question_text: 'A school bus ahead of you in your lane is stopped with red lights flashing. You should:',
    answer_key: 2,
    options: [
      'Stop, then proceed when you think all of the children have exited the bus.',
      'Slow to 25 MPH and pass cautiously.',
      'Stop as long as the red lights are flashing.'
    ]
  },
  {
    question_text: 'You just sold your vehicle. You must notify the DMV within ___ days.',
    answer_key: 0,
    options: [
      '5',
      '10',
      '15'
    ]
  },
  {
    question_text: 'To avoid last minute moves, you should be looking down the road to where your vehicle will be in about ___.',
    answer_key: 1,
    options: [
      '5 to 10 seconds',
      '10 to 15 seconds',
      '15 to 20 seconds'
    ]
  },
  {
    question_text: 'You are about to make a left turn. You must signal continuously during the last ____ feet before the turn.',
    answer_key: 2,
    options: [
      '50',
      '75',
      '100'
    ]
  },
  {
    question_text: 'Which of the following statements about blind spots is true?',
    answer_key: 1,
    options: [
      'They are eliminated if you have one outside mirror on each side of the vehicle.',
      'Large trucks have bigger blind spots than most passenger vehicles.',
      'Blind spots can be checked by looking in your rear view mirrors.'
    ]
  },
  {
    question_text: 'You have been involved in a minor traffic collision with a parked vehicle and you can\'t find the owner. You must:',
    answer_key: 2,
    options: [
      'Leave a note on the vehicle.',
      'Report the accident without delay to the city police or, in unincorporated areas, to the CHP.',
      'Both of the above.'
    ]
  },
  {
    question_text: 'Unless otherwise posted the speed limit in a residential area is ____.',
    answer_key: 1,
    options: [
      '20 mph',
      '25 mph',
      '30 mph'
    ]
  },
  {
    question_text: 'You may legally block an intersection:',
    answer_key: 2,
    options: [
      'When you entered the intersection on the green light.',
      'During rush hour traffic.',
      'Under no circumstances.'
    ]
  },
  {
    question_text: 'When parking uphill on a two-way street with no curb, your front wheels should be:',
    answer_key: 1,
    options: [
      'Turned to the left (toward the street).',
      'Turned to the right (away from the street).',
      'Parallel with the pavement.'
    ]
  },
  {
    question_text: 'With a Class C drivers license a person may drive:',
    answer_key: 0,
    options: [
      'A 3-axle vehicle if the Gross Vehicle Weight is less than 6,000 pounds.',
      'Any 3-axle vehicle regardless of the weight.',
      'A vehicle pulling two trailers.'
    ]
  },
  {
    question_text: 'To turn left from a multilane one-way street onto a one-way street, you should start your turn from:',
    answer_key: 1,
    options: [
      'Any lane (as long as it is safe).',
      'The lane closest to the left curb.',
      'The lane in the center of the road.'
    ]
  },
  {
    question_text: 'Roadways are the most slippery:',
    answer_key: 2,
    options: [
      'During a heavy downpour.',
      'After it has been raining for awhile.',
      'The first rain after a dry spell.'
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
