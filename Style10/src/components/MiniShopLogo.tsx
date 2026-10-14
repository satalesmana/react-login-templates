import { StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

export default function MiniShopLogo({ size = 52 }: { size?: number }) {
  return (
    <Text style={[styles.logo, { fontSize: size, lineHeight: size * 1.2 }]}>
      Mini <Text style={styles.accent}>Shop</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontFamily: Fonts.logo,
    color: Colors.text,
    textAlign: 'center',
  },
  accent: { color: Colors.primary },
});
