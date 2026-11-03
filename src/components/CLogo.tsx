import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

interface CLogoProps {
  size?: number;
  variant?: "orange" | "navy";
  style?: StyleProp<ImageStyle>;
  className?: string;
}

/**
 * CLogo component rendering the exact user-uploaded PNG logos:
 * - 'orange': Gambar 2 (Orange C with white stroke & drop shadow) for Tampilan Awal (Splash / Welcome)
 * - 'navy': Gambar 1 (Dark Navy C with white stroke & drop shadow) for Login, Register, & Main
 */
export default function CLogo({
  size = 80,
  variant = "navy",
  style,
  className = "",
}: CLogoProps) {
  const source =
    variant === "orange"
      ? require("../../assets/images/logo-orange.png")
      : require("../../assets/images/logo-navy.png");

  return (
    <Image
      source={source}
      style={[{ width: size, height: size }, style]}
      className={className}
      resizeMode="contain"
    />
  );
}
