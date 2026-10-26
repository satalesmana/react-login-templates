import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.containerLeft}>
      <Text style={styles.title}>REGISTER</Text>

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>FIRST NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="JOHN"
            placeholderTextColor="#a0aec0"
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>LAST NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="DOE"
            placeholderTextColor="#a0aec0"
          />
        </View>
      </View>

      <Text style={styles.label}>E-MAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="ENTER YOUR EMAIL"
        placeholderTextColor="#a0aec0"
      />

      <Text style={styles.label}>PASSWORD</Text>
      <TextInput
        style={styles.input}
        placeholder="*********"
        secureTextEntry={true}
        placeholderTextColor="#a0aec0"
      />

      <Text style={styles.label}>CONFIRM PASSWORD</Text>
      <TextInput
        style={styles.input}
        placeholder="*********"
        secureTextEntry={true}
        placeholderTextColor="#a0aec0"
      />

      <TouchableOpacity
        style={[styles.btnSolidFull, { marginTop: 30 }]}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.btnSolidText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>

      <Text style={styles.agreementText}>
        BY CONTINUING, YOU AGREE TO OUR{" "}
        <Text
          style={styles.linkText}
          onPress={() => console.log("Terms pressed")}
        >
          TERMS OF SERVICE
        </Text>{" "}
        AND{" "}
        <Text
          style={styles.linkText}
          onPress={() => console.log("Privacy pressed")}
        >
          PRIVACY POLICY
        </Text>
        .
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerLeft: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Oswald_700Bold",
    color: "#1a202c",
    textAlign: "center",
    marginBottom: 30,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInputContainer: { width: "48%" },
  label: {
    fontSize: 12,
    fontFamily: "Oswald_700Bold",
    color: "#4a5568",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    fontFamily: "Oswald_400Regular",
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1a202c",
  },
  btnSolidFull: {
    backgroundColor: "#2e8b57",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
  },
  btnSolidText: { fontFamily: "Oswald_700Bold", color: "#fff", fontSize: 14 },

  agreementText: {
    fontFamily: "Oswald_700Bold",
    fontSize: 10,
    color: "#4a5568",
    textAlign: "center",
    marginTop: 20,
  },
  linkText: { color: "#3182ce", textDecorationLine: "underline" },
});
