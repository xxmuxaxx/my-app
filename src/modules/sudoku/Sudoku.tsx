import "./sudoku.scss";
import { Alert, App, Button, Select, Space, Switch, Tag } from "antd";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  createGame,
  digits,
  enterDigit,
  isComplete,
  peers,
  readSavedGame,
  type Difficulty,
  type Game,
} from "./game";

type Move = Pick<Game, "board" | "notes">;
export const Sudoku = () => {
  const { t } = useTranslation();
  const { modal, message } = App.useApp();
  const [game, setGame] = useState<Game>(
    () => readSavedGame() ?? createGame("easy"),
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(game.difficulty);
  const [selected, setSelected] = useState<number>(() =>
    game.puzzle.findIndex((n) => !n),
  );
  const [noteMode, setNoteMode] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [history, setHistory] = useState<Move[]>([]);
  const [saveError, setSaveError] = useState(false);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const completed = isComplete(game);

  useEffect(() => {
    try {
      localStorage.setItem("sudoku-game", JSON.stringify(game));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [game]);
  useEffect(() => {
    if (completed) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible")
        setGame((current) => ({ ...current, seconds: current.seconds + 1 }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [completed]);

  const apply = (next: Game) => {
    if (next === game) return;
    setHistory((moves) => [
      ...moves.slice(-99),
      { board: game.board, notes: game.notes },
    ]);
    setGame(next);
  };
  const input = (digit: number) => {
    if (selected >= 0) apply(enterDigit(game, selected, digit, noteMode));
  };
  const undo = () => {
    const move = history.at(-1);
    if (!move || completed) return;
    setGame({ ...game, ...move });
    setHistory(history.slice(0, -1));
  };
  const replaceGame = (next: Game) => {
    setGame(next);
    setSelected(next.puzzle.findIndex((n) => !n));
    setHistory([]);
    setShowErrors(false);
    setNoteMode(false);
  };
  const confirm = (action: () => void) => {
    if (
      completed ||
      (game.hints === 0 &&
        game.board.every((n, i) => n === game.puzzle[i]) &&
        game.notes.every((items) => !items.length))
    ) {
      action();
      return;
    }
    modal.confirm({
      title: t("sudoku.replaceTitle"),
      content: t("sudoku.replaceDescription"),
      okText: t("sudoku.continue"),
      cancelText: t("sudoku.cancel"),
      onOk: action,
    });
  };
  const hint = () => {
    if (completed) return;
    const index =
      selected >= 0 &&
      !game.puzzle[selected] &&
      game.board[selected] !== game.solution[selected]
        ? selected
        : game.board.findIndex((value, i) => value !== game.solution[i]);
    if (index < 0) return;
    const next = enterDigit(game, index, game.solution[index]);
    apply({ ...next, hints: game.hints + 1 });
    setSelected(index);
  };
  const check = () => {
    setShowErrors(true);
    const errors = game.board.filter(
      (value, i) => value && value !== game.solution[i],
    ).length;
    if (errors) void message.warning(t("sudoku.errors", { count: errors }));
    else
      void message.success(t(completed ? "sudoku.won" : "sudoku.correctSoFar"));
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
      }
      return;
    }
    if (/^[1-9]$/.test(event.key)) {
      event.preventDefault();
      input(Number(event.key));
    } else if (["Backspace", "Delete", "0"].includes(event.key)) {
      event.preventDefault();
      input(0);
    } else if (event.key.toLowerCase() === "n") {
      event.preventDefault();
      setNoteMode(!noteMode);
    } else {
      const row = Math.floor(selected / 9);
      const col = selected % 9;
      const next = {
        ArrowLeft: row * 9 + Math.max(0, col - 1),
        ArrowRight: row * 9 + Math.min(8, col + 1),
        ArrowUp: Math.max(0, row - 1) * 9 + col,
        ArrowDown: Math.min(8, row + 1) * 9 + col,
      }[event.key];
      if (next !== undefined) {
        event.preventDefault();
        setSelected(next);
        cells.current[next]?.focus();
      }
    }
  };
  const filled = game.board.filter(Boolean).length;
  const clock = `${Math.floor(game.seconds / 60)
    .toString()
    .padStart(2, "0")}:${(game.seconds % 60).toString().padStart(2, "0")}`;

  return (
    <section className="sudoku">
      <h1>{t("layout.sudoku")}</h1>
      <div className="sudoku__toolbar">
        <Select
          aria-label={t("sudoku.difficulty")}
          value={difficulty}
          onChange={setDifficulty}
          style={{ width: 160 }}
          options={(["easy", "medium", "hard"] as Difficulty[]).map(
            (value) => ({ value, label: t(`sudoku.${value}`) }),
          )}
        />
        <Button
          type="primary"
          onClick={() => confirm(() => replaceGame(createGame(difficulty)))}
        >
          {t("sudoku.newGame")}
        </Button>
        <Button
          onClick={() =>
            confirm(() =>
              replaceGame({
                ...game,
                board: [...game.puzzle],
                notes: Array.from({ length: 81 }, () => []),
                seconds: 0,
                hints: 0,
              }),
            )
          }
        >
          {t("sudoku.restart")}
        </Button>
        <Tag>{t(`sudoku.${game.difficulty}`)}</Tag>
        <span>
          {t("sudoku.time")}: {clock}
        </span>
        <span>
          {t("sudoku.filled")}: {filled}/81
        </span>
      </div>
      {saveError && (
        <Alert type="error" showIcon title={t("sudoku.saveError")} />
      )}
      {completed && (
        <Alert
          type="success"
          showIcon
          title={t("sudoku.won")}
          description={t("sudoku.result", { time: clock, hints: game.hints })}
          style={{ marginBottom: 20 }}
        />
      )}
      <div className="sudoku__workspace">
        <div
          className="sudoku__board"
          role="group"
          aria-label={t("sudoku.board")}
          onKeyDown={onKey}
        >
          {game.board.map((value, index) => {
            const given = Boolean(game.puzzle[index]);
            const error =
              showErrors && value !== 0 && value !== game.solution[index];
            const classes = [
              "sudoku__cell",
              given && "given",
              peers(selected, index) && "related",
              value && value === game.board[selected] && "same",
              index === selected && "selected",
              error && "error",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={index}
                type="button"
                ref={(element) => {
                  cells.current[index] = element;
                }}
                className={classes}
                tabIndex={index === selected ? 0 : -1}
                aria-pressed={index === selected}
                aria-label={
                  t("sudoku.cell", {
                    row: Math.floor(index / 9) + 1,
                    col: (index % 9) + 1,
                    value: value || t("sudoku.empty"),
                  }) + (given ? `, ${t("sudoku.given")}` : "")
                }
                aria-invalid={error || undefined}
                onClick={() => setSelected(index)}
              >
                {value || (
                  <span className="sudoku__notes">
                    {digits.map((digit) => (
                      <span key={digit}>
                        {game.notes[index].includes(digit) ? digit : "\u00a0"}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <aside className="sudoku__controls">
          <Space>
            <Switch
              checked={noteMode}
              disabled={completed}
              onChange={setNoteMode}
              aria-label={t("sudoku.notes")}
            />
            <span>{t("sudoku.notes")}</span>
          </Space>
          <div className="sudoku__digits">
            {digits.map((digit) => (
              <Button
                key={digit}
                size="large"
                disabled={
                  completed || selected < 0 || Boolean(game.puzzle[selected])
                }
                onClick={() => input(digit)}
              >
                {digit}
              </Button>
            ))}
          </div>
          <Space wrap>
            <Button
              disabled={
                completed || selected < 0 || Boolean(game.puzzle[selected])
              }
              onClick={() => input(0)}
            >
              {t("sudoku.erase")}
            </Button>
            <Button disabled={completed || !history.length} onClick={undo}>
              {t("sudoku.undo")}
            </Button>
            <Button disabled={completed} onClick={hint}>
              {t("sudoku.hint")}
            </Button>
            <Button onClick={check}>{t("sudoku.check")}</Button>
          </Space>
          <p>
            {t("sudoku.hints")}: {game.hints}
          </p>
          <p className="sudoku__help">{t("sudoku.rules")}</p>
          <p className="sudoku__help">{t("sudoku.keyboard")}</p>
          <p className="sudoku__help">{t("sudoku.saved")}</p>
        </aside>
      </div>
    </section>
  );
};
