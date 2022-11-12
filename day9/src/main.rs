use std::{fs, vec};

const WIDTH: usize = 100;
const HEIGHT: usize = 100;

fn main() {
    let contents = fs::read_to_string("input.txt").expect("Should have been able to read the file");

    let chars: Vec<Vec<u32>> = contents
        .split_whitespace()
        .map(|line| line.chars().map(|c| c.to_digit(10).unwrap()).collect())
        .collect();

    // Part 1
    let mut low_points: Vec<(usize, usize)> = vec![];

    for (y, line) in chars.iter().enumerate() {
        for (x, char) in line.iter().enumerate() {
            let adjacent = get_adjacent(x, y);
            if let None = adjacent
                .into_iter()
                .find(|&(nx, ny)| chars[ny][nx] <= *char)
            {
                low_points.push((x, y));
            }
        }
    }

    let sum = low_points
        .iter()
        .fold(0, |sum, &(x, y)| sum + chars[y][x] + 1);

    println!("{sum}");

    // Part 2
    let basins: Vec<Vec<(usize, usize)>> = low_points
        .iter()
        .map(|&(x, y)| find_basin(&chars, x, y, vec![]))
        .collect();
    let mut basin_sizes: Vec<usize> = basins.iter().map(|basin| basin.len()).collect();
    basin_sizes.sort();
    basin_sizes.reverse();

    let product = basin_sizes
        .iter()
        .take(3)
        .fold(1, |product, size| product * size);
    println!("{product}");
}

fn find_basin(
    chars: &Vec<Vec<u32>>,
    x: usize,
    y: usize,
    mut visited: Vec<(usize, usize)>,
) -> Vec<(usize, usize)> {
    if visited.contains(&(x, y)) {
        return visited;
    }

    visited.push((x, y));
    let adjacent = get_adjacent(x, y);
    let above: Vec<(usize, usize)> = adjacent
        .into_iter()
        .filter(|&(nx, ny)| chars[ny][nx] < 9 && chars[ny][nx] > chars[y][x])
        .collect();
    for (x, y) in above.into_iter() {
        visited = find_basin(chars, x, y, visited);
    }
    return visited;
}

fn get_adjacent(x: usize, y: usize) -> Vec<(usize, usize)> {
    let mut res = vec![];
    if x > 0 {
        res.push((x - 1, y));
    }
    if x < WIDTH - 1 {
        res.push((x + 1, y));
    }
    if y > 0 {
        res.push((x, y - 1));
    }
    if y < HEIGHT - 1 {
        res.push((x, y + 1));
    }

    return res;
}
