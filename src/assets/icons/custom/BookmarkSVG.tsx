import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
const SvgComponent = (
  props: SvgProps & {mark_fill?: string; mark_stroke?: string},
) => (
  <Svg width={20} height={22} fill="none" viewBox="0 0 20 22" {...props}>
    <Path
      fill={props.mark_fill}
      stroke={props.mark_stroke ?? 'currentColor'}
      d="M2.933 21.75c-.42 0-.81-.1-1.16-.3-.77-.45-1.21-1.36-1.21-2.49V4.86c0-2.54 2.07-4.61 4.61-4.61h9.65c2.54 0 4.61 2.07 4.61 4.61v14.09c0 1.13-.44 2.04-1.21 2.49-.77.45-1.78.4-2.77-.15l-4.88-2.71c-.29-.16-.86-.16-1.15 0l-4.88 2.71c-.54.3-1.09.46-1.61.46Zm2.25-20a3.12 3.12 0 0 0-3.11 3.11v14.09c0 .59.17 1.03.47 1.2.3.18.77.12 1.28-.17l4.88-2.71c.74-.41 1.86-.41 2.6 0l4.88 2.71c.51.29.98.35 1.28.17.3-.18.47-.62.47-1.2V4.86c0-1.71-1.4-3.11-3.11-3.11h-9.64Z"
    />
  </Svg>
);
export default SvgComponent;
