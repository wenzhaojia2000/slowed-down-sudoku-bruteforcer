"use strict";

/**
 * @class
 * class for storing the sudoku grid and solving it.
 */
class Bruteforcer {
	
	/** 
	 * current iteration of the algorithm
	 * @type {number}
	 */
	iter = 0;

	/**
	 * contains [i,j] values of every empty cell
	 * @type {Array}
	 */
	unfilled_cells = new Array();

	/**
	 * details which index in unfilled_cells the algorithm is bruteforcing
	 * @type {number}
	 */
	index = 0;

	/**
	 * whether the bruteforcer is working on, completed, or failed at solving the sudoku
	 */
	status = "pending";

	/**
	 * @constructor
	 * @param {Array} matrix - the 9x9 sudoku grid that user fills in. empty values are represented as 0.
	 * @param {string} fill_in_method - dictates which cells should be filled in first (to be added).
	 * @param {string} sudoku_type - dictates which sudoku variant to use (to be added).
	 */
	constructor(matrix, fill_in_method="standard", sudoku_type="standard") {
		this.matrix = matrix;
		this.fill_in_method = fill_in_method;
		this.sudoku_type = sudoku_type;

		// fill in fixed numbers array
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				if (this.matrix[i][j] === 0) {
					this.unfilled_cells.push([i, j]);
				}
			}
		}

	}

	/**
	 * @method
	 * checks whether the entire matrix is valid. For a single cell, checkCell should be faster.
	 * @returns {Array} - a list of strings containing error messages for invalid sudokus. For valid sudokus,
	 * returns an empty array.
	 */
	check() {
		const errors = new Array();
		const containsDuplicates = (arr) => {
			return new Set(arr).size !== arr.length;
		}
		// check rows
		for (let k=0; k<9; k++) {
			const entries = new Array();
			for (let j=0; j<9; j++) {
				const cell = this.matrix[k][j];
				if (cell !== 0) {
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
				const cell = this.matrix[i][k];
				if (cell !== 0) {
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
				const cell = this.matrix[item[0] + Math.trunc(k/3)][item[1] + k%3];
				if (cell !== 0) {
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
	 * checks whether a cell in the matrix is valid. only returns true or false, no description of
	 * which rule is broken is given.
	 * @param {number} i - row index (0-8)
	 * @param {number} j - column index (0-8)
	 * @returns {boolean}
	 */
	checkCell(i, j) {
		const cell = this.matrix[i][j];
		// top-left coordinate of block that (i, j) is in
		const block_row = 3*Math.trunc(i/3);
		const block_col = 3*Math.trunc(j/3);
		// relative k from top left coordinate by top-down left-right traversal
		const offset = 3*(i - block_row) + j - block_col;
		for (let k=0; k<9; k++) {
			// check row
			if (k !== i && this.matrix[k][j] === cell) {
				return false;
			}
			// check column
			if (k !== j && this.matrix[i][k] === cell) {
				return false;
			}
			// check block
			if (k !== offset && this.matrix[block_row + Math.trunc(k/3)][block_col + (k%3)] === cell) {
				return false;
			}
		}
		return true;
	}

	/**
	 * @method
	 * completes one iteration of the bruteforce algorithm.
	 * @returns {Array} - array of [i, j, v] where i, j are the cell coordinates and v is the new value.
	 * @returns {void} - the sudoku has already been successfully solved or failed to solve.
	 */
	nextStep() {
		if (this.index < 0) {
			this.status = "failure";
			return;
		} else if (this.index == this.unfilled_cells.length) {
			this.status = "success";
			return;
		}
		
		const [i, j] = this.unfilled_cells[this.index];
		// increment this cell
		this.matrix[i][j] = this.matrix[i][j] + 1;
		
		if (this.matrix[i][j] === 10) {
			// actually cannot increment this square, backtrack
			this.matrix[i][j] = 0;
			this.index--;
		} else if (this.checkCell(i, j)) {
			// number is fine, go to next square
			this.index++;
		}

		this.iter++;
		return [i, j, this.matrix[i][j]];
	}
}
