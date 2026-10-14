import "./home.scss";
import {
  CheckSquareOutlined,
  ReadOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Card, Empty, Progress, Tag } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";
import { useAppSelector } from "../../hooks";
import { selectTodos } from "../../modules/todoList/todoListSlice";
import { selectRecipes } from "../../modules/recipes/recipesSlice";
import { isComplete, readSavedGame } from "../../modules/sudoku/game";

export const Home = () => {
  const { t } = useTranslation();
  const todos = useAppSelector(selectTodos);
  const recipes = useAppSelector(selectRecipes);
  const active = todos.filter((todo) => !todo.isCompleted);
  const completed = todos.length - active.length;
  const game = readSavedGame();
  const filled = game?.board.filter(Boolean).length ?? 0;
  const cards = [
    {
      key: "tasks",
      title: t("layout.todo-list"),
      icon: <CheckSquareOutlined />,
      count: active.length,
      caption: t("home.activeTasks"),
      description: t("home.tasksDescription"),
      to: ROUTES.TODO_LIST,
      action: t("home.openTasks"),
    },
    {
      key: "recipes",
      title: t("layout.recipes"),
      icon: <ReadOutlined />,
      count: recipes.length,
      caption: t("home.savedRecipes"),
      description: t("home.recipesDescription"),
      to: ROUTES.RECIPES,
      action: t("home.openRecipes"),
    },
    {
      key: "sudoku",
      title: t("layout.sudoku"),
      icon: <AppstoreOutlined />,
      count: game ? `${filled}/81` : "9 × 9",
      caption: game
        ? t(isComplete(game) ? "sudoku.won" : "home.gameProgress")
        : t("home.puzzle"),
      description: t("home.sudokuDescription"),
      to: ROUTES.SUDOKU,
      action: t(
        game && !isComplete(game) ? "home.resumeGame" : "home.openSudoku",
      ),
    },
  ];

  return (
    <section className="home">
      <header className="home__intro">
        <Tag color="blue">{t("home.personalSpace")}</Tag>
        <h1>{t("layout.home")}</h1>
        <p>{t("home.subtitle")}</p>
      </header>
      <div className="home__cards">
        {cards.map((card) => (
          <Card key={card.key} className={`home__card home__card--${card.key}`}>
            <div className="home__icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <div className="home__count">{card.count}</div>
            <div className="home__caption">{card.caption}</div>
            <p>{card.description}</p>
            <Link className="home__link" to={card.to}>
              {card.action} <ArrowRightOutlined aria-hidden="true" />
            </Link>
          </Card>
        ))}
      </div>
      <div className="home__details">
        <Card
          title={t("home.nextTasks")}
          extra={<Link to={ROUTES.TODO_LIST}>{t("home.allTasks")}</Link>}
        >
          {active.length ? (
            <ul className="home__tasks">
              {active.slice(0, 5).map((todo) => (
                <li key={todo.id}>
                  <span className="home__dot" />
                  <Link to={ROUTES.TODO_LIST}>{todo.message}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t(todos.length ? "home.allDone" : "home.noTasks")}
            />
          )}
          {todos.length > 0 && (
            <div className="home__completion">
              <span>
                {t("home.completedTasks", {
                  done: completed,
                  total: todos.length,
                })}
              </span>
              <Progress
                percent={Math.round((completed / todos.length) * 100)}
                size="small"
              />
            </div>
          )}
        </Card>
        <Card title={t("home.quickActions")}>
          <div className="home__shortcuts">
            <Link to={ROUTES.RECIPES_ADD}>
              {t("recipes.add-new-recipe")} <ArrowRightOutlined aria-hidden="true" />
            </Link>
            <Link to={ROUTES.THEME_SETTINGS}>
              {t("home.customizeTheme")} <ArrowRightOutlined aria-hidden="true" />
            </Link>
          </div>
          <p className="home__storage">{t("home.storageDescription")}</p>
        </Card>
      </div>
    </section>
  );
};
