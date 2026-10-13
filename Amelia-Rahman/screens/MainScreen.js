import { View, Text, Image } from 'react-native';

export default function MainScreen() {
  const profile = [
    { label: 'Nama', value: 'Amelia Rahman' },
    { label: 'Jurusan', value: 'Manajemen Informatika' },
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
    </View>
  );
}