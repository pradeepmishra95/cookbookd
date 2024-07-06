import ForkKnifeSVG from '@/assets/icons/fork_knife.svg';
import GallerySVG from '@/assets/icons/gallery.svg';
import LiveSVG from '@/assets/icons/live.svg';
import {StyledText, StyledView} from '@/components';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@rneui/themed';
import {useMemo} from 'react';
import {TouchableOpacity, TouchableOpacityProps, ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FeatherIcon from 'react-native-vector-icons/Feather';

const ColoredActionIcon = (
  props: TouchableOpacityProps & {
    type: 'menu' | 'live' | 'post';
    parentTw?: string;
    parentStyle?: ViewProps['style'];
  },
) => {
  const {theme} = useTheme();

  const backgroundColor = useMemo(() => {
    switch (props.type) {
      case 'menu':
        return theme.colors.green;
      case 'live':
        return theme.colors.primary;
      case 'post':
        return theme.colors.yellow;
    }
  }, [props.type]);

  const Icon = useMemo(() => {
    switch (props.type) {
      case 'menu':
        return ForkKnifeSVG;
      case 'live':
        return LiveSVG;
      case 'post':
        return GallerySVG;
    }
  }, [props.type]);

  const title = useMemo(() => {
    switch (props.type) {
      case 'menu':
        return 'Menu';
      case 'live':
        return 'Live';
      case 'post':
        return 'Post';
    }
  }, [props.type]);

  return (
    <StyledView tw={props.parentTw} style={props.parentStyle}>
      <TouchableOpacity
        activeOpacity={0.8}
        {...props}
        tw={`items-center justify-center flex-1`}
        style={[
          {backgroundColor, width: 64, height: 64, borderRadius: 32},
          props.style,
        ]}>
        <Icon color={'white'} height={24} width={24} />
        <StyledText tw="text-white" h5>
          {title}
        </StyledText>
      </TouchableOpacity>
    </StyledView>
  );
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const PlusAction = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const animation = useSharedValue(0);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(animation.value, [0, 1], [0, 45]);
    return {transform: [{rotate: `${rotate}deg`}]};
  });

  const postAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animation.value, [0, 1], [0, 1]);
    return {
      opacity,
      transform: [
        {translateY: -(animation.value * 80)},
        {translateX: -(animation.value * 70)},
      ],
    };
  });

  const menuAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animation.value, [0, 1], [0, 1]);
    return {
      opacity,
      transform: [
        {translateY: -(animation.value * 80)},
        {translateX: animation.value * 70},
      ],
    };
  });

  const liveAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animation.value, [0, 1], [0, 1]);
    return {opacity, transform: [{translateY: -(animation.value * 100)}]};
  });

  const animatedProps = useAnimatedProps(() => {
    const first_color = interpolateColor(
      animation.value,
      [0, 1],
      ['#EA2D29', theme.colors.greyOutline],
      'RGB',
      {useCorrectedHSVInterpolation: true, gamma: 2.2},
    );
    const second_color = interpolateColor(
      animation.value,
      [0, 1],
      ['#FFB500', theme.colors.greyOutline],
      'RGB',
      {useCorrectedHSVInterpolation: true, gamma: 2.2},
    );
    return {colors: [first_color, second_color]};
  });

  return (
    <StyledView
      tw="flex-row flex-1 py-2 items-center justify-center"
      bg
      style={{
        borderTopColor: theme.colors.bottomTabInactive,
        borderTopWidth: 0.5,
        zIndex: 99,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        tw="bg-transparent justify-center items-center relative"
        style={{width: 50, height: 50}}
        onPress={() => {
          animation.value =
            animation.value === 0
              ? withTiming(1, {duration: 300})
              : withTiming(0, {duration: 300});
        }}>
        <ColoredActionIcon
          parentTw="absolute top-0"
          type="menu"
          parentStyle={[menuAnimatedStyle]}
          onPress={() => navigation.navigate('chef_menu_update')}
        />
        <ColoredActionIcon
          parentTw="absolute top-0"
          type="live"
          parentStyle={[liveAnimatedStyle]}
          onPress={() =>
            // navigation.navigate('live_streaming', {
            //   title: "Tacco's Receipe",
            //   descripton:
            //     'What a lovely dish I am trying to cook. I am sure you never ever have tasted like this.',
            // })
            navigation.navigate('chef_go_live')
          }
        />
        <ColoredActionIcon
          parentTw="absolute top-0"
          type="post"
          onPress={() => navigation.navigate('chef_post_update')}
          parentStyle={[postAnimatedStyle]}
        />
        <AnimatedLinearGradient
          colors={animatedProps.colors ?? []}
          animatedProps={animatedProps}
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
          }}>
          <StyledView style={[logoAnimatedStyle]}>
            <FeatherIcon name="plus" color={'white'} size={30} />
          </StyledView>
        </AnimatedLinearGradient>
      </TouchableOpacity>
    </StyledView>
  );
};

export default PlusAction;
export {ColoredActionIcon};
