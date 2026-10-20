import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/theme";

type Props = TextInputProps & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function InputField({
  label,
  icon,
  secureTextEntry,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.box, focused && styles.boxFocused]}>
        <TextInput
          {...rest}
          style={styles.input}
          placeholderTextColor={colors.muted}
          secureTextEntry={isPassword && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPassword ? (
          <Pressable onPress={() => setHidden(!hidden)}>
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={colors.muted}
            />
          </Pressable>
        ) : icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? colors.primary : colors.muted}
          />
        ) : null}
      </View>
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingTop: 8, marginBottom: 14 },
  box: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  boxFocused: { borderColor: colors.primary },
  input: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text,
    paddingVertical: 0,
  },
  label: {
    position: "absolute",
    top: 1,
    left: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 4,
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
  labelFocused: { color: colors.primary },
});