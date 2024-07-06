import PhoneSVG from '@/assets/icons/custom/PhoneSVG';
import SmsSVG from '@/assets/icons/custom/SmsSVG';
import {StyledButton, StyledPageView, StyledText} from '@/components';
import Regex from '@/constants/Regex';
import toastMessages from '@/constants/toastMessages';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {showToast} from '@/utils/Toaster';
import useCustomForm from '@/utils/useCustomForm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {createElement, useState} from 'react';
import Config from 'react-native-config';

type ForgotPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  'forgot_password'
>;

interface initialStateI {
  loading: boolean;
}

const initialState: initialStateI = {
  loading: false,
};

const ForgotPassword = ({navigation, route}: ForgotPasswordProps) => {
  const {theme} = useTheme();
  const [state, setState] = useState(initialState);
  const {Form, form, defaultValues} = useCustomForm(
    {emailPhone: ''},
    {
      emailPhone: {
        rules: {required: true},
        placeholder: route.params.type === 'email' ? 'Email Address' : 'Phone',
        inputProps: {
          disabled: state.loading,
          autoComplete: route.params.type === 'email' ? 'email' : 'cc-number',
          keyboardType: route.params.type === 'email' ? 'default' : 'numeric',
          containerStyle: {marginTop: 25},
          leftIcon: createElement(
            route.params.type === 'email' ? SmsSVG : PhoneSVG,
            {
              color: theme.colors.black,
            },
          ),
        },
      },
    },
    [state],
  );

  const onSubmit = async (formData: typeof defaultValues) => {
    if (
      route.params.type === 'email' &&
      !Regex.email.test(formData.emailPhone ?? '')
    ) {
      form.setError('emailPhone', {type: 'email'});
      return;
    }
    setState(prev => ({...prev, loading: true}));
    const {data, HttpStatusCode, status} = await request(
      'POST',
      Config.USER_TYPE === 'chef'
        ? urls.no_auth.chef.forgot_password.send_otp
        : urls.no_auth.customer.forgot_password.send_otp,
      {},
      {
        [route.params.type === 'email' ? 'email' : 'phone_number']:
          formData.emailPhone,
      },
    );
    setState(prev => ({...prev, loading: false}));
    if (status === HttpStatusCode.OK && data.success) {
      showToast(toastMessages.otp.success);
      navigation.navigate('verification', {
        email:
          route.params.type === 'email'
            ? {data: formData.emailPhone ?? ''}
            : undefined,
        phone:
          route.params.type === 'phone'
            ? {data: formData.emailPhone ?? ''}
            : undefined,
        mode: 'forgot_password',
        navigateTo: ['create_new_password'],
      });
    }
  };
  return (
    <StyledPageView
      header
      navigation={navigation}
      route={route}
      twScrollView="justify-start">
      <StyledText h1>{'Forgot Password'}</StyledText>
      <StyledText
        h4
        tw="text-center mt-3"
        h4Style={{color: theme.colors.lightText}}>
        Enter your registered email address to forgot password
      </StyledText>
      <Form />
      <StyledButton
        title={'Continue'}
        loading={state.loading}
        loadingProps={{size: 24}}
        disabled={state.loading}
        twContainer="w-full"
        onPress={form.handleSubmit(onSubmit)}
      />
    </StyledPageView>
  );
};

export default ForgotPassword;
