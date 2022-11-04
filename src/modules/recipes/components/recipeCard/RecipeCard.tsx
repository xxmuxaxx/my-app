import { FC, MouseEvent } from "react";
import { Button, Card, Tooltip } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import "./recipeCard.scss";

const { Meta } = Card;

type RecipeCardProps = {
  id: string;
  image: string;
  title: string;
  description: string;
  onDeleteClick: (id: string) => void;
  onOpenClick: (id: string) => void;
};

export const RecipeCard: FC<RecipeCardProps> = ({
  id,
  image,
  title,
  description,
  onDeleteClick,
  onOpenClick,
}) => {
  const onButtonClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onDeleteClick(id);
  };

  const onCardClick = () => {
    onOpenClick(id);
  };

  return (
    <Card
      className="recipe-card"
      cover={<img src={image} alt={title} />}
      hoverable
      onClick={onCardClick}
    >
      <Meta title={title} description={description} />
      <div className="recipe-card__actions">
        <Tooltip title="Удалить">
          <Button
            type="primary"
            danger
            icon={<DeleteFilled />}
            onClick={onButtonClick}
          />
        </Tooltip>
      </div>
    </Card>
  );
};
