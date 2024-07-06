import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import OTPTextInput from '@/components/OTPTextInput';
import toastMessages from '@/constants/toastMessages';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {UserDataI} from '@/store/useAuth';
import {showToast} from '@/utils/Toaster';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TextProps, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {RefObject, useEffect, useState} from 'react';
import Config from 'react-native-config';

type VerificationPropsType = NativeStackScreenProps<
  RootStackParamList,
  'verification'
>;

const OTP_SIZE = 6;

interface initialStateI {
  loading: boolean;
}

const initialState: initialStateI = {
  loading: false,
};

type RefType = {
  ref?: RefObject<OTPTextInput>;
  verified: boolean;
  showResend?: boolean;
  sendingOTP?: boolean;
};

export enum VerificationType {
  'email' = 'email',
  'phone' = 'phone',
}

type RefListType = {
  [key in VerificationType]?: RefType;
};

const Timer = ({
  onFinish,
  timeout,
  ...props
}: {onFinish: () => void; timeout?: number} & TextProps) => {
  const [time, setTime] = useState(timeout ?? 30);
  useEffect(() => {
    const clear = (timer: NodeJS.Timer) => timer && clearInterval(timer);
    let timer = setInterval(() => {
      setTime(prev => {
        if (prev === 0) {
          clear(timer);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clear(timer);
  }, []);
  return <StyledText {...props}>{time} sec</StyledText>;
};

export const openVerfication = (
  data: UserDataI,
  navigation: NativeStackScreenProps<
    RootStackParamList,
    keyof RootStackParamList
  >['navigation'],
) => {
  if (
    (!data.is_email_verified && data.email !== '') ||
    (!data.is_phone_verified && data.phone_number !== '')
  ) {
    navigation.navigate('verification', {
      email:
        !data.is_email_verified && data.email !== ''
          ? {title: 'Email Verification', data: data.email ?? ''}
          : undefined,
      phone:
        !data.is_phone_verified && data.phone_number !== ''
          ? {
              title: 'Mobile Number Verification',
              data: data.phone_number ?? '',
            }
          : undefined,
      backButton: false,
      navigateTo:
        Config.USER_TYPE === 'chef'
          ? data.step === 'chef_bottom_tab'
            ? [data.step, {screen: 'home'}]
            : data.step === 'chef_bank_details_update'
            ? [data.step, {showProgressFooter: true}]
            : [data.step]
          : ['enter_location'],
    });
  } else {
    if (Config.USER_TYPE === 'chef')
      if (data.step === 'chef_bottom_tab')
        navigation.navigate(data.step, {screen: 'home'});
      else if (data.step === 'chef_bank_details_update')
        navigation.navigate(data.step, {showProgressFooter: true});
      else navigation.navigate(data.step);
    else navigation.navigate('customer_bottom_tab', {screen: 'home'});
  }
};

const Verification = ({route, navigation}: VerificationPropsType) => {
  const initialRefList: RefListType = Object.keys(VerificationType).reduce(
    (prevValue, value) => ({
      ...prevValue,
      [value as VerificationType]: {
        ref: React.createRef(),
        verified: false,
        showResend: false,
        sendingOTP: false,
      },
    }),
    {},
  );
  const [state, setState] = useState<initialStateI>(initialState);
  const [refList, setRefList] = useState(initialRefList);

  const {theme} = useTheme();

  const handleVerify = async () => {
    setState(prev => ({...prev, loading: true}));
    for (let key in VerificationType) {
      if (
        typeof route.params[key as VerificationType] !== 'undefined' &&
        !refList[key as VerificationType]?.verified
      ) {
        const ref = refList[key as VerificationType]?.ref;
        if (ref) {
          if ((ref.current?.value.length ?? 0) < OTP_SIZE) {
            setState(prev => ({...prev, loading: false}));
            showToast(toastMessages.otp.incomplete);
            return;
          }

          if (route.params.mode === 'forgot_password') {
            const {data, HttpStatusCode, status} = await request<UserDataI>(
              'POST',
              Config.USER_TYPE === 'chef'
                ? urls.no_auth.chef.forgot_password.verify_otp
                : urls.no_auth.customer.forgot_password.verify_otp,
              {},
              {
                [key == 'email' ? 'email' : 'phone_number']:
                  route.params[key as VerificationType]?.data,
                otp: ref.current?.value,
              },
            );

            if (HttpStatusCode.OK === status && data?.success) {
              setRefList(prev => ({
                ...prev,
                [key as VerificationType]: {
                  ...prev[key as VerificationType],
                  verified: true,
                },
              }));
            } else {
              setState(prev => ({...prev, loading: false}));
              return;
            }
            setTimeout(() => {
              setState(prev => ({...prev, loading: false}));
              navigation.replace(route.params.navigateTo[0], {
                token: data.data.token,
              });
            }, 0);
            return;
          }

          const {data, HttpStatusCode, status} = await request<string>(
            'POST',
            Config.USER_TYPE === 'chef'
              ? urls.auth.chef.verification.verify_otp
              : urls.auth.customer.verification.verify_otp,
            {},
            {
              [key === 'email' ? 'email_otp' : 'phone_otp']: ref.current?.value,
            },
          );

          if (HttpStatusCode.OK === status && data?.success) {
            setRefList(prev => ({
              ...prev,
              [key as VerificationType]: {
                ...prev[key as VerificationType],
                verified: true,
              },
            }));
          } else {
            setState(prev => ({...prev, loading: false}));
            return;
          }
        }
      }
    }
    setTimeout(() => {
      setState(prev => ({...prev, loading: false}));
      navigation.replace(...route.params.navigateTo);
    }, 0);
  };

  const sendOTP = (type: VerificationType) => {
    (async () => {
      setRefList(prev => ({
        ...prev,
        [type]: {...prev[type], sendingOTP: true},
      }));
      setState(prev => ({...prev, loading: true}));
      if (route.params.mode === 'forgot_password') {
        var {data, HttpStatusCode, status} = await request<string>(
          'POST',
          Config.USER_TYPE === 'chef'
            ? urls.no_auth.chef.forgot_password.send_otp
            : urls.no_auth.customer.forgot_password.send_otp,
          {},
          {
            [type === 'email' ? 'email' : 'phone_number']:
              route.params[type as VerificationType]?.data,
          },
        );
      } else {
        var {data, HttpStatusCode, status} = await request<string>(
          'GET',
          Config.USER_TYPE === 'chef'
            ? urls.auth.chef.verification.send_otp
            : urls.auth.customer.verification.send_otp,
        );
      }
      setState(prev => ({...prev, loading: false}));
      if (HttpStatusCode.OK === status && data?.success) {
        showToast(toastMessages.otp.success);
      }
      setRefList(prev => ({
        ...prev,
        [type]: {...prev[type], sendingOTP: false, showResend: false},
      }));
    })();
  };

  useEffect(() => {
    if (route.params.mode !== 'forgot_password')
      for (let key in VerificationType) {
        if (typeof route.params[key as VerificationType] !== 'undefined') {
          sendOTP(key as VerificationType);
        }
      }
    navigation.addListener('beforeRemove', e => {
      if (
        !(route.params.backButton ?? true) &&
        e.data.action.type === 'GO_BACK'
      ) {
        e.preventDefault();
      }
    });
  }, []);

  return (
    <StyledPageView
      header={route.params.header ?? true}
      backButton={route.params.backButton ?? true}
      route={route}
      navigation={navigation}
      scrollViewProps={{keyboardShouldPersistTaps: 'handled'}}
      twScrollView="items-center justify-start pb-5">
      <StyledView tw="flex-1">
        {Object.keys(VerificationType).map((key, i) => {
          if (route.params[key as VerificationType] === undefined)
            return <React.Fragment key={i} />;
          return (
            <StyledView tw="w-full items-center mb-10" key={i}>
              <StyledText h1>
                {route.params[key as VerificationType]?.title ??
                  'Verification Code'}
              </StyledText>
              <StyledText
                h4
                tw="text-center mt-3"
                h4Style={{color: theme.colors.lightText}}>
                We sent the verification code on your registered{' '}
                {key === 'email' ? 'email address' : 'phone number'}{' '}
                <StyledText
                  h4
                  style={{
                    fontWeight: '700',
                    fontFamily: 'Manrope-Bold',
                    color: theme.colors.black,
                  }}>
                  {route.params[key as VerificationType]?.data}
                </StyledText>
              </StyledText>
              <OTPTextInput
                verified={refList[key as VerificationType]?.verified}
                size={OTP_SIZE}
                ref={refList[key as VerificationType]?.ref}
                style={{marginVertical: 30}}
              />
              {refList[key as VerificationType]?.sendingOTP ? (
                <StyledText h4>Sending OTP..</StyledText>
              ) : refList[key as VerificationType]?.showResend ? (
                <StyledText
                  h4
                  disabled={state.loading}
                  onPress={() => {
                    sendOTP(key as VerificationType);
                  }}>
                  Resend Code
                </StyledText>
              ) : (
                <StyledView tw="flex-row justify-center items-center">
                  <StyledText
                    h4
                    tw="text-center"
                    h4Style={{color: theme.colors.lightText}}>
                    Send again in{' '}
                  </StyledText>
                  <Timer
                    h4
                    onFinish={() => {
                      setTimeout(() => {
                        setRefList(prev => ({
                          ...prev,
                          [key as VerificationType]: {
                            ...prev[key as VerificationType],
                            showResend: true,
                          },
                        }));
                      }, 100);
                    }}
                  />
                </StyledView>
              )}
            </StyledView>
          );
        })}
      </StyledView>
      <StyledButton
        loading={state.loading}
        loadingProps={{size: 24}}
        twContainer={'w-full'}
        onPress={handleVerify}>
        Verify
      </StyledButton>
    </StyledPageView>
  );
};

export default Verification;
