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
      className={`rounded-full py-4 items-center justify-center mt-2 flex-row ${
        disabled && !loading ? 'bg-gray-200' : 'bg-primary'
      } ${loading ? 'opacity-80' : ''}`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading && (
        <View className="mr-2">
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}
      <Text
        className={`font-bold text-sm ${
          disabled && !loading ? 'text-gray-500' : 'text-white'
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
