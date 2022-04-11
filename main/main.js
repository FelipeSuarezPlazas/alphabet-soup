

// -------------------------------------------------------------- ALPHABET SOUP.

new p5();

// -------------------------------------------------------------- VARS.


let TITLE_HEIGHT = 70;

let CELL_SIZE = 25;
let CELL_SIZE_DIAGONAL = createVector(CELL_SIZE, CELL_SIZE).mag();

let SOUP_MARGIN = 20;
let SOUP_LETTERS_AMOUNT = createVector(20, 20);
let SOUP_AREA = createVector(SOUP_LETTERS_AMOUNT.x * CELL_SIZE, SOUP_LETTERS_AMOUNT.y * CELL_SIZE);
let SOUP_START_POINT = createVector(SOUP_MARGIN, TITLE_HEIGHT + SOUP_MARGIN);
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

let word_cells = {};
let mouse_cells = [];

let RECTANGLE = {x: -(CELL_SIZE/2), y: -(CELL_SIZE/2), width: CELL_SIZE, height: CELL_SIZE, radius: 20};
let RECT_COLOR = color(0,0,0,50);
let RECT_STROKE_COLOR = color('black')


let last_click = createVector(0, 0);
let last_height = 0;
let last_rotation = 0;
let last_selected_cell_pos = createVector(0, 0);

let mouse = createVector(0, 0);
let pressed_soup_area = false;



let string_words_cell_ids = {};

// esto no deberia ser un array, mas bien un diccionario
// como cada llave es unica, habrian dos llaves con un mismo valor.




// -------------------------------------------------------------- FUNCTIONS.


function setup() {
  let CNV = createCanvas(CANVAS_SIZE.x, CANVAS_SIZE.y);
  CNV.parent('canva-game');

  angleMode(DEGREES);
  frameRate(30);

  pg = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);
  pg.background('white');
  pg.fill('black');

  selections = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);
  selections.angleMode(DEGREES);
  selections.fill(RECT_COLOR);
  selections.stroke(RECT_STROKE_COLOR);
  //selections.frameRate(30);

  drawSeparatorLines();
  drawTitle();
  drawSidebar();
  drawAlphabetSoup();
  basicAlphabetSoupColumnAlgorithm();
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

function basicAlphabetSoupColumnAlgorithm() {
  // ************************************************** THIS WAS DESIGNED TO BE MORE COLUMNS THAN WORDS ********
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
    // guardar esta palabra con sus dos celdas.
    // y con un bool que me indique si ya se seleccionó



    let RANDOM_COLUMN_POS = (random_column_index * CELL_SIZE);
    let RANDOM_COLUMN_START_CELL = Math.round(random(0, (SOUP_LETTERS_AMOUNT.y - WORD.length) ));
    let RANDOM_COLUMN_START_CELL_POS = (RANDOM_COLUMN_START_CELL * CELL_SIZE);
    let final_cell = RANDOM_COLUMN_START_CELL - 1;
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
      final_cell += 1;
    }

    let CELL_ONE = createVector(random_column_index, RANDOM_COLUMN_START_CELL);
    let CELL_TWO = createVector(random_column_index, final_cell);
    console.log(WORD, CELL_ONE, CELL_TWO, 'LOOOK AT THIS AND COMPARE');
    word_cells[WORD] = {cells: [CELL_ONE, CELL_TWO], selected: false};

    let [cell_id1, cell_id2] = cellIDsToString(CELL_ONE, CELL_TWO)

    string_words_cell_ids[cell_id1] = WORD;
    string_words_cell_ids[cell_id2] = WORD;
  })
}

function drawWordSelection() {
  if (!pressed_soup_area) return;

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


    // check if the magnitude of the selection is contained in soup area.
    let check_point = p5.Vector.fromAngle(radians(actual_rotation + 90), actual_height - (CELL_SIZE/1.5));
    check_point.add(last_click);

    if (isOnSoupArea(check_point)) {
      last_rotation = actual_rotation;
      last_height = actual_height;
      last_selected_cell_pos = p5.Vector.fromAngle(radians(last_rotation + 90), last_height - (CELL_SIZE/1.5));
      last_selected_cell_pos.add(last_click);
    }

    //circle(check_point.x, check_point.y, 5);
  }
  circle(last_selected_cell_pos.x, last_selected_cell_pos.y, 5);
  translate(last_click);
  rotate(last_rotation);
  rect(RECTANGLE.x, RECTANGLE.y, RECTANGLE.width, last_height, RECTANGLE.radius);
}

