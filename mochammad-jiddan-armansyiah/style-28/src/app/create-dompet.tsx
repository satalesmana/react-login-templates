import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { supabase } from "../../lib/supabase";

// Pilihan Desain Kartu (cardBackground)
const CARD_DESIGNS = [
  { id: "indigo", name: "Indigo Royale", bg: "#3B0764", gradientAlt: "#4C1D95" },
  { id: "emerald", name: "Emerald Green", bg: "#047857", gradientAlt: "#065F46" },
  { id: "amber", name: "Amber Sunset", bg: "#D97706", gradientAlt: "#B45309" },
  { id: "midnight", name: "Midnight Navy", bg: "#0F172A", gradientAlt: "#020617" },
  { id: "royal-blue", name: "Royal Blue", bg: "#2563EB", gradientAlt: "#1D4ED8" },
];

// Pilihan Warna Huruf & Aksen (cardColor)
const FONT_COLORS = [
  { id: "putih", name: "Putih", color: "#FFFFFF", dotColor: "#FFFFFF" },
  { id: "gold", name: "Gold", color: "#FDE047", dotColor: "#EAB308" },
  { id: "silver", name: "Silver", color: "#E2E8F0", dotColor: "#94A3B8" },
  { id: "cyan", name: "Cyan", color: "#38BDF8", dotColor: "#06B6D4" },
];

// Rekomendasi nama dompet
const QUICK_NAMES = ["Harian", "Tabungan", "Belanja", "Bisnis", "Darurat"];

// Tombol tambah saldo cepat
const QUICK_AMOUNTS = [
  { label: "+ 100 Rb", value: 100000 },
  { label: "+ 500 Rb", value: 500000 },
  { label: "+ 1 Juta", value: 1000000 },
];

