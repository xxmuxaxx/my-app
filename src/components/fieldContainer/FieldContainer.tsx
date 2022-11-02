import React, { FC } from "react";
import { getRandomId } from "../../utils/getRandomId";
import "./fieldContainer.scss";

export type FieldContainerProps = {
  label?: string;
  children: React.ReactElement;
};

export const FieldContainer: FC<FieldContainerProps> = ({
  label,
  children,
}) => {
  const id = getRandomId();

  return (
    <div className="field-container">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="field-container__children">
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { id });
        })}
      </div>
    </div>
  );
};
