

import EditSVG from '@/assets/icons/custom/EditSVG';
import SettingsSVG from '@/assets/icons/custom/SettingsSVG';
import { StyledButton, StyledText, StyledView } from '@/components';
import urls from '@/constants/urls';
import { ChefBottomTabParamListType } from '@/routes/auth/chef/types';
import { AddressType } from '@/screens/auth/common/Address/AddressManagement';
import request from '@/services/api/request';
import useAuth from '@/store/useAuth';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, useTheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import React, { useCallback, useEffect } from 'react';
import {
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Route, TabBar, TabView, TabViewProps } from 'react-native-tab-view';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AvailabilityType, WeekDays } from '../../Availibility';
import About from './About';
import Review, { ReviewType } from './Review';

type AccountPropsType = CompositeScreenProps<
  BottomTabScreenProps<ChefBottomTabParamListType, 'account'>,
  NativeStackScreenProps<RootStackParamList>
>;

type ServiceType = {bookme: boolean; delivery: boolean; pickup: boolean};

export type ProfileData = {
  address: AddressType;
  availibility: AvailabilityType;
  user_details: {
    average_rating: number;
    total_ratings: number;
    email: string;
    phone_number: string;
    followers: string;
    service_type: ServiceType;
    description: string;
    status: number;
    cover_images: string;
    profile_image: string;
    first_name: string;
    last_name: string;
  };
};

type initialStateI = {
  isExpanded: boolean;
  loading: boolean;
  profileData: ProfileData;
  review: ReviewType[];
};

const initialState: initialStateI = {
  isExpanded: false,
  loading: false,
  profileData: {
    address: {
      id: 0,
      address_name: '',
      city: '',
      flat_block: '',
      apartment_street_area: '',
      zipcode: '',
      country: '',
      state: '',
      formatted_address: '',
      location_coordinates: {latitude: 0, longitude: 0},
    },
    availibility: Object.values(WeekDays).reduce(
      (prev, weekday) => {
        prev[weekday] = [];
        return prev;
      },
      {} as unknown as ProfileData['availibility'],
    ),
    user_details: {
      average_rating: 0,
      email: '',
      phone_number: '',
      followers: '',
      service_type: {bookme: false, delivery: false, pickup: false},
      description: '',
      status: 0,
      cover_images: '',
      total_ratings: 0,
      profile_image: '',
      first_name: '',
      last_name: '',
    },
  },
  review: [],
};

