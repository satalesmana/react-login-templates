import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CLogo from "../components/CLogo";

interface DashboardItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: string;
}

const ITEMS: DashboardItem[] = [
  {
    id: "1",
    title: "Account Overview",
    subtitle: "Manage your personal details & security",
    icon: "person-circle-outline",
    category: "General",
  },
  {
    id: "2",
    title: "Security & Passwords",
    subtitle: "2FA authentication, active devices",
    icon: "shield-checkmark-outline",
    category: "Security",
  },
  {
    id: "3",
    title: "Linked Social Accounts",
    subtitle: "Google, Facebook, LinkedIn connected",
    icon: "link-outline",
    category: "Social",
  },
  {
    id: "4",
    title: "Notifications & Privacy",
    subtitle: "Configure alerts, privacy preferences",
    icon: "notifications-outline",
    category: "Settings",
  },
];

export default function MainPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    userName?: string;
    userEmail?: string;
  }>();

  const userEmail = params.userEmail || "user@example.com";
  const userGreeting = userEmail.split("@")[0].replace(".", " ");
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  const filteredItems = ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-6 py-4"
      >
        {/* Top Header with C Logo */}
        <View className="flex-row items-center justify-between mt-2 mb-6">
          <View className="flex-row items-center">
            <CLogo size={42} variant="navy" />
            <View className="ml-3">
              <Text className="text-xs text-gray-400 font-medium">
                Welcome back,
              </Text>
              <Text className="text-base font-bold text-gray-900 capitalize">
                {userGreeting}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#0D1E4C" />
          </TouchableOpacity>
        </View>

        {/* Navy Welcome Card */}
        <View className="bg-[#0D1E4C] rounded-2xl p-6 mb-6 shadow-md shadow-[#0D1E4C]/20">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-4">
              <Text className="text-xs text-orange-400 uppercase tracking-widest font-semibold mb-1">
                Active Session
              </Text>
              <Text className="text-xl font-bold text-white mb-1">
                You're logged in!
              </Text>
              <Text className="text-xs text-gray-300 leading-relaxed">
                {userEmail}
              </Text>
            </View>
            <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center">
              <Ionicons name="checkmark-done" size={26} color="#FFFFFF" />
            </View>
          </View>

          {/* Progress / Status indicator */}
          <View className="mt-5 pt-4 border-t border-white/10 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2" />
              <Text className="text-xs text-gray-200">
                Account Status: Verified
              </Text>
            </View>
            <Text className="text-xs font-semibold text-orange-300">
              100%
            </Text>
          </View>
        </View>

        {/* Search */}
        <View className="border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row items-center mb-6">
          <Ionicons name="search-outline" size={18} color="#9E9E9E" />
          <TextInput
            className="text-sm text-gray-900 flex-1 ml-3"
            placeholder="Search account settings & features..."
            placeholderTextColor="#9E9E9E"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#9E9E9E" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Dashboard Items */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 mb-3">
            Account Features
          </Text>

          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(item.title, `Opening ${item.title}...`)
              }
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3 flex-row items-center justify-between shadow-xs"
            >
              <View className="flex-row items-center flex-1 pr-2">
                <View className="w-10 h-10 rounded-lg bg-[#0D1E4C]/5 items-center justify-center mr-3">
                  <Ionicons name={item.icon} size={22} color="#0D1E4C" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9E9E9E" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          className="border border-[#0D1E4C] rounded-lg py-3.5 items-center justify-center flex-row mt-2"
        >
          <Ionicons name="log-out-outline" size={18} color="#0D1E4C" />
          <Text className="text-[#0D1E4C] text-sm font-semibold ml-2">
            Logout from Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
