describe("b64.js", function () {
	describe('when dec is converted to b64', function () {
		function test_dec_to_b64(val, expected) {
			return () => {
				const result = b64.to(val);
				expect(result).to.equal(expected);
			}
		}

		it('translates "0" correctly', test_dec_to_b64("0", "A"));
		it('translates medium-sized number correctly', test_dec_to_b64("262143", "___"));
		it('translates large-sized number correctly', test_dec_to_b64("1237628137033103787049565361", "_-9876543210zyx"));
	});

	describe('when b64 is converted to dec', function () {
		function test_b64_to_dec(val, expected) {
			return () => {
				const result = b64.from(val);
				expect(result).to.equal(expected);
			}
		}

		it('translates "A" correctly', test_b64_to_dec("A", "0"));
		it('translates medium-sized number correctly', test_b64_to_dec("ZZZ", "104025"));
		it('translates large-sized number correctly', test_b64_to_dec("KQXbiTLPjpWIdls1xyBX4dxC8l--oa4Ih6Saqdwonae7y", "304008007000907005070000600028035076960000000005000004003000000546000000890040050"));
	});

	describe('when string padded with 0s is converted to b64', function () {
		it('interprets correctly', function () {
			const result = b64.to("000000000000000000000000000000000000000000000000000000000000000000000000000000012");
			expect(result).to.equal("M");
		});
	});

	describe('when string padded with As is converted to dec', function () {
		it('interprets correctly', function () {
			const result = b64.from("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAt");
			expect(result).to.equal("45");
		});
	});

	describe('when number instead of string is converted to b64', function () {
		it('interprets correctly (up to MAX_SAFE_INTEGER)', function () {
			const result = b64.to(9007199254740990);
			expect(result).to.equal("f_______-");
		});
	});
});
