

// -------------------------------------------------------------- ALPHABET SOUP.


// Qué es el ser humano? que quiere el ser humano?
// jaaaajaaaaaaajajajajajaja que carajos quierooo yooooo??????P



// -------------------------------------------------------------- FUNCTIONS.

const ROTATIONS = [90, 135, 180, 225, 270, 315, 360, 405, 450];
const DIAGONAL_ROTATIONS = [135, 225, 315, 405];


function initVars() {
  space_between_letters = 25;
  title_height = 70;
  letters_amount = createVector(20, 20);
  cell_size = createVector(space_between_letters, space_between_letters);
  soup_size = createVector(
    letters_amount.x * (cell_size.x), 
    letters_amount.x * (cell_size.y));

  space_between_letters_diagonal = cell_size.mag(); // esta es la hipotenusa, la magnitud de

  soup_margin = 20;
  //soup_start_point = createVector(soup_margin + (soup_margin/2), title_height + (soup_margin+(soup_margin/2)));
  soup_start_point = createVector(soup_margin + (soup_margin/2), title_height + (soup_margin+(soup_margin/2)));

  sidebar_size = createVector(150, soup_size.y);

  alphabet = 'abcdefghijklmnopqrstuvwxyz';
  words = [
    'Carro',
    'Casa',
    'Elefante',
    'Sol',
    'Cubo',
    'Celular',
    'Vaso',
    'Almohada',
    'Programar',
    'Texto',
  ];



  mouse = createVector(0, 0);
  last_click = createVector(0, 0);

  mouse_pressed_soup = false;
  last_rect = {x: -10, y: -10, width: 0, height: 0};
  last_canva_rotation = 0;
  rectangle = {x: -(space_between_letters/2), y: -(space_between_letters/2), width: space_between_letters, height: space_between_letters, ratio: 20};

  angleMode(DEGREES);
  frameRate(30); 
}

function initCanvas() {
  let canvasSize = createVector(
    soup_size.x + sidebar_size.x + (soup_margin*2),
    soup_size.y + title_height + (soup_margin*2));

  cnv = createCanvas(canvasSize.x, canvasSize.y);
  cnv.parent('canva-game');

  pg = createGraphics(canvasSize.x, canvasSize.y);
}

function setup() {

  initVars();
  initCanvas();

  pg.background('white');
  pg.fill('black');

  drawSeparatorLines();
  drawTitle();
  drawSidebar();
  drawAlphabetSoup();
  
  wordsPerColumn();
}

function drawSeparatorLines() {
   // title line.
  pg.line(0, title_height, width, title_height);

  // line between soup and words.
  pg.line(soup_size.x + (soup_margin*2), title_height, soup_size.x + (soup_margin*2), height);


  for (let i = 0; i <= letters_amount.x; i++) {
    pg.line(
      soup_start_point.x + (space_between_letters * i),
      soup_start_point.y, 
      soup_start_point.x + (space_between_letters * i), 
      soup_start_point.y + soup_size.y);
  }

  for (let i = 0; i <= letters_amount.y; i++) {
    pg.line(
      soup_start_point.x,
      soup_start_point.y + (space_between_letters * i), 
      soup_start_point.x + soup_size.x, 
      soup_start_point.y + (space_between_letters * i));
  }
}

function drawTitle() {
  pg.textSize(25);
  pg.textAlign(CENTER, CENTER);
  pg.text('Sopa de letras', (soup_size.x + sidebar_size.x)/2, title_height/2 + 5);
}

function drawSidebar() {
  pg.textAlign(LEFT, CENTER);
  pg.textSize(15);

  margin_words = createVector(20, 30);

  const pos = createVector(
    soup_size.x + (soup_margin*2) + margin_words.x,
    title_height + margin_words.y);

  const space_between_words = 40;

  for (word of words) {
    pg.text('· ' + word, pos.x, pos.y);
    pos.y += space_between_words
  }
}

function drawAlphabetSoup() {
  pg.textAlign(CENTER, CENTER);

  const row_limit = (space_between_letters * letters_amount.x) + soup_start_point.x;
  const column_limit = (space_between_letters * letters_amount.y) + soup_start_point.y;

  // LA LETRA DEBE SER DIBUJADA EN LA MITAD DE LA CELDA.
  // Y CUANDO MIDE UNA CELDA?
  let initial_point = createVector(
    soup_start_point.x + (space_between_letters/2), soup_start_point.y + (space_between_letters/2)) // not the same as soup_start_point. This one is in the center of the cell

  for (var x=initial_point.x; x < row_limit; x += space_between_letters) {
    for (var y=initial_point.y; y < column_limit; y += space_between_letters) {
      random_letter = randomLetter();
      pg.text(random_letter, x, y);
    }
  }
}

function randomLetter() {
  randomIndex = random(alphabet.length);
  letter = alphabet.toUpperCase()[Math.floor(randomIndex)]
  return letter;
}

