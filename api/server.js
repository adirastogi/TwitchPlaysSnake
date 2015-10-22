'use strict';

var bodyParser = require('body-parser'),
    express    = require('express'),
    moment     = require('moment'),
    path       = require('path'),
    fs         = require('fs');

var GameManager = require('./game-manager.js');

var app = express();

app.use(bodyParser.json({ type: 'application/json' }));

app.post('/game/start', function (req, res) {
  try {
    GameManager.startGame(req.body);
    res.sendStatus(200);
  }
  catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

app.post('/game/event', function (req, res) {
  try {
    GameManager.logEvents(req.body);
    res.sendStatus(200);
  }
  catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

app.post('/game/end', function (req, res) {
  try {
    GameManager.endGame(req.body);
    res.sendStatus(200);
  }
  catch (error) {
    res.status(400);
    res.send(error.message);
  }
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Data Logging app listening on port %s', port);
});
