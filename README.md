# Slowed Down Sudoku Bruteforcer

**Live webpage**: https://wenzhaojia2000.github.io/sudoku/

This is a visualisation project that shows every step of a sudoku backtracking algorithm in "real time" (i.e. slowed down so you can see each iteration). This project does not aim to produce a fast or efficient sudoku solver; some sudokus can take several seconds to solve using the "skip to end" (+∞) button. The project was inspired by [this image](https://commons.wikimedia.org/wiki/File:Sudoku_solved_by_bactracking.gif) on the "Sudoku solving algorithms" Wikipedia page.

To use, simply open `index.html` in your browser.

## To-do

- Add an import/export tool that works by saving the sudoku in the URL and using `URLSearchParams` to retrieve them.
- Add ability to solve "X-type" and "Window-type" sudokus.
- Add ability to customise fill-in order. Random order and "efficient" order (cells with fewer possibilities are filled in first) are planned.
- Prevent freezing when pressing the "skip to end" (+∞) button for sudokus that take a long time to solve with the algorithm using asynchronous programming.
