


/*
let object = {
	setup: function() {
		this.restart();
	},
	restart: function() {

	}
}
*/

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(Other) {
		this.x += Other.x;
		this.y += Other.y;
		return new Vector(this.x, this.y)
	}

	sub(Other) {
		this.x -= Other.x;
		this.y -= Other.y;
		return new Vector(this.x, this.y)
	}

	mult(Other) {
		this.x *= Other.x;
		this.y *= Other.y;
		return new Vector(this.x, this.y)
	}

	div(Other) {
		this.x /= Other.x;
		this.y /= Other.y;
		return new Vector(this.x, this.y)
	}

	equals(Other) {
		let are_equals = false;
		if (this.x == Other.x && this. y == Other.y) {
			are_equals = true;
		}
		return are_equals;
	}

	copy() {
		return new Vector(this.x, this.y);
	}

	toString() {
		return 'x: ' + this.x + ', y: ' + this.y;
	}
}


// ------------------------------------------------------------------------ $MENU.


let menu = {
  menu: document.getElementById('menu'),
  title: document.getElementById('title'),
  start_button: document.getElementById('start-button'),
  timeout: null,

  setup: function() {
    this.start_button.onclick = this.__handleStartButtonClick.bind(this);
    this.restart()
  },
  restart: function(msgs) {
   	this.menu.style.zIndex = 10;
    this.menu.style.opacity = '1';
    this.start_button.disabled = false;

  },
  __handleStartButtonClick: function() {
    console.log('start button clicked');

    this.start_button.disabled = true;
    this.menu.style.opacity = '0';

    this.timeout = setTimeout(() => {

      this.menu.style.zIndex = -10;
      control.start();

    }, 1000);
  },
}


// ------------------------------------------------------------------------ $LIST.


let list = {
	setup: function() {
		this.restart();
	},
	restart: function() {

	}
}


// ------------------------------------------------------------------------ $CELL.


class Cell {
	constructor(ID) {
		this.id = ID;
		this.letter = '';
		this.is_in_a_word = false;
		this.word = '';
		this.index = null;
		this.is_marked = false;
		this.color = Cell.color_classes.normal;
		this.div = document.createElement('div');
		this.div.classList.add('cell');
		this.div.setAttribute('id', ID);
		this.div.innerHTML = 'A';
	}

	static directions = [
		new Vector(1, 0),
		new Vector(1, 1),
		new Vector(0, 1),
		new Vector(-1, 1),
		new Vector(-1, 0),
		new Vector(-1, -1),
		new Vector(0, -1),
		new Vector(1, -1),
	]

	static color_classes = {
		normal: 'cell_normal',
		marked: 'cell_marked',
		selected: 'cell_selected',
	}

	static getCellId(x, y) {
		return x + ',' + y;
	}
}


// ------------------------------------------------------------------------ $SOUP.


let soup = {
	container: document.getElementById('soup'),
	options: ['knife', 'color', 'today', 'brain', 'learn',
						'side', 'tree', 'love', 'glass', 'mouse', 
						'what', 'space', 'sand', 'black', 'five'].map(WORD => WORD.toUpperCase()),
	grid_size: new Vector(10, 10),
	amount: 5,
	cells: [], /*
		[
			[cell1-1, cell1-2, cell1-3],
			[cell2-1, cell2-2, cell2-3],
			[cell3-1, cell3-2, cell3-3],
		]
	*/

	setup: function() {
		this.__createCells();
		this.__createGrid();
		this.__fillGrid();

		this.restart();
	},
	__createCells: function() {
		for (let x=0; x<this.grid_size.x; x++) {
			let row = [];

			for (let y=0; y<this.grid_size.y; y++) {
				const CELL_ID = Cell.getCellId(x, y);
				const CELL = new Cell(CELL_ID);
				row.push(CELL);

			}

			this.cells.push(row);
		}
	},
	__createGrid: function() {
		const COLUMNS = 'repeat(' + this.grid_size.y + ', min-content)';
		const ROWS = 'repeat(' + this.grid_size.x + ', min-content)';

		this.container.style.gridTemplateColumns = COLUMNS;
		this.container.style.gridTemplateRows = ROWS;
	},
	__fillGrid: function() {
		for (const ROW of this.cells) {
			for (const CELL of ROW) {
				this.container.appendChild(CELL.div);
			}
		}
	},
	restart: function() {

	},
	__generateRandoms: function() {
		let options_copy = this.options.slice();

		let word;
		let start_cell;
		let direction;

		const RANDOM_INDEX = Math.round(Math.random() * (options_copy.length-1));
		word = options_copy.splice(RANDOM_INDEX, 1);

		// choose a random start_cell.



		// choose a random direction.

		// if part of the word is out of the soup, drag it back the offset cells.

		// then, cell by cell verify that the cells are empty or the letters that cross each other are the same.
	}

}


// ------------------------------------------------------------------------ $CONTROL.


let control = {
  timeout: null,

  setup: function() {
    menu.setup();
    list.setup();
    soup.setup();
  },
  start: function() {
    console.log('STARTTTT THYE FUCKING GAMEEEEE')
    //timer.start();
  },
  finish: function() {
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      menu.restart();
      list.restart();
      soup.restart();

    }, 2000);
  }
}

control.setup();



