import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface MyButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'social';
  bgColor?: string;
}

export default function MyButton({ title, onPress, bgColor = 'bg-blue-700' }: MyButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`w-full ${bgColor} py-4 rounded-full items-center shadow-md active:opacity-90 mb-4`}
    >
      <Text className="text-white font-bold text-base tracking-wider">{title}</Text>
    </TouchableOpacity>
  );
}