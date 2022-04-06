

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
  start_point = createVector(soup_margin + (soup_margin/2), title_height + (soup_margin+(soup_margin/2)));

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
  mouse_saved = createVector(0, 0);

  angleMode(DEGREES);
  frameRate(30); 
}

function initCanvas() {
  let canvasSize = createVector(
    soup_size.x + sidebar_size.x + (soup_margin*2),
    soup_size.y + title_height + (soup_margin*2));

  cnv = createCanvas(canvasSize.x, canvasSize.y);
  cnv.parent('canva-game');
}

function setup() {
  initVars();
  initCanvas();

  background('white');
  fill('black');

  drawSeparatorLines();
  drawTitle();
  drawSidebar();
  drawAlphabetSoup();
  
  wordsPerColumn(start_point);
}

function drawSeparatorLines() {
   // title line.
  line(0, title_height, width, title_height);

  // line between soup and words.
  line(soup_size.x + (soup_margin*2), title_height, soup_size.x + (soup_margin*2), height);
}

function drawTitle() {
  textSize(25);
  textAlign(CENTER, CENTER);
  text('Sopa de letras', (soup_size.x + sidebar_size.x)/2, title_height/2 + 5);
}

function drawSidebar() {
  textAlign(LEFT, CENTER);
  textSize(15);

  margin_words = createVector(20, 30);

  const pos = createVector(
    soup_size.x + (soup_margin*2) + margin_words.x,
    title_height + margin_words.y);

  const space_between_words = 40;

  for (word of words) {
    text('· ' + word, pos.x, pos.y);
    pos.y += space_between_words
  }
}

function drawAlphabetSoup() {
  textAlign(CENTER, CENTER);

  const row_limit = (space_between_letters * letters_amount.x) + start_point.x;
  const column_limit = (space_between_letters * letters_amount.y) + start_point.y;

  for (var i=start_point.x; i < row_limit; i += space_between_letters) {
    for (var e=start_point.y; e < column_limit; e += space_between_letters) {
      random_letter = randomLetter();
      text(random_letter, i, e)
    }
  }
}

function randomLetter() {
  randomIndex = random(alphabet.length);
  letter = alphabet.toUpperCase()[Math.floor(randomIndex)]
  return letter;
}

function wordsPerColumn(start_point) {
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
      (start_point.x + (columns_index[random_column_index] * cell_size.x) - (cell_size.x/2)),
      (start_point.y) - (cell_size.y/2));
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
  background('white');
  if (mouseIsPressed === true) {
    mouse.x = mouseX;
    mouse.y = mouseY;

    diff = mouse.sub(mouse_saved);
    translate(mouse_saved);

    console.log(diff.x, diff.y, 'mouse direction');
    
    norm = diff.copy().normalize();
    deg = atan(norm.y / norm.x);
    console.log(deg, 'DEGREEEESSSS')
    plus = -90;

    switch(norm) {

    }

    rotate(deg + plus);

    rect(-10, -10, 20, 20+diff.mag(), 20);

  } else {
    // rect(25, 25, 50, 50);
  }
}

function mousePressed() {
  console.log('PRESSED');
  fill(color(0,0,0,50));
  mouse_saved.x = mouseX;
  mouse_saved.y = mouseY;
}

function mouseReleased() {
  console.log('RELEASED');
}




