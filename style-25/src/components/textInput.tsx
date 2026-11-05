import { useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface MyTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export default function MyTextInput({ containerStyle, style, ...props }: MyTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View 
      style={[
        styles.container, 
        isFocused ? styles.containerFocused : styles.containerUnfocused,
        containerStyle
      ]}
    >
      <TextInput
        {...props}
        placeholderTextColor="#626262"
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        style={[styles.input, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#F1F4FF',
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginBottom: 15,
  },
  containerUnfocused: {
    borderColor: '#F1F4FF',
  },
  containerFocused: {
    borderColor: '#1F41BB',
    backgroundColor: '#FFFFFF',
  },
  input: {
    fontSize: 16,
    color: '#0A0A0A',
    height: '100%',
  },
});


