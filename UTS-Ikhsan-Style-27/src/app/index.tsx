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
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // Current view state: 'input' or 'dashboard'
  const [currentView, setCurrentView] = useState<'input' | 'dashboard'>('input');
  const [activeWallet, setActiveWallet] = useState<{
    name: string;
    balance: number;
    design: CardDesign;
    accent: AccentOption;
  }>({
    name: 'Dompet Utama',
    balance: 0,
    design: CARD_DESIGNS[0],
    accent: ACCENT_OPTIONS[0],
  });

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

        // Check if user already created / saved a wallet previously
        const savedActive = await AsyncStorage.getItem(`@uts_active_wallet_${currentUserId}`);
        const { data } = await getDompetList(currentUserId);
        if (data && data.length > 0) {
          setSavedDompets(data);
        }

        if (savedActive) {
          const parsed = JSON.parse(savedActive);
          const matchedDesign =
            CARD_DESIGNS.find((d) => d.id === parsed.design?.id || d.bgPrimary === parsed.design?.bgPrimary) ||
            CARD_DESIGNS[0];
          const matchedAccent =
            ACCENT_OPTIONS.find((a) => a.id === parsed.accent?.id) || ACCENT_OPTIONS[0];

          setActiveWallet({
            name: parsed.name || 'Dompet Utama',
            balance: parsed.balance || 0,
            design: matchedDesign,
            accent: matchedAccent,
          });
          // Langsung kunci ke dashboard utama, tidak bisa kembali ke pilih tema
          setCurrentView('dashboard');
        } else if (data && data.length > 0) {
          // If already has wallet in DB, lock to dashboard
          const first = data[0];
          const matchedDesign =
            CARD_DESIGNS.find((d) => d.bgPrimary === first.cardBackground) || CARD_DESIGNS[0];
          const matchedAccent =
            ACCENT_OPTIONS.find((a) => a.textColor === first.cardColor) || ACCENT_OPTIONS[0];
          setActiveWallet({
            name: first.name,
            balance: first.balance,
            design: matchedDesign,
            accent: matchedAccent,
          });
          setCurrentView('dashboard');
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

    const newWalletData = {
      name: walletName.trim(),
      balance: balance,
      design: selectedDesign,
      accent: selectedAccent,
    };

    // Simpan ke Supabase
    await insertDompet({
      userId: currentUserId,
      name: walletName.trim(),
      balance: balance,
      cardBackground: selectedDesign.bgPrimary,
      cardColor: selectedAccent.textColor,
    });

    // Simpan status aktif ke AsyncStorage agar terkunci di Dashboard
    await AsyncStorage.setItem(
      `@uts_active_wallet_${currentUserId}`,
      JSON.stringify(newWalletData)
    );

    setActiveWallet(newWalletData);
    setLoadingAction({ visible: false, message: '' });

    // Langsung masuk dan kunci ke Dashboard (tidak bisa kembali ke pilih tema)
    setCurrentView('dashboard');
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

  async function handleResetWalletTheme() {
    // Tombol opsional jika user benar-benar ingin buat tema baru dari awal
    Alert.alert(
      'Ubah Tema Dompet',
      'Apakah Anda ingin mengatur ulang tema dompet ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ubah Tema',
          onPress: async () => {
            await AsyncStorage.removeItem(`@uts_active_wallet_${currentUserId}`);
            setCurrentView('input');
          },
        },
      ]
    );
  }

  // ==========================================
  // VIEW: DASHBOARD DOMPET UTAMA (TERKUNCI)
  // Tidak ada tombol back ke pilih tema
  // ==========================================
  if (currentView === 'dashboard') {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <LoadingUI visible={loadingAction.visible} message={loadingAction.message} />

        {/* Top Header Dashboard Resmi */}
        <View className="flex-row items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 items-center justify-center mr-2.5">
              <Ionicons name="wallet" size={17} color="#4f46e5" />
            </View>
            <View>
              <Text className="text-[16px] font-extrabold text-[#0f172a]">Dashboard Dompet</Text>
              <Text className="text-[11px] font-semibold text-emerald-600">● Aktif: {activeWallet.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleCancelOrBack}
            activeOpacity={0.7}
            className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-lg border border-red-200"
          >
            <Feather name="log-out" size={13} color="#dc2626" />
            <Text className="text-[11.5px] font-bold text-red-600 ml-1">Keluar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Kartu Dompet Pilihan User */}
          <View
            style={{
              backgroundColor: activeWallet.design.bgPrimary,
              borderRadius: 22,
              padding: 24,
              marginBottom: 20,
              shadowColor: activeWallet.design.bgSecondary,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.35,
              shadowRadius: 18,
              elevation: 10,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: -40,
                left: -30,
                width: 170,
                height: 170,
                borderRadius: 85,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -50,
                right: -20,
                width: 190,
                height: 190,
                borderRadius: 95,
                backgroundColor: 'rgba(0, 0, 0, 0.18)',
              }}
            />

            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View
                  style={{
                    width: 40,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: '#eab308',
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ height: 1.5, backgroundColor: 'rgba(113, 63, 18, 0.35)', width: '100%' }} />
                  <View style={{ height: 1.5, backgroundColor: 'rgba(113, 63, 18, 0.35)', width: '75%' }} />
                  <View style={{ height: 1.5, backgroundColor: 'rgba(113, 63, 18, 0.35)', width: '100%' }} />
                </View>

                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1.2,
                    borderColor: 'rgba(255,255,255,0.65)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}
                >
                  <MaterialCommunityIcons name="contactless-payment" size={14} color="rgba(255,255,255,0.9)" />
                </View>
              </View>

              <View
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.45)',
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 999,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#34d399', marginRight: 6 }} />
                <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '700', letterSpacing: 0.8 }}>
                  PAYNEX E-WALLET
                </Text>
              </View>
            </View>

            <View className="mb-6">
              <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600', letterSpacing: 0.8 }}>
                SALDO TERSEDIA
              </Text>
              <Text style={{ color: activeWallet.accent.textColor, fontSize: 32, fontWeight: '800', marginTop: 2 }}>
                Rp {formatRupiah(activeWallet.balance)}
              </Text>
            </View>

            <View className="flex-row items-end justify-between">
              <View className="flex-1 mr-4">
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9.5, fontWeight: '600', letterSpacing: 0.8 }}>
                  NAMA DOMPET
                </Text>
                <Text numberOfLines={1} style={{ color: activeWallet.accent.textColor, fontSize: 16, fontWeight: '700', marginTop: 2 }}>
                  {activeWallet.name}
                </Text>
              </View>

              <View className="items-end">
                <Text style={{ color: activeWallet.accent.textColor, fontSize: 11.5, fontWeight: '700', letterSpacing: 1.5 }}>
                  ••••  9021
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '600', letterSpacing: 0.5, marginTop: 2 }}>
                  VALID THRU 12/29
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Action Menus */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-5">
            <Text className="text-[13px] font-bold text-[#1e293b] mb-3">Menu Transaksi Cepat</Text>
            <View className="flex-row items-center justify-around">
              <TouchableOpacity
                onPress={() => {
                  setActiveWallet((prev) => ({ ...prev, balance: prev.balance + 100000 }));
                  Alert.alert('Top Up Berhasil', 'Saldo bertambah Rp 100.000');
                }}
                className="items-center"
              >
                <View className="w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center mb-1.5 border border-indigo-100">
                  <Feather name="plus-circle" size={22} color="#4f46e5" />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700">Top Up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('Transfer', 'Fitur transfer saldo siap digunakan')}
                className="items-center"
              >
                <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center mb-1.5 border border-emerald-100">
                  <Feather name="arrow-up-right" size={22} color="#059669" />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700">Transfer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('Riwayat Transaksi', 'Belum ada transaksi riwayat baru')}
                className="items-center"
              >
                <View className="w-12 h-12 rounded-2xl bg-amber-50 items-center justify-center mb-1.5 border border-amber-100">
                  <Feather name="clock" size={22} color="#d97706" />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700">Riwayat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert('QRIS Bayar', 'Fitur scan QRIS siap digunakan')}
                className="items-center"
              >
                <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mb-1.5 border border-blue-100">
                  <MaterialCommunityIcons name="qrcode-scan" size={20} color="#2563eb" />
                </View>
                <Text className="text-[11px] font-semibold text-slate-700">Bayar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Riwayat Transaksi Card */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[13px] font-bold text-[#1e293b]">Status Dompet</Text>
              <Text className="text-[11px] text-emerald-600 font-semibold">Tersinkron Supabase</Text>
            </View>
            <View className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <Text className="text-xs text-slate-600">
                Dompet Anda telah aktif dengan tema <Text className="font-bold text-slate-800">{activeWallet.design.name}</Text>. Semua pencatatan transaksi akan otomatis terhubung ke akun Anda.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // VIEW: FORM INPUT / PEMILIHAN TEMA PERTAMA KALI
  // ==========================================
  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoadingUI visible={loadingAction.visible} message={loadingAction.message} />

      {/* Top Header */}
      <View className="flex-row items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
        <View className="flex-row items-center">
          <Text className="text-[17px] font-bold text-[#0f172a]">Atur Dompet & Tema</Text>
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

            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
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
                  <View style={{ height: 1.5, backgroundColor: 'rgba(113, 63, 18, 0.35)', width: '100%' }} />
                  <View style={{ height: 1.5, backgroundColor: 'rgba(113, 63, 18, 0.35)', width: '75%' }} />
                  <View style={{ height: 1.5, backgroundColor: 'rgba(113, 63, 18, 0.35)', width: '100%' }} />
                </View>

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
                  <MaterialCommunityIcons name="contactless-payment" size={13} color="rgba(255,255,255,0.9)" />
                </View>
              </View>

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
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#34d399', marginRight: 6 }} />
                <Text style={{ color: '#ffffff', fontSize: 9.5, fontWeight: '700', letterSpacing: 0.7 }}>
                  PAYNEX E-WALLET
                </Text>
              </View>
            </View>

            <View className="mb-6">
              <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 10, fontWeight: '600', letterSpacing: 0.8 }}>
                SALDO TERSEDIA
              </Text>
              <Text style={{ color: selectedAccent.textColor, fontSize: 27, fontWeight: '800', marginTop: 2 }}>
                Rp {formatRupiah(balance)}
              </Text>
            </View>

            <View className="flex-row items-end justify-between">
              <View className="flex-1 mr-4">
                <Text style={{ color: 'rgba(255,255,255,0.68)', fontSize: 9, fontWeight: '600', letterSpacing: 0.8 }}>
                  NAMA DOMPET
                </Text>
                <Text numberOfLines={1} style={{ color: selectedAccent.textColor, fontSize: 15, fontWeight: '700', marginTop: 2 }}>
                  {walletName.trim() || 'Dompet Utama'}
                </Text>
              </View>

              <View className="items-end">
                <Text style={{ color: selectedAccent.textColor, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }}>
                  ••••  9021
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.68)', fontSize: 9, fontWeight: '600', letterSpacing: 0.5, marginTop: 2 }}>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
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
                    <Text style={{ color: isSelected ? '#312e81' : '#334155', fontSize: 12, fontWeight: '600' }}>
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
              <Text className="text-[11px] font-semibold text-[#15803d]">Bebas Biaya Admin</Text>
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
              <Text className="text-[13.5px] font-bold text-[#1e293b]">Pilihan Desain Kartu</Text>
              <Text className="text-[11px] text-[#64748b]">{selectedDesign.name}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              {CARD_DESIGNS.map((design) => {
                const isSelected = design.id === selectedDesignId;
                return (
                  <TouchableOpacity
                    key={design.id}
                    activeOpacity={0.8}
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
              <Text className="text-[13.5px] font-bold text-[#1e293b]">Warna Huruf & Aksen</Text>
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
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#0f172a' }}>
                      {accent.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bottom CTA Button: Simpan dan Kunci Masuk Dashboard */}
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
            <MaterialCommunityIcons name="credit-card-plus-outline" size={18} color="#ffffff" />
            <Text className="text-white font-bold text-[14.5px] ml-2">Simpan & Buka Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
