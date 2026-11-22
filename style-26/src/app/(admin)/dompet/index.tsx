import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../lib/supabase";

const CARD_BACKGROUNDS = [
  { label: "Ungu Royale", value: "#4E0189" },
  { label: "Hijau Zamrud", value: "#16A34A" },
  { label: "Oranye Senja", value: "#F97316" },
  { label: "Hitam Elegan", value: "#111827" },
  { label: "Biru Samudra", value: "#2563EB" },
];

const CARD_COLORS = [
  { label: "Putih", displayName: "Putih Cerah", value: "#FFFFFF" },
  { label: "Gold", displayName: "Gold", value: "#FFD700" },
  { label: "Silver", displayName: "Silver", value: "#E5E7EB" },
  { label: "Cyan", displayName: "Cyan", value: "#22D3EE" },
];

const NAME_CHIPS = ["Harian", "Tabungan", "Belanja", "Bisnis", "Darurat"];

const AMOUNT_CHIPS = [
  { label: "+ 100 Rb", amount: 100000 },
  { label: "+ 500 Rb", amount: 500000 },
  { label: "+ 1 Juta", amount: 1000000 },
];

const MAX_BALANCE = 2147483647;

export default function TambahDompetScreen() {
  const [name, onChangeName] = React.useState("");
  const [balance, onChangeBalance] = React.useState("");
  const [cardBackground, setCardBackground] = React.useState(CARD_BACKGROUNDS[0]);
  const [cardColor, setCardColor] = React.useState(CARD_COLORS[0]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const balanceNumber = parseInt(balance.replace(/[^0-9]/g, ""), 10) || 0;
  const balanceDisplay =
    balance === "" ? "" : balanceNumber.toLocaleString("id-ID");

  const goBackToHome = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(admin)/home");
    }
  };

  const onAmountChipPress = (amount: number) => {
    const next = Math.min(balanceNumber + amount, MAX_BALANCE);
    onChangeBalance(String(next));
  };

  const onSavePress = async () => {
    if (name === "") {
      alert("Please fill in all fields");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("dompet").insert([
      {
        userId: user.id,
        name: name,
        balance: balanceNumber,
        cardBackground: cardBackground.value,
        cardColor: cardColor.value,
      },
    ]);
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    alert("Dompet berhasil disimpan!");
    router.replace("/(admin)/home");
  };

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBackToHome} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Dompet</Text>
      </View>

      <View style={[styles.cardPreview, { backgroundColor: cardBackground.value }]}>
        <View style={styles.cardTopRow}>
          <View style={styles.cardIcons}>
            <MaterialCommunityIcons name="chip" size={30} color="#FBBF24" />
            <MaterialCommunityIcons
              name="contactless-payment"
              size={22}
              color={cardColor.value}
            />
          </View>
          <View style={styles.cardBadge}>
            <View style={styles.cardBadgeDot} />
            <Text style={styles.cardBadgeText}>E-WALLET</Text>
          </View>
        </View>

        <View>
          <Text style={[styles.cardBalanceLabel, { color: cardColor.value }]}>
            SALDO TERSEDIA
          </Text>
          <Text style={[styles.cardBalance, { color: cardColor.value }]}>
            Rp {balanceNumber.toLocaleString("id-ID")}
          </Text>
        </View>

        <View style={styles.cardBottomRow}>
          <View>
            <Text style={[styles.cardNameLabel, { color: cardColor.value }]}>
              NAMA DOMPET
            </Text>
            <Text style={[styles.cardName, { color: cardColor.value }]}>
              {name === "" ? "Dompet Utama" : name}
            </Text>
          </View>
          <View style={styles.cardNumberWrap}>
            <Text style={[styles.cardNumber, { color: cardColor.value }]}>
              •••• 0000
            </Text>
            <Text style={[styles.cardValid, { color: cardColor.value }]}>
              VALID THRU 12/29
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>Nama Dompet</Text>
        <Text style={styles.hint}>Wajib diisi</Text>
      </View>
      <View style={styles.inputWrap}>
        <MaterialCommunityIcons name="wallet-outline" size={20} color="#64748B" />
        <TextInput
          style={styles.input}
          placeholder="Dompet Utama"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={onChangeName}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {NAME_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, name === chip && styles.chipActive]}
            onPress={() => onChangeName(chip)}
          >
            <Text style={[styles.chipText, name === chip && styles.chipTextActive]}>
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.labelRow}>
        <Text style={styles.label}>Saldo Awal</Text>
        <Text style={styles.hintGreen}>Bebas Biaya Admin</Text>
      </View>
      <View style={styles.inputWrap}>
        <Text style={styles.rpPrefix}>Rp</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0"
          placeholderTextColor="#94A3B8"
          value={balanceDisplay}
          onChangeText={(text) => onChangeBalance(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
        />
      </View>
      <Text style={styles.helperText}>
        Saldo saat dompet baru ini dibuat (default Rp 0).
      </Text>
      <View style={styles.chipRow}>
        {AMOUNT_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.label}
            style={styles.chip}
            onPress={() => onAmountChipPress(chip.amount)}
          >
            <Text style={styles.chipText}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>Pilihan Desain Kartu</Text>
        <Text style={styles.hint}>{cardBackground.label}</Text>
      </View>
      <View style={styles.swatchRow}>
        {CARD_BACKGROUNDS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.swatch,
              { backgroundColor: item.value },
              cardBackground.value === item.value && styles.swatchSelected,
            ]}
            onPress={() => setCardBackground(item)}
          >
            {cardBackground.value === item.value && (
              <Text style={styles.swatchCheck}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>Warna Huruf & Aksen</Text>
        <Text style={styles.hint}>{cardColor.displayName}</Text>
      </View>
      <View style={styles.colorRow}>
        {CARD_COLORS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.colorPill,
              cardColor.value === item.value && styles.colorPillSelected,
            ]}
            onPress={() => setCardColor(item)}
          >
            <View style={[styles.colorDot, { backgroundColor: item.value }]} />
            <Text
              style={[
                styles.colorPillText,
                cardColor.value === item.value && styles.colorPillTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoIcon}>
          <FontAwesome5 name="exchange-alt" size={18} color="#FFFFFF" />
        </View>
        <View style={styles.infoTextWrap}>
          <Text style={styles.infoTitle}>Integrasi Transaksi Otomatis</Text>
          <Text style={styles.infoDesc}>
            Dompet ini siap ditautkan ke akun Anda untuk pencatatan riwayat
            Cash-In (CI) dan Cash-Out (CO) secara real-time.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={onSavePress}
        disabled={loading}
      >
        <FontAwesome5 name="wallet" size={17} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>
          {loading ? "Loading..." : "Simpan Dompet"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goBackToHome}>
        <Text style={styles.cancelText}>Batal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardPreview: {
    borderRadius: 24,
    padding: 20,
    height: 196,
    justifyContent: "space-between",
    marginBottom: 26,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  cardBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
  },
  cardBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#FFFFFF",
  },
  cardBalanceLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    opacity: 0.85,
  },
  cardBalance: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 4,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardNameLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
    opacity: 0.85,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 3,
  },
  cardNumberWrap: {
    alignItems: "flex-end",
  },
  cardNumber: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cardValid: {
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 3,
    opacity: 0.85,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  hint: {
    fontSize: 12,
    color: "#94A3B8",
  },
  hintGreen: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  inputWrap: {
    height: 58,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
  },
  rpPrefix: {
    fontSize: 19,
    fontWeight: "700",
    color: "#334155",
  },
  amountInput: {
    flex: 1,
    fontSize: 21,
    fontWeight: "700",
    color: "#0F172A",
  },
  helperText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
  },
  chipScroll: {
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 22,
  },
  chip: {
    backgroundColor: "#F3EDF9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: "#4E0189",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4E0189",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  swatchRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  swatchSelected: {
    borderWidth: 2.5,
    borderColor: "#0F172A",
  },
  swatchCheck: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 26,
  },
  colorPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  colorPillSelected: {
    backgroundColor: "#F3EDF9",
    borderWidth: 1,
    borderColor: "#4E0189",
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  colorPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  colorPillTextSelected: {
    color: "#4E0189",
  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F3EDF9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 26,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#4E0189",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#64748B",
  },
  primaryButton: {
    height: 58,
    borderRadius: 999,
    backgroundColor: "#4E0189",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    marginTop: 18,
  },
});
