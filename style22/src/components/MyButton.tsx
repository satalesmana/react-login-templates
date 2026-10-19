import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";

export interface MyButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "outline" | "teal";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const MyButton: React.FC<MyButtonProps> = ({
  title,
  onPress,
  variant = "teal",
  loading = false,
  disabled = false,
  className = "",
  style,
  textStyle,
}) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";
  const isTeal = variant === "teal";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isTeal && styles.tealButton,
        isPrimary && styles.primaryButton,
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
      className={`py-3.5 px-6 rounded-2xl items-center justify-center flex-row shadow-sm ${
        isTeal
          ? "bg-[#2D6464] active:bg-[#3B7A7A]"
          : isPrimary
          ? "bg-indigo-600 active:bg-indigo-700"
          : isSecondary
          ? "bg-slate-800 active:bg-slate-900"
          : "bg-transparent border border-[#3B7A7A]"
      } ${(disabled || loading) ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? "#3B7A7A" : "#FFFFFF"}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.outlineText : styles.solidText,
            textStyle,
          ]}
          className={`font-semibold text-base text-center ${
            isOutline ? "text-[#3B7A7A]" : "text-white"
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
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  tealButton: {
    backgroundColor: "#2D6464",
    shadowColor: "#3B7A7A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
  },
  secondaryButton: {
    backgroundColor: "#1E293B",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#3B7A7A",
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  solidText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#3B7A7A",
  },
});
