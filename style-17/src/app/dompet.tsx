import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { formatRupiah } from "../lib/format";
import { supabase } from "../lib/supabase";

// Pilihan desain kartu (warna latar kartu)
const DESAIN_KARTU = [
  { nama: "Indigo Royale", warna: "#312E81" },
  { nama: "Emerald", warna: "#047857" },
  { nama: "Sunset", warna: "#EA580C" },
  { nama: "Midnight", warna: "#0F172A" },
  { nama: "Ocean Blue", warna: "#2563EB" },
];

// Pilihan warna huruf & aksen di kartu
const WARNA_HURUF = [
  { nama: "Putih", label: "Putih Cerah", warna: "#FFFFFF" },
  { nama: "Gold", label: "Gold", warna: "#FACC15" },
  { nama: "Silver", label: "Silver", warna: "#CBD5E1" },
  { nama: "Cyan", label: "Cyan", warna: "#22D3EE" },
];

const KATEGORI = ["Harian", "Tabungan", "Belanja", "Bisnis", "Darurat"];

const TAMBAH_SALDO = [
  { label: "+ 100 Rb", nilai: 100000 },
  { label: "+ 500 Rb", nilai: 500000 },
  { label: "+ 1 Juta", nilai: 1000000 },
];

export default function Dompet() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [desain, setDesain] = useState(DESAIN_KARTU[0]);
  const [huruf, setHuruf] = useState(WARNA_HURUF[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Warna teks di kartu mengikuti pilihan "Warna Huruf"
  const warnaTeks = { color: huruf.warna };

  const handleSimpan = async () => {
    if (loading) return;

    if (nama.trim() === "") {
      setError("Nama dompet wajib diisi !");
      return;
    }
    setError("");
    setLoading(true);

    // Ambil akun yang sedang login
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    // Simpan ke tabel dompet
    const { error: insertError } = await supabase.from("dompet").insert([
      {
        userId: user.id,
        name: nama.trim(),
        balance: saldo,
        cardBackground: desain.warna,
        cardColor: huruf.warna,
      },
    ]);
    setLoading(false);

    if (insertError) {
      Alert.alert("Gagal menyimpan", insertError.message);
      return;
    }

    Alert.alert("Berhasil", "Dompet berhasil disimpan.");
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F7F7FD]">
      {/* Header */}
      <View className="flex-row items-center px-[20px] pt-[50px] pb-[12px]">
        <Pressable onPress={() => router.back()} className="mr-3 px-2">
          <Text className="text-[30px] text-black">‹</Text>
        </Pressable>
        <Text className="text-[18px] font-semibold">Tambah Dompet</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[20px] pb-[40px]"
        keyboardShouldPersistTaps="handled"
      >
        {/* Kartu preview */}
        <View
          className="rounded-[16px] p-5"
          style={{ backgroundColor: desain.warna }}
        >
          <View className="flex-row items-center justify-between">
            <View className="h-[18px] w-[26px] rounded-[4px] bg-[#FACC15]" />
            <View className="flex-row items-center rounded-full bg-black/30 px-3 py-1">
              <View className="mr-2 h-[6px] w-[6px] rounded-full bg-[#4ADE80]" />
              <Text className="text-[10px] font-bold text-white">
                PAYNEX E-WALLET
              </Text>
            </View>
          </View>

          <Text className="mt-6 text-[10px]" style={warnaTeks}>
            SALDO TERSEDIA
          </Text>
          <Text className="mt-1 text-[26px] font-bold" style={warnaTeks}>
            Rp {formatRupiah(saldo)}
          </Text>

          <View className="mt-6 flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-[10px]" style={warnaTeks}>
                NAMA DOMPET
              </Text>
              <Text
                className="mt-1 text-[18px] font-semibold"
                style={warnaTeks}
                numberOfLines={1}
              >
                {nama.trim() || "Dompet Utama"}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[11px] font-bold" style={warnaTeks}>
                •••• 9021
              </Text>
              <Text className="mt-1 text-[9px]" style={warnaTeks}>
                VALID THRU 12/29
              </Text>
            </View>
          </View>
        </View>

        {/* Nama dompet */}
        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[15px] font-semibold">Nama Dompet</Text>
          <Text className="text-[11px] text-gray-500">Wajib diisi</Text>
        </View>
        <TextInput
          className={`mt-2 h-[44px] rounded-full bg-[#EEF0FB] px-4 text-[15px] text-black ${
            error ? "border border-[#E57373]" : ""
          }`}
          placeholder="Dompet Utama"
          placeholderTextColor="#9CA3AF"
          value={nama}
          onChangeText={setNama}
        />
        {error !== "" && (
          <Text className="mt-1 text-[12px] text-[#E57373]">{error}</Text>
        )}

        {/* Pilihan cepat nama */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerClassName="gap-2"
        >
          {KATEGORI.map((item) => (
            <Pressable
              key={item}
              onPress={() => setNama(item)}
              className="rounded-full bg-[#E4E7F7] px-4 py-2 active:opacity-70"
            >
              <Text className="text-[13px] text-gray-700">{item}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Saldo awal */}
        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[15px] font-semibold">Saldo Awal</Text>
          <Text className="text-[11px] font-semibold text-[#047857]">
            Bebas Biaya Admin
          </Text>
        </View>
        <View className="mt-2 flex-row items-center rounded-[12px] bg-[#EEF0FB] px-4">
          <Text className="mr-2 text-[16px] font-bold">Rp</Text>
          <TextInput
            className="h-[52px] flex-1 text-[26px] font-bold text-black"
            placeholder="0"
            placeholderTextColor="#000000"
            keyboardType="number-pad"
            value={saldo === 0 ? "" : formatRupiah(saldo)}
            onChangeText={(text) => setSaldo(Number(text.replace(/\D/g, "")))}
          />
        </View>
        <Text className="mt-2 text-[11px] text-gray-600">
          Saldo saat dompet baru ini dibuat (default Rp 0).
        </Text>

        <View className="mt-3 flex-row gap-2">
          {TAMBAH_SALDO.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => setSaldo(saldo + item.nilai)}
              className="flex-1 items-center rounded-full bg-[#EEF0FB] py-2 active:opacity-70"
            >
              <Text className="text-[13px] font-semibold text-[#312E81]">
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Desain kartu */}
        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[15px] font-semibold">Pilihan Desain Kartu</Text>
          <Text className="text-[11px] text-gray-500">{desain.nama}</Text>
        </View>
        <View className="mt-3 flex-row gap-3">
          {DESAIN_KARTU.map((item) => (
            <Pressable
              key={item.nama}
              onPress={() => setDesain(item)}
              className={`aspect-square flex-1 items-center justify-center rounded-[12px] ${
                desain.nama === item.nama ? "border-2 border-[#3B28CC]" : ""
              }`}
              style={{ backgroundColor: item.warna }}
            >
              {desain.nama === item.nama && (
                <Text className="text-[18px] font-bold text-white">✓</Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* Warna huruf & aksen */}
        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[15px] font-semibold">Warna Huruf & Aksen</Text>
          <Text className="text-[11px] text-gray-500">{huruf.label}</Text>
        </View>
        <View className="mt-3 flex-row flex-wrap gap-2">
          {WARNA_HURUF.map((item) => (
            <Pressable
              key={item.nama}
              onPress={() => setHuruf(item)}
              className={`flex-row items-center rounded-full px-4 py-2 ${
                huruf.nama === item.nama ? "bg-[#DDE1FA]" : "bg-[#EEF0FB]"
              }`}
            >
              <View
                className="mr-2 h-[14px] w-[14px] rounded-full border border-gray-300"
                style={{ backgroundColor: item.warna }}
              />
              <Text className="text-[13px] font-semibold">{item.nama}</Text>
            </Pressable>
          ))}
        </View>

        {/* Info */}
        <View className="mt-6 flex-row rounded-[14px] bg-[#EEF0FB] p-4">
          <View className="mr-3 h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#6EE7B7]">
            <Text className="text-[18px] font-bold text-[#065F46]">⇄</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-semibold">
              Integrasi Transaksi Otomatis
            </Text>
            <Text className="mt-1 text-[11px] text-gray-600">
              Dompet ini siap ditautkan ke akun Anda untuk pencatatan riwayat
              Cash-In (CI) dan Cash-Out (CO) secara real-time.
            </Text>
          </View>
        </View>

        {/* Tombol */}
        <Pressable
          onPress={handleSimpan}
          className="mt-8 h-[52px] items-center justify-center rounded-full bg-[#3B28CC] active:opacity-80"
        >
          <Text className="text-[16px] font-semibold text-white">
            {loading ? "Menyimpan..." : "Simpan Dompet"}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="mt-3 items-center py-2">
          <Text className="text-[14px] text-gray-700">Batal</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
