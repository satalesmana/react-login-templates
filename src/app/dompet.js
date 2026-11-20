import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

const CATEGORIES = ["Harian", "Tabungan", "Belanja", "Bisnis", "Darurat"];

const CARD_DESIGNS = [
  { label: "Indigo Royale", value: "#3730a3" },
  { label: "Hijau", value: "#16a34a" },
  { label: "Oranye", value: "#f97316" },
  { label: "Hitam", value: "#111827" },
  { label: "Biru", value: "#2563eb" },
];

const TEXT_COLORS = [
  { label: "Putih", value: "#ffffff" },
  { label: "Gold", value: "#facc15" },
  { label: "Silver", value: "#cbd5e1" },
  { label: "Cyan", value: "#22d3ee" },
];

const QUICK_AMOUNTS = [
  { label: "+ 100 Rb", value: 100000 },
  { label: "+ 500 Rb", value: 500000 },
  { label: "+ 1 Juta", value: 1000000 },
];

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function DompetScreen() {
  const router = useRouter();
  const [name, setName] = useState("Dompet Utama");
  const [category, setCategory] = useState("Harian");
  const [balanceText, setBalanceText] = useState("0");
  const [cardBackground, setCardBackground] = useState("#3730a3");
  const [cardColor, setCardColor] = useState("#ffffff");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [rows, setRows] = useState([]);

  const balance = parseInt(balanceText.replace(/[^0-9]/g, ""), 10) || 0;
  const selectedDesign =
    CARD_DESIGNS.find((d) => d.value === cardBackground)?.label ??
    "Indigo Royale";

  const loadRows = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("dompet")
      .select()
      .eq("userid", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setRows(data);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/login");
      else loadRows();
    });
  }, []);

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!name.trim()) {
      setErrorMsg("Nama dompet wajib diisi.");
      return;
    }
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      router.replace("/login");
      return;
    }
    const { error } = await supabase.from("dompet").insert([
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
      return;
    }
    setSuccessMsg("Dompet berhasil disimpan.");
    loadRows();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tambah Dompet</Text>
        </View>

        <View style={[styles.cardPreview, { backgroundColor: cardBackground }]}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardBrandRow}>
              <View style={styles.chipBox} />
              <Text style={[styles.cardSmallText, { color: cardColor }]}>
                PAYNEX E-WALLET
              </Text>
            </View>
            <Text style={[styles.cardSmallText, { color: cardColor }]}>●</Text>
          </View>
          <Text style={[styles.cardLabel, { color: cardColor }]}>
            SALDO TERSEDIA
          </Text>
          <Text style={[styles.cardBalance, { color: cardColor }]}>
            {formatRupiah(balance)}
          </Text>
          <View style={styles.cardBottomRow}>
            <View>
              <Text style={[styles.cardLabel, { color: cardColor }]}>
                NAMA DOMPET
              </Text>
              <Text style={[styles.cardName, { color: cardColor }]}>
                {name.trim() || "Dompet Utama"}
              </Text>
            </View>
            <View>
              <Text style={[styles.cardSmallText, { color: cardColor }]}>
                **** 8821
              </Text>
              <Text style={[styles.cardSmallText, { color: cardColor }]}>
                VALID THRU 12/29
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Nama Dompet</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Dompet Utama"
            placeholderTextColor="#a0aec0"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.requiredText}>Wajib diisi</Text>
        </View>

        <View style={styles.chipRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              style={[
                styles.chip,
                category === c ? styles.chipActive : styles.chipInactive,
              ]}
            >
              <Text
                style={
                  category === c ? styles.chipTextActive : styles.chipText
                }
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Saldo Awal</Text>
        <View style={styles.inputRow}>
          <Text style={styles.rpText}>Rp </Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#a0aec0"
            keyboardType="numeric"
            value={balanceText}
            onChangeText={(t) => setBalanceText(t.replace(/[^0-9]/g, ""))}
          />
        </View>
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((q) => (
            <TouchableOpacity
              key={q.label}
              onPress={() => setBalanceText(String(balance + q.value))}
              style={styles.quickChip}
            >
              <Text style={styles.quickText}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.noteText}>
          Saldo saat dompet baru ini dibuat (default Rp 0). Bebas Biaya Admin.
        </Text>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Pilihan Desain Kartu</Text>
          <Text style={styles.noteText}>{selectedDesign}</Text>
        </View>
        <View style={styles.swatchRow}>
          {CARD_DESIGNS.map((d) => (
            <TouchableOpacity
              key={d.value}
              onPress={() => setCardBackground(d.value)}
              style={[styles.designSwatch, { backgroundColor: d.value }]}
            >
              {cardBackground === d.value ? (
                <Text style={styles.checkText}>✓</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Warna Huruf &amp; Aksen</Text>
          <Text style={styles.noteText}>Putih Cerah</Text>
        </View>
        <View style={styles.swatchRow}>
          {TEXT_COLORS.map((c) => (
            <TouchableOpacity
              key={c.value}
              onPress={() => setCardColor(c.value)}
              style={[styles.colorSwatch, { backgroundColor: c.value }]}
            >
              {cardColor === c.value ? (
                <Text
                  style={[
                    styles.checkText,
                    {
                      color:
                        c.value === "#ffffff" ||
                        c.value === "#cbd5e1" ||
                        c.value === "#facc15"
                          ? "#111827"
                          : "#ffffff",
                    },
                  ]}
                >
                  ✓
                </Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.noteText}>
          {TEXT_COLORS.find((c) => c.value === cardColor)?.label}
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Integrasi Transaksi Otomatis</Text>
          <Text style={styles.infoText}>
            Dompet ini siap digunakan untuk pencatatan riwayat Cash-In (CI)
            dan Cash-Out (CO) secara real-time.
          </Text>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        {successMsg ? (
          <Text style={styles.successText}>{successMsg}</Text>
        ) : null}

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Menyimpan..." : "Simpan Dompet"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>

        <Text style={styles.listTitle}>Daftar Dompet Saya</Text>
        {rows.length === 0 ? (
          <Text style={styles.emptyText}>
            Belum ada dompet. Simpan dompet pertama lo di atas.
          </Text>
        ) : (
          rows.map((r) => (
            <View key={r.id} style={styles.rowItem}>
              <View
                style={[
                  styles.rowSwatch,
                  { backgroundColor: r.cardbackground || "#3730a3" },
                ]}
              />
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{r.name}</Text>
                <Text style={styles.rowDetail}>
                  {r.category ? r.category + " • " : ""}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1, paddingHorizontal: 24 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  backText: { fontSize: 24, color: "#1a202c", fontFamily: "Oswald_700Bold" },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Oswald_700Bold",
    color: "#1a202c",
    marginLeft: 12,
  },
  cardPreview: { borderRadius: 20, padding: 20 },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardBrandRow: { flexDirection: "row", alignItems: "center" },
  chipBox: {
    width: 20,
    height: 14,
    backgroundColor: "#facc15",
    borderRadius: 3,
  },
  cardSmallText: {
    fontSize: 10,
    fontFamily: "Oswald_400Regular",
    marginLeft: 8,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: "Oswald_400Regular",
    marginTop: 20,
    opacity: 0.8,
  },
  cardBalance: { fontSize: 24, fontFamily: "Oswald_700Bold" },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cardName: { fontFamily: "Oswald_700Bold" },
  sectionTitle: {
    fontFamily: "Oswald_700Bold",
    color: "#1a202c",
    marginTop: 24,
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a202c",
    fontFamily: "Oswald_400Regular",
  },
  requiredText: {
    color: "#a0aec0",
    fontSize: 12,
    fontFamily: "Oswald_400Regular",
  },
  rpText: { fontSize: 16, color: "#1a202c", fontFamily: "Oswald_400Regular" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  chipActive: { backgroundColor: "#4f46e5" },
  chipInactive: { backgroundColor: "#f3f4f6" },
  chipTextActive: { color: "#fff", fontFamily: "Oswald_400Regular" },
  chipText: { color: "#4a5568", fontFamily: "Oswald_400Regular" },
  quickRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  quickChip: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  quickText: { color: "#4a5568", fontFamily: "Oswald_400Regular" },
  noteText: {
    color: "#a0aec0",
    fontSize: 12,
    fontFamily: "Oswald_400Regular",
    marginTop: 8,
  },
  swatchRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  designSwatch: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { color: "#fff", fontFamily: "Oswald_700Bold" },
  infoBox: {
    backgroundColor: "#ecfdf5",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  infoTitle: { fontFamily: "Oswald_700Bold", color: "#1a202c" },
  infoText: {
    color: "#718096",
    fontSize: 14,
    fontFamily: "Oswald_400Regular",
    marginTop: 4,
  },
  errorText: {
    color: "#c53030",
    fontFamily: "Oswald_400Regular",
    marginTop: 16,
  },
  successText: {
    color: "#2e8b57",
    fontFamily: "Oswald_400Regular",
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "#6d28d9",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: { color: "#fff", fontFamily: "Oswald_700Bold" },
  cancelButton: { alignItems: "center", paddingVertical: 12 },
  cancelText: { color: "#718096", fontFamily: "Oswald_400Regular" },
  listTitle: {
    fontFamily: "Oswald_700Bold",
    color: "#1a202c",
    fontSize: 18,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    color: "#a0aec0",
    fontFamily: "Oswald_400Regular",
    marginBottom: 40,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  rowSwatch: { width: 36, height: 36, borderRadius: 10 },
  rowInfo: { marginLeft: 12, flex: 1 },
  rowName: { fontFamily: "Oswald_700Bold", color: "#1a202c" },
  rowDetail: {
    color: "#718096",
    fontSize: 14,
    fontFamily: "Oswald_400Regular",
  },
});
