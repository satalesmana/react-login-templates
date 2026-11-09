import { supabase } from "../supabase";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ─── Palet warna ─────────────────────────────────────── */
const PRIMARY = "#6C63FF";
const ACCENT = "#38BDF8";
const BG = "#F5F6FA";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#1A1A2E";
const TEXT_GRAY = "#9A9AB0";

/* ─── Tipe data dompet ─────────────────────────────────── */
type Dompet = {
  id: number;
  nama_dompet: string;
  saldo: number;
  user_id: string;
  created_at: string;
};

/* ─── Helper format rupiah ─────────────────────────────── */
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

/* ─── Komponen utama ───────────────────────────────────── */
export default function DompetScreen() {
  const [namaDompet, setNamaDompet] = useState("");
  const [saldo, setSaldo] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [daftarDompet, setDaftarDompet] = useState<Dompet[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  /* Fetch daftar dompet milik user ini */
  const fetchDompet = useCallback(async (uid: string) => {
    setFetching(true);
    const { data, error } = await supabase
      .from("dompet")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Gagal memuat data", error.message);
    } else {
      setDaftarDompet(data ?? []);
    }
    setFetching(false);
  }, []);

  /* Ambil user yang sedang login */
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchDompet(user.id);
      } else {
        setFetching(false);
      }
    };
    getUser();
  }, [fetchDompet]);

  /* Total saldo semua dompet */
  const totalSaldo = daftarDompet.reduce((sum, d) => sum + (d.saldo ?? 0), 0);

  /* Simpan dompet baru */
  const handleTambah = async () => {
    if (!namaDompet.trim()) {
      Alert.alert("Error", "Nama dompet tidak boleh kosong.");
      return;
    }
    const nominalSaldo = parseFloat(saldo.replace(/[^0-9.]/g, "")) || 0;

    if (!userId) {
      Alert.alert("Error", "Sesi tidak ditemukan. Silakan login ulang.");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("dompet")
      .insert([{ nama_dompet: namaDompet.trim(), saldo: nominalSaldo, user_id: userId }]);
    setLoading(false);

    if (error) {
      Alert.alert("Gagal Menyimpan", error.message);
    } else {
      Alert.alert("Berhasil! 🎉", `Dompet "${namaDompet.trim()}" berhasil ditambahkan.`);
      setNamaDompet("");
      setSaldo("");
      fetchDompet(userId);
    }
  };

  /* Hapus dompet */
  const handleHapus = (id: number, nama: string) => {
    Alert.alert(
      "Hapus Dompet",
      `Hapus dompet "${nama}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("dompet").delete().eq("id", id);
            if (error) {
              Alert.alert("Gagal menghapus", error.message);
            } else if (userId) {
              fetchDompet(userId);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Dompet Saya</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* ── Kartu Ringkasan Saldo ── */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Saldo</Text>
            <Text style={styles.summaryAmount}>{formatRupiah(totalSaldo)}</Text>
            <Text style={styles.summaryCount}>
              {daftarDompet.length} dompet aktif
            </Text>
          </View>

          {/* ── Form Tambah Dompet ── */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Tambah Dompet Baru</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Dompet</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>👛</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Dompet Utama, Tabungan..."
                  placeholderTextColor={TEXT_GRAY}
                  value={namaDompet}
                  onChangeText={setNamaDompet}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Saldo Awal (Rp)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>💰</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={TEXT_GRAY}
                  value={saldo}
                  onChangeText={setSaldo}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleTambah}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>+ Tambah Dompet</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Daftar Dompet ── */}
          <View style={styles.listSection}>
            <Text style={styles.listTitle}>Daftar Dompet</Text>

            {fetching ? (
              <ActivityIndicator color={PRIMARY} style={{ marginTop: 20 }} />
            ) : daftarDompet.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>👜</Text>
                <Text style={styles.emptyText}>Belum ada dompet.</Text>
                <Text style={styles.emptySubtext}>
                  Tambahkan dompet pertama Anda di atas!
                </Text>
              </View>
            ) : (
              daftarDompet.map((item) => (
                <View key={item.id} style={styles.dompetItem}>
                  <View style={styles.dompetIcon}>
                    <Text style={{ fontSize: 22 }}>👛</Text>
                  </View>
                  <View style={styles.dompetInfo}>
                    <Text style={styles.dompetName}>{item.nama_dompet}</Text>
                    <Text style={styles.dompetSaldo}>
                      {formatRupiah(item.saldo ?? 0)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleHapus(item.id, item.nama_dompet)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteIcon}>🗑</Text>
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

/* ─── Styles ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  backIcon: { fontSize: 24, color: TEXT_DARK, lineHeight: 28 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    letterSpacing: -0.3,
  },

  /* Ringkasan saldo */
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    padding: 24,
    alignItems: "center",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  summaryCount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
  },

  /* Form card */
  formCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_GRAY,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.5,
    borderColor: "#EBEBF5",
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: TEXT_DARK },
  submitBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },

  /* Daftar dompet */
  listSection: { paddingHorizontal: 20 },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 12,
  },
  emptyState: { alignItems: "center", paddingVertical: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, fontWeight: "600", color: TEXT_DARK, marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: TEXT_GRAY, textAlign: "center" },
  dompetItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  dompetIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  dompetInfo: { flex: 1 },
  dompetName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 3,
  },
  dompetSaldo: { fontSize: 13, color: PRIMARY, fontWeight: "600" },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: { fontSize: 16 },
});
