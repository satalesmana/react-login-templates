import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'danger';
    icon?: React.ReactNode;
}

const containerStyles = {
    primary: 'bg-blue-600 active:bg-blue-700',
    outline: 'bg-white border border-gray-200 active:bg-gray-50',
    danger: 'bg-red-600 active:bg-red-700',
};

const textStyles = {
    primary: 'text-white',
    outline: 'text-gray-700',
    danger: 'text-white',
};

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    icon,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-full py-4 rounded-xl flex-row items-center justify-center ${containerStyles[variant]}`}
        >
            <Text className={`font-semibold text-base ${textStyles[variant]}`}>
                {title}
            </Text>
            {icon && <View className="ml-2">{icon}</View>}
        </TouchableOpacity>
    );
};