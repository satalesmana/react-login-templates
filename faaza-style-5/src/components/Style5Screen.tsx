import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Style5ScreenProps = {
  children: ReactNode;
};

export const style5Colors = {
  background: "#161319",
  input: "rgba(255, 255, 255, 0.075)",
  white: "#FFFFFF",
  muted: "#B5A7B8",
  accent: "#B642E6",
};

export default function Style5Screen({ children }: Style5ScreenProps) {
  return (
    <LinearGradient
      colors={["#141217", "#221824", "#30202D", "#40253E"]}
      locations={[0, 0.4, 0.74, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" backgroundColor="#141217" />
      <View pointerEvents="none" style={styles.decoration}>
        <LinearGradient
          colors={["rgba(188, 77, 247, 0.38)", "rgba(188, 77, 247, 0)"]}
          style={styles.topGlow}
        />
        <LinearGradient
          colors={["rgba(233, 94, 98, 0)", "rgba(233, 94, 98, 0.22)"]}
          style={styles.bottomGlow}
        />
        <View style={styles.sparkleOne} />
        <View style={styles.sparkleTwo} />
        <View style={styles.sparkleThree} />
      </View>
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#161319" },
  safe: { flex: 1 },
  decoration: { ...StyleSheet.absoluteFill, overflow: "hidden" },
  topGlow: {
    position: "absolute",
    top: -100,
    right: -70,
    width: 225,
    height: 225,
    borderRadius: 120,
    opacity: 0.8,
  },
  bottomGlow: {
    position: "absolute",
    bottom: -150,
    left: -125,
    width: 330,
    height: 330,
    borderRadius: 170,
  },
  sparkleOne: {
    position: "absolute",
    top: "38%",
    right: 17,
    width: 9,
    height: 9,
    borderRadius: 3,
    transform: [{ rotate: "24deg" }],
    backgroundColor: "#AC39DE",
    opacity: 0.75,
  },
  sparkleTwo: {
    position: "absolute",
    top: "47%",
    left: 18,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8A3C91",
    opacity: 0.12,
  },
  sparkleThree: {
    position: "absolute",
    bottom: "28%",
    right: 23,
    width: 10,
    height: 10,
    borderRadius: 4,
    transform: [{ rotate: "-35deg" }],
    backgroundColor: "#DD58CF",
    opacity: 0.8,
  },
});
