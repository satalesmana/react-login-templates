
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
  const timer = setTimeout(() => {
    router.replace("/login");
  }, 5000); // Diubah: splash tampil selama 5 detik

  return () => clearTimeout(timer);
}, [router]);

  return (
    <View style={styles.body}>
      <StatusBar hidden />

      <LinearGradient
        colors={["#FF1F3C", "#F8828F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <Image
          source={require("@/assets/images/eatmore-logo.png")}
          style={[
            styles.logo,
            {
              width: width * 0.47,
              height: width * 0.36,
              top: height * 0.22,
            },
          ]}
          resizeMode="contain"
        />

        <Image
          source={require("@/assets/images/eatmore-food.png")}
          style={[
            styles.food,
            {
              width: width * 0.8,
              height: width * 0.8 * (288 / 323),
            },
          ]}
          resizeMode="contain"
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FF1F3C",
  },
  container: {
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
  },
  logo: {
    position: "absolute",
    alignSelf: "center",
  },
  food: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
