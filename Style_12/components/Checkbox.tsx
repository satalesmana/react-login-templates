import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Checkbox custom biar bisa di-style (bawaannya RN jelek wkwk)
export default function Checkbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      className="flex-row items-center"
    >
      <View
        className={`w-5 h-5 rounded-md border-2 items-center justify-center ${
          checked ? 'bg-[#f43f5e] border-[#f43f5e]' : 'border-gray-300'
        }`}
      >
        {checked && <Text className="text-white text-xs font-bold">✓</Text>}
      </View>
      <View className="ml-2 flex-1">
        {typeof label === 'string' ? (
          <Text className="text-sm text-gray-500">{label}</Text>
        ) : (
          label
        )}
      </View>
    </TouchableOpacity>
  );
}
