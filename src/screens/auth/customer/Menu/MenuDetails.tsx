import FilledLocationSVG from '@/assets/icons/FilledLocation.svg';
import HeartFilledSVG from '@/assets/icons/custom/HeartFilledSVG';
import StarSVG from '@/assets/icons/star.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useData from '@/store/useData';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Dimensions, Image} from 'react-native';

type MenuDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'customer_menu_details'
>;

interface menuItem {
  chef_name: string;
  chef_profile_image: string;
  cuisine_name: string;
  description: string;
  price: string;
  currency: string;
  title: string;
  total_avarage_rating: number;
  total_ratings: number;
  total_comments: number;
  total_likes: number;
  images: {id: number; image: string}[];
}
type initialStateI = {
  menuItem: menuItem;
};

const initialState: initialStateI = {
  menuItem: {
    chef_name: '',
    chef_profile_image: '',
    cuisine_name: '',
    description: '',
    price: '',
    currency: '',
    title: '',
    total_avarage_rating: 0,
    total_ratings: 0,
    total_comments: 0,
    total_likes: 0,
    images: [],
  },
};

const MenuDetails = ({navigation, route}: MenuDetailsProps) => {
  const {width} = Dimensions.get('window');

  const {theme} = useTheme();
  const [state, setState] = useState<initialStateI>(initialState);
  const {favorites, toggleFavorites} = useData();

  const isFavorite = useMemo(
    () => favorites.menu.has(route.params.menu_id ?? -1),
    [favorites],
  );

  console.log({isFavorite});

  const handleFavorite = useCallback(() => {
    toggleFavorites('menu', route.params.menu_id ?? -1);
    request(
      'POST',
      urls.auth.customer.favorites.add,
      {},
      {menu_id: route.params.menu_id},
    );
  }, []);

  useEffect(() => {
    (async () => {
      const {data, status, HttpStatusCode} = await request<menuItem[]>(
        'GET',
        urls.auth.customer.menu.get + `${route.params.menu_id}`,
      );
      if (status === HttpStatusCode.OK && data.success) {
        setState(prev => ({...prev, menuItem: data.data[0]}));
      }
    })();
  }, []);

  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      header
      title={'Details'}
      noPadding
      twScrollView={'justify-start'}
      footerComponent={
        <StyledView className="w-full flex-row justify-between px-3 py-2">
          <StyledView></StyledView>
          <StyledButton
            className=" w-full"
            title={'Continue'}
            buttonStyle={{paddingHorizontal: 50}}
          />
        </StyledView>
      }
      rightComponent={
        <HeartFilledSVG
          heart_color={isFavorite ? theme.colors.primary : 'transparent'}
          heart_stroke={isFavorite ? theme.colors.primary : theme.colors.black}
          width={20}
          height={20}
          onPress={handleFavorite}
        />
      }>
      <StyledView className="mb-2 w-full flex-[0.6]">
        {state.menuItem.images.length > 0 ? (
          <Image
            style={{height: 200, width: width, flex: 1}}
            source={{
              uri: state.menuItem.images[0].image,
            }}
          />
        ) : (
          <Skeleton style={{width: '100%', flex: 1}} />
        )}
      </StyledView>
      <StyledView className="w-full" style={{paddingHorizontal: 15}}>
        <StyledText h2 className="w-full mb-3">
          {state.menuItem.title}
          {'  '}
          <StyledText h4>{state.menuItem.cuisine_name}</StyledText>
        </StyledText>
        <StyledView className="w-full mb-3">
          {state.menuItem.chef_name ? (
            <StyledText h3>Cooked By</StyledText>
          ) : (
            <Skeleton
              height={30}
              style={{width: 60, marginBottom: 3, borderRadius: 5}}
            />
          )}
          {state.menuItem.chef_name ? (
            <StyledView
              className="flex-row justify-start items-center w-full"
              style={{height: 78, columnGap: 10}}>
              <StyledView>
                <Image
                  style={{height: 48, width: 48, borderRadius: 48}}
                  source={{
                    uri: state.menuItem.chef_profile_image,
                  }}
                />
              </StyledView>
              <StyledView className="w-full">
                <StyledView className="flex-row items-center mr-5">
                  <StyledText>{state.menuItem.chef_name}</StyledText>
                  <StyledView
                    style={{
                      backgroundColor: '#61C37A',
                      width: 8,
                      height: 8,
                      borderRadius: 8,
                      marginLeft: 5,
                    }}></StyledView>
                </StyledView>
                <StyledView
                  className="flex-row items-center"
                  style={{columnGap: 5}}>
                  <StyledText className="flex-row">
                    <StarSVG color={'#FF8D07'} />
                    <StyledText h5 style={{color: theme.colors.lightText}}>
                      {' '}
                      {state.menuItem.total_avarage_rating} (
                      {state.menuItem.total_ratings})
                    </StyledText>
                  </StyledText>
                  <StyledView
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 3,
                      backgroundColor: theme.colors.lightText,
                    }}></StyledView>
                  <StyledText
                    className="flex-row"
                    style={{color: theme.colors.lightText}}>
                    <FilledLocationSVG
                      color={theme.colors.lightText}
                      width={12}
                      height={12}
                    />{' '}
                    {1.3} mi
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          ) : (
            <Skeleton height={60} style={{width: '100%', borderRadius: 10}} />
          )}
        </StyledView>
        <StyledView className="w-full">
          {state.menuItem.description ? (
            <StyledText h3>Details</StyledText>
          ) : (
            <Skeleton
              height={30}
              style={{width: 60, marginBottom: 3, borderRadius: 5}}
            />
          )}
          {state.menuItem.description ? (
            <StyledText h4 style={{color: theme.colors.lightText}}>
              {state.menuItem.description}
            </StyledText>
          ) : (
            <Skeleton height={50} style={{width: '100%', borderRadius: 10}} />
          )}
        </StyledView>
      </StyledView>
    </StyledPageView>
  );
};

export default MenuDetails;
