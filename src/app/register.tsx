import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mengimpor komponen MyButton
import MyButton from '../components/MyButton';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('sunilkargwal@gmail.com');
  const [password, setPassword] = useState('.........');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'space-between' }}>
        
        <View>
          <Text className="text-2xl font-bold text-blue-900 mb-4">Style 7</Text>

          <View className="mt-2">
            <Text className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Register
            </Text>
            
            {/* Menggunakan Jalur Aset Lokal yang Benar */}
            <View className="items-center mb-4">
              <Image 
                source={require('../../assets/images/illustration.png')} 
                className="w-56 h-40" 
                resizeMode="contain" 
              />
            </View>

            {/* Input Name dengan Ikon Biru */}
            <View className="flex-row items-center border-b border-gray-300 py-2 mb-3">
              <Ionicons name="person-outline" size={20} color="#1d4ed8" className="mr-3" />
              <TextInput 
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                className="flex-1 text-gray-700 text-base"
              />
              <Ionicons name="checkmark-circle" size={20} color="blue" />
            </View>

            {/* Input Email dengan Ikon Biru */}
            <View className="flex-row items-center border-b border-gray-300 py-2 mb-3">
              <Ionicons name="mail-outline" size={20} color="#1d4ed8" className="mr-3" />
              <TextInput 
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                className="flex-1 text-gray-700 text-base"
              />
              <Ionicons name="checkmark-circle" size={20} color="blue" />
            </View>

            {/* Input Password dengan Ikon Biru */}
            <View className="flex-row items-center border-b border-gray-300 py-2 mb-6">
              <Ionicons name="lock-closed-outline" size={20} color="#1d4ed8" className="mr-3" />
              <TextInput 
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Password"
                className="flex-1 text-gray-700 text-base"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="gray" />
              </TouchableOpacity>
            </View>

            {/* Tombol Submit mengirim data name & email ke halaman profile */}
            <MyButton 
              title="Submit" 
              onPress={() => {
                alert('Registrasi Berhasil!');
                router.push({
                  pathname: '/profile',
                  params: { name: name, email: email }
                });
              }} 
            />

            <View className="flex-row justify-center items-center mt-2">
              <Text className="text-gray-500 text-xs">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-blue-600 text-xs font-bold">Login now</Text>
              </TouchableOpacity>
            </View>
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