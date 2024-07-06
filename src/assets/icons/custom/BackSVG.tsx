import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
const SvgComponent = (props: SvgProps) => (
  <Svg width={9} height={18} fill="none" {...props}>
    <Path
      fill="currentColor"
      d="M8.217 18a.78.78 0 0 1-.555-.228l-6.83-6.77a2.827 2.827 0 0 1 0-4.007l6.83-6.77a.795.795 0 0 1 1.11 0c.304.302.304.8 0 1.101l-6.829 6.77a1.27 1.27 0 0 0 0 1.806l6.83 6.77c.303.3.303.799 0 1.1a.827.827 0 0 1-.556.228Z"
    />
  </Svg>
);
export default SvgComponent;
