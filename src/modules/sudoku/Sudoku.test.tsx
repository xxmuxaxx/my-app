import { App as AntApp, ConfigProvider } from "antd";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import "../languageProvider/i18n";
import { Sudoku } from "./Sudoku";
import { readSavedGame, type Game } from "./game";

let fixture: Game;
beforeEach(() => {
  localStorage.clear();
  const solution = Array.from({ length: 81 }, (_, i) => {
    const row = Math.floor(i / 9);
    return ((row * 3 + Math.floor(row / 3) + (i % 9)) % 9) + 1;
  });
  const puzzle = [...solution];
  puzzle[0] = puzzle[1] = puzzle[2] = 0;
  fixture = {
    puzzle,
    solution,
    board: [...puzzle],
    notes: Array.from({ length: 81 }, () => []),
    difficulty: "easy",
    seconds: 0,
    hints: 0,
  };
  localStorage.setItem("sudoku-game", JSON.stringify(fixture));
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
});
const renderGame = () =>
  render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <AntApp>
        <Sudoku />
      </AntApp>
    </ConfigProvider>,
  );

it("supports keyboard input, notes, undo and saved progress on remount", async () => {
  const user = userEvent.setup();
  const view = renderGame();
  await user.click(
    screen.getByRole("button", { name: "Строка 1, столбец 1: пусто" }),
  );
  await user.keyboard("n2");
  expect(readSavedGame()?.notes[0]).toEqual([2]);
  expect(readSavedGame()?.board[0]).toBe(0);
  await user.keyboard("n1");
  expect(readSavedGame()?.board[0]).toBe(1);
  await user.click(screen.getByRole("button", { name: "Отменить ход" }));
  expect(readSavedGame()?.board[0]).toBe(0);
  expect(readSavedGame()?.notes[0]).toEqual([2]);
  view.unmount();
  renderGame();
  expect(
    screen.getByRole("button", { name: "Строка 1, столбец 1: пусто" }),
  ).toHaveTextContent("2");
});

it("marks errors and finishes the puzzle with hints", async () => {
  const user = userEvent.setup();
  renderGame();
  await user.click(
    screen.getByRole("button", { name: "Строка 1, столбец 1: пусто" }),
  );
  await user.keyboard("9");
  await user.click(screen.getByRole("button", { name: "Проверить" }));
  expect(
    screen.getByRole("button", { name: "Строка 1, столбец 1: 9" }),
  ).toHaveAttribute("aria-invalid", "true");
  await user.click(screen.getByRole("button", { name: "Подсказка" }));
  await user.click(screen.getByRole("button", { name: "Подсказка" }));
  await user.click(screen.getByRole("button", { name: "Подсказка" }));
  expect(await screen.findByText("Судоку решено!")).toBeInTheDocument();
  expect(readSavedGame()?.board).toEqual(fixture.solution);
  expect(readSavedGame()?.hints).toBe(3);
  expect(screen.getByRole("button", { name: "Подсказка" })).toBeDisabled();
});

it("asks before replacing progress and restores the original puzzle on restart", async () => {
  const user = userEvent.setup();
  renderGame();
  await user.click(
    screen.getByRole("button", { name: "Строка 1, столбец 1: пусто" }),
  );
  await user.keyboard("1");
  await user.click(screen.getByRole("button", { name: "Начать заново" }));
  expect(
    screen.getByText("Текущий прогресс будет заменён."),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Отмена" }));
  await waitFor(() =>
    expect(
      screen.queryByText("Текущий прогресс будет заменён."),
    ).not.toBeInTheDocument(),
  );
  expect(readSavedGame()?.board[0]).toBe(1);
  await user.click(screen.getByRole("button", { name: "Начать заново" }));
  await user.click(screen.getByRole("button", { name: "Продолжить" }));
  await waitFor(() => expect(readSavedGame()?.board).toEqual(fixture.puzzle));
});
