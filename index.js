#!/usr/bin/env node

var start = process.hrtime();
// Hurry up and start the timer!

var colors = require('colors');
var party = require('./party');

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
  process.exit();
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
