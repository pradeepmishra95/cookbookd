import LockSVG from '@/assets/icons/custom/LockSVG';
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
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Feather';

type CreateNewPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  'create_new_password'
>;

interface initialStateI {
  newPasswordVisible: boolean;
  confirmPasswordVisible: boolean;
  loading: boolean;
}

const initialState: initialStateI = {
  newPasswordVisible: false,
  confirmPasswordVisible: false,
  loading: false,
};

const CreateNewPassword = ({navigation, route}: CreateNewPasswordProps) => {
  const [state, setState] = useState<initialStateI>(initialState);
  const {theme} = useTheme();

  const {Form, form, defaultValues} = useCustomForm(
    {
      new_password: '',
      confirm_password: '',
    },
    {
      new_password: {
        rules: {required: true},
        placeholder: 'New Password',
        inputProps: {
          disabled: state.loading,
          autoComplete: 'new-password',
          leftIcon: <LockSVG color={theme.colors.black} />,
          rightIcon: (
            <TouchableOpacity
              tw="h-full justify-center px-2"
              onPress={() =>
                setState(prev => ({
                  ...prev,
                  newPasswordVisible: !prev.newPasswordVisible,
                }))
              }>
              <Icon
                name={state.newPasswordVisible ? 'eye' : 'eye-off'}
                size={22}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          ),
          secureTextEntry: !state.newPasswordVisible,
        },
      },
      confirm_password: {
        rules: {required: true},
        placeholder: 'Confirm Password',
        inputProps: {
          disabled: state.loading,
          leftIcon: <LockSVG color={theme.colors.black} />,
          rightIcon: (
            <TouchableOpacity
              tw="h-full justify-center px-2"
              onPress={() =>
                setState(prev => ({
                  ...prev,
                  confirmPasswordVisible: !prev.confirmPasswordVisible,
                }))
              }>
              <Icon
                name={state.confirmPasswordVisible ? 'eye' : 'eye-off'}
                size={22}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          ),
          secureTextEntry: !state.confirmPasswordVisible,
        },
      },
    },
    [state],
  );

  const onSubmit = async (formData: typeof defaultValues) => {
    let {new_password, confirm_password} = formData;
    if (!Regex.password.test(formData.new_password ?? '')) {
      form.setError('new_password', {type: 'password'});
      return;
    }
    if (new_password !== confirm_password) {
      form.setError('confirm_password', {type: 'confirmPassword'});
      return;
    }
    console.log(route.params.token);
    setState(prev => ({...prev, loading: true}));
    const {data, status, HttpStatusCode} = await request(
      'PUT',
      Config.USER_TYPE === 'chef'
        ? urls.no_auth.chef.forgot_password.change_password
        : urls.no_auth.customer.forgot_password.change_password,
      {},
      {...formData, flag: 'forgot_password'},
      true,
      true,
      route.params.token,
    );
    console.log({...formData, flag: 'forgot_password'});
    setState(prev => ({...prev, loading: false}));
    if (status === HttpStatusCode.OK && data.success) {
      showToast(toastMessages.forgot_password.success);
      navigation.navigate('login');
    }
  };
  return (
    <StyledPageView
      header
      navigation={navigation}
      route={route}
      twScrollView="justify-start">
      <StyledText h1>{'Create New Password'}</StyledText>
      <StyledText
        h4
        tw="text-center mt-3 mb-5"
        h4Style={{color: theme.colors.lightText}}>
        Create your new Password
      </StyledText>
      <Form />
      <StyledButton
        title={'Submit'}
        loading={state.loading}
        loadingProps={{size: 24}}
        disabled={state.loading}
        twContainer="w-full"
        onPress={form.handleSubmit(onSubmit)}
      />
    </StyledPageView>
  );
};

export default CreateNewPassword;
