import BackSVG from '@/assets/icons/custom/BackSVG';
import ClipBoardTextSVG from '@/assets/icons/custom/ClipBoardTextSVG';
import ClockSVG from '@/assets/icons/custom/ClockSVG';
import LocationSVG from '@/assets/icons/custom/LocationSVG';
import LockSVG from '@/assets/icons/custom/LockSVG';
import Logout2SVG from '@/assets/icons/custom/Logout2SVG';
import LogoutSVG from '@/assets/icons/custom/LogoutSVG';
import MessageQuestionSVG from '@/assets/icons/custom/MessageQuestionSVG';
import SunSVG from '@/assets/icons/custom/SunSVG';
import Wallet1SVG from '@/assets/icons/custom/Wallet1SVG';
import DarkModeSVG from '@/assets/icons/dark_mode.svg';
import LightModeSVG from '@/assets/icons/light_mode.svg';
import { StyledPageView, StyledText, StyledView } from '@/components';
import StyledListItem, { StyledListItemPropsType } from '@/components/ListItem';
import { Switch } from '@/components/Switch';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useAuth from '@/store/useAuth';
import useStoreTheme from '@/store/useTheme';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import React from 'react';
import { TouchableOpacity } from 'react-native';

type EditProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'chef_settings'
>;
const Settings = ({navigation, route}: EditProfileProps) => {
  const {theme} = useTheme();
  const toggleTheme = useStoreTheme(state => state.toggleTheme);
  const userData = useAuth(state => state.userData);
  const logout = useAuth(state => state.logout);
  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet({
    icon: <Logout2SVG />,
    buttonText: 'Logout',
    text: 'Are you sure you want to Log Out',
    onButtonPress: () => {
      (async () => {
        const {data, HttpStatusCode, status} = await request(
          'DELETE',
          urls.auth.chef.logout,
        );
        if (status === HttpStatusCode.OK && data.success) {
          logout();
        }
      })();
    },
  });
  const ForwordButton = () => {
    return <BackSVG className="rotate-180" color={theme.colors.black} />;
  };
  const SettingsItems: (StyledListItemPropsType & {
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
      title: 'Add Address',
      leftComponent: <LocationSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'address_management', params: undefined},
    },
    {
      title: 'Manage Availability',
      leftComponent: <ClockSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {
        name: 'chef_availability',
        params: {mode: 'page', title: 'Your Availability'},
      },
    },
    {
      title: 'Bank Details',
      leftComponent: <Wallet1SVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'chef_bank_details_management', params: undefined},
    },
    {
      title: userData?.is_password ? 'Change Password' : 'Add New Password',
      leftComponent: <LockSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'change_password', params: undefined},
    },
    {
      title: 'Customer Support',
      leftComponent: <MessageQuestionSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'support', params: undefined},
    },
    {
      title: 'Guidelines',
      leftComponent: <MessageQuestionSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'guideline', params: undefined},
    },
    {
      title: 'Terms & Conditions',
      leftComponent: <ClipBoardTextSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'terms_and_condition', params: undefined},
    },
  ];

  return (
    <StyledPageView
      header
      navigation={navigation}
      route={route}
      title="Settings"
      twScrollView={'pt-5'}
      rightComponent={
        <TouchableOpacity
          className="flex-row items-center gap-x-2"
          onPress={() => BottomSheetRef.current?.present()}>
          <LogoutSVG />
          <StyledText h4 style={{color: theme.colors.primary}}>
            Logout
          </StyledText>
        </TouchableOpacity>
      }>
      <StyledView className=" w-full flex-1 justify-start gap-y-3">
        {SettingsItems.map((item, i) => {
          return (
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
                  className=" rounded-full p-1"
                  style={{backgroundColor: theme.colors.greyOutline}}>
                  {item.leftComponent}
                </StyledView>
              }
              containerStyle={{backgroundColor: theme.colors.grey0}}
            />
          );
        })}
      </StyledView>
      <BottomSheet />
    </StyledPageView>
  );
};

export default Settings;
