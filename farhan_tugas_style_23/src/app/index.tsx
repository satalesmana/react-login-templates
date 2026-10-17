import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Animated } from "react-native";
import { useRouter } from "expo-router";
import MyButton from "../component/mybutton";

export default function HomeScreen() {
  const router = useRouter();

  // Nilai Animasi (Opacity & Transiasi Posisi Y)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View 
          style={[
            styles.container, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          
          {/* 1. Header Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>✦</Text>
            <Text style={styles.logoText}>LOGO</Text>
          </View>

          {/* 2. Ilustrasi Gambar */}
          <View style={styles.imageWrapper}>
            <Image 
              source={require('../../assets/images/duduk.png')} 
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          {/* 3. Indikator Pagination */}
          <View style={styles.paginationContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={[styles.dot, styles.inactiveDot]} />
          </View>

          {/* 4. Teks Identitas & Deskripsi */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Muhammad Farhan Hafizh</Text>
            <Text style={styles.subtitleMajor}>Manajemen Informatika</Text>
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
            </Text>
          </View>

          {/* 5. Container Kapsul Tombol Menyatu Bergaris Tepi */}
          <View style={styles.buttonWrapper}>
            <View style={styles.capsuleBorderContainer}>
              <MyButton 
                title="Login" 
                onPress={() => router.push("/login")} 
                style={styles.loginBtn}
              />
              <MyButton 
                title="Sign-up" 
                type="outline"
                onPress={() => router.push("/register")} 
                style={styles.signupBtn}
              />
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#EBF2F7" // Warna background biru muda lembut
  },
  scrollContainer: { 
    flexGrow: 1, 
    backgroundColor: "#EBF2F7",
    paddingBottom: 24,
  },
  container: { 
    flex: 1, 
    backgroundColor: "#EBF2F7", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 24, 
    paddingTop: 16,
  },
  
  // Header Logo
  logoContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 10,
    gap: 8 
  },
  logoIcon: { 
    fontSize: 20, 
    color: "#334155", 
    fontWeight: "bold" 
  },
  logoText: { 
    fontSize: 16, 
    fontWeight: "900", 
    color: "#334155", 
    letterSpacing: 1.5 
  },

  // Area Gambar
  imageWrapper: { 
    width: "100%", 
    height: 260, 
    alignItems: "center", 
    justifyContent: "center", 
    marginVertical: 12
  },
  illustrationImage: { 
    width: "100%", 
    height: "100%" 
  },

  // Pagination
  paginationContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6, 
    marginBottom: 16 
  },
  dot: { 
    height: 6, 
    borderRadius: 3 
  },
  activeDot: { 
    width: 24, 
    backgroundColor: "#0EA5E9" 
  },
  inactiveDot: { 
    width: 6, 
    backgroundColor: "#94A3B8" 
  },

  // Teks Identitas
  textContainer: { 
    alignItems: "center", 
    paddingHorizontal: 10,
    marginBottom: 20
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#1E293B", 
    textAlign: "center", 
    marginBottom: 4 
  },
  subtitleMajor: { 
    fontSize: 14.5, 
    fontWeight: "600", 
    color: "#0EA5E9", 
    textAlign: "center", 
    marginBottom: 10 
  },
  description: { 
    fontSize: 12.5, 
    color: "#64748B", 
    textAlign: "center", 
    lineHeight: 18,
    paddingHorizontal: 8
  },

  // Container Kapsul Tombol dengan Border Luar Presisi
  buttonWrapper: { 
    width: "100%", 
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10
  },
  capsuleBorderContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#3A424C",
    height: 52,
    overflow: "hidden",
  },
  loginBtn: { 
    flex: 1, 
    backgroundColor: "#3A424C", 
    borderRadius: 0, 
    height: "100%",
    elevation: 0,
    shadowOpacity: 0
  },
  signupBtn: { 
    flex: 1, 
    backgroundColor: "transparent", 
    borderColor: "transparent", 
    borderWidth: 0,
    borderRadius: 0, 
    height: "100%",
    elevation: 0,
    shadowOpacity: 0
  },
});