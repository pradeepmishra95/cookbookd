import {PermissionsAndroid, Platform} from 'react-native';

const getStreamingPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
    if (
      result[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      result[PermissionsAndroid.PERMISSIONS.CAMERA] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }
  return Promise.resolve(true);
};

const checkStreamingPermission = async (): Promise<boolean> => {
  try {
    if (
      Platform.OS === 'android' &&
      (!(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      )) ||
        !(await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        )))
    ) {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
};

export {checkStreamingPermission, getStreamingPermission};
