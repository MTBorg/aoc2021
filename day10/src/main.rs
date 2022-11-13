use std::vec;

fn main() {
    let input =
        std::fs::read_to_string("input.txt").expect("Should have been able to read the file");

    let corrupted: Vec<char> = input
        .lines()
        .map(|line| find_chunks(line))
        .filter(|res| res.is_err()) // filter corrupted ones
        .map(|res| res.unwrap_err())
        .collect();

    let sum = corrupted
        .iter()
        .fold(0, |sum, c| sum + get_error_points_for_char(&c));
    println!("sum: {sum}");

    let is_incomplete =
        |line: &Vec<Chunk>| line.iter().find(|Chunk(_, end, _)| end.is_none()).is_some();
    let incomplete_lines: Vec<Vec<Chunk>> = input
        .lines()
        .map(|line| find_chunks(line))
        .filter(|res| res.is_ok())
        .map(|res| res.unwrap())
        .filter(|res| is_incomplete(res))
        .collect();

    let completions: Vec<Vec<char>> = incomplete_lines
        .iter()
        .map(|line| {
            line.iter()
                .filter(|chunk| chunk.is_incomplete())
                .map(|Chunk(_, _, opener)| get_matching_close(&opener))
                .collect()
        })
        .collect();

    let mut scores: Vec<u64> = completions
        .iter()
        .map(|completion| calculate_completion_score(&completion))
        .collect();
    scores.sort();

    let winner = scores[scores.len() / 2];

    println!("{winner}");
}

#[derive(Debug, PartialEq)]
struct Chunk(usize, Option<usize>, char);

impl Chunk {
    fn is_incomplete(&self) -> bool {
        self.1.is_none()
    }
}

fn calculate_completion_score(completions: &Vec<char>) -> u64 {
    completions.iter().fold(0, |sum, completion| {
        sum * 5 + get_completion_points_for_char(&completion)
    })
}

fn find_chunks(s: &str) -> Result<Vec<Chunk>, char> {
    let mut stack: Vec<(char, usize)> = vec![];
    let mut chunks: Vec<Chunk> = vec![];
    for (i, char) in s.chars().enumerate() {
        if is_opening(&char) {
            stack.push((char, i));
            continue;
        }

        let last = stack.pop();
        let (opener, opener_idx) = last.expect("stack was empty");
        if is_matching_close(&opener, &char) {
            chunks.push(Chunk(opener_idx, Some(i), opener))
        } else {
            return Err(char);
        }
    }

    // If stack is not empty that means the line is incomplete
    if !stack.is_empty() {
        // reverse to get the incomplete chunks in the same order that the stack would be popped
        for (i, (c, _)) in stack.iter().rev().enumerate() {
            chunks.push(Chunk(i, None, *c));
        }
    }

    return Ok(chunks);
}

fn get_error_points_for_char(c: &char) -> u32 {
    match c {
        ')' => 3,
        ']' => 57,
        '}' => 1197,
        '>' => 25137,
        _ => unreachable!("unrecognized char {c}"),
    }
}

fn get_completion_points_for_char(c: &char) -> u64 {
    match c {
        ')' => 1,
        ']' => 2,
        '}' => 3,
        '>' => 4,
        _ => unreachable!("unrecognized char {c}"),
    }
}

fn is_opening(c: &char) -> bool {
    match c {
        '[' | '(' | '<' | '{' => true,
        _ => false,
    }
}

fn is_matching_close(open: &char, close: &char) -> bool {
    let m = get_matching_close(open);
    m == *close
}

fn get_matching_close(open: &char) -> char {
    match open {
        '[' => ']',
        '(' => ')',
        '{' => '}',
        '<' => '>',
        _ => unreachable!("unrecognized char {open}"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_find_chunks() {
        let input = "[]";
        let chunks = find_chunks(input);
        assert_eq!(chunks.unwrap(), vec![Chunk(0, Some(1), '[')]);

        let input = "[[]]";
        let chunks = find_chunks(input);
        assert_eq!(
            chunks.unwrap(),
            vec![Chunk(1, Some(2), '['), Chunk(0, Some(3), '['),]
        );

        let input = "<([{}])>";
        let chunks = find_chunks(input);
        assert_eq!(
            chunks.unwrap(),
            vec![
                Chunk(3, Some(4), '{'),
                Chunk(2, Some(5), '['),
                Chunk(1, Some(6), '('),
                Chunk(0, Some(7), '<')
            ]
        );

        let input = "((()";
        let chunks = find_chunks(input);
        assert_eq!(
            chunks.unwrap(),
            vec![
                Chunk(2, Some(3), '('),
                Chunk(1, None, '('),
                Chunk(0, None, '('),
            ]
        );

        let input = "[<>({}){}[([])<>]]";
        let _chunks = find_chunks(input);

        let input = "(()";
        let chunks = find_chunks(input);
        assert_eq!(
            chunks.unwrap(),
            vec![Chunk(1, Some(2), '('), Chunk(0, None, '(')]
        );

        let input = "{([(<{}[<>[]}>{[]{[(<()>";
        let chunks = find_chunks(input);
        assert_eq!(chunks, Err('}'));

        let input = "[[<[([]))<([[{}[[()]]]";
        let chunks = find_chunks(input);
        assert_eq!(chunks, Err(')'));

        let input = "[{[{({}]{}}([{[{{{}}([]";
        let chunks = find_chunks(input);
        assert_eq!(chunks, Err(']'));

        let input = "[<(<(<(<{}))><([]([]()";
        let chunks = find_chunks(input);
        assert_eq!(chunks, Err(')'));

        let input = "<{([([[(<>()){}]>(<<{{";
        let chunks = find_chunks(input);
        assert_eq!(chunks, Err('>'));
    }
}
