import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BackgroundImage } from "@/components/background-image";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <BackgroundImage source={require("../../assets/images/welcome.png")} />

      <SafeAreaView style={styles.content}>
        <View>
          <Text style={styles.title}>Welcome To{"\n"}Shh!</Text>
          <Text style={styles.subtitle}>A Hub Where Whispers Echo Loudest</Text>
        </View>

        <View style={styles.middle}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>

          <Text style={styles.linkText}>
            Already have an account?{" "}
            <Text style={styles.linkBold} onPress={() => router.push("/login")}>
              Login
            </Text>
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#8B5FB0" },
  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 44, fontWeight: "bold", color: "#fff", marginTop: 12 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#1a1a1a", marginTop: 8 },
  middle: { flex: 1, justifyContent: "flex-end", alignItems: "center" },
  bottomSpace: { flex: 0.6 },
  button: {
    backgroundColor: "#000",
    width: "80%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  pressed: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 22, fontWeight: "600" },
  linkText: { color: "#fff", fontSize: 16, fontWeight: "500", marginTop: 14 },
  linkBold: { color: "#000", fontWeight: "bold" },
});
