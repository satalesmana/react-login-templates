
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { MyButton } from "@/components";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STUDENT_NAME = "Nandito Gianza Agni";
const STUDENT_CLASS = "Manajemen Informatika 24";

const COLOR_OPTIONS = [
  {
    id: "red",
    label: "Merah",
    background: "#FF1F3C",
    text: "#FFFFFF",
  },
  {
    id: "pink",
    label: "Pink",
    background: "#F8828F",
    text: "#FFFFFF",
  },
  {
    id: "cream",
    label: "Cream",
    background: "#FFF1F2",
    text: "#171717",
  },
] as const;

type ColorOption = (typeof COLOR_OPTIONS)[number];

type Dompet = {
  id: number;
  name: string;
  balance: number;
  cardBackground: string;
  cardColor: string;
};

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    alert(message);
  } else {
    Alert.alert(title, message);
  }
}

function formatBalance(balance: number) {
  return `Rp ${balance.toLocaleString("id-ID")}`;
}

export default function AdminHomeScreen() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [selectedColor, setSelectedColor] =
    React.useState<ColorOption>(COLOR_OPTIONS[0]);

  const [dompetList, setDompetList] = React.useState<Dompet[]>([]);
  const [loadingDompet, setLoadingDompet] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const logoutInProgress = React.useRef(false);
  const saveInProgress = React.useRef(false);

  const loadDompet = React.useCallback(async () => {
    setLoadingDompet(true);

    try {
      const { data, error } = await supabase
        .from("dompet")
        .select("id, name, balance, cardBackground, cardColor")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setDompetList((data ?? []) as Dompet[]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data dompet.";

      showMessage("Gagal memuat dompet", message);
    } finally {
      setLoadingDompet(false);
    }
  }, []);

  React.useEffect(() => {
    void loadDompet();
  }, [loadDompet]);

  const onSaveDompet = async () => {
    if (saveInProgress.current) return;

    const cleanName = name.trim();
    const cleanBalance = balance.trim();

    if (!cleanName) {
      showMessage("Validasi", "Nama dompet wajib diisi.");
      return;
    }

    if (cleanName.length > 60) {
      showMessage(
        "Validasi",
        "Nama dompet maksimal 60 karakter."
      );
      return;
    }

    if (!/^\d+$/.test(cleanBalance)) {
      showMessage(
        "Validasi",
        "Saldo harus berupa angka bulat positif atau nol."
      );
      return;
    }

    const numericBalance = Number(cleanBalance);

    if (
      !Number.isSafeInteger(numericBalance) ||
      numericBalance > 2147483647
    ) {
      showMessage(
        "Validasi",
        "Saldo melebihi batas angka yang didukung."
      );
      return;
    }

    saveInProgress.current = true;
    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        showMessage(
          "Sesi tidak tersedia",
          "Silakan login kembali."
        );
        return;
      }

      const { error } = await supabase.from("dompet").insert({
        userId: user.id,
        name: cleanName,
        balance: numericBalance,
        cardBackground: selectedColor.background,
        cardColor: selectedColor.text,
      });

      if (error) {
        throw error;
      }

      setName("");
      setBalance("");
      setSelectedColor(COLOR_OPTIONS[0]);

      await loadDompet();

      showMessage(
        "Berhasil",
        "Dompet berhasil disimpan ke Supabase."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menyimpan dompet.";

      showMessage("Gagal menyimpan", message);
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  };

  const onLogoutPress = async () => {
    if (logoutInProgress.current) return;

    logoutInProgress.current = true;
    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut({
        scope: "local",
      });

      if (error) {
        throw error;
      }

      router.replace("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal logout. Silakan coba lagi.";

      showMessage("Logout gagal", message);
    } finally {
      logoutInProgress.current = false;
      setLoggingOut(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.brandText}>
                EATMORE PIZZA
              </Text>
              <Text style={styles.pageTitle}>Home</Text>
            </View>

            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>13</Text>
            </View>
          </View>

          {/* Banner Eatmore */}
          <LinearGradient
            colors={["#FF1F3C", "#F8828F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.banner}
          >
            <Image
              source={require("@/assets/images/eatmore-food.png")}
              style={styles.foodImage}
              resizeMode="contain"
            />

            <View style={styles.bannerContent}>
              <Image
                source={require("@/assets/images/eatmore-logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.bannerTitle}>
                Welcome to Eatmore!
              </Text>

              <Text style={styles.bannerDescription}>
                Good food, good mood.
              </Text>
            </View>
          </LinearGradient>

          {/* Welcome */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>
              Welcome back!
            </Text>

            <Text style={styles.welcomeDescription}>
              Selamat datang di halaman utama
              Eatmore Pizza.
            </Text>
          </View>

          {/* Informasi Mahasiswa */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Student Information
            </Text>

            <View style={styles.studentCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  Full Name
                </Text>
                <Text style={styles.infoValue}>
                  {STUDENT_NAME}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  Class
                </Text>
                <Text style={styles.infoValue}>
                  {STUDENT_CLASS}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  Project
                </Text>
                <Text style={styles.infoValue}>
                  Mobile Programming - Style 13
                </Text>
              </View>
            </View>
          </View>

          {/* Input Dompet */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Tambah Dompet
            </Text>

            <Text style={styles.sectionDescription}>
              Buat dompet dan simpan datanya ke Supabase.
            </Text>

            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>
                Nama Dompet
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Contoh: Dompet Utama"
                placeholderTextColor="#777777"
                value={name}
                onChangeText={setName}
                maxLength={60}
                autoCapitalize="words"
              />

              <Text style={styles.inputLabel}>
                Saldo Awal
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Contoh: 18000"
                placeholderTextColor="#777777"
                value={balance}
                onChangeText={setBalance}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>
                Warna Kartu
              </Text>

              <View style={styles.colorOptions}>
                {COLOR_OPTIONS.map((option) => {
                  const isSelected =
                    selectedColor.id === option.id;

                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => setSelectedColor(option)}
                      accessibilityRole="button"
                      accessibilityLabel={`Warna ${option.label}`}
                      accessibilityState={{
                        selected: isSelected,
                      }}
                      style={[
                        styles.colorOption,
                        {
                          backgroundColor: option.background,
                          borderColor: isSelected
                            ? "#171717"
                            : "#E5E5E5",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.colorOptionText,
                          { color: option.text },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.saveButton}>
                <MyButton
                  text={
                    saving
                      ? "Menyimpan..."
                      : "Simpan Dompet"
                  }
                  btnType="Primary"
                  action={onSaveDompet}
                />
              </View>
            </View>
          </View>

          {/* Daftar Dompet */}
          <View style={styles.section}>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>
                Dompet Saya
              </Text>

              <Pressable
                onPress={() => void loadDompet()}
                disabled={loadingDompet || saving}
                accessibilityRole="button"
              >
                <Text style={styles.refreshText}>
                  Refresh
                </Text>
              </Pressable>
            </View>

            {loadingDompet ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  color="#FF1F3C"
                  size="small"
                />
                <Text style={styles.loadingText}>
                  Memuat data dompet...
                </Text>
              </View>
            ) : dompetList.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  Belum ada dompet tersimpan.
                </Text>
              </View>
            ) : (
              <View style={styles.dompetList}>
                {dompetList.map((dompet) => (
                  <View
                    key={dompet.id}
                    style={[
                      styles.dompetCard,
                      {
                        backgroundColor:
                          dompet.cardBackground,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dompetName,
                        { color: dompet.cardColor },
                      ]}
                    >
                      {dompet.name}
                    </Text>

                    <Text
                      style={[
                        styles.dompetBalance,
                        { color: dompet.cardColor },
                      ]}
                    >
                      {formatBalance(dompet.balance)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <MyButton
              text={
                loggingOut
                  ? "Logging out..."
                  : "Log out"
              }
              btnType="Primary"
              action={onLogoutPress}
            />
          </View>

          <Text style={styles.footerText}>
            Eatmore Pizza - Style 13
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
  },
  container: {
    width: "100%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  brandText: {
    color: "#FF1F3C",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  pageTitle: {
    fontSize: 26,
    color: "#171717",
    fontWeight: "700",
    marginTop: 4,
  },
  headerBadge: {
    width: 38,
    height: 38,
    backgroundColor: "#FFF1F2",
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBadgeText: {
    color: "#FF1F3C",
    fontSize: 15,
    fontWeight: "700",
  },
  banner: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 22,
    marginBottom: 30,
  },
  bannerContent: {
    width: "60%",
    zIndex: 1,
  },
  logo: {
    width: 125,
    height: 100,
    marginBottom: 4,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
  },
  bannerDescription: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  foodImage: {
    position: "absolute",
    width: 205,
    height: 205,
    bottom: -40,
    right: -28,
  },
  welcomeContainer: {
    marginBottom: 28,
  },
  welcomeTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 13,
    color: "#777777",
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 14,
  },
  sectionDescription: {
    fontSize: 12,
    color: "#777777",
    marginBottom: 14,
    lineHeight: 19,
  },
  studentCard: {
    backgroundColor: "#FFF7F7",
    borderWidth: 1,
    borderColor: "#FFE8E8",
    borderRadius: 12,
    padding: 20,
  },
  infoItem: {
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: "#888888",
    marginBottom: 7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#272727",
  },
  separator: {
    height: 1,
    backgroundColor: "#F2DEDE",
    marginVertical: 16,
  },
  formCard: {
    padding: 20,
    backgroundColor: "#FFF7F7",
    borderWidth: 1,
    borderColor: "#FFE8E8",
    borderRadius: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#272727",
    marginBottom: 8,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#F2DEDE",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 18,
    color: "#171717",
    fontSize: 14,
  },
  colorOptions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  colorOption: {
    flex: 1,
    minHeight: 44,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  colorOptionText: {
    fontSize: 11,
    fontWeight: "700",
  },
  saveButton: {
    width: "100%",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  refreshText: {
    fontSize: 12,
    color: "#FF1F3C",
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 25,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: "#777777",
  },
  emptyCard: {
    backgroundColor: "#FFF7F7",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE8E8",
  },
  emptyText: {
    color: "#777777",
    fontSize: 13,
    textAlign: "center",
  },
  dompetList: {
    gap: 12,
  },
  dompetCard: {
    minHeight: 110,
    padding: 20,
    borderRadius: 14,
    justifyContent: "space-between",
  },
  dompetName: {
    fontSize: 15,
    fontWeight: "600",
  },
  dompetBalance: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 14,
  },
  logoutContainer: {
    marginBottom: 25,
  },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#AAAAAA",
  },
});
