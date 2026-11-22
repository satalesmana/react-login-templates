import { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface FormInputProps extends TextInputProps {
  label?: string;
  suffix?: string;
  prefix?: React.ReactNode;
  isPassword?: boolean;
}

export function FormInput({
  label,
  suffix,
  prefix,
  isPassword,
  secureTextEntry,
  value,
  onFocus,
  onBlur,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = Boolean(value && String(value).trim().length > 0);

  return (
    <View className="mb-4">
      {label ? <Text className="text-gray-500 text-xs mb-1 ml-1 font-medium">{label}</Text> : null}
      <View
        className={`bg-gray-50 border rounded-xl px-4 py-3 flex-row items-center justify-between ${
          isFocused
            ? 'border-primary bg-white'
            : hasValue
              ? 'border-gray-600 bg-white'
              : 'border-gray-200'
        }`}
      >
        {prefix ? <View className="flex-row items-center mr-2">{prefix}</View> : null}
        <TextInput
          className="flex-1 text-black p-0 m-0 text-sm"
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {suffix ? (
          <Text
            className={`font-semibold ml-2 select-none text-sm ${
              hasValue || isFocused ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            {suffix}
          </Text>
        ) : null}
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-1 -mr-1 ml-2"
            activeOpacity={0.7}
          >
            <FontAwesome
              name={showPassword ? 'eye' : 'eye-slash'}
              size={18}
              color={hasValue || isFocused ? '#4b5563' : '#9ca3af'}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
