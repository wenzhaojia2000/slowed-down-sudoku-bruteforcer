let expect = chai.expect;

describe("b64.js", function () {
	describe('when "0" (dec) is converted to b64', function () {
		it('returns "A"', function () {
			const result = b64.to("0");
			expect(result).to.equal("A");
		});
	});

	describe('when 262143 (dec) is converted to b64', function () {
		it('returns "___"', function () {
			const result = b64.to("262143");
			expect(result).to.equal("___");
		});
	});

	describe('when large number is converted to b64', function () {
		it('returns correct result', function () {
			const result = b64.to("1237628137033103787049565361");
			expect(result).to.equal("_-9876543210zyx");
		});
	});

	describe('when string padded with 0s is converted to b64', function () {
		it('interprets correctly', function () {
			const result = b64.to("000000000000000000000000000000000000000000000000000000000000000000000000000000012");
			expect(result).to.equal("M");
		});
	});

	describe('when number instead of string is converted to b64', function () {
		it('interprets correctly (up to MAX_SAFE_INTEGER)', function () {
			const result = b64.to(9007199254740990);
			expect(result).to.equal("f_______-");
		});
	});

	describe('when "A" (b64) is converted to dec', function () {
		it('returns "0"', function () {
			const result = b64.from("A");
			expect(result).to.equal("0");
		});
	});

	describe('when "ZZZ" (b64) is converted to dec', function () {
		it('returns "104025"', function () {
			const result = b64.from("ZZZ");
			expect(result).to.equal("104025");
		});
	});
	
	describe('when large number is converted to dec', function () {
		it('returns correct result', function () {
			const result = b64.from("KQXbiTLPjpWIdls1xyBX4dxC8l--oa4Ih6Saqdwonae7y");
			expect(result).to.equal("304008007000907005070000600028035076960000000005000004003000000546000000890040050");
		});
	});

	describe('when string padded with As is converted to dec', function () {
		it('interprets correctly', function () {
			const result = b64.from("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAt");
			expect(result).to.equal("45");
		});
	});
});
