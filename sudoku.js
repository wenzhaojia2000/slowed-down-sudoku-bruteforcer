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
	constructor(table, fill_in_method, sudoku_type) {
		this.table = table;
		this.fill_in_method = fill_in_method;
		this.sudoku_type = sudoku_type;
		// get filled in numbers from table
		this.grid = new Array(9);
		for (let i=0; i<9; i++) {
			const row = new Array(9);
			for (let j=0; j<9; j++) {
				row[j] = document.getElementById(i.toString() + j.toString()).value;
			}
			this.grid[i] = row;
		}
	}

	/**
	 * @method
	 * Checks whether the entire SudokuGrid is valid. For a single cell, checkCell should be faster.
	 * @returns {boolean}
	 */
	check() {
		let is_valid = true;
		let checkDuplicates = (arr) => {
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
			if (checkDuplicates(entries) === true) {
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
			if (checkDuplicates(entries) === true) {
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
			if (checkDuplicates(entries) === true) {
				console.error(`Duplicate detected in block ${blocks.indexOf(item) + 1}`);
				is_valid = false;
			}
		});

		return is_valid;
	}

	/**
	 * @method
	 * Checks whether a cell in a SudokuGrid is valid.
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
			input.id = i.toString() + j.toString();
			cell.appendChild(input);
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
}

/**
 * @function
 * Function to call when "Solve" is pressed.
 */
function solveSudoku() {
	const table = document.getElementById("sudoku");
	SUDOKU_GRID = new SudokuGrid(table, "standard", "standard");
	console.log(SUDOKU_GRID.check());
}

window.onload = setUp;
let SUDOKU_GRID = null;