/*global expect*/
(function () {
  'use strict';

  var channel = 'TwitchPlaysSnake';

  var user = {
    'color':        '#FFFFFF',
    'display-name': 'TestUser',
    'emotes':       { '25': [ '0-4' ] },
    'subscriber':   false,
    'turbo':        true,
    'user-type':    'mod',
    'emotes-raw':   '25:0-4',
    'username':     'test-user'
  };

  describe('TwitchChatReader', function () {

    it('should add "up" to the action queue', function () {
      TwitchClient.emit('chat', channel, user, 'up');
      expect(TwitchActionQueue).to.deep.equal([{user: user, action: 'UP'}]);
    });

  });

})();
