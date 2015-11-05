/* global TwitchClient, TwitchChat, EventLogger, moment */
'use strict';

var TwitchPlaysSnake = (function () {

  // Queue of actions
  var actionQueue = [];

  // Users who are currently viewing the stream
  // TODO: Users should have:
  //   1. Count of malicious actions
  //   2. Count of positive actions
  //   3. TPS score 
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
  var trollSubversion = false;

  return {
    getActionQueue: getActionQueue,
    getNextAction:  getNextAction,
    join:           join,
    handleChat:     handleChat,
    part:           part,
    reset:          reset
  };

  function reset() {
    actionQueue.length = 0;
  }

  function getActionQueue() {
    return actionQueue;
  }

  function selectWeightedNextAction() {
    var probabilities = [];
    var totalTPS = 0;
    for(var action in actionQueue) {
      totalTPS +=  (2.5 + action.user.maliciousAction) / (10 + action.user.positiveAction);
    }
    // create the array with the normalized selection probabilities
    for(var action in actionQueue) {
      userTPS = (2.5 + action.user.maliciousAction) / (10 + action.user.positiveAction);
      prob = 1 - (userTPS/totalTPS);
      probabilities.push(prob);
    }
    // now sample from the array using the probabilities
    var cumulativeProb = 0;
    var i=0;
    for(; i<probabilities.length; ++i) {
      cumProb = cumProb + prob;
      if(cumProb > Math.random()) {
        break;
      }
    }
    return actionQueue[i];
  }

  function selectRandomNextAction() {
    // randomly select action: http://stackoverflow.com/a/4550514
    var o = actionQueue[Math.floor(Math.random() * actionQueue.length)];
    actionQueue.length = 0;
    return o;
  }

  function selectNextAction() {
    if(trollSubversion) {
      return selectWeightedNextAction();
    } else {
      return selectRandomNextAction();
    }
  }

  function getNextAction() {
    var o = selectNextAction();
    if (o) {
      EventLogger.actionSelected(o.user, o.action);
      TwitchChat.update(o.channel, o.user, o.action);
      return o;
    }
  }

  function handleChat(channel, user, message, isBot) {
    if (!isBot) {
      message = message.trim();
      var action = inputMap[message.toUpperCase()];
      if (action) {
        // Notify server of action submission
        EventLogger.actionSubmitted(user, action);
        // Add action to queue
        var now = new moment();
        actionQueue.push({
          action:    action, 
          channel:   channel,
          message:   message, 
          user:      user, 
          timestamp: now.format('HH:mm:ss')
        });
      }
    }
  }

  function join(channel, username) {
    // TODO: User has joined the channel
    // users.push({
    //   username: username,
    //   ...
    // });
  }

  function part(channel, username) {
    // TODO: User has left the channel 
  }

})();
