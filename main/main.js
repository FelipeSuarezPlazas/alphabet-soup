

// -------------------------------------------------------------- ALPHABET SOUP.

new p5();

// -------------------------------------------------------------- VARS.




/**

Lets start with the soup.
it has a rectangle, lines, letters, and special letters.

all of that is drawn just one time per game.
*/






const GAME_MARGIN = 30;
const RECT_RADIUS = 10;


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
let WORDS = ['playground', 'clothes', 'ball', 'learning', 'finland', 'airplane', 'travel',
              'butterfly', 'language', 'programming', 'puzzle', 'store', 'cloud'];


// ---------------------------------------------------- SOUP


const CELL_SIZE = 30;
const CELL_SIZE_DIAGONAL = createVector(CELL_SIZE, CELL_SIZE).mag();

const SOUP_MARGIN = 30;
const SOUP_LETTERS_AMOUNT = createVector(14, 14);
const SOUP_AREA = createVector(SOUP_LETTERS_AMOUNT.x * CELL_SIZE, SOUP_LETTERS_AMOUNT.y * CELL_SIZE);
const SOUP_START_POINT = createVector(GAME_MARGIN + SOUP_MARGIN, GAME_MARGIN + SOUP_MARGIN);
const SOUP_START_POINT_CENTER = createVector(SOUP_START_POINT.x + (CELL_SIZE/2), SOUP_START_POINT.y + (CELL_SIZE/2));

