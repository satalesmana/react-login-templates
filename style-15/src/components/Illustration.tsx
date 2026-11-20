import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type Props = { icon: keyof typeof Ionicons.glyphMap };

export default function Illustration({ icon }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.blob} />
      <View style={styles.circle}>
        <Ionicons name={icon} size={44} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: 170, height: 150, alignItems: "center", justifyContent: "center" },
  blob: {
    position: "absolute",
    right: 8,
    bottom: 4,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.soft,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
});