import {StyledButton} from '@/components';
import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect, SvgProps} from 'react-native-svg';

const SvgComponent = (
  props: SvgProps & {loading?: boolean; loadingColor?: string},
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
      <G clipPath="url(#a)">
        <Path
          fill="#3B5999"
          d="M30.98 12.963h-3.457v.01c-.76.036-1.495.183-2.19.511a4.507 4.507 0 0 0-2.15 2.104 5.903 5.903 0 0 0-.537 1.685 8 8 0 0 0-.107 1.163c-.002.074.004.148.004.222v3.061c0 .047-.01.06-.055.06l-3.449-.003c-.043 0-.056.01-.056.057v4.17c0 .045.014.055.054.055l3.421-.001c.085 0 .085 0 .085.085v10.823c0 .073 0 .073.072.073h4.116c.072 0 .065.013.065-.07V26.135c0-.078 0-.078.077-.078h3.412c.05 0 .063-.015.068-.065.04-.336.083-.671.125-1.007l.124-1.006a3086.933 3086.933 0 0 0 .25-2.014l.02-.152c.004-.027-.004-.04-.032-.036-.012.002-.024 0-.037 0h-3.945c-.069 0-.061.01-.061-.063-.001-.923-.004-1.846-.001-2.768 0-.332.032-.66.144-.975.14-.399.404-.672.782-.827.276-.112.565-.164.86-.172.79-.022 1.582-.005 2.373-.01.021 0 .042 0 .065-.002v-3.823c0-.045-.003-.09 0-.135 0-.033-.008-.039-.04-.039Z"
        />
      </G>
    )}
    <Defs>
      <ClipPath id="a">
        <Path fill="currentColor" d="M18.981 12.963h12.037v24.074H18.981z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
