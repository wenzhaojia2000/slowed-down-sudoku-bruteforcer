"use strict";

/**
 * @function
 * Function to call when website is loaded.
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
 * Function called when user presses a button in a sudoku cell. Either user inputs a number (1-9), or
 * presses a key to move focused input. 0 can be input to skip a cell (see moveNextCell)
 * @param {KeyboardEvent} event - KeyboardEvent
 */
function validateKeyDown(event) {
	let selected = event.target.id;
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
 * Function called when user changes the value in an sudoku cell. If user inputs a number, move to
 * next cell in the grid. 0 can be input to skip a cell (see validateKeyDown)
 * @param {KeyboardEvent} event - KeyboardEvent
 */
function moveNextCell(event) {
	let selected = event.target.id;
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
 * Function called when user changes the speed of the algorithm. Caps speed between 1 and 1000000.
 * @param {Event} event - Event
 */
function changeSpeed(event) {
	let new_speed = Math.max(1, Math.min(event.target.value, 1e6));
	event.target.value = new_speed;
	if (globalThis.sudoku instanceof SudokuGrid) {
		globalThis.sudoku.speed = new_speed;
		globalThis.sudoku.play();
	}
}

/**
 * @function
 * Function to call when "Speed Up" is pressed.
 */
function speedUp() {
	let current_speed = Number(document.getElementById("speed").value);
	let new_speed = Math.min(2 * current_speed, 1e6);
	document.getElementById("speed").value = String(new_speed);
	if (globalThis.sudoku instanceof SudokuGrid) {
		globalThis.sudoku.speed = new_speed;
		globalThis.sudoku.play();
	}
}

/**
 * @function
 * Function to call when "Speed Down" is pressed.
 */
function speedDown() {
	let current_speed = Number(document.getElementById("speed").value);
	let new_speed = Math.max(1, 0.5 * current_speed);
	document.getElementById("speed").value = String(new_speed);
	if (globalThis.sudoku instanceof SudokuGrid) {
		globalThis.sudoku.speed = new_speed;
		globalThis.sudoku.play();
	}
}


/**
 * @function
 * Function to call when "Start" or "Pause" is pressed.
 */
function startPauseSudoku() {
	// sudoku in progress
	if (globalThis.sudoku instanceof SudokuGrid) {
		if (document.getElementById("start-pause").innerText === "Resume") {
			document.getElementById("start-pause").innerText = "Pause";
			document.getElementById("next").disabled = true;
			globalThis.sudoku.play();
		} else {
			// "Pause"
			document.getElementById("start-pause").innerText = "Resume";
			document.getElementById("next").disabled = false;
			globalThis.sudoku.pause();
		}
		return;
	}

	// starting a new sudoku
	globalThis.sudoku = new SudokuGrid("standard", "standard");
	if (document.getElementById("errors").innerHTML) {
		delete globalThis.sudoku;
	} else {
		document.getElementById("skip").disabled = false;
		document.getElementById("next").disabled = true;
		document.getElementById("reset-clear").innerText = "Reset";
		document.getElementById("start-pause").innerText = "Pause";
	}
}

/**
 * @function
 * Function to call when "Reset" or "Clear" is pressed.
 */
function resetClearSudoku() {
	document.getElementById("errors").innerHTML = "";
	document.getElementById("success").innerHTML = "";
	if (document.getElementById("reset-clear").innerText === "Clear") {
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				document.getElementById(String(i) + String(j)).value = "";
			}
		}
	} else {
		// "Reset"
		globalThis.sudoku.reset();
		delete globalThis.sudoku;
		document.getElementById("skip").disabled = true;
		document.getElementById("next").disabled = true;
		document.getElementById("reset-clear").innerText = "Clear";
		document.getElementById("start-pause").innerText = "Start";
		document.getElementById("iter").value = "0";
	}
}

/**
 * @function
 * Function to call when "Next step" is pressed.
 */
function nextStep() {
	globalThis.sudoku.nextStep();
}

/**
 * @function
 * Function to call when "Skip to end" is pressed.
 */
function skipToEnd() {
	globalThis.sudoku.nextStep(1e9);
}

/**
 * @function
 * Function to call when "generate a puzzle for me" is pressed. Inputs a pregenerated sudoku into the grid,
 * allowing the user to view the algorithm without manually inputting one themselves.
 * 
 * Randomly generating sudoku puzzles is not currently in the scope of this project.
 * 121*, 122, 123, 131*, 155, 216*, 234, 260, 281, 282
 */
function randomiseSudoku() {
	if (globalThis.sudoku instanceof SudokuGrid) {
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

window.onload = setUp;
