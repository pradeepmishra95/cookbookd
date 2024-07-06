import AppleCircleSVG from '@/assets/icons/custom/AppleCircleSVG';
import FacebookCircleSVG from '@/assets/icons/custom/FacebookCircleSVG';
import GoogleCircleSVG from '@/assets/icons/custom/GoogleCircleSVG';
import {StyledView} from '@/components';
import toastMessages from '@/constants/toastMessages';
import urls from '@/constants/urls';
import {openVerfication} from '@/screens/Verification';
import request, {
  ResponseErrorType,
  ResponseI,
  formatError,
} from '@/services/api/request';
import useAuth, {UserDataI} from '@/store/useAuth';
import {showToast} from '@/utils/Toaster';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import {decode} from 'js-base64';
import {useState} from 'react';
import {TouchableOpacity, ViewProps} from 'react-native';
import Config from 'react-native-config';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

type OATH_PROVIDERS = 'google' | 'facebook' | 'apple';

interface initialStateI {
  loading: boolean;
  loadingAuth: OATH_PROVIDERS | null;
}
interface OauthResI {
  url: string;
}

const DEFAULT_BUTTON_SIZE = 50;

const initialState: initialStateI = {
  loading: false,
  loadingAuth: null,
};

const OAuthButtonGroup = (
  props: ViewProps & {
    mode: 'register' | 'login';
    size?: number;
    color?: string;
    appleLight?: boolean;
    loadingColor?: string;
  },
) => {
  const [state, setState] = useState(initialState);
  const login = useAuth(state => state.login);
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>
    >();

  const openLink = async (url: string) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(
          url,
          `cookbookd://${Config.USER_TYPE}/`,
        );
        if (result.type === 'success') {
          const data = JSON.parse(decode(result.url.split('data=')[1]));
          if (data.success) {
            login(data.data as UserDataI);
            openVerfication(data.data as UserDataI, navigation);
          } else {
            showToast({
              message: toastMessages.oauth.error.message,
              description: formatError(
                data as ResponseI<ResponseErrorType, false>,
              ),
              type: 'error',
            });
          }
        }
      }
    } catch (error) {
      console.log({type: 'InAppBrowser', error});
      showToast(toastMessages.oauth.error);
    }
  };
  const handleOath = async (driver: OATH_PROVIDERS) => {
    setState(prev => ({...prev, loading: true, loadingAuth: driver}));
    const {data, HttpStatusCode, status} = await request<OauthResI>(
      'POST',
      Config.USER_TYPE === 'chef'
        ? props.mode === 'login'
          ? urls.no_auth.chef.login
          : urls.no_auth.chef.registration
        : props.mode === 'login'
        ? urls.no_auth.customer.login
        : urls.no_auth.customer.registration,
      {},
      {
        driver,
      },
    );

    setState(prev => ({...prev, loading: false, loadingAuth: null}));
    if (status === HttpStatusCode.OK && data.success) {
      openLink(data.data.url);
    }
  };

  return (
    <StyledView {...props}>
      <TouchableOpacity
        disabled={state.loading}
        activeOpacity={0.5}
        onPress={() => handleOath('facebook')}>
        <FacebookCircleSVG
          loading={state.loadingAuth === 'facebook'}
          loadingColor={props.loadingColor}
          color={props.color ?? 'currentColor'}
          width={props.size ?? DEFAULT_BUTTON_SIZE}
          height={props.size ?? DEFAULT_BUTTON_SIZE}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={state.loading}
        activeOpacity={0.5}
        onPress={() => handleOath('google')}>
        <GoogleCircleSVG
          loading={state.loadingAuth === 'google'}
          loadingColor={props.loadingColor}
          color={props.color ?? 'currentColor'}
          width={props.size ?? DEFAULT_BUTTON_SIZE}
          height={props.size ?? DEFAULT_BUTTON_SIZE}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={state.loading}
        activeOpacity={0.5}
        onPress={() => handleOath('apple')}>
        <AppleCircleSVG
          loading={state.loadingAuth === 'apple'}
          loadingColor={props.loadingColor}
          light={props.appleLight}
          color={props.color ?? 'currentColor'}
          width={props.size ?? DEFAULT_BUTTON_SIZE}
          height={props.size ?? DEFAULT_BUTTON_SIZE}
        />
      </TouchableOpacity>
    </StyledView>
  );
};

export default OAuthButtonGroup;
