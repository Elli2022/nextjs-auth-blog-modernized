import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  "aria-label"?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  "aria-label": ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
