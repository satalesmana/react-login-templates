import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase'; // Sesuaikan jalur import lib supabase Anda

// Mengimpor komponen MyButton dari folder components
import MyButton from '../components/MyButton';

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  const [userEmail, setUserEmail] = useState<string>('');
  const [dompetList, setDompetList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Mengambil data user yang sedang login dan data dompet dari Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Ambil data user aktif
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }

        if (user) {
          // 2. Ambil data dari tabel 'dompet' khusus untuk user yang sedang login
          const { data, error } = await supabase
            .from('dompet')
            .select()
            .eq('userid', user.id) // Diubah dari 'userId' menjadi 'userid' sesuai database
            .order('balance', { ascending: false });

          if (error) {
            console.log('Error fetching dompet:', error.message);
          } else {
            setDompetList(data || []);
          }
        }
      } catch (err) {
        console.log('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  
  // Menampilkan data (prioritas dari params, lalu dari supabase, atau default)
  const displayName = params.name || 'Adhe Kurahman';
  const displayEmail = params.email || userEmail || 'adhekurahman22@gmail.com';

  // Fungsi untuk menangani proses Logout Supabase
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Error logging out:', error.message);
    } else {
      router.replace('/login'); 
    }
  };

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

            {/* Bagian Menampilkan Data Dompet dari Supabase */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">Daftar Dompet (Supabase):</Text>
              
              {loading ? (
                <ActivityIndicator size="small" color="#1d4ed8" />
              ) : dompetList.length > 0 ? (
                dompetList.map((item, index) => (
                  <View key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2 flex-row justify-between items-center">
                    <View>
                      <Text className="font-semibold text-gray-800">{item.name}</Text>
                      <Text className="text-xs text-gray-500">ID: {item.id}</Text>
                    </View>
                    <Text className="font-bold text-blue-600">Rp {item.balance}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-500 italic">Belum ada data dompet di database.</Text>
              )}
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

        {/* Tombol Logout Terhubung Supabase */}
        <View className="mt-6">
          <MyButton 
            title="Logout" 
            onPress={handleLogout} 
            bgColor="bg-red-500" 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}