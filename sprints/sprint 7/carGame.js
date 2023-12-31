let player;
let track;
let obstacles = [];
let gameState = "start";
let countdown = 180;
let roadLines = [];

function setup() {
  createCanvas(400, 600);
  player = new Player();
  track = new Track();
}

function draw() {
  background(220);

  if (gameState === "start") {
    showStartMenu();
  } else if (gameState === "playing") {
    track.display();

    for (let i = 0; i < roadLines.length; i++) {
      roadLines[i].update();
      roadLines[i].display();
    }

    for (let obstacle of obstacles) {
      obstacle.update();
      obstacle.display();
    }

    player.update();
    player.display();

    for (let obstacle of obstacles) {
      if (player.checkCollision(obstacle)) {
        gameState = "gameover";
      }
    }

    if (player.reachedFinish()) {
      gameState = "win";
    }
    
    if (keyIsDown(54)&&keyIsDown(57)) {
        countdown = 0;
      }

    textSize(16);
    textAlign(RIGHT, TOP);
    fill(0);
    text("Tijd: " + Math.ceil(countdown), width - 10, 10);

    countdown -= 1 / frameRate();
    
    if (countdown <= 0) {
      gameState = "gameover";
    }
  } else if (gameState === "gameover") {
    showGameOver();
  } else if (gameState === "win") {
    showWinScreen();
  }
}

function keyPressed() {
  if (gameState === "start" && keyCode === ENTER) {
    startGame();
  } else if ((gameState === "gameover" || gameState === "win") && keyCode === ENTER) {
    startGame();
  } else if (gameState === "playing") {
    if (keyCode === LEFT_ARROW) {
      player.setDirection(-1);
    } else if (keyCode === RIGHT_ARROW) {
      player.setDirection(1);
    }
  }
}

function keyReleased() {
  if (gameState === "playing" && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
    player.setDirection(0);
  }
}

function startGame() {
  gameState = "playing";
  obstacles = [];
  countdown = 180;

  for (let i = 0; i < 5; i++) {
    obstacles.push(new Obstacle());
  }

  roadLines = [];
  for (let i = 0; i < height; i += 40) {
    roadLines.push(new RoadLine(i));
  }
}

function showStartMenu() {
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Press ENTER to start", width / 2, height / 2);
}

function showGameOver() {
  fill(255, 0, 0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Game Over! Press ENTER to restart", width / 2, height / 2);
}

function showWinScreen() {
  fill(0, 255, 0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Congratulations! You won! Press ENTER to restart", width / 2, height / 2);
}

class Player {
  constructor() {
    this.width = 30;
    this.height = 50;
    this.x = 185;
    this.y = 550;
    this.speed = 5;
    this.direction = 0;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  update() {
    this.x += this.speed * this.direction;
    this.x = constrain(this.x, 0, width - this.width);
  }

  display() {
    noStroke();
      fill(255,0,0);
      rect(this.x, this.y, this.width, this.height);
  
      fill(255, 255, 0);
      rect(this.x + 5, this.y, 5, 5);
      rect(this.x + 20, this.y, 5, 5);
  
      fill("darkred");
      stroke(0);
      rect(this.x + 5, this.y + 10, this.width - 10, this.height - 20);
  }

  checkCollision(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    );
  }

  reachedFinish() {
    return this.y <= 0;
  }

  reset() {
    this.x = 185;
    this.y = 550;
  }
}

class Obstacle {
    constructor() {
      this.width = 30;
      this.height = 50;
      this.x = random(width - this.width);
      this.y = random(height / 2);
      this.speed = 2;
      this.color = color(random(255), random(255), random(255));
    }
  
    update() {
      this.y += this.speed;
  
      if (this.y > height) {
        this.y = 0;
        this.x = random(width - this.width);
      }
    }
  
    display() {
      noStroke();
      fill(this.color);
      rect(this.x, this.y, this.width, this.height);
  
      fill(255, 255, 0);
      rect(this.x + 5, this.y + 45, 5, 5);
      rect(this.x + 20, this.y + 45, 5, 5);
  
      let darkerColor = color(
        red(this.color) * 0.8,
        green(this.color) * 0.8,
        blue(this.color) * 0.8
      );
      fill(darkerColor);
      stroke(0);
      rect(this.x + 5, this.y + 10, this.width - 10, this.height - 20);
    }
  }

  class RoadLine {
    constructor(y) {
      this.y = y;
      this.speed = 2;
    }
  
    update() {
      this.y += this.speed;
  
      if (this.y > height) {
        this.y = 0;
      }
    }
  
    display() {
      fill(255, 255, 0);
      rect(width / 2 - 5, this.y, 10, 30);
    }
  }
  
  class Track {
    constructor() {}
  
    display() {
      fill(150);
      rect(0, 0, width, height);
    }
  }