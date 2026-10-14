import { describe, expect, it } from "vitest";
import {
  countSolutions,
  createGame,
  enterDigit,
  isComplete,
  readSavedGame,
  type Difficulty,
} from "./game";

describe("sudoku generator", () => {
  it.each(["easy", "medium", "hard"] as Difficulty[])(
    "generates valid %s puzzles with exactly one solution",
    (difficulty) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const game = createGame(difficulty);
        expect(countSolutions(game.solution)).toBe(1);
        expect(countSolutions(game.puzzle)).toBe(1);
        expect(
          game.puzzle.every((value, i) => !value || value === game.solution[i]),
        ).toBe(true);
        expect(game.puzzle.filter(Boolean).length).toBeGreaterThanOrEqual(
          { easy: 40, medium: 32, hard: 26 }[difficulty],
        );
        expect(game.puzzle.filter(Boolean).length).toBeLessThan(50);
        expect(isComplete(game)).toBe(false);
      }
    },
  );
  it("detects contradictions and multiple solutions without modifying the input", () => {
    const board = Array(81).fill(0);
    expect(countSolutions(board)).toBe(2);
    expect(board).toEqual(Array(81).fill(0));
    board[0] = board[1] = 1;
    expect(countSolutions(board)).toBe(0);
  });
});

it("protects clues and removes matching peer notes after entering a number", () => {
  const game = createGame("easy");
  const given = game.puzzle.findIndex(Boolean);
  expect(enterDigit(game, given, 0)).toBe(game);
  const empty = game.puzzle.findIndex((n) => !n);
  const other = Math.floor(empty / 9) * 9 + (((empty % 9) + 1) % 9);
  game.notes[other] = [game.solution[empty]];
  const noted = enterDigit(game, empty, game.solution[empty], true);
  expect(noted.board[empty]).toBe(0);
  expect(noted.notes[empty]).toEqual([game.solution[empty]]);
  const entered = enterDigit(noted, empty, game.solution[empty]);
  expect(entered.notes[empty]).toEqual([]);
  expect(entered.notes[other]).toEqual([]);
  expect(isComplete({ ...game, board: [...game.solution] })).toBe(true);
});

it("rejects corrupted saves and restores valid progress", () => {
  localStorage.setItem("sudoku-game", "{bad json");
  expect(readSavedGame()).toBeNull();
  const game = createGame("easy");
  game.seconds = 42;
  localStorage.setItem("sudoku-game", JSON.stringify(game));
  expect(readSavedGame()).toEqual(game);
  game.board[game.puzzle.findIndex(Boolean)] = 0;
  localStorage.setItem("sudoku-game", JSON.stringify(game));
  expect(readSavedGame()).toBeNull();
});
