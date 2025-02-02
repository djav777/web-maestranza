import React, { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  text: ReactNode;
  type?: undefined | "primary" | "danger";
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  type,
  className,
  disabled,
}) => {
  let buttonClass =
    "py-2 px-4 mx-2 border border-gray-400 shadow bg-slate-100 hover:bg-slate-300 rounded-md";

  if (type === "primary") {
    buttonClass =
      "py-2 px-4 border border-blue-700 bg-blue-500 hover:bg-blue-700 rounded-md text-white";
  } else if (type === "danger") {
    buttonClass = "button danger";
  }

  const combinedClass = `${buttonClass} ${className || ""}`;

  return (
    <button disabled={disabled} className={combinedClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
