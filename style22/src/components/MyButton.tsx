import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";

interface MyButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MyButton: React.FC<MyButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        (disabled || loading) && styles.disabledButton,
      ]}
      className={`py-3.5 px-6 rounded-2xl items-center justify-center flex-row shadow-sm ${
        isPrimary
          ? "bg-indigo-600 active:bg-indigo-700"
          : isSecondary
          ? "bg-slate-800 active:bg-slate-900"
          : "bg-transparent border border-indigo-600"
      } ${(disabled || loading) ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? "#4F46E5" : "#FFFFFF"} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.outlineText : styles.solidText,
          ]}
          className={`font-semibold text-base text-center ${
            isOutline ? "text-indigo-600" : "text-white"
          }`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
  },
  secondaryButton: {
    backgroundColor: "#1E293B",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#4F46E5",
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  solidText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#4F46E5",
  },
});
