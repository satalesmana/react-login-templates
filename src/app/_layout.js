import {
  Oswald_400Regular,
  Oswald_700Bold,
  useFonts,
} from "@expo-google-fonts/oswald";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Tahan splash screen sampai font selesai dimuat
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Oswald_400Regular,
    Oswald_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  // Menampilkan halaman tanpa header bawaan navigasi
  return <Stack screenOptions={{ headerShown: false }} />;
}
