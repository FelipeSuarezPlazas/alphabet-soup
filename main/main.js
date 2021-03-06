

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

let ROTATION_TO_SOUP_DIRECTION = {
  90: createVector(-1, 0),
  450: createVector(-1, 0),
  270: createVector(1, 0),
  180: createVector(0, -1),
  360: createVector(0, 1),
  135: createVector(-1, -1),
  315: createVector(1, 1),
  225: createVector(1, -1),
  405: createVector(-1, 1),
}

let ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
let WORDS = ['nombre', 'esquina', 'teclado', 'color', 'estafa',
  'cigarrillo', 'limon', 'camara', 'libro', 'esfero'];


let RECTANGLE = {x: -(CELL_SIZE/2), y: -(CELL_SIZE/2), width: CELL_SIZE, height: CELL_SIZE, radius: 20};
let RECT_COLOR = color(0,0,250,50);
let RECT_COLOR_COMPLETED = color(0,250,0,50);
let RECT_STROKE_COLOR = color('black')

let UNDERLINE = {x1: 0, y1: 0, x2: SIDEBAR_SIZE.x*.6, y2: 0};
let UNDERLINE_COLOR = color('black');
let UNDERLINE_STROKE_COLOR = color(0,0,0,50)
let UNDERLNE_STROKE_WEIGHT = 4;

let last_click = createVector(0, 0);
let last_height = 0;
let last_rotation = 0;
let last_selected_cell_pos = createVector(0, 0);

let mouse = createVector(0, 0);
let pressed_soup_area = false;

let mouse_cells = [];
let string_words_cell_ids = {};
let sidebar_word_positions = {};


// -------------------------------------------------------------- FUNCTIONS.


function setup() {
  let CNV = createCanvas(CANVAS_SIZE.x, CANVAS_SIZE.y);
  CNV.parent('canva-game');

  angleMode(DEGREES);
  frameRate(30);
  restartGame();

  button = createButton('RESTART GAME');
  button.position(100, 100);
  button.mousePressed(restartGame);

  

}

function restartGame() {
  mouse_cells = [];
  string_words_cell_ids = {};
  sidebar_word_positions = {};

  pg = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);
  selections = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);
  underlines = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);


  pg.clear();
  selections.clear();
  underlines.clear();

  pg.background('white');
  pg.fill('black');

  selections.angleMode(DEGREES);
  selections.fill(RECT_COLOR_COMPLETED);
  selections.stroke(RECT_STROKE_COLOR);
  //selections.frameRate(30);

  underlines.fill(RECT_COLOR);
  underlines.stroke(RECT_STROKE_COLOR);
  underlines.strokeWeight(UNDERLNE_STROKE_WEIGHT);

  drawSeparatorLines();
  drawTitle();
  drawSidebar();
  drawAlphabetSoup();
  //basicAlphabetSoupColumnAlgorithm();
  alphabetSoupRandomAlgorithm();
}

function drawSeparatorLines() {
   // title line.
  //pg.line(0, TITLE_HEIGHT, width, TITLE_HEIGHT);

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
  pg.text('FIND ALL THE WORDS IN THE ALPHABET SOUP', (SOUP_AREA.x + SIDEBAR_SIZE.x)/2, TITLE_HEIGHT/2 + 5);
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
    pg.text('?? ' + word, pos.x, pos.y);

    sidebar_word_positions[word.toUpperCase()] = pos.copy();

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

    let [cell_id1, cell_id2] = cellIDsToString(CELL_ONE, CELL_TWO)

    string_words_cell_ids[cell_id1] = WORD;
    string_words_cell_ids[cell_id2] = WORD;
  })
}

