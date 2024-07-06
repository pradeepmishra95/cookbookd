import EditSVG from '@/assets/icons/custom/EditSVG';
import DeleteSVG from '@/assets/icons/delete.svg';
import SearchSVG from '@/assets/icons/search.svg';
import TrashSVG from '@/assets/icons/trash.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import {Header} from '@/components/Header';
import {SelectOptions} from '@/components/Select';
import TopMenuBar from '@/components/TopMenuBar';
import urls from '@/constants/urls';
import {ChefBottomTabParamListType} from '@/routes/auth/chef/types';
import {MenuType} from '@/screens/auth/chef/Onboarding/Menu/MenuUpdate';
import request from '@/services/api/request';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useEffect, useMemo, useState} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';

type MenuPropsType = CompositeScreenProps<
  BottomTabScreenProps<ChefBottomTabParamListType, 'menu'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface initialStateI {
  cuisines: SelectOptions[];
  categories: SelectOptions[];
  selectedCuisine: string;
  selectedCategory: number;
  selectedMenu: number | null;
  loading: boolean;
}

const initialState: initialStateI = {
  cuisines: [],
  categories: [],
  selectedCuisine: '0',
  selectedCategory: 0,
  selectedMenu: null,
  loading: false,
};

const Menu = ({navigation}: MenuPropsType) => {
  const [state, setState] = useState(initialState);
  const [cache, setCache] = useState<Object>({});
  const {theme} = useTheme();
  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet(
    {
      icon: <DeleteSVG />,
      text: 'Are you sure you want to delete this menu?',
      buttonText: 'Delete',
      loading: state.loading,
      onButtonPress: async () => {
        if (state.selectedMenu) {
          setState(prev => ({...prev, loading: true}));
          await request(
            'DELETE',
            `${urls.auth.chef.menu.delete}/${state.selectedMenu}`,
          );
          BottomSheetRef.current?.dismiss();
          resetData();
          fetchFirstPage();
          setState(prev => ({...prev, loading: false}));
        }
      },
    },
    [state.selectedMenu, state.loading],
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
    <StyledPageView isScrollable={false} style={{paddingHorizontal: 5}}>
      <Header
        rightComponent={
          <SearchSVG
            color={theme.colors.black}
            onPress={() => navigation.navigate('chef_menu_search')}
          />
        }
      />
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
              style={{flex: 1, paddingTop: 10}}
              showsVerticalScrollIndicator={false}
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
                          tw="px-2"
                          onPress={() => {
                            navigation.navigate('chef_menu_update', item);
                          }}>
                          <EditSVG
                            height={30}
                            width={30}
                            color={theme.colors.black}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          tw="px-2"
                          onPress={() => {
                            const {id} = item;
                            if (id) {
                              setState(prev => ({
                                ...prev,
                                selectedMenu: id,
                              }));
                              BottomSheetRef.current?.present();
                            }
                          }}>
                          <TrashSVG color={theme.colors.black} />
                        </TouchableOpacity>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                );
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => {
                return menus.length === 0 ? (
                  <></>
                ) : (
                  <StyledView tw="p-2">
                    {endReached ? (
                      <StyledText>...</StyledText>
                    ) : loading ? (
                      <StyledButton loading twButton={'bg-transparent'} />
                    ) : null}
                  </StyledView>
                );
              }}
              ListEmptyComponent={() =>
                loading ? (
                  <StyledView tw="w-full flex-row" style={{gap: 10}}>
                    <Skeleton
                      style={{borderRadius: 8}}
                      height={90}
                      width={90}
                    />
                    <Skeleton height={90} style={{flex: 1}} />
                  </StyledView>
                ) : (
                  <></>
                )
              }
            />
          ) : null;
        }}
      />
      <BottomSheet />
    </StyledPageView>
  );
};

export default Menu;
