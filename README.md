# Slowed Down Sudoku Bruteforcer

**Live webpage**: https://wenzhaojia2000.github.io/sudoku/

This is a visualisation project that shows every step of a sudoku backtracking algorithm in "real time" (i.e. slowed down so you can see each iteration). This project does not aim to produce a fast or efficient sudoku solver; some sudokus can take several seconds to solve using the "skip to end" (+∞) button. The project was inspired by [this image](https://commons.wikimedia.org/wiki/File:Sudoku_solved_by_bactracking.gif) on the "Sudoku solving algorithms" Wikipedia page.

To use, simply open `index.html` in your browser.

## Features

- Input your own sudoku or use a random pre-generated sudoku.
- Change the speed of iteration, pause, or skip to the end to see the solution.
- Change which sudoku cells the bruteforcer inputs first: rows first, columns first, or cells with the least possibilities first.
- Get a link to the sudoku you have input to save or share.

## To-do

- Add tests for `bruteforcer.js` and `b64.js`.
- Add ability to solve "X-type" and "Window-type" sudokus.
- Prevent freezing when pressing the "skip to end" (+∞) button for sudokus that take a long time to solve with the algorithm using asynchronous programming.
