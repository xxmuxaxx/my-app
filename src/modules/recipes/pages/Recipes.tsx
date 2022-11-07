import { Button, PageHeader } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ROUTES } from "../../../constants";
import { RecipesList } from "../components/recipesList";
import { deleteRecipe, selectRecipes } from "../recipesSlice";

export const Recipes = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const recipes = useAppSelector(selectRecipes);

  const onDelete = (id: string) => {
    dispatch(deleteRecipe(id));
  };

  const onOpen = (id: string) => {
    navigate(id);
  };

  return (
    <div className="recipes">
      <PageHeader
        title={t("layout.recipes")}
        style={{ margin: "0 0 24px", padding: 0 }}
        extra={
          <Link to={ROUTES.RECIPES_ADD}>
            <Button type="primary">{t("recipes.add-new-recipe")}</Button>
          </Link>
        }
      />
      <RecipesList recipes={recipes} onDelete={onDelete} onOpen={onOpen} />
    </div>
  );
};
