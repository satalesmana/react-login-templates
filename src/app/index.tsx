import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Hero image */}
      <View style={styles.imageSection}>
        <Image
          source={require('@/assets/images/welcome.jpeg')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* Bottom content */}
      <View style={styles.bottomSection}>
        <View style={styles.textContent}>
          <Text style={styles.title}>Explore the{'\n'}world easily</Text>
          <Text style={styles.subtitle}>To your desire</Text>
        </View>

        {/* Dots + Arrow */}
        <View style={styles.dotsArrowRow}>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={[styles.dot, styles.dotMid]} />
            <View style={[styles.dot, styles.dotInactive]} />
          </View>

          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => router.push('/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageSection: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 16,
    gap: 32,
  },
  textContent: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A2E',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8A8A9A',
  },
  dotsArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#5B67F8',
  },
  dotMid: {
    width: 8,
    backgroundColor: '#7C88FA',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#DCDCDC',
  },
  arrowButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2D2D3A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
    marginTop: -2,
  },
});
