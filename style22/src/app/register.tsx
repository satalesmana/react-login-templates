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
  useWindowDimensions,
  Image,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const TEAL = '#457B7E';
const GRAY_LABEL = '#1F2937';
const GRAY_ICON = '#94A3B8';
const LINE_COLOR = '#E2E8F0';

const SignUpTopDecor: React.FC<{ width: number }> = ({ width }) => (
  <Svg
    width={width}
    height={165}
    viewBox={`0 0 ${width} 165`}
    style={StyleSheet.absoluteFillObject}
  >
    {/* Soft wave peeking below */}
    <Path
      d={`M0,0 L${width},0 L${width},135 Q${width * 0.45},175 0,115 Z`}
      fill="#EFF5F5"
    />
    {/* Main teal top banner */}
    <Path
      d={`M-10,-10 L${width + 10},-10 L${width + 10},105 Q${width * 0.55},155 -10,85 Z`}
      fill={TEAL}
    />
  </Svg>
);

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!email.trim() || !phone.trim() || !password || !confirm) {
      Alert.alert('Perhatian', 'Semua field wajib diisi');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Perhatian', 'Konfirmasi password tidak cocok');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Berhasil!', 'Akun berhasil dibuat.', [
        { text: 'Masuk', onPress: () => router.replace('/login') },
      ]);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Teal Wave Header with "Sign up" in White ── */}
          <View style={styles.headerContainer}>
            <SignUpTopDecor width={width} />
            <Text style={styles.headerTitle}>Sign up</Text>
          </View>

          {/* ── Responsive Form Container (Centered for Web/Tablet) ── */}
          <View style={styles.centerWrapper}>
            <View style={styles.formContainer}>
              {/* ── 3D Character (Sitting on Chair, Right side of Card) ── */}
              <View style={styles.characterWrapper}>
                <Image
                  source={require('../../assets/images/register_character.png')}
                  style={styles.registerCharImage}
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

                {/* Phone No Field */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.label}>Phone No</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="call-outline" size={18} color={GRAY_ICON} />
                    <View style={styles.verticalDivider} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="+91 000-00-000"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
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

                {/* Confirm Password Field */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="lock-closed-outline" size={18} color={GRAY_ICON} />
                    <View style={styles.verticalDivider} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="*********"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showConfirm}
                      value={confirm}
                      onChangeText={setConfirm}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(!showConfirm)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Ionicons
                        name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                        size={18}
                        color={GRAY_ICON}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bottomLine} />
                </View>

                {/* Create an Account Button */}
                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={handleRegister}
                  activeOpacity={0.85}
                  disabled={loading}
                >
                  <Text style={styles.registerBtnText}>
                    {loading ? 'Creating Account...' : 'Create an Account'}
                  </Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Already have an Account ! </Text>
                  <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.footerLink}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    paddingBottom: 36,
  },
  headerContainer: {
    height: 130,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  centerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: 16,
  },
  characterWrapper: {
    alignItems: 'flex-end',
    paddingRight: 16,
    marginBottom: -38,
    zIndex: 10,
  },
  registerCharImage: {
    width: 165,
    height: 185,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEF5F5',
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: GRAY_LABEL,
    fontWeight: '600',
    marginBottom: 6,
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
    marginTop: 7,
  },
  registerBtn: {
    backgroundColor: TEAL,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  registerBtnText: {
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
