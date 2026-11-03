import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

export interface MyButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  textClassName?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function MyButton({
  title,
  variant = "primary",
  size = "md",
  className = "",
  textClassName = "",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: MyButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: "bg-[#1F41BB] active:bg-[#183496] shadow-md shadow-[#1F41BB]/30",
    secondary: "bg-[#ECECEC] active:bg-[#dedede]",
    outline: "border-2 border-[#1F41BB] bg-transparent active:bg-[#1F41BB]/10",
    ghost: "bg-transparent active:bg-gray-100",
  };

  // Text variant styles
  const textVariantStyles = {
    primary: "text-white font-semibold",
    secondary: "text-[#1F41BB] font-semibold",
    outline: "text-[#1F41BB] font-semibold",
    ghost: "text-[#494949] font-medium",
  };

  // Size styles
  const sizeStyles = {
    sm: "py-2.5 px-4 rounded-lg",
    md: "py-4 px-6 rounded-xl",
    lg: "py-5 px-8 rounded-2xl",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${
        isDisabled ? "opacity-60" : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#ffffff" : "#1F41BB"} className="mr-2" />
      ) : (
        leftIcon && <React.Fragment>{leftIcon}</React.Fragment>
      )}
      <Text
        className={`text-center ${textVariantStyles[variant]} ${textSizeStyles[size]} ${textClassName}`}
      >
        {title}
      </Text>
      {!loading && rightIcon && <React.Fragment>{rightIcon}</React.Fragment>}
    </TouchableOpacity>
  );
}