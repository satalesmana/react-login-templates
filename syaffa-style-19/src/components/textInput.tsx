import { Ionicons } from "@expo/vector-icons";
import { useState, type ReactNode } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

type MyTextInputProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightElement?: ReactNode;
};

// Tetap mengembangkan komponen input reusable milik latihan dosen.
export default function MyTextInput({
  containerStyle,
  leftIcon,
  rightElement,
  style,
  onFocus,
  onBlur,
  ...props
}: MyTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        focused && styles.focused,
        containerStyle,
      ]}
    >
      {leftIcon ? (
        <Ionicons
          name={leftIcon}
          size={16}
          color="#9BA3AE"
          style={styles.leftIcon}
        />
      ) : null}

      <TextInput
        {...props}
        placeholderTextColor="#A7AEB9"
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[styles.input, style]}
      />

      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 46,
    backgroundColor: "#F7F8FA",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#F7F8FA",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  focused: {
    borderColor: "#20BFC4",
    backgroundColor: "#FFFFFF",
  },
  leftIcon: {
    marginRight: 9,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    fontSize: 13,
    color: "#222831",
    paddingVertical: 0,
  },
});
