import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';

type Props = { height?: number };

// Dua lingkaran besar; lengkung bawahnya sengaja dibiarkan terlihat seperti di desain.
export default function BackgroundCircles({ height = 220 }: Props) {
  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <View style={[styles.circle, styles.big]} />
      <View style={[styles.circle, styles.small]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  circle: { position: 'absolute', borderRadius: 999 },
  // Lingkaran terang besar: dasar lengkungnya di sekitar y = 196
  big: {
    width: 810,
    height: 810,
    top: -614,
    left: -166,
    backgroundColor: Colors.circleLight,
  },
  // Lingkaran lebih gelap di kanan: dasar lengkungnya di sekitar y = 156
  small: {
    width: 240,
    height: 240,
    top: -84,
    right: -51,
    backgroundColor: Colors.circleDark,
  },
});