import { Text, TextInput, View } from "react-native";

type MyInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  className?: string;
};

export default function MyInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error = "",
  className = "",
}: MyInputProps) {
  return (
    <View className={`w-full ${className}`}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        className={`h-[55px] w-full rounded-[5px] border px-4 text-base ${
          error
            ? "border-[#E57373] text-[#E57373]"
            : "border-[#9CA3AF] text-black"
        }`}
      />
      {error !== "" && (
        <Text className="mt-1 text-[12px] text-[#E57373]">{error}</Text>
      )}
    </View>
  );
}
