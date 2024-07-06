import FilterSVG from '@/assets/icons/filter.svg';
import SearchSVG from '@/assets/icons/search.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';

import Divider from '@/components/Divider';
import {Header} from '@/components/Header';
import Post, {PostType} from '@/components/Post';
import urls from '@/constants/urls';
import {CustomerBottomTabParamListType} from '@/routes/auth/customer/types';
import ChefCard from '@/screens/auth/customer/components/ChefCard';
import request from '@/services/api/request';
import useAddress from '@/store/useAddress';
import useData from '@/store/useData';
import useLiveChefs from '@/store/useLiveChefs';
import useThemeStore from '@/store/useTheme';
import useWs from '@/store/useWs';
import {ChefType, CuisinesType} from '@/utils/types/customer';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {ReadyState} from 'react-use-websocket';
import CuisineCard from '../components/CuisinesCard';
import LiveChefCard from '../components/LiveChefCard';

type HomePropsType = CompositeScreenProps<
  BottomTabScreenProps<CustomerBottomTabParamListType, 'home'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface initialStateI {
  cuisines: CuisinesType[];
  cuisineLoading: boolean;
  liveChefLoading: boolean;
}

const initialState: initialStateI = {
  cuisines: [],
  cuisineLoading: false,
  liveChefLoading: false,
};

