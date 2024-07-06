import GpsSVG from '@/assets/icons/custom/GpsSVG';
import LocationSVG from '@/assets/icons/custom/LocationSVG';
import LocationMarkerSVG from '@/assets/images/custom/LocationMarkerSVG';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React from 'react';

type EnterLocationProps = NativeStackScreenProps<
  RootStackParamList,
  'enter_location'
>;

const EnterLocation = ({navigation, route}: EnterLocationProps) => {
  const {theme} = useTheme();

  return (
    <StyledPageView
      header
      backButton={false}
      rightComponent={
        <StyledText
          onPress={() =>
            navigation.navigate('customer_bottom_tab', {screen: 'home'})
          }
          style={{color: theme.colors.primary}}>
          Skip
        </StyledText>
      }
      navigation={navigation}
      route={route}
      twScrollView={'pb-5'}>
      <StyledView tw="w-full items-center gap-y-5 flex-1">
        <StyledText h1>What's Your Location</StyledText>
        <StyledText
          h4
          tw="text-center mt-3 mb-5"
          h4Style={{color: theme.colors.lightText}}>
          We need your location to know your address and provide the best
          experience
        </StyledText>
        <LocationMarkerSVG />
        <StyledView
          style={{backgroundColor: theme.colors.grey0}}
          tw="w-full h-12 flex-row items-center gap-x-3 rounded">
          <LocationSVG color={theme.colors.black} />
          <StyledText>Enter Your Location</StyledText>
        </StyledView>
        <StyledView tw="flex-row items-center gap-x-2">
          <GpsSVG />
          <StyledText
            h4
            tw="text-center"
            h4Style={{color: theme.colors.primary}}>
            Use My Current Location
          </StyledText>
        </StyledView>
      </StyledView>
      <StyledButton
        title={'Submit'}
        // loading={state.loading}
        loadingProps={{size: 24}}
        disabled={true}
        twContainer="w-full"
        onPress={() =>
          navigation.navigate('customer_bottom_tab', {screen: 'home'})
        }
      />
    </StyledPageView>
  );
};

export default EnterLocation;
