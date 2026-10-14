import { Pressable, Text } from "react-native";

type MyButtonProps = {
  title: string;
  onPress: () => void;
  className?: string;
};

export default function MyButton({ title, onPress, className }: MyButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-[60px] w-full items-center justify-center rounded-[5px] bg-[#0B6EFE] active:opacity-80 ${className}`}
    >
      <Text className="text-lg font-bold text-white">{title}</Text>
    </Pressable>
  );
}
