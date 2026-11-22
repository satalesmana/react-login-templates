import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface MySocialButtonProps {
  icon: "github" | "gitlab";
  text: string;
  action: () => void;
}

export default function MySocialButton({
  icon,
  text,
  action,
}: MySocialButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={action}>
      <FontAwesome5
        name={icon}
        size={22}
        color={icon === "github" ? "#000000" : "#FC6D26"}
      />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
});
