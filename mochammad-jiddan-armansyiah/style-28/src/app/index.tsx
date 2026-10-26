import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import MyButton from "@/components/MyButton";
import SocialIcons from "@/components/SocialIcons";

export default function HomeScreen() {
  const router = useRouter();

  const handleLoginPress = () => {
    try {
      router.push("/login");
    } catch {
      Alert.alert("Navigasi", "Membuka halaman Login");
    }
  };

  const handleSignUpPress = () => {
    try {
      router.push("/register");
    } catch {
      Alert.alert("Navigasi", "Membuka halaman Sign Up");
    }
  };

  const handleSocialPress = (provider: string) => {
    Alert.alert("Social Login", `Login menggunakan ${provider}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.imgStyle}
            source={require("@/assets/images/welcomeimages.png")}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Hello , Welcome !</Text>
          <Text style={styles.textDesc}>
            Welcome to codeChamp.in Top platform{"\n"}to coders
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <MyButton
            btnType="primary"
            text="Login"
            action={handleLoginPress}
          />

          <MyButton
            btnType="primary"
            text="Sign Up"
            action={handleSignUpPress}
          />
        </View>

        <SocialIcons
          label="Or  via social media"
          onPressFacebook={() => handleSocialPress("Facebook")}
          onPressGoogle={() => handleSocialPress("Google")}
          onPressLinkedIn={() => handleSocialPress("LinkedIn")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#102C57",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#102C57",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  imgStyle: {
    width: 290,
    height: 230,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  textTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  textDesc: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 14,
    color: "#E2E8F0",
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 14,
  },
});
