/* global TwitchClient, TwitchActionQueue */
'use strict';

var TwitchChatReader = (function () {

  return {
    read: read
  };

  function read(channel, user, message) {
    message = message.trim().toUpperCase();

    if (isAction(message)) {
      TwitchActionQueue.push({user: user, action: message});
    }
  }

  function isAction(message) {
    return message === 'UP' || message === 'DOWN' || message === 'LEFT' || message === 'RIGHT';
  }

})();

TwitchClient.on('chat', TwitchChatReader.read);
