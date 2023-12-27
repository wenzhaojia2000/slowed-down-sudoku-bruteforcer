/**
 * Class for storing the sudoku grid and solving it.
 */
class SudokuGrid {

	/**
	 * @constructor
	 * @param {HTMLElement} table - HTMLElement to get grid from.
	 * @param {string} fill_in_method - dictates which cells should be filled in first.
	 * @param {string} sudoku_type - dictates which sudoku variant to use.
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

}

/**
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
 * Function to call when "Solve" is pressed.
 */
function solveSudoku() {
	const table = document.getElementById("sudoku");
	const sudoku_grid = new SudokuGrid(table, "standard", "standard");
}

window.onload = setUp;