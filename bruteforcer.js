"use strict";

/**
 * @class
 * error class to throw when an invalid matrix is given to the bruteforcer (e.g. invalid characters, incorrect size,
 * invalid placements)
 */
class InvalidSudokuError extends RangeError {

	/**
	 * @constructor
	 * @param {string} message - error message
	 * @param {Array} details - optional: list of strings detailing invalid placements in the matrix
	 */
	constructor(message, details) {
		super(message);
		this.details = details;
	}
}

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
	 * whether the bruteforcer is working on ("pending"), completed, ("success") or failed at solving the
	 * sudoku ("failure")
	 * @type {string}
	 */
	status = "pending";

	/**
	 * @constructor
	 * @param {Array} matrix - the 9x9 sudoku grid that user fills in. empty values are represented as 0.
	 * @param {string} fill_in_method - dictates which cells should be filled in first. can be one of the following:
	 * "standard" (row first), "column" (columns first), "efficient" (least possibilities first), or "random" (not
	 * recommended).
	 * @param {string} sudoku_type - dictates which sudoku variant to use (to be added).
	 */
	constructor(matrix, fill_in_method="standard", sudoku_type="standard") {
		// deep copy so user can still access unmodified matrix
		this.matrix = structuredClone(matrix);
		this.fill_in_method = fill_in_method;
		this.sudoku_type = sudoku_type;
		this.#check();

		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				this.#fillIn(i, j);
			}
		}
		// if fill in method is efficient, sort by number of possibilities (index 2)
		if (this.fill_in_method == "efficient") {
			this.unfilled_cells.sort((a, b) => {return a[2] - b[2];})
		}
		// if fill in method is random, shuffle the array using a durstenfeld shuffle
		// https://stackoverflow.com/a/12646864/9918937)
		// note that filling in by random order is AWFUL and will almost always take much longer than
		// any other method
		if (this.fill_in_method == "random") {
			for (let i = this.unfilled_cells.length-1; i>0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[this.unfilled_cells[i], this.unfilled_cells[j]] = [this.unfilled_cells[j], this.unfilled_cells[i]];
			}
		}
	}

	/**
	 * @method
	 * @private
	 * checks whether the entire matrix is valid (does not break any rules from the beginning -- does not check that
	 * the sudoku has a solution). only used in used in constructor.
	 * @throws {InvalidSudokuError} - sudoku is invalid. the "details" property contains a list of strings with reasons on
	 * why the sudoku is invalid.
	 * @returns {void} - sudoku is valid.
	 */
	#check() {
		// check matrix size and check for invalid characters. if user gave strings instead of numbers, convert to numbers
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				const cell = parseInt(this.matrix[i][j]);
				if (isNaN(cell)) {
					throw new InvalidSudokuError("Either size of sudoku matrix is incorrect or one or more cells contain invalid characters");
				}
				if (cell < 0 || cell > 9) {
					throw new InvalidSudokuError("Please ensure matrix cells only contain the numbers 0 to 9, inclusive");
				}
				this.matrix[i][j] = cell;
			}
		}

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

		if (errors.length !== 0) {
			throw new InvalidSudokuError("Placement of numbers in sudoku matrix is invalid", errors);
		}
	}

	/**
	 * @method
	 * @private
	 * helps build the unfilled_cells array, depending on the fill in method of the bruteforcer. only used in
	 * the constructor.
	 * @param {number} i - row index (0-8)
	 * @param {number} j - column index (0-8)
	 */
	#fillIn(i, j) {
		switch (this.fill_in_method) {
			case "efficient":
				if (this.matrix[i][j] === 0) {
					let n = 0;
					for (let c=1; c<10; c++) {
						this.matrix[i][j] = c;
						if (this.checkCell(i, j)) {
							n++;
						}
						this.matrix[i][j] = 0;
					}
					this.unfilled_cells.push([i, j, n]);
					// need to sort by n afterwards (see constructor)
				}
				break;
			case "column":
				if (this.matrix[j][i] === 0) {
					this.unfilled_cells.push([j, i]);
				}
				break;
			case "standard":
			default:
				if (this.matrix[i][j] === 0) {
					this.unfilled_cells.push([i, j]);
				}
		}
	}

	/**
	 * @method
	 * checks whether a cell in the matrix is valid. only returns true or false, no description of which rule is
	 * broken is given. use check for checking entire sudoku before bruteforcing.
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
		this.matrix[i][j]++;
		
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
