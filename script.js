"use strict";

/**
 * Object which contains a bruteforcer instance, timer, and several useful methods for manipulating the
 * bruteforcer, timer, document grid, document buttons, etc.
 */
const sudoku = {

	/** 
	 * class instance of the bruteforcer, which stores a copy of the sudoku made by the user and contains
	 * the bruteforcing algorithm
	 * @type {Bruteforcer}
	 * @type {null} - if bruteforcer has not yet started
	 */
	bruteforcer: null,

	/**
	 * speed of iteration
	 * @type {number}
	 */
	speed: 25,

	/**
	 * ID of the setInterval timer
	 * @type {number}
	 * @type {null} - if bruteforcer has not yet started or is paused
	 */
	timer: null,

	/**
	 * @method
	 * initiates a bruteforcer and starts the bruteforcing algorithm.
	 */
	start() {
		const matrix = new Array(9);
		const error_div = document.getElementById("errors");
		this.speed = Number(document.getElementById("speed").value);
		
		// obtain matrix from document
		for (let i=0; i<9; i++) {
			const row = new Array(9);
			for (let j=0; j<9; j++) {
				row[j] = Number(document.getElementById(String(i) + String(j)).value);
			}
			matrix[i] = row;
		}
		// initiate SudokuGrid
		this.bruteforcer = new Bruteforcer(matrix);

		// check for errors. break if there are any errors
		error_div.innerHTML = "";
		const errors = this.bruteforcer.check();
		if (errors.length !== 0) {
			for (let i=0; i<errors.length; i++) {
				error_div.innerHTML += errors[i] + "<br/>";
			}
			this.bruteforcer = null;
			return;
		}

		document.getElementById("skip").disabled = false;
		document.getElementById("next").disabled = true;
		document.getElementById("left-button").innerText = "Reset";
		document.getElementById("right-button").innerText = "Pause";
		// freeze cells and set classnames
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				const cell = document.getElementById(String(i) + String(j));
				cell.disabled = true;
				if (cell.value !== "") {
					cell.className = "fixed";
				} else {
					cell.className = "unfilled";
				}
			}
		}

		this.play();
	},

	/**
	 * @method
	 * plays or resumes the iteration timer, calling this.next at intervals corresponding to this.speed
	 */
	play() {
		document.getElementById("right-button").innerText = "Pause";
		document.getElementById("next").disabled = true;
		clearInterval(this.timer);
		// configure timer:
		// generally, setInterval delay is capped at once per 4ms (250Hz). if speed exceeds this, do
		// multiple iterations per interval. actual speed = number of iterations / delay
		const n_intervals = Math.ceil(this.speed/250);
		const delay = 1000 * Math.ceil(this.speed/250)/this.speed;
		this.timer = setInterval(() => this.next(n_intervals), delay);
	},

	/**
	 * @method
	 * pauses the iteration timer
	 */
	pause() {
		document.getElementById("right-button").innerText = "Resume";
		document.getElementById("next").disabled = false;
		clearInterval(this.timer);
	},

	/**
	 * @method
	 * removes all progress on the bruteforcing of the sudoku, removing the bruteforcer property and
	 * resets to the initial sudoku.
	 */
	reset() {
		document.getElementById("skip").disabled = true;
		document.getElementById("next").disabled = true;
		document.getElementById("right-button").disabled = false;
		document.getElementById("left-button").innerText = "Clear";
		document.getElementById("right-button").innerText = "Start";
		document.getElementById("iter").value = "0";
		document.getElementById("errors").innerHTML = "";
		document.getElementById("success").innerHTML = "";
		clearInterval(this.timer);
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				const cell = document.getElementById(String(i) + String(j));
				if (cell.className === "unfilled" || cell.className === "complete") {
					cell.value = "";
				}
				cell.disabled = false;
				cell.className = "sudoku";
			}
		}
		this.bruteforcer = null;
	},

	/**
	 * @method
	 * removes all user inputs on the sudoku, leaving a blank grid.
	 */
	clear() {
		document.getElementById("errors").innerHTML = "";
		document.getElementById("success").innerHTML = "";
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				document.getElementById(String(i) + String(j)).value = "";
			}
		}
	},

	/**
	 * @method
	 * iterates forward in the bruteforcer, and updates the sudoku in the document with new values.
	 * @param {number} steps - number of bruteforce steps to take.
	 */
	next(steps) {
		for (let n=0; n<steps; n++){
			try {
				const [i, j, value] = this.bruteforcer.nextStep();
				document.getElementById(String(i) + String(j)).value = (value === 0) ? "" : String(value);
			} catch {
				this.finish(this.bruteforcer.status === "success");
				break;
			}
		}
		document.getElementById("iter").value = String(this.bruteforcer.iter);
	},

	/**
	 * @method
	 * declare the sudoku finished, either being a success (turns all numbers filled in by the bruteforcer from red
	 * to green) or a failure (no possible solution, shows the user an error)
	 * @param {boolean} status - either true (success) or false (failure)
	 */
	finish(status) {
		document.getElementById("right-button").innerText = "Pause";
		document.getElementById("next").disabled = true;
		document.getElementById("skip").disabled = true;
		document.getElementById("right-button").disabled = true;
		clearInterval(this.timer);
		if (status) {
			document.getElementById("success").innerHTML = "Sudoku has been solved!";
			for (let i=0; i<9; i++) {
				for (let j=0; j<9; j++) {
					const cell = document.getElementById(String(i) + String(j));
					if (cell.className === "unfilled") {
						cell.className = "complete";
					}
				}
			}
		} else {
			document.getElementById("errors").innerHTML = "Sudoku has no solutions";
		}
	}
};

/**
 * @function
 * function to call when website is loaded.
 */
