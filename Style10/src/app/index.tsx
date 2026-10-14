import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundCircles from '@/components/BackgroundCircles';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors, Fonts } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackgroundCircles height={330} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.illustrationWrap}>
          {/* Ganti nama file jika aset kamu berbeda */}
          <Image
            source={require('@/assets/images/welcome-illustration.png')}
            style={styles.illustration}
            contentFit="contain"
          />
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.title}>Explore the app</Text>
          <Text style={styles.desc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maecenas quis interdum
            enim enim molestie faucibus. Pretium non non massa eros, nunc, urna. Ac laoreet
            sagittis donec vel. Amet, duis justo, quam quisque egestas. Quam enim at dictum
            condimentum. Suspendisse.
          </Text>
        </View>

        <PrimaryButton title="Lets Start" onPress={() => router.push('/login' as never)} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1, paddingHorizontal: 37, paddingBottom: 24 },
  illustrationWrap: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  illustration: { width: '100%', height: '85%' },
  textWrap: { alignItems: 'center', marginTop: 28, marginBottom: 40 },
  title: { fontFamily: Fonts.medium, fontSize: 20, color: Colors.text, marginBottom: 14 },
  desc: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: Colors.text,
  },
});
