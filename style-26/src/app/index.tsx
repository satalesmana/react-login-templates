import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MySocialButton } from "../components";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Image
          style={styles.cardImage}
          source={require("@/assets/images/motorcycle.png")}
        />
      </View>

      <Text style={styles.textTitle}>Hi, Wecome to appName!👋</Text>
      <Text style={styles.textDesc}>Hello again, you've been missed!</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.primaryButtonText}>Next</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or With</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        <MySocialButton
          icon="github"
          text="GitHub"
          action={() => console.log("GitHub pressed")}
        />
        <MySocialButton
          icon="gitlab"
          text="GitLab"
          action={() => console.log("GitLab pressed")}
        />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Don't have an account ? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.bottomLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
  },
  card: {
    height: 340,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#E0FAFB",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  textTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginTop: 32,
  },
  textDesc: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 6,
  },
  primaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#4E0189",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#8E8E93",
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: 48,
  },
  bottomText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  bottomLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4E0189",
  },
});
