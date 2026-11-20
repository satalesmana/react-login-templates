import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { formatRupiah } from '../utils/format';

const NAME_SUGGESTIONS = ['Harian', 'Tabungan', 'Belanja', 'Bisnis', 'Dana Darurat'];

const QUICK_AMOUNTS = [
    { label: '+ 100 Rb', value: 100000 },
    { label: '+ 500 Rb', value: 500000 },
    { label: '+ 1 Juta', value: 1000000 },
];

// Disimpan ke kolom cardBackground
const CARD_DESIGNS = [
    { label: 'Indigo Royale', color: '#4F46E5' },
    { label: 'Emerald', color: '#047857' },
    { label: 'Sunset Orange', color: '#F97316' },
    { label: 'Midnight Navy', color: '#0F172A' },
    { label: 'Deep Teal', color: '#134E4A' },
];

// Disimpan ke kolom cardColor
const TEXT_COLORS = [
    { label: 'Putih', detail: 'Putih Cerah', color: '#FFFFFF' },
    { label: 'Gold', detail: 'Gold Elegan', color: '#FACC15' },
    { label: 'Silver', detail: 'Silver Metalik', color: '#CBD5E1' },
    { label: 'Cyan', detail: 'Cyan Segar', color: '#22D3EE' },
];

// Batas kolom integer di PostgreSQL
const MAX_BALANCE = 2147483647;

/* Judul bagian form dengan keterangan kecil di kanan */
const SectionLabel = ({
    title,
    note,
    noteClassName = 'text-gray-400',
}: {
    title: string;
    note?: string;
    noteClassName?: string;
}) => (
    <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        {note && <Text className={`text-xs ${noteClassName}`}>{note}</Text>}
    </View>
);

