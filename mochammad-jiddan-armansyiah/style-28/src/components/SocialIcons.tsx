import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export interface SocialIconsProps {
  /** Optional click handler for Facebook */
  onPressFacebook?: () => void;
  /** Optional click handler for Google */
  onPressGoogle?: () => void;
  /** Optional click handler for LinkedIn */
  onPressLinkedIn?: () => void;
  /** Optional title above the icons (defaults to "Or via social media") */
  label?: string;
  /** Whether to show the label text (default: true) */
  showLabel?: boolean;
  /** Custom container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Custom label style */
  labelStyle?: StyleProp<TextStyle>;
  /** Icon color (default: '#102C57') */
  iconColor?: string;
  /** Circle button background color (default: '#DEC39A') */
  buttonColor?: string;
  /** Circle diameter (default: 38) */
  size?: number;
  /** Optional className for NativeWind / Tailwind CSS */
  className?: string;
}

export default function SocialIcons({
  onPressFacebook,
  onPressGoogle,
  onPressLinkedIn,
  label = "Or  via social media",
  showLabel = true,
  containerStyle,
  labelStyle,
  iconColor = "#102C57",
  buttonColor = "#DEC39A",
  size = 38,
  className,
}: SocialIconsProps) {
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: buttonColor,
  };

  const iconSize = Math.round(size * 0.46);

  return (
    <View className={className} style={[styles.wrapper, containerStyle]}>
      {showLabel && !!label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}

      <View style={styles.iconsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressFacebook}
          style={[styles.socialButton, circleStyle]}
          accessibilityLabel="Login with Facebook"
          accessibilityRole="button"
        >
          <FontAwesome name="facebook" size={iconSize} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressGoogle}
          style={[styles.socialButton, circleStyle]}
          accessibilityLabel="Login with Google"
          accessibilityRole="button"
        >
          <FontAwesome name="google" size={iconSize} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressLinkedIn}
          style={[styles.socialButton, circleStyle]}
          accessibilityLabel="Login with LinkedIn"
          accessibilityRole="button"
        >
          <FontAwesome name="linkedin" size={iconSize} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
