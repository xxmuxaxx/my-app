import { App } from "antd";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RecipeDetailCard } from "../components/recipeDetailCard";
import { selectActiveRecipe, setActiveRecipeId } from "../recipesSlice";

export const RecipeDetail: FC = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const recipe = useAppSelector(selectActiveRecipe);

  const { recipeId } = useParams();

  useEffect(() => {
    if (recipeId) dispatch(setActiveRecipeId(recipeId));

    return () => {
      dispatch(setActiveRecipeId(null));
    };
  }, [dispatch, recipeId]);

  useEffect(() => {
    if (recipe === undefined) {
      message.error(t("recipes.recipe-not-found"), 1.5, () => navigate(-1));
    }
  }, [message, navigate, recipe, t]);

  return recipe ? <RecipeDetailCard recipe={recipe} /> : null;
};
