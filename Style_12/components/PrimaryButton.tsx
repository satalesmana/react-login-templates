import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

export default function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-[#f43f5e] rounded-2xl py-4 items-center mt-2"
    >
      <View className="flex-row items-center">
        <Text className="text-white text-lg font-bold">{label}</Text>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}
