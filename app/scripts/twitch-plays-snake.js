/* global TwitchClient, TwitchChat, EventLogger, moment */
'use strict';

var TwitchPlaysSnake = (function () {

  // Maps each user to their submitted action
  var actionMap = {};

  // Users who are currently viewing the stream
  var activeUsers = [];

  // Users who are not currently viewing the stream
  var inactiveUsers = [];

  // Maps user input to snake game commands
  var inputMap = {
    'LEFT':  'LEFT',
    'UP':    'UP',
    'RIGHT': 'RIGHT',
    'DOWN':  'DOWN',
    'A':     'LEFT',
    'W':     'UP',
    'D':     'RIGHT',
    'S':     'DOWN'
  };

  return {
    getActionMap: getActionMap,
    getNextAction:  getNextAction,
    join:           join,
    handleChat:     handleChat,
    part:           part,
    reset:          reset
  };

  function reset() {
    for (var username in actionMap) {
      if (actionMap.hasOwnProperty(username)) {
        actionMap[username].action = null;
      }
    }
  }

  function addUser(user) {
    if (!actionMap[user.username]) {
      actionMap[user.username] = {};
    }

    for (var i = 0, len = inactiveUsers.length; i < len; i++) {
      var inactiveUser = inactiveUsers[i];
      if (user.username === inactiveUser.username) {
        activeUsers.push(user);
        inactiveUsers.splice(i, 1);
        return;
      }
    }

    activeUsers.push({
      username:         user.username,
      maliciousAction:  0,
      positiveAction:   0,
      TPS:              0.25
    });
  }

  function setUserAction(channel, user, action) {
    addUser(user);
    actionMap[user.username].action    = action;
    actionMap[user.username].channel   = channel;
    actionMap[user.username].user      = user;
    actionMap[user.username].timestamp = new moment().format('HH:mm:ss');
  }

  function getActionMap() {
    return actionMap;
  }

  function selectNextAction() {
    // randomly select action: http://stackoverflow.com/a/4550514
    var selectedUser, selectedAction;

    if (activeUsers.length > 0) {
      selectedUser   = activeUsers[Math.floor(Math.random() * activeUsers.length)];
      selectedAction = actionMap[selectedUser.username];
    }

    if (selectedAction) {
      selectedAction = Object.assign({}, selectedAction);
    }

    if (selectedAction && selectedAction.username === 'ericrsteele') {
      var x = 0;
    }

    reset();

    return selectedAction;
  }

  function getNextAction() {
    var o = selectNextAction();
    if (o) {
      EventLogger.actionSelected(o.user, o.action);
      return o;
    }
  }

  function handleChat(channel, user, message, isBot) {
    if (!isBot) {
      var action = inputMap[message.trim().toUpperCase()];
      if (action) {
        EventLogger.actionSubmitted(user, action);
        setUserAction(channel, user, action);
      }
    }
  }

  function join(channel, username) {
    // No longer used to detect active users
    // Users become active when they first input a command
  }

  function part(channel, username) {
    for (var i = 0, len = activeUsers.length; i < len; i++) {
      var user = activeUsers[i];
      if (user.username === username) {
        inactiveUsers.push(user);
        activeUsers.splice(i, 1);
        delete actionMap[username];
        return;
      }
    }
  }

})();
