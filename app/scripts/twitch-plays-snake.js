/* global TwitchClient, TwitchChat, EventLogger, moment */
'use strict';

var TwitchPlaysSnake = (function () {

  // Queue of actions
  var actionQueue = [];

  // Users who are viewing the stream
  // TODO: Users should have:
  //   1. Count of malicious actions
  //   2. Count of positive actions
  //   3. TPS score 
  var users = [];

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

  function selectNextAction() {
    // randomly select action: http://stackoverflow.com/a/4550514
    var o = actionQueue[Math.floor(Math.random() * actionQueue.length)];
    actionQueue.length = 0;
    return o;
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
  }

  function part(channel, username) {
    // TODO: User has left the channel
  }

})();
