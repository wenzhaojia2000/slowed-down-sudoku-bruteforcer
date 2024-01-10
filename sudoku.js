"use strict";

/**
 * @class
 * Class for storing the sudoku grid and solving it.
 */
class SudokuGrid {

	/**
	 * @constructor
	 * @param {string} fill_in_method - dictates which cells should be filled in first (to be added).
	 * @param {string} sudoku_type - dictates which sudoku variant to use (to be added).
	 */
	constructor(fill_in_method, sudoku_type) {
		this.fill_in_method = fill_in_method;
		this.sudoku_type = sudoku_type;
		
		this.table = document.getElementById("sudoku");
		this.fixed_numbers = new Array();
		// get filled in numbers from table
		this.grid = new Array(9);
		for (let i=0; i<9; i++) {
			const row = new Array(9);
			for (let j=0; j<9; j++) {
				row[j] = document.getElementById(String(i) + String(j)).value;
			}
			this.grid[i] = row;
		}

		// check for errors
		const error_div = document.getElementById("errors");
		error_div.innerHTML = "";
		const errors = this.check();
		if (errors.length !== 0) {
			for (let i=0; i<errors.length; i++) {
				error_div.innerHTML += errors[i] + "<br/>";
			}
			return;
		}

		// freeze cells, set classnames, fill in fixed numbers array
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				let cell = document.getElementById(String(i) + String(j));
				cell.disabled = true;
				if (cell.value !== "") {
					cell.className = "fixed";
					this.fixed_numbers.push(String(i) + String(j));
				} else {
					cell.className = "unfilled";
				}
			}
		}
		
	}

	/**
	 * @method
	 * Resets the table, removing numbers filled in by algorithm.
	 */
	reset() {
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				let cell = document.getElementById(String(i) + String(j));
				if (cell.className === "unfilled") {
					cell.value = "";
				}
				cell.disabled = false;
				cell.className = "sudoku";
			}
		}
		delete this.grid;
		delete this.fixed_numbers;
	}

	/**
	 * @method
	 * Checks whether the entire SudokuGrid is valid. Returns a list of strings containing error messages
	 * for invalid sudokus. For valid sudokus, returns an empty array.
	 * For a single cell, checkCell should be faster.
	 * @returns {Array}
	 */
	check() {
		let errors = new Array();
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
				errors.push(`Duplicate detected in row ${k + 1}`);
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
				errors.push(`Duplicate detected in column ${k + 1}`);
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
				errors.push(`Duplicate detected in block ${blocks.indexOf(item) + 1}`);
			}
		});

		return errors;
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
