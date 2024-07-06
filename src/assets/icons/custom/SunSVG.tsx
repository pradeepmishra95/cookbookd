import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, SvgProps} from 'react-native-svg';
const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      clipPath="url(#a)">
      <Path d="M12 17.625a5.625 5.625 0 1 0 0-11.25 5.625 5.625 0 0 0 0 11.25ZM12 3.375v-.75M5.897 5.897l-.525-.525M3.375 12h-.75M5.897 18.104l-.525.524M12 20.625v.75M18.104 18.104l.524.524M20.625 12h.75M18.104 5.897l.524-.525" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="currentColor" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
