import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Slot } from 'expo-router';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminLayout() {
  // Di web, kita buat layout kiri-kanan (Sidebar + Content)
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <AdminSidebar />
        <View style={styles.contentContainer}>
          <Slot />
        </View>
      </View>
    );
  }

  // Untuk mobile (jika dibuka di HP), gunakan Slot biasa
  return <Slot />;
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh',
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    flex: 1,
    height: '100vh',
    overflowY: 'auto',
  },
});