import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { JwtPayload } from '@supabase/supabase-js';
import {
  supabase,
  getLocalSessionUser,
  clearLocalSessionUser,
  LocalUser,
  DompetItem,
  insertDompet,
  getDompetList,
  deleteDompet,
} from '../lib/supabase';
import { LoadingUI } from '../components/configuration/LoadingUI';

interface CardDesign {
  id: string;
  name: string;
  bgPrimary: string;
  bgSecondary: string;
  swatchColor: string;
}

interface AccentOption {
  id: string;
  label: string;
  subtitle: string;
  dotColor: string;
  textColor: string;
}

const CARD_DESIGNS: CardDesign[] = [
  {
    id: 'indigo',
    name: 'Indigo Royale',
    bgPrimary: '#2c2572',
    bgSecondary: '#1f1954',
    swatchColor: '#29226b',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    bgPrimary: '#087f5b',
    bgSecondary: '#065f46',
    swatchColor: '#077756',
  },
  {
    id: 'sunset',
    name: 'Sunset Amber',
    bgPrimary: '#ee7b11',
    bgSecondary: '#d9630b',
    swatchColor: '#ee7b11',
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    bgPrimary: '#0f172a',
    bgSecondary: '#090d16',
    swatchColor: '#0c1322',
  },
  {
    id: 'ocean',
    name: 'Ocean Azure',
    bgPrimary: '#1582d8',
    bgSecondary: '#0e67b3',
    swatchColor: '#1684db',
  },
];

const ACCENT_OPTIONS: AccentOption[] = [
  {
    id: 'white',
    label: 'Putih',
    subtitle: 'Putih Cerah',
    dotColor: '#ffffff',
    textColor: '#ffffff',
  },
  {
    id: 'gold',
    label: 'Gold',
    subtitle: 'Emas Mewah',
    dotColor: '#facc15',
    textColor: '#fde047',
  },
  {
    id: 'silver',
    label: 'Silver',
    subtitle: 'Perak Elegan',
    dotColor: '#cbd5e1',
    textColor: '#e2e8f0',
  },
  {
    id: 'cyan',
    label: 'Cyan',
    subtitle: 'Biru Muda',
    dotColor: '#38bdf8',
    textColor: '#67e8f9',
  },
];

const WALLET_PRESETS = ['Harian', 'Tabungan', 'Belanja', 'Bisnis', 'Darurat'];

