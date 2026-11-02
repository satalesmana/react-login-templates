import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
type Dompet = {
  id: number;
  userId: string;
  name: string;
  balance: number;
  cardBackground: string;
  cardColor: string;
  updated_at: string;
  created_at: string;
};

// ─── Preset warna kartu ───────────────────────────────────────────────────────
const CARD_COLORS = [
  { bg: "#0152FE", text: "#FFFFFF", label: "Biru" },
  { bg: "#00A520", text: "#FFFFFF", label: "Hijau" },
  { bg: "#6B4EFF", text: "#FFFFFF", label: "Ungu" },
  { bg: "#FF4444", text: "#FFFFFF", label: "Merah" },
  { bg: "#FF8C00", text: "#FFFFFF", label: "Oranye" },
  { bg: "#1A1A2E", text: "#FFFFFF", label: "Gelap" },
];

// ─── Helper format rupiah ─────────────────────────────────────────────────────
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Komponen Kartu Dompet ────────────────────────────────────────────────────
function DompetCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Dompet;
  onEdit: (d: Dompet) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <View
      className="rounded-2xl p-5 mb-3"
      style={{ backgroundColor: item.cardBackground }}
    >
      <View className="flex-row justify-between items-start">
        <Text
          className="text-lg font-bold flex-1 mr-2"
          style={{ color: item.cardColor }}
        >
          {item.name}
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => onEdit(item)}
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
          >
            <Text style={{ color: item.cardColor }} className="text-xs font-semibold">
              Edit
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onDelete(item.id)}
            className="bg-red-500 px-3 py-1 rounded-full"
          >
            <Text className="text-white text-xs font-semibold">Hapus</Text>
          </Pressable>
        </View>
      </View>

      <Text className="text-2xl font-bold mt-4" style={{ color: item.cardColor }}>
        {formatRupiah(item.balance)}
      </Text>

      <Text
        className="text-xs mt-2"
        style={{ color: item.cardColor + "99" }}
      >
        Diperbarui: {new Date(item.updated_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>
    </View>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────
export default function DompetPage() {
  const [dompetList, setDompetList] = useState<Dompet[]>([]);
  const [loading, setLoading] = useState(true);

  // State modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDompet, setEditingDompet] = useState<Dompet | null>(null);

  // State form
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [selectedColor, setSelectedColor] = useState(CARD_COLORS[0]);
  const [formLoading, setFormLoading] = useState(false);

  const router = useRouter();

  // ── Fetch semua dompet ──────────────────────────────────────────────────────
  const fetchDompet = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("dompet")
      .select()
      .order("balance", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setDompetList(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDompet();
  }, [fetchDompet]);

  // ── Buka modal tambah ───────────────────────────────────────────────────────
  function openAddModal() {
    setEditingDompet(null);
    setName("");
    setBalance("");
    setSelectedColor(CARD_COLORS[0]);
    setModalVisible(true);
  }

  // ── Buka modal edit ─────────────────────────────────────────────────────────
  function openEditModal(dompet: Dompet) {
    setEditingDompet(dompet);
    setName(dompet.name);
    setBalance(dompet.balance.toString());
    const found = CARD_COLORS.find((c) => c.bg === dompet.cardBackground);
    setSelectedColor(found ?? CARD_COLORS[0]);
    setModalVisible(true);
  }

  // ── Simpan (insert / update) ────────────────────────────────────────────────
  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Validasi", "Nama dompet tidak boleh kosong!");
      return;
    }
    const balanceNum = parseInt(balance) || 0;

    setFormLoading(true);

    if (editingDompet) {
      // UPDATE
      const { error } = await supabase
        .from("dompet")
        .update({
          name: name.trim(),
          balance: balanceNum,
          cardBackground: selectedColor.bg,
          cardColor: selectedColor.text,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingDompet.id);

      if (error) Alert.alert("Error", error.message);
    } else {
      // INSERT — ambil user yang sedang login
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { error } = await supabase
        .from("dompet")
        .insert([
          {
            userId: user.id,
            name: name.trim(),
            balance: balanceNum,
            cardBackground: selectedColor.bg,
            cardColor: selectedColor.text,
          },
        ])
        .select();

      if (error) Alert.alert("Error", error.message);
    }

    setFormLoading(false);
    setModalVisible(false);
    fetchDompet();
  }

  // ── Hapus dompet ────────────────────────────────────────────────────────────
  function handleDelete(id: number) {
    Alert.alert("Hapus Dompet", "Yakin ingin menghapus dompet ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("dompet")
            .delete()
            .eq("id", id);

          if (error) Alert.alert("Error", error.message);
          else fetchDompet();
        },
      },
    ]);
  }

  // ── Logout ──────────────────────────────────────────────────────────────────
  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  // ── Total seluruh saldo ─────────────────────────────────────────────────────
  const totalBalance = dompetList.reduce((sum, d) => sum + d.balance, 0);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* ── Header ── */}
      <View className="bg-[#0152FE] pt-8 pb-6 px-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">Dompet Saya</Text>
          <Pressable
            onPress={handleLogout}
            className="px-4 py-1.5 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Text className="text-white font-semibold text-sm">Keluar</Text>
          </Pressable>
        </View>

        {/* Total saldo */}
        <View className="mt-5 bg-white/10 rounded-2xl p-4">
          <Text className="text-white/70 text-sm">Total Saldo</Text>
          <Text className="text-white text-3xl font-bold mt-1">
            {formatRupiah(totalBalance)}
          </Text>
          <Text className="text-white/60 text-xs mt-1">
            {dompetList.length} dompet tersimpan
          </Text>
        </View>
      </View>

      {/* ── Daftar Dompet ── */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0152FE" />
        </View>
      ) : (
        <FlatList
          data={dompetList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-24">
              <Text className="text-5xl mb-4">👛</Text>
              <Text className="text-gray-500 text-lg font-medium">
                Belum ada dompet
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                Tap tombol + untuk menambahkan
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <DompetCard
              item={item}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          )}
        />
      )}

      {/* ── FAB Tambah ── */}
      <Pressable
        onPress={openAddModal}
        className="absolute bottom-8 right-6 bg-[#0152FE] active:bg-[#054ae0] w-16 h-16 rounded-full items-center justify-center"
        style={{
          shadowColor: "#0152FE",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text className="text-white text-4xl font-light" style={{ lineHeight: 48 }}>
          +
        </Text>
      </Pressable>

      {/* ── Modal Tambah / Edit ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            {/* Handle bar */}
            <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-5" />

            <Text className="text-xl font-bold mb-5">
              {editingDompet ? "Edit Dompet" : "Tambah Dompet"}
            </Text>

            {/* Preview kartu */}
            <View
              className="rounded-xl p-4 mb-5"
              style={{ backgroundColor: selectedColor.bg }}
            >
              <Text style={{ color: selectedColor.text }} className="font-bold text-base">
                {name.trim() || "Nama Dompet"}
              </Text>
              <Text style={{ color: selectedColor.text }} className="font-bold text-xl mt-2">
                {formatRupiah(parseInt(balance) || 0)}
              </Text>
            </View>

            {/* Input Nama */}
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Nama Dompet
            </Text>
            <TextInput
              placeholder="Contoh: Dompet Utama"
              className="border border-[#BDBDBD] rounded-xl px-4 py-3 mb-4 text-base"
              value={name}
              onChangeText={setName}
            />

            {/* Input Saldo */}
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Saldo (Rp)
            </Text>
            <TextInput
              placeholder="Contoh: 50000"
              className="border border-[#BDBDBD] rounded-xl px-4 py-3 mb-4 text-base"
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
            />

            {/* Pilih Warna */}
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Warna Kartu
            </Text>
            <View className="flex-row gap-3 mb-6">
              {CARD_COLORS.map((color) => (
                <Pressable
                  key={color.bg}
                  onPress={() => setSelectedColor(color)}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: color.bg,
                    borderWidth: selectedColor.bg === color.bg ? 3 : 0,
                    borderColor: "#1A1A2E",
                  }}
                >
                  {selectedColor.bg === color.bg && (
                    <Text className="text-white font-bold text-xs">✓</Text>
                  )}
                </Pressable>
              ))}
            </View>

            {/* Tombol Aksi */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 border border-[#CFCFCF] rounded-xl h-14 items-center justify-center active:bg-gray-50"
              >
                <Text className="font-bold text-base text-gray-700">Batal</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={formLoading}
                className="flex-1 bg-[#0152FE] active:bg-[#054ae0] rounded-xl h-14 items-center justify-center"
              >
                {formLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Simpan</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