export default function TambahDompetScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [balance, setBalance] = useState(0);
    const [cardBackground, setCardBackground] = useState(CARD_DESIGNS[0].color);
    const [cardColor, setCardColor] = useState(TEXT_COLORS[0].color);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const selectedDesign = CARD_DESIGNS.find((d) => d.color === cardBackground);
    const selectedText = TEXT_COLORS.find((t) => t.color === cardColor);

    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/Main-Screen');
        }
    };

    const handleBalanceChange = (text: string) => {
        // Ambil angka saja: "1.500.000" -> 1500000
        setBalance(Number(text.replace(/\D/g, '')) || 0);
        setError('');
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Nama dompet wajib diisi.');
            return;
        }
        if (balance > MAX_BALANCE) {
            setError('Saldo awal terlalu besar.');
            return;
        }

        setLoading(true);
        // userId = id user yang sedang login (hasil Tugas 1)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            Alert.alert('Sesi berakhir', 'Silakan sign in kembali.');
            router.replace('/SignIn-Screen');
            return;
        }

        const { error } = await supabase.from('dompet').insert([
            {
                userId: user.id,
                name: name.trim(),
                balance,
                cardBackground,
                cardColor,
            },
        ]);
        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }
        setError('');
        Alert.alert('Berhasil', `Dompet "${name.trim()}" berhasil disimpan.`);
        goBack();
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="flex-row items-center px-6 py-3">
                <Pressable onPress={goBack} hitSlop={10} className="mr-3">
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </Pressable>
                <Text className="text-lg font-bold text-gray-900">Tambah Dompet</Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Preview kartu (berubah sesuai pilihan) */}
                <View
                    className="w-full rounded-3xl p-5 mb-6"
                    style={{ backgroundColor: cardBackground }}
                >
                    <View className="flex-row items-center justify-between mb-5">
                        <View className="w-10 h-7 rounded-md bg-yellow-300" />
                        <Text className="text-xs font-bold tracking-widest" style={{ color: cardColor }}>
                            PAYNEX E-WALLET
                        </Text>
                    </View>

                    <Text className="text-[10px] tracking-widest opacity-70" style={{ color: cardColor }}>
                        SALDO TERSEDIA
                    </Text>
                    <Text className="text-3xl font-bold mb-5" style={{ color: cardColor }}>
                        Rp {formatRupiah(balance)}
                    </Text>

                    <View className="flex-row items-end justify-between">
                        <View className="flex-1 mr-3">
                            <Text className="text-[10px] tracking-widest opacity-70" style={{ color: cardColor }}>
                                NAMA DOMPET
                            </Text>
                            <Text
                                className="text-base font-semibold"
                                style={{ color: cardColor }}
                                numberOfLines={1}
                            >
                                {name.trim() || 'Dompet Baru'}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-xs tracking-widest" style={{ color: cardColor }}>
                                •••• 9921
                            </Text>
                            <Text className="text-[10px] opacity-70" style={{ color: cardColor }}>
                                VALID THRU 12/29
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Nama Dompet */}
                <SectionLabel title="Nama Dompet" note="Wajib diisi" />
                <View className="w-full flex-row items-center bg-white border border-gray-200 rounded-xl px-4 mb-3">
                    <Ionicons name="wallet-outline" size={20} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-2 py-3.5 text-sm text-gray-800"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setError('');
                        }}
                        placeholder="Contoh: Dompet Utama"
                        placeholderTextColor="#9CA3AF"
                        maxLength={30}
                    />
                </View>

                {/* Saran nama */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-6"
                    keyboardShouldPersistTaps="handled"
                >
                    {NAME_SUGGESTIONS.map((item) => {
                        const active = name === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => {
                                    setName(item);
                                    setError('');
                                }}
                                className={`px-4 py-2 mr-2 rounded-full border ${active ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'
                                    }`}
                            >
                                <Text className={`text-xs ${active ? 'text-white' : 'text-gray-600'}`}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Saldo Awal */}
                <SectionLabel
                    title="Saldo Awal"
                    note="Bebas Biaya Admin"
                    noteClassName="text-green-600 font-semibold"
                />
                <View className="w-full flex-row items-center bg-white border border-gray-200 rounded-xl px-4">
                    <Text className="text-lg font-semibold text-gray-500 mr-2">Rp</Text>
                    <TextInput
                        className="flex-1 py-3 text-2xl font-bold text-gray-900"
                        value={balance ? formatRupiah(balance) : ''}
                        onChangeText={handleBalanceChange}
                        placeholder="0"
                        placeholderTextColor="#111827"
                        keyboardType="number-pad"
                    />
                </View>
                <Text className="text-xs text-gray-400 mt-2 mb-3">
                    Saldo saat dompet baru ini dibuat (Default Rp 0).
                </Text>

                {/* Tombol tambah saldo cepat */}
                <View className="flex-row mb-6">
                    {QUICK_AMOUNTS.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            onPress={() => {
                                setBalance((prev) => prev + item.value);
                                setError('');
                            }}
                            className={`flex-1 py-2.5 rounded-xl border border-gray-200 items-center ${index < QUICK_AMOUNTS.length - 1 ? 'mr-2' : ''
                                }`}
                        >
                            <Text className="text-xs font-semibold text-gray-700">{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pilihan Desain Kartu -> cardBackground */}
                <SectionLabel
                    title="Pilihan Desain Kartu"
                    note={selectedDesign?.label}
                    noteClassName="text-indigo-600 font-semibold"
                />
                <View className="flex-row justify-between mb-6">
                    {CARD_DESIGNS.map((item) => {
                        const active = item.color === cardBackground;
                        return (
                            <Pressable
                                key={item.color}
                                onPress={() => setCardBackground(item.color)}
                                className={`w-14 h-14 rounded-xl items-center justify-center ${active ? 'border-2 border-gray-900' : ''
                                    }`}
                                style={{ backgroundColor: item.color }}
                            >
                                {active && <Ionicons name="checkmark" size={22} color="#FFFFFF" />}
                            </Pressable>
                        );
                    })}
                </View>

                {/* Warna Huruf & Aksen -> cardColor */}
                <SectionLabel title="Warna Huruf & Aksen" note={selectedText?.detail} />
                <View className="flex-row mb-6">
                    {TEXT_COLORS.map((item, index) => {
                        const active = item.color === cardColor;
                        return (
                            <TouchableOpacity
                                key={item.color}
                                onPress={() => setCardColor(item.color)}
                                className={`flex-1 flex-row items-center justify-center py-2 rounded-full border ${active ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'
                                    } ${index < TEXT_COLORS.length - 1 ? 'mr-2' : ''}`}
                            >
                                <View
                                    className="w-3 h-3 rounded-full mr-1.5 border border-gray-300"
                                    style={{ backgroundColor: item.color }}
                                />
                                <Text className={`text-xs ${active ? 'text-indigo-700 font-semibold' : 'text-gray-600'}`}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Kotak info */}
                <View className="flex-row bg-indigo-50 rounded-xl p-4 mb-6">
                    <View className="w-9 h-9 rounded-full bg-indigo-600 items-center justify-center mr-3">
                        <Ionicons name="swap-horizontal" size={18} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-gray-900 mb-1">
                            Integrasi Transaksi Otomatis
                        </Text>
                        <Text className="text-xs text-gray-500 leading-relaxed">
                            Dompet ini akan langsung ditautkan ke akun Anda untuk pencatatan riwayat
                            Cash-In (CI) dan Cash-Out (CO) secara real-time.
                        </Text>
                    </View>
                </View>

                {/* Pesan error */}
                {error !== '' && (
                    <Text className="text-xs text-red-500 mb-4 ml-1">{error}</Text>
                )}

                {/* Tombol Simpan & Batal */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl flex-row items-center justify-center bg-indigo-700 active:bg-indigo-800 ${loading ? 'opacity-50' : ''
                        }`}
                >
                    <Ionicons name="card-outline" size={20} color="#FFFFFF" />
                    <Text className="font-semibold text-base text-white ml-2">
                        {loading ? 'Menyimpan...' : 'Simpan Dompet'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={goBack} disabled={loading} className="py-4 items-center">
                    <Text className="text-sm text-gray-500">Batal</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
