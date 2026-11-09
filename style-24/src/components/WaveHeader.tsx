import { useWindowDimensions } from "react-native";
import Svg, { Path, Rect, Ellipse } from "react-native-svg";
import { colors } from "@/theme";

type Props = { height: number };

const LINE = {
  stroke: "#FFFFFF",
  strokeOpacity: 0.22,
  strokeWidth: 1.5,
  fill: "none",
};

export default function WaveHeader({ height: h }: Props) {
  const { width: w } = useWindowDimensions();

  const wave =
    `M0 ${h * 0.85} ` +
    `C ${w * 0.3} ${h * 0.55}, ${w * 0.55} ${h * 1.05}, ${w} ${h * 0.72} ` +
    `L ${w} ${h} L 0 ${h} Z`;

  return (
    <Svg
      width={w}
      height={h}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Rect x={0} y={0} width={w} height={h} fill={colors.primary} />

      {[28, 52, 76, 100, 124].map((r) => (
        <Ellipse
          key={`a${r}`}
          cx={w * 0.28}
          cy={h * 0.32}
          rx={r * 1.4}
          ry={r}
          rotation={-25}
          origin={`${w * 0.28}, ${h * 0.32}`}
          {...LINE}
        />
      ))}

      {[20, 40, 60, 80].map((r) => (
        <Ellipse
          key={`b${r}`}
          cx={w * 0.85}
          cy={h * 0.55}
          rx={r * 1.2}
          ry={r}
          rotation={30}
          origin={`${w * 0.85}, ${h * 0.55}`}
          {...LINE}
        />
      ))}

      {[18, 36].map((r) => (
        <Ellipse
          key={`c${r}`}
          cx={w * 0.12}
          cy={h * 0.7}
          rx={r * 1.3}
          ry={r}
          {...LINE}
        />
      ))}

      <Path d={wave} fill={colors.background} />
    </Svg>
  );
}