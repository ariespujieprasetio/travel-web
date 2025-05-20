import React, { ReactNode } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "filled" | "outlined" | "contained";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
};

const GradientButton: React.FC<ButtonProps> = ({ 
  variant = "filled", 
  style, 
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  className = "",
  ...props 
}) => {
  return (
    <button
      {...props}
      className={`relative rounded-lg font-bold flex items-center justify-center transition-all ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      style={{
        padding: leadingIcon || trailingIcon ? "0.5rem 1.25rem" : "0.5rem 1.5rem",
        fontSize: "1.125rem",
        background: variant === "filled"
          ? "linear-gradient(90deg, #3f3f60, #8c8cd5)"
          : "transparent",
        color: variant === "filled" ? "#ffffff" : "#3f3f60",
        border: "none",
        minHeight: "44px",
        ...style,
      }}
    >
      {variant === "outlined" && (
        <span
          style={{
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            padding: "2px",
            background: "linear-gradient(90deg, #3f3f60, #8c8cd5)",
            WebkitMask: "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}
      
      <span className="relative z-[1] flex items-center gap-2">
        {leadingIcon && <span className="inline-flex">{leadingIcon}</span>}
        <span>{props.children}</span>
        {trailingIcon && <span className="inline-flex">{trailingIcon}</span>}
      </span>
    </button>
  );
};

export default GradientButton;