// app/main.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MainDashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Mengambil nama dari parameter (baik dari Register maupun Login)
  // Jika parameter name kosong, fallback ke 'Pengguna'
  const userName = params.name ? String(params.name) : 'Pengguna';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Profil Pengguna */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarBox}>
              <Ionicons name="person" size={24} color="#3B82F6" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.greetingText}>Selamat Datang,</Text>
              <Text style={styles.userName}>{userName} ✨</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifButton} onPress={() => alert('Tidak ada notifikasi baru.')}>
            <Ionicons name="notifications-outline" size={22} color="#1F2937" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
        </View>

        {/* Kartu Banner Utama (Highlight) */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>STATUS: AKTIF</Text>
          </View>
          <Text style={styles.bannerTitle}>Dashboard UTS Mobile</Text>
          <Text style={styles.bannerSubtitle}>
            Aplikasi React Native dengan Expo Router berjalan dengan sangat mulus dan optimal.
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Halaman</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Responsif</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>A+</Text>
              <Text style={styles.statLabel}>Target Nilai</Text>
            </View>
          </View>
        </View>

        {/* Menu / Fitur Utama Grid */}
        <Text style={styles.sectionTitle}>Menu Utama</Text>
        <View style={styles.menuGrid}>
          
          <TouchableOpacity style={styles.menuCard} onPress={() => alert('Membuka menu Jadwal Kuliah')}>
            <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.menuTitle}>Jadwal Kuliah</Text>
            <Text style={styles.menuDesc}>Cek jadwal harian</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => alert('Membuka menu Tugas & Nilai')}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="book-outline" size={24} color="#22C55E" />
            </View>
            <Text style={styles.menuTitle}>Tugas & Nilai</Text>
            <Text style={styles.menuDesc}>Lihat daftar tugas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => alert('Membuka menu Profil Akun')}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FEFCE8' }]}>
              <Ionicons name="id-card-outline" size={24} color="#EAB308" />
            </View>
            <Text style={styles.menuTitle}>Profil Saya</Text>
            <Text style={styles.menuDesc}>Informasi akun</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => alert('Membuka Pusat Bantuan')}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FAF5FF' }]}>
              <Ionicons name="help-circle-outline" size={24} color="#A855F7" />
            </View>
            <Text style={styles.menuTitle}>Bantuan</Text>
            <Text style={styles.menuDesc}>Panduan aplikasi</Text>
          </TouchableOpacity>

        </View>

        {/* Informasi Keamanan Sesi */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#3B82F6" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Koneksi Aman</Text>
            <Text style={styles.infoText}>Anda masuk menggunakan token otentikasi lokal yang terenkripsi.</Text>
          </View>
        </View>

        {/* Tombol Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/')}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Keluar Sesi (Logout)</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  contentContainer: { 
    padding: 24, 
    paddingTop: 20, 
    paddingBottom: 40 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  userInfo: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatarBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#EFF6FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#BFDBFE' 
  },
  greetingText: { 
    fontSize: 12, 
    color: '#6B7280', 
    fontWeight: '500' 
  },
  userName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1F2937' 
  },
  notifButton: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    elevation: 2 
  },
  badgeDot: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#EF4444' 
  },
  bannerCard: { 
    backgroundColor: '#3B82F6', 
    borderRadius: 20, 
    padding: 24, 
    marginBottom: 24, 
    shadowColor: '#3B82F6', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 8, 
    elevation: 5 
  },
  bannerBadge: { 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 6, 
    marginBottom: 12 
  },
  bannerBadgeText: { 
    color: '#FFFFFF', 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 1 
  },
  bannerTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 6 
  },
  bannerSubtitle: { 
    color: '#E5E7EB', 
    fontSize: 13, 
    lineHeight: 18, 
    marginBottom: 20 
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255, 255, 255, 0.2)', 
    paddingTop: 16 
  },
  statItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  statNumber: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700' 
  },
  statLabel: { 
    color: '#BFDBFE', 
    fontSize: 11, 
    marginTop: 2 
  },
  statDivider: { 
    width: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)' 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1F2937', 
    marginBottom: 16 
  },
  menuGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  menuCard: { 
    width: (width - 60) / 2, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 4, 
    elevation: 2 
  },
  menuIconBox: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  menuTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1F2937', 
    marginBottom: 4 
  },
  menuDesc: { 
    fontSize: 11, 
    color: '#6B7280' 
  },
  infoBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#EFF6FF', 
    borderRadius: 14, 
    padding: 16, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#BFDBFE' 
  },
  infoTitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#1E40AF', 
    marginBottom: 2 
  },
  infoText: { 
    fontSize: 11, 
    color: '#1D4ED8', 
    lineHeight: 15 
  },
  logoutButton: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1.5, 
    borderColor: '#EF4444', 
    borderRadius: 25, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2
  },
  logoutText: { 
    color: '#EF4444', 
    fontSize: 15, 
    fontWeight: '700' 
  }
});