import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../../constants";
import { useAppDispatch, useAppSelector } from "../../../hooks";
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
      <div style={{ margin: "0 0 24px", padding: 0 }}>
        <h1>{t("layout.recipes")}</h1>
        <Link to={ROUTES.RECIPES_ADD}>
          <Button type="primary">{t("recipes.add-new-recipe")}</Button>
        </Link>
      </div>
      <RecipesList recipes={recipes} onDelete={onDelete} onOpen={onOpen} />
    </div>
  );
};
