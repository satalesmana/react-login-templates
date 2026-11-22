import { View, Text } from 'react-native';

interface LogoProps {
  size?: 'large' | 'medium' | 'small';
  variant?: 'solid' | 'outline';
}

export function Logo({ size = 'medium', variant = 'solid' }: LogoProps) {
  const sizeClasses = {
    large: 'w-24 h-24 rounded-3xl',
    medium: 'w-16 h-16 rounded-2xl',
    small: 'w-8 h-8 rounded-lg',
  };

  const textClasses = {
    large: 'text-6xl',
    medium: 'text-4xl',
    small: 'text-xl',
  };

  const borderClass = variant === 'outline' ? 'border-2 border-primary bg-white' : 'bg-white';

  return (
    <View className={`${sizeClasses[size]} ${borderClass} items-center justify-center`}>
      <Text className={`text-primary font-bold ${textClasses[size]}`}>H</Text>
    </View>
  );
}
