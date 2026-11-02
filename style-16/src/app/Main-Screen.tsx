import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { formatRupiah } from '../utils/format';

const PROFILE = {
    nama: 'Laura Meisya Wijaya',
    prodi: 'Manajemen Informatika',
    nim: '240444020024',
};

interface Dompet {
    id: number;
    name: string;
    balance: number;
    cardBackground: string;
    cardColor: string;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View className="mb-4">
        <Text className="text-xs text-gray-400 mb-1">{label}</Text>
        <Text className="text-base font-semibold text-gray-800">{value}</Text>
    </View>
);

/* Kartu kecil satu dompet, warnanya sesuai pilihan saat dibuat */
const DompetCard = ({ dompet }: { dompet: Dompet }) => (
    <View
        className="w-full rounded-2xl p-4 mb-3 flex-row items-center"
        style={{ backgroundColor: dompet.cardBackground }}
    >
        <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center mr-3">
            <Ionicons name="wallet-outline" size={20} color={dompet.cardColor} />
        </View>
        <View className="flex-1">
            <Text
                className="text-sm font-semibold"
                style={{ color: dompet.cardColor }}
                numberOfLines={1}
            >
                {dompet.name}
            </Text>
            <Text className="text-[10px] tracking-widest opacity-70" style={{ color: dompet.cardColor }}>
                PAYNEX E-WALLET
            </Text>
        </View>
        <Text className="text-base font-bold" style={{ color: dompet.cardColor }}>
            Rp {formatRupiah(dompet.balance)}
        </Text>
    </View>
);

export default function MainScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [dompetList, setDompetList] = useState<Dompet[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const totalSaldo = dompetList.reduce((sum, d) => sum + d.balance, 0);

    // Ambil user login + semua dompet miliknya dari Supabase
    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.replace('/SignIn-Screen');
            return;
        }
        setEmail(user.email ?? '');

        const { data, error } = await supabase
            .from('dompet')
            .select('id, name, balance, cardBackground, cardColor')
            .eq('userId', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            setError(error.message);
        } else {
            setError('');
            setDompetList((data ?? []) as Dompet[]);
        }
        setLoading(false);
    };

    // Dimuat ulang setiap layar tampil (termasuk setelah kembali dari Tambah Dompet)
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/SignIn-Screen');
    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: insets.top + 16,
                paddingBottom: insets.bottom + 32,
            }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            showsVerticalScrollIndicator={false}
        >
            {/* Header sapaan */}
            <View className="flex-row items-center mb-6">
                <View className="flex-1">
                    <Text className="text-sm text-gray-500">Selamat datang,</Text>
                    <Text className="text-2xl font-bold text-gray-900 tracking-tight">{PROFILE.nama}</Text>
                </View>
                <Image
                    source={require('../../assets/images/karakter-kerja.png')}
                    style={{ width: 56, height: 56 }}
                    resizeMode="contain"
                />
            </View>

            {/* Kartu total saldo */}
            <View className="w-full bg-blue-600 rounded-2xl p-5 mb-6">
                <Text className="text-xs text-blue-100 mb-1">Total Saldo</Text>
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" style={{ alignSelf: 'flex-start', marginVertical: 8 }} />
                ) : (
                    <Text className="text-3xl font-bold text-white mb-1">
                        Rp {formatRupiah(totalSaldo)}
                    </Text>
                )}
                <Text className="text-xs text-blue-100">
                    Dari {dompetList.length} dompet
                </Text>
            </View>

            {/* Daftar dompet */}
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-bold text-gray-900">Dompet Saya</Text>
                <Text className="text-xs text-gray-400">{dompetList.length} dompet</Text>
            </View>

            {error !== '' && (
                <Text className="text-xs text-red-500 mb-4 ml-1">{error}</Text>
            )}

            {!loading && dompetList.length === 0 && error === '' && (
                <View className="w-full border border-dashed border-gray-300 rounded-2xl p-6 items-center mb-3">
                    <Ionicons name="wallet-outline" size={28} color="#9CA3AF" />
                    <Text className="text-sm text-gray-500 mt-2 text-center">
                        Belum ada dompet. Tambahkan dompet pertama Anda.
                    </Text>
                </View>
            )}

            {dompetList.map((dompet) => (
                <DompetCard key={dompet.id} dompet={dompet} />
            ))}

            {/* Tombol ke layar Tambah Dompet */}
            <View className="w-full mt-3 mb-8">
                <Button title="Tambah Dompet" onPress={() => router.push('/Tambah-Dompet')} />
            </View>

            {/* Kartu data diri */}
            <View className="w-full bg-white border border-gray-200 rounded-2xl p-5 mb-8">
                <InfoRow label="Nama" value={PROFILE.nama} />
                <InfoRow label="Program Studi" value={PROFILE.prodi} />
                <InfoRow label="Email (akun login)" value={email || '-'} />
                <View className="mb-0">
                    <Text className="text-xs text-gray-400 mb-1">NIM</Text>
                    <Text className="text-base font-semibold text-gray-800">{PROFILE.nim}</Text>
                </View>
            </View>

            {/* Tombol Sign out */}
            <Button
                title="Sign out"
                variant="danger"
                onPress={handleSignOut}
            />
        </ScrollView>
    );
}
