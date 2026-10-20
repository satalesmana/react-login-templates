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
  icon: keyof typeof Ionicons.glyphMap;
};

export default function LineInput({
  label,
  icon,
  secureTextEntry,
  ...rest
}: Props) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.row, focused && styles.rowFocused]}>
        <Ionicons
          name={icon}
          size={16}
          color={focused ? colors.primary : colors.muted}
        />
        <View style={styles.divider} />
        <TextInput
          {...rest}
          style={styles.input}
          placeholderTextColor={colors.muted}
          secureTextEntry={isPassword && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPassword && (
          <Pressable onPress={() => setHidden(!hidden)}>
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={16}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowFocused: { borderBottomColor: colors.primary },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: colors.line,
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text,
    paddingVertical: 0,
  },
});