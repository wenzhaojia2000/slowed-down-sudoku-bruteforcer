/**
 * error class to throw when an invalid matrix is given to the bruteforcer (e.g. invalid characters, incorrect size,
 * invalid placements)
 */
class InvalidSudokuError extends RangeError {

	/**
	 * @constructor
	 * @param {string} message - error message
	 * @param {string[]} details - optional: list of strings detailing invalid placements in the matrix
	 */
	constructor(message, details) {
		super(message);
		this.details = details;
	}
}

/**
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
	 * @type {number[][]}
	 */
	unfilledCells = new Array();

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
	 * @param {number[][]} matrix - the 9x9 sudoku grid that user fills in. empty values are represented as 0.
	 * @param {string} [fill_in_method] - dictates which cells should be filled in first. can be one of the following:
	 * "standard" (row first), "column" (columns first), "efficient" (least possibilities first), or "random" (not
	 * recommended).
	 * @param {string} [sudoku_type] - dictates which sudoku variant to use (to be added).
	 */
	constructor(matrix, fill_in_method="standard", sudoku_type="standard") {
		// deep copy so user can still access unmodified matrix
		this.matrix = structuredClone(matrix);
		this.fillInMethod = fill_in_method;
		this.sudokuType = sudoku_type;
		this.#check();

		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				this.#fillIn(i, j);
			}
		}
		// if fill in method is efficient, sort by number of possibilities (index 2)
		if (this.fillInMethod == "efficient") {
			this.unfilledCells.sort((a, b) => {return a[2] - b[2];})
		}
		// if fill in method is random, shuffle the array using a durstenfeld shuffle
		// https://stackoverflow.com/a/12646864/9918937)
		// note that filling in by random order is AWFUL and will almost always take much longer than
		// any other method
		if (this.fillInMethod == "random") {
			for (let i = this.unfilledCells.length-1; i>0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[this.unfilledCells[i], this.unfilledCells[j]] = [this.unfilledCells[j], this.unfilledCells[i]];
			}
		}
	}

	/**
	 * @method
	 * @private
	 * checks whether the entire matrix is valid (does not break any rules from the beginning -- does not check that
	 * the sudoku has a solution). only used in used in constructor.
	 * @throws {InvalidSudokuError} sudoku is invalid. the "details" property contains a list of strings with reasons on
	 * why the sudoku is invalid.
	 * @returns {void} sudoku is valid.
	 */
	#check() {
		// check matrix size and check for invalid characters. if user gave strings instead of numbers, convert to numbers
		for (let i=0; i<9; i++) {
			if (this.matrix[i] === undefined) {
					throw new InvalidSudokuError(`Cannot access row ${i+1}: ensure matrix type is correct " + 
					"with size 9x9 and all cells are defined`);
				}
			for (let j=0; j<9; j++) {
				if (this.matrix[i][j] === undefined) {
					throw new InvalidSudokuError(`Cannot access cell in row ${i+1}, column ${j+1}: ` +
					"ensure matrix size is 9x9 and all cells are defined");
				}
				// this will also truncate any decimal places if the user puts them (for some reason)
				const cell = parseInt(this.matrix[i][j]);
				if (Number.isNaN(cell) || cell < 0 || cell > 9) {
					throw new InvalidSudokuError("Please ensure matrix cells only contain the numbers 0 to 9, inclusive");
				}
				this.matrix[i][j] = cell;
			}
		}

		const errors = new Array();
		// check rows
		for (let k=0; k<9; k++) {
			const entries = new Array();
			for (let j=0; j<9; j++) {
				const cell = this.matrix[k][j];
				if (cell !== 0) {
					entries.push(cell);
				}
			}
			if (this.#containsDuplicates(entries)) {
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
			if (this.#containsDuplicates(entries)) {
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
			if (this.#containsDuplicates(entries)) {
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
		switch (this.fillInMethod) {
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
					this.unfilledCells.push([i, j, n]);
					// need to sort by n afterwards (see constructor)
				}
				break;
			case "column":
				if (this.matrix[j][i] === 0) {
					this.unfilledCells.push([j, i]);
				}
				break;
			case "standard":
			default:
				if (this.matrix[i][j] === 0) {
					this.unfilledCells.push([i, j]);
				}
		}
	}

	/**
	 * @method
	 * checks whether there is more of one item in an array. returns false if all elements are unique, true
	 * otherwise.
	 * @param {any[]} arr - array to check for duplicates
	 * @returns {boolean}
	 */
	#containsDuplicates(arr) {
		return new Set(arr).size !== arr.length;
	}

	/**
	 * @method
	 * checks whether a cell in the matrix is valid. only returns true or false, no description of which rule is
	 * broken is given.
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
	 * @returns {number[] | undefined} array of [i, j, v] where i, j are the cell coordinates and v is the new
	 * value or void if the sudoku has already been successfully solved or failed to solve.
	 */
	nextStep() {
		if (this.index < 0) {
			this.status = "failure";
			return;
		} else if (this.index == this.unfilledCells.length) {
			this.status = "success";
			return;
		}
		
		const [i, j] = this.unfilledCells[this.index];
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

	/**
	 * @method
	 * queue up all iterations and attempt to solve the sudoku. may cause lag.
	 * @returns {void}
	 */
	solve() {
		while (this.status === "pending") {
			this.nextStep();
		}
	}
}

export {InvalidSudokuError, Bruteforcer};
