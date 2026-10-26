import React, { useRef, useState, useEffect } from 'react';
import { Animated, Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

    // 1 = label di atas (border), 0 = label di tengah (seperti placeholder)
    const floated = isFocused || value.length > 0;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: floated ? 1 : 0,
            duration: 150,
            useNativeDriver: false, // false karena animasi fontSize
        }).start();
    }, [floated]);

    const labelTop = anim.interpolate({ inputRange: [0, 1], outputRange: [16, -9] });
    const labelFontSize = anim.interpolate({ inputRange: [0, 1], outputRange: [14, 12] });
    const labelColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#9CA3AF', isFocused ? '#3B82F6' : '#6B7280'],
    });

    return (
        <View className="w-full mb-4">
            <View
                className={`w-full flex-row items-center bg-white border rounded-xl px-4 ${isFocused ? 'border-blue-500' : 'border-gray-200'
                    }`}
            >
                {/* Label mengambang */}
                <Animated.Text
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        left: floated ? 12 : 16,
                        top: labelTop,
                        fontSize: labelFontSize,
                        color: labelColor,
                        backgroundColor: 'white', // menutupi garis border
                        paddingHorizontal: 4,
                    }}
                >
                    {label}
                </Animated.Text>

                <TextInput
                    className="flex-1 py-3.5 text-gray-800 text-sm"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureTextEntry && hidePassword}
                    autoCapitalize="none"
                />

                {/* Ikon mata khusus password */}
                {secureTextEntry && (
                    <Pressable onPress={() => setHidePassword((p) => !p)} hitSlop={10}>
                        <Ionicons
                            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#9CA3AF"
                        />
                    </Pressable>
                )}
            </View>
        </View>
    );
};