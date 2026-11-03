import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Database } from "../lib/database.types";
import { getSupabase } from "../lib/supabase";

type Wallet = Database["public"]["Tables"]["dompet"]["Row"];

const walletTypes = ["Tunai", "Bank", "E-Wallet", "Lainnya"] as const;
type WalletType = (typeof walletTypes)[number];

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 2,
});

function getSupabaseErrorMessage(error: unknown, fallback: string) {
  const details = typeof error === "object" && error !== null ? error : {};
  const code =
    "code" in details && typeof details.code === "string" ? details.code : "";
  const detailMessage =
    "message" in details && typeof details.message === "string"
      ? details.message
      : "";
  const message =
    error instanceof Error ? error.message : detailMessage;

  if (code === "42P01" || code === "PGRST205") {
    return "Tabel dompet belum ditemukan. Jalankan SQL pada supabase/migrations/20261103000000_create_dompet.sql di Supabase SQL Editor.";
  }
  if (code === "42501") {
    return "Akses ditolak oleh Supabase. Pastikan migrasi tabel dompet dan policy Row Level Security sudah dijalankan.";
  }
  if (message) {
    const hint =
      "hint" in details && typeof details.hint === "string" && details.hint
        ? ` (${details.hint})`
        : "";
    return `${message}${hint}`;
  }

  return fallback;
}

