import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

export default function InputField(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={Colors.muted}
      autoCapitalize="none"
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
});
