/* global TwitchClient, TwitchChat, moment, jQuery */
'use strict';

var TwitchPlaysSnake = (function () {

  var actionQueue = [];

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

  var keyMap = {
    'LEFT':  37,
    'UP':    38,
    'RIGHT': 39,
    'DOWN':  40,
  };

  return {
    getActionQueue: getActionQueue,
    getNextAction:  getNextAction,
    handleChat:     handleChat,
    reset:          reset
  };

  function reset() {
    actionQueue.length = 0;
  }

  function getActionQueue() {
    return actionQueue;
  }

  function selectNextAction() {
    // http://stackoverflow.com/a/4550514
    var action = actionQueue[Math.floor(Math.random() * actionQueue.length)];
    actionQueue.length = 0;
    return action;
  }

  function getNextAction() {
    var o = selectNextAction();
    if (o) {
      TwitchChat.update(o.channel, o.user, o.action);
      return o.action;
    }
  }

  // function executeNextAction() {
  //   var o = getNextAction();
  //   if (o) {
  //     jQuery.event.trigger({type: 'keypress', which: keyMap(o.action)});
  //   }
  // }

  function handleChat(channel, user, message, isBot) {
    if (!isBot) {
      message = message.trim();
      var action = inputMap[message.toUpperCase()];
      if (action) {
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

})();
