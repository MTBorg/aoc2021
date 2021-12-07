const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let input = data.split(",").map((num) => parseInt(num));

  // part 1
  // solution similar for part 2 could be used for this, but this is more
  // effective
  let sortedCrabs = [...input].sort((a, b) => a - b);
  const sumCrabs = (crabs) => crabs.reduce((acc, curr) => acc + curr, 0);
  const consecRight = (crabs, i) =>
    i >= crabs.length - 1 || crabs[i + 1] != crabs[i]
      ? 0
      : 1 + consecRight(crabs, i + 1);
  const consecLeft = (crabs, i) =>
    i < 0 || crabs[i - 1] != crabs[i] ? 0 : 1 + consecLeft(crabs, i - 1);
  const crabsToTheLeft = (crabs, i) => i - consecLeft(crabs, i);
  const crabsToTheRight = (crabs, i) =>
    crabs.length - 1 - i - consecRight(crabs, i);

  const getCosts = (crabs) =>
    crabs.reduce(
      (prev, curr, i) =>
        i == 0
          ? [sumCrabs(crabs)]
          : [
              ...prev,
              prev[i - 1] +
                crabsToTheLeft(crabs, i) * (curr - crabs[i - 1]) -
                (crabsToTheRight(crabs, i) + 1 + consecRight(crabs, i)) *
                  (curr - crabs[i - 1]),
            ],
      []
    );
  const lowestCost = [...getCosts(sortedCrabs)].sort((a, b) => a - b)[0];
  console.log("part1: ", lowestCost);

  // part 2
  const sum = (i) => (i * (i + 1)) / 2;
  const calcCost = (crabs, pos) =>
    crabs.reduce((prev, curr) => prev + sum(Math.abs(curr - pos)), 0);

  const part2 = (crabs, pos) => [
    calcCost(crabs, pos),
    ...(pos == 0 ? [] : part2(crabs, pos - 1)),
  ];

  const answer = part2(input, Math.max(...input));
  console.log("part2: ", answer.sort((a, b) => a - b)[0]);
});
