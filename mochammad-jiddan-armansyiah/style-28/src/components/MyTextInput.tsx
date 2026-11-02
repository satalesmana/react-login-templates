import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export interface MyTextInputProps extends TextInputProps {
  /** Label text displayed above the input field */
  label?: string;
  /** Optional error message displayed below the input */
  error?: string;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Input style */
  inputStyle?: StyleProp<TextStyle>;
  /** Label style */
  labelStyle?: StyleProp<TextStyle>;
  /** Optional NativeWind className */
  className?: string;
}

export default function MyTextInput({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  className,
  secureTextEntry,
  style,
  ...rest
}: MyTextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = Boolean(secureTextEntry);
  const showText = isPassword ? !isPasswordVisible : true;

  return (
    <View className={className} style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

      <View style={[styles.inputWrapper, !!error && styles.inputWrapperError]}>
        <TextInput
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !isPasswordVisible}
          style={[styles.input, inputStyle, style]}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome
              name={isPasswordVisible ? "eye" : "eye-slash"}
              size={18}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    width: "100%",
    height: 50,
    backgroundColor: "#F7F5EA",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputWrapperError: {
    borderWidth: 1.5,
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  eyeIcon: {
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
});
