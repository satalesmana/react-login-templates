import { Pressable, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts } from "@/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "filled" | "outline";
};

export default function PrimaryButton({
  title,
  onPress,
  variant = "filled",
}: Props) {
  if (variant === "outline") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.outline, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.outlineText}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shadow, pressed && { opacity: 0.85 }]}
    >
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 30,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  button: {
    height: 52,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#fff", fontSize: 14, fontFamily: fonts.semibold },
  outline: {
    height: 52,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
});