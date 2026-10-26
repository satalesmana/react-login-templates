import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ButtonType = "Primary" | "Secondary";

type MyButtonProps = {
  btnType: ButtonType;
  text: string;
  action: () => void;
};

export default function MyButton({ btnType, text, action }: MyButtonProps) {
  const label = <Text style={styles.label}>{text}</Text>;

  return (
    <TouchableOpacity
      onPress={action}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={text}
      style={styles.touchable}
    >
      {btnType === "Primary" ? (
        <LinearGradient
          colors={["#AC38E8", "#CE5957"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.content}
        >
          {label}
        </LinearGradient>
      ) : (
        <View style={[styles.content, styles.secondary]}>{label}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: { width: "100%", borderRadius: 8, overflow: "hidden" },
  content: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  secondary: {
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  label: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
