'use strict';

var json2csv = require('json2csv'),
    Table    = require('cli-table'),
    path     = require('path'),
    fs       = require('fs');

var outputDirectory = path.join(__dirname, 'output');

var csvFile, gameDirectory, gameEvents, summaryFile;

var eventFields     = ['event', 'user', 'value', 'time'],
    eventFieldNames = ['Event', 'User', 'Value', 'Time'];

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

module.exports = {
  startGame:  startGame,
  endGame:    endGame,
  logEvents:  logEvents
};

function startGame(settings) {
  validateGameSettings(settings);

  console.log('[INFO] Game Started');

  var datetime = settings.startTime.replace(/ /g, '_').replace(/:/g, '-');

  gameDirectory = path.join(outputDirectory, datetime);
  csvFile       = path.join(gameDirectory, 'output.csv');
  summaryFile   = path.join(gameDirectory, 'summary.txt');
  gameEvents    = [{ event: 'GAME_START', time: settings.startTime }];

  if (!fs.existsSync(gameDirectory)) {
    fs.mkdirSync(gameDirectory);
    console.log('[INFO] Game Directory Created');
  }
}

function logEvents(events) {
  validateEvents(events);
  gameEvents = gameEvents.concat(events);
  events.forEach(function (o) {
    console.log('[INFO] Event: [' + o.user + '] ' + o.event + ' ' + (o.value || ''));
  });
}

function endGame(results) {
  validateGameResults(results);

  console.log('[INFO] Game Over');
  gameEvents.push({ event: 'GAME_END', time: results.endTime });

  console.log('[INFO] Final Score: ' + results.score);
  gameEvents.push({ event: 'FINAL_SCORE', value: results.score, time: results.endTime });

  results.users.forEach(function (user) {
    console.log('[INFO] Final TPS for ' + user.username + ': ' + user.tps);
    gameEvents.push({ event: 'FINAL_TPS', user: user.username, value: user.tps, time: results.endTime });
  });

  console.log('[INFO] Writing Summary: ' + summaryFile);
  fs.writeFileSync(summaryFile, generateSummary());

  console.log('[INFO] Generating CSV');
  json2csv({ data: gameEvents, fields: eventFields, fieldNames: eventFieldNames }, function(err, csv) {
    if (err) throw err;
    console.log('[INFO] Writing CSV: ' + csvFile);
    fs.writeFileSync(csvFile, csv);
  });

  console.log('[INFO] Clearing Event Cache');
  gameEvents = null;
  console.log('--------------------------');
  console.log('[INFO] Ready for next game');
}

function generateSummary() {
  var table = new Table({ head: eventFieldNames, colWidths: [20, 20, 10, 25] });
  gameEvents.forEach(function (event) {
    table.push([event.event, event.user || '', event.value || '', event.time]);
  });
  return table.toString();
}

function validateEvents(events) {
  if(!Array.isArray(events)) {
    throw new Error('Body must be an array of events');
  }
  events.forEach(function (event) {
    if (!event.event) {
      throw new Error('Event must must contain "event" property');
    }
    if (!event.time) {
      throw new Error('Event must must contain "time" property');
    }
  });
}

function validateGameSettings(settings) {
  if (!settings) {
    throw new Error('Body must be a game settings object');
  }
  if (!settings.startTime) {
    throw new Error('Body must must contain "startTime" property');
  }
}

function validateGameResults(results) {
  if (!gameEvents) {
    throw new Error('Game has not been started');
  }
  if (!results) {
    throw new Error('Body must be a game results object');
  }
  if (!results.endTime) {
    throw new Error('Body must must contain "endTime" property');
  }
}
