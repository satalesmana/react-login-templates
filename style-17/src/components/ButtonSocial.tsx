import { Image, ImageSourcePropType, Pressable } from "react-native";

type ButtonSocialProps = {
  icon: ImageSourcePropType;
  onPress: () => void;
  className?: string;
};

export default function ButtonSocial({
  icon,
  onPress,
  className = "",
}: ButtonSocialProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-[50px] w-[50px] items-center justify-center rounded-full border border-[#E9A8EC] bg-[#EDEBEE] active:opacity-70 ${className}`}
    >
      <Image source={icon} className="h-[24px] w-[24px]" resizeMode="contain" />
    </Pressable>
  );
}
