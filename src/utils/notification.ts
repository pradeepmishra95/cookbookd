import storageKeys from '@/constants/storageKeys';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

const registerDeviceForNotification = async (
  isLoggedIn: boolean,
): Promise<() => void> => {
  if ((await checkNotificationPermission()) && isLoggedIn) {
    await checkFCMToken();
    const unsubscribe_foreground = messaging().onMessage(
      handleForegroundMessage,
    );
    const unsubscribe_token_change =
      messaging().onTokenRefresh(handleTokenChange);
    Promise.resolve(() => {
      unsubscribe_foreground();
      unsubscribe_token_change();
    });
  }
  return Promise.resolve(() => {});
};

const checkNotificationPermission = async (): Promise<boolean> => {
  const permission = await messaging().hasPermission();
  if (
    permission === AuthorizationStatus.NOT_DETERMINED ||
    permission === AuthorizationStatus.DENIED
  ) {
    const newPermission = await notifee.requestPermission();
    if (
      newPermission.authorizationStatus === AuthorizationStatus.DENIED ||
      newPermission.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
    ) {
      // TODO ADD TOAST
      return Promise.resolve(false);
    }
  }
  return Promise.resolve(true);
};

const checkFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging().isDeviceRegisteredForRemoteMessages)
      await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    await handleTokenChange(token);
    return Promise.resolve(token);
  } catch (e) {
    console.log(e);
    return Promise.resolve(null);
  }
};

const handleTokenChange = async (device_token: string) => {
  const device_stored_token = await AsyncStorage.getItem(
    storageKeys.device_token,
  );
  console.log({device_stored_token});

  if (device_token !== device_stored_token) {
    if (device_stored_token) await unregisterFCMToken(device_stored_token);
    if (await registerFCMToken(device_token))
      await syncFCMTokenToStorage(device_token);
  }
};

const registerFCMToken = async (device_token: string): Promise<boolean> => {
  const {data, status, HttpStatusCode} = await request(
    'POST',
    urls.auth.common.register_token,
    {},
    {device_token},
    true,
    true,
    false,
  );

  if (status === HttpStatusCode.OK && data.success) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

const syncFCMTokenToStorage = async (device_token: string) => {
  try {
    await AsyncStorage.setItem(storageKeys.device_token, device_token);
  } catch (e) {
    console.log(e);
  }
};

const unregisterFCMToken = async (device_token: string) => {};

const handleForegroundMessage = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  console.log('foreground >>', message);
};

const handleBackgroundMessage = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  console.log('background >>', message);
};

export {
  checkFCMToken,
  checkNotificationPermission,
  handleBackgroundMessage,
  handleForegroundMessage,
  handleTokenChange,
  registerDeviceForNotification,
  registerFCMToken,
  syncFCMTokenToStorage,
  unregisterFCMToken,
};
