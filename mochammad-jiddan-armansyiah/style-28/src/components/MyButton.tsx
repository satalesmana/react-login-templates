import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface MyButtonProps {
  text?: string;
  title?: string;
  action?: () => void;
  onPress?: () => void;
  btnType?: "primary" | "secondary" | "outline";
  variant?: "primary" | "secondary" | "outline";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export default function MyButton({
  text,
  title,
  action,
  onPress,
  btnType,
  variant = "primary",
  style,
  textStyle,
  className,
  disabled = false,
  loading = false,
}: MyButtonProps) {
  const label = text || title || "";
  const handlePress = action || onPress;
  const currentVariant = btnType || variant;

  const isOutline = currentVariant === "outline";
  const isSecondary = currentVariant === "secondary";

  return (
    <TouchableOpacity
      className={className}
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? "#DEC39A" : "#1A1A1A"} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isOutline && styles.outlineText,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#DEC39A",
    width: "100%",
    maxWidth: 340,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: "#DEC39A",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#DEC39A",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  outlineText: {
    color: "#DEC39A",
  },
  disabledText: {
    color: "#6B7280",
  },
});
