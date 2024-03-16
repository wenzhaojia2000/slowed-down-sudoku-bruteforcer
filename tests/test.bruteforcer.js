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
		function test_first_digit(bf, i, j, val) {
			return () => {
				bf.nextStep();
				const expected_cell = bf.matrix[i][j];
				expect(expected_cell).to.equal(val);
			}
		}

		it('inserts first digit correctly (standard)', test_first_digit(bf_standard, 0, 2, 1));
		it('inserts first digit correctly (column)', test_first_digit(bf_column, 2, 0, 1));
		it('inserts first digit correctly (efficient)', test_first_digit(bf_efficient, 4, 4, 1));
	});

	describe('when bruteforcer steps through all iterations', function () {
		function test_solution(bf) {
			return () => {
				while (bf.status === "pending") {
					bf.nextStep();
				}
				expect(bf.matrix).to.deep.equal(solution);
			}
		}

		it('solves sudoku correctly (standard)', test_solution(bf_standard));
		it('solves sudoku correctly (column)', test_solution(bf_column));
		it('solves sudoku correctly (efficient)', test_solution(bf_efficient));
	});
});
