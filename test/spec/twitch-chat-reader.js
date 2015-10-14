/*global expect, TwitchClient, TwitchActionQueue */
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

    beforeEach('clear TwitchActionQueue', function () {
      TwitchActionQueue = [];
    });

    context('invalid chat input', function () {

      it('should not add invalid input "asdf" to the action queue', function () {
        TwitchClient.emit('chat', channel, user, 'asdf');
        expect(TwitchActionQueue).to.deep.equal([]);
      });

      it('should not add invalid input "u p" to the action queue', function () {
        TwitchClient.emit('chat', channel, user, 'u p');
        expect(TwitchActionQueue).to.deep.equal([]);
      });

    });

    context('valid chat input', function () {

      context('UP', function () {
      
        it('should add input "up" to the action queue as "UP"', function () {
          TwitchClient.emit('chat', channel, user, 'up');
          expect(TwitchActionQueue[0].input).to.equal('up');
          expect(TwitchActionQueue[0].action).to.equal('UP');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input "UP" to the action queue as "UP"', function () {
          TwitchClient.emit('chat', channel, user, 'UP');
          expect(TwitchActionQueue[0].input).to.equal('UP');
          expect(TwitchActionQueue[0].action).to.equal('UP');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input "w" to the action queue as "UP"', function () {
          TwitchClient.emit('chat', channel, user, 'w');
          expect(TwitchActionQueue[0].input).to.equal('w');
          expect(TwitchActionQueue[0].action).to.equal('UP');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });
      
        it('should add input " up " to the action queue as "UP"', function () {
          TwitchClient.emit('chat', channel, user, ' up ');
          expect(TwitchActionQueue[0].input).to.equal('up');
          expect(TwitchActionQueue[0].action).to.equal('UP');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " UP " to the action queue as "UP"', function () {
          TwitchClient.emit('chat', channel, user, ' UP ');
          expect(TwitchActionQueue[0].input).to.equal('UP');
          expect(TwitchActionQueue[0].action).to.equal('UP');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " w " to the action queue as "UP"', function () {
          TwitchClient.emit('chat', channel, user, ' w ');
          expect(TwitchActionQueue[0].input).to.equal('w');
          expect(TwitchActionQueue[0].action).to.equal('UP');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

      });

      context('DOWN', function () {

        it('should add input "down" to the action queue as "DOWN"', function () {
          TwitchClient.emit('chat', channel, user, 'down');
          expect(TwitchActionQueue[0].input).to.equal('down');
          expect(TwitchActionQueue[0].action).to.equal('DOWN');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input "DOWN" to the action queue as "DOWN"', function () {
          TwitchClient.emit('chat', channel, user, 'DOWN');
          expect(TwitchActionQueue[0].input).to.equal('DOWN');
          expect(TwitchActionQueue[0].action).to.equal('DOWN');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input "s" to the action queue as "DOWN"', function () {
          TwitchClient.emit('chat', channel, user, 's');
          expect(TwitchActionQueue[0].input).to.equal('s');
          expect(TwitchActionQueue[0].action).to.equal('DOWN');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " down " to the action queue as "DOWN"', function () {
          TwitchClient.emit('chat', channel, user, ' down ');
          expect(TwitchActionQueue[0].input).to.equal('down');
          expect(TwitchActionQueue[0].action).to.equal('DOWN');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " DOWN " to the action queue as "DOWN"', function () {
          TwitchClient.emit('chat', channel, user, ' DOWN ');
          expect(TwitchActionQueue[0].input).to.equal('DOWN');
          expect(TwitchActionQueue[0].action).to.equal('DOWN');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " s " to the action queue as "DOWN"', function () {
          TwitchClient.emit('chat', channel, user, ' s ');
          expect(TwitchActionQueue[0].input).to.equal('s');
          expect(TwitchActionQueue[0].action).to.equal('DOWN');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

      });

      context('LEFT', function () {

        it('should add input "left" to the action queue as "LEFT"', function () {
          TwitchClient.emit('chat', channel, user, 'left');
          expect(TwitchActionQueue[0].input).to.equal('left');
          expect(TwitchActionQueue[0].action).to.equal('LEFT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input "LEFT" to the action queue as "LEFT"', function () {
          TwitchClient.emit('chat', channel, user, 'LEFT');
          expect(TwitchActionQueue[0].input).to.equal('LEFT');
          expect(TwitchActionQueue[0].action).to.equal('LEFT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input "a" to the action queue as "LEFT"', function () {
          TwitchClient.emit('chat', channel, user, 'a');
          expect(TwitchActionQueue[0].input).to.equal('a');
          expect(TwitchActionQueue[0].action).to.equal('LEFT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " left " to the action queue as "LEFT"', function () {
          TwitchClient.emit('chat', channel, user, ' left ');
          expect(TwitchActionQueue[0].input).to.equal('left');
          expect(TwitchActionQueue[0].action).to.equal('LEFT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " LEFT " to the action queue as "LEFT"', function () {
          TwitchClient.emit('chat', channel, user, ' LEFT ');
          expect(TwitchActionQueue[0].input).to.equal('LEFT');
          expect(TwitchActionQueue[0].action).to.equal('LEFT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " a " to the action queue as "LEFT"', function () {
          TwitchClient.emit('chat', channel, user, ' a ');
          expect(TwitchActionQueue[0].input).to.equal('a');
          expect(TwitchActionQueue[0].action).to.equal('LEFT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });


      });

      context('RIGHT', function () {

        it('should add input "right" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('chat', channel, user, 'right');
          expect(TwitchActionQueue[0].input).to.equal('right');
          expect(TwitchActionQueue[0].action).to.equal('RIGHT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input "RIGHT" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('chat', channel, user, 'RIGHT');
          expect(TwitchActionQueue[0].input).to.equal('RIGHT');
          expect(TwitchActionQueue[0].action).to.equal('RIGHT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input "d" to the action queue as "RIGHT"', function () {
          TwitchClient.emit('chat', channel, user, 'd');
          expect(TwitchActionQueue[0].input).to.equal('d');
          expect(TwitchActionQueue[0].action).to.equal('RIGHT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " right " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('chat', channel, user, ' right ');
          expect(TwitchActionQueue[0].input).to.equal('right');
          expect(TwitchActionQueue[0].action).to.equal('RIGHT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " RIGHT " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('chat', channel, user, ' RIGHT ');
          expect(TwitchActionQueue[0].input).to.equal('RIGHT');
          expect(TwitchActionQueue[0].action).to.equal('RIGHT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

        it('should add input " d " to the action queue as "RIGHT"', function () {
          TwitchClient.emit('chat', channel, user, ' d ');
          expect(TwitchActionQueue[0].input).to.equal('d');
          expect(TwitchActionQueue[0].action).to.equal('RIGHT');
          expect(TwitchActionQueue[0].user).to.deep.equal(user);
          expect(TwitchActionQueue[0].timestamp).to.exist;
        });

      });

    });

  });

})();
