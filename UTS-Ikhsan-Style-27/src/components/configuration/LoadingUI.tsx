import { View, Text, ActivityIndicator, Modal } from 'react-native';

interface LoadingUIProps {
  visible?: boolean;
  message?: string;
  fullScreen?: boolean;
}

export function LoadingUI({
  visible = true,
  message = 'Memproses...',
  fullScreen = false,
}: LoadingUIProps) {
  if (!visible) return null;

  if (fullScreen) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <View className="bg-white p-6 rounded-2xl items-center justify-center">
          <ActivityIndicator size="large" color="#0eb353" />
          <Text className="text-gray-600 font-medium text-sm mt-3">{message}</Text>
        </View>
      </View>
    );
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
      >
        <View className="bg-white px-8 py-6 rounded-2xl items-center justify-center shadow-lg min-w-[180px]">
          <ActivityIndicator size="large" color="#0eb353" />
          <Text className="text-gray-700 font-semibold text-sm mt-3 text-center">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
