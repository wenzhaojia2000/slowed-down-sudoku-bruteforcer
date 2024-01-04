"use strict";

/**
 * @class
 * Class for storing the sudoku grid and solving it.
 */
class SudokuGrid {

	/**
	 * @constructor
	 * @param {HTMLElement} table - HTMLElement to get grid from.
	 * @param {string} fill_in_method - dictates which cells should be filled in first (to be added).
	 * @param {string} sudoku_type - dictates which sudoku variant to use (to be added).
	 */
	constructor(fill_in_method, sudoku_type) {
		this.fill_in_method = fill_in_method;
		this.sudoku_type = sudoku_type;
		
		this.table = document.getElementById("sudoku");
		// get filled in numbers from table
		this.grid = new Array(9);
		for (let i=0; i<9; i++) {
			const row = new Array(9);
			for (let j=0; j<9; j++) {
				row[j] = document.getElementById(String(i) + String(j)).value;
			}
			this.grid[i] = row;
		}
		console.log(this.check());
	}

	/**
	 * @method
	 * Checks whether the entire SudokuGrid is valid. Raises errors for invalid sudokus with reasoning.
	 * For a single cell, checkCell should be faster.
	 * @returns {boolean}
	 */
	check() {
		let is_valid = true;
		let containsDuplicates = (arr) => {
			return new Set(arr).size !== arr.length;
		}
		// check rows
		for (let k=0; k<9; k++) {
			const entries = new Array();
			for (let j=0; j<9; j++) {
				const cell = this.grid[k][j];
				if (cell !== "") {
					entries.push(cell);
				}
			}
			if (containsDuplicates(entries)) {
				console.error(`Duplicate detected in row ${k + 1}`);
				is_valid = false;
			}
		}

		// check columns
		for (let k=0; k<9; k++) {
			const entries = new Array();
			for (let i=0; i<9; i++) {
				const cell = this.grid[i][k];
				if (cell !== "") {
					entries.push(cell);
				}
			}
			if (containsDuplicates(entries)) {
				console.error(`Duplicate detected in column ${k + 1}`);
				is_valid = false;
			}
		}

		// check blocks
		const blocks = [[0,0], [0,3], [0,6], [3,0], [3,3], [3,6], [6,0], [6,3], [6,6]];
		blocks.forEach((item) => {
			const entries = new Array();
			for (let k=0; k<9; k++) {
				const cell = this.grid[item[0] + Math.trunc(k/3)][item[1] + k%3];
				if (cell !== "") {
					entries.push(cell);
				}
			}
			if (containsDuplicates(entries)) {
				console.error(`Duplicate detected in block ${blocks.indexOf(item) + 1}`);
				is_valid = false;
			}
		});

		return is_valid;
	}

	/**
	 * @method
	 * Checks whether a cell in a SudokuGrid is valid. Only returns true or false, no description of
	 * which rule is broken is given.
	 * @param {number} i - row index (0-8)
	 * @param {number} j - column index (0-8)
	 * @returns {boolean}
	 */
	checkCell(i, j) {
		const cell = this.grid[i][j];
		// top-left coordinate of block that (i, j) is in
		const block_row = 3*Math.trunc(i/3);
		const block_col = 3*Math.trunc(j/3);
		// relative k from top left coordinate by top-down left-right traversal
		const offset = 3*(i - block_row) + j - block_col;
		for (let k=0; k<9; k++) {
			// check row
			if (k !== i && this.grid[k][j] === cell) {
				return false;
			}
			// check column
			if (k !== j && this.grid[i][k] === cell) {
				return false;
			}
			// check block
			if (k !== offset && this.grid[block_row + Math.trunc(k/3)][block_col + (k%3)] === cell) {
				return false;
			}
		}
		return true;
	}

}

/**
 * @function
 * Function to call when website is loaded.
 */
function setUp() {
	const table = document.getElementById("sudoku");
	// remove enable javascript message
	table.innerHTML = "";
	// add 9x9 grid
	for (let i=0; i<9; i++) {
		const row = document.createElement("tr");
		for (let j=0; j<9; j++) {
			const cell = document.createElement("td");
			const input = document.createElement("input");
			input.type = "text";
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
	SUDOKU_GRID = new SudokuGrid("standard", "standard");
}

window.onload = setUp;
let SUDOKU_GRID = null;