export default function CreateDompetScreen() {
  const router = useRouter();

  const [name, setName] = useState("Dompet Utama");
  const [balance, setBalance] = useState("0");
  const [selectedDesign, setSelectedDesign] = useState(CARD_DESIGNS[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_COLORS[0]);

  // Modal feedback
  const [modalType, setModalType] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddAmount = (amount: number) => {
    const current = parseInt(balance.replace(/\D/g, "") || "0", 10);
    setBalance(String(current + amount));
  };

  const formatRupiah = (val: string) => {
    const num = parseInt(val.replace(/\D/g, "") || "0", 10);
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const handleSaveDompet = async () => {
    if (!name.trim()) {
      setErrorMsg("Nama dompet wajib diisi!");
      setModalType("error");
      return;
    }

    try {
      setModalType("loading");

      // Ambil user yang sedang login
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("Sesi pengguna tidak ditemukan. Silakan login kembali.");
      }

      const numericBalance = parseInt(balance.replace(/\D/g, "") || "0", 10);

      // Coba insert pertama kali dengan format lowercase standar PostgreSQL (userid, cardbackground, cardcolor)
      let { error: insertError } = await supabase.from("dompet").insert([
        {
          userid: userData.user.id,
          name: name.trim(),
          balance: numericBalance,
          cardbackground: selectedDesign.bg,
          cardcolor: selectedFont.color,
        },
      ]);

      // Jika tabel dibuat dengan camelCase (dengan tanda kutip ganda), coba fallback camelCase
      if (insertError && (insertError.message.includes("cardbackground") || insertError.message.includes("userid"))) {
        const retry = await supabase.from("dompet").insert([
          {
            userId: userData.user.id,
            name: name.trim(),
            balance: numericBalance,
            cardBackground: selectedDesign.bg,
            cardColor: selectedFont.color,
          },
        ]);
        insertError = retry.error;
      }

      if (insertError) {
        throw new Error(insertError.message);
      }

      setModalType("success");
    } catch (err: any) {
      console.error("[handleSaveDompet]", err);
      setErrorMsg(err?.message || "Gagal menyimpan dompet. Silakan coba lagi.");
      setModalType("error");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome name="chevron-left" size={16} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Tambah Dompet</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* PREVIEW KARTU DOMPET REAL-TIME */}
          <View
            style={[
              styles.cardPreview,
              { backgroundColor: selectedDesign.bg },
            ]}
          >
            {/* Bagian Atas Kartu */}
            <View style={styles.cardHeader}>
              <View style={styles.cardChipRow}>
                <View style={styles.cardChip}>
                  <View style={styles.cardChipLine} />
                  <View style={styles.cardChipLine} />
                </View>
                <FontAwesome
                  name="feed"
                  size={16}
                  color={selectedFont.color}
                  style={styles.nfcIcon}
                />
              </View>

              <View style={styles.badgeWallet}>
                <View style={styles.greenDot} />
                <Text style={styles.badgeWalletText}>PAYNEX E-WALLET</Text>
              </View>
            </View>

            {/* Saldo Tersedia */}
            <View style={styles.cardBalanceSection}>
              <Text
                style={[
                  styles.cardBalanceLabel,
                  { color: selectedFont.color, opacity: 0.8 },
                ]}
              >
                SALDO TERSEDIA
              </Text>
              <Text style={[styles.cardBalanceValue, { color: selectedFont.color }]}>
                Rp {formatRupiah(balance)}
              </Text>
            </View>

            {/* Bagian Bawah Kartu */}
            <View style={styles.cardFooter}>
              <View>
                <Text
                  style={[
                    styles.cardFooterLabel,
                    { color: selectedFont.color, opacity: 0.8 },
                  ]}
                >
                  NAMA DOMPET
                </Text>
                <Text
                  style={[styles.cardWalletName, { color: selectedFont.color }]}
                  numberOfLines={1}
                >
                  {name || "Dompet Baru"}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.cardNumberMask, { color: selectedFont.color }]}>
                  •••• 9021
                </Text>
                <Text
                  style={[
                    styles.cardValidThru,
                    { color: selectedFont.color, opacity: 0.8 },
                  ]}
                >
                  VALID THRU 12/29
                </Text>
              </View>
            </View>
          </View>

          {/* FORM INPUT: NAMA DOMPET */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nama Dompet</Text>
            <Text style={styles.sectionSubtext}>Wajib diisi</Text>
          </View>
          <View style={styles.inputWrapper}>
            <FontAwesome name="credit-card" size={16} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Masukkan nama dompet..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Quick chips Nama Dompet */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickChipsContainer}
          >
            {QUICK_NAMES.map((qName) => (
              <TouchableOpacity
                key={qName}
                style={[
                  styles.chipButton,
                  name === qName && styles.chipButtonActive,
                ]}
                onPress={() => setName(qName)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipButtonText,
                    name === qName && styles.chipButtonTextActive,
                  ]}
                >
                  {qName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* FORM INPUT: SALDO AWAL */}
          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Saldo Awal</Text>
            <Text style={[styles.sectionSubtext, { color: "#059669", fontWeight: "600" }]}>
              Bebas Biaya Admin
            </Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.rpPrefix}>Rp</Text>
            <TextInput
              style={[styles.textInput, styles.balanceInput]}
              value={balance}
              onChangeText={(val) => setBalance(val.replace(/\D/g, ""))}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <Text style={styles.helperText}>
            Saldo saat dompet baru ini dibuat (default Rp 0).
          </Text>

          {/* Quick chips Tambah Saldo */}
          <View style={styles.quickAmountRow}>
            {QUICK_AMOUNTS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.amountChip}
                onPress={() => handleAddAmount(item.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.amountChipText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PILIHAN DESAIN KARTU */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>Pilihan Desain Kartu</Text>
            <Text style={styles.sectionSubtext}>{selectedDesign.name}</Text>
          </View>
          <View style={styles.colorPaletteRow}>
            {CARD_DESIGNS.map((item) => {
              const isSelected = selectedDesign.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.colorBox,
                    { backgroundColor: item.bg },
                    isSelected && styles.colorBoxActive,
                  ]}
                  onPress={() => setSelectedDesign(item)}
                  activeOpacity={0.8}
                >
                  {isSelected && <FontAwesome name="check" size={14} color="#FFFFFF" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* PILIHAN WARNA HURUF & AKSEN */}
          <View style={[styles.sectionHeader, { marginTop: 22 }]}>
            <Text style={styles.sectionTitle}>Warna Huruf & Aksen</Text>
            <Text style={styles.sectionSubtext}>{selectedFont.name}</Text>
          </View>
          <View style={styles.fontColorRow}>
            {FONT_COLORS.map((item) => {
              const isSelected = selectedFont.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.fontOption,
                    isSelected && styles.fontOptionActive,
                  ]}
                  onPress={() => setSelectedFont(item)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.fontDot,
                      { backgroundColor: item.dotColor },
                      item.id === "putih" && { borderWidth: 1, borderColor: "#CBD5E1" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.fontOptionText,
                      isSelected && styles.fontOptionTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* KOTAK INFO INTEGRASI */}
          <View style={styles.infoBanner}>
            <View style={styles.infoIconBg}>
              <FontAwesome name="exchange" size={16} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoBannerTitle}>Integrasi Transaksi Otomatis</Text>
              <Text style={styles.infoBannerText}>
                Dompet ini siap ditautkan ke akun Anda untuk pencatatan riwayat Cash-In (CI)
                dan Cash-Out (CO) secara real-time.
              </Text>
            </View>
          </View>

          {/* TOMBOL SIMPAN & BATAL */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveDompet}
              activeOpacity={0.85}
            >
              <FontAwesome name="save" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Simpan Dompet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL POPUP LOADING / SUCCESS / ERROR */}
      <Modal
        visible={modalType !== "idle"}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (modalType !== "loading") setModalType("idle");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {modalType === "loading" && (
              <View style={styles.modalInner}>
                <ActivityIndicator size="large" color="#6D28D9" />
                <Text style={styles.modalTitle}>Menyimpan Dompet...</Text>
                <Text style={styles.modalSubtitle}>
                  Menghubungkan ke Supabase dan menyimpan data dompet Anda.
                </Text>
              </View>
            )}

            {modalType === "success" && (
              <View style={styles.modalInner}>
                <View style={styles.successIconCircle}>
                  <FontAwesome name="check" size={32} color="#059669" />
                </View>
                <Text style={styles.modalTitle}>Dompet Berhasil Dibuat!</Text>
                <Text style={styles.modalSubtitle}>
                  Dompet <Text style={{ fontWeight: "700", color: "#1E293B" }}>{name}</Text> siap
                  digunakan untuk transaksi.
                </Text>
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => {
                    setModalType("idle");
                    router.replace("/dashboard");
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalPrimaryBtnText}>Kembali ke Dashboard</Text>
                </TouchableOpacity>
              </View>
            )}

            {modalType === "error" && (
              <View style={styles.modalInner}>
                <View style={styles.errorIconCircle}>
                  <FontAwesome name="exclamation" size={32} color="#DC2626" />
                </View>
                <Text style={styles.modalTitle}>Gagal Menyimpan</Text>
                <Text style={styles.modalSubtitle}>
                  {errorMsg || "Terjadi kesalahan saat menyimpan dompet ke Supabase."}
                </Text>
                <TouchableOpacity
                  style={[styles.modalPrimaryBtn, { backgroundColor: "#DC2626" }]}
                  onPress={() => setModalType("idle")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalPrimaryBtnText}>Coba Lagi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  /* Card Preview Styles */
  cardPreview: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
    minHeight: 180,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardChipRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardChip: {
    width: 32,
    height: 24,
    borderRadius: 5,
    backgroundColor: "#FACC15",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cardChipLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#CA8A04",
    marginVertical: 2,
  },
  nfcIcon: {
    marginLeft: 10,
    opacity: 0.9,
  },
  badgeWallet: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  badgeWalletText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardBalanceSection: {
    marginVertical: 14,
  },
  cardBalanceLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cardBalanceValue: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardFooterLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardWalletName: {
    fontSize: 15,
    fontWeight: "700",
    maxWidth: 160,
  },
  cardNumberMask: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  cardValidThru: {
    fontSize: 8,
    fontWeight: "600",
    marginTop: 2,
  },

  /* Section Styles */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionSubtext: {
    fontSize: 12,
    color: "#64748B",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "500",
  },
  balanceInput: {
    fontSize: 20,
    fontWeight: "700",
  },
  rpPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginRight: 8,
  },
  helperText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 10,
  },

  /* Chips */
  quickChipsContainer: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
  },
  chipButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipButtonActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },
  chipButtonText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  chipButtonTextActive: {
    color: "#4F46E5",
    fontWeight: "700",
  },
  quickAmountRow: {
    flexDirection: "row",
    gap: 10,
  },
  amountChip: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  amountChipText: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
  },

  /* Design & Font Selection */
  colorPaletteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  colorBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  colorBoxActive: {
    borderWidth: 3,
    borderColor: "#6366F1",
  },
  fontColorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 8,
  },
  fontOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  fontOptionActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },
  fontDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  fontOptionText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  fontOptionTextActive: {
    color: "#4F46E5",
    fontWeight: "700",
  },

  /* Info Banner */
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 14,
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 2,
  },
  infoBannerText: {
    fontSize: 11,
    color: "#15803D",
    lineHeight: 16,
  },

  /* Action Buttons */
  actionSection: {
    marginTop: 24,
    alignItems: "center",
  },
  saveButton: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6D28D9",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    paddingVertical: 12,
    marginTop: 6,
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  modalInner: {
    alignItems: "center",
    width: "100%",
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  errorIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
  },
  modalPrimaryBtn: {
    width: "100%",
    height: 44,
    backgroundColor: "#6D28D9",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  modalPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

