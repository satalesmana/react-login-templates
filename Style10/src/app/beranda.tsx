import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

// Beranda Paynex untuk Style10 (v7) — layar baru, sesuai gambar Fal.
// BUKAN Redux (Style10 tidak pakai Redux): semua angka dibaca langsung
// dari Supabase, sama seperti dompet v6:
//  - dompet: tabel `dompet` (userid, name, balance, cardbackground,
//    cardcolor, category)
//  - transaksi: tabel `transaksi_dompet` (userid, dompetid, jenis
//    'in'/'out', amount, note, created_at)
//  - nama: session.user.user_metadata.name (diisi saat register),
//    fallback ke nama profil Style10.
// Alur: login/register sekarang lempar ke /beranda (bukan /main lagi).
// Main (MiniShop) tetap ada, dibuka lewat tab Profil di bawah.
// Cash-In / Cash-Out di sini larinya ke /dompet — di sana tap dompetnya,
// lalu pakai tombol In / Out + histori v6. Tab Transaksi juga ke /dompet
// dulu, karena histori lengkapnya ada di detail dompet v6.
type Dompet = {
  id: number;
  userid: string;
  name: string;
  balance: number;
  cardbackground: string;
  cardcolor: string;
  category?: string | null;
};

type Transaksi = {
  id: number;
  userid: string;
  dompetid: number;
  jenis: 'in' | 'out';
  amount: number;
  note: string | null;
  created_at: string;
};

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function formatTanggal(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// Data dummy transaksi — HANYA tampil di layar, TIDAK masuk Supabase.
// Dipakai cuma kalau akun ini belum punya transaksi asli, biar Beranda
// nggak kosongan pas demo. Begitu ada 1 transaksi asli (In/Out lewat
// /dompet), dummy ini otomatis hilang dan yang tampil data asli.
// Isinya ngikutin gambar Beranda yang dikirim Fal.
const DUMMY_TX: Transaksi[] = [
  { id: 9001, userid: '', dompetid: 0, jenis: 'in', amount: 2000000, note: 'Transfer dari BCA', created_at: '2026-03-14T14:20:00' },
  { id: 9002, userid: '', dompetid: 0, jenis: 'out', amount: 38000, note: 'Kopi Kenangan (QRIS)', created_at: '2026-03-13T10:15:00' },
  { id: 9003, userid: '', dompetid: 0, jenis: 'in', amount: 10000000, note: 'Gaji Bulanan - PT Dig', created_at: '2026-03-12T09:00:00' },
  { id: 9004, userid: '', dompetid: 0, jenis: 'out', amount: 450000, note: 'Tagihan Listrik PLN', created_at: '2026-03-12T00:00:00' },
];
const DUMMY_DOMPET: Record<number, string> = {
  9001: 'Dompet Utama',
  9002: 'Belanja Harian',
  9003: 'Masa Depan',
  9004: 'Dompet Utama',
};

export default function BerandaScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Falaah Hamid Hutasoit');
  const [dompets, setDompets] = useState<Dompet[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState<'semua' | 'in' | 'out'>('semua');

  const loadAll = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      router.replace('/login' as never);
      return;
    }
    const metaName = (session.user.user_metadata as { name?: string } | undefined)?.name;
    if (metaName) setUserName(metaName);

    const { data: dompetData, error: dompetError } = await supabase
      .from('dompet')
      .select()
      .eq('userid', session.user.id)
      .order('created_at', { ascending: true });
    if (dompetError) {
      setErrorMsg('Gagal memuat dompet: ' + dompetError.message);
      setLoading(false);
      return;
    }
    setDompets((dompetData ?? []) as Dompet[]);

    const { data: txData, error: txError } = await supabase
      .from('transaksi_dompet')
      .select()
      .eq('userid', session.user.id)
      .order('created_at', { ascending: false });
    if (txError) {
      setErrorMsg('Gagal memuat transaksi: ' + txError.message);
      setLoading(false);
      return;
    }
    setTransaksi((txData ?? []) as Transaksi[]);
    setLoading(false);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll]),
  );

  const totalSaldo = dompets.reduce((s, d) => s + (d.balance || 0), 0);
  const totalMasuk = transaksi
    .filter((t) => t.jenis === 'in')
    .reduce((s, t) => s + (t.amount || 0), 0);
  const totalKeluar = transaksi
    .filter((t) => t.jenis === 'out')
    .reduce((s, t) => s + (t.amount || 0), 0);

  // Kalau belum ada transaksi asli, tampilkan dummy di list + di total
  // CI/CO, biar layarnya nggak Rp 0 semua. Begitu ada transaksi asli,
  // dummy mati sendiri.
  const usingDummyTx = !loading && transaksi.length === 0;
  const totalMasukDisplay = usingDummyTx
    ? DUMMY_TX.filter((t) => t.jenis === 'in').reduce((s, t) => s + t.amount, 0)
    : totalMasuk;
  const totalKeluarDisplay = usingDummyTx
    ? DUMMY_TX.filter((t) => t.jenis === 'out').reduce((s, t) => s + t.amount, 0)
    : totalKeluar;

  const sourceTx = usingDummyTx ? DUMMY_TX : transaksi;
  const filteredTx =
    filter === 'semua' ? sourceTx : sourceTx.filter((t) => t.jenis === filter);

  const dompetName = (id: number) =>
    dompets.find((d) => d.id === id)?.name ?? DUMMY_DOMPET[id] ?? 'Dompet';

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.topBar}>
            <Text style={styles.brand}>PAYNEX WALLET</Text>
            <View style={styles.topIcons}>
              <Ionicons name="notifications-outline" size={22} color={Colors.text} />
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>{initials || '?'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.greetingRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || '?'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>Halo, {userName} 👋</Text>
              <View style={styles.badges}>
                <Text style={styles.badge}>VIP Member</Text>
                <Text style={styles.badge}>Tier Platinum</Text>
              </View>
            </View>
          </View>

          {/* Total saldo */}
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>● TOTAL SALDO TERGABUNG</Text>
              <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.totalValue}>{formatRupiah(totalSaldo)}</Text>
            <View style={styles.ciCoRow}>
              <View style={styles.ciCoBox}>
                <Ionicons name="arrow-down-circle-outline" size={18} color="#4ADE80" />
                <Text style={styles.ciCoLabel}>Pemasukan (CI)</Text>
                <Text style={styles.ciCoValue}>+{formatRupiah(totalMasukDisplay)}</Text>
              </View>
              <View style={styles.ciCoBox}>
                <Ionicons name="arrow-up-circle-outline" size={18} color="#F87171" />
                <Text style={styles.ciCoLabel}>Pengeluaran (CO)</Text>
                <Text style={styles.ciCoValue}>-{formatRupiah(totalKeluarDisplay)}</Text>
              </View>
            </View>
          </View>

          {/* Cash-In / Cash-Out */}
          <View style={styles.actionRow}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => router.push('/dompet' as never)}>
              <Ionicons name="add-circle-outline" size={26} color={Colors.green} />
              <Text style={styles.actionTitle}>Cash-In</Text>
              <Text style={styles.actionSub}>Masuk / Top Up</Text>
            </Pressable>
            <Pressable
              style={styles.actionBtn}
              onPress={() => router.push('/dompet' as never)}>
              <Ionicons name="remove-circle-outline" size={26} color="#DC2626" />
              <Text style={styles.actionTitle}>Cash-Out</Text>
              <Text style={styles.actionSub}>Keluar / Tarik</Text>
            </Pressable>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Dompet Saya — bisa digeser ke samping */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Dompet Saya</Text>
            <Text style={styles.sectionCount}>{dompets.length} Dompet</Text>
            <Pressable onPress={() => router.push('/dompet' as never)}>
              <Text style={styles.addLink}>+ Tambah</Text>
            </Pressable>
          </View>
          {loading ? (
            <Text style={styles.empty}>Memuat dompet...</Text>
          ) : dompets.length === 0 ? (
            <Text style={styles.empty}>
              Belum ada dompet. Tambah satu lewat tombol + Tambah di atas.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
              {dompets.map((d, i) => {
                // Kartu ngikutin 2 gambar Fal:
                // - Dompet Utama / Rekening Utama: kartu indigo, label PAYNEX,
                //   **** 9021, "Saldo Tersedia", badge "Utama".
                // - Masa Depan / Tabungan & Dana Darurat: kartu hijau VAULT,
                //   **** 4108, "Saldo Terkunci", badge "+5.2% p.a.".
                // - Dompet lain (misal Belanja Harian): pakai warna desain
                //   yang dipilih pas Tambah Dompet, label PAYNEX, **** 9821.
                const cat = (d.category ?? '').toLowerCase();
                const isVault =
                  cat.includes('tabungan') ||
                  cat.includes('darurat') ||
                  d.name === 'Masa Depan';
                const isUtama = d.name === 'Dompet Utama' || i === 0;
                const cardBg = isVault ? '#0E7A5F' : d.cardbackground;
                const cardNum = d.name === 'Dompet Utama' ? '9021' : isVault ? '4108' : '9821';
                const topBadge = isVault ? 'VAULT' : 'PAYNEX';
                const saldoLabel = isVault ? 'Saldo Terkunci' : 'Saldo Tersedia';
                const rightBadge = isVault ? '+5.2% p.a.' : isUtama ? 'Utama' : null;
                const displayCat = isVault
                  ? 'TABUNGAN & DANA DARURAT'
                  : d.name === 'Dompet Utama'
                    ? 'REKENING UTAMA'
                    : d.name === 'Belanja Harian'
                      ? 'KANTONG PENGELUARAN'
                      : (d.category ?? 'Dompet').toUpperCase();
                return (
                  <Pressable
                    key={d.id}
                    onPress={() => router.push('/dompet' as never)}
                    style={[styles.walletCard, { backgroundColor: cardBg }]}>
                    <View style={styles.walletTopRow}>
                      <Text style={[styles.walletCat, { color: d.cardcolor }]} numberOfLines={2}>
                        {displayCat}
                      </Text>
                      <View style={styles.walletTopRight}>
                        <Ionicons
                          name={isVault ? 'lock-closed-outline' : 'cellular-outline'}
                          size={18}
                          color={d.cardcolor}
                        />
                        <Text style={[styles.walletTopBadge, { color: d.cardcolor }]}>
                          {topBadge}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.walletName, { color: d.cardcolor }]} numberOfLines={1}>
                      {d.name}
                    </Text>
                    <View style={styles.walletChipRow}>
                      <View style={styles.walletChip} />
                      <Text style={[styles.walletNum, { color: d.cardcolor }]}>
                        •••• {cardNum}
                      </Text>
                    </View>
                    <View style={styles.walletBottomRow}>
                      <View>
                        <Text style={[styles.walletLabel, { color: d.cardcolor }]}>
                          {saldoLabel}
                        </Text>
                        <Text style={[styles.walletBalance, { color: d.cardcolor }]}>
                          {formatRupiah(d.balance)}
                        </Text>
                      </View>
                      {rightBadge ? (
                        <Text style={[styles.walletBadge, { color: d.cardcolor }]}>
                          {rightBadge}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* Promo — contoh statis, sesuai gambar */}
          <View style={styles.promoCard}>
            <Ionicons name="flash-outline" size={26} color="#4F46E5" />
            <View style={{ flex: 1 }}>
              <Text style={styles.promoTitle}>PROMO SPESIAL · s/d 31 Mar</Text>
              <Text style={styles.promoText}>Cashback 20% Bayar Listrik &amp; QRIS</Text>
              <Text style={styles.promoSub}>Maksimal pengembalian Rp 50.000</Text>
            </View>
            <Pressable
              onPress={() => Alert.alert('Promo', 'Ini promo contoh dari gambar Beranda.')}
              style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Klaim</Text>
            </Pressable>
          </View>

          {/* Transaksi Terakhir */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Transaksi Terakhir</Text>
            <Pressable onPress={() => router.push('/dompet' as never)}>
              <Text style={styles.addLink}>Lihat Semua</Text>
            </Pressable>
          </View>
          {usingDummyTx ? (
            <Text style={styles.dummyNote}>
              Menampilkan data contoh — belum ada transaksi asli. Lakukan 1x Cash-In /
              Cash-Out lewat Dompet, contoh ini hilang sendiri.
            </Text>
          ) : null}
          <View style={styles.filterRow}>
            {(
              [
                { key: 'semua', label: 'Semua' },
                { key: 'in', label: 'Cash-In (Masuk)' },
                { key: 'out', label: 'Cash-Out (Keluar)' },
              ] as const
            ).map((f) => (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.filterChip, filter === f.key && styles.filterChipActive]}>
                <Text
                  style={[
                    styles.filterText,
                    filter === f.key && styles.filterTextActive,
                  ]}>
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {loading ? (
            <Text style={styles.empty}>Memuat transaksi...</Text>
          ) : filteredTx.length === 0 ? (
            <Text style={styles.empty}>
              Belum ada transaksi{filter === 'semua' ? '' : filter === 'in' ? ' masuk' : ' keluar'}.
              Coba Cash-In / Cash-Out lewat Dompet.
            </Text>
          ) : (
            filteredTx.slice(0, 10).map((t) => (
              <View key={t.id} style={styles.txRow}>
                <View
                  style={[
                    styles.txIcon,
                    { backgroundColor: t.jenis === 'in' ? '#DCFCE7' : '#FEE2E2' },
                  ]}>
                  <Ionicons
                    name={t.jenis === 'in' ? 'checkmark' : 'card-outline'}
                    size={18}
                    color={t.jenis === 'in' ? '#166534' : '#991B1B'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txTitle} numberOfLines={1}>
                    {t.note || (t.jenis === 'in' ? 'Cash-In' : 'Cash-Out')}
                  </Text>
                  <Text style={styles.txSub}>
                    {usingDummyTx ? DUMMY_DOMPET[t.id] ?? 'Dompet' : dompetName(t.dompetid)} ·{' '}
                    {formatTanggal(t.created_at)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: t.jenis === 'in' ? '#16A34A' : '#DC2626' },
                  ]}>
                  {t.jenis === 'in' ? '+' : '-'}
                  {formatRupiah(t.amount)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Bottom nav */}
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <Ionicons name="grid-outline" size={22} color="#4F46E5" />
            <Text style={[styles.navText, styles.navTextActive]}>Beranda</Text>
          </View>
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/dompet' as never)}>
            <Ionicons name="wallet-outline" size={22} color={Colors.muted} />
            <Text style={styles.navText}>Dompet</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/dompet' as never)}>
            <Ionicons name="swap-horizontal-outline" size={22} color={Colors.muted} />
            <Text style={styles.navText}>Transaksi</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/main' as never)}>
            <Ionicons name="person-outline" size={22} color={Colors.muted} />
            <Text style={styles.navText}>Profil</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F8' },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  brand: { fontFamily: Fonts.semiBold, fontSize: 13, letterSpacing: 1, color: Colors.text },
  topIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: { fontFamily: Fonts.semiBold, fontSize: 12, color: '#FFFFFF' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: Fonts.semiBold, fontSize: 18, color: Colors.text },
  greeting: { fontFamily: Fonts.semiBold, fontSize: 17, color: Colors.text },
  badges: { flexDirection: 'row', gap: 6, marginTop: 4 },
  badge: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: '#4F46E5',
    backgroundColor: '#EEEDFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  totalCard: {
    marginTop: 16,
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#4F46E5',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: Fonts.medium, fontSize: 11, letterSpacing: 1, color: '#FFFFFF' },
  totalValue: { fontFamily: Fonts.semiBold, fontSize: 28, color: '#FFFFFF', marginTop: 6 },
  ciCoRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  ciCoBox: { flex: 1 },
  ciCoLabel: { fontFamily: Fonts.regular, fontSize: 11, color: '#E0E7FF', marginTop: 4 },
  ciCoValue: { fontFamily: Fonts.semiBold, fontSize: 13, color: '#FFFFFF', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  actionTitle: { fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.text, marginTop: 6 },
  actionSub: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.muted, marginTop: 2 },
  errorText: { fontFamily: Fonts.regular, fontSize: 13, color: '#CC0000', marginTop: 12, textAlign: 'center' },
  dummyNote: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.muted,
    marginBottom: 8,
  },
  empty: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.muted, marginTop: 8 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: { fontFamily: Fonts.semiBold, fontSize: 16, color: Colors.text, flex: 1 },
  sectionCount: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.muted },
  addLink: { fontFamily: Fonts.semiBold, fontSize: 13, color: '#4F46E5' },
  walletCard: {
    width: 260,
    borderRadius: 20,
    padding: 16,
    minHeight: 165,
  },
  walletTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  walletCat: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.9,
    flex: 1,
    lineHeight: 15,
  },
  walletTopRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  walletTopBadge: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    letterSpacing: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  walletName: { fontFamily: Fonts.semiBold, fontSize: 20, marginTop: 4 },
  walletChipRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  walletChip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F5C542',
  },
  walletNum: { fontFamily: Fonts.medium, fontSize: 13, letterSpacing: 2 },
  walletBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    gap: 8,
  },
  walletLabel: { fontFamily: Fonts.regular, fontSize: 11, opacity: 0.85 },
  walletBalance: { fontFamily: Fonts.semiBold, fontSize: 18, marginTop: 2 },
  walletBadge: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  promoTitle: { fontFamily: Fonts.semiBold, fontSize: 11, color: '#4F46E5' },
  promoText: { fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.text, marginTop: 2 },
  promoSub: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.muted, marginTop: 2 },
  promoBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  promoBtnText: { fontFamily: Fonts.semiBold, fontSize: 12, color: '#FFFFFF' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#EDEDEF',
  },
  filterChipActive: { backgroundColor: '#4F46E5' },
  filterText: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.text },
  filterTextActive: { color: '#FFFFFF' },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text },
  txSub: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.muted, marginTop: 2 },
  txAmount: { fontFamily: Fonts.semiBold, fontSize: 14 },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navText: { fontFamily: Fonts.medium, fontSize: 11, color: Colors.muted },
  navTextActive: { color: '#4F46E5' },
});
