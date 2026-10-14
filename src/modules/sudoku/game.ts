export type Difficulty = "easy" | "medium" | "hard";
export type Game = {
  puzzle: number[];
  solution: number[];
  board: number[];
  notes: number[][];
  difficulty: Difficulty;
  seconds: number;
  hints: number;
};
export const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const rowOf = (index: number) => Math.floor(index / 9);
export const colOf = (index: number) => index % 9;
export function peers(a: number, b: number): boolean {
  return (
    a !== b &&
    (rowOf(a) === rowOf(b) ||
      colOf(a) === colOf(b) ||
      (Math.floor(rowOf(a) / 3) === Math.floor(rowOf(b) / 3) &&
        Math.floor(colOf(a) / 3) === Math.floor(colOf(b) / 3)))
  );
}
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function countSolutions(input: number[], limit = 2): number {
  const board = [...input];
  if (
    board.length !== 81 ||
    board.some(
      (value, index) =>
        !Number.isInteger(value) ||
        value < 0 ||
        value > 9 ||
        (value !== 0 &&
          board.some((other, i) => peers(index, i) && value === other)),
    )
  )
    return 0;
  function search(): number {
    let cell = -1;
    let options: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (board[i]) continue;
      const candidates = digits.filter(
        (digit) => !board.some((value, j) => peers(i, j) && value === digit),
      );
      if (!candidates.length) return 0;
      if (cell < 0 || candidates.length < options.length) {
        cell = i;
        options = candidates;
      }
      if (options.length === 1) break;
    }
    if (cell < 0) return 1;
    let count = 0;
    for (const value of options) {
      board[cell] = value;
      count += search();
      if (count >= limit) break;
    }
    board[cell] = 0;
    return Math.min(count, limit);
  }
  return search();
}
export function createGame(difficulty: Difficulty): Game {
  const groups = () =>
    shuffle([0, 1, 2]).flatMap((group) =>
      shuffle([0, 1, 2]).map((offset) => group * 3 + offset),
    );
  const rows = groups();
  const cols = groups();
  const numbers = shuffle(digits);
  const solution = rows.flatMap((row) =>
    cols.map((col) => numbers[(row * 3 + Math.floor(row / 3) + col) % 9]),
  );
  const puzzle = [...solution];
  const target = { easy: 40, medium: 32, hard: 26 }[difficulty];
  let clues = 81;
  for (const index of shuffle(Array.from({ length: 81 }, (_, i) => i))) {
    if (clues <= target) break;
    const value = puzzle[index];
    puzzle[index] = 0;
    if (countSolutions(puzzle) === 1) clues--;
    else puzzle[index] = value;
  }
  return {
    puzzle,
    solution,
    board: [...puzzle],
    notes: Array.from({ length: 81 }, () => []),
    difficulty,
    seconds: 0,
    hints: 0,
  };
}
export function isComplete(game: Game): boolean {
  return game.board.every((value, i) => value === game.solution[i]);
}
export function enterDigit(
  game: Game,
  index: number,
  value: number,
  noteMode = false,
): Game {
  if (
    index < 0 ||
    index >= 81 ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > 9 ||
    game.puzzle[index] ||
    isComplete(game)
  )
    return game;
  if (noteMode && value && game.board[index]) return game;
  const board = [...game.board];
  const notes = game.notes.map((items) => [...items]);
  if (noteMode && value && !board[index]) {
    notes[index] = notes[index].includes(value)
      ? notes[index].filter((digit) => digit !== value)
      : [...notes[index], value].sort();
  } else {
    board[index] = value;
    notes[index] = [];
    if (value)
      notes.forEach((items, i) => {
        if (peers(index, i))
          notes[i] = items.filter((digit) => digit !== value);
      });
  }
  return { ...game, board, notes };
}
export function readSavedGame(): Game | null {
  try {
    const value: Game = JSON.parse(
      localStorage.getItem("sudoku-game") ?? "null",
    );
    const validBoard = (board: number[]) =>
      Array.isArray(board) &&
      board.length === 81 &&
      board.every((n) => Number.isInteger(n) && n >= 0 && n <= 9);
    if (
      !value ||
      !validBoard(value.puzzle) ||
      !validBoard(value.solution) ||
      !validBoard(value.board) ||
      value.solution.includes(0) ||
      countSolutions(value.solution) !== 1 ||
      !value.puzzle.every(
        (n, i) => !n || (n === value.solution[i] && n === value.board[i]),
      ) ||
      !Array.isArray(value.notes) ||
      value.notes.length !== 81 ||
      !value.notes.every(
        (notes) =>
          Array.isArray(notes) && notes.every((n) => digits.includes(n)),
      ) ||
      !["easy", "medium", "hard"].includes(value.difficulty) ||
      !Number.isInteger(value.seconds) ||
      value.seconds < 0 ||
      !Number.isInteger(value.hints) ||
      value.hints < 0
    )
      return null;
    return value;
  } catch {
    return null;
  }
}
