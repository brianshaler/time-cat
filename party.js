var colors = require('colors');

var partyMessages = [
  '~~ party time! ~~',
  '* PARTY *',
  'partypartyparty',
  'woo hoo!',
  'w00t!',
  'do do doooo',
  'par tay',
  '- P - A - R - T - Y -',
  'PARTY TIP: Party.',
  'time-cat-party-time',
  'console.party(\'yay!\');',
  'while (true) { party(); }',
  'module.exports = party;',
  'ain\'t no party like a time-cat party'
];

var counter = 2;
function party () {
  var limit = partyMessages.length < counter ? partyMessages.length : counter;
  var rand = Math.floor(Math.random()*limit);
  var str = String(partyMessages[rand]);
  var ln = str.length + Math.random() * (80 - str.length);
  while (str.length < ln) {
    str = ' ' + str;
  }
  console.log('\n' + str.rainbow);
  setTimeout(party, 200);
  counter++;
  if (counter > partyMessages.length * 2) {
    counter = 2;
  }
}

if (process.argv[2] == 'party') {
  party();
}

module.exports = party;
