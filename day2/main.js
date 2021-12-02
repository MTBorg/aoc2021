const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let moves = data
    .trim()
    .split("\n")
    .map((line) => line.split(" "))
    .map(([dir, mag]) => [dir, Number(mag)]);

  // part 1
  let res1 = moves.reduce(
    ([x, y], [dir, mag]) => [
      dir == "forward" ? x + mag : x,
      dir == "down" ? y + mag : dir == "up" ? y - mag : y,
    ],
    [0, 0]
  );
  console.log(res1, res1[0] * res1[1]);

  // part 2
  let res2 = moves.reduce(
    ([x, y, aim], [dir, mag]) => [
      dir == "forward" ? x + mag : x,
      dir == "forward" ? y + aim * mag : y,
      dir == "down" ? aim + mag : dir == "up" ? aim - mag : aim,
    ],
    [0, 0, 0]
  );
  console.log(res2, res2[0] * res2[1]);
});
