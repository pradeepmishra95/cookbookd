import LockSVG from '@/assets/icons/custom/LockSVG';
import PhoneSVG from '@/assets/icons/custom/PhoneSVG';
import SmsSVG from '@/assets/icons/custom/SmsSVG';
import HorizontalLogoSVG from '@/assets/images/custom/HorizontalLogoSVG';
import TopSVG from '@/assets/images/splash/top.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import Checkbox from '@/components/Checkbox';
import Divider from '@/components/Divider';
import OAuthButtonGroup from '@/components/OAuthButtonGroup';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useAuth, {UserDataI} from '@/store/useAuth';
import useCustomForm from '@/utils/useCustomForm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {createElement, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {openVerfication} from '../Verification';

interface initialStateI {
  selectedTab: number;
  passwordVisible: boolean;
  rememberMe: boolean;
  loading: boolean;
}

const initialState: initialStateI = {
  selectedTab: 0,
  passwordVisible: false,
  rememberMe: false,
  loading: false,
};

type LoginProps = NativeStackScreenProps<RootStackParamList, 'login'>;

const Login = ({navigation}: LoginProps) => {
  const {theme} = useTheme();
  const [state, setState] = useState<initialStateI>(initialState);
  const insets = useSafeAreaInsets();
  const {Form, form, defaultValues} = useCustomForm(
    {emailPhone: '', password: ''},
    {
      emailPhone: {
        rules: {required: false},
        placeholder: state.selectedTab == 0 ? 'Email Address' : 'Phone',
        inputProps: {
          // autoComplete: state.selectedTab === 0 ? 'email' : 'cc-number',
          keyboardType: state.selectedTab === 0 ? 'default' : 'numeric',
          containerStyle: {marginTop: 25},
          leftIcon: createElement(state.selectedTab === 0 ? SmsSVG : PhoneSVG, {
            color: theme.colors.black,
          }),
        },
      },
      password: {
        rules: {required: false},
        placeholder: 'Password',
        inputProps: {
          // autoComplete: 'current-password',
          leftIcon: <LockSVG color={theme.colors.black} />,
          rightIcon: (
            <TouchableOpacity
              tw="h-full justify-center px-2"
              onPress={() =>
                setState(prev => ({
                  ...prev,
                  passwordVisible: !prev.passwordVisible,
                }))
              }>
              <Icon
                name={state.passwordVisible ? 'eye' : 'eye-off'}
                size={22}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          ),
          secureTextEntry: !state.passwordVisible,
        },
      },
    },
    [state],
  );
  const login = useAuth(state => state.login);
  const onSubmit = async (formData: typeof defaultValues) => {
    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (state.selectedTab === 0 && !emailReg.test(formData.emailPhone ?? '')) {
      form.setError('emailPhone', {type: 'email'});
      return;
    }
    setState(prev => ({...prev, loading: true}));
    const {data, HttpStatusCode, status} = await request<UserDataI>(
      'POST',
      Config.USER_TYPE === 'chef'
        ? urls.no_auth.chef.login
        : urls.no_auth.customer.login,
      {},
      {
        ...(state.selectedTab === 0
          ? {email: formData.emailPhone}
          : {phone_number: formData.emailPhone}),
        password: formData.password,
      },
    );
    if (HttpStatusCode.OK === status && data.success) {
      login(data.data);
      openVerfication(data.data, navigation);
    }
    setState(prev => ({...prev, loading: false}));
  };

  return (
    <StyledPageView noInsets style={{paddingBottom: insets.bottom}}>
      <TopSVG viewBox="0 0 216 152" className="absolute top-0 left-0" />

      <StyledView className="w-full flex-1 bg-transparent items-center justify-center">
        <StyledText h2>Welcome Back!</StyledText>
        <HorizontalLogoSVG />
        <StyledView
          className="flex-row m-3 p-1"
          style={{
            borderColor: theme.colors.greyOutline,
            borderWidth: 2,
            borderRadius: 25,
          }}>
          {['Email', 'Phone'].map((tab, i) => (
            <TouchableOpacity
              key={`tab-${i}`}
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
                  form.resetField('emailPhone');
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
          ))}
        </StyledView>
        <Form loading={state.loading} />
        <StyledView
          style={{marginBottom: 25}}
          className="flex-row justify-between items-center w-full">
          <Checkbox
            status={state.rememberMe}
            toggleStatus={() =>
              setState(prev => ({...prev, rememberMe: !prev.rememberMe}))
            }
            label="Remember Me"
          />
          <StyledText
            onPress={() =>
              navigation.navigate('forgot_password', {
                type: state.selectedTab === 0 ? 'email' : 'phone',
              })
            }
            h4
            style={{color: theme.colors.primary}}>
            Forgot Password
          </StyledText>
        </StyledView>
        <StyledButton
          title={'Login'}
          loading={state.loading}
          loadingProps={{size: 24}}
          disabled={state.loading}
          twContainer="w-full"
          onPress={form.handleSubmit(onSubmit)}
        />
        <Divider heading="Or continue with" style={{marginVertical: 30}} />
        <OAuthButtonGroup
          mode="login"
          tw="flex-row bg-transparent"
          loadingColor={theme.colors.black}
          style={{gap: 10}}
          color={theme.colors.background}
          appleLight={theme.mode === 'dark'}
        />
      </StyledView>

      <StyledView tw="flex-row" style={{gap: 5}}>
        <StyledText style={{color: theme.colors.grey5}} h4>
          Don't have an account?
        </StyledText>
        <StyledText h4 onPress={() => navigation.replace('create_account')}>
          Sign Up
        </StyledText>
      </StyledView>
    </StyledPageView>
  );
};

export default Login;
