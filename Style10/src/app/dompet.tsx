import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

// Desain "Tambah Dompet" (template Paynex) — v5 untuk Style10.
// Logika Supabase-nya tetap seperti v4 yang sudah terbukti jalan:
// kolom di Table Editor huruf kecil semua (userid, cardbackground,
// cardcolor), jadi insert pakai nama itu persis. Satu tambahan dari
// template: chip kategori (Harian / Tabungan / ...) disimpan di kolom
// `category`. Kalau kolom itu belum ada di tabel, jalankan dulu SQL
// di sql/tambah-kolom-category.sql di Supabase SQL Editor (sekali saja),
// baru tes simpan. Tanpa kolom itu, insert akan ditolak.
type Dompet = {
  id: number;
  userid: string;
  name: string;
  balance: number;
  cardbackground: string;
  cardcolor: string;
  category?: string | null;
};

const DESIGNS = [
  { name: 'Indigo Royale', color: '#4F46E5' },
  { name: 'Sunset Orange', color: '#F97316' },
  { name: 'Midnight Black', color: '#111827' },
  { name: 'Ocean Blue', color: '#2563EB' },
];

const TEXT_COLORS = [
  { name: 'Putih', label: 'Putih Cerah', color: '#FFFFFF' },
  { name: 'Gold', label: 'Emas', color: '#FFD700' },
  { name: 'Silver', label: 'Perak', color: '#C0C0C0' },
  { name: 'Cyan', label: 'Cyan', color: '#22D3EE' },
];

