import BackSVG from '@/assets/icons/custom/BackSVG';
import EditSVG from '@/assets/icons/custom/EditSVG';
import Logout2SVG from '@/assets/icons/custom/Logout2SVG';
import LogoutSVG from '@/assets/icons/custom/LogoutSVG';
import PhoneSVG from '@/assets/icons/custom/PhoneSVG';
import SettingsSVG from '@/assets/icons/custom/SettingsSVG';
import BookmarkSVG from '@/assets/icons/custom/BookmarkSVG';
import SmsSVG from '@/assets/icons/custom/SmsSVG';
import SunSVG from '@/assets/icons/custom/SunSVG';
import DarkModeSVG from '@/assets/icons/dark_mode.svg';
import HomeSVG from '@/assets/icons/home.svg';
import LightModeSVG from '@/assets/icons/light_mode.svg';
import BackgroundSVG from '@/assets/images/background.svg';
import { StyledPageView, StyledText, StyledView } from '@/components';
import Divider from '@/components/Divider';
import StyledListItem, { StyledListItemPropsType } from '@/components/ListItem';
import { Switch } from '@/components/Switch';
import baseTheme from '@/constants/theme';
import urls from '@/constants/urls';
import { CustomerBottomTabParamListType } from '@/routes/auth/customer/types';
import request from '@/services/api/request';
import useAuth from '@/store/useAuth';
import useTheme from '@/store/useTheme';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, useTheme as useRNUITheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';


