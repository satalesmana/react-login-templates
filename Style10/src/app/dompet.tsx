import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundCircles from '@/components/BackgroundCircles';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors, Fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

// PENTING: di Supabase Table Editor, kolomnya tampil huruf kecil semua:
// userid, cardbackground, cardcolor (bukan userId / cardBackground).
// Itu karena SQL blog tidak pakai tanda kutip, jadi Postgres melipat
// nama kolom camelCase jadi huruf kecil. Insert lama pakai userId
// makanya ditolak dan tabel tetap kosong. Versi ini pakai nama kolom
// persis seperti di Table Editor.
type Dompet = {
  id: number;
  userid: string;
  name: string;
  balance: number;
  cardbackground: string;
  cardcolor: string;
};

const BACKGROUNDS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#7C5CFF', '#2ECC71'];
const TEXT_COLORS = ['#FFFFFF', '#1A1A1A'];

function formatRupiah(n: number) {
  return 'Rp.' + n.toLocaleString('id-ID');
}

export default function DompetScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [dompets, setDompet] = useState<Dompet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [cardBackground, setCardBackground] = useState(BACKGROUNDS[0]);
  const [cardColor, setCardColor] = useState(TEXT_COLORS[0]);

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
      Alert.alert('Belum lengkap', 'Isi nama dompet dulu, misal "Dompet Utama".');
      return;
    }
    const parsed = balance.trim() === '' ? 0 : parseInt(balance.replace(/[^0-9-]/g, ''), 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      Alert.alert('Saldo tidak valid', 'Saldo harus angka 0 atau lebih.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('dompet').insert([
      {
        userid: userId,
        name: name.trim(),
        balance: parsed,
        cardbackground: cardBackground,
        cardcolor: cardColor,
      },
    ]);
    setSaving(false);
    if (error) {
      // Tampilkan juga di layar, bukan cuma Alert, supaya di web tidak kelewat.
      setErrorMsg('Gagal menyimpan dompet: ' + error.message);
      Alert.alert('Gagal menyimpan dompet', error.message);
      return;
    }
    setName('');
    setBalance('');
    await loadDompet(userId);
  }

  const total = dompets.reduce((sum, d) => sum + (d.balance || 0), 0);

  return (
    <View style={styles.container}>
      <BackgroundCircles height={220} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color={Colors.text} />
            </Pressable>
            <Text style={styles.title}>Dompet Saya</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total saldo</Text>
            <Text style={styles.totalValue}>{formatRupiah(total)}</Text>
            <Text style={styles.totalSub}>
              {dompets.length} dompet tersimpan di Supabase
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Tambah dompet</Text>
          <InputField placeholder="Nama dompet, misal Dompet Utama" value={name} onChangeText={setName} />
          <InputField
            placeholder="Saldo awal, misal 18000"
            keyboardType="numeric"
            value={balance}
            onChangeText={setBalance}
            style={{ marginTop: 10 }}
          />

          <Text style={styles.label}>Warna kartu</Text>
          <View style={styles.swatches}>
            {BACKGROUNDS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCardBackground(c)}
                style={[
                  styles.swatch,
                  { backgroundColor: c },
                  cardBackground === c && styles.swatchActive,
                ]}
              />
            ))}
          </View>

          <Text style={styles.label}>Warna tulisan</Text>
          <View style={styles.swatches}>
            {TEXT_COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCardColor(c)}
                style={[
                  styles.swatch,
                  { backgroundColor: c, borderWidth: 1, borderColor: Colors.border },
                  cardColor === c && styles.swatchActive,
                ]}
              />
            ))}
          </View>

          <View style={[styles.preview, { backgroundColor: cardBackground }]}>
            <Text style={[styles.previewName, { color: cardColor }]}>
              {name.trim() || 'Nama dompet'}
            </Text>
            <Text style={[styles.previewBalance, { color: cardColor }]}>
              {formatRupiah(balance.trim() === '' ? 0 : parseInt(balance.replace(/[^0-9-]/g, ''), 10) || 0)}
            </Text>
          </View>

          <PrimaryButton
            title={saving ? 'Menyimpan...' : 'Simpan Dompet'}
            onPress={handleSave}
            style={{ marginTop: 16 }}
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Daftar dompet</Text>
          {loading ? (
            <Text style={styles.empty}>Memuat dompet...</Text>
          ) : dompets.length === 0 ? (
            <Text style={styles.empty}>
              Belum ada dompet. Tambah satu lewat form di atas.
            </Text>
          ) : (
            dompets.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { backgroundColor: item.cardbackground }]}>
                <Text style={[styles.cardName, { color: item.cardcolor }]}>{item.name}</Text>
                <Text style={[styles.cardBalance, { color: item.cardcolor }]}>
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
  },
  title: { fontFamily: Fonts.medium, fontSize: 22, color: Colors.text },
  totalCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    backgroundColor: Colors.circleLight,
  },
  totalLabel: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.muted },
  totalValue: { fontFamily: Fonts.semiBold, fontSize: 24, color: Colors.text, marginTop: 4 },
  totalSub: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.muted, marginTop: 4 },
  sectionTitle: { fontFamily: Fonts.semiBold, fontSize: 18, color: Colors.text, marginTop: 24, marginBottom: 12 },
  label: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text, marginTop: 16, marginBottom: 10 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatch: { width: 40, height: 40, borderRadius: 20 },
  swatchActive: { borderWidth: 3, borderColor: Colors.text },
  preview: { marginTop: 18, padding: 18, borderRadius: 14 },
  previewName: { fontFamily: Fonts.medium, fontSize: 16 },
  previewBalance: { fontFamily: Fonts.semiBold, fontSize: 20, marginTop: 6 },
  errorText: { fontFamily: Fonts.regular, fontSize: 13, color: '#CC0000', marginTop: 12, textAlign: 'center' },
  empty: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.muted, textAlign: 'center', marginTop: 12 },
  card: { padding: 18, borderRadius: 14, marginBottom: 12 },
  cardName: { fontFamily: Fonts.medium, fontSize: 16 },
  cardBalance: { fontFamily: Fonts.semiBold, fontSize: 20, marginTop: 6 },
});
