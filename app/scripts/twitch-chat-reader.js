/* global TwitchClient, TwitchActionQueue */
'use strict';

var TwitchChatReader = (function () {

  var inputMap = {
    'UP':    'UP',
    'DOWN':  'DOWN',
    'LEFT':  'LEFT',
    'RIGHT': 'RIGHT',
    'W':     'UP',
    'S':     'DOWN',
    'A':     'LEFT',
    'D':     'RIGHT'
  };

  return {
    read: read
  };

  function read(channel, user, input) {
    input = input.trim();
    var action = inputMap[input.toUpperCase()];
    if (action) {
      var now = new moment();
      TwitchActionQueue.push({user: user, action: action, input: input, timestamp: now.format("HH:mm:ss")});
    }
  }

})();

TwitchClient.on('chat', TwitchChatReader.read);
