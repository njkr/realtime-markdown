import React from "react";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  glow?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  glow = false,
}) => {
  const sizeStyles = {
    small: "p-2",
    medium: "p-3",
    large: "p-4",
  };

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-900 text-white hover:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  // Define custom inline keyframes via Tailwind's arbitrary values
  const animationClass = "[animation:spin_4s_linear_infinite]";

  return (
    <div className="relative inline-flex group">
      {glow && (
        <div
          className={clsx(
            "absolute -inset-px rounded-full blur-md opacity-70 z-0",
            "bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]",
            animationClass,
            "group-hover:opacity-100 group-hover:-inset-1 transition-all duration-1000"
          )}
        />
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          "relative z-10 flex items-center justify-center rounded-full transition-all",
          sizeStyles[size],
          variantStyles[variant],
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Icon size={28} />
      </button>
    </div>
  );
};

export default IconButton;
