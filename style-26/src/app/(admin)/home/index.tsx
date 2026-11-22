import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../lib/supabase";

interface Dompet {
  id: number;
  name: string;
  balance: number;
  cardBackground: string;
  cardColor: string;
}

interface UserInfo {
  email: string;
  id: string;
  createdAt: string;
  emailConfirmed: boolean;
}

export default function AdminHomeScreen() {
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [dompetList, setDompetList] = React.useState<Dompet[]>([]);
  const router = useRouter();

  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    setUserInfo({
      email: user.email ?? "-",
      id: user.id,
      createdAt: user.created_at,
      emailConfirmed: !!user.email_confirmed_at,
    });
    const { data } = await supabase
      .from("dompet")
      .select()
      .eq("userId", user.id)
      .order("created_at", { ascending: false });
    if (data) {
      setDompetList(data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onLogoutPress = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const displayName = userInfo?.email ? userInfo.email.split("@")[0] : "";
  const joinDateObject = userInfo ? new Date(userInfo.createdAt) : null;
  const joinDate =
    joinDateObject && !isNaN(joinDateObject.getTime())
      ? joinDateObject.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";
  const totalBalance = dompetList.reduce((sum, item) => sum + item.balance, 0);

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.textTitle}>Dashboard</Text>
      <Text style={styles.textDesc}>
        {userInfo ? `Selamat datang, ${displayName}!` : "Selamat datang!"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Akun Saya</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{userInfo ? userInfo.email : "-"}</Text>

        <Text style={styles.label}>User ID</Text>
        <Text style={styles.idValue}>{userInfo ? userInfo.id : "-"}</Text>

        <Text style={styles.label}>Tanggal Bergabung</Text>
        <Text style={styles.value}>{joinDate}</Text>

        <Text style={styles.label}>Status Email</Text>
        <Text style={styles.value}>
          {userInfo
            ? userInfo.emailConfirmed
              ? "Terverifikasi"
              : "Belum Terverifikasi"
            : "-"}
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Saldo Semua Dompet</Text>
        <Text style={styles.summaryValue}>
          Rp {totalBalance.toLocaleString("id-ID")}
        </Text>
        <Text style={styles.summarySub}>{dompetList.length} dompet</Text>
      </View>

      <Text style={styles.sectionTitle}>Dompet Saya</Text>

      {dompetList.length === 0 && (
        <Text style={styles.emptyText}>
          Belum ada dompet. Buat dompet pertamamu!
        </Text>
      )}

      {dompetList.map((item) => (
        <View
          key={item.id}
          style={[styles.walletCard, { backgroundColor: item.cardBackground }]}
        >
          <Text style={[styles.walletName, { color: item.cardColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.walletBalance, { color: item.cardColor }]}>
            Rp {item.balance.toLocaleString("id-ID")}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/(admin)/dompet")}
      >
        <Text style={styles.primaryButtonText}>Tambah Dompet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onLogoutPress}>
        <Text style={styles.secondaryButtonText}>Logout</Text>
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
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 32,
  },
  textTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
  },
  textDesc: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 6,
    marginBottom: 28,
  },
  card: {
    backgroundColor: "#F3EDF9",
    borderRadius: 14,
    padding: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4E0189",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 14,
  },
  idValue: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 14,
  },
  summaryCard: {
    backgroundColor: "#4E0189",
    borderRadius: 14,
    padding: 20,
    marginTop: 16,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
    opacity: 0.85,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 6,
  },
  summarySub: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.85,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginTop: 28,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  walletCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  walletName: {
    fontSize: 16,
    fontWeight: "700",
  },
  walletBalance: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },
  primaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#4E0189",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#4E0189",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#4E0189",
    fontSize: 17,
    fontWeight: "600",
  },
});
