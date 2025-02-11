// components/IconButton.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
}) => {
  const baseStyles =
    "flex items-center justify-center rounded-full transition-all";

  const sizeStyles = {
    small: "p-2",
    medium: "p-3",
    large: "p-4",
  };

  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      <Icon size={30} />
    </button>
  );
};

export default IconButton;
