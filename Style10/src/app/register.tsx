import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundCircles from '@/components/BackgroundCircles';
import MiniShopLogo from '@/components/MiniShopLogo';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors, Fonts } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
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
            <Text style={styles.title}>Register</Text>

            <View style={styles.logo}>
              <MiniShopLogo />
            </View>

            <InputField placeholder="Enter your name" value={name} onChangeText={setName} />
            <InputField
              placeholder="Enter email i’d"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={{ marginTop: 10 }}
            />
            <InputField
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={{ marginTop: 10 }}
            />

            <PrimaryButton
              title="Register"
              onPress={() => router.replace('/main' as never)}
              style={{ marginTop: 100 }}
            />

            <Text style={styles.footer}>
              Already have account ?{' '}
              <Text style={styles.footerLink} onPress={() => router.replace('/login' as never)}>
                Login
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
  title: { fontFamily: Fonts.medium, fontSize: 22, color: Colors.text, marginTop: 30 },
  logo: { marginTop: 56, marginBottom: 56, alignItems: 'center' },
  footer: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.muted,
  },
  footerLink: { fontFamily: Fonts.semiBold, color: Colors.text },
});
