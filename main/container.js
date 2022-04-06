var index;
var circleInitPos;
var circlePos;
var circleSize;
var circleContainer;



function setup() {
  // Definir lienzo de 720 pixeles de ancho y 400 pixeles de alto
  index = 0;
  var margin = 150
  circleInitPos = createVector(margin, margin); 
  circlePos = createVector(margin, margin);
  circleSize = 10;
  circleContainer = createVector(50, 30);


  createCanvas(1500, 800);
  background(0);
  fill(0);
  stroke(255);
  frameRate(60);
}

function draw() {
  if (circlePos.y < ((circleSize * circleContainer.y) + circleInitPos.y) ) {

    circle(circlePos.x, circlePos.y, 5);

    circlePos.x += circleSize;

    if (circlePos.x > ((circleSize * circleContainer.x) + circleInitPos.x)) {
      circlePos.y += circleSize;
      circlePos.x = circleInitPos.x;
    }
  }
}