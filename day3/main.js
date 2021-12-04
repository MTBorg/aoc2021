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
  console.log("part1: ", gamma * epsilon);

  // part 2

  // separate array of binary nums into two arrays based on bit at position i.
  let separate = (nums, i) =>
    nums.reduce(
      ([zeroes, ones], curr) =>
        curr[i] == "0" ? [[...zeroes, curr], ones] : [zeroes, [...ones, curr]],
      [[], []]
    );

  let filterOxygen = (nums, i = 0) => {
    let [zeroes, ones] = separate(nums, i);
    return nums.length == 1
      ? nums[0].join("")
      : zeroes.length > ones.length
      ? filterOxygen(zeroes, i + 1)
      : filterOxygen(ones, i + 1);
  };
  let filterCO2 = (nums, i = 0) => {
    let [zeroes, ones] = separate(nums, i);
    return nums.length == 1
      ? nums[0].join("")
      : zeroes.length > ones.length
      ? filterCO2(ones, i + 1)
      : filterCO2(zeroes, i + 1);
  };

  let oxygen = filterOxygen(bins);
  let co2 = filterCO2(bins);

  console.log("part2: ", parseInt(oxygen, 2) * parseInt(co2, 2));
});
