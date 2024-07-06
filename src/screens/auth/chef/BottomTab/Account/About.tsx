

import EditSVG from '@/assets/icons/custom/EditSVG';
import LocationSVG from '@/assets/icons/custom/LocationSVG';
import PhoneSVG from '@/assets/icons/custom/PhoneSVG';
import SmsSVG from '@/assets/icons/custom/SmsSVG';
import { StyledPageView, StyledText, StyledView } from '@/components';
import Divider from '@/components/Divider';
import StyledListItem, { StyledAccordion } from '@/components/ListItem';
import { Switch } from '@/components/Switch';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ProfileData } from '.';
import { AvailabilityType, WeekDays } from '../../Availibility';

type ServiceType = {bookme: boolean; delivery: boolean; pickup: boolean};

type AboutProps = {
  profileData: ProfileData;
  refreshing: boolean;
  onRefresh: () => void;
};

type initialStateI = {
  isExpanded: boolean;
};

const initialState: initialStateI = {
  isExpanded: false,
};

export default function About({
  profileData,
  onRefresh,
  refreshing,
}: AboutProps) {
  const [state, setState] = useState<initialStateI>(initialState);
  const {theme} = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    setState(prev => ({...prev, profileData: profileData}));
  }, []);

  const availibility = useMemo(() => {
    return (
      (
        profileData.availibility[
          dayjs
            .weekdays()
            [dayjs().day()].toLowerCase() as keyof AvailabilityType
        ] ?? []
      ).at(0) ?? null
    );
  }, [profileData]);

  return (
    <StyledPageView
      noPadding
      noInsets
      twScrollView="justify-start pt-2"
      scrollViewProps={{
        refreshControl: (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ),
      }}>
      {profileData.address?.formatted_address && (
        <StyledListItem
          title={
            <StyledText h4 style={{color: 'black'}}>
              {`${profileData.address?.formatted_address}`}
            </StyledText>
          }
          containerStyle={{
            backgroundColor: '#FBE8E8',
            borderColor: '#EFCCCB',
            borderWidth: 1,
          }}
          twContainer={' w-full rounded-xl'}
          leftComponent={<LocationSVG color={theme.colors.primary} />}
          rightComponent={
            <TouchableOpacity
              className="flex-1"
              onPress={() => {
                navigation.navigate('address_update', profileData.address);
              }}>
              <EditSVG color={'black'} />
            </TouchableOpacity>
          }
        />
      )}

      <StyledView className="w-full flex-row items-center justify-between relative">
        <StyledView className="flex-1">
          <StyledAccordion
            style={{paddingHorizontal: 0, flex: 1}}
            containerStyle={{paddingHorizontal: 0}}
            title={
              <StyledView
                style={{maxWidth: '100%'}}
                className="flex-row justify-around items-center w-full">
                <StyledText h3 className="mr-4" style={{color: '#48B065'}}>
                  Availability
                </StyledText>
                <StyledText h4>
                  {`${dayjs.weekdaysShort()[dayjs().day()]}`}
                  {'  '}
                  <StyledText
                    h4
                    h4Style={{
                      color: availibility
                        ? theme.colors.black
                        : theme.colors.primary,
                    }}>
                    {availibility
                      ? `${availibility.from} - ${availibility.to}`
                      : 'Closed'}
                  </StyledText>
                </StyledText>
              </StyledView>
            }
            rightIcon={
              <FeatherIcon
                name="chevron-down"
                color={theme.colors.black}
                size={20}
                style={{marginLeft: -5}}
              />
            }
            isExpanded={state.isExpanded}
            onPress={() =>
              setState(prev => ({...prev, isExpanded: !prev.isExpanded}))
            }>
            <StyledView
              className="ml-auto rounded-md py-2 w-[75%]"
              style={{borderColor: theme.colors.grey2, borderWidth: 0.5}}>
              {Object.entries(WeekDays).map(([key, value]) => {
                return (
                  <StyledView className="flex-row justify-center" key={value}>
                    <StyledText className="flex-[0.5] px-2">{key}</StyledText>
                    <StyledView tw="flex-1">
                      {profileData.availibility &&
                      profileData.availibility[value] ? (
                        profileData.availibility[value].map((fromTo, i) => (
                          <StyledText className="flex-1 text-center" key={i}>
                            {fromTo.from} - {fromTo.to}
                          </StyledText>
                        ))
                      ) : (
                        <StyledText
                          className="flex-1 text-center"
                          style={{color: theme.colors.primary}}>
                          Closed
                        </StyledText>
                      )}
                    </StyledView>
                  </StyledView>
                );
              })}
            </StyledView>
          </StyledAccordion>
        </StyledView>
        <TouchableOpacity
          className="flex-1 items-center pt-4"
          onPress={() => {
            navigation.navigate('chef_availability', {
              mode: 'page',
              title: 'Availability',
            });
          }}>
          <EditSVG color={theme.colors.black} />
        </TouchableOpacity>
       
       
      </StyledView>

      <Divider height={0.5} tw={`${state.isExpanded ? 'mt-2' : ''} mb-1`} />

      <StyledView className="flex-row justify-between w-full my-4">
        <StyledText h3>Status</StyledText>
        <StyledView>
          <Switch
            size={28}
            offKnobColor="white"
            onKnobColor="#86CB65"
            offText="Busy"
            onText="Available"
            status={profileData.user_details.status === 1}
          />
        </StyledView>
      </StyledView>

      <Divider height={0.5} tw="mb-4" />
      <StyledView className="items-start w-full gap-y-3 mb-4">
        <StyledText h3>Contact</StyledText>
        {profileData.user_details.phone_number !== '' && (
          <StyledView className=" flex-row justify-start items-center gap-x-5">
            <StyledView
              className=" rounded-full p-1"
              style={{backgroundColor: theme.colors.background}}>
              <PhoneSVG color={theme.colors.black} />
            </StyledView>
            <StyledText>{profileData.user_details.phone_number}</StyledText>
          </StyledView>
        )}
        {profileData.user_details.email !== '' && (
          <StyledView className=" flex-row justify-start items-center gap-x-5">
            <StyledView
              className=" rounded-full p-1"
              style={{
                backgroundColor: theme.colors.background,
              }}>
              <SmsSVG color={theme.colors.black} />
            </StyledView>
            <StyledText>{profileData.user_details.email}</StyledText>
          </StyledView>
        )}
      </StyledView>
      <Divider height={0.5} tw="mb-4" />
      <StyledView className="items-start w-full gap-y-3 mb-4">
        <StyledText h3>My Services</StyledText>
        <StyledView className="flex-row justify-start items-center gap-x-2">
          {Object.entries(profileData.user_details?.service_type ?? {})
            .filter(([_, value]) => value === 'true')
            .map(([key, _], i) => (
              <StyledView
                key={i}
                style={{
                  borderColor: theme.colors.greyOutline,
                  borderWidth: 1,
                }}
                className="px-2 py-1 items-center justify-center rounded-3xl">
                <StyledText h5>
                  {key === 'delivery'
                    ? 'Delivery'
                    : key === 'pickup'
                    ? 'Pick Up'
                    : 'Book Me'}
                </StyledText>
              </StyledView>
            ))}
        </StyledView>
      </StyledView>
      <Divider height={0.5} tw="mb-4" />
      <StyledView className="items-start w-full gap-y-3 mb-4">
        <StyledText h3>About</StyledText>
        <StyledText>{profileData.user_details.description}</StyledText>
      </StyledView>
    </StyledPageView>
  );
}
