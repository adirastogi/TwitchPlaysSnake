/* global EventLogger */

$(document).ready(function() {
  'use strict';

  // Canvas stuff
  var canvas = $('#canvas')[0];
  var ctx = canvas.getContext('2d');
  var w = $('#canvas').width();
  var h = $('#canvas').height();
  
  // Save the cell width in a variable for easy control
  var cellWidth = 50;
  var direction, prevDirection;
  var food;
  var score;
  var gameLoopIntervalId;
  
  // An array of cells to make up the snake
  var snakeArray; 
  
  // Start the game
  init();

  // Add the keyboard controls
  $(document).keydown(function(e) {
    var key = e.which;
    if     (key === 37) setDirection('LEFT');
    else if(key === 38) setDirection('UP');
    else if(key === 39) setDirection('RIGHT');
    else if(key === 40) setDirection('DOWN');
  });

  function init() {
    EventLogger.gameStart().then(function () {
      direction = prevDirection = 'RIGHT';
      ctx.font = '30px Helvetica Neue'; // score font
      createSnake();
      createFood();
      score = 0;
      
      // Move the snake now using a timer which will trigger the gameLoop function every 60ms
      if(typeof gameLoopIntervalId !== 'undefined') { 
        clearInterval(gameLoopIntervalId);
      }

      gameLoopIntervalId = setInterval(gameLoop, 1000);
    });
  }
  
  function createSnake() {
    var snakeLength = 3;
    snakeArray = [];
    // Create a horizontal snake starting from the top left
    for(var i = snakeLength-1; i >= 0; i--) {
      snakeArray.push({x: i, y: 1});
    }
  }
  
  // Create the food now
  function createFood() {
    // This will create a cell with x/y between 0-44
    // Because there are 45(450/10) positions accross the rows and columns
    food = {
      x: Math.round(Math.random()*(w-cellWidth)/cellWidth), 
      y: Math.round(Math.random()*(h-cellWidth)/cellWidth), 
    };
  }
  
  function gameLoop() {
    // Get next action to execute
    var o = TwitchPlaysSnake.getNextAction();

    // Repeat previous action if no action was submitted by users
    if (!o) o = { user: { username: 'SnakeGame' }, action: direction };

    // Set snake direction
    setDirection(o.action);
    EventLogger.actionExecuted(o.user, o.action);

    // Get coordinates of next snake position
    var pos = getNextPosition(direction);

    // Get coordinates of where snake would have gone w/o user input
    var avoidedPos = getNextPosition(prevDirection);

    // Detect avoided collision with apple
    if(checkFoodCollision(avoidedPos) && !checkFoodCollision(pos)) {
      // TODO: Decrease TPS of o.user
      EventLogger.appleAvoided(o.user);
    }

    // Detect wall/snake collisions (game over)
    var collision = false;

    // Check for collision with wall
    if(checkWallCollision(pos)) {
      EventLogger.wallCollision(o.user);
      collision = true;
    }

    // Check for collision with snake
    if(checkSnakeCollision(pos)) {
      EventLogger.snakeCollision(o.user);
      collision = true;
    }

    // Restart game if collision took place
    if(collision) {
      // TODO: increase TPS of o.user
      EventLogger.gameEnd().then(function () {
        init();
      });
      return;
    }

    // Detect avoided collisions with snake/wall
    var collisionAvoided = false;

    // Check for avoided wall collision
    if(checkWallCollision(avoidedPos)) {
      EventLogger.wallAvoided(o.user);
      collisionAvoided = true;
    }

    // Check for avoided snake collision
    if(checkSnakeCollision(avoidedPos)) {
      EventLogger.snakeAvoided(o.user);
      collisionAvoided = true;
    }

    if(collisionAvoided) {
      // TODO: Decrease TPS of o.user
    }
    
    // Code to make the snake eat the food
    // If the new head position matches with that of the food,
    // create a new head instead of moving the tail
    if(checkFoodCollision(pos)) {
      // TODO: Decrease TPS of o.user
      // TODO: Decrease TPS of all users if no action was submitted
      EventLogger.appleCollected(o.user);
      var tail = {x: pos.x, y: pos.y};
      score++;
      createFood();
    }
    else {
      // Pop out the tail cell and place it infront of the head cell
      var tail = snakeArray.pop();
      tail.x = pos.x; 
      tail.y = pos.y;
    }
    
    // Put back the tail as the first cell
    snakeArray.unshift(tail); 

    // Take note of direction change here to avoid race condition w/ user input
    prevDirection = direction;
    
    paintBackground();
    paintSnake();
    paintFood();
    paintScore();

    // Send all event logs to the server
    EventLogger.sendEvents();
  }

  function paintBackground() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, w, h);
  }

  function paintFood() {
    paintCell(food.x, food.y, 'red');
  }

  function paintScore() {
    var scoreText = 'Score: ' + score;
    ctx.fillStyle = 'black';
    ctx.fillText(scoreText, 5, h-5);
  }

  function paintSnake() {
    for(var i = 0; i < snakeArray.length; i++) {
      var c = snakeArray[i];
      paintCell(c.x, c.y);
    }
  }
  
  function paintCell(x, y, color) {
    if (!color) color = 'blue';
    ctx.fillStyle = color;
    ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
  }

  function getNextPosition(dir) {
    var x = snakeArray[0].x;
    var y = snakeArray[0].y;

    if     (dir === 'RIGHT') x++;
    else if(dir === 'LEFT')  x--;
    else if(dir === 'UP')    y--;
    else if(dir === 'DOWN')  y++;

    return {x: x, y: y};
  }
  
  function checkSnakeCollision(pos) {
    for(var i = 0; i < snakeArray.length; i++) {
      if(snakeArray[i].x === pos.x && snakeArray[i].y === pos.y) {
        return true;
      }
    }
    return false;
  }

  function checkWallCollision(pos) {
    return pos.x === -1 || pos.x === w/cellWidth || pos.y === -1 || pos.y === h/cellWidth;
  }

  function checkFoodCollision(pos) {
    return pos.x === food.x && pos.y === food.y;
  }

  function setDirection(newDirection) {
    if     (newDirection === 'LEFT'  && prevDirection !== 'RIGHT') direction = 'LEFT';
    else if(newDirection === 'UP'    && prevDirection !== 'DOWN')  direction = 'UP';
    else if(newDirection === 'RIGHT' && prevDirection !== 'LEFT')  direction = 'RIGHT';
    else if(newDirection === 'DOWN'  && prevDirection !== 'UP')    direction = 'DOWN';
  }

});
