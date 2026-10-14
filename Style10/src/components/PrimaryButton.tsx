import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

type Props = { title: string; onPress: () => void; style?: ViewStyle };

export default function PrimaryButton({ title, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }, style]}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontFamily: Fonts.medium, fontSize: 18, color: Colors.text },
});
