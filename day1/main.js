const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let measurements = data
    .trim()
    .split("\n")
    .map((line) => Number(line));

  // part 1
  let res1 = measurements.reduce(
    (count, curr, i) => (curr > measurements[i - 1] ? count + 1 : count),
    0
  );
  console.log(res1);

  // part 2
  let res2 = measurements.reduce(
    (count, curr, i) => (measurements[i + 3] > curr ? count + 1 : count), // Skip the overlap in the sliding windows
    0
  );
  console.log(res2);
});
