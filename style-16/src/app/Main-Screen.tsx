import React from 'react';
import { Image, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';

const PROFILE = {
    nama: 'Laura Meisya Wijaya',
    prodi: 'Manajemen Informatika',
    nim: '240444020024',
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-400 mb-1">{label}</Text>
        <Text className="text-base font-semibold text-gray-800">{value}</Text>
    </View>
);

export default function MainScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white justify-center items-center px-6">
            {/* Area Gambar Ilustrasi 3D */}
            <View className="w-56 h-56 justify-center items-center mb-6">
                <Image
                    source={require('../../assets/images/karakter-kerja.png')}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>

            {/* Judul */}
            <Text className="text-2xl font-bold text-gray-900 text-center mb-6 tracking-tight">
                Welcome to our app
            </Text>

            {/* Kartu data diri */}
            <View className="w-full bg-white border border-gray-200 rounded-2xl p-5 mb-8">
                <InfoRow label="Nama" value={PROFILE.nama} />
                <InfoRow label="Program Studi" value={PROFILE.prodi} />
                <View className="mb-0">
                    <Text className="text-xs text-gray-400 mb-1">NIM</Text>
                    <Text className="text-base font-semibold text-gray-800">{PROFILE.nim}</Text>
                </View>
            </View>

            {/* Tombol Sign out */}
            <Button
                title="Sign out"
                variant="danger"
                onPress={() => router.replace('/SignIn-Screen')}
            />
        </View>
    );
}