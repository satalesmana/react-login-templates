import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selamat Datang di Admin Dashboard 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  text: { fontSize: 18, fontWeight: 'bold', color: '#5B51D8' },
});