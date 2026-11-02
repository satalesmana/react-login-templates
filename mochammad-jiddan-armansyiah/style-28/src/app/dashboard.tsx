import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { supabase } from "../../lib/supabase";
import MyButton from "@/components/MyButton";

interface DompetItem {
  id: number;
  userId?: string;
  userid?: string;
  name: string;
  balance: number;
  cardBackground?: string;
  cardbackground?: string;
  cardColor?: string;
  cardcolor?: string;
  created_at: string;
}

export default function DashboardScreen() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [dompetList, setDompetList] = useState<DompetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Ambil data user & daftar dompet
  const fetchDashboardData = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        // Jika tidak ada user login, kembalikan ke login
        router.replace("/login");
        return;
      }

      const user = userData.user;
      setUserId(user.id);
      setUserEmail(user.email || "-");
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
      setUserName(name);

      // Ambil daftar dompet (utamakan query select() lalu filter userid / userId)
      let { data: dompets, error: dompetError } = await supabase
        .from("dompet")
        .select()
        .eq("userid", user.id)
        .order("created_at", { ascending: false });

      // Fallback jika nama kolom di PostgreSQL tersimpan sebagai "userId"
      if (dompetError && dompetError.message.includes("userid does not exist")) {
        const retry = await supabase
          .from("dompet")
          .select()
          .eq("userId", user.id)
          .order("created_at", { ascending: false });
        dompets = retry.data;
        dompetError = retry.error;
      }

      if (dompetError) {
        console.error("[fetchDashboardData] error fetching dompet:", dompetError);
      } else {
        setDompetList(dompets || []);
      }
    } catch (err) {
      console.error("[fetchDashboardData]", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (err) {
      console.error("[handleLogout]", err);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const totalBalance = dompetList.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#DEC39A" />
        }
      >
        {/* Header Profile */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user" size={36} color="#DEC39A" />
          </View>
          <Text style={styles.welcomeText}>Selamat Datang,</Text>
          <Text style={styles.nameText}>{userName}</Text>
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>

        {/* Ringkasan Saldo Seluruh Dompet */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>TOTAL SALDO KESELURUHAN</Text>
              <Text style={styles.summaryValue}>Rp {formatRupiah(totalBalance)}</Text>
            </View>
            <View style={styles.walletIconCircle}>
              <FontAwesome name="money" size={24} color="#102C57" />
            </View>
          </View>
          <Text style={styles.walletCountText}>
            Memiliki {dompetList.length} dompet aktif
          </Text>
        </View>

        {/* Bagian Dompet Saya & Tombol Tambah */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Dompet Saya</Text>
          <TouchableOpacity
            style={styles.addWalletBtn}
            onPress={() => router.push("/create-dompet")}
            activeOpacity={0.8}
          >
            <FontAwesome name="plus" size={13} color="#102C57" style={{ marginRight: 6 }} />
            <Text style={styles.addWalletBtnText}>Tambah Dompet</Text>
          </TouchableOpacity>
        </View>

        {/* Daftar Kartu Dompet */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#DEC39A" />
            <Text style={styles.loadingText}>Memuat dompet...</Text>
          </View>
        ) : dompetList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="credit-card" size={42} color="rgba(222, 195, 154, 0.4)" />
            <Text style={styles.emptyTitle}>Belum Ada Dompet</Text>
            <Text style={styles.emptySubtitle}>
              Klik tombol "+ Tambah Dompet" di atas untuk membuat dompet baru Anda.
            </Text>
          </View>
        ) : (
          dompetList.map((item) => {
            const cardBg = item.cardbackground || item.cardBackground || "#3B0764";
            const cardFontColor = item.cardcolor || item.cardColor || "#FFFFFF";

            return (
              <View
                key={item.id}
                style={[
                  styles.cardItem,
                  { backgroundColor: cardBg },
                ]}
              >
                {/* Card Top */}
                <View style={styles.cardItemHeader}>
                  <View style={styles.cardChipRow}>
                    <View style={styles.cardChip}>
                      <View style={styles.cardChipLine} />
                      <View style={styles.cardChipLine} />
                    </View>
                    <FontAwesome
                      name="feed"
                      size={14}
                      color={cardFontColor}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                  <View style={styles.badgeWallet}>
                    <View style={styles.greenDot} />
                    <Text style={styles.badgeWalletText}>PAYNEX E-WALLET</Text>
                  </View>
                </View>

                {/* Balance */}
                <View style={styles.cardItemBalance}>
                  <Text
                    style={[
                      styles.cardItemBalanceLabel,
                      { color: cardFontColor, opacity: 0.8 },
                    ]}
                  >
                    SALDO TERSEDIA
                  </Text>
                  <Text
                    style={[
                      styles.cardItemBalanceValue,
                      { color: cardFontColor },
                    ]}
                  >
                    Rp {formatRupiah(item.balance)}
                  </Text>
                </View>

                {/* Footer */}
                <View style={styles.cardItemFooter}>
                  <View>
                    <Text
                      style={[
                        styles.cardItemFooterLabel,
                        { color: cardFontColor, opacity: 0.8 },
                      ]}
                    >
                      NAMA DOMPET
                    </Text>
                    <Text
                      style={[
                        styles.cardItemWalletName,
                        { color: cardFontColor },
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={[
                        styles.cardNumberMask,
                        { color: cardFontColor },
                      ]}
                    >
                      •••• {item.id.toString().padStart(4, "0")}
                    </Text>
                    <Text
                      style={[
                        styles.cardValidThru,
                        { color: cardFontColor, opacity: 0.8 },
                      ]}
                    >
                      VALID THRU 12/29
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}

        {/* Tombol Logout */}
        <View style={styles.buttonWrapper}>
          <MyButton
            text="Logout"
            variant="outline"
            action={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#102C57",
  },
  container: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    backgroundColor: "#1B3A6B",
    borderColor: "#DEC39A",
  },
  welcomeText: {
    color: "#CBD5E1",
    fontSize: 14,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 2,
  },
  emailText: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 2,
  },

  /* Summary Card */
  summaryCard: {
    backgroundColor: "#173769",
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(222, 195, 154, 0.25)",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: "#DEC39A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DEC39A",
    justifyContent: "center",
    alignItems: "center",
  },
  walletCountText: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 10,
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  addWalletBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DEC39A",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  addWalletBtnText: {
    color: "#102C57",
    fontSize: 13,
    fontWeight: "700",
  },

  /* Card Item */
  cardItem: {
    width: "100%",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  cardItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardChipRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardChip: {
    width: 28,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#FACC15",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  cardChipLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#CA8A04",
    marginVertical: 1.5,
  },
  badgeWallet: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    marginRight: 5,
  },
  badgeWalletText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardItemBalance: {
    marginVertical: 12,
  },
  cardItemBalanceLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  cardItemBalanceValue: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cardItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardItemFooterLabel: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardItemWalletName: {
    fontSize: 14,
    fontWeight: "700",
    maxWidth: 150,
  },
  cardNumberMask: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  cardValidThru: {
    fontSize: 8,
    fontWeight: "600",
    marginTop: 2,
  },

  /* Loading & Empty */
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    color: "#CBD5E1",
    fontSize: 13,
    marginTop: 8,
  },
  emptyContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderStyle: "dashed",
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  emptySubtitle: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },

  /* Button Logout */
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
});
