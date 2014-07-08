var fs = require('fs');
var path = require('path');
//var tilde = require('tilde-expansion');

var leaderboard = '/tmp/time-cat.txt';

module.exports = {
  save: function (name, score, time, next) {
    var line = name + ',' + score + ',' + time + '\n';
    fs.appendFile(leaderboard, line, next);
  },
  get: function (next) {
    var file = fs.createReadStream(leaderboard, {encoding: 'utf8'});
    var data = '';
    file.on('data', function (chunk) {
      data += chunk;
    });
    file.on('end', function () {
      var lines = data.split('\n');
      var entries = [];
      lines.forEach(function (line) {
        var fields = line.split(',');
        if (fields.length == 3) {
          entries.push({
            name: fields[0],
            score: fields[1],
            time: fields[2]
          });
        }
      });
      next(null, entries);
    });
  }
};