import DeleteSVG from '@/assets/icons/delete.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,          
  StyledView,
} from '@/components';
import StyledBottomSheet, {
  BottomSheetModalData,
} from '@/components/BottomSheet';
import Divider from '@/components/Divider';
import { Header } from '@/components/Header';
import Post, { PostType } from '@/components/Post';
import urls from '@/constants/urls';
import { ChefBottomTabParamListType } from '@/routes/auth/chef/types';
import request from '@/services/api/request';
import useAddress from '@/store/useAddress';
import useData from '@/store/useData';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Skeleton, useTheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type HomePropsType = CompositeScreenProps<
  BottomTabScreenProps<ChefBottomTabParamListType, 'home'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface initialStateI {
  loading: boolean;
}

const initialState: initialStateI = {
  loading: false,
};

export type Cuisine = {
  cuisine_name: string;
  cuisine_image: string;
};

export const Cuisines: Cuisine[] = [
  {
    cuisine_name: 'Mexican',
    cuisine_image:
      'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    cuisine_name: 'Mexican',
    cuisine_image:
      'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    cuisine_name: 'Mexican',
    cuisine_image:
      'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    cuisine_name: 'Mexican',
    cuisine_image:
      'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    cuisine_name: 'Mexican',
    cuisine_image:
      'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    cuisine_name: 'Mexican',
    cuisine_image:
      'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    cuisine_name: 'Mexican',
    cuisine_image:
      'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const Home = ({navigation, route}: HomePropsType) => {
  const [state, setState] = useState(initialState);
  const {posts, setPosts, getPosts} = useData();
  const {selectedAddress, addressLoading} = useAddress();
  const {data, fetchFirstPage, endReached, loading, resetData} =
    usePaginatedRequest<PostType>({
      requestParams: [
        'GET',
        urls.auth.chef.posts.get,
        {
          latitude: selectedAddress?.location_coordinates.latitude,
          longitude: selectedAddress?.location_coordinates.longitude,
        },
      ],
      initialState: [],
    });

  const bottomSheetMore = useRef<BottomSheetModal>(null);
  const {theme} = useTheme();
  const allPosts = useMemo(() => getPosts('home'), [posts]);

  const openBottomSheet = useCallback(
    (selectedPost: number) => {
      bottomSheetMore.current?.present(selectedPost);
    },
    [bottomSheetMore],
  );

  const editPostDetails = useCallback(
    (id: number) => {
      const post = data.find(item => item.id === id);
      if (post) {
        navigation.navigate('chef_post_update', post);
      }
      bottomSheetMore.current?.dismiss();
    },
    [data],
  );

  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet<number>(
    {
      icon: <DeleteSVG />,
      text: 'Are you sure you want to delete this post?',
      buttonText: 'Delete',
      loading: state.loading,
      onButtonPress: async id => {
        if (id) {
          setState(prev => ({...prev, loading: true}));
          const {data, status, HttpStatusCode} = await request(
            'DELETE',
            `${urls.auth.chef.posts.delete}/${id}`,
          );
          if (status === HttpStatusCode.OK && data.success) {
            resetData();
            fetchFirstPage();
          }
          setState(prev => ({...prev, loading: false}));
        }
        BottomSheetRef.current?.dismiss();
      },
    },
    [state],
  );

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

  useEffect(() => {
    if (selectedAddress && route.params?.refresh) {
      resetData();
      fetchFirstPage();
    }
  }, [selectedAddress, route]);

  return (
    <StyledPageView isScrollable={false} style={{paddingHorizontal: 5}}>
      <Header />
      <FlatList
        data={allPosts}
        refreshing={false}
        onRefresh={() => {
          resetData();
          fetchFirstPage();
        }}
        style={{flex: 2}}
        showsVerticalScrollIndicator={false}
        renderItem={({index}) => (
          <Post openBottomSheet={openBottomSheet} index={index} type="home" />
        )}
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
          return allPosts.length === 0 ? (
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
        ListHeaderComponentStyle={{marginBottom: 20}}
        ListHeaderComponent={() => {
          return (
            <>
              <StyledView className="flex-row justify-between items-center w-full mb-4">
                <StyledText h2>Recent Orders</StyledText>
                <StyledText h5 style={{color: theme.colors.primary}}>
                  View all
                </StyledText>
              </StyledView>
              <FlatList
                data={Cuisines}
                horizontal
                ItemSeparatorComponent={() => <StyledView tw="m-1" />}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <StyledView
                    className="justify-start"
                    style={{width: 180, gap: 5}}>
                    <StyledView className="relative">
                      <Image
                        style={{
                          width: 180,
                          height: 158,
                          borderRadius: 10,
                        }}
                        source={{
                          uri: 'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
                        }}
                      />
                      <LinearGradient
                        colors={['#00000000', '#00000000', '#000000']}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: 10,
                        }}>
                        <StyledView
                          className="absolute top-2 right-2"
                          style={{
                            backgroundColor: theme.colors.primary,
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            borderRadius: 20,
                          }}>
                          <StyledText tw="text-white">Delivery</StyledText>
                        </StyledView>
                        <StyledView className="absolute bottom-2 left-2">
                          <StyledText h5 tw="text-white">
                            Delivery in
                          </StyledText>
                          <StyledText h4 tw="text-white">
                            10 - 15 mins
                          </StyledText>
                        </StyledView>
                      </LinearGradient>
                    </StyledView>
                    <StyledText h4>Chilaquiles</StyledText>
                    <StyledView className="flex-row">
                      <StyledText style={{color: theme.colors.yellow}} h5>
                        2 items{' '}
                      </StyledText>
                      <StyledText
                        style={{
                          color: theme.colors.lightText,
                        }}
                        h5>
                        May 25 at 02:30 PM
                      </StyledText>
                    </StyledView>
                  </StyledView>
                )}
              />
            </>
          );
        }}
      />

      <StyledBottomSheet
        bottomSheetRef={bottomSheetMore}
        index={0}
        snapPoints={['18%']}
        enablePanDownToClose>
        {({data}: BottomSheetModalData<number>) => {
          return (
            <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
              <TouchableOpacity onPress={() => editPostDetails(data)} tw="p-2">
                <StyledText h2>Edit</StyledText>
              </TouchableOpacity>
              <Divider linear />
              <TouchableOpacity
                onPress={() => {
                  bottomSheetMore.current?.dismiss();
                  BottomSheetRef.current?.present(data);
                }}
                tw="p-2">
                <StyledText h2>Delete</StyledText>
              </TouchableOpacity>
            </StyledView>
          );
        }}
      </StyledBottomSheet>
      <BottomSheet />
    </StyledPageView>
  );
};

export default Home;
