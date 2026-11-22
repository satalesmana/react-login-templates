import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface SocialButtonProps {
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}

export function SocialButton({ iconName, color }: SocialButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="bg-gray-100 rounded-lg py-3 flex-1 items-center justify-center mx-1"
    >
      <FontAwesome name={iconName} size={20} color={color} />
    </TouchableOpacity>
  );
}
