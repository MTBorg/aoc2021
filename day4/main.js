const fs = require("fs");

// Convert the problem of playing bingo into a subarray finding problem.
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let drawn = data
    .trim()
    .split("\n")[0]
    .split(",")
    .map((num) => parseInt(num));

  let boards = data
    .trim()
    .split("\n")
    .slice(2)
    .reduce(
      (boards, line) =>
        line == ""
          ? [...boards, []]
          : [
              ...boards.slice(0, boards.length - 1),
              [
                ...boards[boards.length - 1],
                line
                  .trim()
                  .split(/\s+/)
                  .map((num) => parseInt(num)),
              ],
            ],
      [[]]
    );
  boards = boards.map((board) =>
    board.reduce(
      (prev, _, column) => [
        ...prev,
        [
          board[0][column],
          board[1][column],
          board[2][column],
          board[3][column],
          board[4][column],
        ],
      ],
      board
    )
  );

  const BOARD_SIZE = 4;
  const getUnmarked = (indices, board) =>
    [...new Set(board.flat())].filter(
      (num) => drawn.findIndex((e) => e == num) > indices[indices.length - 1]
    );
  // Get the indices of the drawn numbers that makes a line a "winnable" line
  const getWinningIndices = (line) =>
    line.map((num) => drawn.findIndex((drawnNum) => drawnNum == num));
  const calcAnswer = (unmarked, lastDrawn) =>
    unmarked.reduce((acc, num) => acc + num, 0) * lastDrawn;
  // Get the winning line for each board, sorted in ascending order using the
  // index of their lastdrawn number.
  const getBoardWinners = (boards) =>
    boards
      .map((board, i) => [
        board
          .map((line) => getWinningIndices(line).sort((a, b) => a - b))
          .sort((l1, l2) => l1[BOARD_SIZE] - l2[BOARD_SIZE])[0],
        i, // keep index so we know what board it came from
      ])
      .sort((b1, b2) => b1[0][BOARD_SIZE] - b2[0][BOARD_SIZE]);

  // part 1
  let [winnerIndices, winnerBoard] = getBoardWinners(boards)[0];
  let unmarked = getUnmarked(winnerIndices, boards[winnerBoard]);
  console.log(
    "part1: ",
    calcAnswer(unmarked, drawn[winnerIndices[winnerIndices.length - 1]])
  );

  // part 2
  [winnerIndices, winnerBoard] = getBoardWinners(boards).reverse()[0];
  unmarked = getUnmarked(winnerIndices, boards[winnerBoard]);
  console.log(
    "part2: ",
    calcAnswer(unmarked, drawn[winnerIndices[winnerIndices.length - 1]])
  );
});
