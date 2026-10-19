import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// Mengimpor komponen MyButton dari folder components
import MyButton from '../components/MyButton';

export default function ProfileScreen() {
  // Menerima data name dan email yang dikirim dari halaman register
  const params = useLocalSearchParams();
  
  // Jika tidak ada data kiriman, gunakan nama default
  const displayName = params.name || 'Adhe Kurahman';
  const displayEmail = params.email || 'sunilkargwal@gmail.com';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'space-between' }}>
        
        {/* Bagian Atas */}
        <View>
          {/* Header */}
          <Text className="text-2xl font-bold text-blue-900 mb-4">Style 7</Text>

          <View className="mt-2">
            <Text className="text-xl font-semibold text-gray-800 mb-6 text-center">
              User Profile
            </Text>

            {/* Profil Info Menampilkan Nama Sesuai Input */}
            <View className="items-center mb-8">
              <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-3 border-2 border-blue-100 shadow-sm">
                <Ionicons name="person" size={48} color="#1d4ed8" />
              </View>
              <Text className="text-xl font-bold text-gray-800">{displayName}</Text>
              <Text className="text-gray-500 text-sm">{displayEmail}</Text>
            </View>

            {/* Menu / Opsi */}
            <View className="mb-6">
              <View className="flex-row items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-3">
                <Ionicons name="settings-outline" size={20} color="#1d4ed8" style={{ marginRight: 16 }} />
                <Text className="text-gray-700 font-medium flex-1">Account Settings</Text>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </View>

              <View className="flex-row items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <Ionicons name="shield-checkmark-outline" size={20} color="#1d4ed8" style={{ marginRight: 16 }} />
                <Text className="text-gray-700 font-medium flex-1">Security & Privacy</Text>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </View>
            </View>
          </View>
        </View>

        {/* Tombol Logout */}
        <View className="mt-6">
          <MyButton 
            title="Logout" 
            onPress={() => router.replace('/')} 
            bgColor="bg-red-500" 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}