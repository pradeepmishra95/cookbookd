import {StyledButton, StyledText, StyledView} from '@/components';
import OAuthButtonGroup from '@/components/OAuthButtonGroup';
import onboardingScreens, {
  ANIMATION_DURATION,
  PILL_HEIGHT,
  PILL_WIDTH,
} from '@/constants/onboarding';
import React, {useEffect, useMemo} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';

type OnboardingProps = NativeStackScreenProps<RootStackParamList, 'onboarding'>;

const Onboarding = ({navigation}: OnboardingProps) => {
  const {width, height} = Dimensions.get('screen');
  const pages = useMemo(() => onboardingScreens, []);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  let number = 0;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence(
        [...Array(4).keys()].map((_, i) => {
          let tempNum = number + width;
          if (i >= 2) {
            tempNum = (4 - (i + 1)) * width;
          }
          number = tempNum;
          return Animated.timing(scrollX, {
            toValue: tempNum,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          });
        }),
      ),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <StyledView tw="flex-1 p-4 justify-end items-center">
      {Platform.OS === 'ios' && <StatusBar barStyle={'light-content'} />}
      {/* Background Image and Text with gradient */}
      {pages.map((page, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0, 1, 0],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: 'white',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
            key={`page-${index}`}>
            <ImageBackground
              className="absolute top-0 left-0"
              source={page.image}
              style={{
                height,
                width,
              }}>
              <LinearGradient
                colors={['#00000000', '#000000']}
                style={{height: '100%', width: '100%'}}></LinearGradient>
            </ImageBackground>
            <StyledView style={{top: 10}} className="bg-transparent p-4">
              <StyledText h1 className="font-bold text-center text-white">
                {page.title}
              </StyledText>
              <StyledText h4 className="text-center mt-2 text-white">
                {page.description}
              </StyledText>
            </StyledView>
          </Animated.View>
        );
      })}

      {/* Indicator */}
      <StyledView tw="flex-row mb-4 gap-3 bg-transparent justify-center items-center">
        {pages.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.5, 1],
            extrapolate: 'clamp',
          });
          const indicatorOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          const color = scrollX.interpolate({
            inputRange: [
              (index - 2) * width,
              (index - 1) * width,
              index * width,
              (index + 1) * width,
              (index + 2) * width,
            ],
            outputRange: [
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 181, 0, 1)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
            ],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`indicator-${index}`}
              style={{
                height: PILL_HEIGHT,
                width: PILL_WIDTH,
                borderRadius: 5,
                backgroundColor: color,
                opacity: indicatorOpacity,
                transform: [{scale}],
              }}
            />
          );
        })}
      </StyledView>

      {/*  */}
      <StyledButton
        onPress={() => navigation.navigate('login')}
        twContainer="w-full my-2">
        Login
      </StyledButton>
      <StyledButton
        twContainer="w-full my-2"
        twTitle="text-white"
        onPress={() => navigation.navigate('create_account')}
        buttonStyle={{borderColor: 'white'}}
        type="outline">
        New User? Create Account
      </StyledButton>
      {/* Auth Buttons */}
      <OAuthButtonGroup
        mode="login"
        loadingColor="#000"
        tw="flex-row bg-transparent my-4"
        style={{gap: 10}}
        color="white"
      />
    </StyledView>
  );
};

export default Onboarding;
