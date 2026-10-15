import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface SocialButtonsProps {
  onPressProvider?: (provider: "facebook" | "google" | "linkedin") => void;
}

export default function SocialButtons({ onPressProvider }: SocialButtonsProps) {
  return (
    <View className="flex-row items-center justify-center space-x-4 gap-4 my-2">
      {/* Facebook */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPressProvider?.("facebook")}
        className="w-10 h-10 rounded-full bg-[#1877F2] items-center justify-center shadow-xs"
      >
        <Ionicons name="logo-facebook" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Google */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPressProvider?.("google")}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center shadow-xs"
      >
        <Ionicons name="logo-google" size={20} color="#EA4335" />
      </TouchableOpacity>

      {/* LinkedIn */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPressProvider?.("linkedin")}
        className="w-10 h-10 rounded-lg bg-[#0A66C2] items-center justify-center shadow-xs"
      >
        <Ionicons name="logo-linkedin" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
