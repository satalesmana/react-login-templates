import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' }}>
      <Image source={require('../assets/welcome.png')} style={{ width: '100%', height: 280 }} resizeMode="contain" />

      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 24 }}>Team work all</Text>
      <Text style={{ textAlign: 'center', marginTop: 12, color: '#333' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id potenti nisl tellus vestibulum dictum luctus cum habitasse augue.
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, backgroundColor: i === 3 ? '#6C7BFF' : '#ccc' }} />
        ))}
      </View>

      <View style={{ flexDirection: 'row', marginTop: 32, borderRadius: 10, overflow: 'hidden' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ flex: 1, backgroundColor: '#000', padding: 16 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ flex: 1, backgroundColor: '#6C7BFF', padding: 16 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}