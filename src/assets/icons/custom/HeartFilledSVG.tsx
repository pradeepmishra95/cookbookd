import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
const SvgComponent = (
  props: SvgProps & {heart_color: string; heart_stroke?: string},
) => (
  <Svg width={16} height={14} fill="none" viewBox="0 0 16 14" {...props}>
    <Path
      fill={props.heart_color}
      stroke={props.heart_stroke ?? 'currentColor'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M8 13.188S.969 9.25.969 4.467A3.656 3.656 0 0 1 8 3.064a3.656 3.656 0 0 1 7.031 1.406C15.031 9.25 8 13.187 8 13.187Z"
    />
  </Svg>
);
export default SvgComponent;