function setUp() {
	const table = document.getElementById("table");
	// remove enable javascript message
	table.innerHTML = "";
	// add 9x9 grid
	for (let i=0; i<9; i++) {
		const row = document.createElement("tr");
		for (let j=0; j<9; j++) {
			const cell = document.createElement("td");
			const input = document.createElement("input");
			input.type = "text";
			input.className = "sudoku";
			input.pattern = "[0-9]*";
			input.inputmode = "numeric";
			input.maxLength = 1;
			input.id = String(i) + String(j);
			input.addEventListener("keydown", validateKeyDown);
			input.addEventListener("input", moveNextCell);
			cell.appendChild(input);
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	document.getElementById("speed").addEventListener("change", changeSpeed);
}

/**
 * @function
 * function called when user presses a button in a sudoku cell. Either user inputs a number (1-9), or
 * presses a key to move focused input. 0 can be input to skip a cell (see moveNextCell)
 * @param {KeyboardEvent} event - KeyboardEvent
 */
function validateKeyDown(event) {
	const selected = event.target.id;
	if (/[1-9]/.test(event.key)) {
		// type normally
		return;
	}
	// other key inputs
	switch (event.key) {
		case "Backspace":
		case "Delete":
		case "Tab":
			break;
		case "ArrowUp":
			if (selected[0] !== "0") {
				document.getElementById(String(Number(selected[0]) - 1) + selected[1]).select();
			}
			event.preventDefault();
			break;
		case "Enter":
		case "ArrowDown":
			if (selected[0] !== "8") {
				document.getElementById(String(Number(selected[0]) + 1) + selected[1]).select();
			}
			event.preventDefault();
			break;
		case "ArrowLeft":
			if (selected[1] !== "0") {
				document.getElementById(selected[0] + String(Number(selected[1]) - 1)).select();
			}
			event.preventDefault();
			break;
		case "ArrowRight":
			if (selected[1] !== "8") {
				document.getElementById(selected[0] + String(Number(selected[1]) + 1)).select();
			}
			event.preventDefault();
			break;
		default:
			// prevent this key from being input
			event.preventDefault();
	}
}

/**
 * @function
 * function called when user changes the value in an sudoku cell. If user inputs a number, move to
 * next cell in the grid. 0 can be input to skip a cell (see validateKeyDown)
 * @param {KeyboardEvent} event - KeyboardEvent
 */
function moveNextCell(event) {
	const selected = event.target.id;
	if (/[0-9]/.test(event.data)) {
		if (selected[1] === "8") {
			if (selected[0] !== "8") {
				document.getElementById(String(Number(selected[0]) + 1) + "0").select();
			}
		} else {
			document.getElementById(selected[0] + String(Number(selected[1]) + 1)).select();
		}
	}
}

/**
 * @function
 * function to call when "generate a puzzle for me" is pressed. Inputs a pregenerated sudoku into
 * the grid, allowing the user to view the algorithm without manually inputting one themselves.
 * 
 * randomly generating sudoku puzzles is not currently in the scope of this project.
 */
function randomiseSudoku() {
	if (sudoku.bruteforcer) {
		return;
	}
	let sudokus = [
		"000100400750600200040007009307009002000240000004306000000000093103000000000020007", // 9275
	];
	let pregen = sudokus[Math.floor(sudokus.length * Math.random())];
	// let pregen = sudokus[sudokus.length - 1];
	for (let i=0; i<9; i++) {
		for (let j=0; j<9; j++) {
			let cell = pregen[9 * i + j];
			document.getElementById(String(i) + String(j)).value = (cell === "0" ? "" : cell);
		}
	}
}

/**
 * @function
 * function to call when the left button, "Reset" or "Clear", is pressed.
 */
function leftButton() {
	if (document.getElementById("left-button").innerText === "Clear") {
		sudoku.clear();
	} else {
		sudoku.reset();
	}
}

/**
 * @function
 * function to call when the rightmost button, "Start" or "Pause", is pressed.
 */
function rightButton() {
	// sudoku in progress
	if (sudoku.bruteforcer) {
		if (document.getElementById("right-button").innerText === "Resume") {
			sudoku.play();
		} else {
			sudoku.pause();
		}
		return;
	}
	// starting a new sudoku
	sudoku.start();
}

/**
 * @function
 * function to call when "Speed Down" is pressed.
 */
function speedDown() {
	const current_speed = Number(document.getElementById("speed").value);
	const new_speed = Math.max(1, 0.5 * current_speed);
	document.getElementById("speed").value = String(new_speed);
	if (sudoku.bruteforcer) {
		sudoku.speed = new_speed;
		sudoku.play();
	}
}

/**
 * @function
 * function to call when "Speed Up" is pressed.
 */
function speedUp() {
	const current_speed = Number(document.getElementById("speed").value);
	const new_speed = Math.min(2 * current_speed, 1e6);
	document.getElementById("speed").value = String(new_speed);
	if (sudoku.bruteforcer) {
		sudoku.speed = new_speed;
		sudoku.play();
	}
}

/**
 * @function
 * function called when user changes the speed of the algorithm. Caps speed between 1 and 1000000.
 * @param {Event} event - Event
 */
function changeSpeed(event) {
	const new_speed = Math.max(1, Math.min(event.target.value, 1e6));
	event.target.value = new_speed;
	if (sudoku.bruteforcer) {
		sudoku.speed = new_speed;
		sudoku.play();
	}
}

/**
 * @function
 * function to call when "Next step" is pressed.
 */
function nextStep() {
	sudoku.next(1);
}

/**
 * @function
 * function to call when "Skip to end" is pressed.
 */
function skipToEnd() {
	sudoku.next(1e9);
}

window.onload = setUp;
