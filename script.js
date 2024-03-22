"use strict";

/**
 * Object which contains a bruteforcer instance, timer, and several useful methods for manipulating the
 * bruteforcer, timer, document grid, document buttons, etc.
 */
const sudoku = {

	/** 
	 * class instance of the bruteforcer, which stores a copy of the sudoku made by the user and contains
	 * the bruteforcing algorithm
	 * @type {Bruteforcer}
	 * @type {null} - if bruteforcer has not yet started
	 */
	bruteforcer: null,

	/**
	 * speed of iteration
	 * @type {number}
	 */
	speed: 125,

	/**
	 * ID of the setInterval timer
	 * @type {number}
	 * @type {null} - if bruteforcer has not yet started, is paused, or sudoku is finished
	 */
	timer: null,

	/**
	 * an flattened array of chars representing the sudoku from top-down left to right, with "0"
	 * meaning blank. used in generating "link to this sudoku"
	 * @type {Array}
	 */
	code_decimal: Array(81).fill("0"),

	/**
	 * an array of encoded (see b64.js) pregenerated sudokus, which can be used by the user to fill in a
	 * sudoku for them. randomly generating sudoku puzzles is not currently in the scope of this project.
	 * 
	 * these were generated by qqwing (qqwing.com), and are randomly generated expert difficulty sudokus such
	 * that the total iterations of the algorithm (any fill-in method) were relatively small <30000.
	 * @type {Array}
	 */
	pregen: [
		"RfTYJusbxdKW3gHin88orCJDad76ycBtdcWJduELLg2A",  //  2644 :  3454 : 19604
		"Pi5F8RTxc5e9lKXBDoJGU3nEj92nUoCCz8g6aZRa1UEs",  // 10022 : 18682 :  5912
		"BbD0yE7-1K9eUCQTWeJVEf4DVHk2Vvmz1bDw9cFDerEg",  //  1354 :  4004 :   724
		"KQXbiTLPjpWIdls1xyBX4dxC8l--oa4Ih6Saqdwonae7y", //  8250 :  5030 : 27500
		"DX--6oWm6R-5BvD911nFbAD4A--f0YD5QK8gNEkSWztdj", // 10551 : 23791 : 14061
		"a_SZhDLekk8A0mHLXalQBHzkc3b-yGF9WL9-QE_SUJT0A", //  5119 :  9019 :  6329
		"UP4TgvwAKfwRbEjrDcWBJVI_m1FjtZXxjwooAsx-JjuPg", // 23855 : 10625 :  4015
		"-FL3Q7YSpMCM3tftoxPTnhYJ-j1p_O03L99w68UQQA",    // 13620 :  1360 : 27120
		"Wrw82x83BEX5te0vgj0CLVBIP_mZcES15Duwj6Pq6xfQ",  //  3835 :  6965 : 18565
		"U8VsGno4HcvjvQfKRmXYURG-nKQcmewAckezNyA6FQ6n",  //  1737 : 25387 : 29967
		"PHhv6Ia1B4P7V9lHpvGZqrpHRmG1lyegO7UmnIs0cgwg",  //  3446 : 12006 :  3666
		"NB6I9E1NKS1-clvuJpmTTMAmLA4VZbN1X30hE49uc8SA",  // 15563 : 17183 :   993
		"UkXjS7jes-CV-LcnsssEYBKitbXWkebL0WHK9_tGB7RJg", //  4508 :  6228 : 16978
		"QjOd_wTwl6p30TETHjlG6Wt0yb2pILyx9esK1BSr6-h5a", //  2898 : 16678 :  2828
		"RW_5qcDPqAReiNc9RPz-XErM9Y2T07weCuqoY_egtvuA",  // 12083 : 27733 :  1793
		"H_RehXFCB6BILcz-ghcB_yLiwkpmHNjI3kH4SqjoVi6I",  // 17698 :  1438 :  3548
		"C_9KWs33ORVy1E_p2WoAxUkyZ-d8ZGCrkAR8cuxvF9e",   // 20136 : 10436 : 21946
		"Q5P52IMyRhakjnjSHgQCnDIfpZM4tXqBPT_U4Be2hvqjS", // 17876 : 29606 :  4376
		"BsGqfNS6BdZHxCG7VwKHeOdSxxIk5yRPIcwtAn9A6DOiw", //  2986 : 26346 :  3306
		"Wmjuhp2nS-ND7r6rqaDg16EuOEQFZqbQNMJNruYRgl2CA", //   959 : 15769 : 18119
		"EeubZyyw4wLGmJ2zfi1rxJK8xc-WkKP4gdyVwAl3D4",    //  6066 :  7116 :  2816
		"Gv4r1E8sE8LgqpH-bzQakVd1g4l-ucad2jhLn0nEmxjdw", //  3236 :  2766 : 15786
		"BnT3V-alVxzbuPbjLH7ccb-k0z-zQZX_TRIVr61fh2RKA", //  2376 :  3596 :  3386
		"PKbfryyX8z-zZOJCRDSlHd2Q2LLk-DHh1cc0-jAD_gcC",  // 19967 :  9437 : 24027
		"CsuUsw2ho3354spdIe9WbTQUg5AV00ljo8JA2v1JQwVnC", // 10081 :  2731 : 13471
		"P2O0ztPLBiPhPJwlev1-n2hR8wFTGQW3Cayr68l-lL7A",  //  1817 :  6027 :  2717
		"m3foJzufm43yNcPkENyFqDYA6NWDMypKNLStb1CYrsH0",  //  1614 : 18624 :  6464
		"IiK7F7tC0dQNMCNauNe_cF-I8jFwN43amDfj-G4EfM",    //  2249 : 18889 : 17279
		"KJdiO5h3ceMcyiG77JZIKacER9bh4IllzHRiKfbPlG-KA", //  4823 : 14303 :  9903
		"UYQa7qin8PtlYf2Rir7QfW1Oz6rclyuydIFGL5WPfb-4I", //  7338 : 13868 :  9118
		"RSQz3Fy4kJYKy3VHvpuI-uMTWC8rCjBD0L3yHzWqbUG6",  // 13154 : 10494 :  7184
		"TkQPQUjuRcC3xo15MH65sTo9dlEZN6mBEXzOIW9_C2-PA", //  3948 :  7218 :  5438
		"dAy7GHhr5wR1kmUsC-H0TUaoZZMtiZP4uGI2xXz5ZpwJo", //  8694 :  8074 : 19864
		"BguaL6PBa3biYjjxpfmvqx733-NLoSCzH2CH0cSH04aW",  // 19142 : 14162 : 11202
		"sDs2Peq3I8_LKIHf5FxDu7Y14NgXsn0bt7hDa227AK_A",  //  2503 :  2113 :  5873
		"NIIGQme2hJegHX-ePBHipSg5gPi_qxiIil_t-dgEwMjL",  //  9922 : 17962 : 11872
		"UPmRnMav0jhtAn7ucGPQ0x_OBTgp2QBdX-vkPCmixWBEA", // 15735 : 21635 : 16945
		"E96-4L_c8OqD_6D5x1ZAv2xk6b53jtIk0dtPhuW1WIjA",  // 15350 :  2740 : 17310
		"0p9-gZ1IzoQREqkKjzcTRlvgNX-MhqLg0CniH9dJG9Q",   // 24630 :  3150 : 20610
		"Phodjo40MJEGD3WaL30fGnuR155NLLc7ObB6ID9DKxTHu", //  5859 :  7899 :  4949
		"BC70q0E-WJji-McF_ve41zydXj9Hd_qlXD8FWkgg277rM", //  5072 : 15152 : 19912
		"NILuRjwXlioMLjf02s_uOzg8imAoyFR13RRXtf0cXz1G",  //  4445 :  5415 : 19495
		"FaafvQG2fp0NpyuIlW5Zvt8h6DaKrD0uc8v7uowa9IAA",  // 13322 : 15752 : 15052
		"Bqmb45BwZm_TdComOPJd--Xx4ERFGtxJWeoH8U6QDUK",   //  9553 :  4283 : 12153
		"Z_razkpJNu4wOpmPXQ5c9lQav0j9na9GakppHvH8DJsE",  //  8603 : 13653 :  5413
		"Tm15p7Za5kH01Bg8fnq1x0VWoBTGML0rGQBsYDG6LgZg",  // 19001 : 14261 : 18051
		"Rr9cwWC4fWWgUPplp4i9mE1A0AKeqfxcc1QxQ2ox6S",    // 21855 : 23795 : 12415
	],

	/**
	 * @method
	 * initiates a bruteforcer and starts the bruteforcing algorithm.
	 */
	start() {
		this.speed = Number(document.getElementById("speed").value);
		// clear any shown errors
		const error_list = document.getElementById("errors");
		error_list.innerHTML = "";
		
		// obtain matrix from document
		const matrix = new Array(9);
		for (let i=0; i<9; i++) {
			const row = new Array(9);
			for (let j=0; j<9; j++) {
				row[j] = Number(document.getElementById(String(i) + String(j)).value);
			}
			matrix[i] = row;
		}
		// initiate SudokuGrid with user parameters
		const fill_in_method = document.getElementById("method").value;
		try {
			this.bruteforcer = new Bruteforcer(matrix, fill_in_method);
		} catch (e) {
			// invalid sudoku --- stop and show to user
			if (e instanceof InvalidSudokuError) {
				for (const error of e.details) {
					const item = document.createElement("li");
					item.innerText = error;
					error_list.appendChild(item);
				}
			} else {
				error_list.innerHTML = e.message;
			}
			this.bruteforcer = null;
			return;
		}

		document.getElementById("skip").disabled = false;
		document.getElementById("next").disabled = true;
		document.getElementById("left-button").innerText = "Reset";
		document.getElementById("right-button").innerText = "Pause";
		// freeze cells and set classnames
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				const cell = document.getElementById(String(i) + String(j));
				cell.disabled = true;
				if (cell.value !== "") {
					cell.className = "fixed";
				} else {
					cell.className = "unfilled";
				}
			}
		}

		this.play();
	},

	/**
	 * @method
	 * plays or resumes the iteration timer, calling this.next at intervals corresponding to this.speed
	 */
	play() {
		document.getElementById("right-button").innerText = "Pause";
		document.getElementById("next").disabled = true;
		clearInterval(this.timer);
		// configure timer:
		// generally, setInterval delay is capped at once per 4ms (250Hz). if speed exceeds this, do
		// multiple iterations per interval. actual speed = number of iterations / delay
		const n_intervals = Math.ceil(this.speed/250);
		const delay = 1000 * Math.ceil(this.speed/250)/this.speed;
		this.timer = setInterval(() => this.next(n_intervals), delay);
	},

	/**
	 * @method
	 * pauses the iteration timer
	 */
	pause() {
		document.getElementById("right-button").innerText = "Resume";
		document.getElementById("next").disabled = false;
		clearInterval(this.timer);
		this.timer = null;
	},

	/**
	 * @method
	 * removes all progress on the bruteforcing of the sudoku, removing the bruteforcer property and
	 * resets to the initial sudoku.
	 */
	reset() {
		document.getElementById("skip").disabled = true;
		document.getElementById("next").disabled = true;
		document.getElementById("right-button").disabled = false;
		document.getElementById("left-button").innerText = "Clear";
		document.getElementById("right-button").innerText = "Start";
		document.getElementById("iter").value = "0";
		document.getElementById("errors").innerHTML = "";
		document.getElementById("success").innerHTML = "";
		clearInterval(this.timer);
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				const cell = document.getElementById(String(i) + String(j));
				if (cell.className === "unfilled" || cell.className === "complete") {
					cell.value = "";
				}
				cell.disabled = false;
				cell.className = "sudoku";
			}
		}
		this.bruteforcer = null;
		this.timer = null;
	},

	/**
	 * @method
	 * removes all user inputs on the sudoku, leaving a blank grid.
	 */
	clear() {
		document.getElementById("errors").innerHTML = "";
		document.getElementById("success").innerHTML = "";
		// reset "link to this sudoku"
		document.getElementById("save").href = window.location.origin + window.location.pathname;
		sudoku.code_decimal.fill("0");
		for (let i=0; i<9; i++) {
			for (let j=0; j<9; j++) {
				document.getElementById(String(i) + String(j)).value = "";
			}
		}
	},

	/**
	 * @method
	 * iterates forward in the bruteforcer, and updates the sudoku in the document with new values.
	 * @param {number} steps - number of bruteforce steps to take.
	 */
	next(steps) {
		for (let n=0; n<steps; n++){
			try {
				const [i, j, value] = this.bruteforcer.nextStep();
				document.getElementById(String(i) + String(j)).value = (value === 0) ? "" : String(value);
			} catch {
				this.finish(this.bruteforcer.status === "success");
				break;
			}
		}
		document.getElementById("iter").value = String(this.bruteforcer.iter);
	},

	/**
	 * @method
	 * declare the sudoku finished, either being a success (turns all numbers filled in by the bruteforcer from red
	 * to green) or a failure (no possible solution, shows the user an error)
	 * @param {boolean} status - either true (success) or false (failure)
	 */
	finish(status) {
		document.getElementById("right-button").innerText = "Pause";
		document.getElementById("next").disabled = true;
		document.getElementById("skip").disabled = true;
		document.getElementById("right-button").disabled = true;
		clearInterval(this.timer);
		this.timer = null;
		if (status) {
			document.getElementById("success").innerHTML = "Sudoku has been solved!";
			for (let i=0; i<9; i++) {
				for (let j=0; j<9; j++) {
					const cell = document.getElementById(String(i) + String(j));
					if (cell.className === "unfilled") {
						cell.className = "complete";
					}
				}
			}
		} else {
			document.getElementById("errors").innerHTML = "Sudoku has no solutions";
		}
	}
};

