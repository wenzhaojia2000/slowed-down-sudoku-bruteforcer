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
	speed: 125,

	/**
	 * ID of the setInterval timer
	 * @type {number}
	 * @type {null} - if bruteforcer has not yet started, is paused, or sudoku is finished
	 */
	timer: null,

	/**
	 * an flattened array of chars representing the sudoku from top-down left to right, with "0"
	 * meaning blank. used in generating "link to this sudoku"
	 * @type {Array}
	 */
	code_decimal: Array(81).fill("0"),

	/**
	 * an array of encoded (see b64.js) pregenerated sudokus, which can be used by the user to fill in a
	 * sudoku for them. randomly generating sudoku puzzles is not currently in the scope of this project.
	 * 
	 * these were generated by qqwing (qqwing.com), and are randomly generated expert difficulty sudokus such
	 * that the total iterations of the algorithm were relatively small <13000.
	 * @type {Array}
	 */
	pregen: [
		"N34z6CZVVAy8d9NnyEB571cb99ALDU6zBThc2CbMc4n",   // 9275
		"CNgN4CJKVfvJMNGK-W4kw7VpUXcjxyUF7Q8wOIFlG-A",   // 12212
		"C5djeNCJUXVqkVHM1BMyVfUJwNAqkOT-3kEqCYU8f7E4E", // 4080
		"Gv0J2bNeWIFjOHbvUr1fDJHBDbDpytV1cJQfuyKaSXW0w", // 1675
		"eYN6uscOt0YrbOHQY3IT59J-HkiSd2BuJGzhx-CM3DHAA", // 11033
		"URwgOTNtEdi2lHkTo9HYMHoVzUAAvY3iPZfQGf2YwlyPF", // 12936
		"RfTYJusbxdKW3gHin88orCJDad76ycBtdcWJduELLg2A",  // 2644
		"bAUETHLhtJuIaC33pCFpAxnLLmone69XNPl5PBYZGno1w", // 8015
		"Pi5F8RTxc5e9lKXBDoJGU3nEj92nUoCCz8g6aZRa1UEs",  // 10022
		"BbD0yE7-1K9eUCQTWeJVEf4DVHk2Vvmz1bDw9cFDerEg",  // 1354
		"KQXbiTLPjpWIdls1xyBX4dxC8l--oa4Ih6Saqdwonae7y", // 8250
		"a_mcsOr-9SOWCImOz2XkI4WBxxsxBSNkFzIgk5aKhaWwA", // 12197
	],

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
			for (const error of errors) {
				error_div.innerHTML += error + "<br/>";
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
		this.timer = null;
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
		this.timer = null;
	},

	/**
	 * @method
	 * removes all user inputs on the sudoku, leaving a blank grid.
	 */
	clear() {
		document.getElementById("errors").innerHTML = "";
		document.getElementById("success").innerHTML = "";
		// reset "link to this sudoku"
		document.getElementById("save").href = window.location.origin + window.location.pathname;
		sudoku.code_decimal.fill("0");
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
		this.timer = null;
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
	// remove enable javascript message
	const table = document.getElementById("table");
	table.innerHTML = "";
	// fetch a sudoku code from the url, if any
	const params = new URLSearchParams(window.location.search);
	let code = params.get("code");
	if (!code) {
		code = "";
	}
	try {
		sudoku.code_decimal = [...b64.from(code).padStart(81, "0")];
	} catch (e) {
		console.error(e);
	}
	// add 9x9 grid
	for (let i=0; i<9; i++) {
		const row = document.createElement("tr");
		for (let j=0; j<9; j++) {
			const cell = document.createElement("td");
			const input = document.createElement("input");
			const value = sudoku.code_decimal[9 * i + j];
			input.type = "text";
			input.className = "sudoku";
			input.pattern = "[0-9]*";
			input.inputmode = "numeric";
			input.maxLength = 1;
			input.id = String(i) + String(j);
			input.value = (value === "0") ? "" : value;
			input.addEventListener("keydown", validateKeyDown);
			input.addEventListener("input", moveNextCell);
			input.addEventListener("change", updateCode);
			cell.appendChild(input);
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	// add event listeners
	document.getElementById("left-button").addEventListener("click", leftButton);
	document.getElementById("right-button").addEventListener("click", rightButton);
	document.getElementById("next").addEventListener("click", nextStep);
	document.getElementById("skip").addEventListener("click", skipToEnd);
	document.getElementById("speed-down").addEventListener("click", speedDown);
	document.getElementById("speed-up").addEventListener("click", speedUp);
	document.getElementById("speed").addEventListener("change", changeSpeed);
	document.getElementById("copy").addEventListener("click", copyLink);
	// if the user came from a link to a pregenerated sudoku, erase it from sudoku.pregen
	const pregen = sudoku.pregen.filter((v) => {return (v !== code)});
	// add href to random pregenerated sudoku
	const search = "?code=" + pregen[Math.floor(pregen.length * Math.random())];
	document.getElementById("random").href = window.location.origin + window.location.pathname + search;
}

/**
 * @function
 * function called when user presses a button in a sudoku cell. Either user inputs a number (1-9), or
 * presses a key to move focused input. 0 can be input to skip a cell (see moveNextCell)
 * @param {KeyboardEvent} event - KeyboardEvent
 */
function validateKeyDown(event) {
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
		case "0":
		case "ArrowRight":
			moveNextCell(event, "r");
			break;
		case "ArrowLeft":
			moveNextCell(event, "l");
			break;
		case "ArrowUp":
			moveNextCell(event, "u");
			break;
		case "Enter":
		case "ArrowDown":
			moveNextCell(event, "d");
			break;
		default:
			// prevent this key from being input
			event.preventDefault();
	}
}

/**
 * @function
 * function called when user changes the value in an sudoku cell. if user inputs a number, move to
 * next cell in the grid. use direction to define the direction of next cell
 * @param {Event} event - event
 * @param {string} direction - defines which cell is the next (either "r" right, "l" left, "u" up, 
 * "d" down from current cell)
 */
function moveNextCell(event, direction="r") {
	const regex = /^Arrow|Enter|^\d$/;
	// interpret id as base 9 so the selection can wrap around (eg. 08 + 1 = 10)
	const selected = parseInt(event.target.id, 9);
	const diff = {"r": 1, "l": -1, "d": 9, "u": -9};
	if (regex.test(event.data) || regex.test(event.key)) {
		const next = selected + diff[direction];
		if (0 <= next && next < 81) {
			document.getElementById(next.toString(9).padStart(2, "0")).select();
		}
	}
	event.preventDefault();
}

/**
 * @function
 * updates "link to this sudoku" whenever user changes a cell in the sudoku.
 * @param {Event} event - event
 */
function updateCode(event) {
	const [i, j] = event.target.id;
	const value = event.target.value;
	sudoku.code_decimal[9 * Number(i) + Number(j)] = (value === "") ? "0" : value;
	const search = "?code=" + b64.to(sudoku.code_decimal.join(""));
	document.getElementById("save").href = window.location.origin + window.location.pathname + search;
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
	sudoku.speed = new_speed;
	if (sudoku.bruteforcer && sudoku.timer) {
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
	sudoku.speed = new_speed;
	if (sudoku.bruteforcer && sudoku.timer) {
		sudoku.play();
	}
}

/**
 * @function
 * function called when user changes the speed of the algorithm. caps speed between 1 and 1000000.
 * @param {Event} event - Event
 */
function changeSpeed(event) {
	const new_speed = Math.max(1, Math.min(event.target.value, 1e6));
	event.target.value = String(new_speed);
	sudoku.speed = new_speed;
	if (sudoku.bruteforcer && sudoku.timer) {
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

/**
 * @function
 */
async function copyLink() {
	try {
		await navigator.clipboard.writeText(document.getElementById("save").href);
		document.getElementById("copy").innerText = "Copied!";
		setTimeout(() => {document.getElementById("copy").innerText = "Copy";}, 1000);
	} catch (e) {
		console.error(e);
	}
}

window.onload = setUp;
