import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectActiveRecipe, setActiveRecipeId } from "../recipesSlice";
import { RecipeDetailCard } from "../components/recipeDetailCard";
import { useTranslation } from "react-i18next";

export const RecipeDetail: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const recipe = useAppSelector(selectActiveRecipe);

  const { recipeId } = useParams();

  useEffect(() => {
    recipeId && dispatch(setActiveRecipeId(recipeId));

    return () => {
      dispatch(setActiveRecipeId(null));
    };
  }, [dispatch, recipeId]);

  useEffect(() => {
    if (recipe === undefined) {
      message.error(t("recipe-not-found"), 1.5, () => navigate(-1));
    }
  }, [navigate, recipe, t]);

  return recipe ? <RecipeDetailCard recipe={recipe} /> : null;
};
