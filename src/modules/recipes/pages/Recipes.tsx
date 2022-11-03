import { Button, PageHeader } from "antd";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { ROUTES } from "../../../constants";
import { RecipesList } from "../components/recipesList";
import { selectRecipes } from "../recipesSlice";

export const Recipes = () => {
  const recipes = useAppSelector(selectRecipes);

  return (
    <div className="recipes">
      <PageHeader
        title="Рецепты"
        style={{ margin: "0 0 24px", padding: 0 }}
        extra={[
          <Link to={ROUTES.RECIPES_ADD}>
            <Button type="primary">Add new recipe</Button>
          </Link>,
        ]}
      />
      <RecipesList recipes={recipes} />
    </div>
  );
};
