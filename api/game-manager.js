'use strict';

var json2csv = require('json2csv'),
    Table    = require('cli-table'),
    path     = require('path'),
    fs       = require('fs');

var outputDirectory = path.join(__dirname, 'output');

var csvFile, datetime, gameDirectory, gameEvents, summaryFile;

var eventFields     = ['event', 'player', 'value', 'time'],
    eventFieldNames = ['Event', 'Player', 'Value', 'Time'];

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

module.exports = {
  startGame:  startGame,
  endGame:    endGame,
  logEvents:  logEvents
};

// GAME OUTPUT EXAMPLE FORMAT
// +-----------------+---------------+-------+---------------------+
// | Event           | Player        | Value | Time                |
// +-----------------+---------------+-------+---------------------+
// | GAME_START      |               |       | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser001 | RIGHT | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser002 | RIGHT | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser003 | DOWN  | 2015-10-19_11-21-55 |
// | ACTION_SELECTED | TwitchUser001 | RIGHT | 2015-10-19_11-21-55 |
// | ACTION_SELECTED | TwitchUser002 | RIGHT | 2015-10-19_11-21-55 |
// | GAME_ACTION     | TwitchUser002 | RIGHT | 2015-10-19_11-21-55 |
// | APPLE_COLLECTED | TwitchUser002 |       | 2015-10-19_11-21-55 |
// | TPS_UPDATE      | TwitchUser002 | 0.25  | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser003 | LEFT  | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser001 | DOWN  | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser002 | DOWN  | 2015-10-19_11-21-55 |
// | ACTION_SELECTED | TwitchUser002 | UP    | 2015-10-19_11-21-55 |
// | ACTION_SELECTED | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | APPLE_AVOIDED   | TwitchUser003 |       | 2015-10-19_11-21-55 |
// | WALL_COLLISION  | TwitchUser003 |       | 2015-10-19_11-21-55 |
// | TPS_UPDATE      | TwitchUser003 | 0.40  | 2015-10-19_11-21-55 |
// | GAME_ACTION     | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | GAME_END        |               |       | 2015-10-19_11-21-55 |
// +-----------------+---------------+-------+---------------------+

function startGame(settings) {
  validateGameSettings(settings);

  console.log('[INFO] Game Started');

  var datetime = settings.startTime.replace(/ /g, '_').replace(/:/g, '-');

  gameDirectory = path.join(outputDirectory, datetime);
  csvFile       = path.join(gameDirectory, 'output.csv');
  summaryFile   = path.join(gameDirectory, 'summary.txt');
  gameEvents    = [{ event: 'GAME_START', time: settings.startTime }];

  console.log(gameEvents);

  if (!fs.existsSync(gameDirectory)) {
    fs.mkdirSync(gameDirectory);
    console.log('[INFO] Game Directory Created');
  }
}

function logEvents(events) {
  validateEvents(events);
  console.log('[INFO] Events Received');
  gameEvents = gameEvents.concat(events);
}

function endGame(results) {
  validateGameResults(results);

  console.log('[INFO] Game Ended');
  gameEvents.push({ event: 'GAME_END', time: results.endTime });

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
}

function generateSummary() {
  var table = new Table({ head: eventFieldNames, colWidths: [20, 20, 10, 25] });
  for (let event of gameEvents) {
    table.push([event.event, event.player || '', event.value || '', event.time]);
  }
  return table.toString();
}

function validateEvents(events) {
  if(!Array.isArray(events)) {
    throw new Error('Body must be an array of events');
  }  
  for (let event of events) {
    if (!event.event) {
      throw new Error('Event must must contain "event" property');
    }
    if (!event.time) {
      throw new Error('Event must must contain "time" property');
    }
  }
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
