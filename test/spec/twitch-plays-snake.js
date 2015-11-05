/*global expect, TwitchClient, TwitchActionQueue */
(function () {
  'use strict';

  var TwitchClient = new EventEmitter();

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

  describe('TwitchPlaysSnake', function () {

    var actionMap;

    before('connect to mock client', function () {
      actionMap = TwitchPlaysSnake.getActionMap();
      TwitchClient.on('message', TwitchPlaysSnake.handleChat);
    });

    beforeEach('reset TwitchPlaysSnake', function () {
      TwitchPlaysSnake.reset();
    });

    after('disconnect from mock client', function () {
      TwitchClient.removeListener('message', TwitchPlaysSnake.handleChat);
    });

    context('invalid chat input', function () {

      it('should not add invalid input "asdf" to the action queue', function () {
        TwitchClient.emit('message', channel, user, 'asdf');
        expect(actionMap).to.deep.equal({});
      });

      it('should not add invalid input "u p" to the action queue', function () {
        TwitchClient.emit('message', channel, user, 'u p');
        expect(actionMap).to.deep.equal({});
      });

    });

    context('valid chat input', function () {

      context('UP', function () {
      
        it('should add input "up" to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, 'up', false);
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('UP');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input "UP" to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, 'UP');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('UP');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input "w" to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, 'w');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('UP');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });
      
        it('should add input " up " to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, ' up ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('UP');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " UP " to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, ' UP ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('UP');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " w " to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, ' w ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('UP');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

      });

      context('DOWN', function () {

        it('should add input "down" to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, 'down');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('DOWN');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input "DOWN" to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, 'DOWN');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('DOWN');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input "s" to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, 's');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('DOWN');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " down " to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, ' down ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('DOWN');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " DOWN " to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, ' DOWN ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('DOWN');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " s " to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, ' s ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('DOWN');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

      });

      context('LEFT', function () {

        it('should add input "left" to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, 'left');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('LEFT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input "LEFT" to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, 'LEFT');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('LEFT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input "a" to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, 'a');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('LEFT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " left " to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, ' left ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('LEFT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " LEFT " to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, ' LEFT ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('LEFT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " a " to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, ' a ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('LEFT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });


      });

      context('RIGHT', function () {

        it('should add input "right" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, 'right');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('RIGHT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input "RIGHT" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, 'RIGHT');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('RIGHT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input "d" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, 'd');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('RIGHT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " right " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, ' right ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('RIGHT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " RIGHT " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, ' RIGHT ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('RIGHT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

        it('should add input " d " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, ' d ');
          var userAction = actionMap[user.username];
          expect(userAction.action).to.equal('RIGHT');
          expect(userAction.user).to.deep.equal(user);
          expect(userAction.timestamp).to.exist;
        });

      });

    });

  });

})();
