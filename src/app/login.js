import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.containerLeft}>
      <Text style={styles.title}>LOGIN</Text>

      <Text style={styles.label}>E-MAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="ENTER YOUR EMAIL"
        placeholderTextColor="#a0aec0"
      />

      <Text style={styles.label}>PASSWORD</Text>
      <TextInput
        style={styles.input}
        placeholder="ENTER YOUR PASSWORD"
        secureTextEntry={true}
        placeholderTextColor="#a0aec0"
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>FORGOT PASSWORD?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSolidFull}
        onPress={() => router.push("/main")}
      >
        <Text style={styles.btnSolidText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR LOGIN WITH</Text>

      <TouchableOpacity style={styles.btnGoogleFull}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png",
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.btnGoogleText}>LOGIN WITH GOOGLE</Text>
      </TouchableOpacity>
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
  forgotPassword: {
    fontFamily: "Oswald_700Bold",
    textAlign: "right",
    color: "#3182ce",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  orText: {
    fontFamily: "Oswald_700Bold",
    textAlign: "center",
    color: "#718096",
    fontSize: 12,
    marginVertical: 20,
  },
  btnSolidFull: {
    backgroundColor: "#2e8b57",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
  },
  btnGoogleFull: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  btnSolidText: { fontFamily: "Oswald_700Bold", color: "#fff", fontSize: 14 },
  btnGoogleText: {
    fontFamily: "Oswald_700Bold",
    color: "#1a202c",
    fontSize: 14,
  },
});