const CATEGORIES = ['Harian', 'Tabungan', 'Belanja', 'Bisnis', 'Darurat'];
const QUICK_ADD = [
  { label: '+ 100 Rb', value: 100000 },
  { label: '+ 500 Rb', value: 500000 },
  { label: '+ 1 Juta', value: 1000000 },
];

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function parseBalance(s: string) {
  if (s.trim() === '') return 0;
  const n = parseInt(s.replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

export default function DompetScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [dompets, setDompet] = useState<Dompet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('Dompet Utama');
  const [category, setCategory] = useState('Harian');
  const [balance, setBalance] = useState('0');
  const [design, setDesign] = useState(DESIGNS[0]);
  const [textColor, setTextColor] = useState(TEXT_COLORS[0]);

  async function loadDompet(uid: string) {
    const { data, error } = await supabase
      .from('dompet')
      .select()
      .eq('userid', uid)
      .order('created_at', { ascending: false });
    if (error) {
      setErrorMsg('Gagal memuat dompet: ' + error.message);
      Alert.alert('Gagal memuat dompet', error.message);
      return;
    }
    setDompet((data ?? []) as Dompet[]);
  }

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace('/login' as never);
        return;
      }
      setUserId(session.user.id);
      await loadDompet(session.user.id);
      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    if (!userId) return;
    setErrorMsg('');
    if (!name.trim()) {
      Alert.alert('Belum lengkap', 'Isi nama dompet dulu.');
      return;
    }
    const parsed = parseBalance(balance);
    if (parsed < 0) {
      Alert.alert('Saldo tidak valid', 'Saldo harus angka 0 atau lebih.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('dompet').insert([
      {
        userid: userId,
        name: name.trim(),
        balance: parsed,
        cardbackground: design.color,
        cardcolor: textColor.color,
        category,
      },
    ]);
    setSaving(false);
    if (error) {
      const hint = error.message.includes('category')
        ? ' (kolom category belum ada — jalankan dulu sql/tambah-kolom-category.sql di Supabase SQL Editor)'
        : '';
      setErrorMsg('Gagal menyimpan dompet: ' + error.message + hint);
      Alert.alert('Gagal menyimpan dompet', error.message);
      return;
    }
    setName('Dompet Utama');
    setCategory('Harian');
    setBalance('0');
    setDesign(DESIGNS[0]);
    setTextColor(TEXT_COLORS[0]);
    await loadDompet(userId);
  }

  const balanceValue = parseBalance(balance);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={26} color={Colors.text} />
            </Pressable>
            <Text style={styles.title}>Tambah Dompet</Text>
            <View style={{ width: 26 }} />
          </View>

          {/* Kartu preview — sesuai template */}
          <View style={[styles.cardPreview, { backgroundColor: design.color }]}>
            <View style={styles.cardTop}>
              <View style={styles.cardChipRow}>
                <View style={styles.cardChip} />
                <Ionicons name="ellipse-outline" size={16} color={textColor.color} />
              </View>
              <View style={styles.brandRow}>
                <View style={styles.greenDot} />
                <Text style={[styles.brand, { color: textColor.color }]}>PAYNEX E-WALLET</Text>
              </View>
            </View>
            <Text style={[styles.cardLabel, { color: textColor.color }]}>SALDO TERSEDIA</Text>
            <Text style={[styles.cardBalance, { color: textColor.color }]}>
              {formatRupiah(balanceValue)}
            </Text>
            <View style={styles.cardBottom}>
              <View>
                <Text style={[styles.cardLabel, { color: textColor.color }]}>NAMA DOMPET</Text>
                <Text style={[styles.cardName, { color: textColor.color }]}>
                  {name.trim() || 'Dompet Utama'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.cardNumber, { color: textColor.color }]}>**** 9821</Text>
                <Text style={[styles.cardLabel, { color: textColor.color }]}>VALID THRU 12/29</Text>
              </View>
            </View>
          </View>

          {/* Nama Dompet */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Nama Dompet</Text>
            <Text style={styles.required}>Wajib diisi</Text>
          </View>
          <View style={styles.inputBox}>
            <Ionicons name="wallet-outline" size={20} color={Colors.muted} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Dompet Utama"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.chips}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[styles.chip, category === c && styles.chipActive]}>
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>

          {/* Saldo Awal */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Saldo Awal</Text>
            <Text style={styles.free}>Bebas Biaya Admin</Text>
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.rp}>Rp</Text>
            <TextInput
              style={styles.input}
              value={balance}
              onChangeText={(t) => setBalance(t.replace(/[^0-9]/g, ''))}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.helper}>Saldo saat dompet baru ini dibuat (default Rp 0).</Text>
          <View style={styles.quickRow}>
            {QUICK_ADD.map((q) => (
              <Pressable
                key={q.label}
                onPress={() => setBalance(String(balanceValue + q.value))}
                style={styles.quickBtn}>
                <Text style={styles.quickText}>{q.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Pilihan Desain Kartu */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Pilihan Desain Kartu</Text>
            <Text style={styles.selectedName}>{design.name}</Text>
          </View>
          <View style={styles.swatches}>
            {DESIGNS.map((d) => (
              <Pressable
                key={d.name}
                onPress={() => setDesign(d)}
                style={[styles.swatch, { backgroundColor: d.color }]}>
                {design.name === d.name ? (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                ) : null}
              </Pressable>
            ))}
          </View>

          {/* Warna Huruf & Aksen */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Warna Huruf & Aksen</Text>
            <Text style={styles.selectedName}>{textColor.label}</Text>
          </View>
          <View style={styles.chips}>
            {TEXT_COLORS.map((t) => (
              <Pressable
                key={t.name}
                onPress={() => setTextColor(t)}
                style={[
                  styles.colorChip,
                  textColor.name === t.name && styles.colorChipActive,
                ]}>
                <View style={[styles.colorDot, { backgroundColor: t.color }]} />
                <Text style={styles.chipText}>{t.name}</Text>
              </Pressable>
            ))}
          </View>

          {/* Integrasi Transaksi Otomatis */}
          <View style={styles.infoBox}>
            <Ionicons name="repeat-outline" size={22} color={Colors.green} />
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Integrasi Transaksi Otomatis{'\n'}</Text>
              Dompet ini siap ditautkan ke akun Anda untuk pencatatan riwayat
              Cash-In (CI) dan Cash-Out (CO) secara real-time.
            </Text>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}>
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveText}>{saving ? 'Menyimpan...' : 'Simpan Dompet'}</Text>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Batal</Text>
          </Pressable>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Daftar dompet yang sudah tersimpan — bukti simpan berhasil */}
          <Text style={[styles.label, { marginTop: 28 }]}>Daftar Dompet Saya</Text>
          {loading ? (
            <Text style={styles.empty}>Memuat dompet...</Text>
          ) : dompets.length === 0 ? (
            <Text style={styles.empty}>Belum ada dompet. Simpan satu lewat form di atas.</Text>
          ) : (
            dompets.map((item) => (
              <View
                key={item.id}
                style={[styles.listCard, { backgroundColor: item.cardbackground }]}>
                <Text style={[styles.listName, { color: item.cardcolor }]}>{item.name}</Text>
                <Text style={[styles.listSub, { color: item.cardcolor }]}>
                  {item.category ? `${item.category} • ` : ''}
                  {formatRupiah(item.balance)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
  },
  title: { fontFamily: Fonts.semiBold, fontSize: 20, color: Colors.text },
  cardPreview: { borderRadius: 16, padding: 18, minHeight: 170 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardChipRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardChip: { width: 30, height: 20, borderRadius: 4, backgroundColor: '#FFC300' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  brand: { fontFamily: Fonts.semiBold, fontSize: 11, letterSpacing: 0.5 },
  cardLabel: { fontFamily: Fonts.regular, fontSize: 10, letterSpacing: 1, opacity: 0.85 },
  cardBalance: { fontFamily: Fonts.semiBold, fontSize: 28, marginTop: 2 },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 18,
  },
  cardName: { fontFamily: Fonts.semiBold, fontSize: 18, marginTop: 2 },
  cardNumber: { fontFamily: Fonts.medium, fontSize: 13 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  label: { fontFamily: Fonts.semiBold, fontSize: 15, color: Colors.text },
  required: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.muted },
  free: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.green },
  selectedName: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.muted },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    gap: 8,
  },
  input: { flex: 1, fontFamily: Fonts.regular, fontSize: 15, color: Colors.text },
  rp: { fontFamily: Fonts.semiBold, fontSize: 15, color: Colors.text },
  helper: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.muted, marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
  },
  chipActive: { backgroundColor: '#4F46E5' },
  chipText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text },
  chipTextActive: { color: '#FFFFFF' },
  quickRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  quickBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
  },
  quickText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text },
  swatches: { flexDirection: 'row', gap: 14, marginTop: 4 },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorChipActive: { borderColor: '#4F46E5', backgroundColor: '#EEEDFF' },
  colorDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: Colors.border },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },
  infoText: { flex: 1, fontFamily: Fonts.regular, fontSize: 12, color: '#166534', lineHeight: 17 },
  infoBold: { fontFamily: Fonts.semiBold },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
  },
  saveText: { fontFamily: Fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
  cancelBtn: { alignItems: 'center', paddingVertical: 14 },
  cancelText: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text },
  errorText: { fontFamily: Fonts.regular, fontSize: 13, color: '#CC0000', marginTop: 8, textAlign: 'center' },
  empty: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.muted, marginTop: 8 },
  listCard: { padding: 18, borderRadius: 14, marginTop: 10 },
  listName: { fontFamily: Fonts.medium, fontSize: 16 },
  listSub: { fontFamily: Fonts.semiBold, fontSize: 18, marginTop: 6 },
});
