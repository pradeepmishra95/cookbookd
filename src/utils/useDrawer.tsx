import CloseSVG from '@/assets/icons/close.svg';
import {StyledText, StyledView} from '@/components';
import useThemeStore from '@/store/useTheme';
import {Portal} from '@gorhom/portal';
import {useTheme} from '@rneui/themed';
import React, {useCallback} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const DRAWER_WIDTH = 330;

type BadgeProps = {
  selected?: boolean;
  name: string;
};
export const DrawerBadge = ({
  selected = false,
  name,
  ...props
}: BadgeProps & TouchableOpacityProps) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      className="justify-center items-center inline-flex px-3"
      style={{
        height: 36,
        borderColor: selected
          ? theme.colors.primary
          : theme.colors.dividerColor,
        borderRadius: 40,
        borderWidth: 0.5,
      }}
      {...props}>
      <StyledText className="inline">{name}</StyledText>
    </TouchableOpacity>
  );
};
const useDrawer = (
  title: string,
  component: React.ReactNode,
  dependency: React.DependencyList = [],
) => {
  const {theme} = useTheme();
  const themeMode = useThemeStore(state => state.theme);
  const animation = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const animatedTranslation = useAnimatedStyle(() => {
    const translateX = interpolate(animation.value, [0, 1], [500, 0]);
    return {
      transform: [{translateX}],
    };
  });

  const animatedBg = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animation.value,
      [0, 1],
      ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'],
    );

    return {
      backgroundColor,
      display: animation.value === 0 ? 'none' : 'flex',
    };
  });

  const toggleDrawer = () => {
    animation.value =
      animation.value === 0
        ? withTiming(1, {
            duration: 300,
          })
        : withTiming(0, {duration: 300});
  };
  const Drawer = useCallback(() => {
    return (
      <Portal name="drawer">
        <AnimatedTouchableOpacity
          onPress={toggleDrawer}
          className="absolute top-0 left-0 w-full h-full"
          style={[animatedBg]}
          activeOpacity={1}
        />

        <StyledView
          className="opacity-100 absolute top-0 right-0 h-full"
          style={[
            {
              opacity: 1,
              backgroundColor:
                themeMode === 'dark'
                  ? theme.colors.searchBg
                  : theme.colors.background,
              width: DRAWER_WIDTH,
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              paddingTop: insets.top,
            },
            animatedTranslation,
          ]}>
          <StyledView className="flex-row justify-between items-center mb-5 px-5">
            <StyledText h1>{title}</StyledText>
            <TouchableOpacity onPress={toggleDrawer} activeOpacity={1}>
              <CloseSVG color={theme.colors.black} />
            </TouchableOpacity>
          </StyledView>
          {component}
        </StyledView>
      </Portal>
    );
  }, dependency);
  return {Drawer, toggleDrawer};
};

export default useDrawer;
