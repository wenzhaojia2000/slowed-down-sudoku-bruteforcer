/**
 * object which provides methods to translate decimal to base 64 and vice-versa.
 */
const b64 = {
	/**
	 * provides the mappings from octal to b64 and vice-versa. "-" and "_" are the 63rd and 64th
	 * characters, respectively.
	 * @type {object}
	 */
	dict: {
		"00": "A", "01": "B", "02": "C", "03": "D", "04": "E", "05": "F", "06": "G", "07": "H",
		"10": "I", "11": "J", "12": "K", "13": "L", "14": "M", "15": "N", "16": "O", "17": "P",
		"20": "Q", "21": "R", "22": "S", "23": "T", "24": "U", "25": "V", "26": "W", "27": "X",
		"30": "Y", "31": "Z", "32": "a", "33": "b", "34": "c", "35": "d", "36": "e", "37": "f",
		"40": "g", "41": "h", "42": "i", "43": "j", "44": "k", "45": "l", "46": "m", "47": "n",
		"50": "o", "51": "p", "52": "q", "53": "r", "54": "s", "55": "t", "56": "u", "57": "v",
		"60": "w", "61": "x", "62": "y", "63": "z", "64": "0", "65": "1", "66": "2", "67": "3",
		"70": "4", "71": "5", "72": "6", "73": "7", "74": "8", "75": "9", "76": "-", "77": "_",
		"A": "00", "B": "01", "C": "02", "D": "03", "E": "04", "F": "05", "G": "06", "H": "07",
		"I": "10", "J": "11", "K": "12", "L": "13", "M": "14", "N": "15", "O": "16", "P": "17",
		"Q": "20", "R": "21", "S": "22", "T": "23", "U": "24", "V": "25", "W": "26", "X": "27",
		"Y": "30", "Z": "31", "a": "32", "b": "33", "c": "34", "d": "35", "e": "36", "f": "37",
		"g": "40", "h": "41", "i": "42", "j": "43", "k": "44", "l": "45", "m": "46", "n": "47",
		"o": "50", "p": "51", "q": "52", "r": "53", "s": "54", "t": "55", "u": "56", "v": "57",
		"w": "60", "x": "61", "y": "62", "z": "63", "0": "64", "1": "65", "2": "66", "3": "67",
		"4": "70", "5": "71", "6": "72", "7": "73", "8": "74", "9": "75", "-": "76", "_": "77"
	},

	/**
	 * @method
	 * decodes a b64 encoded string to decimal string.
	 * @param {string} encoded - b64 encoded string.
	 * @throws {RangeError} - character not given in this.dict present in string.
	 * @returns {string} - string of the decimal number.
	 */
	from(encoded) {
		let num = 0n;
		for (const i of encoded) {
			const v = this.dict[i];
			if (v === undefined) {
				throw new RangeError(`Invalid char ${i} in string`)
			}
			num = num * 64n + BigInt(parseInt(v, 8));
		}
		return num.toString();
	},

	/**
	 * @method
	 * encodes a decimal string to a b64 string
	 * @param {string} num - string of the decimal number.
	 * @returns {string} - b64 encoded string.
	 */
	to(num) {
		let oct = BigInt(num).toString(8);
		let encoded = "";
		// pad to even length
		if (oct.length % 2 === 1) {
			oct = "0" + oct;
		}
		for (let i=0; i<oct.length/2; i++) {
			encoded += this.dict[oct[2*i] + oct[2*i+1]];
		}
		return encoded;
	}
};
