import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

export function BackgroundImage({ source }: { source: ImageSourcePropType }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image source={source} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
});
