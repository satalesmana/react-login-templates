import { Pressable, Text } from "react-native";

type CustomButtonProps = {
    title: string,
    onPress: () => void
}

export default function CustomButton({title, onPress}: CustomButtonProps) {
    return (
      <Pressable className="bg-[#0152FE] w-full h-[62px] flex items-center justify-center px-[15px] py-[10px] rounded-md" onPress={onPress}>
        <Text className="color-white font-bold text-[16px]">
          {title}
        </Text>
      </Pressable>
    );
}
