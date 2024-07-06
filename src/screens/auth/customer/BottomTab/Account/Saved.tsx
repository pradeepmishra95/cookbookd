
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import Divider from '@/components/Divider';
import Post, {PostType} from '@/components/Post';
import urls from '@/constants/urls';
import {CustomerBottomTabParamListType} from '@/routes/auth/customer/types';
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


 

  useEffect(() => {
    if (!selectedAddress) {
      return;
    }
    resetData();
    fetchFirstPage();
  }, [selectedAddress]);



  useEffect(() => {
    setPosts('home', data);
  }, [data]);

  return (
    <StyledPageView isScrollable={false} style={{paddingHorizontal: 5}}>

 <StyledView className="w-full gap-y-4 mb-10">
<StyledView className=" flex-row justify-between items-center w-full">
                <StyledText h2>Saved Posts</StyledText>
              </StyledView>
              </StyledView>
     
      <FlatList
        data={allPosts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        refreshing={false}
        onRefresh={() => {
          resetData();
          fetchFirstPage();
        }}
        style={{flex: 1, backgroundColor: theme.colors.background}}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!endReached) fetchNextPage();
        }}
       
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