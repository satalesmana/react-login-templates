import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';

const categories = ['Harian', 'Tabungan', 'Belanja', 'Bisnis', 'Dana'];
const designs = [
  { name: 'Indigo Royale', colors: ['#4338ca', '#312e81'] as const },
  { name: 'Emerald', colors: ['#059669', '#065f46'] as const },
  { name: 'Sunset', colors: ['#f97316', '#c2410c'] as const },
  { name: 'Midnight', colors: ['#111827', '#030712'] as const },
  { name: 'Ocean', colors: ['#2563eb', '#0891b2'] as const },
];
const accents = [
  { name: 'Putih', color: '#ffffff' },
  { name: 'Gold', color: '#facc15' },
  { name: 'Silver', color: '#cbd5e1' },
  { name: 'Cyan', color: '#22d3ee' },
];
const quickAmounts = [
  { label: '+ 100 Rb', amount: 100_000 },
  { label: '+ 500 Rb', amount: 500_000 },
  { label: '+ 1 Juta', amount: 1_000_000 },
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value);

export default function DompetScreen() {
  const [namaDompet, setNamaDompet] = useState('Dompet Utama');
  const [saldo, setSaldo] = useState('0');
  const [kategori, setKategori] = useState('Harian');
  const [desainIndex, setDesainIndex] = useState(0);
  const [warnaAksen, setWarnaAksen] = useState('Putih');
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const desain = designs[desainIndex];
  const saldoAngka = Number(saldo) || 0;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Logout gagal', error.message);
        return;
      }

      router.replace('/login');
    } catch (error) {
      Alert.alert(
        'Logout gagal',
        error instanceof Error ? error.message : 'Silakan coba lagi.',
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const handleTambahDompet = async () => {
    const nama = namaDompet.trim();
    const saldoAwal = Number(saldo);

    if (!nama) {
      Alert.alert('Periksa data', 'Nama dompet wajib diisi.');
      return;
    }

    if (!Number.isFinite(saldoAwal) || saldoAwal < 0) {
      Alert.alert('Periksa data', 'Masukkan saldo awal yang valid.');
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        Alert.alert('Gagal memeriksa sesi', userError.message);
        return;
      }

      if (!user) {
        Alert.alert('Sesi Habis', 'Silakan login terlebih dahulu.');
        router.replace('/login');
        return;
      }

      const { error } = await supabase.from('dompet').insert({
        user_id: user.id,
        nama_dompet: nama,
        saldo_awal: saldoAwal,
        pilihan_desain: desain.name,
        warna_aksen: warnaAksen,
      });

      if (error) {
        Alert.alert('Gagal menyimpan dompet', error.message);
        return;
      }

      Alert.alert('Berhasil', 'Dompet berhasil ditambahkan.');
      router.back();
    } catch (error) {
      Alert.alert(
        'Terjadi kesalahan',
        error instanceof Error ? error.message : 'Silakan coba lagi.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.screen}>
          <View style={styles.header}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Kembali"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={21} color="#1e1b4b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tambah Dompet</Text>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={loggingOut}
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>
                {loggingOut ? 'Keluar...' : 'Keluar'}
              </Text>
            </TouchableOpacity>
          </View>

          <LinearGradient colors={desain.colors} style={styles.walletCard}>
            <View style={styles.cardTop}>
              <View style={styles.cardBrand}>
                <View style={styles.brandMark}>
                  <Ionicons name="card" size={17} color="#facc15" />
                </View>
                <Ionicons name="radio-button-on" size={13} color="#c7d2fe" />
              </View>
              <View style={styles.cardBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.cardBadgeText}>PAYNEX E-WALLET</Text>
              </View>
            </View>

            <View style={styles.balancePreview}>
              <Text style={styles.cardEyebrow}>SALDO TERSEDIA</Text>
              <Text style={styles.cardBalance}>Rp {formatRupiah(saldoAngka)}</Text>
            </View>

            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardEyebrow}>NAMA DOMPET</Text>
                <Text numberOfLines={1} style={styles.cardName}>
                  {namaDompet.trim() || 'Dompet Utama'}
                </Text>
              </View>
              <View style={styles.cardExpiry}>
                <Text style={styles.cardMeta}>•••• 9021</Text>
                <Text style={styles.cardMeta}>VALID THRU 12/29</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Nama Dompet</Text>
              <Text style={styles.required}>Wajib diisi</Text>
            </View>
            <View style={styles.inputWrap}>
              <Ionicons name="wallet-outline" size={17} color="#475569" />
              <TextInput
                accessibilityLabel="Nama Dompet"
                style={styles.nameInput}
                placeholder="Contoh: Dompet Utama"
                placeholderTextColor="#94a3b8"
                value={namaDompet}
                onChangeText={setNamaDompet}
                maxLength={40}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {categories.map((item) => {
                const selected = kategori === item;
                return (
                  <TouchableOpacity
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setKategori(item)}
                    style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selected && styles.categoryTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Saldo Awal</Text>
              <Text style={styles.noFee}>Bebas Biaya Admin</Text>
            </View>
            <View style={styles.balanceInputWrap}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                accessibilityLabel="Saldo Awal"
                style={styles.balanceInput}
                keyboardType="numeric"
                value={saldo}
                onChangeText={(value) => setSaldo(value.replace(/[^\d]/g, ''))}
              />
            </View>
            <Text style={styles.helperText}>
              Saldo saat dompet baru dibuat (default Rp 0).
            </Text>
            <View style={styles.quickAmountRow}>
              {quickAmounts.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  accessibilityRole="button"
                  onPress={() => setSaldo(String(saldoAngka + item.amount))}
                  style={styles.quickAmount}
                >
                  <Text style={styles.quickAmountText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Pilihan Desain Kartu</Text>
              <Text style={styles.selectionCaption}>{desain.name}</Text>
            </View>
            <View style={styles.designRow}>
              {designs.map((item, index) => {
                const selected = desainIndex === index;
                return (
                  <TouchableOpacity
                    key={item.name}
                    accessibilityRole="button"
                    accessibilityLabel={`Pilih desain ${item.name}`}
                    accessibilityState={{ selected }}
                    onPress={() => setDesainIndex(index)}
                    style={[
                      styles.designSwatch,
                      { backgroundColor: item.colors[0] },
                      selected && styles.designSwatchSelected,
                    ]}
                  >
                    {selected && <Ionicons name="checkmark" size={17} color="#fff" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Warna Huruf & Aksen</Text>
              <Text style={styles.selectionCaption}>{warnaAksen}</Text>
            </View>
            <View style={styles.accentRow}>
              {accents.map((item) => {
                const selected = warnaAksen === item.name;
                return (
                  <TouchableOpacity
                    key={item.name}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setWarnaAksen(item.name)}
                    style={[styles.accentChip, selected && styles.accentChipSelected]}
                  >
                    <View style={[styles.accentDot, { backgroundColor: item.color }]} />
                    <Text style={styles.accentText}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoIcon}>
              <Ionicons name="swap-horizontal" size={19} color="#059669" />
            </View>
            <Text style={styles.infoText}>
              Dompet siap digunakan setelah dibuat. Tambahkan transaksi dari halaman
              dompet untuk mencatat arus kas.
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            disabled={loading}
            onPress={handleTambahDompet}
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          >
            <Ionicons name="card-outline" size={17} color="#fff" />
            <Text style={styles.saveButtonText}>
              {loading ? 'Menyimpan...' : 'Simpan Dompet'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  screen: {
    width: '100%',
    maxWidth: 480,
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: '#faf9ff',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 34,
    height: 38,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#1e1b4b',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    minWidth: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 38,
  },
  logoutText: {
    color: '#4f46e5',
    fontSize: 11,
    fontWeight: '700',
  },
  walletCard: {
    height: 174,
    borderRadius: 19,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 17,
    shadowColor: '#312e81',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandMark: {
    width: 22,
    height: 17,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(15,23,42,0.35)',
  },
  onlineDot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#34d399',
  },
  cardBadgeText: {
    color: '#e0e7ff',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.35,
  },
  balancePreview: {
    gap: 3,
  },
  cardEyebrow: {
    color: '#c7d2fe',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.65,
  },
  cardBalance: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cardName: {
    maxWidth: 210,
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  cardExpiry: {
    alignItems: 'flex-end',
    gap: 3,
  },
  cardMeta: {
    color: '#c7d2fe',
    fontSize: 8,
    fontWeight: '600',
  },
  section: {
    marginBottom: 15,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  label: {
    color: '#1e293b',
    fontSize: 12,
    fontWeight: '700',
  },
  required: {
    color: '#64748b',
    fontSize: 9,
  },
  inputWrap: {
    height: 39,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: '#f0efff',
  },
  nameInput: {
    flex: 1,
    paddingVertical: 0,
    color: '#1e293b',
    fontSize: 12,
  },
  chipRow: {
    gap: 6,
    paddingTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e9eaff',
  },
  categoryChipSelected: {
    backgroundColor: '#d9dcff',
  },
  categoryText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#3730a3',
    fontWeight: '700',
  },
  noFee: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '600',
  },
  balanceInputWrap: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: '#f0efff',
  },
  currencyPrefix: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 9,
  },
  balanceInput: {
    flex: 1,
    paddingVertical: 0,
    color: '#1e293b',
    fontSize: 20,
    fontWeight: '700',
  },
  helperText: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 4,
  },
  quickAmountRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 8,
  },
  quickAmount: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f0efff',
  },
  quickAmountText: {
    color: '#3730a3',
    fontSize: 9,
    fontWeight: '600',
  },
  selectionCaption: {
    color: '#64748b',
    fontSize: 9,
  },
  designRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  designSwatch: {
    height: 42,
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  designSwatchSelected: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#312e81',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  accentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  accentChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#f0efff',
  },
  accentChipSelected: {
    backgroundColor: '#e2e4ff',
  },
  accentDot: {
    height: 9,
    width: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  accentText: {
    color: '#475569',
    fontSize: 9,
  },
  infoBox: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 11,
    marginTop: 1,
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: '#f0efff',
  },
  infoIcon: {
    height: 28,
    width: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a7f3d0',
  },
  infoText: {
    flex: 1,
    color: '#475569',
    fontSize: 9,
    lineHeight: 14,
  },
  saveButton: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 24,
    backgroundColor: '#3730c9',
    shadowColor: '#3730c9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 2,
  },
  cancelText: {
    color: '#64748b',
    fontSize: 11,
  },
});
