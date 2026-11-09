import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ConfirmationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Konfirmasi Berhasil! 🎉</Text>
      <Text style={styles.subtitle}>Selamat datang kembali di aplikasi.</Text>

      <TouchableOpacity style={styles.btnPrimary} onPress={() => router.replace('/')}>
        <Text style={styles.btnText}>Kembali ke Beranda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#28a745' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30, textAlign: 'center' },
  btnPrimary: { width: '100%', backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