function alphabetSoupRandomAlgorithm() {
  let marked_cell_ids = [];
  let completed_words = [];
  let cell_ids_per_word = {};

  let CHANGE_DIRECTION_TRIES = 5;
  let FIT_WORD_TRIES = 10;

  WORDS.forEach(word => {
    let WORD = word.toUpperCase();
    
    for (let change_try = 0; change_try < CHANGE_DIRECTION_TRIES; change_try++) {
      let word_direction = ROTATION_TO_SOUP_DIRECTION[random(ROTATIONS)]

      for (let fit_try = 0; fit_try < FIT_WORD_TRIES; fit_try++) {
        let word_cell_ids = [];
        let START_CELL_ID = createVector(
          Math.floor(random(SOUP_LETTERS_AMOUNT.x)), Math.floor(random(SOUP_LETTERS_AMOUNT.y)));
        console.log(START_CELL_ID.x, START_CELL_ID.y, 'START_CELL_ID');
        let actual_cell_id = p5.Vector.sub(START_CELL_ID, word_direction);
        let overflow = false;

        for (LETTER of WORD) {
          if (overflow) continue;
          actual_cell_id.add(word_direction);
          word_cell_ids.push(actual_cell_id.copy());
          console.log(WORD, 'WORD');
          //console.log(actual_cell_id.x, actual_cell_id.y, 'actual cell_id');

          // This cell id is overfloating an already marked cell id.
          // ********* this can be reduced.
          if (actual_cell_id.x >= SOUP_LETTERS_AMOUNT.x || actual_cell_id.y >= SOUP_LETTERS_AMOUNT.y ||
            actual_cell_id.x < 0 || actual_cell_id.y < 0) {
            overflow = true;
          } else {
            marked_cell_ids.forEach(marked_cell => {
              if (actual_cell_id.equals(marked_cell)) {
                overflow = true;
              }
            })
          }
        }

        if (!overflow) { // success
          marked_cell_ids = marked_cell_ids.concat(word_cell_ids);
          console.log(marked_cell_ids, 'MARKEEDDDDDD');
          completed_words.push(WORD);
          cell_ids_per_word[WORD] = word_cell_ids;
          console.log(word_cell_ids, 'word_cell_ids');

          change_try = CHANGE_DIRECTION_TRIES;
          fit_try = FIT_WORD_TRIES;


          let CELL_ONE = START_CELL_ID.copy();
          let CELL_TWO = actual_cell_id.copy();

          let [cell_id1, cell_id2] = cellIDsToString(CELL_ONE, CELL_TWO)

          //console.log('12');

          string_words_cell_ids[cell_id1] = WORD;
          string_words_cell_ids[cell_id2] = WORD;
        }
      }
    } 
  })

  // once this lists are completed, we are ready to draw the letters.
  // DRAW LETTERS

  completed_words.forEach(WORD => {
    console.log(WORD, 'word');
    cell_ids_per_word[WORD].forEach((CELL_ID, CELL_IN) => {
      let LETTER = WORD[CELL_IN];
      console.log(LETTER, 'letter');
      console.log(CELL_ID.x, CELL_ID.y, 'cell_id');

      let LETTER_POS = p5.Vector.mult(CELL_ID, CELL_SIZE);

      pg.fill('white');
      pg.stroke('red');
      pg.square(
        SOUP_START_POINT.x + LETTER_POS.x,
        SOUP_START_POINT.y + LETTER_POS.y,
        CELL_SIZE);

      pg.fill('black');
      pg.text(LETTER, 
        SOUP_START_POINT_CENTER.x + LETTER_POS.x,
        SOUP_START_POINT_CENTER.y + LETTER_POS.y);
    })
  })
}

