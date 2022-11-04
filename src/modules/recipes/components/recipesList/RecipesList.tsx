import { FC } from "react";
import { Row, Col } from "antd";
import { Recipe } from "../../types/interface";
import { RecipeCard } from "../recipeCard";

type RecipesListProps = {
  recipes: Recipe[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
};

export const RecipesList: FC<RecipesListProps> = ({
  recipes,
  onDelete,
  onOpen,
}) => {
  return (
    <Row gutter={16}>
      {recipes.map((recipe) => (
        <Col key={recipe.id} span={8}>
          <RecipeCard
            id={recipe.id}
            image={recipe.image}
            title={recipe.title}
            description={recipe.description}
            onDeleteClick={onDelete}
            onOpenClick={onOpen}
          />
        </Col>
      ))}
    </Row>
  );
};
