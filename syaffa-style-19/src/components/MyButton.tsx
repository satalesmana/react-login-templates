import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type ButtonType = "Primary" | "Secondary";

type MyButtonProps = {
  btnType: ButtonType;
  text: string;
  action: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

// Komponen tombol latihan dosen, disesuaikan dengan warna Style 19.
export default function MyButton({
  btnType,
  text,
  action,
  style,
  textStyle,
}: MyButtonProps) {
  const primary = btnType === "Primary";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={action}
      accessibilityRole="button"
      style={[
        styles.button,
        primary ? styles.primary : styles.secondary,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          primary ? styles.primaryText : styles.secondaryText,
          textStyle,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 48,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#20262B",
  },
  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#AEB3B8",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#20262B",
  },
});
