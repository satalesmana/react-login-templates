import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyButton } from "@/components";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.page}>

        {/* Background PNG utuh */}
        <Image
          source={require("@/assets/images/fruzz-plants.png")}
          style={styles.background}
          resizeMode="stretch"
        />

        {/* Logo dan nama Fruzzdigital */}
        <View style={styles.brandArea}>
          <Image
            source={require("@/assets/images/fruzz-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brandText}>
            <Text style={styles.brandBold}>Fruzz</Text>
            digital
          </Text>
        </View>

        {/* Tombol bagian bawah */}
        <View style={styles.bottomSection}>
          <View style={styles.buttons}>
            <MyButton
              text="Login"
              btnType="Primary"
              action={() => router.push("/login")}
            />

            <MyButton
              text="Register"
              btnType="Secondary"
              action={() => router.push("/register")}
            />
          </View>

          <Pressable
            style={styles.guestLink}
            onPress={() =>
              router.push({
                pathname: "/(admin)/home",
                params: { guest: "1" },
              })
            }
          >
            <Text style={styles.guestText}>
              Continue as guest
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  page: {
    flex: 1,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  brandArea: {
    position: "absolute",
    top: "54%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    width: 52,
    height: 52,
    marginBottom: 5,
  },
  brandText: {
    fontSize: 18,
    color: "#444444",
  },
  brandBold: {
    fontWeight: "700",
    color: "#20262B",
  },
  bottomSection: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  buttons: {
    gap: 11,
  },
  guestLink: {
    marginTop: 34,
    alignItems: "center",
    paddingVertical: 13,
  },
  guestText: {
    color: "#19BDBE",
    fontSize: 12,
    fontWeight: "600",
  },
});