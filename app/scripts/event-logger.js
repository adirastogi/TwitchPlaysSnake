/* global moment, $ */
'use strict';

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
// | ACTION_EXECUTED | TwitchUser002 | RIGHT | 2015-10-19_11-21-55 |
// | APPLE_COLLECTED | TwitchUser002 |       | 2015-10-19_11-21-55 |
// | TPS_UPDATE      | TwitchUser002 | 0.25  | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser003 | LEFT  | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser001 | DOWN  | 2015-10-19_11-21-55 |
// | PLAYER_ACTION   | TwitchUser002 | DOWN  | 2015-10-19_11-21-55 |
// | ACTION_SELECTED | TwitchUser002 | UP    | 2015-10-19_11-21-55 |
// | ACTION_SELECTED | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | ACTION_EXECUTED | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | APPLE_AVOIDED   | TwitchUser003 |       | 2015-10-19_11-21-55 |
// | WALL_COLLISION  | TwitchUser003 |       | 2015-10-19_11-21-55 |
// | TPS_UPDATE      | TwitchUser003 | 0.40  | 2015-10-19_11-21-55 |
// | GAME_ACTION     | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | ACTION_SELECTED | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | ACTION_EXECUTED | TwitchUser003 | RIGHT | 2015-10-19_11-21-55 |
// | GAME_END        |               |       | 2015-10-19_11-21-55 |
// +-----------------+---------------+-------+---------------------+

var EventLogger = (function () {

  var API_SERVER     = 'http://localhost:3000',
      GAME_END_URL   = API_SERVER + '/game/end',
      GAME_EVENT_URL = API_SERVER + '/game/event',
      GAME_START_URL = API_SERVER + '/game/start';

  $.ajaxSetup({
    contentType: 'application/json; charset=utf-8'
  });

  return {
    actionSelected:  actionSelected,
    actionSubmitted: actionSubmitted,
    actionExecuted:  actionExecuted,
    appleAvoided:    appleAvoided,
    appleCollected:  appleCollected,
    gameEnd:         gameEnd,
    gameStart:       gameStart,
    tpsUpdate:       tpsUpdate,
    snakeAvoided:    snakeAvoided,
    snakeCollision:  snakeCollision,
    wallAvoided:     wallAvoided,
    wallCollision:   wallCollision
  };

  function gameStart() {
    var data = { startTime: new moment().format('YYYY-MM-DD HH:mm:ss') };

    return $.ajax({
      type:     'POST',
      url:      GAME_START_URL,
      data:     JSON.stringify(data)
    });
  }

  function gameEnd() {
    var data = { endTime: new moment().format('YYYY-MM-DD HH:mm:ss') };

    return $.ajax({
      type: 'POST',
      url:  GAME_END_URL,
      data: JSON.stringify(data)
    });
  }

  function logEvent(event, user, value) {
    var data = {
      event: event,
      user:  user.username,
      value: value,
      time:  new moment().format('YYYY-MM-DD HH:mm:ss')
    };

    return $.ajax({
      type: 'POST',
      url:  GAME_EVENT_URL,
      data: JSON.stringify([data])
    });
  }

  function actionSelected(user, action) {
    logEvent('ACTION_SELECTED', user, action);
  }

  function actionSubmitted(user, action) {
    logEvent('ACTION_SUBMITTED', user, action);
  }

  function actionExecuted(user, action) {
    logEvent('ACTION_EXECUTED', user, action);
  }

  function appleAvoided(user) {
    logEvent('APPLE_AVOIDED', user);
  }

  function appleCollected(user) {
    logEvent('APPLE_COLLECTED', user);
  }

  function tpsUpdate(user, tps) {
    logEvent('TPS_UPDATED', user, tps);
  }

  function snakeAvoided(user) {
    logEvent('SNAKE_AVOIDED', user);
  }

  function snakeCollision(user) {
    logEvent('SNAKE_COLLISION', user);
  }

  function wallAvoided(user) {
    logEvent('WALL_AVOIDED', user);
  }

  function wallCollision(user) {
    logEvent('WALL_COLLISION', user);
  }

})();
