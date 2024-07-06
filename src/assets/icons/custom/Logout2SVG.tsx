import * as React from 'react';
import Svg, {Circle, Ellipse, Path, Rect, SvgProps} from 'react-native-svg';
const SvgComponent = (props: SvgProps) => (
  <Svg width={44} height={38} fill="none" {...props}>
    <Ellipse
      cx={20.989}
      cy={36.071}
      fill="currentColor"
      fillOpacity={0.1}
      rx={19.989}
      ry={1.071}
    />
    <Path
      fill="#EA2D29"
      d="M27.25 2.5h-12.5A3.75 3.75 0 0 0 11 6.25V9a1.25 1.25 0 0 0 2.5 0V6.25A1.25 1.25 0 0 1 14.75 5h12.5a1.25 1.25 0 0 1 1.25 1.25v17.5A1.25 1.25 0 0 1 27.25 25h-12.5a1.25 1.25 0 0 1-1.25-1.25V20a1.25 1.25 0 0 0-2.5 0v3.75a3.75 3.75 0 0 0 3.75 3.75h12.5A3.75 3.75 0 0 0 31 23.75V6.25a3.75 3.75 0 0 0-3.75-3.75Z"
    />
    <Rect
      width={15}
      height={2}
      x={8.5}
      y={13.5}
      fill="#FFB500"
      stroke="#FFB500"
      rx={1}
    />
    <Path
      stroke="#FFB500"
      strokeLinecap="round"
      strokeWidth={3}
      d="m19.03 9 4.352 4.623a1 1 0 0 1 .074 1.282L19.673 20"
    />
    <Circle
      cx={2.235}
      cy={2.235}
      r={2.235}
      fill="#FFB500"
      transform="matrix(-1 0 0 1 43.33 14)"
    />
    <Circle
      cx={1.676}
      cy={1.676}
      r={1.676}
      fill="#6BB229"
      transform="matrix(-1 0 0 1 3.353 22.566)"
    />
  </Svg>
);
export default SvgComponent;
