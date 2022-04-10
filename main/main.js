

// -------------------------------------------------------------- ALPHABET SOUP.

new p5();

// -------------------------------------------------------------- VARS.


let TITLE_HEIGHT = 70;

let CELL_SIZE = 25;
let CELL_SIZE_DIAGONAL = createVector(CELL_SIZE, CELL_SIZE).mag();

let SOUP_MARGIN = 20;
let SOUP_LETTERS_AMOUNT = createVector(20, 20);
let SOUP_AREA = createVector(SOUP_LETTERS_AMOUNT.x * CELL_SIZE, SOUP_LETTERS_AMOUNT.y * CELL_SIZE);
let SOUP_START_POINT = createVector(SOUP_MARGIN + (SOUP_MARGIN/2), TITLE_HEIGHT + (SOUP_MARGIN+(SOUP_MARGIN/2)));
let SOUP_START_POINT_CENTER = createVector(SOUP_START_POINT.x + (CELL_SIZE/2), SOUP_START_POINT.y + (CELL_SIZE/2));

let SIDEBAR_SIZE = createVector(150, SOUP_AREA.y); // falta el margin.

let CANVAS_SIZE = createVector(
  SOUP_AREA.x + (SOUP_MARGIN*2) + SIDEBAR_SIZE.x,
  SOUP_AREA.y + (SOUP_MARGIN*2) + TITLE_HEIGHT);


let ROTATIONS = [90, 135, 180, 225, 270, 315, 360, 405, 450];
let DIAGONAL_ROTATIONS = [135, 225, 315, 405];

let ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
let WORDS = ['Carro','Casa','Elefante','Sol','Cubo',
    'Celular','Vaso','Almohada','Programar','Texto',];


let RECTANGLE = {x: -(CELL_SIZE/2), y: -(CELL_SIZE/2), width: CELL_SIZE, height: CELL_SIZE, radius: 20};
let RECT_COLOR = color(0,0,0,50);


let last_click = createVector(0, 0);
let last_height = 0;
let last_rotation = 0;

let mouse = createVector(0, 0);
let mouse_pressed_soup = false;


// -------------------------------------------------------------- FUNCTIONS.


function setup() {
  let CNV = createCanvas(CANVAS_SIZE.x, CANVAS_SIZE.y);
  CNV.parent('canva-game');

  angleMode(DEGREES);
  frameRate(30);

  pg = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);
  pg.background('white');
  pg.fill('black');

  drawSeparatorLines();
  drawTitle();
  drawSidebar();
  drawAlphabetSoup();
  basicColumnAlphabetSoupAlgorithm();
}

function drawSeparatorLines() {
   // title line.
  pg.line(0, TITLE_HEIGHT, width, TITLE_HEIGHT);

  // line between soup and WORDS.
  pg.line(SOUP_AREA.x + (SOUP_MARGIN*2), TITLE_HEIGHT, SOUP_AREA.x + (SOUP_MARGIN*2), height);

  // ----- draw soup columns.
  for (let i = 0; i <= SOUP_LETTERS_AMOUNT.x; i++) {
    pg.line(
      SOUP_START_POINT.x + (CELL_SIZE * i),
      SOUP_START_POINT.y, 
      SOUP_START_POINT.x + (CELL_SIZE * i), 
      SOUP_START_POINT.y + SOUP_AREA.y);
  }

  // ----- draw soup rows.
  for (let i = 0; i <= SOUP_LETTERS_AMOUNT.y; i++) {
    pg.line(
      SOUP_START_POINT.x,
      SOUP_START_POINT.y + (CELL_SIZE * i), 
      SOUP_START_POINT.x + SOUP_AREA.x, 
      SOUP_START_POINT.y + (CELL_SIZE * i));
  }
}

function drawTitle() {
  pg.textSize(25);
  pg.textAlign(CENTER, CENTER);
  pg.text('Sopa de letras', (SOUP_AREA.x + SIDEBAR_SIZE.x)/2, TITLE_HEIGHT/2 + 5);
}

function drawSidebar() {
  pg.textAlign(LEFT, CENTER);
  pg.textSize(15);

  let SIDEBAR_PADDING = createVector(20, 30);

  let pos = createVector(
    SOUP_AREA.x + (SOUP_MARGIN*2) + SIDEBAR_PADDING.x,
    TITLE_HEIGHT + SIDEBAR_PADDING.y);

  let WORDS_MARGIN = 40;

  for (word of WORDS) {
    pg.text('· ' + word, pos.x, pos.y);
    pos.y += WORDS_MARGIN;
  }
}

function drawAlphabetSoup() {
  pg.textAlign(CENTER, CENTER);

  let ROW_LIMIT = SOUP_START_POINT.x + SOUP_AREA.x;
  let COLUMN_LIMIT = SOUP_START_POINT.y + SOUP_AREA.y;

  for (var x=SOUP_START_POINT_CENTER.x; x < ROW_LIMIT; x += CELL_SIZE) {
    for (var y=SOUP_START_POINT_CENTER.y; y < COLUMN_LIMIT; y += CELL_SIZE) {

      let letter_index = random(ALPHABET.length);
      let random_letter = ALPHABET[Math.floor(letter_index)].toUpperCase();

      pg.text(random_letter, x, y);
    }
  }
}

