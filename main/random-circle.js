accounts = [
  "id1",
  "id2",
  "id3",
  "id4",
  "id5",
  "id6",
  "id7",
]

accountsData = {
  "id1": {
    "recieve": ["id2", "id3", "id4", "id5", "id6"],
    "send": ["id3", "id4", "id6", "id7"],
  },
  "id2": {
    "recieve": ["id5", "id6"],
    "send": ["id1", "id5"],
  },
  "id3":{
    "recieve": ["id1","id4", "id5", "id6"],
    "send": ["id1", "id6", "id7"],
  },
  "id4":{
    "recieve": ["id1", "id5", "id6"],
    "send": ["id1", "id3", "id6", "id7"],
  },
  "id5":{
    "recieve": ["id6", "id2"],
    "send": ["id1", "id2", "id3", "id7"],
  },
  "id6":{
    "recieve": ["id1", "id3", "id4"],
    "send": ["id3", "id2","id7"],
  },
  "id7":{
    "recieve": ["id1", "id3", "id5", "id6"],
    "send": ["id3"],
  },
}

var accountsDrawList = [
  
]

// Inicialmente debe meterse a cada una de las listas e iterar por cada uno de los ids
// en cada id hará lo siguiente, ubicará el punto en el centro, y a su alrededor pondra los puntos
// que le pasan y tambien a los que él pasa.
// luego todos aquellos que ya estan dibujados en el lienzo, tendrán una posición.
// habrá una lista para los ids que ya se dibujaron.
// y una lista para los ids que ya se circundaron.
// los que se dibujaron pero que aun no estan circundados.
var index = 0;

function setup() {
  // Definir lienzo de 720 pixeles de ancho y 400 pixeles de alto
  createCanvas(600, 300);
  background(0);
  fill(0);
  stroke(255);
}

// primero dibuja cada una de las cuentas en forma de circulo de forma aleatoria.
// en una lista, tengo todas esas cuentas (key) y todas esas llaves con las posiciones (value).
function draw() {
  //point(width/2, height/2);

  // comenzar a iterar sobre los ids.
  // cada punto solo debe ser dibujado una sola vez
  // comenzaré dibujando a su alrededor, solo a los que le pasa
  console.log(index);
  console.log(accounts.length);
  if (index < accounts.length) {
    var randomVector = createVector(random(5, width-5), random(5, height-5));

    circle(randomVector.x, randomVector.y, 5);

    accountsDrawList[accounts[index]] = randomVector;

    index++;
  } else {

  }
  //accounts[index]
}