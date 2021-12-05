const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let input = data
    .trim()
    .split("\n")
    .map((line) => [line.split(" ")[0], line.split(" ")[2]])
    .map((line) => ({
      x1: parseInt(line[0].split(",")[0]),
      y1: parseInt(line[0].split(",")[1]),
      x2: parseInt(line[1].split(",")[0]),
      y2: parseInt(line[1].split(",")[1]),
    }));

  const isHorizontal = (line) => line.y1 == line.y2;
  const isVertical = (line) => line.x1 == line.x2;
  const mark = (x, y, diag) => {
    const key = `${x},${y}`;
    diag[key] = key in diag ? diag[key] + 1 : 1;
    return diag;
  };
  const calcAnswer = (diag) =>
    Object.keys(diag).filter((pos) => diag[pos] > 1).length;

  const fillInLine = (line, diag) =>
    line.x1 == line.x2 && line.y1 == line.y2
      ? mark(line.x1, line.y1, diag)
      : fillInLine(
          {
            ...line,
            x1:
              line.x1 == line.x2
                ? line.x1
                : line.x1 < line.x2
                ? line.x1 + 1
                : line.x1 - 1,
            y1:
              line.y1 == line.y2
                ? line.y1
                : line.y1 < line.y2
                ? line.y1 + 1
                : line.y1 - 1,
          },
          mark(line.x1, line.y1, diag)
        );

  // part 1
  let lines = input.filter((line) => isHorizontal(line) || isVertical(line));
  let diag = lines.reduce((prev, line) => fillInLine(line, prev), {});
  console.log("part1: ", calcAnswer(diag));

  // part 2
  lines = input;
  diag = lines.reduce((prev, line) => fillInLine(line, prev), {});
  console.log("part2: ", calcAnswer(diag));
});
