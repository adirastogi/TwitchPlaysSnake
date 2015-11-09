/* global moment, $ */
'use strict';

var EventLogger = (function () {

  var API_SERVER     = 'http://localhost:3000',
      GAME_END_URL   = API_SERVER + '/game/end',
      GAME_EVENT_URL = API_SERVER + '/game/event',
      GAME_START_URL = API_SERVER + '/game/start';

  var events = [];

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
    gamePaused:      gamePaused,
    gameResumed:     gameResumed,
    gameStart:       gameStart,
    sendEvents:      sendEvents,
    tpsUpdate:       tpsUpdate,
    userActivated:   userActivated,
    snakeAvoided:    snakeAvoided,
    snakeCollision:  snakeCollision,
    wallAvoided:     wallAvoided,
    wallCollision:   wallCollision
  };

  function gameStart() {
    var data = {startTime: new moment().format('YYYY-MM-DD HH:mm:ss')};

    return $.ajax({
      type: 'POST',
      url:  GAME_START_URL,
      data: JSON.stringify(data)
    });
  }

  function gameEnd(users, score) {
    var data = {
      endTime: new moment().format('YYYY-MM-DD HH:mm:ss'),
      users:   users || [],
      score:   score || 0
    };

    return sendEvents().then(function () {
      return $.ajax({
        type: 'POST',
        url:  GAME_END_URL,
        data: JSON.stringify(data)
      });
    });
  }

  function sendEvents() {
    if (events.length > 0) {
      return $.ajax({
        type: 'POST',
        url:  GAME_EVENT_URL,
        data: JSON.stringify(events)
      }).then(function () {
        events.length = 0;
      });
    }
    else {
      return $.Deferred().resolve().promise();
    }
  }

  function addEvent(event, user, value) {
    events.push({
      event: event,
      user:  (user && user.username) || 'SnakeGame',
      value: value,
      time:  new moment().format('YYYY-MM-DD HH:mm:ss')
    });
  }

  function actionSelected(user, action) {
    addEvent('ACTION_SELECTED', user, action);
  }

  function actionSubmitted(user, action) {
    addEvent('ACTION_SUBMITTED', user, action);
  }

  function actionExecuted(user, action) {
    addEvent('ACTION_EXECUTED', user, action);
  }

  function appleAvoided(user) {
    addEvent('APPLE_AVOIDED', user);
  }

  function appleCollected(user) {
    addEvent('APPLE_COLLECTED', user);
  }

  function gamePaused() {
    addEvent('GAME_PAUSED');
    sendEvents();
  }

  function gameResumed() {
    addEvent('GAME_RESUMED');
    sendEvents();
  }

  function tpsUpdate(user, tps) {
    tps = Math.round(tps * 100) / 100;
    addEvent('TPS_UPDATED', user, tps);
  }

  function snakeAvoided(user) {
    addEvent('SNAKE_AVOIDED', user);
  }

  function snakeCollision(user) {
    addEvent('SNAKE_COLLISION', user);
  }

  function userActivated(user) {
    addEvent('USER_ACTIVATED', user);
  }

  function wallAvoided(user) {
    addEvent('WALL_AVOIDED', user);
  }

  function wallCollision(user) {
    addEvent('WALL_COLLISION', user);
  }

})();
