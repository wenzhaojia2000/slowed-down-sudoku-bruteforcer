import b64 from "../modules/b64.js";
let expect = chai.expect;

describe("b64.js", function () {
	describe("when dec is converted to b64", function () {
		function testDecToB64(val, expected) {
			return () => {
				const result = b64.to(val);
				expect(result).to.equal(expected);
			}
		}

		it("translates \"0\" correctly", testDecToB64("0", "A"));
		it("translates medium-sized number correctly", testDecToB64("262143", "___"));
		it("translates large-sized number correctly", testDecToB64("1237628137033103787049565361", "_-9876543210zyx"));
	});

	describe("when b64 is converted to dec", function () {
		function testB64ToDec(val, expected) {
			return () => {
				const result = b64.from(val);
				expect(result).to.equal(expected);
			}
		}

		it("translates \"A\" correctly", testB64ToDec("A", "0"));
		it("translates medium-sized number correctly", testB64ToDec("ZZZ", "104025"));
		it("translates large-sized number correctly", testB64ToDec("KQXbiTLPjpWIdls1xyBX4dxC8l--oa4Ih6Saqdwonae7y", "304008007000907005070000600028035076960000000005000004003000000546000000890040050"));
	});

	describe("when string padded with 0s is converted to b64", function () {
		it("interprets correctly", function () {
			const result = b64.to("000000000000000000000000000000000000000000000000000000000000000000000000000000012");
			expect(result).to.equal("M");
		});
	});

	describe("when string padded with As is converted to dec", function () {
		it("interprets correctly", function () {
			const result = b64.from("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAt");
			expect(result).to.equal("45");
		});
	});

	describe("when string is decoded then encoded", function () {
		it("returns same value", function () {
			const value = "LoremIpsumDolorSitAmetConsecteturAdipiscingElit";
			const result = b64.to(b64.from(value));
			expect(result).to.equal(value);
		});
	});

	describe("when string is encoded then decoded", function () {
		it("returns same value", function () {
			const value = "412257182553916808157881415940416";
			const result = b64.from(b64.to(value));
			expect(result).to.equal(value);
		});
	});

	describe("when number instead of string is converted to b64", function () {
		it("interprets correctly (up to MAX_SAFE_INTEGER)", function () {
			const result = b64.to(9007199254740990);
			expect(result).to.equal("f_______-");
		});
	});

	describe("when invalid dec is converted to b64", function () {
		function testInvalidDecThrows(val, err_type) {
			return () => {
				const result = () => b64.to(val);
				expect(result).to.throw(err_type);
			}
		}
	
		it("throws an error (invalid characters)", testInvalidDecThrows("248881AN0", SyntaxError));
		it("throws an error (input an object)", testInvalidDecThrows({0: "a", 1: "b"}, TypeError));
	});

	describe("when invalid b64 is converted to dec", function () {
		function testInvalidB64Throws(val, err_type) {
			return () => {
				const result = () => b64.from(val);
				expect(result).to.throw(err_type);
			}
		}
	
		it("throws an error (invalid characters)", testInvalidB64Throws("I am a fish!", SyntaxError));
		it("throws an error (input a number)", testInvalidB64Throws(145881, TypeError));
		it("throws an error (input an object)", testInvalidB64Throws({a: "n", b: "2"}, TypeError));
	});
});
