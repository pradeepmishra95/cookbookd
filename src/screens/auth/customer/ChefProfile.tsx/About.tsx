import LocationSVG from '@/assets/icons/custom/LocationSVG';
import MapSVG from '@/assets/images/map.svg';
import {StyledPageView, StyledText, StyledView} from '@/components';
import Divider from '@/components/Divider';
import StyledListItem, {StyledAccordion} from '@/components/ListItem';
import {AvailabilityType, WeekDays} from '@/screens/auth/chef/Availibility';
import {Skeleton, useTheme} from '@rneui/themed';
import dayjs from 'dayjs';
import React, {useEffect, useMemo, useState} from 'react';
import {RefreshControl} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {ProfileData} from '.';

type ServiceType = {bookme: boolean; delivery: boolean; pickup: boolean};

type AboutProps = {
  profileData: ProfileData;
  loading: boolean;
  onRefresh: () => void;
};

type initialStateI = {
  isExpanded: boolean;
};

const initialState: initialStateI = {
  isExpanded: false,
};

const serviceMap = (key: string) => {
  switch (key) {
    case 'delivery':
      return 'Delivery';
    case 'pickup':
      return 'Pick UP';
    case 'bookme':
      return 'Book Me';
    default:
      return '';
  }
};

export default function About({profileData, loading, onRefresh}: AboutProps) {
  const [state, setState] = useState<initialStateI>(initialState);
  const {theme} = useTheme();

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
          <RefreshControl onRefresh={onRefresh} refreshing={false} />
        ),
      }}>
      {loading ? (
        <>
          <Skeleton height={80} style={{borderRadius: 15}} />
          <StyledView tw="flex-row w-full my-4" style={{gap: 10}}>
            <Skeleton height={20} style={{width: '30%'}} />
            <Skeleton height={20} style={{width: '40%'}} />
          </StyledView>
        </>
      ) : (
        <>
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
                <TouchableOpacity className="flex-1">
                  <MapSVG />
                </TouchableOpacity>
              }
            />
          )}
          <StyledView className="w-full flex-row items-center justify-between relative">
            <StyledView className="flex-1">
              <StyledAccordion
                style={{paddingHorizontal: 0}}
                containerStyle={{paddingHorizontal: 0}}
                title={
                  <StyledView className="flex-row  justify-around items-center w-full">
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
                  />
                }
                isExpanded={state.isExpanded}
                onPress={() =>
                  setState(prev => ({...prev, isExpanded: !prev.isExpanded}))
                }>
                <StyledView
                  className="ml-auto rounded-md py-2 w-[80%]"
                  style={{borderColor: theme.colors.grey2, borderWidth: 0.5}}>
                  {Object.entries(WeekDays).map(([key, value]) => {
                    return (
                      <StyledView
                        className="flex-row justify-center"
                        key={value}>
                        <StyledText className="flex-[0.5] px-2">
                          {key}
                        </StyledText>
                        <StyledView tw="flex-1">
                          {profileData.availibility &&
                          profileData.availibility[value] ? (
                            profileData.availibility[value].map((fromTo, i) => (
                              <StyledText
                                className="flex-1 text-center"
                                key={i}>
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
          </StyledView>

          <Divider height={0.5} tw={`${state.isExpanded ? 'mt-2' : ''} mb-1`} />

          <StyledView className="items-start w-full gap-y-3 mb-4">
            <StyledText h3>My Services</StyledText>
            <StyledView className="flex-row justify-start items-center gap-x-2">
              {profileData.user_details?.service_type ? (
                Object.keys(profileData.user_details?.service_type)
                  .filter(e => {
                    return profileData.user_details?.service_type[
                      e as keyof ServiceType
                    ];
                  })
                  .map((elem, i) => (
                    <StyledView
                      key={i}
                      style={{
                        // backgroundColor: theme.colors.greyOutline,
                        borderColor: theme.colors.greyOutline,
                        borderWidth: 1,
                      }}
                      className=" px-2 py-1 items-center justify-center rounded-3xl">
                      <StyledText h5>{serviceMap(elem)}</StyledText>
                    </StyledView>
                  ))
              ) : (
                <StyledText> --- </StyledText>
              )}
            </StyledView>
          </StyledView>

          <Divider height={0.5} tw="mb-4" />

          <StyledView className="items-start w-full gap-y-3 mb-4">
            <StyledText h3>About</StyledText>
            <StyledText>{profileData.user_details.description}</StyledText>
          </StyledView>
        </>
      )}
    </StyledPageView>
  );
}
