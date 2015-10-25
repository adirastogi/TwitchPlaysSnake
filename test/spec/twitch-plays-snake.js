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

    var actionQueue;

    before('connect to mock client', function () {
      actionQueue = TwitchPlaysSnake.getActionQueue();
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
        expect(actionQueue).to.deep.equal([]);
      });

      it('should not add invalid input "u p" to the action queue', function () {
        TwitchClient.emit('message', channel, user, 'u p');
        expect(actionQueue).to.deep.equal([]);
      });

    });

    context('valid chat input', function () {

      context('UP', function () {
      
        it('should add input "up" to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, 'up', false);
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('up');
          expect(actionQueue[0].action).to.equal('UP');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input "UP" to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, 'UP');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('UP');
          expect(actionQueue[0].action).to.equal('UP');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input "w" to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, 'w');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('w');
          expect(actionQueue[0].action).to.equal('UP');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });
      
        it('should add input " up " to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, ' up ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('up');
          expect(actionQueue[0].action).to.equal('UP');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " UP " to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, ' UP ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('UP');
          expect(actionQueue[0].action).to.equal('UP');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " w " to the action queue as "UP"', function () {
          TwitchClient.emit('message', channel, user, ' w ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('w');
          expect(actionQueue[0].action).to.equal('UP');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

      });

      context('DOWN', function () {

        it('should add input "down" to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, 'down');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('down');
          expect(actionQueue[0].action).to.equal('DOWN');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input "DOWN" to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, 'DOWN');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('DOWN');
          expect(actionQueue[0].action).to.equal('DOWN');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input "s" to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, 's');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('s');
          expect(actionQueue[0].action).to.equal('DOWN');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " down " to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, ' down ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('down');
          expect(actionQueue[0].action).to.equal('DOWN');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " DOWN " to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, ' DOWN ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('DOWN');
          expect(actionQueue[0].action).to.equal('DOWN');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " s " to the action queue as "DOWN"', function () {
          TwitchClient.emit('message', channel, user, ' s ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('s');
          expect(actionQueue[0].action).to.equal('DOWN');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

      });

      context('LEFT', function () {

        it('should add input "left" to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, 'left');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('left');
          expect(actionQueue[0].action).to.equal('LEFT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input "LEFT" to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, 'LEFT');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('LEFT');
          expect(actionQueue[0].action).to.equal('LEFT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input "a" to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, 'a');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('a');
          expect(actionQueue[0].action).to.equal('LEFT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " left " to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, ' left ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('left');
          expect(actionQueue[0].action).to.equal('LEFT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " LEFT " to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, ' LEFT ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('LEFT');
          expect(actionQueue[0].action).to.equal('LEFT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " a " to the action queue as "LEFT"', function () {
          TwitchClient.emit('message', channel, user, ' a ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('a');
          expect(actionQueue[0].action).to.equal('LEFT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });


      });

      context('RIGHT', function () {

        it('should add input "right" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, 'right');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('right');
          expect(actionQueue[0].action).to.equal('RIGHT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input "RIGHT" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, 'RIGHT');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('RIGHT');
          expect(actionQueue[0].action).to.equal('RIGHT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input "d" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, 'd');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('d');
          expect(actionQueue[0].action).to.equal('RIGHT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " right " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, ' right ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('right');
          expect(actionQueue[0].action).to.equal('RIGHT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " RIGHT " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, ' RIGHT ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('RIGHT');
          expect(actionQueue[0].action).to.equal('RIGHT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

        it('should add input " d " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('message', channel, user, ' d ');
          expect(actionQueue[0].channel).to.equal(channel);
          expect(actionQueue[0].message).to.equal('d');
          expect(actionQueue[0].action).to.equal('RIGHT');
          expect(actionQueue[0].user).to.deep.equal(user);
          expect(actionQueue[0].timestamp).to.exist;
        });

      });

    });

  });

})();
