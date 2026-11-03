import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Harian', 'Tabungan', 'Belanja', 'Bisnis', 'Dari'];

const CARD_DESIGNS = [
  { label: 'Indigo Royale', value: '#3730a3' },
  { label: 'Hijau', value: '#16a34a' },
  { label: 'Oranye', value: '#f97316' },
  { label: 'Hitam', value: '#111827' },
  { label: 'Biru', value: '#2563eb' },
];

const TEXT_COLORS = [
  { label: 'Putih', value: '#ffffff' },
  { label: 'Gold', value: '#facc15' },
  { label: 'Silver', value: '#cbd5e1' },
  { label: 'Cyan', value: '#22d3ee' },
];

const QUICK_AMOUNTS = [
  { label: '+ 100 Rb', value: 100000 },
  { label: '+ 500 Rb', value: 500000 },
  { label: '+ 1 Juta', value: 1000000 },
];

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

type DompetRow = {
  id: number;
  name: string;
  balance: number;
  cardbackground?: string;
  cardcolor?: string;
  category?: string | null;
};

export default function DompetScreen() {
  const [name, setName] = useState('Dompet Utama');
  const [category, setCategory] = useState('Harian');
  const [balanceText, setBalanceText] = useState('0');
  const [cardBackground, setCardBackground] = useState('#3730a3');
  const [cardColor, setCardColor] = useState('#ffffff');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rows, setRows] = useState<DompetRow[]>([]);

  const balance = parseInt(balanceText.replace(/[^0-9]/g, ''), 10) || 0;
  const selectedDesign =
    CARD_DESIGNS.find((d) => d.value === cardBackground)?.label ?? 'Indigo Royale';

  const loadRows = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('dompet')
      .select()
      .eq('userid', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setRows(data as DompetRow[]);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/sign-in');
      else loadRows();
    });
  }, []);

  const handleSave = async () => {
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Nama dompet wajib diisi.');
      return;
    }
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      router.replace('/sign-in');
      return;
    }
    const { error } = await supabase.from('dompet').insert([
      {
        userid: user.id,
        name: name.trim(),
        balance,
        cardbackground: cardBackground,
        cardcolor: cardColor,
        category,
      },
    ]);
    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
      Alert.alert('Gagal menyimpan', error.message);
      return;
    }
    Alert.alert('Berhasil', 'Dompet berhasil disimpan.');
    loadRows();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mt-4 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl text-black">{'<'}</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black ml-3">Tambah Dompet</Text>
        </View>

        <View
          style={{ backgroundColor: cardBackground, borderRadius: 20, padding: 20 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                style={{
                  width: 20,
                  height: 14,
                  backgroundColor: '#facc15',
                  borderRadius: 3,
                }}
              />
              <Text style={{ color: cardColor, fontSize: 10, marginLeft: 8 }}>
                PAYNEX E-WALLET
              </Text>
            </View>
            <Text style={{ color: cardColor, fontSize: 10 }}>●</Text>
          </View>
          <Text style={{ color: cardColor, fontSize: 11, marginTop: 20, opacity: 0.8 }}>
            SALDO TERSEDIA
          </Text>
          <Text style={{ color: cardColor, fontSize: 24, fontWeight: 'bold' }}>
            {formatRupiah(balance)}
          </Text>
          <View className="flex-row justify-between mt-6">
            <View>
              <Text style={{ color: cardColor, fontSize: 10, opacity: 0.8 }}>
                NAMA DOMPET
              </Text>
              <Text style={{ color: cardColor, fontWeight: 'bold' }}>
                {name.trim() || 'Dompet Utama'}
              </Text>
            </View>
            <View>
              <Text style={{ color: cardColor, fontSize: 10, opacity: 0.8 }}>
                **** 8821
              </Text>
              <Text style={{ color: cardColor, fontSize: 10 }}>
                VALID THRU 12/29
              </Text>
            </View>
          </View>
        </View>

        <Text className="font-bold text-black mt-6">Nama Dompet</Text>
        <View className="flex-row items-center bg-[#f5f5f5] rounded-2xl px-4 py-4 mt-2">
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder="Dompet Utama"
            value={name}
            onChangeText={setName}
          />
          <Text className="text-gray-400 text-xs">Wajib diisi</Text>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-4">
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              className={`px-4 py-2 rounded-full ${
                category === c ? 'bg-[#4f46e5]' : 'bg-[#f3f4f6]'
              }`}
            >
              <Text className={category === c ? 'text-white' : 'text-gray-600'}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-bold text-black mt-6">Saldo Awal</Text>
        <View className="flex-row items-center bg-[#f5f5f5] rounded-2xl px-4 py-4 mt-2">
          <Text className="text-base text-gray-800">Rp </Text>
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder="0"
            keyboardType="numeric"
            value={balanceText}
            onChangeText={(t) => setBalanceText(t.replace(/[^0-9]/g, ''))}
          />
        </View>
        <View className="flex-row gap-2 mt-3">
          {QUICK_AMOUNTS.map((q) => (
            <TouchableOpacity
              key={q.label}
              onPress={() => setBalanceText(String(balance + q.value))}
              className="bg-[#f3f4f6] px-4 py-2 rounded-full"
            >
              <Text className="text-gray-700">{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-gray-400 text-xs mt-2">
          Saldo saat dompet baru ini dibuat (default Rp 0). Bebas Biaya Admin.
        </Text>

        <View className="flex-row justify-between items-center mt-6">
          <Text className="font-bold text-black">Pilihan Desain Kartu</Text>
          <Text className="text-gray-400 text-xs">{selectedDesign}</Text>
        </View>
        <View className="flex-row gap-3 mt-3">
          {CARD_DESIGNS.map((d) => (
            <TouchableOpacity
              key={d.value}
              onPress={() => setCardBackground(d.value)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: d.value,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cardBackground === d.value ? (
                <Text className="text-white font-bold">✓</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-between items-center mt-6">
          <Text className="font-bold text-black">Warna Huruf &amp; Aksen</Text>
          <Text className="text-gray-400 text-xs">Putih Cerah</Text>
        </View>
        <View className="flex-row gap-3 mt-3">
          {TEXT_COLORS.map((c) => (
            <TouchableOpacity
              key={c.value}
              onPress={() => setCardColor(c.value)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: c.value,
                borderWidth: 1,
                borderColor: '#d1d5db',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cardColor === c.value ? (
                <Text
                  style={{
                    color:
                      c.value === '#ffffff' ||
                      c.value === '#cbd5e1' ||
                      c.value === '#facc15'
                        ? '#111827'
                        : '#ffffff',
                    fontWeight: 'bold',
                  }}
                >
                  ✓
                </Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-gray-400 text-xs mt-2">
          {TEXT_COLORS.find((c) => c.value === cardColor)?.label}
        </Text>

        <View className="bg-[#ecfdf5] rounded-2xl p-4 mt-6">
          <Text className="font-bold text-black">Integrasi Transaksi Otomatis</Text>
          <Text className="text-gray-500 text-sm mt-1">
            Dompet ini siap digunakan untuk pencatatan riwayat Cash-In (CI) dan
            Cash-Out (CO) secara real-time.
          </Text>
        </View>

        {errorMsg ? (
          <Text className="text-red-500 mt-4">{errorMsg}</Text>
        ) : null}

        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          className="bg-[#6d28d9] rounded-2xl py-4 items-center mt-6"
        >
          <Text className="text-white font-bold">
            {saving ? 'Menyimpan...' : 'Simpan Dompet'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} className="items-center py-3">
          <Text className="text-gray-500">Batal</Text>
        </TouchableOpacity>

        <Text className="font-bold text-black text-lg mt-6 mb-3">
          Daftar Dompet Saya
        </Text>
        {rows.length === 0 ? (
          <Text className="text-gray-400 mb-10">
            Belum ada dompet. Simpan dompet pertama lo di atas.
          </Text>
        ) : (
          rows.map((r) => (
            <View
              key={r.id}
              className="flex-row items-center bg-[#f5f5f5] rounded-2xl px-4 py-4 mb-3"
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: r.cardbackground || '#3730a3',
                }}
              />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-black">{r.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {r.category ? r.category + ' • ' : ''}
                  {formatRupiah(r.balance)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
