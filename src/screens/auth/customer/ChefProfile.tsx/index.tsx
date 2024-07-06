import FilledLocationSVG from '@/assets/icons/FilledLocation.svg';
import AddSVG from '@/assets/icons/add.svg';
import BackSVG from '@/assets/icons/custom/BackSVG';
import HeartFilledSVG from '@/assets/icons/custom/HeartFilledSVG';
import StarSVG from '@/assets/icons/star.svg';
import {StyledButton, StyledText, StyledView} from '@/components';
import urls from '@/constants/urls';
import {AvailabilityType, WeekDays} from '@/screens/auth/chef/Availibility';
import {AddressType} from '@/screens/auth/common/Address/AddressManagement';
import request from '@/services/api/request';
import useData from '@/store/useData';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Image, Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Route, TabBar, TabView, TabViewProps} from 'react-native-tab-view';
import FeatherIcon from 'react-native-vector-icons/Feather';
import About from './About';
import ChefPost from './ChefPost';
import Review from './Review';

type ServiceType = {bookme: boolean; delivery: boolean; pickup: boolean};

export type ProfileData = {
  address: AddressType;
  is_followed: boolean;
  availibility: AvailabilityType;
  user_details: {
    first_name: string;
    last_name: string;
    average_rating: number;
    total_ratings: number;
    email: string;
    phone_number: string;
    followers: string;
    service_type: ServiceType;
    description: string;
    status: number;
    profile_image: '';
    cover_images: string;
  };
};

type initialStateI = {
  isExpanded: boolean;
  followLoading: boolean;
  loading: boolean;
  profileData: ProfileData;
};

const initialState: initialStateI = {
  isExpanded: false,

  followLoading: false,
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
    is_followed: false,
    availibility: Object.values(WeekDays).reduce(
      (prev, weekday) => {
        prev[weekday] = [];
        return prev;
      },
      {} as unknown as ProfileData['availibility'],
    ),
    user_details: {
      first_name: '',
      last_name: '',
      average_rating: 0,
      email: '',
      phone_number: '',
      followers: '',
      service_type: {bookme: false, delivery: false, pickup: false},
      description: '',
      status: 0,
      profile_image: '',
      cover_images: '',
      total_ratings: 0,
    },
  },
};

type ChefProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'customer_chef_profile'
>;

