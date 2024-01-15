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
 * Function to call when "Solve" is pressed.
 */
function solveSudoku() {
	globalThis.sudoku = new SudokuGrid("standard", "standard");
	if (!document.getElementById("errors").innerHTML) {
		document.getElementById("reset").disabled = false;
		document.getElementById("speed-down").disabled = false;
		document.getElementById("speed-up").disabled = false;
		document.getElementById("start-pause").disabled = true;
	}
}

/**
 * @function
 * Function to call when "Reset" is pressed.
 */
function resetSudoku() {
	globalThis.sudoku.reset();
	delete globalThis.sudoku;
	document.getElementById("reset").disabled = true;
	document.getElementById("speed-down").disabled = true;
	document.getElementById("speed-up").disabled = true;
	document.getElementById("start-pause").disabled = false;
}

/**
 * @function
 * Function to call when "Speed Up" is pressed.
 */
function speedUp() {
	globalThis.sudoku.changeSpeed(2);
}

/**
 * @function
 * Function to call when "Speed Down" is pressed.
 */
function speedDown() {
	globalThis.sudoku.changeSpeed(0.5);
}

window.onload = setUp;
