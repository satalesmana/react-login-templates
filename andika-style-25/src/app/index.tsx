import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

// Letakkan gambarnya di assets/images/rexodus-cover.png
const COVER_IMAGE = require("@/assets/images/rexodus-cover.png");

export default function IndexScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const coverSize = Math.min(width * 0.73, 264);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.whiteTop}>
          <View style={styles.sheetHandle} />
        </View>

        <View
          style={[
            styles.coverFrame,
            { width: coverSize, height: coverSize },
          ]}
        >
          <Image
            source={COVER_IMAGE}
            resizeMode="cover"
            style={styles.coverImage}
            accessibilityLabel="Rexodus Gaming artwork"
          />
        </View>

        <View style={styles.indicators}>
          {[0, 1, 2, 3].map((item) => (
            <View
              key={item}
              style={[styles.dot, item === 3 && styles.activeDot]}
            />
          ))}
        </View>

        <Text style={styles.headline}>
          Grow your insight{"\n"}with inspiring news
        </Text>
        <Text style={styles.description}>
          Explore the world of analyzing news{"\n"}
          and sports where you will be{"\n"}
          submerged to games!
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.getStartedButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/login")}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text style={styles.getStartedText}>GET STARTED</Text>
          <Ionicons name="chevron-forward" size={19} color="#FFFFFF" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  body: {
    flex: 1,
    backgroundColor: "#050505",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 34,
  },
  whiteTop: {
    width: "100%",
    height: 195,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: "center",
    paddingTop: 13,
  },
  sheetHandle: {
    width: 48,
    height: 5,
    borderRadius: 8,
    backgroundColor: "#E1E4ED",
  },
  coverFrame: {
    marginTop: -119,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#3B0506",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 19,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5C5C5C",
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
  },
  headline: {
    marginTop: 24,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  description: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    color: "#A4A4A4",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  getStartedButton: {
    width: "72%",
    maxWidth: 280,
    minHeight: 50,
    marginTop: 37,
    backgroundColor: "#DF0000",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 19,
  },
  buttonPressed: {
    opacity: 0.84,
  },
  getStartedText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
