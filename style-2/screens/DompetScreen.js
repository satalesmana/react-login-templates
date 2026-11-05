import { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';

const fields = [
  { key: 'name', placeholder: 'Nama dompet' },
  { key: 'balance', placeholder: 'Saldo awal', keyboardType: 'numeric' },
  { key: 'cardBackground', placeholder: 'Warna kartu (#6C7BFF)', autoCapitalize: 'none' },
  { key: 'cardColor', placeholder: 'Warna teks (#FFFFFF)', autoCapitalize: 'none' },
];

const empty = { name: '', balance: '', cardBackground: '#6C7BFF', cardColor: '#FFFFFF' };

export default function DompetScreen() {
  const [form, setForm] = useState(empty);
  const [list, setList] = useState([]);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('dompet').select('*').order('id', { ascending: false });
    if (error) return Alert.alert('Error', error.message);
    setList(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (Object.values(form).some((v) => !v)) return Alert.alert('Error', 'Semua kolom wajib diisi');
    const { error } = await supabase.from('dompet').insert({ ...form, balance: parseInt(form.balance, 10) || 0 });
    if (error) return Alert.alert('Error', error.message);
    setForm(empty);
    load();
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ padding: 24 }}
      data={list}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View>
          {fields.map(({ key, ...props }) => (
            <TextInput
              key={key}
              {...props}
              value={form[key]}
              onChangeText={(v) => setForm({ ...form, [key]: v })}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
            />
          ))}
          <TouchableOpacity onPress={save} style={{ backgroundColor: '#000', padding: 16, borderRadius: 8, marginBottom: 24 }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Simpan</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ backgroundColor: item.cardBackground, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <Text style={{ color: item.cardColor, fontSize: 16 }}>{item.name}</Text>
          <Text style={{ color: item.cardColor, fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            Rp {item.balance.toLocaleString('id-ID')}
          </Text>
        </View>
      )}
    />
  );
}