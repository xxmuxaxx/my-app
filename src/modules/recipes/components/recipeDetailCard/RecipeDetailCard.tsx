import "./recipeDetailCard.scss";

import { Divider, Image, List, Typography } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Recipe } from "../../types/interface";

type RecipeDetailCardProps = {
  recipe: Recipe;
};

export const RecipeDetailCard: FC<RecipeDetailCardProps> = ({ recipe }) => {
  const { t } = useTranslation();
  return (
    <div className="recipe-detail-card">
      <Typography.Title>{recipe.title}</Typography.Title>
      <Image src={recipe.image} width={400} />
      <Divider />
      <Typography.Paragraph>{recipe.description}</Typography.Paragraph>
      <Typography.Title level={4}>{t("recipes.products")}</Typography.Title>
      <List
        size="small"
        dataSource={recipe.products}
        renderItem={(product) => <List.Item>{product}</List.Item>}
      />
    </div>
  );
};
