import {StyledText, StyledView} from '@/components';
import {useTheme} from '@rneui/themed';
import React, {useEffect, useMemo} from 'react';
import {Pressable, TouchableOpacity} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type SwitchProps = {
  size?: number;
  offKnobColor?: string;
  onKnobColor?: string;
  offKnob?: React.FC;
  onKnob?: React.FC;
  offTrackBgColor?: string;
  onTrackBgColor?: string;
  offText?: string;
  onText?: string;
  offTextColor?: string;
  onTextColor?: string;
  status?: boolean;
  toggleStatus?: () => void;
};

const Defaults = {
  ON_KNOB_COLOR: '#000',
  ON_TRACK_BG_COLOR: '#FFF',
  OFF_KNOB_COLOR: '#FFF',
  OFF_TRACK_BG_COLOR: '#EEEFF0',
  SIZE: 28,
  ANIMATION_DURATION: 400,
};

export const Switch = ({size, toggleStatus, ...props}: SwitchProps) => {
  const {theme} = useTheme();
  const trackWidth = useMemo(() => {
    return (size ?? Defaults.SIZE) * 1.9;
  }, [size]);

  const trackHeight = useMemo(() => {
    return (size ?? Defaults.SIZE) * 1.1;
  }, [size]);

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const animation = useSharedValue(0);

  const animatedTranslation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: animation.value}],
    };
  });

  const animatedKnobColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animation.value,
      [0, (size ?? Defaults.SIZE) * 0.4],
      [
        props.offKnobColor ?? Defaults.OFF_KNOB_COLOR,
        props.onKnobColor ?? Defaults.ON_KNOB_COLOR,
      ],
    );

    return {
      backgroundColor,
    };
  });

  const animatedTrack = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animation.value,
      [0, (size ?? Defaults.SIZE) * 0.4],
      [
        props.offTrackBgColor ?? Defaults.OFF_TRACK_BG_COLOR,
        props.onTrackBgColor ?? Defaults.ON_TRACK_BG_COLOR,
      ],
    );
    return {
      backgroundColor,
    };
  });

  const animatedOffOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      animation.value,
      [0, (size ?? Defaults.SIZE) * 0.4],
      [1, 0],
    );
    return {
      opacity,
    };
  });

  const animatedOnOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      animation.value,
      [0, (size ?? Defaults.SIZE) * 0.4],
      [0, 1],
    );

    return {
      opacity,
    };
  });

  useEffect(() => {
    animation.value = props.status
      ? withTiming(trackWidth * 0.4, {
          duration: Defaults.ANIMATION_DURATION,
        })
      : withTiming(0, {duration: Defaults.ANIMATION_DURATION});
  }, [props.status]);
  return (
    <Pressable className="flex-row items-center gap-x-2">
      <StyledView tw="relative flex-row">
        {/* CHEAT: Used in order to determine the width & height of the View */}
        <StyledText h5 tw="opacity-0">
          {props.offText}
        </StyledText>
        <StyledText h5 tw="opacity-0">
          {props.onText}
        </StyledText>

        <Animated.View
          style={[
            animatedOffOpacity,
            {position: 'absolute', width: '100%', alignItems: 'flex-end'},
          ]}>
          <StyledText
            h5
            style={{color: props.offTextColor ?? theme.colors.black}}>
            {props.offText}
          </StyledText>
        </Animated.View>
        <Animated.View
          style={[
            animatedOnOpacity,
            {position: 'absolute', width: '100%', alignItems: 'flex-end'},
          ]}>
          <StyledText
            h5
            style={{color: props.onTextColor ?? theme.colors.black}}>
            {props.onText}
          </StyledText>
        </Animated.View>
      </StyledView>

      <StyledView className=" justify-center items-center">
        <AnimatedTouchable
          className="flex-row items-center p-1"
          activeOpacity={1}
          style={[
            {
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackHeight / 2,
              borderWidth: 1,
              borderColor: theme.colors.greyOutline,
            },
            animatedTrack,
          ]}
          onPress={() => {
            if (typeof toggleStatus === 'undefined') {
              animation.value =
                animation.value === 0
                  ? withTiming(trackWidth * 0.4, {
                      duration: Defaults.ANIMATION_DURATION,
                    })
                  : withTiming(0, {duration: Defaults.ANIMATION_DURATION});
            } else {
              toggleStatus();
            }
          }}>
          <StyledView
            style={[
              {
                borderRadius: 100,
                width: (size ?? Defaults.SIZE) * 0.8,
                height: (size ?? Defaults.SIZE) * 0.8,
              },
              animatedTranslation,
              animatedKnobColor,
            ]}>
            <StyledView tw="relative flex-1 w-full h-full">
              <StyledView
                tw="absolute top-0 left-0 w-full h-full items-center justify-center"
                style={[animatedOffOpacity]}>
                {props.offKnob && React.createElement(props.offKnob)}
              </StyledView>
              <StyledView
                tw="absolute top-0 left-0 w-full h-full items-center justify-center"
                style={[animatedOnOpacity]}>
                {props.onKnob && React.createElement(props.onKnob)}
              </StyledView>
            </StyledView>
            {/* <StyledView tw="opacity-0">{props.onKnob}</StyledView> */}
          </StyledView>
        </AnimatedTouchable>
      </StyledView>
    </Pressable>
  );
};
