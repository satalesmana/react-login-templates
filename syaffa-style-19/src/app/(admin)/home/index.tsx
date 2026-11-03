import React from "react";
import { Stack, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "../../../../lib/supabase";

const STUDENT_NAME = "Syaffa Azzahra Safitri";
const STUDENT_CLASS = "MANAJEMEN INFORMATIKA 2024";

const COLOR_OPTIONS = [
  {
    id: "turquoise",
    label: "Turquoise",
    background: "#20BFC4",
    text: "#FFFFFF",
  },
  {
    id: "dark",
    label: "Dark",
    background: "#20262B",
    text: "#FFFFFF",
  },
  {
    id: "mint",
    label: "Mint",
    background: "#DCF7F3",
    text: "#20262B",
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

function formatBalance(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function AdminHomeScreen() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [balance, setBalance] = React.useState("");

  const [selectedColor, setSelectedColor] =
    React.useState<ColorOption>(COLOR_OPTIONS[0]);

  const [dompetList, setDompetList] =
    React.useState<Dompet[]>([]);

  const [loadingDompet, setLoadingDompet] =
    React.useState(true);

  const [saving, setSaving] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [loadError, setLoadError] = React.useState("");

  const saveInProgress = React.useRef(false);
  const logoutInProgress = React.useRef(false);

  // Mengambil dompet milik pengguna yang login.
  const loadDompet = React.useCallback(async () => {
    setLoadingDompet(true);
    setLoadError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(
          "Sesi tidak tersedia. Silakan login kembali."
        );
      }

      const { data, error } = await supabase
        .from("dompet")
        .select(
          "id, name, balance, cardBackground, cardColor"
        )
        .eq("userId", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setDompetList((data ?? []) as Dompet[]);
    } catch (error) {
      setDompetList([]);

      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data dompet.";

      setLoadError(message);
    } finally {
      setLoadingDompet(false);
    }
  }, []);

  React.useEffect(() => {
    void loadDompet();
  }, [loadDompet]);

  // Menyimpan dompet baru ke PostgreSQL Supabase.
  const onSaveDompet = async () => {
    if (saveInProgress.current) return;

    const cleanName = name.trim();
    const cleanBalance = balance.trim();

    if (!cleanName) {
      showMessage(
        "Validasi",
        "Nama dompet wajib diisi."
      );
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
        "Saldo melebihi batas yang didukung database."
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
        throw new Error(
          "Sesi tidak tersedia. Silakan login kembali."
        );
      }

      const { error } = await supabase
        .from("dompet")
        .insert({
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

      showMessage("Gagal", message);
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  };

  // Logout sungguhan dari Supabase Auth.
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
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Identitas Fruzzdigital */}
          <Image
            source={require("@/assets/images/fruzz-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.brand}>
            Fruzzdigital
          </Text>

          <Text style={styles.heading}>
            Berhasil login
          </Text>

          {/* Informasi Mahasiswa */}
          <View style={styles.studentSection}>
            <Text style={styles.label}>Nama</Text>

            <Text style={styles.value}>
              {STUDENT_NAME}
            </Text>

            <Text style={styles.label}>Kelas</Text>

            <Text style={styles.value}>
              {STUDENT_CLASS}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Form Tambah Dompet */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Tambah Dompet
            </Text>

            <Text style={styles.sectionDescription}>
              Isi data dompet untuk disimpan ke Supabase.
            </Text>

            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>
                Nama Dompet
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Contoh: Dompet Utama"
                placeholderTextColor="#969DA7"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                maxLength={60}
              />

              <Text style={styles.inputLabel}>
                Saldo Awal
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Contoh: 18000"
                placeholderTextColor="#969DA7"
                value={balance}
                onChangeText={setBalance}
                keyboardType="numeric"
                maxLength={10}
              />

              <Text style={styles.inputLabel}>
                Warna Kartu
              </Text>

              <View style={styles.colorRow}>
                {COLOR_OPTIONS.map((option) => {
                  const selected =
                    selectedColor.id === option.id;

                  return (
                    <Pressable
                      key={option.id}
                      onPress={() =>
                        setSelectedColor(option)
                      }
                      accessibilityRole="button"
                      accessibilityLabel={
                        `Pilih warna ${option.label}`
                      }
                      accessibilityState={{
                        selected,
                      }}
                      style={[
                        styles.colorButton,
                        {
                          backgroundColor:
                            option.background,
                          borderColor: selected
                            ? "#20262B"
                            : "#E6E8EC",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.colorText,
                          { color: option.text },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                style={[
                  styles.saveButton,
                  saving && styles.buttonDisabled,
                ]}
                onPress={onSaveDompet}
                disabled={saving}
                accessibilityRole="button"
                accessibilityState={{
                  disabled: saving,
                }}
              >
                <Text style={styles.saveButtonText}>
                  {saving
                    ? "Menyimpan..."
                    : "Simpan Dompet"}
                </Text>
              </Pressable>
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
                accessibilityLabel="Refresh dompet"
              >
                <Text style={styles.refreshText}>
                  Refresh
                </Text>
              </Pressable>
            </View>

            {loadingDompet ? (
              <View style={styles.loadingArea}>
                <ActivityIndicator
                  color="#20BFC4"
                />

                <Text style={styles.loadingText}>
                  Memuat data dompet...
                </Text>
              </View>
            ) : loadError ? (
              <View style={styles.emptyCard}>
                <Text style={styles.errorText}>
                  {loadError}
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
          <Pressable
            style={[
              styles.logoutButton,
              loggingOut && styles.buttonDisabled,
            ]}
            onPress={onLogoutPress}
            disabled={loggingOut}
            accessibilityRole="button"
            accessibilityLabel="Log out"
            accessibilityState={{
              disabled: loggingOut,
            }}
          >
            <Text style={styles.logoutText}>
              {loggingOut
                ? "Logging out..."
                : "Log out"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 48,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  brand: {
    color: "#20262B",
    fontSize: 21,
    fontWeight: "700",
  },
  heading: {
    marginTop: 28,
    marginBottom: 26,
    fontSize: 20,
    fontWeight: "700",
    color: "#20262B",
    textAlign: "center",
  },
  studentSection: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    color: "#949BA3",
    fontSize: 12,
    marginTop: 14,
  },
  value: {
    color: "#20262B",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E6E8EC",
    marginTop: 32,
    marginBottom: 30,
  },
  section: {
    width: "100%",
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#20262B",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionDescription: {
    color: "#949BA3",
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 16,
  },
  formCard: {
    padding: 20,
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E8EC",
  },
  inputLabel: {
    color: "#20262B",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 46,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E6E8EC",
    paddingHorizontal: 13,
    marginBottom: 18,
    color: "#20262B",
    fontSize: 13,
  },
  colorRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  colorButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 7,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  colorText: {
    fontSize: 11,
    fontWeight: "600",
  },
  saveButton: {
    minHeight: 48,
    backgroundColor: "#20BFC4",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  refreshText: {
    color: "#16B4B6",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingArea: {
    padding: 25,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#949BA3",
    fontSize: 12,
  },
  emptyCard: {
    padding: 20,
    backgroundColor: "#F7F8FA",
    borderRadius: 10,
  },
  emptyText: {
    color: "#949BA3",
    fontSize: 13,
    textAlign: "center",
  },
  errorText: {
    color: "#A32929",
    fontSize: 12,
    textAlign: "center",
  },
  dompetList: {
    gap: 12,
  },
  dompetCard: {
    minHeight: 110,
    borderRadius: 12,
    padding: 20,
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
  logoutButton: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#20262B",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});