let s;
let scl = 20;
let food;
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/_q9T0rIFT/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";


function pickLocation() {
  let cols = floor(width / scl);
  let rows = floor(height / scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

function mousePressed() {
  s.total++;
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}


// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(600,600);
  // Create the video
  s = new Snake();
  frameRate(10);
  pickLocation();
  video = createCapture(VIDEO);
  video.size(320, 240);
  // video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

function draw() {
  background(51);
  if (s.eat(food)) {
    pickLocation();
  }

  if (label === 'Up') {
    s.dir(0, -1);
  } else if (label === 'Down') {
    s.dir(0, 1);
  } else if (label === 'Right') {
    s.dir(1, 0);
  } else if (label === 'Left') {
    s.dir(-1, 0);

  }
  s.death();
  s.update();
  s.show();
  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}
