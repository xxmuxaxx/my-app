import { FC } from "react";
import { Card } from "antd";
import "./recipeCard.scss";

const { Meta } = Card;

type RecipeCardProps = {
  image: string;
  title: string;
  description: string;
};

export const RecipeCard: FC<RecipeCardProps> = ({
  image,
  title,
  description,
}) => {
  return (
    <Card cover={<img src={image} alt={title} />}>
      <Meta title={title} description={description} />
    </Card>
  );
};
