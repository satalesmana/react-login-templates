import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Svg, { Path } from 'react-native-svg';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/signin');
  };

  return (
    <View style={styles.sidebar}>
      {/* Brand / Logo */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>DocuFlex</Text>
        <Text style={styles.brandSubtitle}>Admin Panel</Text>
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        {/* Menu Dashboard */}
        <TouchableOpacity
          style={[styles.menuItem, pathname === '/admin/dashboard' && styles.menuItemActive]}
          onPress={() => router.push('/admin/dashboard')}
        >
          <View style={styles.iconBox}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                fill={pathname === '/admin/dashboard' ? '#5B51D8' : '#64748B'}
              />
            </Svg>
          </View>
          <Text style={[styles.menuText, pathname === '/admin/dashboard' && styles.menuTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        {/* Menu Kelola Dompet */}
        <TouchableOpacity
          style={[styles.menuItem, pathname === '/admin/wallets' && styles.menuItemActive]}
          onPress={() => router.push('/admin/wallets')}
        >
          <View style={styles.iconBox}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                fill={pathname === '/admin/wallets' ? '#5B51D8' : '#64748B'}
              />
            </Svg>
          </View>
          <Text style={[styles.menuText, pathname === '/admin/wallets' && styles.menuTextActive]}>
            Kelola Dompet
          </Text>
        </TouchableOpacity>

        {/* Menu Manajemen User */}
        <TouchableOpacity
          style={[styles.menuItem, pathname === '/admin/users' && styles.menuItemActive]}
          onPress={() => router.push('/admin/users')}
        >
          <View style={styles.iconBox}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <Path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                fill={pathname === '/admin/users' ? '#5B51D8' : '#64748B'}
              />
            </Svg>
          </View>
          <Text style={[styles.menuText, pathname === '/admin/users' && styles.menuTextActive]}>
            Manajemen User
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer / Logout */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <View style={styles.iconBox}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <Path
                d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                fill="#E53E3E"
              />
            </Svg>
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    height: '100%',
  },
  brandContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5B51D8',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 1,
  },
  menuContainer: {
    flex: 1,
    gap: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  menuItemActive: {
    backgroundColor: '#EEECFB',
  },
  iconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  menuTextActive: {
    color: '#5B51D8',
    fontWeight: '600',
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: '#E53E3E',
    fontWeight: '600',
    fontSize: 14,
  },
});