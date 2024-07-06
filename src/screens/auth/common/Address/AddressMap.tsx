import LocationSVG from '@/assets/icons/location_small.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import config from '@/constants/config';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {checkLocationPermission} from '@/utils/location';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import MapView, {
  Animated as AnimatedMapView,
  AnimatedRegion,
} from 'react-native-maps';
import {AddressType} from './AddressManagement';

type AddressMapPropsType = NativeStackScreenProps<
  RootStackParamList,
  'address_map'
>;

interface initialStateI {
  pageLoading: boolean;
  address: AddressType | null;
  addressLoading: boolean;
}

const getInitialState = (address?: AddressType): initialStateI => ({
  pageLoading: false,
  address: address ?? null,
  addressLoading: false,
});

const Defaults = {
  latitudeDelta: 0.0106,
  longitudeDelta: 0.006,
};

const AddressMap = ({navigation, route}: AddressMapPropsType) => {
  const [state, setState] = useState(getInitialState(route.params));
  const {theme} = useTheme();
  const mapRef = useRef<MapView>(null);
  const autoCompleteRef = useRef<GooglePlacesAutocompleteRef>(null);
  const [location] = useState(
    new AnimatedRegion({
      latitude: route.params?.location_coordinates.latitude ?? 0,
      longitude: route.params?.location_coordinates.longitude ?? 0,
      latitudeDelta: Defaults.latitudeDelta,
      longitudeDelta: Defaults.longitudeDelta,
    }),
  );

  const fetchAddress = useCallback(
    async ({latitude, longitude}: {latitude: number; longitude: number}) => {
      setState(prev => ({...prev, addressLoading: true}));
      const {data, status, HttpStatusCode} = await request<AddressType>(
        'POST',
        urls.auth.common.address.address_from_coordinates,
        {},
        {latitude, longitude},
      );
      if (status === HttpStatusCode.OK && data.success) {
        setState(prev => ({
          ...prev,
          address: {...data.data, id: prev.address?.id ?? -1},
        }));
      }
      setState(prev => ({...prev, addressLoading: false}));
    },
    [],
  );

  const getPosition = useCallback(() => {
    Geolocation.getCurrentPosition(position => {
      mapRef.current?.animateToRegion({
        latitudeDelta: Defaults.latitudeDelta,
        longitudeDelta: Defaults.longitudeDelta,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setState(prev => ({...prev, pageLoading: true}));
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
    console.log(route.params);

    if (typeof route.params?.id === 'undefined') getCurrentLocation();
  }, []);

  return (
    <StyledPageView
      header
      title={'Select Addresses'}
      navigation={navigation}
      isScrollable={false}
      route={route}>
      <StyledView tw="flex-1 overflow-hidden relative">
        <AnimatedMapView
          style={{minWidth: '100%', minHeight: '100%'}}
          region={location as any}
          showsUserLocation
          onRegionChange={region => {
            location.setValue(region);
          }}
          ref={mapRef}
          onRegionChangeComplete={region => {
            fetchAddress(region);
          }}
        />
        <StyledView
          tw="absolute w-full h-full items-center justify-center"
          style={{pointerEvents: 'none'}}>
          <LocationSVG color={'red'} width={40} height={40} />
        </StyledView>
        <GooglePlacesAutocomplete
          ref={autoCompleteRef}
          styles={{
            container: {
              position: 'absolute',
              width: '100%',
              top: 0,
              left: 0,
              padding: 10,
            },
            textInput: {
              backgroundColor: theme.colors.background,
              flex: 1,
              fontFamily: 'Manrope-Regular',
              fontSize: 14,
              fontWeight: '400',
              borderRadius: 8,
              paddingHorizontal: 10,
            },
            row: {
              backgroundColor: theme.colors.background,
              padding: 10,
              borderRadius: 8,
              marginVertical: 2,
            },
            listView: {paddingVertical: 2},
            description: {
              color: theme.colors.black,
              fontFamily: 'Manrope-Regular',
              fontSize: 14,
              fontWeight: '400',
            },
          }}
          placeholder="Search"
          isRowScrollable={false}
          enablePoweredByContainer={false}
          onPress={(data, details) => {
            mapRef.current?.animateToRegion({
              latitudeDelta: Defaults.latitudeDelta,
              longitudeDelta: Defaults.longitudeDelta,
              latitude: details?.geometry.location.lat ?? 0,
              longitude: details?.geometry.location.lng ?? 0,
            });
            autoCompleteRef.current?.setAddressText('');
          }}
          fetchDetails
          GooglePlacesDetailsQuery={{
            fields: 'formatted_address,name,geometry',
          }}
          suppressDefaultStyles
          query={{
            key: config.GOOGLE_MAP_KEY,
            language: 'en',
          }}
        />
      </StyledView>
      <StyledView tw="m-2">
        <StyledView tw="flex-row w-full items-center py-2" style={{gap: 5}}>
          <StyledView>
            <LocationSVG color={'red'} width={40} height={40} />
          </StyledView>
          <StyledView tw="flex-1 p-2" style={{gap: 5}}>
            {state.addressLoading ? (
              <>
                <Skeleton style={{width: '70%'}} height={30} />
                <Skeleton style={{width: '70%'}} height={20} />
              </>
            ) : (
              <>
                <StyledText h2>
                  {state.address?.apartment_street_area?.length ?? 0 > 30
                    ? `${state.address?.apartment_street_area?.slice(0, 30)}...`
                    : state.address?.apartment_street_area}
                </StyledText>
                <StyledText h3 h3Style={{color: theme.colors.lightText}}>
                  {state.address?.formatted_address ?? '- -'}
                </StyledText>
              </>
            )}
          </StyledView>
        </StyledView>
        <StyledButton
          disabled={!state.address}
          title={'Enter Complete Address'}
          onPress={() => {
            if (state.address)
              navigation.navigate('address_update', state.address);
          }}
        />
      </StyledView>
    </StyledPageView>
  );
};

export default AddressMap;
