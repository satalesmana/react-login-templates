import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selamat Datang di User Dashboard 👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  text: { fontSize: 18, fontWeight: 'bold', color: '#333333' },
});