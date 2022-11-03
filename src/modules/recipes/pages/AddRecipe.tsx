import { PageHeader } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AddRecipeForm } from "../components/addRecipeForm";
import {
  addRecipe,
  selectAddRecipeFields,
  setAddRecipeFields,
} from "../recipesSlice";
import { AddRecipeDTO } from "../types/interface";

export const AddRecipe = () => {
  const dispatch = useAppDispatch();
  const addRecipeFields = useAppSelector(selectAddRecipeFields);

  const onFinish = () => {
    dispatch(addRecipe());
  };

  const onChange = (values: AddRecipeDTO) => {
    dispatch(setAddRecipeFields(values));
  };

  return (
    <div className="add-recipe">
      <PageHeader
        title="Добавление нового рецепта"
        style={{ margin: "0 0 24px", padding: 0 }}
      />
      <AddRecipeForm
        initialValues={addRecipeFields}
        width={500}
        onFinish={onFinish}
        onChange={onChange}
      />
    </div>
  );
};
