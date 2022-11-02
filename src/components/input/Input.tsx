import React, { FC } from "react";
import classNames from "classnames";
import "./input.scss";

type BaseInputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "size"
>;

export type InputProps = BaseInputProps & {
  size?: "small" | "normal" | "large";
  label?: string;
};

const Input: FC<InputProps> = ({
  label,
  size = "normal",
  className,
  ...restProps
}) => {
  return (
    <input
      {...restProps}
      className={classNames("input", `input--${size}`, className)}
    />
  );
};

export { Input };
