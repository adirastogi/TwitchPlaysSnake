/* global TwitchClient, TwitchActionQueue, moment */
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
      var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
      TwitchActionQueue.push({user: user, action: action, input: input, timestamp: timestamp});
    }
  }

})();

TwitchClient.on('chat', TwitchChatReader.read);
