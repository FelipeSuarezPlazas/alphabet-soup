

// -------------------------------------------------------------- ALPHABET SOUP.


// Qué es el ser humano? que quiere el ser humano?
// jaaaajaaaaaaajajajajajaja que carajos quierooo yooooo??????P



// -------------------------------------------------------------- FUNCTIONS.

function initVars() {
  space_between_letters = 25;
  title_height = 70;
  letters_amount = createVector(20, 20);
  cell_size = createVector(space_between_letters, space_between_letters);
  soup_size = createVector(
    letters_amount.x * (cell_size.x), 
    letters_amount.x * (cell_size.y));

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



function draw() {
  image(pg, 0, 0); // the entire background, soup, words.
  [mouse.x, mouse.y] = [mouseX, mouseY];



  // perfecto, ahora lo que necesito es que el rectangulo
  // solo pueda tener (8) rotaciones. No todas las que tenga el mouse.
  // 0, 45, 90, 135, 180, 225, 270, 315.

  let rotations = [0, 45, 90, 135, 180, 225, 270, 315];

  // ok... yo de por si, ya tengo el numero de la rotacion...
  // debo tener una lista con esas rotaciones, asi que haré un loop,
  // y a la rotacion que más se acerque, pues esa es la que le paso al canva.


  if (mouse_pressed_soup && mouseIsPressed) {
    if (mouseIsInsideSoup()) {
      diff = mouse.sub(last_click);
      last_rect.height = 20+diff.mag();
      last_canva_rotation = atan2(diff.y, diff.x) - 90;
    }

    // if mouse if not inside soup area but it was clicked inside.
    translate(last_click);
    rotate(last_canva_rotation);
    rect(-10, -10, 20, last_rect.height, 20);
  }


  // si el mouse sale de la zona de la sopa de letras pero sigue oprimido,
  // el rectangulo deberá seguir mostrandose, pero deberá quedarse con la posicion
  // y tamaño de la ultima vez que el mouse estuvo dentro del area.
}

function mousePressed() {
  console.log('PRESSED');
  fill(color(0,0,0,50));
  last_click.x = mouseX;
  last_click.y = mouseY;

  mouse_pressed_soup = mouseIsInsideSoup();
}

function mouseIsInsideSoup() {
  if (mouse.x > soup_start_point.x 
      && mouse.x < (soup_start_point.x + soup_size.x) 
      && mouse.y > soup_start_point.y 
      && mouse.y < (soup_start_point.y + soup_size.y)) { // el mouse esta dentro de la sopa de letras.

    return true;
  } else {
    return false;
  }
}

function mouseReleased() {
  console.log('RELEASED');

  mouse_pressed_soup = false;
}




