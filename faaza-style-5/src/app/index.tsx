import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import MyButton from '@/components/MyButton';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/style5-reading.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Dompetmu, lebih teratur</Text>
        <Text style={styles.subtitle}>Masuk atau buat akun untuk mulai mengelola dompet.</Text>
        <View style={styles.actions}>
          <MyButton
            btnType="Primary"
            text="Login"
            action={() => router.push('/login')}
          />
          <MyButton
            btnType="Secondary"
            text="Buat akun"
            action={() => router.push('/register')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d1a',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 430,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 290,
  },
  title: {
    marginTop: 20,
    color: '#fff',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    color: '#c2b5c4',
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
});
