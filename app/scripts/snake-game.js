/* global EventLogger */

$(document).ready(function() {
  'use strict';

  // Canvas stuff
  var canvasElement = $('#canvas');
  var canvas = canvasElement[0];
  var ctx = canvas.getContext('2d');
  var w = canvasElement.width();
  var h = canvasElement.height();

  // Colors
  var snakeBodyColor = 'darkcyan';
  var snakeEyeColor  = 'black';

  // Game state
  var cellWidth = 75;
  var gameLoopPeriod = 2000;
  var direction, prevDirection;
  var food;
  var score;
  var gameLoopIntervalId;
  var gameState = 'stopped';

  // An array of cells to make up the snake
  var snakeArray;

  // Paint empty game field
  paintBackground();

  // Add the keyboard controls
  $(document).keydown(function(e) {
    var key = e.which;
    if     (key === 37) setDirection('LEFT');
    else if(key === 38) setDirection('UP');
    else if(key === 39) setDirection('RIGHT');
    else if(key === 40) setDirection('DOWN');
  });

  // Add button click handlers
  $('#startGame').click(startGame);
  $('#stopGame').click(stopGame);
  $('#togglePause').click(togglePause);

  function startGame() {
    if (gameState === 'stopped') {
      gameState = 'running';
      EventLogger.gameStart().then(function () {
        direction = prevDirection = 'RIGHT';
        createSnake();
        createFood();
        score = 0;

        if(typeof gameLoopIntervalId !== 'undefined') {
          clearInterval(gameLoopIntervalId);
        }

        gameLoopIntervalId = setInterval(gameLoop, gameLoopPeriod);
        TwitchPlaysSnake.clearPlayerActions();
      });
    }
  }

  function stopGame() {
    if (gameState !== 'stopped') {
      if (gameState === 'paused') {
        $('#togglePause').html('Pause Game');
      }
      gameState = 'stopped';
      if(typeof gameLoopIntervalId !== 'undefined') {
        clearInterval(gameLoopIntervalId);
      }
      paintGameOver();
      EventLogger.gameEnd(TwitchPlaysSnake.getActiveUsers(), score);
    }
  }

  function togglePause() {
    if (gameState === 'running') {
      pauseGame();
    }
    else if (gameState === 'paused') {
      resumeGame()
    }
  }

  function pauseGame() {
    gameState = 'paused';
    if(typeof gameLoopIntervalId !== 'undefined') {
      clearInterval(gameLoopIntervalId);
    }
    $('#togglePause').html('Resume Game');
    EventLogger.gamePaused();
  }

  function resumeGame() {
    gameState = 'running';
    gameLoopIntervalId = setInterval(gameLoop, gameLoopPeriod);
    $('#togglePause').html('Pause Game');
    EventLogger.gameResumed();
  }

  function createSnake() {
    var snakeLength = 2;
    snakeArray = [];
    // Create a horizontal snake
    for(var i = snakeLength-1; i >= 0; i--) {
      snakeArray.push({x: i, y: 2});
    }
  }

  // Create the food now
  function createFood() {
    var openCells = [];

    // find all open cells
    for (var x = 0, xCells = w / cellWidth; x < xCells; x++) {
      for (var y = 0, yCells = h / cellWidth; y < yCells; y++) {
        var openCell = true;
        for (var i = 0, len = snakeArray.length; i < len; i++) {
          if (snakeArray[i].x === x && snakeArray[i].y === y) {
            openCell = false;
            break;
          }
        }
        if (openCell) {
          openCells.push({x: x, y: y});
        }
      }
    }

    // end game if no more open cells
    if (openCells.length < 1) {
      stopGame();
    }

    // This will create a cell with x/y between 0-44
    // Because there are 45(450/10) positions across the rows and columns
    food = openCells[Math.floor(Math.random() * openCells.length)];
  }

  function gameLoop() {
    evaluateUserActions();
    executeSelectedAction();
    EventLogger.sendEvents(); // Send all event logs to the server
  }

  function evaluateUserActions() {
    var actionMap = TwitchPlaysSnake.getActionMap();
    for (var username of Object.keys(actionMap)) {
      evaluateUserAction(actionMap[username]);
    }
  }

  function evaluateUserAction(o) {
    // If user did not provide input, continue in the same direction
    if (!o.action) o.action = direction;

    // Get coordinates of next snake position
    var pos = getNextPosition(o.action);

    // Get coordinates of where snake would have gone w/o user input
    var avoidedPos = getNextPosition(prevDirection);

    // Detect avoided collision with apple
    if(checkFoodCollision(avoidedPos) && !checkFoodCollision(pos)) {
      EventLogger.appleAvoided(o.user);
      TwitchPlaysSnake.incrementMaliciousAction(o.user.username, 1);
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
      TwitchPlaysSnake.incrementMaliciousAction(o.user.username, 1);
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
      TwitchPlaysSnake.incrementPositiveAction(o.user.username, 1);
    }

    // Code to make the snake eat the food
    // If the new head position matches with that of the food,
    // create a new head instead of moving the tail
    if(checkFoodCollision(pos)) {
      EventLogger.appleCollected(o.user);
      TwitchPlaysSnake.incrementPositiveAction(o.user.username, 1);
    }
  }

  function executeSelectedAction() {
    // Get next action to execute
    var o = TwitchPlaysSnake.getNextAction();

    // Repeat previous action if no action was submitted by users
    if (!o) o = { user: { username: 'SnakeGame' }, action: direction };

    // If user did not provide input, continue in the same direction
    if (!o.action) o.action = direction;

    // Update chat
    if (o.user.username !== 'SnakeGame') {
      TwitchChat.update(o.channel, o.user, o.action);
    }

    // Set snake direction
    setDirection(o.action);
    EventLogger.actionExecuted(o.user, o.action);

    // Get coordinates of next snake position
    var pos = getNextPosition(direction);

    // Restart game if collision took place
    if(checkWallCollision(pos) || checkSnakeCollision(pos)) {
      stopGame();
      return;
    }

    // Code to make the snake eat the food
    // If the new head position matches with that of the food,
    // create a new head instead of moving the tail
    var tail;
    if(checkFoodCollision(pos)) {
      tail = {x: pos.x, y: pos.y};
      score++;
      snakeArray.unshift(tail); // Put back the tail as the first cell
      createFood();
    }
    else {
      // Pop out the tail cell and place it infront of the head cell
      tail = snakeArray.pop();
      tail.x = pos.x;
      tail.y = pos.y;
      snakeArray.unshift(tail); // Put back the tail as the first cell
    }

    // Take note of direction change here to avoid race condition w/ user input
    prevDirection = direction;

    paintGame();
  }

  function paintGame() {
    paintBackground();
    paintSnake();
    paintFood();
    paintScore();
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
    ctx.font = '40px Helvetica Neue';
    var scoreText = 'Score: ' + score;
    ctx.fillStyle = 'black';
    ctx.fillText(scoreText, 5, h-5);
  }

  function paintSnake() {
    paintSnakeHead();
    paintSnakeBody();
  }

  function paintSnakeHead() {
    var headCell = snakeArray[0];
    paintCell(headCell.x, headCell.y, snakeBodyColor);
    paintCellTriangle(headCell.x, headCell.y);
  }

  function paintSnakeBody() {
    for(var i = 1; i < snakeArray.length; i++) {
      var c = snakeArray[i];
      paintCell(c.x, c.y, snakeBodyColor);
    }
  }

  function paintCell(x, y, color) {
    if (!color) color = snakeBodyColor;
    ctx.fillStyle = color;
    ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
  }

  function paintCellTriangle(x, y, color) {
    if (!color) color  = snakeEyeColor;

    x = x * cellWidth;
    y = y * cellWidth;

    ctx.fillStyle = color;
    ctx.beginPath();

    switch (direction) {
      case 'LEFT':
        ctx.moveTo(x + (0.25 * cellWidth), y + (0.5 * cellWidth));
        ctx.lineTo(x + (0.75 * cellWidth), y + (0.25 * cellWidth));
        ctx.lineTo(x + (0.75 * cellWidth), y + (0.75 * cellWidth));
        break;
      case 'RIGHT':
        ctx.moveTo(x + (0.75 * cellWidth), y + (0.5 * cellWidth));
        ctx.lineTo(x + (0.25 * cellWidth), y + (0.25 * cellWidth));
        ctx.lineTo(x + (0.25 * cellWidth), y + (0.75 * cellWidth));
        break;
      case 'UP':
        ctx.moveTo(x + (0.5 * cellWidth), y + (0.25 * cellWidth));
        ctx.lineTo(x + (0.25 * cellWidth), y + (0.75 * cellWidth));
        ctx.lineTo(x + (0.75 * cellWidth), y + (0.75 * cellWidth));
        break;
      case 'DOWN':
        ctx.moveTo(x + (0.5 * cellWidth), y + (0.75 * cellWidth));
        ctx.lineTo(x + (0.25 * cellWidth), y + (0.25 * cellWidth));
        ctx.lineTo(x + (0.75 * cellWidth), y + (0.25 * cellWidth));
        break;
    }

    ctx.fill();
  }

  function paintGameOver() {
    paintBackground();
    paintGameOverText();
    paintFinalScoreText();
  }

  function paintGameOverText() {
    ctx.fillStyle    = 'black';
    ctx.font         = '60px Helvetica Neue';
    var gameOverText = 'GAME OVER';
    var gameOverDim  = ctx.measureText(gameOverText);
    ctx.fillText(gameOverText, w/2-gameOverDim.width/2, h/2);
  }

  function paintFinalScoreText() {
    ctx.fillStyle      = 'black';
    ctx.font           = '40px Helvetica Neue';
    var finalScoreText = 'Final Score: ' + score;
    var finalScoreDim  = ctx.measureText(finalScoreText);
    ctx.fillText(finalScoreText, w/2-finalScoreDim.width/2, h/2+50);
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
