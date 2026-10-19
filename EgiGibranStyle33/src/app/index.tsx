import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Gambar Ilustrasi dari folder assets/images */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../assets/images/profile.png')} // Pastikan nama file gambar di assets/images sesuai
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* Konten Teks & Tombol Aksi */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to our app</Text>
        <Text style={styles.subtitle}>
          Now you can fund your account so you’re ready to invest in crypto
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/signin')}
        >
          <Text style={styles.buttonText}>Let's go</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 36,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#5B51D8', // Warna ungu tombol sesuai desain
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Shadow halus di Android
    shadowColor: '#5B51D8', // Shadow di iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});