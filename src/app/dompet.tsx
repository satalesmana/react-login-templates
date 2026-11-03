import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CLogo from "../components/CLogo";
import {
  createDompet,
  deleteDompet,
  Dompet,
  getDompetList,
} from "../services/dompetService";

const JENIS_OPTIONS = [
  { label: "Bank", icon: "card-outline", color: "#2563EB" },
  { label: "E-Wallet", icon: "phone-portrait-outline", color: "#9333EA" },
  { label: "Tunai", icon: "cash-outline", color: "#16A34A" },
  { label: "Tabungan", icon: "wallet-outline", color: "#EA580C" },
];

const QUICK_AMOUNTS = [50000, 100000, 500000, 1000000];

export default function DompetScreen() {
  const router = useRouter();

  const [dompetList, setDompetList] = useState<Dompet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Form states
  const [namaDompet, setNamaDompet] = useState("");
  const [jenisDompet, setJenisDompet] = useState("Bank");
  const [saldo, setSaldo] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [catatan, setCatatan] = useState("");
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    try {
      const data = await getDompetList();
      setDompetList(data);
    } catch (err) {
      console.warn("Error loading dompet:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSave = async () => {
    setFormError("");

    if (!namaDompet.trim()) {
      setFormError("Nama dompet wajib diisi.");
      return;
    }

    const cleanSaldo = saldo.replace(/[^0-9]/g, "");
    const parsedSaldo = cleanSaldo ? Number(cleanSaldo) : 0;

    setSubmitting(true);

    try {
      const { data, error } = await createDompet({
        nama_dompet: namaDompet.trim(),
        jenis_dompet: jenisDompet,
        saldo: parsedSaldo,
        nomor_rekening: nomorRekening.trim(),
        catatan: catatan.trim(),
      });

      if (error) {
        setFormError(error);
        setSubmitting(false);
        return;
      }

      // Success
      setNamaDompet("");
      setSaldo("");
      setNomorRekening("");
      setCatatan("");
      setSubmitting(false);

      Alert.alert(
        "Berhasil!",
        `Dompet "${namaDompet}" berhasil disimpan ke Supabase!`,
        [{ text: "OK" }],
      );

      // Refresh list
      loadData();
    } catch (err: any) {
      setSubmitting(false);
      setFormError(err.message || "Gagal menyimpan dompet.");
    }
  };

  const handleDelete = (item: Dompet) => {
    if (Platform.OS === "web") {
      const confirmDelete =
        typeof window !== "undefined"
          ? window.confirm(
              `Apakah Anda yakin ingin menghapus dompet "${item.nama_dompet}"?`,
            )
          : true;
      if (confirmDelete) {
        deleteDompet(item.id).then(() => {
          setDompetList((prev) => prev.filter((d) => d.id !== item.id));
        });
      }
      return;
    }

    Alert.alert(
      "Hapus Dompet",
      `Apakah Anda yakin ingin menghapus dompet "${item.nama_dompet}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await deleteDompet(item.id);
            setDompetList((prev) => prev.filter((d) => d.id !== item.id));
          },
        },
      ],
    );
  };

  const totalSaldo = dompetList.reduce(
    (acc, curr) => acc + (Number(curr.saldo) || 0),
    0,
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getJenisBadgeColor = (jenis: string) => {
    switch (jenis) {
      case "Bank":
        return "bg-blue-100 text-blue-800";
      case "E-Wallet":
        return "bg-purple-100 text-purple-800";
      case "Tunai":
        return "bg-emerald-100 text-emerald-800";
      case "Tabungan":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getJenisIcon = (jenis: string): keyof typeof Ionicons.glyphMap => {
    switch (jenis) {
      case "Bank":
        return "card-outline";
      case "E-Wallet":
        return "phone-portrait-outline";
      case "Tunai":
        return "cash-outline";
      case "Tabungan":
        return "wallet-outline";
      default:
        return "cube-outline";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFC]">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          className="px-6 py-4"
        >
          {/* Top Header */}
          <View className="flex-row items-center justify-between mb-5">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center shadow-xs"
            >
              <Ionicons name="arrow-back" size={20} color="#0D1E4C" />
            </TouchableOpacity>

            <View className="flex-row items-center">
              <CLogo size={32} variant="navy" />
              <Text className="text-lg font-bold text-gray-900 ml-2">
                Dompet Saya
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowForm(!showForm)}
              className="w-10 h-10 rounded-full bg-[#0D1E4C]/10 items-center justify-center"
            >
              <Ionicons
                name={showForm ? "chevron-up" : "add"}
                size={22}
                color="#0D1E4C"
              />
            </TouchableOpacity>
          </View>

          {/* Total Saldo Card (Style 29 Aesthetic) */}
          <View className="bg-[#0D1E4C] rounded-2xl p-5 mb-6 shadow-md shadow-[#0D1E4C]/25">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs uppercase font-semibold text-orange-400 tracking-wider">
                  Total Saldo Dompet
                </Text>
                <Text className="text-2xl font-bold text-white mt-1">
                  {formatRupiah(totalSaldo)}
                </Text>
              </View>
              <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center">
                <Ionicons name="wallet" size={26} color="#F97316" />
              </View>
            </View>

            <View className="mt-4 pt-3 border-t border-white/10 flex-row items-center justify-between">
              <Text className="text-xs text-gray-300">
                Terdaftar di Supabase Database
              </Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
                <Text className="text-xs text-white font-medium">
                  {dompetList.length} Akun Dompet
                </Text>
              </View>
            </View>
          </View>

          {/* Form Input Dompet */}
          {showForm && (
            <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-lg bg-orange-100 items-center justify-center mr-2">
                    <Ionicons name="add-circle" size={18} color="#EA580C" />
                  </View>
                  <Text className="text-base font-bold text-gray-900">
                    Input Dompet Baru
                  </Text>
                </View>
                <Text className="text-[11px] text-gray-400">Tabel: dompet</Text>
              </View>

              {formError ? (
                <View className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex-row items-center">
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  <Text className="ml-2 text-xs text-red-600 flex-1">
                    {formError}
                  </Text>
                </View>
              ) : null}

              {/* Input: Nama Dompet */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-gray-700 mb-1">
                  Nama Dompet <Text className="text-red-500">*</Text>
                </Text>
                <View className="border border-gray-300 rounded-lg px-3.5 py-2.5 bg-gray-50/50">
                  <TextInput
                    className="text-sm text-gray-900"
                    placeholder="Contoh: BCA Tahapan, GoPay, Tunai..."
                    placeholderTextColor="#9CA3AF"
                    value={namaDompet}
                    onChangeText={setNamaDompet}
                  />
                </View>
              </View>

              {/* Selector: Jenis Dompet */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-gray-700 mb-1.5">
                  Jenis Dompet
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {JENIS_OPTIONS.map((item) => {
                    const isSelected = jenisDompet === item.label;
                    return (
                      <TouchableOpacity
                        key={item.label}
                        activeOpacity={0.8}
                        onPress={() => setJenisDompet(item.label)}
                        className={`flex-row items-center px-3 py-2 rounded-lg border ${
                          isSelected
                            ? "bg-[#0D1E4C] border-[#0D1E4C]"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={15}
                          color={isSelected ? "#FFFFFF" : item.color}
                        />
                        <Text
                          className={`ml-1.5 text-xs font-medium ${
                            isSelected ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Input: Saldo Awal */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-gray-700 mb-1">
                  Saldo Awal (Rp)
                </Text>
                <View className="border border-gray-300 rounded-lg px-3.5 py-2.5 bg-gray-50/50 flex-row items-center">
                  <Text className="text-sm text-gray-500 font-medium mr-2">
                    Rp
                  </Text>
                  <TextInput
                    className="text-sm text-gray-900 flex-1"
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={saldo}
                    onChangeText={(val) => {
                      const num = val.replace(/[^0-9]/g, "");
                      setSaldo(num);
                    }}
                  />
                </View>

                {/* Quick Add Chips */}
                <View className="flex-row gap-2 mt-2">
                  {QUICK_AMOUNTS.map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      activeOpacity={0.7}
                      onPress={() => {
                        const current =
                          Number(saldo.replace(/[^0-9]/g, "")) || 0;
                        setSaldo(String(current + amt));
                      }}
                      className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200"
                    >
                      <Text className="text-[10px] text-gray-600 font-medium">
                        +
                        {amt >= 1000000
                          ? `${amt / 1000000}Jt`
                          : `${amt / 1000}Rb`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Input: Nomor Rekening / No. HP */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-gray-700 mb-1">
                  Nomor Rekening / No. Akun (Opsional)
                </Text>
                <View className="border border-gray-300 rounded-lg px-3.5 py-2.5 bg-gray-50/50">
                  <TextInput
                    className="text-sm text-gray-900"
                    placeholder="Nomor rekening bank atau nomor e-wallet"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    value={nomorRekening}
                    onChangeText={setNomorRekening}
                  />
                </View>
              </View>

              {/* Input: Catatan */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-gray-700 mb-1">
                  Catatan / Keterangan (Opsional)
                </Text>
                <View className="border border-gray-300 rounded-lg px-3.5 py-2 bg-gray-50/50">
                  <TextInput
                    className="text-sm text-gray-900"
                    placeholder="Contoh: Digunakan khusus tabungan liburan"
                    placeholderTextColor="#9CA3AF"
                    value={catatan}
                    onChangeText={setCatatan}
                    multiline
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={submitting}
                onPress={handleSave}
                className="bg-[#0D1E4C] active:bg-[#081433] rounded-xl py-3.5 items-center justify-center flex-row"
              >
                {submitting ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                    size="small"
                    className="mr-2"
                  />
                ) : (
                  <Ionicons
                    name="checkmark-sharp"
                    size={18}
                    color="#FFFFFF"
                    className="mr-1.5"
                  />
                )}
                <Text className="text-white text-sm font-semibold ml-1">
                  {submitting ? "Menyimpan ke Supabase..." : "Simpan Dompet"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Section: List of Dompet */}
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-bold text-gray-900">
              Daftar Dompet
            </Text>
            <TouchableOpacity onPress={handleRefresh}>
              <Text className="text-xs text-orange-600 font-semibold">
                Refresh
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator color="#0D1E4C" size="large" />
              <Text className="text-xs text-gray-400 mt-2">
                Memuat data dompet...
              </Text>
            </View>
          ) : dompetList.length === 0 ? (
            <View className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 items-center justify-center">
              <Ionicons name="wallet-outline" size={48} color="#9CA3AF" />
              <Text className="text-sm font-semibold text-gray-800 mt-2">
                Belum ada dompet
              </Text>
              <Text className="text-xs text-gray-400 text-center mt-1">
                Gunakan form di atas untuk menambahkan dompet pertama Anda.
              </Text>
            </View>
          ) : (
            dompetList.map((item) => (
              <View
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-xs flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1 pr-2">
                  <View className="w-11 h-11 rounded-xl bg-[#0D1E4C]/5 items-center justify-center mr-3">
                    <Ionicons
                      name={getJenisIcon(item.jenis_dompet)}
                      size={22}
                      color="#0D1E4C"
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center flex-wrap gap-1.5 mb-0.5">
                      <Text className="text-sm font-bold text-gray-900">
                        {item.nama_dompet}
                      </Text>
                      <View
                        className={`px-2 py-0.5 rounded-full ${getJenisBadgeColor(
                          item.jenis_dompet,
                        )}`}
                      >
                        <Text className="text-[10px] font-semibold">
                          {item.jenis_dompet}
                        </Text>
                      </View>
                    </View>

                    {item.nomor_rekening ? (
                      <Text className="text-[11px] text-gray-500 font-mono">
                        No: {item.nomor_rekening}
                      </Text>
                    ) : null}

                    {item.catatan ? (
                      <Text className="text-[11px] text-gray-400 italic mt-0.5">
                        "{item.catatan}"
                      </Text>
                    ) : null}

                    <Text className="text-sm font-bold text-[#0D1E4C] mt-1">
                      {formatRupiah(Number(item.saldo) || 0)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleDelete(item)}
                  className="w-9 h-9 rounded-lg bg-red-50 items-center justify-center ml-2"
                >
                  <Ionicons name="trash-outline" size={17} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
