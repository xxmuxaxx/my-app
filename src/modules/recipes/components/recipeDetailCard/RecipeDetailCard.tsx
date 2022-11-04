import { Image, Typography, List, Divider } from "antd";
import { FC } from "react";
import { Recipe } from "../../types/interface";
import "./recipeDetailCard.scss";

type RecipeDetailCardProps = {
  recipe: Recipe;
};

export const RecipeDetailCard: FC<RecipeDetailCardProps> = ({ recipe }) => {
  return (
    <div className="recipe-detail-card">
      <Typography.Title>{recipe.title}</Typography.Title>
      <Image src={recipe.image} width={400} />
      <Divider />
      <Typography.Paragraph>{recipe.description}</Typography.Paragraph>
      <Typography.Title level={4}>Продукты</Typography.Title>
      <List
        size="small"
        dataSource={recipe.products}
        renderItem={(product) => <List.Item>{product}</List.Item>}
      />
    </div>
  );
};