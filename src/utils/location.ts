import urls from '@/constants/urls';
import {AddressType} from '@/screens/auth/common/Address/AddressManagement';
import request from '@/services/api/request';
import useAddress from '@/store/useAddress';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform} from 'react-native';

const checkLocationPermission = async (): Promise<boolean> => {
  try {
    if (
      Platform.OS === 'android' &&
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ))
    ) {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
};

const getCurrentAddressAtAppStart = async () => {
  const {setSelectedAddress, addresses, setAddressLoading, appendAddresses} =
    useAddress.getState();

  const handleNoLocation = () => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0]);
      setAddressLoading(false);
    }
  };

  const fetchAddress = async ({
    latitude,
    longitude,
  }: GeolocationResponse['coords']) => {
    const {data, status, HttpStatusCode} = await request<AddressType>(
      'POST',
      urls.auth.common.address.address_from_coordinates,
      {},
      {latitude, longitude},
    );
    if (status === HttpStatusCode.OK && data.success) {
      const address = {...data.data, address_name: 'Current Location', id: -1};
      setSelectedAddress(address);
      appendAddresses(address);
      setAddressLoading(false);
    } else {
      handleNoLocation();
    }
  };

  const getCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => fetchAddress(position.coords),
      _ => handleNoLocation(),
    );
  };

  if (!(await checkLocationPermission())) {
    Geolocation.requestAuthorization(
      () => {
        getCoordinates();
      },
      () => {
        handleNoLocation();
      },
      // TODO add not allowed alert
    );
    return;
  }
  getCoordinates();
};

export {checkLocationPermission, getCurrentAddressAtAppStart};
