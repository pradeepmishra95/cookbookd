import ListingSVG from '@/assets/icons/listing.svg';
import LocationSVG from '@/assets/icons/location_small.svg';
import MapViewSVG from '@/assets/icons/map_view.svg';
import SearchSVG from '@/assets/icons/search.svg';
import StarSVG from '@/assets/icons/star.svg';
import {StyledPageView, StyledText, StyledView} from '@/components';
import {SelectOptions} from '@/components/Select';
import TopMenuBar from '@/components/TopMenuBar';
import urls from '@/constants/urls';
import ChefCard from '@/screens/auth/customer/components/ChefCard';
import request from '@/services/api/request';
import useAddress from '@/store/useAddress';
import useData from '@/store/useData';
import {checkLocationPermission} from '@/utils/location';
import {ChefType} from '@/utils/types/customer';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Image, ListRenderItem, TouchableOpacity} from 'react-native';
import {AnimatedRegion, Callout, Marker} from 'react-native-maps';
import MapView, {AnimatedMapView} from 'react-native-maps/lib/MapView';
import Svg, {ClipPath, Defs, Image as ImageSVG, Path} from 'react-native-svg';
import FeatherIcon from 'react-native-vector-icons/Feather';

type TopRatedChefsType = NativeStackScreenProps<
  RootStackParamList,
  'customer_top_rated_chefs'
>;

interface initialStateI {
  cuisines: SelectOptions[];
  selectedCuisine: string;
  selectedTab: number;
  pageLoading: boolean;
}

const initialState: initialStateI = {
  cuisines: [],
  selectedCuisine: '0',
  selectedTab: 0,
  pageLoading: false,
};

const tabs = [
  {name: 'Listing', icon: MapViewSVG},
  {name: 'Map View', icon: ListingSVG},
];

const Defaults = {
  latitudeDelta: 0.0106,
  longitudeDelta: 0.006,
  imageSize: 50,
  calloutImageSize: 60,
};

