import {InvalidSudokuError, Bruteforcer} from "../modules/bruteforcer.js";
let expect = chai.expect;

describe("bruteforcer.js", function () {
	// load fixture from fixture.json -- can use within it() context
	let fixture;
	before(async function () {
		const request = new Request("./fixture.json");
		const response = await fetch(request);
		fixture = await response.json();
	});

	describe("when sample sudoku is given to bruteforcer", function () {
		function testFirstDigit(fill_in_method, i, j, val) {
			return () => {
				const bf = new Bruteforcer(fixture["matrix"], fill_in_method);
				bf.nextStep();
				const expected_cell = bf.matrix[i][j];
				expect(expected_cell).to.equal(val);
			}
		}

		it("inserts first digit correctly (standard)", testFirstDigit("standard", 0, 2, 1));
		it("inserts first digit correctly (column)", testFirstDigit("column", 2, 0, 1));
		it("inserts first digit correctly (efficient)", testFirstDigit("efficient", 4, 4, 1));
	});

	describe("when bruteforcer steps through all iterations", function () {
		function testSolution(fill_in_method) {
			return () => {
				const bf = new Bruteforcer(fixture["matrix"], fill_in_method);
				while (bf.status === "pending") {
					bf.nextStep();
				}
				expect(bf.matrix).to.deep.equal(fixture["solution"]);
			}
		}

		it("solves sudoku correctly (standard)", testSolution("standard"));
		it("solves sudoku correctly (column)", testSolution("column"));
		it("solves sudoku correctly (efficient)", testSolution("efficient"));
	});

	describe("when invalid matrix is given to bruteforcer", function () {
		// mat_name is the name of the matrix in fixture.json to pass to bruteforcer
		function testInvalidMatrixThrows(mat_name) {
			return () => {
				const result = () => {return new Bruteforcer(fixture[mat_name])};
				expect(result).to.throw(InvalidSudokuError);
			}
		}

		it("throws an error (invalid variable type)", testInvalidMatrixThrows("invalid_type"));
		it("throws an error (invalid object properties)", testInvalidMatrixThrows("invalid_object"));
		it("throws an error (invalid number in matrix)", testInvalidMatrixThrows("invalid_numbers"));
		it("throws an error (invalid matrix size)", testInvalidMatrixThrows("invalid_size"));
	});

	describe("when invalid number placement is given in matrix", function () {
		// details_func is a function that returns true for a given details array
		function testInvalidPlacementThrows(mat_name, details_func) {
			return () => {
				const result = () => {return new Bruteforcer(fixture[mat_name])};
				expect(result).to.throw(InvalidSudokuError).with.property("details").which.satisfies(details_func);
			}
		}

		it("throws an error (duplicate in row)", testInvalidPlacementThrows("duplicate_row", function (details) {
			return (details.length === 1 && details[0].match(/row/i));
		}));
		it("throws an error (duplicate in column)", testInvalidPlacementThrows("duplicate_column", function (details) {
			return (details.length === 1 && details[0].match(/column/i));
		}));
		it("throws an error (duplicate in block)", testInvalidPlacementThrows("duplicate_block", function (details) {
			return (details.length === 1 && details[0].match(/block/i));
		}));
		it("throws an error (multiple duplicates)", testInvalidPlacementThrows("duplicate_multiple", function (details) {
			return (details.length === 3);
		}));
	});
});
