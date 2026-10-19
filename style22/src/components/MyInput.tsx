import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface MyInputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const MyInput: React.FC<MyInputProps> = ({
  label,
  icon,
  isPassword = false,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]} className="mb-4 w-full">
      {label ? (
        <Text style={[styles.label, labelStyle]} className="text-slate-700 text-sm font-semibold mb-1.5">
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
        className={`flex-row items-center bg-slate-50 border rounded-2xl px-4 py-3 ${
          error
            ? "border-rose-500"
            : isFocused
            ? "border-[#3B7A7A] bg-white"
            : "border-slate-200"
        }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? "#3B7A7A" : "#94A3B8"}
            style={styles.icon}
          />
        )}

        <TextInput
          style={[styles.input, inputStyle, style]}
          className="flex-1 text-slate-800 text-base"
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText} className="text-rose-500 text-xs mt-1 font-medium">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    color: "#1C2B33",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputFocused: {
    borderColor: "#3B7A7A",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#F43F5E",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#0F172A",
    fontSize: 15,
  },
  errorText: {
    color: "#F43F5E",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