const TopRatedChefs = ({route, navigation}: TopRatedChefsType) => {
  const [state, setState] = useState(initialState);
  const {theme} = useTheme();
  const {selectedAddress} = useAddress();
  const mapRef = useRef<MapView>(null);
  const {data, fetchFirstPage, fetchNextPage, loading, resetData, endReached} =
    usePaginatedRequest<ChefType>({
      requestParams: [
        'GET',
        urls.auth.customer.chef.get,
        {
          longitude: selectedAddress?.location_coordinates.longitude,
          latitude: selectedAddress?.location_coordinates.latitude,
        },
      ],
      initialState: [],
    });
  const {toggleFavorites} = useData();

  const [location] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: Defaults.latitudeDelta,
      longitudeDelta: Defaults.longitudeDelta,
    }),
  );

  const handleFavorite = useCallback(
    (id: number) => {
      toggleFavorites('chef', id);
      request('POST', urls.auth.customer.favorites.add, {}, {chef_id: id});
    },
    [data],
  );

  const renderItem: ListRenderItem<ChefType> = useCallback(({item, index}) => {
    return (
      <ChefCard
        {...item}
        showFavorite
        handleFavorite={() => handleFavorite(item.id)}
      />
    );
  }, []);

  const getPosition = useCallback(() => {
    Geolocation.getCurrentPosition(position => {
      console.log({position});

      mapRef.current?.animateToRegion({
        latitudeDelta: Defaults.latitudeDelta,
        longitudeDelta: Defaults.longitudeDelta,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  const getCurrentLocation = useCallback(async () => {
    if (!(await checkLocationPermission())) {
      Geolocation.requestAuthorization(
        getPosition,
        // TODO add not allowed alert
      );
      return;
    }
    getPosition();
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
    getCurrentLocation();
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
      title={'Top Rated Chefs'}
      isScrollable={false}
      rightComponent={
        <SearchSVG
          color={theme.colors.black}
          onPress={() => navigation.navigate('customer_top_rated_chefs_search')}
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
      <StyledView tw="flex-1 relative">
        <StyledView tw="absolute w-full h-full top-0 left-0">
          <AnimatedMapView
            style={{
              minWidth: '100%',
              minHeight: '100%',
              opacity: state.selectedTab === 1 ? 1 : 0,
            }}
            region={location as any}
            showsUserLocation
            onRegionChange={region => {
              location.setValue(region);
            }}
            ref={mapRef}>
            {data.map((item, index) => {
              const BORDER_RADIUS = 25;
              const IMAGE_SIZE = 40;
              const path = `M${BORDER_RADIUS} 0 
              L${IMAGE_SIZE - BORDER_RADIUS} 0 
              Q${IMAGE_SIZE} 0 ${IMAGE_SIZE} ${BORDER_RADIUS} 
              L${IMAGE_SIZE} ${IMAGE_SIZE - BORDER_RADIUS} 
              Q${IMAGE_SIZE} ${IMAGE_SIZE} ${
                IMAGE_SIZE - BORDER_RADIUS
              } ${IMAGE_SIZE} 
              L${BORDER_RADIUS} ${IMAGE_SIZE} 
              Q0 ${IMAGE_SIZE} 0 ${IMAGE_SIZE - BORDER_RADIUS} 
              L0 ${BORDER_RADIUS} 
              Q0 0 ${BORDER_RADIUS} 0 
              Z`;

              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: 28.7530963,
                    longitude: 77.497292,
                  }}>
                  <StyledView tw="items-center">
                    <Image
                      style={{
                        height: Defaults.imageSize,
                        width: Defaults.imageSize,
                        borderRadius: Defaults.imageSize,
                        borderWidth: 5,
                        borderColor: 'white',
                      }}
                      source={{uri: item.profile_image}}
                    />
                  </StyledView>
                  <Callout tooltip style={{flex: 1, position: 'relative'}}>
                    <StyledView
                      tw="flex-row items-center"
                      style={{
                        borderRadius: 50,
                        gap: 10,
                        paddingHorizontal: 10,
                        backgroundColor: theme.colors.background,
                      }}>
                      <Svg height={IMAGE_SIZE} width={IMAGE_SIZE}>
                        <Defs>
                          <ClipPath id="clipPath">
                            <Path d={path} />
                          </ClipPath>
                        </Defs>
                        <ImageSVG
                          href={{uri: item.profile_image}}
                          height={IMAGE_SIZE}
                          width={IMAGE_SIZE}
                          clipPath="url(#clipPath)"
                          preserveAspectRatio="xMidYMid slice"
                        />
                      </Svg>

                      <StyledView tw="justify-center m-2">
                        <StyledText h4>{item.fullname}</StyledText>
                        <StyledView tw="flex-row items-center" style={{gap: 5}}>
                          <StyledView
                            tw="flex-row items-center"
                            style={{gap: 3}}>
                            <StarSVG color="#FF8D07" width={10} height={10} />
                            <StyledText h5>{item.average_rating}</StyledText>
                            <StyledText
                              h5
                              style={{color: theme.colors.lightText}}>
                              ({item.total_ratings})
                            </StyledText>
                          </StyledView>
                          <StyledView
                            tw="p-1"
                            style={{
                              backgroundColor: theme.colors.lightText,
                              borderRadius: 40,
                            }}
                          />
                          <StyledView
                            tw="flex-row items-center"
                            style={{gap: 5}}>
                            <LocationSVG
                              color={'#727272'}
                              width={12}
                              height={12}
                            />
                            <StyledText h5>{'1.3mi'}</StyledText>
                          </StyledView>
                        </StyledView>
                      </StyledView>

                      <StyledView
                        style={{
                          borderColor: theme.colors.greyOutline,
                          borderWidth: 1,
                          borderRadius: 24,
                        }}
                        tw="p-2">
                        <FeatherIcon
                          name="message-square"
                          size={18}
                          color={theme.colors.primary}
                        />
                      </StyledView>
                      <StyledView
                        style={{
                          borderColor: theme.colors.greyOutline,
                          borderWidth: 1,
                          borderRadius: 24,
                        }}
                        tw="p-2">
                        <FeatherIcon
                          name="phone"
                          size={18}
                          color={theme.colors.green}
                        />
                      </StyledView>
                    </StyledView>
                  </Callout>
                </Marker>
              );
            })}
          </AnimatedMapView>
        </StyledView>
        {state.selectedTab === 0 ? (
          <FlatList
            tw="absolute w-full h-full top-0 left-0"
            key={'top_rated_chefs'}
            numColumns={2}
            data={data}
            keyExtractor={(item, index) => `${item.id}-${index}`}
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
        ) : null}
      </StyledView>

      <StyledView tw="absolute bottom-0 left-0 w-full flex-row my-2 justify-center">
        <StyledView
          className="flex-row m-3 p-1"
          style={{
            borderColor: theme.colors.greyOutline,
            borderWidth: 2,
            borderRadius: 25,
            backgroundColor: theme.colors.white,
          }}>
          {tabs.map((tab, i) => (
            <StyledView key={`tab-${i}`} tw="">
              <TouchableOpacity
                tw="items-center flex-row"
                activeOpacity={state.selectedTab === i ? 1 : 0.5}
                style={[
                  {
                    paddingHorizontal: 50,
                    paddingVertical: 10,
                    borderRadius: 25,
                    gap: 5,
                  },
                  state.selectedTab === i
                    ? {
                        backgroundColor: theme.colors.black,
                      }
                    : {},
                ]}
                onPress={() =>
                  state.selectedTab !== i &&
                  (() => {
                    // resetData();
                    setState(prev => ({...prev, selectedTab: i}));
                  })()
                }>
                {React.createElement(tab.icon, {
                  color:
                    state.selectedTab === i
                      ? theme.colors.white
                      : theme.colors.black,
                })}
                <StyledText
                  style={[
                    state.selectedTab === i
                      ? {
                          color: theme.colors.white,
                        }
                      : {},
                  ]}
                  h4>
                  {tab.name}
                </StyledText>
              </TouchableOpacity>
            </StyledView>
          ))}
        </StyledView>
      </StyledView>
    </StyledPageView>
  );
};

export default TopRatedChefs;
