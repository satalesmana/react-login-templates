import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`bg-primary rounded-lg py-4 items-center justify-center mt-2 flex-row ${
        isDisabled ? 'opacity-60' : ''
      }`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading && (
        <View className="mr-2">
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}
      <Text className="text-white font-bold text-sm">{title}</Text>
    </TouchableOpacity>
  );
}
