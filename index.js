#!/usr/bin/env node

var start = process.hrtime();
// Hurry up and start the timer!

var colors = require('colors');
var leaderboard = require('./leaderboard');
var party = require('./party');
var userName = process.argv[2];

function displayTime (time) {
  var str = time + 's';
  if (time >= 1) {
    str = str.red + '\u0007';
  } else
  if (time > 0.9) {
    str = str.inverse;
  }
  console.log('\n\n' + str);
}

process.on('SIGINT', function () {
  var hrtime = process.hrtime(start);
  var time = hrtime[0] + hrtime[1] / 1000000000;
  displayTime(time);
  if (userName && userName.length > 0) {
    leaderboard.save(userName, time, Date.now(), function (err) {
      if (err) { throw err; }
      process.exit();
    });
  } else {
    process.exit();
  }
});

var messages = [
  'what are you waiting for?',
  'let\'s go already!',
  'i\'m waiting...',
  'you know it\'s ' + ' ctrl+c '.inverse + ', right?',
  'so...',
  'this is getting ' + 'boring'.underline + '.',
  'i need to find some way to pass the time'.rainbow,
  'OH I KNOW'.red,
  'let\'s throw a party!!'.red.inverse,
  party
];

var startDelay = Math.PI * 1000;
var count = 0;
var messageInterval = 3000;

messages.forEach(function (message) {
  var delay = startDelay + count * messageInterval + Math.random() * 1000;
  count++;
  (function (m, d) {
    setTimeout(function () {
      if (typeof m == 'string') {
        console.log('\ntime-cat: ' + m);
      } else
      if (typeof m == 'function') {
        m();
      }
    }, d);
  })(message, delay);
});

if (userName && userName == 'leaderboard') {
  leaderboard.get(function (err, entries) {
    if (err) { throw err; }
    if (process.argv[3] != 'all') {
      entries = entries.filter(function (entry) {
        return entry.score < 1;
      });
    }
    entries.sort(function (a, b) {
      return Math.abs(a.score-1) < Math.abs(b.score-1) ? -1 : 1;
    });
    var maxEntries = 7;
    if (entries.length > maxEntries) {
      entries.splice(maxEntries, entries.length - maxEntries);
    }
    var longestName = 1;
    entries.forEach(function (entry) {
      longestName = longestName > entry.name.length ? longestName : entry.name.length;
    });
    
    console.log('\nTop scores:');
    console.log('============================');
    entries.forEach(function (entry) {
      var name = entry.name;
      var whitespace = '';
      while (name.length + whitespace.length < longestName) {
        whitespace += ' ';
      }
      console.log(name + ':  ' + whitespace + entry.score);
    });
    console.log('============================\n');
    process.exit();
  });
}
