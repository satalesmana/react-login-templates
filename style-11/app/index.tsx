// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Ilustrasi Visual Elegan */}
        <View style={styles.illustrationContainer}>
          <View style={styles.imagePlaceholder}>
            <View style={styles.iconCircle}>
              <Ionicons name="rocket-outline" size={54} color="#3B82F6" />
            </View>
            <Text style={styles.welcomeBannerText}>WELCOME TO APP</Text>
          </View>
        </View>

        {/* Konten Teks */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome to the app</Text>
          <Text style={styles.subtitle}>
            We’re excited to help you book and manage your service appointments with ease.
          </Text>

          {/* Indikator Dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Tombol Login */}
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Tombol Buat Akun */}
          <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
            <Text style={styles.createAccountText}>Create an account</Text>
          </TouchableOpacity>
        </View>

        {/* Home Indicator Bar */}
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: width * 0.8,
    height: 220,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  welcomeBannerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563EB',
    letterSpacing: 2,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 24,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3B82F6',
    width: 18,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createAccountText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#1F2937',
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 8,
  },
});