const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  const fishes = data.split(",").map((num) => parseInt(num));

  const initialCount = fishes.reduce(
    (prevCount, curr) => ({
      ...prevCount,
      [curr]: curr in prevCount ? prevCount[curr] + 1 : 1,
    }),
    {}
  );
  const nextDay = (counts) =>
    Object.keys(counts)
      .map((key) => parseInt(key))
      .sort()
      .reduce(
        (prev, key) =>
          key == 0
            ? { ...prev, [6]: counts[0], [8]: counts[0] }
            : { ...prev, [key - 1]: (prev[key - 1] ?? 0) + counts[key] },
        {}
      );
  const simulate = (counts, i) =>
    i == 0 ? counts : simulate(nextDay(counts), i - 1);
  const calcAnswer = (counts) =>
    Object.keys(counts)
      .map((key) => parseInt(key))
      .reduce((prev, key) => prev + counts[key], 0);

  console.log("part1:", calcAnswer(simulate(initialCount, 80)));
  console.log("part2:", calcAnswer(simulate(initialCount, 256)));
});
