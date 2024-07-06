import FilterSVG from '@/assets/icons/filter.svg';
import SearchSVG from '@/assets/icons/search.svg';
import {
  StyledButton,
  StyledInput,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import Divider from '@/components/Divider';
import {SelectOptions} from '@/components/Select';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useAddress from '@/store/useAddress';
import useData from '@/store/useData';
import {ChefType, CuisinesType, FoodType} from '@/utils/types/customer';
import useDrawer, {DrawerBadge} from '@/utils/useDrawer';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {useDebounce} from '@uidotdev/usehooks';
import {RootStackParamList} from 'App';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import CuisinesCard from './components/CuisinesCard';
import FoodCard from './components/FoodCard';
import SmallChefCard from './components/SmallChefCard';

const tabs = [
  {flag: 'chefs', title: 'Chef'},
  {flag: 'dishes', title: 'Dish'},
  {flag: 'cuisines', title: 'Cuisines'},
];

type SearchProps = NativeStackScreenProps<
  RootStackParamList,
  'customer_search'
>;

type SearchCommonType<T> = {
  type: T;
};

type SearchChefType = ChefType & SearchCommonType<'chefs'>;
type SearchFoodType = FoodType & SearchCommonType<'menus'>;
type SearchCuisineType = CuisinesType & SearchCommonType<'cuisines'>;

type SearchType = SearchChefType | SearchFoodType | SearchCuisineType;

interface initialStateI {
  selectedTab: number;
  searchText: string;
  cuisines: SelectOptions[];
  types: SelectOptions[];
  services: SelectOptions[];
  sort: SelectOptions[];
  categories: SelectOptions[];
  selectedCuisine: string;
  selectedType: string;
  selectedService: string;
  selectedSort: string;
  selectedCategory: string;
  loading: boolean;
}

const initialState: initialStateI = {
  selectedTab: 0,
  searchText: '',
  cuisines: [],
  types: [
    {key: '1', value: '1', label: 'Popular'},
    {key: '2', value: '2', label: 'Top Rated'},
    {key: '3', value: '3', label: 'Available'},
  ],
  services: [
    {key: '1', value: '1', label: 'Book Me'},
    {key: '2', value: '2', label: 'Delivery'},
    {key: '3', value: '3', label: 'Pick Up'},
  ],
  sort: [
    {key: '1', value: '1', label: 'Price'},
    {key: '2', value: '2', label: 'Rating'},
    {key: '3', value: '3', label: 'Nearby'},
  ],
  categories: [],
  loading: false,
  selectedCuisine: '0',
  selectedType: '1',
  selectedService: '1',
  selectedSort: '1',
  selectedCategory: '0',
};

interface searchParamsI {
  searchText: string;
  selectedCuisine: string;
  selectedCategory: string;
  selectedType: string;
  selectedService: string;
  selectedSort: string;
}

const initialSearchParams: searchParamsI = {
  searchText: '',
  selectedCuisine: '0',
  selectedCategory: '0',
  selectedType: '1',
  selectedService: '1',
  selectedSort: '1',
};

const Search = ({navigation, route}: SearchProps) => {
  const [state, setState] = useState(initialState);
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const {theme} = useTheme();
  const debouncedChatText = useDebounce(state.searchText, 500);
  const {selectedAddress} = useAddress();
  const {toggleFavorites} = useData();

  const {Drawer, toggleDrawer} = useDrawer(
    'Filter',
    <StyledView className="flex-1">
      <StyledView tw="flex-1 w-full">
        <Divider height={0.5} tw="my-4" />
        <StyledView className="gap-y-3 px-5">
          <StyledText h3>Type</StyledText>
          <StyledView className="flex-row flex-wrap" style={{gap: 8}}>
            {state.types.map((item, index) => (
              <DrawerBadge
                key={index}
                activeOpacity={0.7}
                selected={item.value === state.selectedType}
                name={item.label}
                onPress={() => {
                  setState(prev => ({...prev, selectedType: item.value}));
                }}
              />
            ))}
          </StyledView>
        </StyledView>
        <Divider height={0.5} tw="my-4" />
        <StyledView className="gap-y-3 px-5">
          <StyledText h3>Service</StyledText>
          <StyledView className="flex-row flex-wrap" style={{gap: 8}}>
            {state.services.map((item, index) => (
              <DrawerBadge
                key={index}
                activeOpacity={0.7}
                selected={item.value === state.selectedService}
                name={item.label}
                onPress={() => {
                  setState(prev => ({...prev, selectedService: item.value}));
                }}
              />
            ))}
          </StyledView>
        </StyledView>
        <Divider height={0.5} tw="my-4" />
        <StyledView className="gap-y-3 px-5">
          <StyledText h3>Sort</StyledText>
          <StyledView className="flex-row flex-wrap" style={{gap: 8}}>
            {state.sort.map((item, index) => (
              <DrawerBadge
                key={index}
                activeOpacity={0.7}
                selected={item.value === state.selectedSort}
                name={item.label}
                onPress={() => {
                  setState(prev => ({...prev, selectedSort: item.value}));
                }}
              />
            ))}
          </StyledView>
        </StyledView>
        <Divider height={0.5} tw="my-4" />
        <StyledView className="gap-y-3 px-5">
          <StyledText h3>Cuisine</StyledText>
          <StyledView className="flex-row flex-wrap" style={{gap: 8}}>
            {state.cuisines.map((item, index) => (
              <DrawerBadge
                key={index}
                activeOpacity={0.7}
                selected={item.value === state.selectedCuisine}
                name={item.label}
                onPress={() => {
                  setState(prev => ({...prev, selectedCuisine: item.value}));
                }}
              />
            ))}
          </StyledView>
        </StyledView>
        <Divider height={0.5} tw="my-4" />
        <StyledView className="gap-y-3 px-5">
          <StyledText h3>Category</StyledText>
          <StyledView className="flex-row flex-wrap" style={{gap: 8}}>
            {state.categories.map((item, index) => (
              <DrawerBadge
                key={index}
                activeOpacity={0.7}
                selected={item.value === state.selectedCategory}
                name={item.label}
                onPress={() => {
                  setState(prev => ({...prev, selectedCategory: item.value}));
                }}
              />
            ))}
          </StyledView>
        </StyledView>
      </StyledView>
      <StyledView
        tw="flex-row items-center justify-center mb-5 px-5"
        style={{gap: 15}}>
        <StyledButton
          title={'Clear All'}
          type="outline"
          twContainer="flex-1"
          titleStyle={{color: theme.colors.black}}
          buttonStyle={{borderColor: theme.colors.greyOutline}}
          onPress={() => {
            setState(prev => ({
              ...prev,
              selectedCategory: '0',
              selectedCuisine: '0',
              selectedType: '1',
              selectedService: '1',
              selectedSort: '1',
            }));
            setSearchParams(prev => ({
              ...prev,
              selectedCategory: '0',
              selectedCuisine: '0',
              selectedType: '1',
              selectedService: '1',
              selectedSort: '1',
            }));
            toggleDrawer();
          }}
        />
        <StyledButton
          twContainer="flex-1"
          title={'Apply Filter'}
          onPress={() => {
            setSearchParams(prev => ({
              ...prev,
              selectedCategory: state.selectedCategory,
              selectedCuisine: state.selectedCuisine,
              selectedType: state.selectedType,
              selectedService: state.selectedService,
              selectedSort: state.selectedSort,
            }));
            toggleDrawer();
          }}
        />
      </StyledView>
    </StyledView>,
    [state],
  );

  const requestConfig = useMemo(
    () => ({
      category_id:
        state.categories.at(Number.parseInt(searchParams.selectedCategory))
          ?.value ?? 0,
      cuisine_id: searchParams.selectedCuisine,
      search: searchParams.searchText,
      type: searchParams.selectedType,
      service: searchParams.selectedService,
      sort: searchParams.selectedSort,
      flag: tabs[state.selectedTab].flag,
      ...(selectedAddress?.location_coordinates ?? {}),
    }),
    [state.categories, searchParams, state.selectedTab, selectedAddress],
  );

  const {data, fetchNextPage, endReached, loading, fetchFirstPage, resetData} =
    usePaginatedRequest<SearchType>({
      requestParams: ['GET', urls.auth.customer.search, requestConfig],
      initialState: [],
    });

  const handleFavorite = useCallback((id: number) => {
    toggleFavorites('menu', id);
    request('POST', urls.auth.customer.favorites.add, {}, {menu_id: id});
  }, []);

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
    (async () => {
      const {data, status, HttpStatusCode} = await request<SelectOptions[]>(
        'GET',
        urls.auth.common.constants.category,
      );
      if (status === HttpStatusCode.OK && data.success) {
        if (data.data.length > 0 && data.data[0].key !== '0')
          data.data.splice(0, 0, {key: '0', label: 'All', value: '0'});
        setState(prev => ({...prev, categories: data.data}));
      }
    })();
  }, []);

  useEffect(() => {
    resetData();
    fetchFirstPage();
  }, [requestConfig]);

  useEffect(() => {
    setSearchParams(prev => ({...prev, searchText: state.searchText}));
  }, [debouncedChatText]);

  return (
    <StyledPageView
      isScrollable={false}
      style={{paddingHorizontal: 5}}
      header
      navigation={navigation}
      route={route}
      title={'Search'}>
      <StyledView className="mt-2">
        <StyledView>
          <StyledInput
            value={state.searchText}
            onChangeText={searchText =>
              setState(prev => ({...prev, searchText}))
            }
            placeholder="Search dish name, chef, cuisines"
            errorStyle={{display: 'none'}}
            leftIcon={<SearchSVG color={theme.colors.black} />}
            rightIcon={
              <FilterSVG color={theme.colors.black} onPress={toggleDrawer} />
            }
            rightIconContainerStyle={{
              borderLeftColor: theme.colors.dividerColor,
              borderLeftWidth: 1,
              paddingLeft: 10,
            }}
            inputContainerStyle={{
              borderRadius: 30,
            }}
          />
        </StyledView>
        <StyledView
          className="flex-row m-3 p-1"
          style={{
            borderColor: theme.colors.greyOutline,
            borderWidth: 2,
            borderRadius: 25,
          }}>
          {tabs.map((tab, i) => (
            <StyledView key={`tab-${i}`} tw="flex-1">
              <TouchableOpacity
                tw="w-full items-center"
                activeOpacity={state.selectedTab === i ? 1 : 0.5}
                style={[
                  {
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 25,
                  },
                  state.selectedTab === i
                    ? {
                        backgroundColor: theme.colors.secondary,
                      }
                    : {},
                ]}
                onPress={() =>
                  state.selectedTab !== i &&
                  (() => {
                    resetData();
                    setState(prev => ({...prev, selectedTab: i}));
                  })()
                }>
                <StyledText
                  style={[
                    state.selectedTab === i
                      ? {
                          color:
                            theme.mode === 'light'
                              ? theme.colors.white
                              : theme.colors.black,
                        }
                      : {},
                  ]}
                  h4>
                  {tab.title}
                </StyledText>
              </TouchableOpacity>
            </StyledView>
          ))}
        </StyledView>
      </StyledView>
      <StyledView tw="flex-1">
        <FlatList
          data={data}
          key={state.selectedTab}
          refreshing={false}
          onRefresh={() => {
            resetData();
            fetchFirstPage();
          }}
          numColumns={state.selectedTab === 1 ? 2 : 1}
          renderItem={({item}) => {
            console.log(item);

            switch (state.selectedTab) {
              case 0:
                return <SmallChefCard {...item} />;
              case 1:
                return (
                  <FoodCard
                    {...item}
                    showFavorite
                    handleFavorite={handleFavorite}
                  />
                );
              case 2:
                return <CuisinesCard {...item} mode="row" />;
            }
            return <></>;
          }}
          onEndReached={() => {
            if (!endReached) fetchNextPage();
          }}
          ItemSeparatorComponent={() =>
            state.selectedTab !== 1 ? <Divider height={0.5} tw="my-4" /> : <></>
          }
          ListEmptyComponent={() =>
            loading ? (
              state.selectedTab === 1 ? (
                [...Array(1)].map((_, key) => (
                  <StyledView
                    key={key}
                    tw="w-full flex-row"
                    style={{gap: 10, marginBottom: 10}}>
                    {[...Array(2)].map((_, key) => (
                      <StyledView key={key} tw="flex-1" style={{gap: 5}}>
                        <Skeleton
                          height={180}
                          style={{flex: 1, borderRadius: 8}}
                        />
                        <Skeleton style={{width: '70%', height: 20}} />
                        <Skeleton style={{width: '50%', height: 20}} />
                      </StyledView>
                    ))}
                  </StyledView>
                ))
              ) : (
                <StyledView tw="flex-1 flex-row items-center" style={{gap: 15}}>
                  <Skeleton height={60} width={60} style={{borderRadius: 60}} />
                  <Skeleton style={{height: 50, flex: 1}} />
                </StyledView>
              )
            ) : (
              <></>
            )
          }
        />
      </StyledView>
      <Drawer />
    </StyledPageView>
  );
};

export default Search;
