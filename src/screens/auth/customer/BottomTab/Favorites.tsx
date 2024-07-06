import {StyledPageView, StyledText, StyledView} from '@/components';
import {Header} from '@/components/Header';
import urls from '@/constants/urls';
import {CustomerBottomTabParamListType} from '@/routes/auth/customer/types';
import ChefCard from '@/screens/auth/customer/components/ChefCard';
import request from '@/services/api/request';
import useData, {FavoriteType} from '@/store/useData';
import {ChefType, FoodType} from '@/utils/types/customer';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useState} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FoodCard from '../components/FoodCard';

type FavoritesPropsType = CompositeScreenProps<
  BottomTabScreenProps<CustomerBottomTabParamListType, 'favorites'>,
  NativeStackScreenProps<RootStackParamList>
>;

type FavoritesCommonType<T> = {
  type: T;
};

type FavoritesFoodType = FoodType & FavoritesCommonType<'menus'>;

type FavoritesChefType = ChefType & FavoritesCommonType<'chefs'>;

type FavoritesType = FavoritesChefType | FavoritesFoodType;

interface initialStateI {
  selectedTab: number;
}

const initialState: initialStateI = {
  selectedTab: 0,
};

const Favorites = ({navigation, route}: FavoritesPropsType) => {
  const [state, setState] = useState(initialState);
  const {theme} = useTheme();
  const {data, fetchFirstPage, fetchNextPage, resetData, loading, setData} =
    usePaginatedRequest<FavoritesType>({
      requestParams: [
        'GET',
        `${urls.auth.customer.favorites.get}/${
          state.selectedTab === 0 ? 'menus' : 'chefs'
        }`,
      ],
      initialState: [],
    });
  const {toggleFavorites} = useData();

  const handleFavorite = useCallback(
    (type: FavoriteType, index: number, id: number) => {
      toggleFavorites(type, id);
      request(
        'POST',
        urls.auth.customer.favorites.add,
        {},
        {[type === 'chef' ? 'chef_id' : 'menu_id']: id},
      );
      data.splice(index, 1);
      console.log(data);

      setData([...data]);
    },
    [data],
  );

  const renderItem: ListRenderItem<FavoritesType> = useCallback(
    ({item, index}) => {
      console.log(item.type);

      switch (item.type) {
        case 'chefs':
          return (
            <ChefCard
              {...item}
              showFavorite
              handleFavorite={() => handleFavorite('chef', index, item.id)}
            />
          );
        case 'menus':
          return (
            <FoodCard
              {...item}
              showFavorite
              handleFavorite={() => handleFavorite('menu', index, item.id)}
            />
          );
        default:
          return <></>;
      }
    },
    [state.selectedTab],
  );
  useEffect(() => {
    resetData();
    fetchFirstPage();
  }, [state.selectedTab]);

  return (
    <StyledPageView
      isScrollable={false}
      style={{paddingHorizontal: 5}}
      twScrollView={'justify-start'}>
      <Header />
      <StyledView
        className="flex-row m-3 p-1"
        style={{
          borderColor: theme.colors.greyOutline,
          borderWidth: 2,
          borderRadius: 25,
        }}>
        {['Food', 'Chef'].map((tab, i) => (
          <StyledView key={`tab-${i}`} tw="flex-1">
            <TouchableOpacity
              tw="w-full items-center"
              activeOpacity={state.selectedTab === i ? 1 : 0.5}
              style={[
                {
                  paddingHorizontal: 50,
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
                {tab}
              </StyledText>
            </TouchableOpacity>
          </StyledView>
        ))}
      </StyledView>
      <StyledView tw="flex-1">
        <FlatList
          data={data}
          refreshing={false}
          onRefresh={() => {
            resetData();
            fetchFirstPage();
          }}
          numColumns={2}
          renderItem={renderItem}
          onEndReached={() => {
            fetchNextPage();
          }}
          ListEmptyComponent={() =>
            loading ? (
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
              <></>
            )
          }
        />
      </StyledView>
    </StyledPageView>
  );
};

export default Favorites;
