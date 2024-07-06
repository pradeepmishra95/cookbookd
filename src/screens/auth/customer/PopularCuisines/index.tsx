import {StyledPageView, StyledText, StyledView} from '@/components';
import {SelectOptions} from '@/components/Select';
import TopMenuBar from '@/components/TopMenuBar';
import urls from '@/constants/urls';
import CuisinesCard from '@/screens/auth/customer/components/CuisinesCard';
import request from '@/services/api/request';
import useAddress from '@/store/useAddress';
import useData from '@/store/useData';
import {CuisinesType} from '@/utils/types/customer';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import FeatherIcon from 'react-native-vector-icons/Feather';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Image, ListRenderItem, TouchableOpacity} from 'react-native';
import {RootStackParamList} from 'App';
import { Dimensions } from 'react-native';

type PopularCuisineType = NativeStackScreenProps<
  RootStackParamList,
  'customer_popular_cuisines'
>;

interface initialStateI {
  cuisines: SelectOptions[];
  selectedCuisine: string;
}

const initialState: initialStateI = {
  cuisines: [],
  selectedCuisine: '0',
};

const PopularCuisine = ({route, navigation}: PopularCuisineType) => {
  const [state, setState] = useState(initialState);
  const {theme} = useTheme();
  const {selectedAddress} = useAddress();
  const {data, fetchFirstPage, fetchNextPage, loading, resetData, endReached} =
    usePaginatedRequest<CuisinesType>({
      requestParams: [
        'GET',
        urls.auth.common.constants.cuisine,
        {
          longitude: selectedAddress?.location_coordinates.longitude,
          latitude: selectedAddress?.location_coordinates.latitude,
        },
      ],
      initialState: [],
    });
  const {toggleFavorites} = useData();

  const handleFavorite = useCallback(
    (id: number) => {
      toggleFavorites('chef', id);
      request('POST', urls.auth.customer.favorites.add, {}, {chef_id: id});
    },
    [data],
  );

  const renderItem: ListRenderItem<CuisinesType> = useCallback(
    ({item, index}) => {
      return (
        <CuisinesCard
          {...item}
          styleCardProps={{ height: 180, borderRadius: 8, width: (Dimensions.get('window').width - 24) / 2, margin:8,}}
        />
      );
    },
    [],
  );

  useEffect(() => {
    (async () => {
      const {data, status, HttpStatusCode} = await request<SelectOptions[]>(
        'GET',
        urls.auth.common.constants.cuisine,
      );
      console.log({data});

      if (status === HttpStatusCode.OK && data.success) {
        if (data.data.length > 0 && data.data[0].key !== '0')
          data.data.splice(0, 0, {key: '0', label: 'All', value: '0'});
        setState(prev => ({...prev, cuisines: data.data}));
      }
    })();
  }, []);

  useEffect(() => {
    fetchFirstPage();
  }, [state.selectedCuisine]);

  return (
    <StyledPageView
      loading={loading}
      header
      route={route}
      navigation={navigation}
      title={'Popular Cuisine'}
      isScrollable={false}
      rightComponent={
        <FeatherIcon
          name="search"
          size={24}
          color={theme.colors.black}
          //   onPress={() => navigation.navigate('customer_popular_cuisine_search')}
        />
      }>
      <StyledView style={{paddingHorizontal: 5, paddingBottom: 10}}>
        <TopMenuBar
          cuisines={state.cuisines}
          selectedCuisine={state.selectedCuisine}
          setSelectedCuisine={selectedCuisine => {
            resetData();
            setState(prev => ({...prev, selectedCuisine}));
          }}
        />
      </StyledView>
      <FlatList
        tw="w-full"
        key={'popular_cuisine'}
        numColumns={2}
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ItemSeparatorComponent={() => <StyledView tw="m-1" />}
        refreshing={false}
        onRefresh={() => {
          resetData();
          fetchFirstPage();
        }}
        renderItem={renderItem}
        onEndReached={() => {
          if (!endReached) fetchNextPage();
        }}
      />
    </StyledPageView>
  );
};

export default PopularCuisine;