function basicColumnAlphabetSoupAlgorithm() {
  // ************************************************** THIS WAs DESIGNED TO BE MORE COLUMNS THAN WORDS ********
  let random_columns = []

  while (random_columns.length < WORDS.length) {
    let random_index = Math.floor(random(SOUP_LETTERS_AMOUNT.x));
    if (!random_columns.includes(random_index)) {
      random_columns.push(random_index);
      console.log(random_index, 'random column');
    }
  }

  random_columns.forEach( (random_column_index, index) => {
    let WORD = WORDS[index].toUpperCase();
    let RANDOM_COLUMN_POS = (random_column_index * CELL_SIZE);
    let RANDOM_COLUMN_START_CELL = Math.round(random(0, (SOUP_LETTERS_AMOUNT.y - WORD.length) ));
    let RANDOM_COLUMN_START_CELL_POS = (RANDOM_COLUMN_START_CELL * CELL_SIZE);
    let cell_pos = RANDOM_COLUMN_START_CELL_POS;

    for (letter of WORD) {
      pg.fill('white');
      pg.stroke('red');
      pg.square(
        SOUP_START_POINT.x + RANDOM_COLUMN_POS, 
        SOUP_START_POINT.y + cell_pos,
        CELL_SIZE);

      pg.fill('black');
      pg.text(letter, 
        SOUP_START_POINT_CENTER.x + RANDOM_COLUMN_POS,
        SOUP_START_POINT_CENTER.y + cell_pos);

      cell_pos += CELL_SIZE;
    }
  })
}

function drawWordSelection() {
  if (!mouse_pressed_soup) return;
  

  // update selection rotation and translation only if mouse still in soup area.
  // if not in soup area, keep show selection with last variables.
  if (isOnSoupArea(mouse)) {
    let actual_height = 0;
    let actual_rotation = 0;

    // round angle to nearest 45 multiple.
    // then save it on last_rotation.
    let RECT_VECTOR = mouse.sub(last_click);
    let RECT_VECTOR_ROTATION = atan2(RECT_VECTOR.y, RECT_VECTOR.x) + 270;
    actual_rotation = Math.round(RECT_VECTOR_ROTATION / 45) * 45;

    // round magnitud to nearest cell_unit multiple.     
    // then save it on last_height.
    let IS_DIAGONAL = DIAGONAL_ROTATIONS.includes(last_rotation);
    let CELL_UNIT = IS_DIAGONAL ? CELL_SIZE_DIAGONAL : CELL_SIZE;
    let CELL_UNITS_IN_MAGNITUD = Math.floor( (RECT_VECTOR.mag() + (CELL_UNIT / 2)) / CELL_UNIT);
    let MAGNITUD_TO_CELL_UNIT = CELL_UNITS_IN_MAGNITUD * CELL_UNIT;
    actual_height = RECTANGLE.height + MAGNITUD_TO_CELL_UNIT;


    // la magnitud del vector no puede pasar ciertos limites
    // basicamente esto es para arreglar el bug.
    // pero desde donde se oprime y teniendo en cuenta el angulo de eset
    // no puede pasar cierta magnitud por que o si no, se estaria saliendo del area de la sopa.

    // o no le pongo un limite a la magnitud, si no que más bien veo si el vector
    // que esta en la punta de la seleccion esta dentro del area o no.

    // cual es el vector que esta en la punta de la seleccion?
    // bueno.. es la posicion de last_click, apuntando a la direccion que ya tengo
    // con la magnitud que tambien ya tengo.
    // ese es el vector

    // este es el vector con el que comprobamos que las variables esten dentro
    // el vector que comprueba.
    let check_point = p5.Vector.fromAngle(radians(actual_rotation + 90), actual_height - (CELL_SIZE/1.5));
    check_point.add(last_click);

    if (isOnSoupArea(check_point)) {
      last_rotation = actual_rotation;
      last_height = actual_height;

      //circle(check_point.x, check_point.y, 5);
    }
  }

  translate(last_click);
  rotate(last_rotation);
  rect(RECTANGLE.x, RECTANGLE.y, RECTANGLE.width, last_height, RECTANGLE.radius);
}


function draw() {
  image(pg, 0, 0);

  // transform mouse positions to vector variable for Math purpouses.
  [mouse.x, mouse.y] = [mouseX, mouseY];
  drawWordSelection();
}

function mousePressed() {
  console.log('PRESSED');
  fill(RECT_COLOR);

  // round mouse position to nearest cell_size_center multiple.
  // then save it on last_click.

  mouse_pressed_soup = isOnSoupArea(mouse);
  if (mouse_pressed_soup) {
    let MOUSE_POS_IN_SOUP_AREA = p5.Vector.sub(mouse, SOUP_START_POINT_CENTER);
    let CELL_UNITS_IN_MAGNITUD = p5.Vector.div(MOUSE_POS_IN_SOUP_AREA, CELL_SIZE);
    CELL_UNITS_IN_MAGNITUD.x = Math.round(CELL_UNITS_IN_MAGNITUD.x);
    CELL_UNITS_IN_MAGNITUD.y = Math.round(CELL_UNITS_IN_MAGNITUD.y);
    let MAGNITUD_TO_CELL_UNIT = p5.Vector.mult(CELL_UNITS_IN_MAGNITUD, CELL_SIZE);
    last_click = MAGNITUD_TO_CELL_UNIT.add(SOUP_START_POINT_CENTER);
  }
}

function isOnSoupArea(v) {
  if (v.x > SOUP_START_POINT.x
      && v.x < (SOUP_START_POINT.x + SOUP_AREA.x)
      && v.y > SOUP_START_POINT.y
      && v.y < (SOUP_START_POINT.y + SOUP_AREA.y)) { // el mouse esta dentro de la sopa de letras.

    return true;
  } else {
    return false;
  }
}

function mouseReleased() {
  console.log('RELEASED');

  mouse_pressed_soup = false;
}




