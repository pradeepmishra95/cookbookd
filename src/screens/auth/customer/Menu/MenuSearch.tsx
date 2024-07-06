import AddSVG from '@/assets/icons/add.svg';
import CloseSVG from '@/assets/icons/close.svg';
import FilterSVG from '@/assets/icons/filter.svg';
import SearchSVG from '@/assets/icons/search.svg';
import StarSVG from '@/assets/icons/star.svg';
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
import {MenuType} from '@/screens/auth/chef/Onboarding/Menu/MenuUpdate';
import request from '@/services/api/request';
import useDrawer, {DrawerBadge} from '@/utils/useDrawer';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {useDebounce} from '@uidotdev/usehooks';
import {RootStackParamList} from 'App';
import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Image} from 'react-native';

type MenuSearchPropsType = NativeStackScreenProps<
  RootStackParamList,
  'customer_menu_search'
>;
const menuItems = [
  {
    title: 'Lotteria - 124 Sandiago',
    images: [
      {
        image:
          'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
  },
];

interface initialStateI {
  selectedTab: number;
  searchText: string;
  loading: boolean;
  cuisines: SelectOptions[];
  categories: SelectOptions[];
  selectedCuisine: string;
  selectedCategory: string;
}

const initialState: initialStateI = {
  selectedTab: 0,
  searchText: '',
  loading: false,
  cuisines: [],
  categories: [],
  selectedCuisine: '0',
  selectedCategory: '0',
};

interface searchParamsI {
  searchText: string;
  selectedCuisine: string;
  selectedCategory: string;
}

const initialSearchParams: searchParamsI = {
  searchText: '',
  selectedCuisine: '0',
  selectedCategory: '0',
};

const MenuSearch = ({navigation, route}: MenuSearchPropsType) => {
  const [state, setState] = useState(initialState);
  const {theme} = useTheme();
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const debouncedChatText = useDebounce(state.searchText, 500);

  const {Drawer, toggleDrawer} = useDrawer(
    'Filter',
    <StyledView className="flex-1">
      <StyledView tw="flex-1 w-full">
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
            }));
            setSearchParams(prev => ({
              ...prev,
              selectedCategory: '0',
              selectedCuisine: '0',
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
            }));
            toggleDrawer();
          }}
        />
      </StyledView>
    </StyledView>,
    [state],
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

  const requestConfig = useMemo(
    () => ({
      category_id:
        state.categories.at(Number.parseInt(searchParams.selectedCategory))
          ?.value ?? 0,
      cuisine_id: searchParams.selectedCuisine,
      search: searchParams.searchText,
    }),
    [
      state.categories,
      searchParams.selectedCategory,
      searchParams.selectedCuisine,
      searchParams.searchText,
    ],
  );

  const {
    data: menus,
    fetchNextPage,
    endReached,
    loading,
    fetchFirstPage,
    resetData,
  } = usePaginatedRequest<MenuType>({
    requestParams: ['GET', urls.auth.chef.menu.get, requestConfig],
    initialState: [],
  });

  useEffect(() => {
    resetData();
    fetchFirstPage();
  }, [requestConfig]);

  useEffect(() => {
    setSearchParams(prev => ({...prev, searchText: state.searchText}));
  }, [debouncedChatText]);

  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      isScrollable={false}
      style={{paddingHorizontal: 5}}>
      <StyledView>
        <FlatList
          data={menus}
          ListHeaderComponent={
            <StyledView>
              <StyledView
                className="mb-5 flex-row items-center justify-between"
                style={{columnGap: 10, marginBottom: 0}}>
                <CloseSVG
                  color={theme.colors.black}
                  onPress={() => navigation.pop()}
                />
                <StyledInput
                  value={state.searchText}
                  onChangeText={searchText =>
                    setState(prev => ({...prev, searchText}))
                  }
                  placeholder="Search dish name, chef, cuisines"
                  placeholderTextColor={theme.colors.lightText}
                  errorStyle={{display: 'none'}}
                  leftIcon={<SearchSVG color={theme.colors.black} />}
                  rightIcon={
                    <FilterSVG
                      color={theme.colors.black}
                      onPress={toggleDrawer}
                    />
                  }
                  rightIconContainerStyle={{
                    borderLeftColor: theme.colors.dividerColor,
                    borderLeftWidth: 1,
                    paddingLeft: 10,
                  }}
                  inputStyle={{
                    fontSize: 16,
                  }}
                  containerStyle={{
                    flex: 1,
                    paddingHorizontal: 0,
                  }}
                  inputContainerStyle={{
                    borderRadius: 30,
                  }}
                />
              </StyledView>
              <Divider
                height={0.5}
                tw="my-4"
                // style={{width, marginLeft: -15}}
              />
            </StyledView>
          }
          onEndReached={() => {
            if (!endReached && menus.length > 0) {
              console.log({endReached});
              console.log('hello');
              fetchNextPage();
            }
          }}
          renderItem={({item, index}) => {
            return (
              <StyledView
                key={index}
                tw="flex-row w-full items-center p-2 mb-3"
                style={{
                  backgroundColor:
                    theme.mode === 'dark' ? theme.colors.searchBg : '#FFFFFF',
                  borderRadius: 8,
                  gap: 15,
                }}>
                {item.images.length > 0 ? (
                  <Image
                    style={{height: 90, width: 90, borderRadius: 8}}
                    source={{
                      uri: item.images[0].image,
                    }}
                  />
                ) : (
                  <StyledView
                    tw="items-center justify-center"
                    style={{width: 90, height: 90, borderRadius: 8}}>
                    <StyledText>No Image</StyledText>
                  </StyledView>
                )}

                <StyledView tw="flex-1 h-full gap-2">
                  <StyledText h4>{item.title}</StyledText>
                  <StyledView
                    className="flex-row items-center"
                    style={{columnGap: 5}}>
                    <StyledText className="flex-row">
                      <StarSVG color={'#FF8D07'} />
                      <StyledText h5 style={{color: theme.colors.lightText}}>
                        {' '}
                        {4.3} (232)
                      </StyledText>
                    </StyledText>
                  </StyledView>
                  <StyledView className=" flex-row self-end">
                    <StyledButton
                      type="outline"
                      size="lg"
                      buttonStyle={{paddingVertical: 2}}>
                      <AddSVG color={theme.colors.primary} />
                      <StyledText style={{color: theme.colors.primary}} h5>
                        Add
                      </StyledText>
                    </StyledButton>
                  </StyledView>
                </StyledView>
              </StyledView>
            );
          }}
          ListFooterComponent={() => {
            return (
              <StyledView tw="p-2">
                {endReached ? (
                  <StyledText>...</StyledText>
                ) : loading ? (
                  <StyledButton loading twButton={'bg-transparent'} />
                ) : null}
              </StyledView>
            );
          }}
        />
      </StyledView>
      <Drawer />
    </StyledPageView>
  );
};

export default MenuSearch;
