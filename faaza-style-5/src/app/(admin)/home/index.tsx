import MyButton from "@/components/MyButton";
import { Stack, useRouter } from "expo-router";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/supabaseClient";

const STUDENT_NAME = "Faaza Hamid Hutasoit";
const STUDENT_CLASS = "ISI KELAS FAAZA";

export default function AdminHomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout gagal", error.message);
      return;
    }
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/style5-phone.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Berhasil login admin</Text>
        <Text style={styles.subtitle}>{STUDENT_NAME}</Text>
        <Text style={styles.className}>{STUDENT_CLASS}</Text>
        <View style={styles.button}>
          <MyButton
            text="Log out"
            btnType="Primary"
            action={handleLogout}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d1a",
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: 200, height: 195, marginBottom: 16 },
  title: { color: "#FFFFFF", fontSize: 25, fontWeight: "800", textAlign: "center" },
  subtitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "600", marginTop: 17 },
  className: { color: "#BDB0C0", fontSize: 14, marginTop: 7 },
  button: { width: "100%", maxWidth: 280, marginTop: 45 },
});
