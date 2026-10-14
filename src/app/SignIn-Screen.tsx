import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { findUser } from '../data/users';

export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = () => {
        if (findUser(email, password)) {
            setError('');
            router.replace('/Main-Screen');
        } else {
            setError('Email atau password salah. Silakan coba lagi.');
        }
    };

    return (
        <View className="flex-1 bg-white px-6 justify-center">
            {/* Header Teks */}
            <View className="mb-8">
                <Text className="text-3xl font-bold text-gray-900 mb-1">Sign in</Text>
                <Text className="text-sm text-gray-500">Please login to continue to your account.</Text>
            </View>

            <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                }}
            />
            <Input
                label="Password"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                }}
                secureTextEntry
            />

            {/* Pesan error */}
            {error !== '' && (
                <Text className="text-xs text-red-500 mb-4 ml-1">{error}</Text>
            )}

            {/* Checkbox "Keep me logged in" */}
            <View className="flex-row items-center mb-6">
                <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    className="flex-row items-center"
                >
                    <View
                        className={`w-5 h-5 rounded border mr-2 items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}
                    >
                        {rememberMe && <Text className="text-white text-xs font-bold">✓</Text>}
                    </View>
                    <Text className="text-xs text-gray-600">Keep me logged in</Text>
                </TouchableOpacity>
            </View>

            {/* Tombol Sign In */}
            <Button title="Sign in" onPress={handleSignIn} />

            {/* Divider / Garis "or" */}
            <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="mx-4 text-xs text-gray-400">or</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            {/* Tombol Sign in with Google */}
            <TouchableOpacity
                onPress={() => {
                    // Aksi login Google
                }}
                activeOpacity={0.7}
                className="w-full flex-row items-center justify-center py-3.5 bg-white border border-gray-200 rounded-xl"
            >
                <Text className="text-sm font-semibold text-gray-800 mr-2">
                    Sign in with Google
                </Text>
                <Image
                    source={require('../../assets/images/plus.png')}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Footer Navigasi ke Sign Up */}
            <View className="flex-row justify-center mt-8">
                <Text className="text-xs text-gray-500">Need an account? </Text>
                <TouchableOpacity onPress={() => router.push('/SignUp-Screen')}>
                    <Text className="text-xs text-blue-600 font-semibold">Create one</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}