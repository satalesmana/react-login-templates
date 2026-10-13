
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ButtonType = "Primary" | "Secondary";

interface MyButtonInterface {
  btnType: ButtonType;
  text: string;
  action: () => void;
}

export default function MyButton({
  btnType,
  text,
  action,
}: MyButtonInterface) {
  const isPrimary = btnType === "Primary";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
      ]}
      activeOpacity={0.85}
      onPress={action}
    >
      <Text
        style={[
          styles.buttonText,
          isPrimary
            ? styles.buttonTextPrimary
            : styles.buttonTextSecondary,
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
    height: 46,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#FF1F3C",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonSecondary: {
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
  },
  buttonTextSecondary: {
    color: "#0A0A0A",
  },
});