function formatRupiah(value: number): string {
  if (!value || isNaN(value)) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function Index() {
  const router = useRouter();
  const [claims, setClaims] = useState<JwtPayload | null>(null);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loadingAction, setLoadingAction] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: '' });

  // Wallet Form State
  const [walletName, setWalletName] = useState('Dompet Utama');
  const [balance, setBalance] = useState<number>(0);
  const [selectedDesignId, setSelectedDesignId] = useState<string>('indigo');
  const [selectedAccentId, setSelectedAccentId] = useState<string>('white');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'error' | 'success';
  } | null>(null);

  // Saved Dompet list from Supabase / Local
  const [savedDompets, setSavedDompets] = useState<DompetItem[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.auth
        .getClaims()
        .then(({ data }) => data?.claims ?? null)
        .catch(() => null),
      getLocalSessionUser().catch(() => null),
    ])
      .then(async ([supabaseClaims, storedUser]) => {
        setClaims(supabaseClaims);
        setLocalUser(storedUser);
        const currentUserId = (supabaseClaims?.sub as string) || storedUser?.id || '';
        const { data } = await getDompetList(currentUserId);
        if (data) {
          setSavedDompets(data);
        }
      })
      .finally(() => {
        setInitializing(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth
        .getClaims()
        .then(({ data }) => {
          setClaims(data?.claims ?? null);
        })
        .catch(() => {
          setClaims(null);
        });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (initializing) {
    return <LoadingUI visible={true} fullScreen={true} message="Memuat dashboard dompet..." />;
  }

  if (!claims && !localUser) {
    return <Redirect href="/(auth)/welcome" />;
  }

  const currentUserId = (claims?.sub as string) || localUser?.id || 'guest-user';
  const selectedDesign =
    CARD_DESIGNS.find((d) => d.id === selectedDesignId) || CARD_DESIGNS[0];
  const selectedAccent =
    ACCENT_OPTIONS.find((a) => a.id === selectedAccentId) || ACCENT_OPTIONS[0];

  function handleBalanceTextChange(text: string) {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    const numericValue = digitsOnly ? parseInt(digitsOnly, 10) : 0;
    setBalance(numericValue);
  }

  function handleQuickAddBalance(amount: number) {
    setBalance((prev) => prev + amount);
  }

  async function handleSaveWallet() {
    setNotification(null);
    if (!walletName.trim()) {
      setNotification({
        message: 'Nama Dompet wajib diisi!',
        type: 'error',
      });
      Alert.alert('Peringatan', 'Nama Dompet wajib diisi!');
      return;
    }

    setLoadingAction({ visible: true, message: 'Menyimpan dompet ke Supabase...' });

    // Sesuai materi insert dompet di Supabase:
    // await supabase.from('dompet').insert([{ userId, name, balance, cardBackground, cardColor }])
    const { data, error } = await insertDompet({
      userId: currentUserId,
      name: walletName.trim(),
      balance: balance,
      cardBackground: selectedDesign.bgPrimary,
      cardColor: selectedAccent.textColor,
    });

    setLoadingAction({ visible: false, message: '' });

    if (error) {
      setNotification({
        message: 'Gagal menyimpan dompet: ' + error.message,
        type: 'error',
      });
      return;
    }

    // Refresh list
    const updated = await getDompetList(currentUserId);
    if (updated.data) {
      setSavedDompets(updated.data);
    }

    const successMsg = `Dompet "${walletName.trim()}" (Rp ${formatRupiah(balance)}) berhasil disimpan ke tabel dompet!`;
    setNotification({
      message: successMsg,
      type: 'success',
    });
    Alert.alert('Berhasil', successMsg);
  }

  async function executeDelete(id: number | string, name: string) {
    setLoadingAction({ visible: true, message: 'Menghapus dompet...' });
    await deleteDompet(id);
    const updated = await getDompetList(currentUserId);
    if (updated.data) {
      setSavedDompets(updated.data);
    }
    setLoadingAction({ visible: false, message: '' });
    setNotification({
      message: `Dompet "${name}" berhasil dihapus.`,
      type: 'success',
    });
  }

  function handleDeleteWallet(id: number | string, name: string) {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Yakin ingin menghapus dompet "${name}"?`);
      if (confirmed) {
        executeDelete(id, name);
      }
      return;
    }

    Alert.alert('Hapus Dompet', `Yakin ingin menghapus dompet "${name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => executeDelete(id, name),
      },
    ]);
  }

  async function handleCancelOrBack() {
    setLoadingAction({ visible: true, message: 'Keluar dari sesi...' });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await clearLocalSessionUser();
    await supabase.auth.signOut().catch(() => {});
    setLocalUser(null);
    setClaims(null);
    setLoadingAction({ visible: false, message: '' });
    router.replace('/(auth)/sign-in');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoadingUI visible={loadingAction.visible} message={loadingAction.message} />

      {/* Top Header */}
      <View className="flex-row items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleCancelOrBack}
            className="p-1.5 -ml-1.5 mr-2 rounded-full"
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-[17px] font-bold text-[#0f172a]">Tambah Dompet</Text>
        </View>

        <TouchableOpacity
          onPress={handleCancelOrBack}
          className="flex-row items-center bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200"
        >
          <Feather name="log-out" size={13} color="#dc2626" />
          <Text className="text-[11px] font-bold text-red-600 ml-1">Keluar</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 28,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Notification Banner */}
          {notification && (
            <View
              className={`flex-row items-center justify-between px-4 py-3 rounded-xl mb-4 border ${
                notification.type === 'error'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <FontAwesome
                  name={notification.type === 'error' ? 'exclamation-circle' : 'check-circle'}
                  size={16}
                  color={notification.type === 'error' ? '#dc2626' : '#16a34a'}
                />
                <Text
                  className={`ml-2 text-xs font-medium flex-1 ${
                    notification.type === 'error' ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {notification.message}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setNotification(null)} className="p-1">
                <FontAwesome
                  name="close"
                  size={14}
                  color={notification.type === 'error' ? '#dc2626' : '#16a34a'}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* E-Wallet Card Preview */}
          <View
            style={{
              backgroundColor: selectedDesign.bgPrimary,
              borderRadius: 20,
              padding: 22,
              marginBottom: 24,
              shadowColor: selectedDesign.bgSecondary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.28,
              shadowRadius: 16,
              elevation: 8,
              overflow: 'hidden',
            }}
          >
            {/* Decorative soft glow circles inside card */}
            <View
              style={{
                position: 'absolute',
                top: -40,
                left: -30,
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -50,
                right: -20,
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: 'rgba(0, 0, 0, 0.16)',
              }}
            />

            {/* Card Top Row: Chip + NFC & PAYNEX E-WALLET Badge */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                {/* Gold EMV Chip */}
                <View
                  style={{
                    width: 38,
                    height: 27,
                    borderRadius: 6,
                    backgroundColor: '#eab308',
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      height: 1.5,
                      backgroundColor: 'rgba(113, 63, 18, 0.35)',
                      width: '100%',
                    }}
                  />
                  <View
                    style={{
                      height: 1.5,
                      backgroundColor: 'rgba(113, 63, 18, 0.35)',
                      width: '75%',
                    }}
                  />
                  <View
                    style={{
                      height: 1.5,
                      backgroundColor: 'rgba(113, 63, 18, 0.35)',
                      width: '100%',
                    }}
                  />
                </View>

                {/* Contactless Icon */}
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 1.2,
                    borderColor: 'rgba(255,255,255,0.65)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="contactless-payment"
                    size={13}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
              </View>

              {/* PAYNEX E-WALLET Pill */}
              <View
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.42)',
                  paddingHorizontal: 11,
                  paddingVertical: 5,
                  borderRadius: 999,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#34d399',
                    marginRight: 6,
                  }}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 9.5,
                    fontWeight: '700',
                    letterSpacing: 0.7,
                  }}
                >
                  PAYNEX E-WALLET
                </Text>
              </View>
            </View>

            {/* Card Middle: Saldo Tersedia */}
            <View className="mb-6">
              <Text
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: 10,
                  fontWeight: '600',
                  letterSpacing: 0.8,
                }}
              >
                SALDO TERSEDIA
              </Text>
              <Text
                style={{
                  color: selectedAccent.textColor,
                  fontSize: 27,
                  fontWeight: '800',
                  marginTop: 2,
                }}
              >
                Rp {formatRupiah(balance)}
              </Text>
            </View>

            {/* Card Bottom Row: Nama Dompet & Card Number */}
            <View className="flex-row items-end justify-between">
              <View className="flex-1 mr-4">
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.68)',
                    fontSize: 9,
                    fontWeight: '600',
                    letterSpacing: 0.8,
                  }}
                >
                  NAMA DOMPET
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: selectedAccent.textColor,
                    fontSize: 15,
                    fontWeight: '700',
                    marginTop: 2,
                  }}
                >
                  {walletName.trim() || 'Dompet Utama'}
                </Text>
              </View>

              <View className="items-end">
                <Text
                  style={{
                    color: selectedAccent.textColor,
                    fontSize: 11,
                    fontWeight: '700',
                    letterSpacing: 1.5,
                  }}
                >
                  ••••  9021
                </Text>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.68)',
                    fontSize: 9,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                    marginTop: 2,
                  }}
                >
                  VALID THRU 12/29
                </Text>
              </View>
            </View>
          </View>

          {/* Section 1: Nama Dompet */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[13.5px] font-bold text-[#1e293b]">Nama Dompet</Text>
              <Text className="text-[11px] text-[#64748b]">Wajib diisi</Text>
            </View>

            <View className="flex-row items-center bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-3.5 py-2.5 mb-2.5">
              <Ionicons name="wallet-outline" size={18} color="#475569" />
              <TextInput
                value={walletName}
                onChangeText={(text) => {
                  setWalletName(text);
                  if (notification) setNotification(null);
                }}
                placeholder="Dompet Utama"
                placeholderTextColor="#94a3b8"
                className="flex-1 ml-2.5 text-[14px] font-medium text-[#1e293b] py-0.5"
              />
            </View>

            {/* Preset Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {WALLET_PRESETS.map((preset) => {
                const isSelected =
                  walletName.toLowerCase() === preset.toLowerCase() ||
                  walletName.toLowerCase() === `dompet ${preset.toLowerCase()}`;
                return (
                  <TouchableOpacity
                    key={preset}
                    activeOpacity={0.75}
                    onPress={() => setWalletName(`Dompet ${preset}`)}
                    style={{
                      backgroundColor: isSelected ? '#e0e7ff' : '#eef2ff',
                      borderColor: isSelected ? '#6366f1' : 'transparent',
                      borderWidth: 1,
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 999,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? '#312e81' : '#334155',
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Section 2: Saldo Awal */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[13.5px] font-bold text-[#1e293b]">Saldo Awal</Text>
              <Text className="text-[11px] font-semibold text-[#15803d]">
                Bebas Biaya Admin
              </Text>
            </View>

            <View className="flex-row items-center bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-4 py-2.5">
              <Text className="text-[15px] font-bold text-[#1e293b] mr-2">Rp</Text>
              <TextInput
                value={formatRupiah(balance)}
                onChangeText={handleBalanceTextChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#94a3b8"
                className="flex-1 text-[22px] font-extrabold text-[#0f172a] py-0.5"
              />
            </View>

            <Text className="text-[11px] text-[#64748b] mt-1.5 mb-2.5">
              Saldo saat dompet baru ini dibuat (default Rp 0).
            </Text>

            {/* Quick Add Balance Buttons */}
            <View className="flex-row items-center" style={{ gap: 10 }}>
              {[
                { label: '100 Rb', value: 100000 },
                { label: '500 Rb', value: 500000 },
                { label: '1 Juta', value: 1000000 },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.75}
                  onPress={() => handleQuickAddBalance(item.value)}
                  className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-4 py-2.5 flex-row items-center justify-center"
                >
                  <Text className="text-[#3730a3] font-bold text-xs mr-1">+</Text>
                  <Text className="text-[#0f172a] font-bold text-xs">{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section 3: Pilihan Desain Kartu */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-2.5">
              <Text className="text-[13.5px] font-bold text-[#1e293b]">
                Pilihan Desain Kartu
              </Text>
              <Text className="text-[11px] text-[#64748b]">{selectedDesign.name}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              {CARD_DESIGNS.map((design) => {
                const isSelected = design.id === selectedDesignId;
                return (
                  <TouchableOpacity
                    key={design.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedDesignId(design.id)}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      backgroundColor: design.swatchColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: isSelected ? 2.5 : 0,
                      borderColor: '#4f46e5',
                    }}
                  >
                    {isSelected && <Feather name="check" size={18} color="#ffffff" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 4: Warna Huruf & Aksen */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2.5">
              <Text className="text-[13.5px] font-bold text-[#1e293b]">
                Warna Huruf & Aksen
              </Text>
              <Text className="text-[11px] text-[#64748b]">{selectedAccent.subtitle}</Text>
            </View>

            <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
              {ACCENT_OPTIONS.map((accent) => {
                const isSelected = accent.id === selectedAccentId;
                return (
                  <TouchableOpacity
                    key={accent.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedAccentId(accent.id)}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? '#eef2ff' : '#f8fafc',
                      borderWidth: 1,
                      borderColor: isSelected ? '#c7d2fe' : '#f1f5f9',
                      paddingVertical: 9,
                      paddingHorizontal: 10,
                      borderRadius: 999,
                    }}
                  >
                    <View
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 6,
                        backgroundColor: accent.dotColor,
                        borderWidth: accent.id === 'white' ? 1 : 0,
                        borderColor: '#cbd5e1',
                        marginRight: 6,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: '#0f172a',
                      }}
                    >
                      {accent.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 5: Integrasi Transaksi Otomatis Banner */}
          <View
            style={{
              backgroundColor: '#f4f6fb',
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                backgroundColor: '#5ee9b5',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 13,
              }}
            >
              <Ionicons name="swap-horizontal" size={20} color="#064e3b" />
            </View>

            <View className="flex-1">
              <Text className="text-[12.5px] font-bold text-[#1e293b] mb-1">
                Integrasi Transaksi Otomatis (Supabase)
              </Text>
              <Text className="text-[11.5px] text-[#64748b] leading-4">
                Data dompet Anda akan disimpan ke tabel "dompet" di Supabase database secara real-time.
              </Text>
            </View>
          </View>

          {/* Bottom CTA Buttons */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSaveWallet}
            style={{
              backgroundColor: '#2518b8',
              borderRadius: 999,
              paddingVertical: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#2518b8',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.28,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <MaterialCommunityIcons
              name="credit-card-plus-outline"
              size={18}
              color="#ffffff"
            />
            <Text className="text-white font-bold text-[14.5px] ml-2">Simpan ke Tabel Dompet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCancelOrBack}
            className="py-3.5 mt-1 items-center justify-center"
          >
            <Text className="text-[#334155] font-semibold text-[13.5px]">Batal / Logout</Text>
          </TouchableOpacity>

          {/* Section 6: Daftar Dompet Tersimpan (Tabel Dompet) */}
          <View className="mt-6 pt-5 border-t border-slate-200">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[14px] font-bold text-[#0f172a]">
                Daftar Tabel Dompet ({savedDompets.length})
              </Text>
              <Text className="text-[11px] text-[#64748b]">Tersimpan di Supabase</Text>
            </View>

            {savedDompets.length === 0 ? (
              <View className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 items-center justify-center">
                <Text className="text-xs text-slate-500">Belum ada dompet tersimpan di tabel.</Text>
              </View>
            ) : (
              savedDompets.map((item, index) => (
                <View
                  key={item.id ? String(item.id) : index}
                  style={{
                    backgroundColor: item.cardBackground || '#2c2572',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                  }}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-1 mr-3">
                    <Text
                      style={{ color: item.cardColor || '#ffffff' }}
                      className="text-[14px] font-bold"
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{ color: item.cardColor || '#ffffff', opacity: 0.9 }}
                      className="text-[15px] font-extrabold mt-0.5"
                    >
                      Rp {formatRupiah(item.balance)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => item.id !== undefined && handleDeleteWallet(item.id, item.name)}
                    activeOpacity={0.7}
                    className="bg-red-500/80 hover:bg-red-600 px-3 py-2 rounded-xl flex-row items-center border border-red-300/40"
                  >
                    <Feather name="trash-2" size={15} color="#ffffff" />
                    <Text className="text-white text-xs font-bold ml-1.5">Hapus</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
