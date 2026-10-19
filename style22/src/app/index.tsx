import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const TEAL = '#457B7E';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ─── Area Ilustrasi ─── */}
      <View style={styles.illustrationArea}>
        <Image
          source={require('../../assets/images/welcome_characters.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* ─── Area Konten Bawah ─── */}
      <View style={styles.contentArea}>
        <Text style={styles.title}>Welcome to AppName</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor elit elit elit Volupta consectetur adipisicing elit.
          reprehenderit iusto .
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.primaryButtonText}>Create an Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          activeOpacity={0.85}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.outlineButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 8,
  },
  illustrationImage: {
    width: Math.min(width * 0.9, 360),
    height: '100%',
    maxHeight: 380,
  },
  contentArea: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: TEAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: TEAL,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: TEAL,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
