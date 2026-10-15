import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useWindowDimensions, View } from "react-native";

interface AuthIllustrationProps {
  height?: number;
  characterColor?: string;
}

export function AuthIllustration({
  height = 176,
  characterColor = "#6958f5",
}: AuthIllustrationProps) {
  return (
    <View className="w-full items-center justify-center">
      <Svg
        width="100%"
        height={height}
        viewBox="0 0 320 205"
        preserveAspectRatio="xMidYMid meet"
      >
        <Circle cx="50" cy="143" r="34" fill="#f1f1f1" />
        <Circle cx="270" cy="155" r="27" fill="#f1f1f1" />
        <Path d="M24 113c24 18 37 34 43 57M296 139c-14 9-23 18-30 31" stroke="#fff" strokeWidth="2" />
        <Path
          d="M91 181V77a69 69 0 0 1 138 0v104z"
          fill="#d0d0d0"
        />
        <Rect x="117" y="74" width="67" height="107" rx="3" fill="#fff" />
        <Path d="M139 74v107m23-107v107M117 109h67m-67 36h67" stroke="#e4e4e4" strokeWidth="1.5" />
        <Path d="M59 183h203" stroke="#aaa" strokeWidth="2" />

        <Circle cx="226" cy="86" r="9" fill="#f0b29f" />
        <Path d="M218 84c1-10 15-12 19-3l-2 7c-2-5-7-7-12-5l-1 6z" fill="#282536" />
        <Path d="M217 99c5-5 15-5 20 1l5 31-28 1 1-23z" fill={characterColor} />
        <Path d="m218 105-10 22" stroke="#f0b29f" strokeWidth="6" strokeLinecap="round" />
        <Path d="m236 106 5 22" stroke="#f0b29f" strokeWidth="6" strokeLinecap="round" />
        <Path d="m220 129-2 42m14-40 2 40" stroke="#292637" strokeWidth="7" strokeLinecap="round" />
        <Path d="m218 171-7 1m25 0 7 1" stroke="#292637" strokeWidth="5" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export function AuthWave() {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width,
        pointerEvents: "none",
      }}
      className="absolute bottom-0 left-0 right-0"
    >
      <Svg width={width} height={130} viewBox="0 0 330 130" preserveAspectRatio="none">
        <Path
          d="M0 88c32-43 50-42 82-22 27 17 34 3 57-5 34-12 52 5 75 20 27 18 47 3 67-24 17-23 27-39 49-57v130H0z"
          fill="#b6e2fb"
        />
      </Svg>
    </View>
  );
}
