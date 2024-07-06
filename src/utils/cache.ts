import config from '@/constants/config';
import urls from '@/constants/urls';
import {AddressType} from '@/screens/auth/common/Address/AddressManagement';
import request from '@/services/api/request';
import useAddress from '@/store/useAddress';
import useData from '@/store/useData';
import Config from 'react-native-config';
import {getCurrentAddressAtAppStart} from './location';

const checkURLToCache = (url: string) => {
  if (config.CACHED_URLS.includes(url)) return true;
  if (url.startsWith(urls.auth.common.constants.city)) return true;
  if (url.startsWith(urls.auth.common.constants.states)) return true;
  return false;
};

const cacheRequestsAtAppStart = async () => {
  config.APP_START_CACHED_URLS.forEach(args => {
    request(...args).catch(e => console.log(e));
  });
};

const cacheFavoritesAtAppStart = () => {
  (async () => {
    const {data, HttpStatusCode, status} = await request<Array<number>>(
      'GET',
      `${urls.auth.customer.favorites.get_ids}/chefs`,
    );
    if (status === HttpStatusCode.OK && data.success) {
      const {addFavorites} = useData.getState();
      data.data.forEach(id => addFavorites('chef', id));
    }
  })();

  (async () => {
    const {data, HttpStatusCode, status} = await request<Array<number>>(
      'GET',
      `${urls.auth.customer.favorites.get_ids}/menus`,
    );
    if (status === HttpStatusCode.OK && data.success) {
      const {addFavorites} = useData.getState();
      data.data.forEach(id => addFavorites('menu', id));
    }
  })();
};

const cacheAddressesAtAppStart = async () => {
  const {setAddresses, setAddressLoading} = useAddress.getState();
  setAddressLoading(true);
  const {data, status, HttpStatusCode} = await request<AddressType[]>(
    'GET',
    Config.USER_TYPE === 'chef'
      ? urls.auth.common.address.chef.get
      : urls.auth.common.address.customer.get,
  );
  if (status === HttpStatusCode.OK && data.success) {
    setAddresses(data.data);
  }
  getCurrentAddressAtAppStart();
};

export {
  cacheAddressesAtAppStart,
  cacheFavoritesAtAppStart,
  cacheRequestsAtAppStart,
  checkURLToCache,
};