const Account = ({navigation}: AccountPropsType) => {
  const [index, setIndex] = React.useState(0);
  const [state, setState] = React.useState<initialStateI>(initialState);

  const [routes] = React.useState([
    {key: 'first', title: 'About'},
    {key: 'second', title: 'Review & Rate'},
  ]);
  const userData = useAuth(state => state.userData);

  const {theme} = useTheme();

  const layout = useWindowDimensions();

  const renderScene: TabViewProps<Route>['renderScene'] = ({route}) => {
    switch (route.key) {
      case 'first':
        return (
          <About
            profileData={state.profileData}
            refreshing={state.loading}
            onRefresh={fetchData}
          />
        );
      case 'second':
        return (
          <Review
            data={state.review}
            refreshing={state.loading}
            onRefresh={fetchData}
          />
        );
      default:
        return null;
    }
  };

  const fetchProfileData = useCallback(async () => {
    const {data, status, HttpStatusCode} = await request<ProfileData>(
      'GET',
      urls.auth.common.chef_profile,
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({...prev, profileData: data.data}));
    }
  }, []);

  const fetchReviewData = useCallback(async () => {
    const {data, status, HttpStatusCode} = await request<ReviewType[]>(
      'GET',
      urls.auth.chef.rating.get,
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({...prev, reviews: data.data}));
    }
  }, []);

  const fetchData = useCallback(async () => {
    setState(prev => ({...prev, loading: true}));
    await fetchProfileData();
    await fetchReviewData();
    setState(prev => ({...prev, loading: false}));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  {
    /**When the user navigates back to Account screen after updating the address and Availability it will fetch the updated data  */
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  return (
    <StyledView tw={'flex-1'} bg>
      <StyledView style={{flex: 1.2}} tw="w-full justify-center items-center ">
        {userData && (
          <ImageBackground
            className="absolute top-0 left-0"
            source={{uri: state?.profileData?.user_details?.cover_images}}
            resizeMode="cover"
            style={{height: '100%', width: '100%'}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.7)']}
              style={{height: '100%', width: '100%'}}></LinearGradient>
          </ImageBackground>
        )}
        <StyledView tw="w-full">
          <StyledView className="w-full relative h-10">
            <StyledView className="flex-row gap-x-4 absolute right-2">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(
                    'chef_edit_profile',
                    state.profileData.user_details,
                  );
                }}
                style={{
                  height: 40,
                  width: 40,
                  borderColor: '#3F3F3F',
                  borderRadius: 40,
                }}
                tw="p-2 border bg-black"
                activeOpacity={0.8}>
                <EditSVG color={'#FFFFFF'} width={20} height={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('chef_settings');
                }}
                style={{
                  height: 40,
                  width: 40,
                  borderColor: '#3F3F3F',
                  borderRadius: 40,
                }}
                tw=" border bg-black items-center justify-center">
                <SettingsSVG color={'#FFFFFF'} width={20} height={20} />
              </TouchableOpacity>
            </StyledView>
          </StyledView>
          <StyledView tw="items-center">
            <StyledView
              bg
              tw="justify-center items-center"
              style={[
                {
                  height: 100,
                  width: 100,
                  borderRadius: 60,
                  borderWidth: 1,
                  borderColor: '#FFFFFF',
                },
                // animatedBackground,
              ]}>
              {false ? (
                <StyledButton loading twButton="bg-transparent" />
              ) : state?.profileData?.user_details?.profile_image ? (
                <Image
                  source={{
                    uri: state?.profileData?.user_details?.profile_image,
                  }}
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
            <StyledText h2 tw="text-white">
              {state?.profileData?.user_details?.first_name}{' '}
              {state?.profileData?.user_details?.last_name}
            </StyledText>
            <StyledView tw="flex-row gap-x-2">
              <StyledText h2 tw="text-white">
                {state.profileData.user_details.average_rating}
                <StyledText h4 tw="text-white">
                  {' '}
                  ({state.profileData.user_details.total_ratings})
                </StyledText>
              </StyledText>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('chef_manage_followers', {
                    followers: state.profileData.user_details.followers,
                  });
                }}>
                <StyledText h2 tw="text-white">
                  {state.profileData.user_details.followers}{' '}
                  <StyledText h4 tw="text-white">
                    Follower
                  </StyledText>
                </StyledText>
              </TouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
        <StyledView
          tw="absolute bottom-[-10] w-full justify-center items-center"
          style={[
            {
              height: 20,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              overflow: 'visible',
              backgroundColor: theme.colors.background,
            },
            // animatedBackground,
          ]}
        />
      </StyledView>
      <StyledView
        style={[{flex: 2, paddingHorizontal: 15}]}
        className="w-full justify-start">
        <TabView
          navigationState={{index, routes}}
          sceneContainerStyle={{height: '100%'}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{
                width: 70,
                left: (Dimensions.get('window').width / 3 - 20) / 2,
                backgroundColor: theme.colors.primary,
              }}
              style={{
                backgroundColor: theme.colors.background,
              }}
              indicatorContainerStyle={{
                borderBottomColor: theme.colors.grey0,
              }}
              renderLabel={({route, focused, color}) => (
                <StyledText
                  style={{
                    color: focused ? theme.colors.primary : theme.colors.black,
                    marginVertical: 0,
                  }}>
                  {route.title}
                </StyledText>
              )}
            />
          )}
          initialLayout={{width: layout.width}}
        />
      </StyledView>
    </StyledView>
  );
};

export default Account;
