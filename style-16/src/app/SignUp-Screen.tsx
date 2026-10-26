import React, { useState } from 'react';
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { isEmailRegistered, registerUser } from '../data/users';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const formatDate = (date: Date) =>
    `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

/* Field tanggal dengan label mengambang, ikon kalender di kiri */
const DateInput = ({
    label,
    value,
    active,
    onPress,
}: {
    label: string;
    value: Date | null;
    active: boolean;
    onPress: () => void;
}) => {
    const floated = active || value !== null;

    return (
        <View className="w-full mb-4">
            <Pressable
                onPress={onPress}
                className={`w-full flex-row items-center bg-white border rounded-xl px-4 ${active ? 'border-blue-500' : 'border-gray-200'
                    }`}
            >
                <Text
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        left: floated ? 12 : 44,
                        top: floated ? -9 : 16,
                        fontSize: floated ? 12 : 14,
                        color: floated ? (active ? '#3B82F6' : '#6B7280') : '#9CA3AF',
                        backgroundColor: 'white',
                        paddingHorizontal: 4,
                    }}
                >
                    {label}
                </Text>

                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <Text className="flex-1 ml-2 py-3.5 text-sm text-gray-800">
                    {value ? formatDate(value) : ' '}
                </Text>
            </Pressable>
        </View>
    );
};

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
        // Android: dialog menutup otomatis. iOS: spinner tetap tampil.
        setShowPicker(Platform.OS === 'ios');
        if (selected) {
            setBirthDate(selected);
            setError('');
        }
    };

    const handleSignUp = () => {
        if (!name.trim() || !birthDate || !email.trim() || !password) {
            setError('Semua kolom wajib diisi.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            setError('Format email tidak valid.');
            return;
        }
        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return;
        }
        if (isEmailRegistered(email)) {
            setError('Email sudah terdaftar. Silakan gunakan email lain atau sign in.');
            return;
        }

        registerUser({ name: name.trim(), birthDate, email, password });
        setError('');
        router.replace('/SignIn-Screen');
    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                paddingHorizontal: 24,
                paddingVertical: 32,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {/* Header Teks */}
            <View className="mb-8">
                <Text className="text-3xl font-bold text-gray-900 mb-1">Sign up</Text>
                <Text className="text-sm text-gray-500">
                    Sign up to enjoy the feature of Revolutie
                </Text>
            </View>

            <Input
                label="Your Name"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    setError('');
                }}
            />

            <DateInput
                label="Date of Birth"
                value={birthDate}
                active={showPicker}
                onPress={() => setShowPicker((prev) => !prev)}
            />

            {showPicker && (
                <DateTimePicker
                    value={birthDate ?? new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                />
            )}

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

            {/* Tombol Sign Up */}
            <Button title="Sign up" onPress={handleSignUp} />

            {/* Divider / Garis "or" */}
            <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="mx-4 text-xs text-gray-400">or</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            {/* Tombol Continue with Google */}
            <TouchableOpacity
                onPress={() => {
                    // Aksi daftar dengan Google
                }}
                activeOpacity={0.7}
                className="w-full flex-row items-center justify-center py-3.5 bg-white border border-gray-200 rounded-xl"
            >
                <Text className="text-sm font-semibold text-gray-800 mr-2">
                    Continue with Google
                </Text>
                <Image
                    source={require('../../assets/images/plus.png')}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Footer Navigasi ke Sign In */}
            <View className="flex-row justify-center mt-8">
                <Text className="text-xs text-gray-500">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace('/SignIn-Screen')}>
                    <Text className="text-xs text-blue-600 font-semibold">Sign in</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}