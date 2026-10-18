import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mengimpor komponen MyButton dari folder components (naik 2 tingkat dari src/app)
import MyButton from '../components/MyButton';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-between">
      {/* Bagian Atas */}
      <View>
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <Text className="text-xl font-bold text-blue-900">User Profile</Text>
        </View>

        {/* Profil Info */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4 shadow-inner">
            <Ionicons name="person" size={48} color="#1d4ed8" />
          </View>
          <Text className="text-xl font-bold text-gray-800">Adhe Kurahman</Text>
          <Text className="text-gray-500 text-sm">sunilkargwal@gmail.com</Text>
        </View>

        {/* Menu / Opsi */}
        <View>
          <View className="flex-row items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-3">
            <Ionicons name="settings-outline" size={20} color="#4b5563" style={{ marginRight: 16 }} />
            <Text className="text-gray-700 font-medium flex-1">Account Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </View>

          <View className="flex-row items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-3">
            <Ionicons name="shield-checkmark-outline" size={20} color="#4b5563" style={{ marginRight: 16 }} />
            <Text className="text-gray-700 font-medium flex-1">Security & Privacy</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </View>
        </View>
      </View>

      {/* Tombol Logout menggunakan MyButton dengan warna merah */}
      <View>
        <MyButton 
          title="Logout" 
          onPress={() => router.replace('/login')} 
          bgColor="bg-red-500" 
        />
      </View>
    </SafeAreaView>
  );
}