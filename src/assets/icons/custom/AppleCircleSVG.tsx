import {StyledButton} from '@/components';
import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect, SvgProps} from 'react-native-svg';
const SvgComponent = (
  props: SvgProps & {light?: boolean; loading?: boolean; loadingColor?: string},
) => (
  <Svg width={50} height={50} fill="none" {...props}>
    <Rect
      width={49}
      height={49}
      x={0.5}
      y={0.5}
      fill="currentColor"
      stroke="#BDC2C8"
      rx={24.5}
    />
    {props.loading ? (
      <StyledButton
        loading
        loadingProps={{size: 25, color: props.loadingColor}}
        twButton="bg-transparent"
      />
    ) : (
      <G fill={props.light ? '#fff' : '#1B1B1B'} clipPath="url(#a)">
        <Path d="M12.963 26.198V24.19c.106-.03.068-.112.076-.18a8.087 8.087 0 0 1 1.27-3.747c1.696-2.628 5.384-3.994 8.252-2.351 1.125.642 2.304.597 3.445-.008 1.384-.731 2.829-.955 4.373-.634 1.407.29 2.707.746 3.643 1.903.502.62.517.598-.076 1.12-.578.515-1.263.933-1.643 1.627-.928 1.65-1.027 3.397-.335 5.129.57 1.426 1.582 2.508 3.027 3.165.152.067.22.112.16.314-.746 2.276-2.092 4.195-3.704 5.95-1.171 1.276-3.384 1.097-4.403.53-1.613-.904-3.263-.86-4.913-.016-1.384.702-3.103.8-4.358-.522-2.41-2.546-4.008-5.494-4.609-8.943-.06-.44-.038-.904-.205-1.33ZM29.474 10.648c.19.426.129.881.053 1.306-.418 2.218-1.628 3.845-3.803 4.696-.433.172-.897.232-1.361.254-.274.007-.342-.09-.342-.336-.008-2.098.966-3.688 2.662-4.875.737-.522 1.566-.88 2.494-.978.03 0 .053-.044.076-.06.069-.007.145-.007.22-.007Z" />
      </G>
    )}
    <Defs>
      <ClipPath id="a">
        <Path fill="currentColor" d="M12.963 10.648h22.222V37.5H12.963z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
