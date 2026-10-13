
import { useState, type ReactNode } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

interface MyTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  rightElement?: ReactNode;
}

export default function MyTextInput({
  containerStyle,
  rightElement,
  style,
  ...props
}: MyTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        isFocused
          ? styles.containerFocused
          : styles.containerUnfocused,
        containerStyle,
      ]}
    >
      <TextInput
        {...props}
        placeholderTextColor="#626262"
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        style={[styles.input, style]}
      />

      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 46,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  containerUnfocused: {
    borderColor: "#FFF5F5",
  },
  containerFocused: {
    borderColor: "#FF1F3C",
    backgroundColor: "#FFF8F8",
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    color: "#202020",
    height: "100%",
  },
});