export default function MainPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Pengguna");
  const [userEmail, setUserEmail] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletName, setWalletName] = useState("");
  const [walletType, setWalletType] = useState<WalletType>("Tunai");
  const [balance, setBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadWallets = useCallback(async () => {
    try {
      const client = getSupabase();
      const {
        data: { session },
        error: sessionError,
      } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        router.replace("/login");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        router.replace("/login");
        return;
      }

      setUserEmail(user.email ?? "");
      const fullName = user.user_metadata.full_name;
      setUserName(
        typeof fullName === "string" && fullName.trim()
          ? fullName
          : user.email?.split("@")[0] || "Pengguna"
      );

      const { data, error } = await client
        .from("dompet")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setWallets(data);
    } catch (error) {
      setErrorMessage(
        getSupabaseErrorMessage(error, "Dompet gagal dimuat. Silakan coba lagi.")
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadWallets();
  }, [loadWallets]);

  const handleAddWallet = async () => {
    setErrorMessage("");
    const normalizedName = walletName.trim();
    const normalizedBalance = balance.trim().replace(",", ".");

    if (!normalizedName) {
      setErrorMessage("Masukkan nama dompet.");
      return;
    }
    if (!/^\d{1,12}(?:\.\d{1,2})?$/.test(normalizedBalance)) {
      setErrorMessage("Saldo harus berupa angka dengan maksimal 2 angka desimal.");
      return;
    }

    setIsSaving(true);
    try {
      const client = getSupabase();
      const {
        data: { session },
        error: sessionError,
      } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        router.replace("/login");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await client
        .from("dompet")
        .insert({
          user_id: user.id,
          nama: normalizedName,
          jenis: walletType,
          saldo: Number(normalizedBalance),
        })
        .select()
        .single();
      if (error) throw error;

      setWallets((currentWallets) => [data, ...currentWallets]);
      setWalletName("");
      setWalletType("Tunai");
      setBalance("0");
    } catch (error) {
      setErrorMessage(
        getSupabaseErrorMessage(
          error,
          "Dompet gagal disimpan. Silakan periksa koneksi dan pengaturan Supabase."
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
      router.replace("/login");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal keluar dari akun."
      );
    }
  };

  const totalBalance = wallets.reduce((total, wallet) => total + wallet.saldo, 0);

  return (
    <SafeAreaView className="flex-1 bg-[#f7f8fc]">
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="px-6 pt-6"
      >
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-sm text-[#777]">Selamat datang,</Text>
            <Text className="mt-1 text-2xl font-bold text-[#171717]">
              {userName}
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Keluar"
            activeOpacity={0.8}
            onPress={handleLogout}
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
          >
            <Ionicons name="log-out-outline" size={21} color="#1769F6" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 rounded-2xl bg-[#1769F6] p-5">
          <Text className="mb-2 text-sm text-white/80">Total saldo dompet</Text>
          <Text className="text-2xl font-bold text-white">
            {currencyFormatter.format(totalBalance)}
          </Text>
          <Text className="mt-2 text-xs text-white/80">
            {userEmail || "Saldo dari seluruh dompet Anda"}
          </Text>
        </View>

        <View className="mb-6 rounded-2xl border border-[#ececf1] bg-white p-5">
          <Text className="mb-1 text-lg font-bold text-[#171717]">
            Tambah dompet
          </Text>
          <Text className="mb-5 text-sm text-[#777]">
            Catat uang tunai, rekening bank, atau e-wallet Anda.
          </Text>

          <Text className="mb-2 text-sm font-medium text-[#333]">
            Nama dompet
          </Text>
          <TextInput
            accessibilityLabel="Nama dompet"
            className="mb-4 rounded-lg border border-[#d9dce5] px-3.5 py-3 text-sm text-[#222]"
            placeholder="Contoh: Tabungan BCA"
            placeholderTextColor="#999"
            value={walletName}
            onChangeText={setWalletName}
            maxLength={80}
            returnKeyType="next"
          />

          <Text className="mb-2 text-sm font-medium text-[#333]">
            Jenis dompet
          </Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {walletTypes.map((type) => {
              const isSelected = walletType === type;
              return (
                <TouchableOpacity
                  key={type}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  activeOpacity={0.8}
                  onPress={() => setWalletType(type)}
                  className={`rounded-full border px-3.5 py-2 ${
                    isSelected
                      ? "border-[#1769F6] bg-[#edf3ff]"
                      : "border-[#e2e4ea] bg-white"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? "text-[#1769F6]" : "text-[#555]"
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="mb-2 text-sm font-medium text-[#333]">
            Saldo awal (Rp)
          </Text>
          <TextInput
            accessibilityLabel="Saldo awal"
            className="mb-4 rounded-lg border border-[#d9dce5] px-3.5 py-3 text-sm text-[#222]"
            placeholder="0"
            placeholderTextColor="#999"
            value={balance}
            onChangeText={setBalance}
            keyboardType="decimal-pad"
          />

          {errorMessage ? (
            <Text accessibilityRole="alert" className="mb-3 text-sm text-red-600">
              {errorMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={handleAddWallet}
            disabled={isSaving}
            className="flex-row items-center justify-center rounded-lg bg-[#1769F6] py-3.5"
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="add" size={20} color="white" />
                <Text className="ml-1 font-bold text-white">Simpan dompet</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-[#171717]">
            Dompet saya
          </Text>
          <Text className="text-sm text-[#777]">{wallets.length} dompet</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator className="py-8" color="#1769F6" />
        ) : wallets.length === 0 ? (
          <View className="items-center rounded-xl border border-dashed border-[#d9dce5] bg-white px-5 py-8">
            <Ionicons name="wallet-outline" size={30} color="#9aa3b2" />
            <Text className="mt-3 text-center text-sm text-[#777]">
              Belum ada dompet. Tambahkan dompet pertama Anda di atas.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {wallets.map((wallet) => (
              <View
                key={wallet.id}
                className="flex-row items-center rounded-xl border border-[#ececf1] bg-white p-4"
              >
                <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-[#edf3ff]">
                  <Ionicons
                    name={
                      wallet.jenis === "Tunai"
                        ? "cash-outline"
                        : wallet.jenis === "Bank"
                          ? "business-outline"
                          : wallet.jenis === "E-Wallet"
                            ? "phone-portrait-outline"
                            : "wallet-outline"
                    }
                    size={21}
                    color="#1769F6"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-[#222]">{wallet.nama}</Text>
                  <Text className="mt-1 text-xs text-[#888]">
                    {wallet.jenis}
                  </Text>
                </View>
                <Text className="text-right font-semibold text-[#171717]">
                  {currencyFormatter.format(wallet.saldo)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
