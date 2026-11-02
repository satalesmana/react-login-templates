import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';

export default function DompetScreen() {
  const [namaDompet, setNamaDompet] = useState('');
  const [saldo, setSaldo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTambahDompet = async () => {
    if (!namaDompet || !saldo) {
      Alert.alert('Error', 'Semua field wajib diisi!');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Sesi Habis', 'Silakan login terlebih dahulu');
      router.replace('/login');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('dompet').insert([
      {
        user_id: user.id,
        nama_dompet: namaDompet,
        saldo: parseFloat(saldo) || 0,
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert('Gagal', error.message);
    } else {
      Alert.alert('Sukses', 'Dompet berhasil ditambahkan!');
      setNamaDompet('');
      setSaldo('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Form Input Dompet</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nama Dompet (cth: Utama/Cash)"
        placeholderTextColor="#aaa"
        value={namaDompet}
        onChangeText={setNamaDompet}
      />

      <TextInput
        style={styles.input}
        placeholder="Saldo Awal"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={saldo}
        onChangeText={setSaldo}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleTambahDompet}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Menyimpan...' : 'Simpan Dompet'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#8a2be2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});