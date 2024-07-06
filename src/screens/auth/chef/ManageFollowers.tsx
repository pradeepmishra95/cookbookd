import {StyledPageView, StyledText, StyledView} from '@/components';
import StyledListItem from '@/components/ListItem';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

type ManageFollowersProps = NativeStackScreenProps<
  RootStackParamList,
  'chef_manage_followers'
>;

type follower = {
  customer_name: string;
  customer_profile: string;
};

type initialStateI = {
  followers: follower[];
  selectedFollower: follower;
};
const initialState: initialStateI = {
  followers: [],
  selectedFollower: {customer_name: '', customer_profile: ''},
};
const ManageFollowers = ({navigation, route}: ManageFollowersProps) => {
  const {theme} = useTheme();
  const [state, setState] = useState<initialStateI>(initialState);
  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet({
    icon: state.selectedFollower.customer_profile ? (
      <Image
        source={{uri: state.selectedFollower.customer_profile}}
        style={{height: 76, width: 76, borderRadius: 65}}
      />
    ) : (
      <FeatherIcon name="user" size={35} color={theme.colors.grey5} />
    ),
    text: `Are you sure you want to remove ${state.selectedFollower?.customer_name}`,
    buttonText: 'Delete',
  });

  useEffect(() => {
    (async () => {
      const {data, status, HttpStatusCode} = await request<follower[]>(
        'GET',
        urls.auth.chef.followers.get,
      );
      if (status === HttpStatusCode.OK && data.success) {
        setState(prev => ({
          ...prev,
          followers: data.data,
        }));
      }
    })();
  }, []);
  return (
    <StyledPageView
      header
      navigation={navigation}
      route={route}
      title={`Followers (${route.params.followers})`}
      twScrollView={'justify-start pt-5'}>
      {state.followers &&
        state.followers.map((follower, i) => {
          return (
            <StyledListItem
              key={i}
              twContainer={'w-full'}
              containerStyle={
                state.followers[i + 1] && {
                  borderBottomColor: theme.colors.greyOutline,
                  borderBottomWidth: 1,
                }
              }
              title={follower.customer_name}
              rightComponent={
                <TouchableOpacity
                  activeOpacity={1}
                  className="rounded-lg w-24 h-9 justify-center items-center"
                  onPress={() => {
                    setState(prev => ({...prev, selectedFollower: follower}));
                    BottomSheetRef.current?.present();
                  }}
                  style={{
                    //   backgroundColor: theme.colors.secondary,
                    borderColor: theme.colors.dividerColor,
                    borderWidth: 1,
                  }}>
                  <StyledText h4>Remove</StyledText>
                </TouchableOpacity>
              }
              leftComponent={
                follower.customer_profile ? (
                  <Image
                    source={{uri: follower.customer_profile}}
                    style={{width: 48, height: 48, borderRadius: 48}}
                  />
                ) : (
                  <StyledView className=" rounded-full w-12 h-12 border border-white justify-center items-center">
                    <FeatherIcon
                      name="user"
                      size={35}
                      color={theme.colors.grey5}
                    />
                  </StyledView>
                )
              }
            />
          );
        })}
      <BottomSheet />
    </StyledPageView>
  );
};

export default ManageFollowers;
