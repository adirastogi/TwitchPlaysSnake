'use strict';

var bodyParser = require('body-parser'),
    express    = require('express'),
    moment     = require('moment'),
    path       = require('path'),
    fs         = require('fs');

var datetime = moment().format('YYYY-MM-DD_HH-mm-ss');

var actionFileHeader = 'timestamp, username, action\n';

var outputDirPath   = path.join(__dirname, 'output'),
    datetimeDirPath = path.join(outputDirPath, datetime),
    actionsFilePath = path.join(datetimeDirPath, 'actions.txt');

if (!fs.existsSync(outputDirPath))   fs.mkdirSync(outputDirPath);
if (!fs.existsSync(datetimeDirPath)) fs.mkdirSync(datetimeDirPath);
if (!fs.existsSync(actionsFilePath)) fs.writeFileSync(actionsFilePath, actionFileHeader);

var app = express();

app.use(bodyParser.json({ type: 'application/json' }));

app.post('/action', function(req, res) {
  var actions = '';

  if (Array.isArray(req.body)) {
    req.body.forEach(function (o, index) {
      actions += o.timestamp + ', ' + o.user.username + ', ' + o.action;
      if (index < req.body.length) actions += '\n';
    });
  }
  else {
    actions = JSON.stringify(req.body);
  }

  fs.appendFile(actionsFilePath, actions, function(err) {
    if (err) throw err;
    console.log('action(s) received');
    res.sendStatus(200);
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Data Logging app listening on port %s', port);
});
