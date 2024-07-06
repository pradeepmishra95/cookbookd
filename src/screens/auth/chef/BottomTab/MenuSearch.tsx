import CloseSVG from '@/assets/icons/close.svg';
import EditSVG from '@/assets/icons/custom/EditSVG';
import FilterSVG from '@/assets/icons/filter.svg';
import SearchSVG from '@/assets/icons/search.svg';
import TrashSVG from '@/assets/icons/trash.svg';
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
import {useEffect, useMemo, useState} from 'react';
import {Dimensions, FlatList, Image, TouchableOpacity} from 'react-native';

type MenuSearchPropsType = NativeStackScreenProps<
  RootStackParamList,
  'chef_menu_search'
>;

interface initialStateI {
  searchText: string;
  cuisines: SelectOptions[];
  categories: SelectOptions[];
  selectedCuisine: string;
  selectedCategory: string;
}

interface searchParamsI {
  searchText: string;
  selectedCuisine: string;
  selectedCategory: string;
}

const initialState: initialStateI = {
  searchText: '',
  cuisines: [],
  categories: [],
  selectedCuisine: '0',
  selectedCategory: '0',
};

const initialSearchParams: searchParamsI = {
  searchText: '',
  selectedCuisine: '0',
  selectedCategory: '0',
};

const MenuSearch = ({route, navigation}: MenuSearchPropsType) => {
  const {theme} = useTheme();
  const [state, setState] = useState(initialState);
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const debouncedChatText = useDebounce(state.searchText, 500);
  const {width} = Dimensions.get('screen');

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
    <StyledPageView isScrollable={false} style={{paddingHorizontal: 5}}>
      <StyledView tw="flex-row items-center " style={{gap: 15}}>
        <CloseSVG
          color={theme.colors.black}
          onPress={() => navigation.goBack()}
        />
        <StyledView
          className="w-full flex-1 flex-row items-center justify-around p-4"
          style={{
            borderRadius: 40,
            backgroundColor:
              theme.mode === 'dark' ? theme.colors.searchBg : '#EEEFF0',
          }}>
          <StyledView className="flex-row items-center flex-1">
            <SearchSVG color={theme.colors.black} />
            <StyledInput
              errorStyle={{display: 'none'}}
              inputContainerStyle={{padding: 0, flex: 1}}
              inputStyle={{fontSize: 16}}
              containerStyle={{flex: 1}}
              placeholder="Search Dish"
              placeholderTextColor={theme.colors.lightText}
              style={{padding: 0}}
              value={state.searchText}
              onChangeText={searchText =>
                setState(prev => ({...prev, searchText}))
              }
            />
          </StyledView>
          <StyledView className="flex-row items-center">
            <Divider
              className="rotate-90"
              style={{width: 25}}
              height={0.5}
              linear={false}
            />
            <TouchableOpacity onPress={toggleDrawer}>
              <FilterSVG color={theme.colors.black} />
            </TouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>

      <Divider height={0.5} tw="my-4" style={{width, marginLeft: -15}} />
      <FlatList
        data={menus}
        style={{flex: 1}}
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
                borderColor: theme.colors.greyOutline,
                borderWidth: 2,
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
                <StyledText h5 style={{color: theme.colors.lightText}}>
                  {item.description.length > 100
                    ? `${item.description.slice(0, 100)}...`
                    : item.description}
                </StyledText>
                <StyledView tw="absolute right-0 top-0 flex-row">
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('chef_menu_update', item);
                    }}>
                    <EditSVG
                      height={30}
                      width={30}
                      color={theme.colors.black}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <TrashSVG
                      color={theme.colors.black}
                      onPress={() => {
                        const {id} = item;
                        if (id) {
                          setState(prev => ({
                            ...prev,
                            selected: id,
                          }));
                          //   deleteBottomSheetRef.current?.present();
                        }
                      }}
                    />
                  </TouchableOpacity>
                </StyledView>
              </StyledView>
            </StyledView>
          );
        }}
        onEndReachedThreshold={0.5}
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
      <Drawer />
    </StyledPageView>
  );
};

export default MenuSearch;
