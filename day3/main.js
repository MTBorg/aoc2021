const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let bins = data
    .trim()
    .split("\n")
    .map((line) => line.split(""));
  // console.log(bins);

  // part 1
  let [gamma, epsilon] = bins
    .reduce(
      (counts, binNum) =>
        binNum.reduce(
          (prevCounts, bit, i) =>
            bit == "1"
              ? [
                  ...prevCounts.slice(0, i),
                  prevCounts[i] + 1,
                  ...prevCounts.slice(i + 1),
                ]
              : prevCounts,
          counts
        ),
      Array(12).fill(0)
    )
    .reduce(
      ([gamma, epsilon], count) =>
        count > bins.length / 2
          ? [
              [...gamma, "1"],
              [...epsilon, "0"],
            ]
          : [
              [...gamma, "0"],
              [...epsilon, "1"],
            ],
      [Array(0), Array(0)]
    )
    .map((rate) => rate.join(""))
    .map((rate) => parseInt(rate, 2));
  console.log(gamma * epsilon);

  // // part 2
  // let res2 = measurements.reduce(
  //   (count, curr, i) => (measurements[i + 3] > curr ? count + 1 : count), // Skip the overlap in the sliding windows
  //   0
  // );
  // console.log(res2);
});