function draw() {
  image(pg, 0, 0);
  image(selections, 0, 0);

  // transform mouse positions to vector variable for Math purpouses.
  [mouse.x, mouse.y] = [mouseX, mouseY];
  drawWordSelection();
}

// return a bool if vector is inside de soup area.
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

// aqui debo pasar ambos? bueno... si, tecnicamente si. ambos debo pasarlos.

function cellIDsToString(cell_id1, cell_id2) {
  let str = '';
  str += `${cell_id1.x}.${cell_id1.y}.${cell_id2.x}.${cell_id2.y}`

  let str2 = '';
  str2 += `${cell_id2.x}.${cell_id2.y}.${cell_id1.x}.${cell_id1.y}`

  return [str, str2];
}

function vectorToCellID(vec) {
  // round vector position to nearest cell_size multiple.
  let POS_IN_SOUP_AREA = p5.Vector.sub(vec, SOUP_START_POINT_CENTER);
  let CELL_UNITS_IN_MAGNITUD = p5.Vector.div(POS_IN_SOUP_AREA, CELL_SIZE);
  CELL_UNITS_IN_MAGNITUD.x = Math.round(CELL_UNITS_IN_MAGNITUD.x);
  CELL_UNITS_IN_MAGNITUD.y = Math.round(CELL_UNITS_IN_MAGNITUD.y);

  let CELL_ID = CELL_UNITS_IN_MAGNITUD
  console.log(CELL_ID, 'CELL_ID')
  return CELL_ID;
}

function mousePressed() {
  console.log('PRESSED');
  fill(RECT_COLOR);

  // transform mouse position to cell position.
  // then save it on last_click.

  pressed_soup_area = isOnSoupArea(mouse);
  if (pressed_soup_area) {
    let MOUSE_TO_CELL_ID = vectorToCellID(mouse)
    let MOUSE_TO_CELL_POSITION = p5.Vector.mult(MOUSE_TO_CELL_ID, CELL_SIZE);
    last_click = MOUSE_TO_CELL_POSITION.add(SOUP_START_POINT_CENTER);

    //console.log(MOUSE_TO_CELL_ID, 'look at this');
    mouse_cells.push(MOUSE_TO_CELL_ID);
  }
}

function mouseReleased() {
  console.log('RELEASED');
  pressed_soup_area = false;
  let LAST_SELECTED_CELL_ID = vectorToCellID(last_selected_cell_pos);
  console.log(LAST_SELECTED_CELL_ID, 'LAST_SELECTED_CELL_ID');
  mouse_cells.push(LAST_SELECTED_CELL_ID);
  let WORD_CELLS_KEYS = Object.keys(word_cells); // array with all the keys.

  console.log(mouse_cells[0], mouse_cells[1], 'NOW LOOK AT THISS');
  //console.log(mouse_cells[0], console.log(LAST_SELECTED_CELL_ID), 'NOW LOOK AT THISS');

  // necesito hacer esto de una forma mucho más eficiente.
  // each word have two cell_ids
  // so is there a word that have one of these cell_ids??

  //un diccionario que contiene como llave todos los cell_ids de inicio
  // con la palabra como valor
  // y otro diccionario que contenga como llave los cell_ids, y
  // la palabra como valor.

  // voy a tener una lista, con todos los cell_ids en forma de string

  // e.x - cell_id1.15.10.2
  // e.x - cell_id10.2.1.15

  let [MOUSE_CELL_ID_STRING, ignore] = cellIDsToString(mouse_cells[0], mouse_cells[1]);

  if (string_words_cell_ids[MOUSE_CELL_ID_STRING]) {
    // YA NO NECESITO EL SELECTED, SE PUEDE IR AL CARAJO.
    selections.push()
    selections.translate(last_click);
    selections.rotate(last_rotation);
    selections.rect(RECTANGLE.x, RECTANGLE.y, RECTANGLE.width, last_height, RECTANGLE.radius);
    selections.pop();

    string_words_cell_ids[MOUSE_CELL_ID_STRING] = undefined;
    string_words_cell_ids[ignore] = undefined;
  }

  mouse_cells = [];
}



// cada palabra comienza en una celda y termina en una celda.

// si el mouse comienza en una celda y termina en una celda igual a la de una de las
// palabras, entonces la seleccion de guarda y se muestra siempre.

// es todo.

// cada palabra tiene dos celdas.
// cada celda tiene un vector.

// la seleccion inicia y termina en una celda.

// si esas celdas coinciden con las celdas de alguna palabra, la selección se queda por siempre.