type AccountPropsType = CompositeScreenProps<
  BottomTabScreenProps<CustomerBottomTabParamListType, 'account'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Account = ({navigation, route}: AccountPropsType) => {
  const {theme} = useRNUITheme();
  const userData = useAuth(state => state.userData);
  const toggleTheme = useTheme(state => state.toggleTheme);
  const logout = useAuth(state => state.logout);
  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet({
    icon: <Logout2SVG />,
    buttonText: 'Logout',
    text: 'Are you sure you want to Log Out',
    onButtonPress: () => {
      (async () => {
        const {data, HttpStatusCode, status} = await request(
          'DELETE',
          urls.auth.customer.logout,
        );
        if (status === HttpStatusCode.OK && data.success) {
          logout();
        }
      })();
    },
  });
  const insets = useSafeAreaInsets();
  const ForwordButton = () => (
    <BackSVG className="rotate-180" color={theme.colors.black} />
  );

  const ListItems: (StyledListItemPropsType & {
    navigateTo?: Parameters<
      NativeStackScreenProps<RootStackParamList>['navigation']['navigate']
    >[0];
  })[] = [
    {
      title: 'Color Theme',
      leftComponent: <SunSVG color={theme.colors.black} />,
      rightComponent: (
        <Switch
          offKnob={DarkModeSVG}
          onKnob={LightModeSVG}
          onTrackBgColor={theme.colors.yellow}
          status={theme.mode === 'dark'}
          toggleStatus={toggleTheme}
          size={30}
        />
      ),
    },
    {
      title: 'Edit Profile',
      leftComponent: (
        <EditSVG width={20} height={20} color={theme.colors.black} />
      ),
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'customer_edit_profile', params: undefined},
    },
    {
      title: 'Settings',
      leftComponent: <SettingsSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'customer_settings', params: undefined},
    },

    {
      title: 'Saved',
      leftComponent: <BookmarkSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'saved_post', params: undefined},
    },
    {
      title: 'Become a Chef',
      leftComponent: <HomeSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'Home', params: undefined},
    },
  ];

  const animationProgress = useDerivedValue(() => {
    return theme.mode === 'dark' ? withTiming(1) : withTiming(0);
  }, [theme]);

  const animatedBackground = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      [
        baseTheme.lightColors?.background ?? '#FFF',
        baseTheme.darkColors?.background ?? '#000',
      ],
    );
    return {
      backgroundColor,
    };
  });
  const animatedText = useAnimatedStyle(() => {
    const color = interpolateColor(
      animationProgress.value,
      [0, 1],
      [
        baseTheme.lightColors?.black ?? '#000',
        baseTheme.darkColors?.black ?? '#FFF',
      ],
    );
    return {
      color,
    };
  });
  return (
    <StyledPageView noInsets noPadding twScrollView={'flex-1'} isScrollable={true}>
      <StyledView
        style={{flex: 1, backgroundColor: theme.colors.primary}}
        tw="w-full justify-end items-center pt-16 relative">
        <BackgroundSVG style={{position: 'absolute', top: 0}} />
        <TouchableOpacity
          style={{top: insets.top + 20}}
          className="flex-row gap-x-2 justify-center items-center absolute right-4"
          onPress={() => BottomSheetRef.current?.present()}>
          <LogoutSVG color={'white'} />
          <StyledText style={{color: '#ffffff'}}>Logout</StyledText>
        </TouchableOpacity>
        <StyledView
          tw="absolute bottom-0 w-full justify-center items-center"
          style={[
            {
              height: 60,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              overflow: 'visible',
            },
            animatedBackground,
          ]}
        />
        <StyledView
          tw="justify-center items-center"
          style={[
            {
              height: 100,
              width: 100,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: '#FFFFFF',
            },
            animatedBackground,
          ]}>
          {userData?.profile_image ? (
            <Image
              source={{uri: userData.profile_image}}
              style={{
                height: 100,
                width: 100,
                borderRadius: 60,
                borderWidth: 3,
                borderColor: '#FFFFFF',
              }}
            />
          ) : (
            <FeatherIcon name="user" size={60} color={theme.colors.grey5} />
          )}
        </StyledView>
      </StyledView>
      <StyledView
        style={[{flex: 3, paddingHorizontal: 15}, animatedBackground]}
        tw="w-full justify-start items-center">
        <StyledText h2 tw="mt-2">
          {userData?.first_name} {userData?.last_name}
        </StyledText>
        <Divider linear style={{marginVertical: 15}} />
        <StyledView tw="gap-2 self-start">
          <StyledView tw="flex-row items-center ">
            <StyledView
              tw="p-2 mr-2 ml-2"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.greyOutline,
                borderRadius: 24,
              }}>
              <PhoneSVG color={theme.colors.black} />
            </StyledView>
            {userData?.phone_number ? (
              <StyledText h4>{userData?.phone_number}</StyledText>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('customer_edit_profile')}>
                <StyledText h4 style={{color: theme.colors.lightText}}>
                  Click to Add Phone Number
                </StyledText>
              </TouchableOpacity>
            )}
          </StyledView>

          <StyledView tw="flex-row items-center ">
            <StyledView
              tw="p-2 mr-2 ml-2"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.greyOutline,
                borderRadius: 24,
              }}>
              <SmsSVG color={theme.colors.black} />
            </StyledView>
            {userData?.email ? (
              <StyledText style={{fontWeight: '800'}}>
                {userData?.email}
              </StyledText>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('customer_edit_profile')}>
                <StyledText h4 style={{color: theme.colors.lightText}}>
                  Click to Add Email
                </StyledText>
              </TouchableOpacity>
            )}
          </StyledView>
        </StyledView>

        <StyledView className=" w-full h-full justify-start gap-y-3 mt-2">
          {ListItems.map((item, i) => (
            <StyledListItem
              key={i}
              {...item}
              onPress={() => {
                item.navigateTo !== undefined
                  ? navigation.navigate(item.navigateTo)
                  : undefined;
              }}
              twContainer={'w-full rounded-lg'}
              leftComponent={
                <StyledView
                  className=" rounded-full items-center justify-center p-1"
                  style={{backgroundColor: theme.colors.greyOutline}}>
                  {item.leftComponent}
                </StyledView>
              }
              containerStyle={{backgroundColor: theme.colors.grey0}}
            />
          ))}
        </StyledView>
      </StyledView>
      <BottomSheet />
    </StyledPageView>
  );
};

export default Account;
