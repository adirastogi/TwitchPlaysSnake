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

  // boolean to indicate if the troll subversion is enabled
  var trollSubversion = true;

  return {
    getActionMap:           getActionMap,
    getNextAction:            getNextAction,
    join:                     join,
    handleChat:               handleChat,
    part:                     part,
    reset:                    reset,
    incrementMaliciousAction: incrementMaliciousAction,
    incrementPositiveAction:  incrementPositiveAction
  };

  function reset() {
    for (var username in actionMap) {
      if (actionMap.hasOwnProperty(username)) {
        actionMap[username].action = null;
      }
    }
  }

  function isActiveUser(user) {
    for (var i = 0, len = activeUsers.length; i < len; i++) {
      if (activeUsers[i].username === user.username) {
        return true;
      }
    }
    return false;
  }

  function activateUser(user) {
    if (!actionMap[user.username]) {
      user.maliciousAction = 0;
      user.positiveAction = 0;
      actionMap[user.username] = {user:user};
    }

    for (var i = 0, len = inactiveUsers.length; i < len; i++) {
      var inactiveUser = inactiveUsers[i];
      if (user.username === inactiveUser.username) {
        activeUsers.push(user);
        inactiveUsers.splice(i, 1);
        return;
      }
    }
    activeUsers.push(actionMap[user.username].user);
  }

  function setUserAction(channel, user, action) {
    if (!isActiveUser(user)) activateUser(user);
    actionMap[user.username].action    = action;
    actionMap[user.username].channel   = channel;
    actionMap[user.username].timestamp = new moment().format('HH:mm:ss');
  }

  function getActionMap() {
    return actionMap;
  }

  function selectWeightedNextAction() {
    if(Object.keys(actionMap).length === 0) {
      return undefined;
    }
    var probabilities = [];
    var totalTPS = 0;
    for(var username in actionMap) {
      if(actionMap.hasOwnProperty(username)){
        var user = actionMap[username].user;
        totalTPS +=  (1-((2.5 + user.maliciousAction) / (10 + user.positiveAction+user.maliciousAction)));
      }
    }
    // create the array with the normalized selection probabilities
    for(var username in actionMap) {
      if(actionMap.hasOwnProperty(username)) {
        var user = actionMap[username].user;
        var userTPS = 1-((2.5 + user.maliciousAction) / (10 + user.positiveAction+user.maliciousAction));
        var prob = (userTPS/totalTPS);
        probabilities.push({
          username : user.username,
          probability : prob
        });
      }
    }
    // now sample from the array using the probabilities
    var cumProb = 0;
    for(var i=0; i<probabilities.length; i++) {
      cumProb = cumProb + probabilities[i].probability;
      if(cumProb > Math.random()) {
        break;
      }
    }
    var selectedUsername = probabilities[i].username;
    return actionMap[selectedUsername];
  }

  function selectRandomNextAction() {
    // randomly select action: http://stackoverflow.com/a/4550514
    var selectedUser, selectedAction;
    if (activeUsers.length > 0) {
      selectedUser   = activeUsers[Math.floor(Math.random() * activeUsers.length)];
      selectedAction = actionMap[selectedUser.username];
    }
    return selectedAction;
  }

  function selectNextAction() {
    var selectedAction;
    if(trollSubversion) {
      selectedAction =  selectWeightedNextAction();
    } else {
      selectedAction =  selectRandomNextAction();
    }
    if (selectedAction) {
      selectedAction = Object.assign({}, selectedAction);
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

  function incrementMaliciousAction(username, num) {
    for (var i=0; i<activeUsers.length; i++){
      var user = activeUsers[i];
      if(user.username === username){
        activeUsers[i].maliciousAction += num;
        return;
      }
    }
  }

  function incrementPositiveAction(username, num) {
     for (var i=0;i<activeUsers.length;i++){
      var user = activeUsers[i];
      if(user.username === username){
        activeUsers[i].positiveAction += num;
        return;
      }
    }
  }

})();