let soup = {
  // as this is drawn just one time, I dont know if this needs a graphics variable.
  graphics: createGraphics(windowWidth, windowHeight),
  pos: SOUP_START_POINT.copy(),
  center_pos: SOUP_START_POINT_CENTER.copy(),
  size: SOUP_AREA.copy(),
  completed_words: [],
  completed_words_counter: 0,
  completed_words_limit: 8,

  drawContainer: function() {
    this.graphics.rect(this.pos.x, this.pos.y, this.size.x, this.size.y, RECT_RADIUS);
  },
  drawDivisions: function() {
    // ----- rows.
    for (let i = 1; i <= SOUP_LETTERS_AMOUNT.y-1; i++) {
      this.graphics.line(
        SOUP_START_POINT.x,
        SOUP_START_POINT.y + (CELL_SIZE * i), 
        SOUP_START_POINT.x + SOUP_AREA.x, 
        SOUP_START_POINT.y + (CELL_SIZE * i));
    }

    // ----- columns.
    for (let i = 1; i <= SOUP_LETTERS_AMOUNT.x-1; i++) {
      this.graphics.line(
        SOUP_START_POINT.x + (CELL_SIZE * i),
        SOUP_START_POINT.y, 
        SOUP_START_POINT.x + (CELL_SIZE * i), 
        SOUP_START_POINT.y + SOUP_AREA.y);
    }
  },
  drawLetters: function() {
    this.graphics.textAlign(CENTER, CENTER);
    this.graphics.textSize(15);

    let ROW_LIMIT = SOUP_START_POINT.x + SOUP_AREA.x;
    let COLUMN_LIMIT = SOUP_START_POINT.y + SOUP_AREA.y;

    for (var x=SOUP_START_POINT_CENTER.x; x < ROW_LIMIT; x += CELL_SIZE) {
      for (var y=SOUP_START_POINT_CENTER.y; y < COLUMN_LIMIT; y += CELL_SIZE) {

        let letter_index = random(ALPHABET.length);
        let random_letter = ALPHABET[Math.floor(letter_index)].toUpperCase();

        this.graphics.text(random_letter, x, y);
      }
    }
  },
  drawWords: function() {
    let marked_cell_ids = [];
    let cell_ids_per_word = {};

    let CHANGE_DIRECTION_TRIES = 5;
    let FIT_WORD_TRIES = 10;

    WORDS.forEach(word => {
      if (this.completed_words_counter >= this.completed_words_limit) return;
      this.completed_words_counter++;

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
            this.completed_words.push(WORD);
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
    this.graphics.textSize(15);

    this.completed_words.forEach(WORD => {
      console.log(WORD, 'word');
      cell_ids_per_word[WORD].forEach((CELL_ID, CELL_IN) => {
        let LETTER = WORD[CELL_IN];
        //console.log(LETTER, 'letter');
        //console.log(CELL_ID.x, CELL_ID.y, 'cell_id');

        let LETTER_POS = p5.Vector.mult(CELL_ID, CELL_SIZE);

        this.graphics.fill('white');
        this.graphics.stroke('red');
        this.graphics.square(
          SOUP_START_POINT.x + LETTER_POS.x,
          SOUP_START_POINT.y + LETTER_POS.y,
          CELL_SIZE);

        //this.graphics.noStroke();
        this.graphics.fill('black');
        this.graphics.text(LETTER, 
          SOUP_START_POINT_CENTER.x + LETTER_POS.x,
          SOUP_START_POINT_CENTER.y + LETTER_POS.y);
      })
    })
  }
}



// ---------------------------------------------------- SIEDEBAR


let SIDEBAR_SIZE = createVector(150, SOUP_AREA.y); // falta el margin.
let SIDEBAR_PADDING = createVector(10, 15);
let SIDEBAR_START_POINT = createVector(
  SOUP_START_POINT.x + SOUP_AREA.x + SOUP_MARGIN, 
  SOUP_START_POINT.y);


let sidebar = {
  graphics: createGraphics(windowWidth, windowHeight),
  size: createVector(150, 400),
  pos: createVector( 
    SOUP_START_POINT.x + SOUP_AREA.x + SOUP_MARGIN, 
    SOUP_START_POINT.y),
  words_margin: 34,
  word_positions: {},

  drawContainer: function() {
    this.graphics.rect(this.pos.x, this.pos.y, this.size.x, this.size.y, RECT_RADIUS);
  },
  drawWords: function() {
    this.graphics.textAlign(LEFT, CENTER);
    this.graphics.textSize(12);

    let actual_pos = this.pos.copy();

    soup.completed_words.forEach(WORD => {
      this.graphics.text('· ' + WORD.toUpperCase(), actual_pos.x, actual_pos.y);
      this.word_positions[WORD.toUpperCase()] = actual_pos.copy();
      actual_pos.add(0, this.words_margin);
    })
  },
}



// ---------------------------------------------------- RESTART BUTTON


const BUTTON_SIZE = createVector(sidebar.size.x, 28);
const BUTTON_POS = createVector(
  CANVAS_SIZE.x - SOUP_MARGIN - BUTTON_SIZE.x,
  CANVAS_SIZE.y - SOUP_MARGIN - BUTTON_SIZE.y);

let restart_bttn = {
  graphics: createGraphics(windowWidth, windowHeight),
  pos: createVector(sidebar.pos.x, soup.pos.y + soup.size.y - BUTTON_SIZE.y),
  size: BUTTON_SIZE.copy(),

  drawContainer: function() {
    this.graphics.fill('white');
    this.graphics.stroke('black');
    this.graphics.rect(this.pos.x, this.pos.y, this.size.x, this.size.y, RECT_RADIUS);
  },
  drawText: function() {
    this.graphics.fill('black');
    this.graphics.noStroke();
    this.graphics.textAlign(CENTER, CENTER);
    this.graphics.textSize(11);
    this.graphics.text(
      'RESTART', 
      this.pos.x + (this.size.x/2), 
      this.pos.y + (this.size.y/2));
  },
  draw: function() {
    this.drawContainer();
    this.drawText();
  }
}



let CANVAS_SIZE = createVector(
  SOUP_AREA.x + (SOUP_MARGIN*2) + SIDEBAR_SIZE.x,
  SOUP_AREA.y + (SOUP_MARGIN*2));


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
let restart_button_pressed = false;


// -------------------------------------------------------------- FUNCTIONS.


function setup() {
  let CNV = createCanvas(windowWidth, windowHeight);
  CNV.parent('canva-game');

  angleMode(DEGREES);
  frameRate(30);

  drawBackgrounds()
  restartGame();
}

function drawBackgrounds() {
  //fill('black');
  //stroke('black');
  strokeWeight(2);
  rect(0, 0, CANVAS_SIZE.x, CANVAS_SIZE.y, RECT_RADIUS);
}

function restartGame() {
  mouse_cells = [];
  string_words_cell_ids = {};

  ui = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);
  selections = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);
  underlines = createGraphics(CANVAS_SIZE.x, CANVAS_SIZE.y);


  ui.clear();
  selections.clear();
  underlines.clear();

  //ui.background('white');
  ui.fill('black');
  ui.textFont('Cursive');

  selections.angleMode(DEGREES);
  selections.fill(RECT_COLOR_COMPLETED);
  selections.stroke(RECT_STROKE_COLOR);
  //selections.frameRate(30);

  underlines.fill(RECT_COLOR);
  underlines.stroke(RECT_STROKE_COLOR);
  underlines.strokeWeight(UNDERLNE_STROKE_WEIGHT);

  drawRestartBtn();
  drawLines();
  drawSoup();
  algorithm();
  drawSidebar();
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
  image(ui, 0, 0);
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

function cellIDsToString(cell_id1, cell_id2) {
  let str = '';
  str += `${cell_id1.x}.${cell_id1.y}.${cell_id2.x}.${cell_id2.y}`

  let str2 = '';
  str2 += `${cell_id2.x}.${cell_id2.y}.${cell_id1.x}.${cell_id1.y}`

  return [str, str2];
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

  if (mouseX >= BUTTON_POS.x && mouseX < (BUTTON_POS.x + BUTTON_SIZE.x) && 
    mouseY >= BUTTON_POS.y && mouseY < (BUTTON_POS.y + BUTTON_SIZE.y)) {
    restart_button_pressed = true;
  }
}

function mouseReleased() {
  console.log('RELEASED');
  pressed_soup_area = false;
  if (restart_button_pressed) {
    if (mouseX >= BUTTON_POS.x && mouseX < (BUTTON_POS.x + BUTTON_SIZE.x) && 
      mouseY >= BUTTON_POS.y && mouseY < (BUTTON_POS.y + BUTTON_SIZE.y)) {
      restart_button_pressed = false;
      restartGame();
    }
  } else {
    let LAST_SELECTED_CELL_ID = vectorToCellID(last_selected_cell_pos);
    mouse_cells.push(LAST_SELECTED_CELL_ID);

    //console.log(mouse_cells[0], mouse_cells[1], 'NOW LOOK AT THISS');
    console.log('one');
    let [MOUSE_CELL_ID_STRING, ignore] = cellIDsToString(mouse_cells[0], mouse_cells[1]);

    console.log(MOUSE_CELL_ID_STRING)

    if (string_words_cell_ids[MOUSE_CELL_ID_STRING]) {
      selections.push()
      selections.translate(last_click);
      selections.rotate(last_rotation);
      selections.rect(RECTANGLE.x, RECTANGLE.y, RECTANGLE.width, last_height, RECTANGLE.radius);
      selections.pop();


      let word = string_words_cell_ids[MOUSE_CELL_ID_STRING];


      let UNDERLINE_POS = sidebar_word_positions[word];
      underlines.push()
      underlines.translate(UNDERLINE_POS);
      underlines.line(UNDERLINE.x1, UNDERLINE.y1, UNDERLINE.x2, UNDERLINE.y2);
      underlines.pop();

      string_words_cell_ids[MOUSE_CELL_ID_STRING] = undefined;
      string_words_cell_ids[ignore] = undefined;
    }

    mouse_cells = [];
  }
}








