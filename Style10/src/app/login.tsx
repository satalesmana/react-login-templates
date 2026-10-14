import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppleIcon, FacebookIcon, GoogleIcon } from '@/components/SocialIcons';
import BackgroundCircles from '@/components/BackgroundCircles';
import MiniShopLogo from '@/components/MiniShopLogo';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors, Fonts } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <BackgroundCircles height={330} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Login Account</Text>
                <Ionicons name="person-outline" size={22} color={Colors.text} />
              </View>
              <Text style={styles.subtitle}>Welcome back !</Text>
            </View>

            <View style={styles.logo}>
              <MiniShopLogo />
            </View>

            <View style={styles.form}>
              <InputField
                placeholder="Enter email i’d"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <InputField
                placeholder="Enter password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ marginTop: 11 }}
              />
              <Pressable style={styles.forgot}>
                <Text style={styles.forgotText}>Forget Password ?</Text>
              </Pressable>

              <PrimaryButton
                title="Login"
                onPress={() => router.replace('/main' as never)}
                style={{ marginTop: 20 }}
              />

              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>Or sign up with</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <Pressable style={styles.socialBtn}>
                  <GoogleIcon />
                </Pressable>
                <Pressable style={styles.socialBtn}>
                  <FacebookIcon />
                </Pressable>
                <Pressable style={styles.socialBtn}>
                  <AppleIcon />
                </Pressable>
              </View>
            </View>

            <Text style={styles.footer}>
              Not register yet ?{' '}
              <Text style={styles.footerLink} onPress={() => router.push('/register' as never)}>
                Create Account
              </Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 26, paddingBottom: 32 },
  header: { marginTop: 30 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontFamily: Fonts.medium, fontSize: 22, color: Colors.text },
  subtitle: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.text, marginTop: 6 },
  logo: { marginTop: 56, marginBottom: 50, alignItems: 'center' },
  form: {},
  forgot: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.text },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 36, gap: 6 },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.border },
  dividerText: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.muted },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 28 },
  socialBtn: {
    width: 76,
    height: 46,
    borderRadius: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  footer: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.muted,
  },
  footerLink: { fontFamily: Fonts.semiBold, color: Colors.text },
});