/**
 * @function
 * function to call when website is loaded.
 */
function setUp() {
	// remove enable javascript message
	const table = document.getElementById("table");
	table.innerHTML = "";
	// fetch a sudoku code from the url, if any
	const params = new URLSearchParams(window.location.search);
	let code = params.get("code");
	if (!code) {
		code = "";
	}
	try {
		sudoku.code_decimal = [...b64.from(code).padStart(81, "0")];
	} catch (e) {
		console.error(e);
	}
	// add 9x9 grid
	for (let i=0; i<9; i++) {
		const row = document.createElement("tr");
		for (let j=0; j<9; j++) {
			const cell = document.createElement("td");
			const input = document.createElement("input");
			const value = sudoku.code_decimal[9 * i + j];
			input.type = "text";
			input.className = "sudoku";
			input.pattern = "[0-9]*";
			input.inputmode = "numeric";
			input.maxLength = 1;
			input.id = String(i) + String(j);
			input.value = (value === "0") ? "" : value;
			input.addEventListener("keydown", validateKeyDown);
			input.addEventListener("input", moveNextCell);
			input.addEventListener("change", updateCode);
			cell.appendChild(input);
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	// add event listeners
	document.getElementById("left-button").addEventListener("click", leftButton);
	document.getElementById("right-button").addEventListener("click", rightButton);
	document.getElementById("next").addEventListener("click", nextStep);
	document.getElementById("skip").addEventListener("click", skipToEnd);
	document.getElementById("speed-down").addEventListener("click", speedDown);
	document.getElementById("speed-up").addEventListener("click", speedUp);
	document.getElementById("speed").addEventListener("change", changeSpeed);
	document.getElementById("copy").addEventListener("click", copyLink);
	// if the user came from a link to a pregenerated sudoku, erase it from sudoku.pregen
	const pregen = sudoku.pregen.filter((v) => {return (v !== code)});
	// add href to random pregenerated sudoku
	const search = "?code=" + pregen[Math.floor(pregen.length * Math.random())];
	document.getElementById("random").href = window.location.origin + window.location.pathname + search;
}

/**
 * @function
 * function called when user presses a button in a sudoku cell. Either user inputs a number (1-9), or
 * presses a key to move focused input. 0 can be input to skip a cell (see moveNextCell)
 * @param {KeyboardEvent} event - KeyboardEvent
 */
function validateKeyDown(event) {
	if (/[1-9]/.test(event.key)) {
		// type normally
		return;
	}
	// other key inputs
	switch (event.key) {
		case "Backspace":
		case "Delete":
		case "Tab":
			break;
		case "0":
		case "ArrowRight":
			moveNextCell(event, "r");
			break;
		case "ArrowLeft":
			moveNextCell(event, "l");
			break;
		case "ArrowUp":
			moveNextCell(event, "u");
			break;
		case "Enter":
		case "ArrowDown":
			moveNextCell(event, "d");
			break;
		default:
			// prevent this key from being input
			event.preventDefault();
	}
}

/**
 * @function
 * function called when user changes the value in an sudoku cell. if user inputs a number, move to
 * next cell in the grid. use direction to define the direction of next cell
 * @param {Event} event - event
 * @param {string} direction - defines which cell is the next (either "r" right, "l" left, "u" up, 
 * "d" down from current cell)
 */
function moveNextCell(event, direction="r") {
	const regex = /^Arrow|Enter|^\d$/;
	// interpret id as base 9 so the selection can wrap around (eg. 08 + 1 = 10)
	const selected = parseInt(event.target.id, 9);
	const diff = {"r": 1, "l": -1, "d": 9, "u": -9};
	if (regex.test(event.data) || regex.test(event.key)) {
		const next = selected + diff[direction];
		if (0 <= next && next < 81) {
			document.getElementById(next.toString(9).padStart(2, "0")).select();
		}
	}
	event.preventDefault();
}

/**
 * @function
 * updates "link to this sudoku" whenever user changes a cell in the sudoku.
 * @param {Event} event - event
 */
function updateCode(event) {
	const [i, j] = event.target.id;
	const value = event.target.value;
	sudoku.code_decimal[9 * Number(i) + Number(j)] = (value === "") ? "0" : value;
	const search = "?code=" + b64.to(sudoku.code_decimal.join(""));
	document.getElementById("save").href = window.location.origin + window.location.pathname + search;
}

/**
 * @function
 * function to call when the left button, "Reset" or "Clear", is pressed.
 */
function leftButton() {
	if (document.getElementById("left-button").innerText === "Clear") {
		sudoku.clear();
	} else {
		sudoku.reset();
	}
}

/**
 * @function
 * function to call when the rightmost button, "Start" or "Pause", is pressed.
 */
function rightButton() {
	// sudoku in progress
	if (sudoku.bruteforcer) {
		if (document.getElementById("right-button").innerText === "Resume") {
			sudoku.play();
		} else {
			sudoku.pause();
		}
		return;
	}
	// starting a new sudoku
	sudoku.start();
}

/**
 * @function
 * function to call when "Speed Down" is pressed.
 */
function speedDown() {
	const current_speed = Number(document.getElementById("speed").value);
	const new_speed = Math.max(1, 0.5 * current_speed);
	document.getElementById("speed").value = String(new_speed);
	sudoku.speed = new_speed;
	if (sudoku.bruteforcer && sudoku.timer) {
		sudoku.play();
	}
}

/**
 * @function
 * function to call when "Speed Up" is pressed.
 */
function speedUp() {
	const current_speed = Number(document.getElementById("speed").value);
	const new_speed = Math.min(2 * current_speed, 1e6);
	document.getElementById("speed").value = String(new_speed);
	sudoku.speed = new_speed;
	if (sudoku.bruteforcer && sudoku.timer) {
		sudoku.play();
	}
}

/**
 * @function
 * function called when user changes the speed of the algorithm. caps speed between 1 and 1000000.
 * @param {Event} event - Event
 */
function changeSpeed(event) {
	const new_speed = Math.max(1, Math.min(event.target.value, 1e6));
	event.target.value = String(new_speed);
	sudoku.speed = new_speed;
	if (sudoku.bruteforcer && sudoku.timer) {
		sudoku.play();
	}
}

/**
 * @function
 * function to call when "Next step" is pressed.
 */
function nextStep() {
	sudoku.next(1);
}

/**
 * @function
 * function to call when "Skip to end" is pressed.
 */
function skipToEnd() {
	sudoku.next(1e9);
}

/**
 * @function
 */
async function copyLink() {
	try {
		await navigator.clipboard.writeText(document.getElementById("save").href);
		document.getElementById("copy").innerText = "Copied!";
		setTimeout(() => {document.getElementById("copy").innerText = "Copy";}, 1000);
	} catch (e) {
		console.error(e);
	}
}

window.onload = setUp;
