import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const TEAL = '#457B7E';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrapper}>
          <View style={styles.responsiveBox}>
            {/* ─── Area Ilustrasi ─── */}
            <View style={styles.illustrationArea}>
              <Image
                source={require('../../assets/images/welcome_characters.png')}
                style={[
                  styles.illustrationImage,
                  { width: Math.min(width * 0.85, 360) },
                ]}
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  responsiveBox: {
    width: '100%',
    maxWidth: 480,
    minHeight: 580,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  illustrationImage: {
    height: 320,
    maxHeight: 380,
  },
  contentArea: {
    paddingHorizontal: 8,
    paddingBottom: 24,
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
