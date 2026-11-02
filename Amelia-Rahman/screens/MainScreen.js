import { View, Text, Image, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

export default function MainScreen({ navigation }) {
  const profile = [
    { label: 'Nama', value: 'Amelia Rahman' },
    { label: 'Jurusan', value: 'Manajemen Informatika (MI-24)' },
    { label: 'NIM', value: '240444020002' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 100 }}>
      <Image
        source={require('../assets/profile.jpg')}
        style={{ width: 160, height: 160, borderRadius: 80, marginBottom: 32 }}
      />
      {profile.map(({ label, value }) => (
        <View key={label} style={{ alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: '#888', fontSize: 14 }}>{label}</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{value}</Text>
        </View>
      ))}

      <TouchableOpacity onPress={() => navigation.navigate('Dompet')} style={{ backgroundColor: '#6C7BFF', padding: 16, borderRadius: 8, width: 240, marginTop: 16 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Dompet</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => supabase.auth.signOut().then(() => navigation.replace('Welcome'))} style={{ backgroundColor: '#000', padding: 16, borderRadius: 8, width: 240, marginTop: 12 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}