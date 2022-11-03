import { FC } from "react";
import { Row, Col } from "antd";
import { Recipe } from "../../types/interface";
import { RecipeCard } from "../recipeCard";

type RecipesListProps = {
  recipes: Recipe[];
};

export const RecipesList: FC<RecipesListProps> = ({ recipes }) => {
  return (
    <Row gutter={16}>
      {recipes.map((recipe) => (
        <Col key={recipe.id} span={8}>
          <RecipeCard
            image={recipe.image}
            title={recipe.title}
            description={recipe.description}
          />
        </Col>
      ))}
    </Row>
  );
};
