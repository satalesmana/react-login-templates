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
  leftElement?: ReactNode;
  rightElement?: ReactNode;
};

export default function MyTextInput({
  containerStyle,
  leftElement,
  rightElement,
  style,
  ...props
}: MyTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.field, focused && styles.focused, containerStyle]}>
      {leftElement && <View style={styles.left}>{leftElement}</View>}
      <TextInput
        {...props}
        placeholderTextColor="#A89AAC"
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[styles.input, style]}
      />
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 47,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
    borderRadius: 6,
    paddingHorizontal: 13,
    backgroundColor: "rgba(255,255,255,0.085)",
    flexDirection: "row",
    alignItems: "center",
  },
  focused: {
    borderColor: "#B246E4",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    height: 46,
    color: "#FFFFFF",
    paddingVertical: 0,
  },
  left: { marginRight: 10 },
  right: { marginLeft: 8 },
});