function alphabetSoupRandomAlgorithmOld() {
  for (word of WORDS) {
    let WORD = word.toUpperCase();

    //console.log('1');

    let random_cell_ids = [];
    let RANDOM_CELL_ID = createVector(0, 0);

    let repeat;
    do {
      //console.log('2');
      do {
        //console.log('3');
        repeat = false;

        RANDOM_CELL_ID.x = Math.floor(random(SOUP_LETTERS_AMOUNT.x));
        RANDOM_CELL_ID.y = Math.floor(random(SOUP_LETTERS_AMOUNT.y));

        random_cell_ids.forEach(cell_id => {
          if (RANDOM_CELL_ID.equals(cell_id)) {
            repeat = true;
          }
        })
      } while (repeat)
      //console.log('4');
      repeat = false;

      console.log(WORD, 'WORD');
      console.log(RANDOM_CELL_ID, 'RANDOM_CELL_ID');

      let RANDOM_ROTATION = random(ROTATIONS);
      let RANDOM_SOUP_DIRECTION = ROTATION_TO_SOUP_DIRECTION[RANDOM_ROTATION];

      let CELL_IDS_MAGNITUDE = p5.Vector.mult(RANDOM_SOUP_DIRECTION, word.length);
      let END_CELL_ID = p5.Vector.add(CELL_IDS_MAGNITUDE, RANDOM_CELL_ID);

      console.log('5');
      console.log(END_CELL_ID, 'END_CELL_ID');

      if (END_CELL_ID.x < 0 || END_CELL_ID.x > SOUP_LETTERS_AMOUNT.x-1 ||
          END_CELL_ID.y < 0 || END_CELL_ID.y > SOUP_LETTERS_AMOUNT.y-1) {
        console.log('6');
        repeat = true;
      } else {
        //console.log('7');
        random_cell_ids.push(RANDOM_CELL_ID);

        // necesito una posicion que cambie, algo asi como una posicion ancual

        // si es diagonal o no, de eso depende mucho
        //let IS_DIAGONAL = DIAGONAL_ROTATIONS.includes(RANDOM_ROTATION);
        //let CELL_UNIT = IS_DIAGONAL ? CELL_SIZE_DIAGONAL : CELL_SIZE;

        let START_CELL_ID = RANDOM_CELL_ID.copy();
        let actual_cell_id = RANDOM_CELL_ID.copy();
        actual_cell_id.sub(RANDOM_SOUP_DIRECTION);
        //p5.Vector.mult(RANDOM_SOUP_DIRECTION * CELL_SIZE);
        //p5.Vector.add(actual_cell_id * CELL_UNIT);
        console.log('8');
        console.log(START_CELL_ID, CELL_SIZE);
        let actual_cell_id_pos = p5.Vector.mult(START_CELL_ID, CELL_SIZE); // ** ERROR ** v.copy is not a function.

        console.log(WORD);

        for (letter of WORD) {
          //console.log('9');
          pg.fill('white');
          pg.stroke('red');
          pg.square(
            SOUP_START_POINT.x + actual_cell_id_pos.x,
            SOUP_START_POINT.y + actual_cell_id_pos.y,
            CELL_SIZE);

          pg.fill('black');
          pg.text(letter, 
            SOUP_START_POINT_CENTER.x + actual_cell_id_pos.x,
            SOUP_START_POINT_CENTER.y + actual_cell_id_pos.y);

          //console.log('10');

          actual_cell_id_pos.add(p5.Vector.mult(RANDOM_SOUP_DIRECTION, CELL_SIZE));
          actual_cell_id.add(RANDOM_SOUP_DIRECTION);
        }

        //console.log('11');

        let CELL_ONE = createVector(START_CELL_ID.x, START_CELL_ID.y);
        let CELL_TWO = createVector(actual_cell_id.x, actual_cell_id.y);

        let [cell_id1, cell_id2] = cellIDsToString(CELL_ONE, CELL_TWO)

        //console.log('12');

        string_words_cell_ids[cell_id1] = WORD;
        string_words_cell_ids[cell_id2] = WORD;
      }

      console.log('13');
    } while (repeat)
    console.log('14');
  }
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
  image(underlines, 0, 0);

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
  mouse_cells.push(LAST_SELECTED_CELL_ID);

  //console.log(mouse_cells[0], mouse_cells[1], 'NOW LOOK AT THISS');
  console.log('one');
  let [MOUSE_CELL_ID_STRING, ignore] = cellIDsToString(mouse_cells[0], mouse_cells[1]);

  if (string_words_cell_ids[MOUSE_CELL_ID_STRING]) {
    selections.push()
    selections.translate(last_click);
    selections.rotate(last_rotation);
    selections.rect(RECTANGLE.x, RECTANGLE.y, RECTANGLE.width, last_height, RECTANGLE.radius);
    selections.pop();


    let word = string_words_cell_ids[MOUSE_CELL_ID_STRING];


    let UNDERLINE_POS =  sidebar_word_positions[word];
    underlines.push()
    underlines.translate(UNDERLINE_POS);
    underlines.line(UNDERLINE.x1, UNDERLINE.y1, UNDERLINE.x2, UNDERLINE.y2);
    underlines.pop();

    string_words_cell_ids[MOUSE_CELL_ID_STRING] = undefined;
    string_words_cell_ids[ignore] = undefined;
  }

  mouse_cells = [];

  console.log('two');
}





// cada palabra comienza en una celda y termina en una celda.

// si el mouse comienza en una celda y termina en una celda igual a la de una de las
// palabras, entonces la seleccion de guarda y se muestra siempre.

// es todo.

// cada palabra tiene dos celdas.
// cada celda tiene un vector.

// la seleccion inicia y termina en una celda.

// si esas celdas coinciden con las celdas de alguna palabra, la selecci??n se queda por siempre.




