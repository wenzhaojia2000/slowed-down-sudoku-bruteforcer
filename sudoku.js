"use strict";

/**
 * @class
 * Class for storing the sudoku grid and solving it.
 */
class SudokuGrid {
	
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
	 * the 9x9 sudoku grid that user fills in. empty values are represented as 0.
	 * @type {Array}
	 */
	grid = new Array(9);

	/**
	 * speed of iteration
	 * @type {number}
	 */
	speed = Number(document.getElementById("speed").value);

	/**
	 * @constructor
	 * @param {string} fill_in_method - dictates which cells should be filled in first (to be added).
	 * @param {string} sudoku_type - dictates which sudoku variant to use (to be added).
	 */
	constructor(fill_in_method, sudoku_type) {
		this.fill_in_method = fill_in_method;
		this.sudoku_type = sudoku_type;
		
		// get filled in numbers from table
		for (let i=0; i<9; i++) {
			const row = new Array(9);
			for (let j=0; j<9; j++) {
				row[j] = Number(document.getElementById(String(i) + String(j)).value);
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
				} else {
					cell.className = "unfilled";
					this.unfilled_cells.push([i, j]);
				}
			}
		}

		this.play();
	}

	/**
	 * @method
	 * Pauses the bruteforce algorithm at the current step.
	 */
	pause() {
		clearInterval(this.timer);
	}

	/**
	 * @method
	 * Starts or resumes the bruteforce algorithm.
	 */
	play() {
		// clear any existing timer
		this.pause();
		// generally, setInterval delay is capped at once per 4ms (250Hz). if speed exceeds this, do
		// multiple iterations per interval. actual speed = number of iterations / delay
		let n_intervals = Math.ceil(this.speed/250);
		let delay = 1000 * Math.ceil(this.speed/250)/this.speed;
		this.timer = setInterval(() => this.nextStep(n_intervals), delay);
	}

	/**
	 * @method
	 * Resets the table, removing numbers filled in by algorithm.
	 */
	reset() {
		this.pause();
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				let cell = document.getElementById(String(i) + String(j));
				if (cell.className === "unfilled" || cell.className === "complete") {
					cell.value = "";
				}
				cell.disabled = false;
				cell.className = "sudoku";
			}
		}
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
				const cell = this.grid[i][k];
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
				const cell = this.grid[item[0] + Math.trunc(k/3)][item[1] + k%3];
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

	/**
	 * @method
	 * Completes n_steps iterations of the bruteforce algorithm.
	 * @param {number} n_steps - number of bruteforce steps to take.
	 */
	nextStep(n_steps=1) {
		for (let n=0; n<n_steps; n++){
			if (this.index < 0) {
				document.getElementById("errors").innerHTML = "Sudoku has no solutions";
				clearInterval(this.timer);
				break;
			} else if (this.index == this.unfilled_cells.length) {
				document.getElementById("success").innerHTML = "Sudoku has been solved!";
				clearInterval(this.timer);
				// recolour red cells green
				for (let i=0; i<9; i++) {
					for (let j=0; j<9; j++) {
						let cell = document.getElementById(String(i) + String(j));
						if (cell.className === "unfilled") {
							cell.className = "complete";
						}
					}
				}
				break;
			}
			
			let i = this.unfilled_cells[this.index][0];
			let j = this.unfilled_cells[this.index][1];
			
			// increment this cell
			this.grid[i][j] = this.grid[i][j] + 1;
			
			if (this.grid[i][j] === 10) {
				// actually cannot increment this square, backtrack
				this.grid[i][j] = 0;
				this.index--;
			} else if (this.checkCell(i, j)) {
				// number is fine, go to next square
				this.index++;
			}

			// update value on screen
			document.getElementById(String(i) + String(j)).value = (this.grid[i][j] === 0) ? "" : String(this.grid[i][j]);
			// update iteration
			this.iter++;
		}
		document.getElementById("iter").value = String(this.iter);
	}
}
