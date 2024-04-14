import {InvalidSudokuError, Bruteforcer} from "../modules/bruteforcer.js";
let expect = chai.expect;

describe("bruteforcer.js", function () {
	const matrix = [
		[5,3,0,0,7,0,0,0,0],
		[6,0,0,1,9,5,0,0,0],
		[0,9,8,0,0,0,0,6,0],
		[8,0,0,0,6,0,0,0,3],
		[4,0,0,8,0,3,0,0,1],
		[7,0,0,0,2,0,0,0,6],
		[0,6,0,0,0,0,2,8,0],
		[0,0,0,4,1,9,0,0,5],
		[0,0,0,0,8,0,0,7,9]
	];
	const solution = [
		[5,3,4,6,7,8,9,1,2],
		[6,7,2,1,9,5,3,4,8],
		[1,9,8,3,4,2,5,6,7],
		[8,5,9,7,6,1,4,2,3],
		[4,2,6,8,5,3,7,9,1],
		[7,1,3,9,2,4,8,5,6],
		[9,6,1,5,3,7,2,8,4],
		[2,8,7,4,1,9,6,3,5],
		[3,4,5,2,8,6,1,7,9]
	];

	const bf_standard = new Bruteforcer(matrix, "standard");
	const bf_column = new Bruteforcer(matrix, "column");
	const bf_efficient = new Bruteforcer(matrix, "efficient");

	describe('when sample sudoku is given to bruteforcer', function () {
		function testFirstDigit(bf, i, j, val) {
			return () => {
				bf.nextStep();
				const expected_cell = bf.matrix[i][j];
				expect(expected_cell).to.equal(val);
			}
		}

		it('inserts first digit correctly (standard)', testFirstDigit(bf_standard, 0, 2, 1));
		it('inserts first digit correctly (column)', testFirstDigit(bf_column, 2, 0, 1));
		it('inserts first digit correctly (efficient)', testFirstDigit(bf_efficient, 4, 4, 1));
	});

	describe('when bruteforcer steps through all iterations', function () {
		function testSolution(bf) {
			return () => {
				while (bf.status === "pending") {
					bf.nextStep();
				}
				expect(bf.matrix).to.deep.equal(solution);
			}
		}

		it('solves sudoku correctly (standard)', testSolution(bf_standard));
		it('solves sudoku correctly (column)', testSolution(bf_column));
		it('solves sudoku correctly (efficient)', testSolution(bf_efficient));
	});

	describe('when invalid matrix is given to bruteforcer', function () {
		function testInvalidMatrixThrows(matrix) {
			return () => {
				const result = () => {return new Bruteforcer(matrix)};
				expect(result).to.throw(InvalidSudokuError);
			}
		}
		const invalid_type = 4;
		const invalid_object = {
			0: {a: 5, b: 3, c: 0, d: 0, e: 7, f: 0, g: 0, h: 0, i: 0},
			1: {a: 6, b: 0, c: 0, d: 1, e: 9, f: 5, g: 0, h: 0, i: 0},
			2: {a: 0, b: 9, c: 8, d: 0, e: 0, f: 0, g: 0, h: 6, i: 0},
			3: {a: 8, b: 0, c: 0, d: 0, e: 6, f: 0, g: 0, h: 0, i: 3},
			4: {a: 4, b: 0, c: 0, d: 8, e: 0, f: 3, g: 0, h: 0, i: 1},
			5: {a: 7, b: 0, c: 0, d: 0, e: 2, f: 0, g: 0, h: 0, i: 6},
			6: {a: 0, b: 6, c: 0, d: 0, e: 0, f: 0, g: 2, h: 8, i: 0},
			7: {a: 0, b: 0, c: 0, d: 4, e: 1, f: 9, g: 0, h: 0, i: 5},
			8: {a: 0, b: 0, c: 0, d: 0, e: 8, f: 0, g: 0, h: 7, i: 9}
		};
		const invalid_numbers = [
			[5,3,0,0,7,0,0,0,0],
			[-6,0,0,1,10,5,0,0,0],
			[0,9,8,0,0,0,0,6,0],
			[8,0,0,0,-6,0,0,0,3],
			[4,0,0,8,0,3,0,0,1],
			[7,0,0,0,2,0,0,0,-6],
			[0,-6,0,0,0,0,2,8,0],
			[0,0,0,4,1,10,0,0,5],
			[0,0,0,0,8,0,0,7,10]
		];
		const invalid_size = [
			[5,3,0,0,7,0,0,0,0],
			[6,0,0,1,9,5,0,0,0],
			[0,9,8,0,0,0,0,6,0],
			[8,0,0,0,6,0,0,0,3],
			[4,0,0,8,0,3,0,0,1],
			[7,0,0,0,2,0,0,0,6],
			[0,6,0,0,0,0,2,8,0],
			[0,0,0,4,1,9,0,0,5]
		];

		it('throws an error (invalid variable type)', testInvalidMatrixThrows(invalid_type));
		it('throws an error (invalid object properties)', testInvalidMatrixThrows(invalid_object));
		it('throws an error (invalid number in matrix)', testInvalidMatrixThrows(invalid_numbers));
		it('throws an error (invalid matrix size)', testInvalidMatrixThrows(invalid_size));
	});

	describe('when invalid number placement is given in matrix', function () {
		// details_func is a function that returns true for a given details array
		function testInvalidPlacementThrows(matrix, details_func) {
			return () => {
				const result = () => {return new Bruteforcer(matrix)};
				expect(result).to.throw(InvalidSudokuError).with.property("details").which.satisfies(details_func);
			}
		}

		const duplicate_row = [
			[5,3,0,0,7,0,0,0,0],
			[6,0,0,1,9,5,0,0,0],
			[0,9,8,0,0,0,0,6,0],
			[8,0,0,0,6,0,0,0,3],
			[4,0,0,8,0,3,0,0,1],
			[7,0,0,0,2,0,0,0,6],
			[0,6,0,0,0,0,2,8,0],
			[0,0,0,4,1,9,0,0,5],
			[9,0,0,0,8,0,0,7,9]
		]
		const duplicate_column = [
			[5,3,0,0,7,0,0,0,0],
			[6,0,0,1,9,5,0,0,0],
			[0,9,8,0,0,0,0,6,5],
			[8,0,0,0,6,0,0,0,3],
			[4,0,0,8,0,3,0,0,1],
			[7,0,0,0,2,0,0,0,6],
			[0,6,0,0,0,0,2,8,0],
			[0,0,0,4,1,9,0,0,5],
			[0,0,0,0,8,0,0,7,9]
		];
		const duplicate_block = [
			[5,3,0,0,7,0,0,0,0],
			[6,0,0,1,9,5,0,0,0],
			[0,9,8,0,0,0,0,6,0],
			[8,0,0,0,6,0,0,0,3],
			[4,0,0,8,0,3,0,0,1],
			[7,0,0,0,2,0,3,0,6],
			[0,6,0,0,0,0,2,8,0],
			[0,0,0,4,1,9,0,0,5],
			[0,0,0,0,8,0,0,7,9]
		];
		const duplicate_multiple = [
			[5,3,0,0,7,0,0,0,0],
			[6,0,0,1,9,5,0,0,0],
			[0,9,8,0,0,0,0,6,5],
			[8,0,0,0,6,0,0,0,3],
			[4,0,0,8,0,3,0,0,1],
			[7,0,0,0,2,0,3,0,6],
			[0,6,0,0,0,0,2,8,0],
			[0,0,0,4,1,9,0,0,5],
			[9,0,0,0,8,0,0,7,9]
		];

		it('throws an error (duplicate in row)', testInvalidPlacementThrows(duplicate_row, function (details) {
			return (details.length === 1 && details[0].match(/row/i));
		}));
		it('throws an error (duplicate in column)', testInvalidPlacementThrows(duplicate_column, function (details) {
			return (details.length === 1 && details[0].match(/column/i));
		}));
		it('throws an error (duplicate in block)', testInvalidPlacementThrows(duplicate_block, function (details) {
			return (details.length === 1 && details[0].match(/block/i));
		}));
		it('throws an error (multiple duplicates)', testInvalidPlacementThrows(duplicate_multiple, function (details) {
			return (details.length === 3);
		}));
	});
});
