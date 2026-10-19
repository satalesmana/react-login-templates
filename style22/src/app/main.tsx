import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const TEAL       = '#3B7A7A';
const TEAL_DARK  = '#2D6464';
const TEAL_LIGHT = '#EBF5F5';
const DARK_TEXT  = '#1C2B33';
const GRAY_TEXT  = '#718096';
const CARD_BG    = '#FFFFFF';

// ─── Profil Avatar SVG ───────────────────────────────────────────
const ProfileAvatar = () => (
  <Svg width={100} height={100} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="avatarGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#5BBFB5" />
        <Stop offset="1" stopColor="#2D6464" />
      </LinearGradient>
    </Defs>
    <Circle cx="50" cy="50" r="50" fill="url(#avatarGrad)" />
    {/* Kepala */}
    <Circle cx="50" cy="36" r="18" fill="#FDBCB4" />
    {/* Rambut */}
    <Path d="M32,30 Q50,14 68,30 Q68,18 50,12 Q32,18 32,30" fill="#2D1B00" />
    {/* Badan/kaos */}
    <Path d="M22,100 Q22,70 50,65 Q78,70 78,100" fill="#FFFFFF" opacity={0.9} />
  </Svg>
);

// ─── Skill Chip ──────────────────────────────────────────────────
const SkillChip: React.FC<{ label: string; icon: keyof typeof Ionicons.glyphMap }> = ({ label, icon }) => (
  <View style={chipStyles.chip}>
    <Ionicons name={icon} size={13} color={TEAL} style={{ marginRight: 5 }} />
    <Text style={chipStyles.text}>{label}</Text>
  </View>
);

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#C8E6E6',
  },
  text: { fontSize: 12, color: TEAL, fontWeight: '600' },
});

// ─── Info Row ────────────────────────────────────────────────────
const InfoRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <View style={infoStyles.row}>
    <View style={infoStyles.iconBox}>
      <Ionicons name={icon} size={16} color={TEAL} />
    </View>
    <View style={infoStyles.textBox}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  </View>
);

const infoStyles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textBox: { flex: 1 },
  label:   { fontSize: 11, color: GRAY_TEXT, marginBottom: 1 },
  value:   { fontSize: 14, color: DARK_TEXT, fontWeight: '600' },
});

// ═══════════════════════════════════════════════════════════════
export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const skills = [
    { label: 'React Native', icon: 'phone-portrait-outline' },
    { label: 'JavaScript',   icon: 'logo-javascript' },
    { label: 'TypeScript',   icon: 'code-slash-outline' },
    { label: 'PHP',          icon: 'server-outline' },
    { label: 'MySQL',        icon: 'layers-outline' },
    { label: 'HTML / CSS',   icon: 'globe-outline' },
    { label: 'Expo',         icon: 'rocket-outline' },
    { label: 'Git & GitHub', icon: 'git-branch-outline' },
  ] as const;

  const projects = [
    {
      title: 'ASLAP SPPG App',
      desc: 'Aplikasi manajemen SPPG berbasis web menggunakan PHP Native & Google Apps Script.',
      icon: 'briefcase-outline',
    },
    {
      title: 'EcoGrid',
      desc: 'Aplikasi edukasi lingkungan dengan fitur interaktif menggunakan Electron.js & Vite.',
      icon: 'leaf-outline',
    },
    {
      title: 'Style 22 – Login Template',
      desc: 'Template autentikasi React Native Expo dengan desain modern & ilustrasi SVG karakter.',
      icon: 'phone-portrait-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ─── HEADER PROFIL ─── */}
        <View style={styles.headerBg}>
          <Svg
            width={width}
            height={240}
            viewBox={`0 0 ${width} 240`}
            style={StyleSheet.absoluteFillObject}
          >
            <Path
              d={`M0,0 L${width},0 L${width},195 Q${width / 2},238 0,195 Z`}
              fill={TEAL}
            />
          </Svg>

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <ProfileAvatar />
          </View>

          {/* Nama & Judul */}
          <Text style={styles.profileName}>Hamzah Fadhila</Text>
          <Text style={styles.profileTitle}>Mahasiswa – Manajemen Informatika</Text>

          {/* Badge institusi */}
          <View style={styles.institutionBadge}>
            <Ionicons name="school-outline" size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text style={styles.institutionText}>Politeknik LP3I Jakarta</Text>
          </View>
        </View>

        {/* ─── Responsive Content Wrapper ─── */}
        <View style={styles.centerWrapper}>
          <View style={styles.contentContainer}>
            {/* ─── TENTANG SAYA ─── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tentang Saya</Text>
              <Text style={styles.aboutText}>
                Halo! Saya <Text style={styles.boldText}>Hamzah Fadhila</Text>, mahasiswa aktif di
                Politeknik LP3I Jakarta. Saya memiliki ketertarikan besar di bidang pengembangan
                aplikasi mobile dan web.{'\n\n'}
                Saya berpengalaman dalam membangun antarmuka pengguna yang modern dan responsif
                menggunakan React Native, Expo, serta teknologi web seperti PHP dan JavaScript.
                Saya selalu bersemangat untuk belajar teknologi baru dan mengaplikasikannya dalam
                proyek nyata.
              </Text>
            </View>

            {/* ─── INFORMASI PERSONAL ─── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informasi</Text>
              <View style={styles.card}>
                <InfoRow icon="person-outline"       label="Nama Lengkap"   value="Hamzah Fadhila" />
                <InfoRow icon="school-outline"        label="Institusi"      value="Politeknik LP3I Jakarta" />
                <InfoRow icon="book-outline"          label="Program Studi"  value="Manajemen Informatika" />
                <InfoRow icon="location-outline"      label="Lokasi"         value="Jakarta, Indonesia" />
                <InfoRow icon="mail-outline"          label="Email"          value="hamzah.fadhila@example.com" />
                <InfoRow icon="logo-github"           label="GitHub"         value="github.com/Hamzah06-fad" />
              </View>
            </View>

            {/* ─── KEAHLIAN ─── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Keahlian</Text>
              <View style={styles.chipsContainer}>
                {skills.map((s) => (
                  <SkillChip key={s.label} label={s.label} icon={s.icon} />
                ))}
              </View>
            </View>

            {/* ─── PROYEK ─── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Proyek</Text>
              {projects.map((p) => (
                <View key={p.title} style={styles.projectCard}>
                  <View style={styles.projectIcon}>
                    <Ionicons name={p.icon as any} size={20} color={TEAL} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectTitle}>{p.title}</Text>
                    <Text style={styles.projectDesc}>{p.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ─── TOMBOL KELUAR ─── */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => router.replace('/')}
              activeOpacity={0.85}
            >
              <Ionicons name="log-out-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>Style 22 · Hamzah-Fadhila Branch</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7FAFA',
  },
  scroll: {
    paddingBottom: 48,
  },
  /* Header */
  headerBg: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 102,
    height: 102,
    borderRadius: 51,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
    overflow: 'hidden',
    zIndex: 2,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    zIndex: 2,
  },
  profileTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    zIndex: 2,
  },
  institutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    zIndex: 2,
  },
  institutionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  /* Center wrapper for responsiveness */
  centerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 16,
  },
  /* Sections */
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  aboutText: {
    fontSize: 14,
    color: GRAY_TEXT,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '700',
    color: TEAL,
  },
  /* Info card */
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  /* Skills */
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -4,
  },
  /* Projects */
  projectCard: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 12,
    color: GRAY_TEXT,
    lineHeight: 18,
  },
  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: TEAL_DARK,
    marginTop: 28,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#B0BEC5',
  },
});
