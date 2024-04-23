# Slowed Down Sudoku Bruteforcer

**Live webpage**: https://wenzhaojia2000.github.io/sudoku/

This is a visualisation project that shows every step of a sudoku backtracking algorithm in "real time" (i.e. slowed down so you can see each iteration). This project does not aim to produce a fast or efficient sudoku solver; some sudokus can take several seconds to solve using the "skip to end" (&gg;) button. The project was inspired by [this image](https://commons.wikimedia.org/wiki/File:Sudoku_solved_by_bactracking.gif) on the "Sudoku solving algorithms" Wikipedia page.

To use, start an HTTP server in the repository directory then access the webpage using the browser. To do this in Python, you can type `python3 -m http.server` on the command line then go to `http://localhost:8000/`.

## Features

- Input your own sudoku or use a random pre-generated sudoku.
- Change the speed of iteration, pause, or skip to the end to see the solution.
- Change which sudoku cells the bruteforcer inputs first: rows first, columns first, or cells with the least possibilities first.
- Get a link to the sudoku you have input to save or share.

## Testing

Tests are stored in the `tests/` directory and are performed inside the browser using [Mocha](https://mochajs.org/) as the test framework with [Chai](https://www.chaijs.com/) as an assertion library.

To test, navigate to the `tests/` subdirectory in your browser (e.g. `http://localhost:8000/tests/`).

## To-do

- Add ability to solve "X-type" and "Window-type" sudokus.
