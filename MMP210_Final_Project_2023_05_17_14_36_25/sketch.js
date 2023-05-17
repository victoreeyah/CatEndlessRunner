let player; // player object
let obstacles = []; // array of obstacle objects
let score = 0; // player's score
let cat;
let gameOver = true;
let start = "click anywhere to start";
let lake;

var serial;
var portName = "COM6";
var inMessage = 1;
var oldMessage = 1;
// let canJump = true;

function setup() {
  createCanvas(400, 400);
  player = new Player();
  obstacles.push(new Obstacle());
  cat = loadImage ('cat.png');
  lake = loadImage ('lake.jpg')
  
  serial = new p5.SerialPort();
  serial.list();
  serial.open(portName);
  serial.on('list', gotList);
  serial.on('data', gotData);
}

function gotList(thelist) {
  for (var i = 0; i < thelist.length; i++) {
    console.log(i + " " + thelist[i]);
  }
}

function gotData() {
  var currentString = serial.readLine();  
  trim(currentString);
  if (!currentString) return;
  console.log(currentString);
      inMessage = currentString;
}
  
function draw() {
  
//     if (inMessage === 0 && canJump) {
//     player.jump();
//     canJump = false;
//     }
  
    if (inMessage == '0' && oldMessage == '1'){
    player.jump();
    // event.preventDefault();
  }
  oldMessage = inMessage;

  background(58, 44, 163);
  // image(lake, 0, 0)
  
  text(start, 100,200);
  
  player.show();
  if(!gameOver){
  player.move();

  // add new obstacles
  if (frameCount % 90 == 0) {
    obstacles.push(new Obstacle());
  }

  // remove obstacles that are offscreen
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].show();
    obstacles[i].move();
    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  // check for collision with obstacles
   for (let i = 0; i < obstacles.length; i++) {
   if (player.hits(obstacles[i])) {
     gameOver = true;
     obstacles[i]. x = width;
     alert("Game Over! Your score was: " + score);
   //  location.reload();
  }
 }
  }
   // display score
  textSize(20);
  text("Score: " + score, 10, 30);
}

class Player {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = 50;
    this.y = height - this.height;
    this.velocity = 0;
    this.gravity = 0.6;
  }

  show() {
    image(cat,this.x, this.y, this.width, this.height);
  }

  move() {
    // apply gravity
    this.velocity += this.gravity;
    this.y += this.velocity;

    // check for ground
    if (this.y >= height - this.height) {
      this.y = height - this.height;
      this.velocity = 0;
    }
  }

  hits(obstacle) {
    if (this.x + this.width >= obstacle.x && this.x <= obstacle.x + obstacle.width) {
      if (this.y + this.height >= obstacle.y) {
        return true;
      }
    }
    return false;
  }

  jump() {
    this.velocity -= 15;
  }
}

class Obstacle {
  constructor() {
    this.width = random(20, 80);
    this.height = random(20, 80);
    this.x = width;
    this.y = height - this.height;
    this.speed = 5;
  }

  show() {
    fill(0, 255, 0);
    rect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.x -= this.speed;
  }

  offscreen() {
    if (this.x + this.width < 0) {
      return true;
    }
    return false;
  }
}

// function keyPressed() {
  // if (key == ' '|| keyCode == UP_ARROW) {
//     player.jump();
//     // event.preventDefault();
//   }
// }

function mousePressed(){
  if (gameOver){
    gameOver = false;
    score = 0;
    start = "";
  }
}