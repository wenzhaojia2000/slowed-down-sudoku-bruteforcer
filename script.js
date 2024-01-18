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
			cell.appendChild(input);
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	document.getElementById("speed").addEventListener("change", changeSpeed);
}

/**
 * @function
 * Function called when user presses a button in an input. Either user inputs a number, or presses a
 * key to move focused input.
 * @param {KeyboardEvent} event - KeyboardEvent
 */
function validateKeyDown(event) {
	let selected = event.target.id;
	switch (event.key) {
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
		case "Backspace":
		case "Delete":
		case "Tab":
			// type normally
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
		document.getElementById("reset-clear").disabled = false;
		document.getElementById("skip").disabled = false;
		document.getElementById("next").disabled = true;
		document.getElementById("start-pause").innerText = "Pause";
	}
}

/**
 * @function
 * Function to call when "Reset" is pressed.
 */
function resetSudoku() {
	globalThis.sudoku.reset();
	delete globalThis.sudoku;
	document.getElementById("reset-clear").disabled = true;
	document.getElementById("skip").disabled = true;
	document.getElementById("next").disabled = true;
	document.getElementById("start-pause").innerText = "Start";
	document.getElementById("iter").value = "0";
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

window.onload = setUp;
