import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import MyButton from "../components/MyButton";
import { formatRupiah } from "../lib/format";
import { supabase } from "../lib/supabase";

type DompetItem = {
  id: number;
  name: string;
  balance: number;
  cardBackground: string;
  cardColor: string;
};

export default function Main() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [dompets, setDompets] = useState<DompetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Jalan setiap kali halaman ini tampil,
  // termasuk setelah kembali dari halaman Tambah Dompet
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }
        setEmail(user.email ?? "");
        setFullName(user.user_metadata.full_name ?? "");

        // Ambil dompet milik user yang login, terbaru di atas
        const { data, error } = await supabase
          .from("dompet")
          .select("id, name, balance, cardBackground, cardColor")
          .eq("userId", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg("");
          setDompets(data ?? []);
        }
        setLoading(false);
      };

      loadData();
    }, [router]),
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const namaTampil = fullName || email;
  const totalSaldo = dompets.reduce((total, item) => total + item.balance, 0);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-[28px] pt-[70px] pb-[40px]"
      >
        {/* Sapaan */}
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-[14px] text-gray-500">Selamat datang,</Text>
            <Text className="mt-1 text-[24px] font-semibold" numberOfLines={1}>
              {namaTampil}
            </Text>
            <Text className="mt-1 text-[12px] text-gray-500">
              240444020025 · Manajemen Informatika
            </Text>
          </View>
          <View className="ml-4 h-[50px] w-[50px] items-center justify-center rounded-full bg-[#0B6EFE]">
            <Text className="text-[20px] font-bold text-white">
              {namaTampil.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Kartu total saldo */}
        <View className="mt-8 rounded-[10px] bg-[#0B6EFE] p-5">
          <Text className="text-[13px] text-white">Total Saldo</Text>
          <Text className="mt-1 text-[30px] font-bold text-white">
            Rp {formatRupiah(totalSaldo)}
          </Text>
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-[13px] text-white">
              {dompets.length} dompet
            </Text>
            <Text className="text-[12px] text-white" numberOfLines={1}>
              {email}
            </Text>
          </View>
        </View>

        {/* Daftar dompet */}
        <Text className="mt-8 text-[18px] font-semibold">Dompet Saya</Text>

        {loading && (
          <Text className="mt-4 text-[14px] text-gray-500">
            Memuat dompet...
          </Text>
        )}

        {!loading && errorMsg !== "" && (
          <Text className="mt-4 text-[13px] text-[#E57373]">{errorMsg}</Text>
        )}

        {!loading && errorMsg === "" && dompets.length === 0 && (
          <View className="mt-4 items-center rounded-[10px] border border-dashed border-[#9CA3AF] p-6">
            <Text className="text-[15px] font-semibold">Belum ada dompet</Text>
            <Text className="mt-1 text-center text-[13px] text-gray-500">
              Tambahkan dompet pertamamu untuk mulai mencatat saldo.
            </Text>
          </View>
        )}

        {dompets.map((item) => (
          <View
            key={item.id}
            className="mt-4 rounded-[10px] p-5"
            style={{ backgroundColor: item.cardBackground }}
          >
            <View className="flex-row items-center justify-between">
              <View className="h-[14px] w-[20px] rounded-[3px] bg-[#FACC15]" />
              <Text
                className="text-[11px] font-bold"
                style={{ color: item.cardColor }}
              >
                •••• {String(item.id).padStart(4, "0")}
              </Text>
            </View>
            <Text className="mt-4 text-[13px]" style={{ color: item.cardColor }}>
              {item.name}
            </Text>
            <Text
              className="mt-1 text-[22px] font-bold"
              style={{ color: item.cardColor }}
            >
              Rp {formatRupiah(item.balance)}
            </Text>
          </View>
        ))}

        {/* Tambah dompet */}
        <MyButton
          title="Tambah Dompet"
          className="mt-8"
          onPress={() => router.push("/dompet")}
        />

        {/* Logout */}
        <MyButton title="Logout" className="mt-4" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}
