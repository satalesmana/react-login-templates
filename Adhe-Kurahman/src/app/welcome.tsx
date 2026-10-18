import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mengimpor komponen MyButton (naik 2 tingkat dari src/app ke komponen)
import MyButton from '../components/MyButton';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'space-between' }}>
        
        {/* Header Title */}
        <View>
          <Text className="text-2xl font-bold text-blue-900 mb-6">Style 7</Text>

          {/* Content */}
          <View className="items-center mt-2">
            <Text className="text-xl font-semibold text-gray-800 mb-1 text-center">
              Welcome to our apps
            </Text>
            
            {/* Menambahkan MI 24 dan Adhe Kurahman */}
            <Text className="text-gray-500 font-semibold text-sm mb-1 text-center">
              MI 24
            </Text>
            <Text className="text-blue-600 font-bold text-base mb-6 text-center">
              Adhe Kurahman
            </Text>
            
            {/* Menggunakan Jalur Aset Lokal yang Benar */}
            <Image 
              source={require('../../assets/images/illustration.png')} 
              className="w-72 h-60 mb-10" 
              resizeMode="contain" 
            />

            {/* Menggunakan Komponen MyButton */}
            <MyButton 
              title="Next" 
              onPress={() => router.push('/login')} 
            />
          </View>
        </View>

        {/* Footer Social Media */}
        <View className="items-center mt-6">
          <Text className="text-gray-400 text-xs mb-3">Or via social media</Text>
          
          <View className="flex-row mb-4">
            <TouchableOpacity className="w-10 h-10 bg-red-500 rounded-full items-center justify-center mx-2 shadow">
              <FontAwesome name="google" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center mx-2 shadow">
              <FontAwesome name="facebook" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-sky-400 rounded-full items-center justify-center mx-2 shadow">
              <FontAwesome name="twitter" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-400 text-[10px] text-center mt-2">
            By signing up, you agree with our <Text className="text-blue-600 underline">Terms & Conditions</Text>
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}