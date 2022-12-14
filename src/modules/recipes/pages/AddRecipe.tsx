import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../../hooks";
import { AddRecipeForm } from "../components/addRecipeForm";
import {
  addRecipe,
  selectAddRecipeFields,
  setAddRecipeFields,
} from "../recipesSlice";
import { AddRecipeDTO } from "../types/interface";

export const AddRecipe = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const addRecipeFields = useAppSelector(selectAddRecipeFields);

  const onFinish = () => {
    dispatch(addRecipe());
  };

  const onChange = (values: AddRecipeDTO) => {
    dispatch(setAddRecipeFields(values));
  };

  return (
    <div className="add-recipe">
      <div style={{ margin: "0 0 24px", padding: 0 }}>
        <h1>{t("layout.recipe-add")}</h1>
      </div>

      <AddRecipeForm
        initialValues={addRecipeFields}
        width={500}
        onFinish={onFinish}
        onChange={onChange}
      />
    </div>
  );
};