const ChefProfile = ({navigation, route}: ChefProfileProps) => {
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<initialStateI>(initialState);
  const {favorites, toggleFavorites} = useData();

  const isFavorite = useMemo(
    () => favorites.chef.has(route.params.id),
    [favorites],
  );

  const [routes] = useState([
    {key: 'about', title: 'About'},
    {key: 'review', title: 'Review & Rate'},
    {key: 'post', title: 'Post'},
  ]);

  const {theme} = useTheme();

  const layout = useWindowDimensions();

  const handleFavorite = useCallback(() => {
    toggleFavorites('chef', route.params.id);
    request(
      'POST',
      urls.auth.customer.favorites.add,
      {},
      {chef_id: route.params.id},
    );
  }, []);

  const handleFollow = useCallback(async () => {
    setState(prev => ({...prev, followLoading: true}));
    const {data, status, HttpStatusCode} = await request(
      'GET',
      `${urls.auth.customer.chef.follow}/${route.params.id}`,
      {},
      {chef_id: route.params.id},
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({
        ...prev,
        profileData: {
          ...prev.profileData,
          is_followed: !prev.profileData.is_followed,
        },
      }));
    }
    setState(prev => ({...prev, followLoading: false}));
  }, []);

  const renderScene: TabViewProps<Route>['renderScene'] = ({
    route: tabRoute,
  }) => {
    switch (tabRoute.key) {
      case 'about':
        return (
          <About
            profileData={state.profileData}
            loading={state.loading}
            onRefresh={fetchData}
          />
        );
      case 'review':
        return <Review id={route.params.id} />;
      case 'post':
        return <ChefPost id={route.params.id} />;
      default:
        return null;
    }
  };

  const fetchData = useCallback(async () => {
    setState(prev => ({...prev, loading: true}));
    const {data, status, HttpStatusCode} = await request<ProfileData>(
      'GET',
      `${urls.auth.common.chef_profile}/${route.params.id}`,
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({...prev, profileData: data.data}));
    }
    setState(prev => ({...prev, loading: false}));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StyledView tw={'flex-1'} bg>
      <StyledView style={{flex: 1.2}} tw="w-full justify-center items-center">
        {state.profileData.user_details.cover_images && (
          <ImageBackground
            className="absolute top-0 left-0"
            source={{uri: state.profileData.user_details.cover_images}}
            resizeMode="cover"
            style={{height: '100%', width: '100%'}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.7)']}
              style={{height: '100%', width: '100%'}}></LinearGradient>
          </ImageBackground>
        )}
        <StyledView tw="w-full">
          <StyledView className="w-full relative h-10">
            <StyledView className="flex-row justify-between px-3">
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                style={{
                  height: 36,
                  width: 36,
                  borderColor: '#3F3F3F',
                  borderRadius: 40,
                }}
                tw="pl-2 pt-[0.5] border bg-black justify-center items-center"
                activeOpacity={0.8}>
                <BackSVG color={'#FFFFFF'} width={20} height={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleFavorites('chef', route.params.id)}
                style={{
                  height: 36,
                  width: 36,
                  borderColor: '#3F3F3F',
                  borderRadius: 40,
                }}
                tw="p-2 border bg-black justify-center items-center"
                activeOpacity={0.8}>
                <HeartFilledSVG
                  heart_color={
                    isFavorite ? theme.colors.primary : 'transparent'
                  }
                  heart_stroke={
                    isFavorite ? theme.colors.primary : theme.colors.black
                  }
                  width={20}
                  height={20}
                  onPress={handleFavorite}
                />
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
              ) : state.profileData.user_details?.profile_image ? (
                <Image
                  source={{uri: state.profileData.user_details.profile_image}}
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
              {state.profileData.user_details?.first_name}{' '}
              {state.profileData.user_details?.last_name}
            </StyledText>
            {state.loading ? (
              <Skeleton height={20} style={{width: '50%', marginTop: 5}} />
            ) : (
              <StyledView tw="flex-row gap-x-3 items-center">
                <StyledView tw="flex-row items-center gap-x-2">
                  <StarSVG color={'#FF8D07'} />
                  <StyledText h2 tw="text-white">
                    {state.profileData.user_details.average_rating}
                    <StyledText h4 tw="text-white">
                      {' '}
                      ({state.profileData.user_details.total_ratings})
                    </StyledText>
                  </StyledText>
                </StyledView>
                <StyledView tw="flex-row items-center gap-x-2">
                  <FilledLocationSVG
                    color={theme.colors.primary}
                    height={15}
                    width={15}
                  />
                  <StyledText h2 tw="text-white mr-1">
                    1.3
                    <StyledText h4 tw="text-white" h5>
                      {' '}
                      mi
                    </StyledText>
                  </StyledText>
                </StyledView>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('customer_followers', {
                      followers: state.profileData.user_details.followers,
                      id: 1,
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
            )}
          </StyledView>
        </StyledView>
        <StyledView
          tw="absolute bottom-0 w-full justify-center items-center"
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
        className="flex-row justify-center"
        style={{paddingHorizontal: 6}}>
        <StyledButton
          loading={state.followLoading}
          disabled={state.followLoading}
          containerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleFollow}
          buttonStyle={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.greyOutline,
            borderWidth: 0.5,
            width: 172,
          }}>
          <StyledView tw="flex-row items-center justify-center">
            {state.profileData.is_followed ? (
              <>
                <StyledText h3 className="">
                  Following
                </StyledText>
              </>
            ) : (
              <>
                <AddSVG height={15} width={15} color={theme.colors.black} />
                <StyledText h3>Follow</StyledText>
              </>
            )}
          </StyledView>
        </StyledButton>
        <StyledButton
          onPress={() => navigation.navigate('customer_menu')}
          containerStyle={{
            flex: 1,
            width: 172,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          buttonStyle={{width: 172}}>
          Menu
        </StyledButton>
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
                left: (Dimensions.get('window').width / 3 - 55) / 3,
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

export default ChefProfile;