const Home = ({navigation, route}: HomePropsType) => {
  const [state, setState] = useState(initialState);
  const {theme} = useTheme();
  const themeMode = useThemeStore(state => state.theme);
  const {liveChefs, clearLiveChefs} = useLiveChefs();
  const {selectedAddress, addressLoading} = useAddress();
  const {getPosts, setPosts, posts} = useData();
  const {sendJsonMessage, wsState} = useWs();
  const allPosts = useMemo(() => getPosts('home'), [posts]);

  const fetchPopularCusines = useCallback(async () => {
    console.log('Fetching popular cuisines...');

    setState(prev => ({...prev, cuisines: [], cuisineLoading: true}));

    const {data, status, HttpStatusCode} = await request<CuisinesType[]>(
      'GET',
      urls.auth.common.constants.cuisine,
      {},
      {},
      false,
    );

    console.log(
      'Response from popular cuisines API:-------------------------------------------->>>>>>>>>>>>>>>>',
      data,
    );

    if (status === HttpStatusCode.OK && data.success) {
      console.log(
        'Cuisines fetched successfully. Updating state...>>>>>>>>>>>>>>>>',
      );
      setState(prev => ({...prev, cuisines: data.data}));
    }

    console.log('Setting cuisineLoading to false.>>>>>>>>>>>>>>>>>>>>');
    setState(prev => ({...prev, cuisineLoading: false}));
  }, []);

  const fetchLiveChefs = useCallback(
    async (wsState: ReadyState) => {
      console.log('Fetching live chefs...>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

      setState(prev => ({...prev, liveChefLoading: true}));

      clearLiveChefs();

      if (wsState === ReadyState.OPEN) {
        console.log(
          "WebSocket connection is open. Sending 'get_live_chefs' message...",
        );
        sendJsonMessage('get_live_chefs', {
          ...selectedAddress?.location_coordinates,
        });
      }

      console.log('Setting liveChefLoading to false.');
      setState(prev => ({...prev, liveChefLoading: false}));
    },
    [wsState],
  );

  const {data, fetchFirstPage, endReached, loading, resetData, fetchNextPage} =
    usePaginatedRequest<PostType>({
      requestParams: [
        'GET',
        urls.auth.customer.posts.get,
        {
          latitude: selectedAddress?.location_coordinates.latitude,
          longitude: selectedAddress?.location_coordinates.longitude,
        },
      ],
      initialState: [],
    });

  const topRatedChefs = usePaginatedRequest<ChefType>({
    requestParams: [
      'GET',
      urls.auth.customer.chef.get,
      {
        latitude: selectedAddress?.location_coordinates.latitude,
        longitude: selectedAddress?.location_coordinates.longitude,
      },
    ],
    initialState: [],
  });

  console.log(
    'Top-rated chefs data:-------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
    topRatedChefs,
  );

  useEffect(() => {
    if (!selectedAddress) {
      return;
    }
    resetData();
    topRatedChefs.resetData();
    fetchFirstPage();
    topRatedChefs.fetchFirstPage();
    fetchPopularCusines();
  }, [selectedAddress]);

  useEffect(() => {
    console.log('ayaaa');
    fetchLiveChefs(wsState);
  }, [wsState, selectedAddress]);

  useEffect(() => {
    setPosts('home', data);
  }, [data]);

  return (
    <StyledPageView isScrollable={false} style={{paddingHorizontal: 5}}>
      <Header
        bottomComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('customer_search')}
            className="w-full flex-row items-center justify-around py-3"
            style={{
              borderRadius: 40,
              backgroundColor:
                themeMode === 'dark' ? theme.colors.searchBg : '#EEEFF0',
            }}>
            <StyledView className="flex-row items-center gap-x-2">
              <SearchSVG color={theme.colors.black} />
              <StyledText h4>Search dish name, chef, cuisines</StyledText>
            </StyledView>
            <StyledView className="flex-row items-center gap-x-1">
              <Divider
                className=" rotate-90"
                style={{width: 25}}
                height={0.5}
                linear={false}
              />

              <FilterSVG color={theme.colors.black} />
            </StyledView>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={allPosts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        refreshing={false}
        onRefresh={() => {
          resetData();
          topRatedChefs.resetData();
          fetchFirstPage();
          topRatedChefs.fetchFirstPage();
          fetchPopularCusines();
          fetchLiveChefs(wsState);
        }}
        style={{flex: 1, backgroundColor: theme.colors.background}}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!endReached) fetchNextPage();
        }}
        ListHeaderComponent={
          <StyledView
            tw={'justify-start'}
            style={{backgroundColor: theme.colors.background}}>
            <StyledView className="w-full gap-y-4 mb-6">
              <StyledView className=" flex-row justify-between items-center w-full">
                <StyledText h2>Live Chefs</StyledText>
                <StyledText
                  onPress={() => navigation.navigate('customer_live_chefs')}
                  h5
                  style={{color: theme.colors.primary}}>
                  View all
                </StyledText>
              </StyledView>
              {console.log(liveChefs, 'liveChefs*****************')}
              <FlatList
                data={liveChefs}
                keyExtractor={(item, index) => `${item.chef_id}-${index}`}
                horizontal
                ItemSeparatorComponent={() => <StyledView tw="m-1" />}
                showsHorizontalScrollIndicator={false}
                style={{overflow: 'visible', height: 180}}
                renderItem={({item}) => <LiveChefCard {...item} />}
                ListEmptyComponent={() =>
                  state.liveChefLoading ? (
                    <>
                      <Skeleton
                        style={{width: 120, height: 160, borderRadius: 20}}
                      />
                    </>
                  ) : (
                    <></>
                  )
                }
              />
            </StyledView>
            <StyledView className="w-full mb-10 gap-y-4">
              <StyledView className=" flex-row justify-between items-center w-full">
                <StyledText h2>Popular Cuisines</StyledText>
                <StyledText
                  h5
                  style={{color: theme.colors.primary}}
                  onPress={() =>
                    navigation.navigate('customer_popular_cuisines')
                  }>
                  View all
                </StyledText>
              </StyledView>
              <FlatList
                data={state.cuisines}
                keyExtractor={(item, index) => `${item.key}-${index}`}
                horizontal
                ItemSeparatorComponent={() => <StyledView tw="m-1" />}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <CuisineCard
                    {...item}
                    styleCardProps={{width: 60, height: 60, borderRadius: 60}}
                  />
                )}
                ListEmptyComponent={() =>
                  state.cuisineLoading ? (
                    <StyledView style={{gap: 10}}>
                      <Skeleton
                        style={{width: 60, height: 60, borderRadius: 60}}
                      />
                      <Skeleton
                        style={{width: 60, height: 10, borderRadius: 10}}
                      />
                    </StyledView>
                  ) : (
                    <></>
                  )
                }
              />
            </StyledView>
            <StyledView className="w-full gap-y-4 mb-10">
              <StyledView className=" flex-row justify-between items-center w-full">
                <StyledText h2>Top Rated Chefs</StyledText>
                <StyledText
                  h5
                  style={{color: theme.colors.primary}}
                  onPress={() =>
                    navigation.navigate('customer_top_rated_chefs')
                  }>
                  View all
                </StyledText>
              </StyledView>
            
              <FlatList
                data={topRatedChefs.data}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                horizontal
                ItemSeparatorComponent={() => <StyledView tw="m-1" />}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <ChefCard {...item} showFavorite={false} rowView />
                )}
                ListEmptyComponent={() =>
                  topRatedChefs.loading || addressLoading ? (
                    <StyledView tw="w-full" style={{gap: 10}}>
                      <Skeleton
                        height={200}
                        width={200}
                        style={{borderRadius: 8}}
                      />
                    </StyledView>
                  ) : (
                    <></>
                  )
                }
              />
            </StyledView>
          </StyledView>
        }
        renderItem={({index}) => <Post index={index} type="home" />}
        ListEmptyComponent={() =>
          loading || addressLoading ? (
            <StyledView tw="w-full" style={{gap: 10}}>
              <StyledView tw="w-full flex-row" style={{gap: 10}}>
                <Skeleton circle height={40} width={40} />
                <Skeleton height={40} style={{flex: 1}} />
              </StyledView>
              <Skeleton height={250} />
            </StyledView>
          ) : (
            <></>
          )
        }
        ItemSeparatorComponent={() => <Divider height={0.5} tw="my-4" />}
        ListFooterComponent={() => {
          return data.length === 0 ? (
            <></>
          ) : (
            <StyledView tw="p-2">
              {endReached ? (
                <StyledText tw="text-center">...</StyledText>
              ) : loading ? (
                <StyledButton loading twButton={'bg-transparent'} />
              ) : null}
            </StyledView>
          );
        }}
      />
    </StyledPageView>
  );
};

export default Home;
