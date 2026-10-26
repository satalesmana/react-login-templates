import React from 'react';
import { Image, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white justify-center items-center px-6">

            {/* Area Gambar Ilustrasi 3D */}
            <View className="w-72 h-72 justify-center items-center mb-6">
                <Image
                    source={require('../../assets/images/karakter-kerja.png')}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>

            {/* Judul & Deskripsi */}
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
                Welcome to our app
            </Text>
            <Text className="text-sm text-gray-500 text-center max-w-xs leading-relaxed mb-10">
                Please login to continue to your account.
            </Text>

            {/* Tombol Navigasi */}
            <View className="w-full">
                <Button
                    title="Start our journey"
                    onPress={() => router.push('/SignIn-Screen')}
                />
            </View>

        </View>
    );
}