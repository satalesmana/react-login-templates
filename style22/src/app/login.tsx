import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TEAL = '#457B7E';
const GRAY_LABEL = '#1F2937';
const GRAY_ICON = '#94A3B8';
const LINE_COLOR = '#E2E8F0';

const LoginTopDecor = () => (
  <Svg
    width={width}
    height={160}
    viewBox={`0 0 ${width} 160`}
    style={StyleSheet.absoluteFillObject}
  >
    {/* Soft curved wave below */}
    <Path
      d={`M0,0 L${width},0 L${width},65 Q${width * 0.65},145 0,75 Z`}
      fill="#EFF5F5"
    />
    {/* Top-left organic teal blob */}
    <Path
      d="M-20,-20 C-10,95 40,115 80,105 C115,95 125,45 120,-20 Z"
      fill={TEAL}
    />
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert('Perhatian', 'Email dan password wajib diisi');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/main');
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Top Header Decor & Title ── */}
          <View style={styles.headerContainer}>
            <LoginTopDecor />
            <Text style={styles.headerTitle}>Login</Text>
          </View>

          {/* ── 3D Character (Sitting on Right side of Card) ── */}
          <View style={styles.characterWrapper}>
            <Image
              source={require('../../assets/images/login_character.png')}
              style={styles.loginCharImage}
              resizeMode="contain"
            />
          </View>

          {/* ── Form Card ── */}
          <View style={styles.card}>
            {/* Email Field */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color={GRAY_ICON} />
                <View style={styles.verticalDivider} />
                <TextInput
                  style={styles.textInput}
                  placeholder="demo@email.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.bottomLine} />
            </View>

            {/* Password Field */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color={GRAY_ICON} />
                <View style={styles.verticalDivider} />
                <TextInput
                  style={styles.textInput}
                  placeholder="*********"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={GRAY_ICON}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.bottomLine} />
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRemember(!remember)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, remember && styles.checkboxActive]}>
                  {remember && <Ionicons name="checkmark" size={11} color="#FFF" />}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('Forgot Password', 'Link reset telah dikirim ke email')}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.loginBtnText}>
                {loading ? 'Loading...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an Account ? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  headerContainer: {
    height: 125,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.2,
  },
  characterWrapper: {
    alignItems: 'flex-end',
    paddingRight: 24,
    marginBottom: -38,
    zIndex: 10,
  },
  loginCharImage: {
    width: 175,
    height: 165,
  },
  card: {
    marginHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEF5F5',
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: GRAY_LABEL,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 3,
  },
  bottomLine: {
    height: 1,
    backgroundColor: LINE_COLOR,
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  rememberText: {
    fontSize: 13,
    color: '#64748B',
  },
  forgotText: {
    fontSize: 13,
    color: TEAL,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: TEAL,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 13,
    color: TEAL,
    fontWeight: '700',
  },
});
