import DeleteSVG from '@/assets/icons/delete.svg';
import TrashSVG from '@/assets/icons/trash.svg';
import {StyledPageView, StyledText, StyledView} from '@/components';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AirbnbRating, Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, SectionList} from 'react-native';
import Config from 'react-native-config';
import {TouchableOpacity} from 'react-native-gesture-handler';

type NotificationProps = NativeStackScreenProps<
  RootStackParamList,
  'notification'
>;

type NotificationType = {
  id: number;
  subject: string;
  profile_image: string;
  is_seen: number;
  rating: null | number;
  feedback: null | number;
  created_at: string;
  type: 'follower' | 'rating';
};

interface initialStateI {
  notifications: Record<string, NotificationType[]>;
  endReached: boolean;
  selectedNotification: null | number;
  loading: boolean;
}

const initialState: initialStateI = {
  notifications: {},
  endReached: false,
  selectedNotification: null,
  loading: false,
};

const calendarFormat = {
  sameDay: '[Today]', // The same day ( Today )
  nextDay: '[Tomorrow]', // The next day ( Tomorrow )
  nextWeek: '[Next] dddd', // The next week ( Sunday  ),
  lastDay: '[Yesterday]', // The day before ( Yesterday )
  lastWeek: '[Last] dddd', // Last week ( Last Monday )
  sameElse: 'MMMM DD, YYYY', // Everything else ( 7/10/2011 )
};

const Notification = ({navigation, route}: NotificationProps) => {
  const {theme} = useTheme();
  const [state, setState] = useState(initialState);
  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet({
    icon: <DeleteSVG />,
    text: `Are you sure you want to clear all the notifications`,
    buttonText: 'Clear All',
  });

  const DeleteBottomSheet = useCommonBottomSheet({
    icon: <DeleteSVG />,
    text: `Are you sure you want to delete this notification`,
    buttonText: 'Delete',
  });

  const notificationMapping = useMemo(() => {
    const mapping = Object.keys(state.notifications)
      .sort()
      .reverse()
      .map(key => ({
        title: key,
        data: state.notifications[key],
      }));

    return mapping;
  }, [state]);

  const fetchNotifications = useCallback(async (last_notification: number) => {
    setState(prev => ({...prev, loading: true}));
    const {data, status, HttpStatusCode} = await request<
      Record<string, NotificationType[]>
    >(
      'GET',
      Config.USER_TYPE === 'chef'
        ? urls.auth.chef.notification.get
        : urls.auth.customer.notification.get,
      {last_notification},
    );
    if (status === HttpStatusCode.OK && data.success) {
      if (Object.keys(data.data).length === 0) {
        setState(prev => ({...prev, endReached: true}));
      } else {
        setState(prev => {
          if (last_notification === 0)
            return {...prev, notifications: data.data};
          Object.keys(data.data).forEach(key => {
            if (Object.keys(prev.notifications).includes(key)) {
              prev.notifications[key] = prev.notifications[key].concat(
                data.data[key],
              );
            } else {
              prev.notifications[key] = data.data[key];
            }
          });
          return prev;
        });
      }
    }
    setState(prev => ({...prev, loading: false}));
  }, []);

  useEffect(() => {
    fetchNotifications(0);
  }, []);

  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      header
      isScrollable={false}
      style={{paddingHorizontal: 5}}
      title={'Notifications'}
      rightComponent={
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => BottomSheetRef.current?.present()}>
          <StyledText style={{color: theme.colors.primary}}>
            Clear All
          </StyledText>
        </TouchableOpacity>
      }>
      <SectionList
        refreshing={false}
        onRefresh={() => {
          setState(prev => ({...prev, notifications: {}}));
          fetchNotifications(0);
        }}
        onEndReached={() => {
          if (Object.keys(state.notifications).length > 0) {
            let lastDay = Object.keys(state.notifications).sort()[0];
            let last_message = state.notifications[lastDay].reverse()[0].id;
            fetchNotifications(last_message);
          }
        }}
        tw="flex-1"
        style={{
          padding: 15,
        }}
        sections={notificationMapping}
        renderItem={({item}) => {
          return (
            <StyledView
              className="flex-row my-2"
              style={{
                backgroundColor:
                  theme.mode === 'dark'
                    ? theme.colors.searchBg
                    : theme.colors.background,
                borderRadius: 10,
                borderColor: theme.colors.greyOutline,
                borderWidth: 2,
                padding: 10,
                gap: 10,
              }}>
              <Image
                source={{
                  uri: item.profile_image,
                }}
                style={{width: 46, height: 46, borderRadius: 46}}
              />
              <StyledView tw="flex-1 justify-center">
                <StyledView className="flex-row justify-start">
                  <StyledText h4>
                    {/* {item}{' '} */}
                    <StyledText h5>{item.subject}</StyledText>
                    {'  '}
                    <StyledText style={{color: theme.colors.lightText}} h5>
                      <StyledView
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 5,
                          backgroundColor: theme.colors.grey2,
                          marginVertical: 'auto',
                        }}
                      />
                      {'  '}
                      {dayjs().to(dayjs(item.created_at))}
                    </StyledText>
                  </StyledText>
                </StyledView>
                {item.type === 'rating' && (
                  <StyledView>
                    <StyledText h5>{item.feedback}</StyledText>
                    <AirbnbRating
                      isDisabled
                      defaultRating={item.rating ?? 0}
                      selectedColor={'#FF8D07'}
                      ratingContainerStyle={{
                        backgroundColor:
                          theme.mode === 'dark'
                            ? theme.colors.searchBg
                            : theme.colors.background,
                        alignItems: 'flex-start',
                      }}
                      showRating={false}
                      size={16}
                      // starContainerStyle={{width: 10}}
                    />
                  </StyledView>
                )}
              </StyledView>
              <TrashSVG
                onPress={() => {
                  setState(prev => ({...prev, selectedNotification: item.id}));
                  DeleteBottomSheet.BottomSheetRef.current?.present();
                }}
                color={theme.colors.black}
              />
            </StyledView>
          );
        }}
        renderSectionHeader={({section}) => {
          return (
            <StyledText h1>
              {dayjs(section.title, 'YYYYMMDD').calendar(
                undefined,
                calendarFormat,
              )}
            </StyledText>
          );
        }}
        keyExtractor={(item, index) => `chat-${item.id ?? 0}-${index}`}
        ListFooterComponent={<StyledView tw="w-full p-3" />}
        ListEmptyComponent={() =>
          state.loading ? (
            <StyledView tw="w-full flex-row" style={{gap: 10}}>
              <Skeleton circle height={46} width={46} />
              <Skeleton height={46} style={{flex: 1}} />
            </StyledView>
          ) : (
            <></>
          )
        }
      />

      <BottomSheet />
      <DeleteBottomSheet.BottomSheet />
    </StyledPageView>
  );
};

export default Notification;
