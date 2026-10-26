import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/ilustrasi.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.btnOutlineText}>REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSolid}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.btnSolidText}>LOGIN</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Login with Google dengan Logo */}
      <TouchableOpacity style={styles.btnGoogle}>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  illustration: { width: 300, height: 300 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },

  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1a202c",
    borderRadius: 25,
    paddingVertical: 15,
    marginRight: 10,
    alignItems: "center",
  },
  btnSolid: {
    flex: 1,
    backgroundColor: "#2e8b57",
    borderRadius: 25,
    paddingVertical: 15,
    marginLeft: 10,
    alignItems: "center",
  },

  // Style Tombol Google
  btnGoogle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  googleIcon: { width: 20, height: 20, marginRight: 10 }, // Ukuran dan jarak logo

  btnOutlineText: {
    fontFamily: "Oswald_700Bold",
    color: "#1a202c",
    fontSize: 14,
  },
  btnSolidText: { fontFamily: "Oswald_700Bold", color: "#fff", fontSize: 14 },
  btnGoogleText: {
    fontFamily: "Oswald_700Bold",
    color: "#1a202c",
    fontSize: 14,
  },
});
