import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWallets: 0,
    systemBalance: 0,
  });

  const fetchAdminStats = async () => {
    try {
      // 1. Hitung Total Users
      const { count: userCount, error: userErr } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // 2. Hitung Total Wallets & Total Saldo Sistem
      const { data: walletData, error: walletErr } = await supabase
        .from('wallets')
        .select('balance');

      if (userErr || walletErr) {
        console.log('Error fetch stats:', userErr || walletErr);
      }

      const totalWallets = walletData?.length || 0;
      const totalBalance = walletData?.reduce((acc, curr) => acc + Number(curr.balance || 0), 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        totalWallets: totalWallets,
        systemBalance: totalBalance,
      });
    } catch (err: any) {
      console.error('Exception fetch admin stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/signin');
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminStats();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.badgeAdmin}>PANEL ADMIN</Text>
          <Text style={styles.title}>Financial Overview 📊</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5B51D8" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Card Summary / Ringkasan Statistik */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#5B51D8' }]}>
              <Text style={styles.statLabel}>Total Saldo Sistem</Text>
              <Text style={styles.statValue}>
                Rp {stats.systemBalance.toLocaleString('id-ID')}
              </Text>
            </View>

            <View style={styles.rowCards}>
              <View style={[styles.miniCard, { backgroundColor: '#EEECFB' }]}>
                <Text style={styles.miniCardTitle}>Total User</Text>
                <Text style={styles.miniCardValue}>{stats.totalUsers}</Text>
              </View>

              <View style={[styles.miniCard, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.miniCardTitle}>Total Dompet</Text>
                <Text style={styles.miniCardValue}>{stats.totalWallets}</Text>
              </View>
            </View>
          </View>

          {/* Navigasi Panel Admin */}
          <Text style={styles.sectionTitle}>Menu Manajemen Admin</Text>

          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.7}
            onPress={() => router.push('/admin/wallets')}
          >
            <View style={styles.menuIconBox}>
              <Text style={styles.menuIcon}>👛</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Kelola Dompet / Wallets</Text>
              <Text style={styles.menuSubtitle}>
                Lihat, Tambah, Edit, dan Hapus dompet tanpa halangan RLS
              </Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Fitur Lanjutan', 'Menu Pengguna sedang disiapkan!')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.menuIcon}>👥</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Kelola Pengguna</Text>
              <Text style={styles.menuSubtitle}>Manajemen role dan status akun pengguna</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeAdmin: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5B51D8',
    backgroundColor: '#EEECFB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
  },
  logoutButton: {
    backgroundColor: '#FFE3E3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 12,
  },
  statsContainer: {
    marginBottom: 28,
  },
  statCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  statLabel: {
    color: '#E0E0E0',
    fontSize: 13,
    marginBottom: 6,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  miniCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  miniCardTitle: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 4,
  },
  miniCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 14,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EEECFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#777777',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#A0A0A0',
    fontWeight: 'bold',
  },
});