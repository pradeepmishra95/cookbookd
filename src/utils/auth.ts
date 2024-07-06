import storageKeys from '@/constants/storageKeys';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {UserDataI, useAuthI} from '@/store/useAuth';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

const checkStoredAuth = async (login: useAuthI['login']) => {
  try {
    const token = JSON.parse(
      (await EncryptedStorage.getItem(storageKeys.token)) ?? 'null',
    ) as string | null;

    const userData = JSON.parse(
      (await EncryptedStorage.getItem(storageKeys.user_data)) ?? 'null',
    ) as UserDataI | null;
    if (token) {
      const {data, HttpStatusCode, status} = await request<UserDataI>(
        'GET',
        Config.USER_TYPE === 'chef'
          ? urls.auth.chef.profile.get
          : urls.auth.customer.profile.get,
        {},
        {},
        true,
        true,
        true,
        token,
      );
      if (HttpStatusCode.OK === status && data.success) {
        login({...data.data, token});
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const syncAuthToStorage = async (
  type: 'token' | 'user_data',
  data: UserDataI | string,
) => {
  try {
    if (type == 'token')
      await EncryptedStorage.setItem(storageKeys.token, JSON.stringify(data));
    else if (type == 'user_data')
      await EncryptedStorage.setItem(
        storageKeys.user_data,
        JSON.stringify(data),
      );
  } catch (e) {
    console.log(e);
  }
};

const removeAuthFromStorage = async () => {
  for (let key in [storageKeys.token, storageKeys.user_data])
    await EncryptedStorage.removeItem(key);
};

export {checkStoredAuth, removeAuthFromStorage, syncAuthToStorage};