function wordsPerColumn() {
  console.log('esta brillando o no?');

  columns_index = []
  for (var i = 0; i < letters_amount.y; i++) {
    columns_index[i] = i;
    console.log(columns_index[i])
  }

  textAlign(CENTER, CENTER);
  noStroke();

  word_counter = 0;
  words_copy = words.slice();

  while (word_counter < words.length) {
    random_column_index = Math.floor(random(0, columns_index.length));
    console.log(columns_index[random_column_index], 'random_column_index');

    pos = createVector(
      (soup_start_point.x + (columns_index[random_column_index] * cell_size.x) - (cell_size.x/2)),
      (soup_start_point.y) - (cell_size.y/2));
    //square(pos.x, pos.y, cell_size.x);


    // vamos con la primera palabra
    word = words_copy.pop().toUpperCase();


    // hagamos que la palabra este en cualquier parte de la columna.
    // las letras en la columna - las letras en la palabra
    // un numero aleatoreo entre ese rango
    // y ese seria el punto de partida

    column_random_start = Math.floor(random(0, letters_amount.y - word.length));

    pos.y += (cell_size.y * column_random_start);

    // for each letter of the word.
    for (letter of word) {
      // por cada uno de estos hay que crear un cuadrado blanco que tape la letra.
      fill('white');
      square(pos.x, pos.y, cell_size.x);

      // ahora debo acomodar en cada celda cada letra de la palabra.
      fill('black');
      text(letter, pos.x + (cell_size.x/2), pos.y + (cell_size.y/2) );

      pos.y += cell_size.y;
    }

    columns_index.splice(random_column_index, 1);
    word_counter += 1;
  }
}


// PARA PODER ENTENDER BIEN, TENGO QUE DIBUJAR LA REJILLA DE TODA LA SOPA DE LETRAS, ASIQ UE TENGO QUE PONER
// LINEAS COMO UN BERRACO.

// para evitar ese bug, tendria que basarme no en la posicion del mouse
// sino en el punto de inicio del rectangulo y su tamaño.
// o sea, despues de que lo hago crecer, pero no ha renderisado, lo comparo.

// basicamente, a esa funcion debo pasarle un vector y ella determina si esta dentro de
// la sopa de letras o no.


function draw() {
  image(pg, 0, 0);
  [mouse.x, mouse.y] = [mouseX, mouseY];

  if (mouse_pressed_soup && mouseIsPressed) {
    if (mouseIsInsideSoup(true)) {
      diff = mouse.sub(last_click);
      last_canva_rotation = atan2(diff.y, diff.x) + 270;

      let final_rotation = ROTATIONS[0];

      for (rotation of ROTATIONS) {
        if (Math.abs(last_canva_rotation - rotation) < Math.abs(last_canva_rotation - final_rotation)) {
          final_rotation = rotation;
        }
      }

      console.log(final_rotation, DIAGONAL_ROTATIONS, 'LOOK AT THIS');
      console.log( DIAGONAL_ROTATIONS.includes(final_rotation) );

      let multiply = (DIAGONAL_ROTATIONS.includes(final_rotation)) ? space_between_letters_diagonal : space_between_letters;

      // ***** ACORTAR ESTO Y PONERLO EN BUEN FORMATO.
      last_rect.height = rectangle.height + (Math.floor((diff.mag() + (multiply / 2)) / multiply) * multiply);

      // es un vector desde last_clicked hasta last_clicked + rect_height;

      // necesito obtener el punto de last_clicked en la direccion del angulo, una magnitud de la altura de rect;

      // tengo el punto de inicio
      // tengo la direccion
      // y tengo la magnitud

      // necesito ese ultimo punto.

      last_canva_rotation = final_rotation;
    }
    
    // if mouse if not inside soup area but it was clicked inside.
    translate(last_click);
    rotate(last_canva_rotation);
    rect(rectangle.x, rectangle.y, rectangle.width, last_rect.height); // 20 EDGE
  }
}

function mousePressed() {
  console.log('PRESSED');
  fill(color(0,0,0,50));
  

  mouse_pressed_soup = mouseIsInsideSoup(false);


  // cambiar esta funcion, es fuerza bruta.
  if (mouse_pressed_soup) {
    let minus = soup_start_point.copy().sub(mouse);
    minus.x = Math.abs(minus.x);
    minus.y = Math.abs(minus.y);
    console.log(minus.x, minus.y, 'vector');

    for (let i = 0; i < letters_amount.x; i++) {
      console.log('ALLLAAAAA');
      if (minus.x >= (space_between_letters*i) && minus.x <= (space_between_letters*(i+1))) {

        for (let e = 0; e < letters_amount.y; e++) {
          if (minus.y >= (space_between_letters*e) && minus.y <= (space_between_letters*(e+1))) {
            // i es el numero de la columna en la que se encuentra.

            last_click.x = soup_start_point.x + (space_between_letters / 2) + (i * space_between_letters);
            last_click.y = soup_start_point.y + (space_between_letters / 2) + (e * space_between_letters);
            
            //last_click.x = soup_start_point.x + (space_between_letters / 2);
            //last_click.y = soup_start_point.y + (space_between_letters / 2);
            break;
          }
        }
      }
    }
  }
}

function mouseIsInsideSoup(strict) {
  const plus = strict ? (space_between_letters/2) : 0;
  if (mouse.x > soup_start_point.x + plus
      && mouse.x < (soup_start_point.x + soup_size.x) - plus
      && mouse.y > soup_start_point.y + plus
      && mouse.y < (soup_start_point.y + soup_size.y) - plus) { // el mouse esta dentro de la sopa de letras.

    return true;
  } else {
    return false;
  }
}

function mouseReleased() {
  console.log('RELEASED');

  mouse_pressed_soup = false;
}




