import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("Semua kolom wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak sama.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    router.replace("/login");
  };

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
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>LAST NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="DOE"
            placeholderTextColor="#a0aec0"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
      </View>

      <Text style={styles.label}>E-MAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="ENTER YOUR EMAIL"
        placeholderTextColor="#a0aec0"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <Text style={styles.label}>PASSWORD</Text>
      <TextInput
        style={styles.input}
        placeholder="*********"
        secureTextEntry={true}
        placeholderTextColor="#a0aec0"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>CONFIRM PASSWORD</Text>
      <TextInput
        style={styles.input}
        placeholder="*********"
        secureTextEntry={true}
        placeholderTextColor="#a0aec0"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.btnSolidFull, { marginTop: 30 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.btnSolidText}>
          {loading ? "LOADING..." : "CREATE ACCOUNT"}
        </Text>
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
  errorText: {
    fontFamily: "Oswald_400Regular",
    color: "#c53030",
    fontSize: 12,
    textAlign: "center",
    marginTop: 15,
  },
});
