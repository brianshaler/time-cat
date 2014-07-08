#!/usr/bin/env node

var start = process.hrtime();
// Hurry up and start the timer!

var colors = require('colors');
var leaderboard = require('./leaderboard');
var party = require('./party');
var userName;
if (process.argv[0] == 'node') {
  userName = process.argv[2];
} else {
  userName = process.argv[1];
}
var showAll = process.argv.indexOf('all') != -1;
var showUnique = process.argv.indexOf('unique') != -1;
var showAverage = process.argv.indexOf('average') != -1;

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
    if (!showAll) {
      entries = entries.filter(function (entry) {
        return entry.score < 1;
      });
    }
    entries.sort(function (a, b) {
      return Math.abs(a.score-1) < Math.abs(b.score-1) ? -1 : 1;
    });
    
    if (showAverage) {
      var byName = entries.reduce(function (memo, entry) {
        if (!memo[entry.name]) {
          memo[entry.name] = [0, 0, []];
        }
        if (entry.score < 2) {
          memo[entry.name][0]++;
          memo[entry.name][1] += Math.abs(entry.score - 1);
          memo[entry.name][2].push(entry.score);
        }
        return memo;
      }, {});
      var averages = {};
      for (var name in byName) {
        averages[name] = byName[name][1] / byName[name][0];
        if (!showAll) {
          averages[name] = 1 - averages[name];
        }
      }
    }
    
    var maxEntries = 10;
    var filteredEntries = [];
    var names = [];
    for (var i=0; filteredEntries.length < 10 && i<entries.length; i++) {
      if (showUnique) {
        if (names.indexOf(entries[i].name) != -1) {
          continue;
        }
        names.push(entries[i].name);
      }
      filteredEntries.push(entries[i]);
    }
    entries = filteredEntries;
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
      var line = name + ':  ' + whitespace + entry.score;
      if (showAverage) {
        line += ' (' + (showAll ? '±' : '') + Math.round(averages[name]*1000)/1000 + ')';
      }
      console.log(line);
    });
    console.log('============================\n');
    process.exit();
  });
}
