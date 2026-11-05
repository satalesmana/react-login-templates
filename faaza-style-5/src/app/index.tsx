import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import MyButton from "@/components/MyButton";
import Style5Screen from "@/components/Style5Screen";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Style5Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <View style={styles.heroArea}>
            <Image
              source={require("@/assets/images/style5-reading.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleArea}>
            <Text style={styles.title}>Time to work</Text>
            <Text style={styles.subtitle}>welcome back we missed you</Text>
          </View>

          <View style={styles.actionArea}>
            <MyButton
              btnType="Primary"
              text="Start"
              action={() => router.push("/login")}
            />
          </View>
        </View>
      </ScrollView>
    </Style5Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center" },
  page: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 430,
    minHeight: 650,
    paddingHorizontal: 28,
  },
  heroArea: {
    height: 285,
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: -28,
  },
  heroImage: { width: "100%", height: 295 },
  titleArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
  },
  title: { color: "#FFFFFF", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#C2B5C4", fontSize: 13, marginTop: 7 },
  actionArea: { marginTop: 95, paddingHorizontal: 14, paddingBottom: 55 },
});
