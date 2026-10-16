import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

type Props = {
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  value: string;
  onChangeText: (t: string) => void;
};

// Kolom input gaya referensi: abu muda, rounded, ikon outline di kanan
export default function InputField({
  placeholder,
  icon,
  secure = false,
  keyboardType = 'default',
  value,
  onChangeText,
}: Props) {
  return (
    <View className="flex-row items-center bg-[#f5f5f5] rounded-2xl px-4 py-4 mb-4">
      <TextInput
        className="flex-1 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#575c63"
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
      />
      <Ionicons name={icon} size={22} color="#ababc2" style={{ marginLeft: 8 }} />
    </View>
  );
}
