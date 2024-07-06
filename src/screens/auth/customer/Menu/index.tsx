import AddSVG from '@/assets/icons/add.svg';
import SearchSVG from '@/assets/icons/search.svg';
import StarSVG from '@/assets/icons/star.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import {SelectOptions} from '@/components/Select';
import TopMenuBar from '@/components/TopMenuBar';
import urls from '@/constants/urls';
import {MenuType} from '@/screens/auth/chef/Onboarding/Menu/MenuUpdate';
import request from '@/services/api/request';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useEffect, useMemo, useState} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';

type MenuPropsType = NativeStackScreenProps<
  RootStackParamList,
  'customer_menu'
>;

interface initialStateI {
  cuisines: SelectOptions[];
  categories: SelectOptions[];
  selectedCuisine: string;
  selectedCategory: number;
}

const initialState: initialStateI = {
  cuisines: [],
  categories: [],
  selectedCuisine: '0',
  selectedCategory: 0,
};

const Menu = ({navigation, route}: MenuPropsType) => {
  const [state, setState] = useState(initialState);
  const [cache, setCache] = useState<Object>({});
  const {theme} = useTheme();

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
      category_id: state.categories.at(state.selectedCategory)?.value ?? 0,
      cuisine_id: state.selectedCuisine,
    }),
    [state.categories, state.selectedCategory, state.selectedCuisine],
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
    console.log({requestConfig});

    fetchFirstPage();
  }, [requestConfig]);

  return (
    <StyledPageView
      isScrollable={false}
      navigation={navigation}
      route={route}
      title={'Menu'}
      header
      rightComponent={
        <SearchSVG
          color={theme.colors.black}
          onPress={() => navigation.navigate('customer_menu_search')}
        />
      }
      tw="px-2"
      style={{paddingHorizontal: 5}}>
      <TopMenuBar
        showCategories
        categories={state.categories}
        cuisines={state.cuisines}
        selectedCuisine={state.selectedCuisine}
        selectedCategory={state.selectedCategory}
        setSelectedCategory={selectedCategory => {
          resetData();
          setState(prev => ({...prev, selectedCategory}));
        }}
        setSelectedCuisine={selectedCuisine => {
          resetData();
          setState(prev => ({...prev, selectedCuisine}));
        }}
        renderPage={({route}) => {
          return Number.parseInt(route.key) === state.selectedCategory ? (
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
              ListHeaderComponent={<StyledView className="my-2"></StyledView>}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                      navigation.navigate('customer_menu_details', {
                        menu_id: item.id,
                      })
                    }
                    key={index}
                    tw="flex-row w-full items-center p-2 mb-3"
                    style={{
                      backgroundColor:
                        theme.mode === 'dark'
                          ? theme.colors.searchBg
                          : '#FFFFFF',
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
                          <StyledText
                            h5
                            style={{color: theme.colors.lightText}}>
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
                  </TouchableOpacity>
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
          ) : null;
        }}
      />
    </StyledPageView>
  );
};

export default Menu;
