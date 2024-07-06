import LockSVG from '@/assets/icons/custom/LockSVG';
import {StyledButton, StyledPageView, StyledView} from '@/components';
import Regex from '@/constants/Regex';
import toastMessages from '@/constants/toastMessages';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useAuth from '@/store/useAuth';
import {showToast} from '@/utils/Toaster';
import useCustomForm from '@/utils/useCustomForm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Feather';

type ChangePasswordProps = NativeStackScreenProps<
  RootStackParamList,
  'change_password'
>;

interface initialStateI {
  oldPasswordVisible: boolean;
  newPasswordVisible: boolean;
  confirmPasswordVisible: boolean;
  loading: boolean;
}

const initialState: initialStateI = {
  oldPasswordVisible: false,
  newPasswordVisible: false,
  confirmPasswordVisible: false,
  loading: false,
};

const ChangePassword = ({navigation, route}: ChangePasswordProps) => {
  const [state, setState] = useState<initialStateI>(initialState);
  const {theme} = useTheme();
  const userData = useAuth(state => state.userData);
  const login = useAuth(state => state.login);

  const {Form, form, defaultValues} = useCustomForm(
    {
      ...(userData?.is_password ? {old_password: ''} : {}),
      new_password: '',
      confirm_password: '',
    },
    {
      ...(userData?.is_password
        ? {
            old_password: {
              rules: {required: true},
              placeholder: 'Old Password',
              inputProps: {
                disabled: state.loading,
                autoComplete: 'password',
                leftIcon: <LockSVG color={theme.colors.black} />,
                rightIcon: (
                  <TouchableOpacity
                    tw="h-full justify-center px-2"
                    disabled={state.loading}
                    onPress={() =>
                      setState(prev => ({
                        ...prev,
                        oldPasswordVisible: !prev.oldPasswordVisible,
                      }))
                    }>
                    <Icon
                      name={state.oldPasswordVisible ? 'eye' : 'eye-off'}
                      size={22}
                      color={theme.colors.black}
                    />
                  </TouchableOpacity>
                ),
                secureTextEntry: !state.oldPasswordVisible,
              },
            },
          }
        : {}),
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
              disabled={state.loading}
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
              disabled={state.loading}
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
    if (formData.new_password !== formData.confirm_password) {
      form.setError('confirm_password', {type: 'confirmPassword'});
      return;
    }
    if (!Regex.password.test(formData.new_password ?? '')) {
      form.setError('new_password', {type: 'password'});
      return;
    }
    setState(prev => ({...prev, loading: true}));
    const {data, status, HttpStatusCode} = await request(
      'PUT',
      Config.USER_TYPE === 'chef'
        ? urls.no_auth.chef.forgot_password.change_password
        : urls.no_auth.customer.forgot_password.change_password,
      {},
      {
        ...formData,
        flag: userData?.is_password ? 'change_password' : 'forgot_password',
      },
    );
    if (status === HttpStatusCode.OK && data.success) {
      showToast(
        userData?.is_password
          ? toastMessages.change_password.success
          : toastMessages.add_password.success,
      );
      if (userData && !userData?.is_password) {
        login({...userData, is_password: true});
      }
      navigation.goBack();
    }
    setState(prev => ({...prev, loading: false}));
  };

  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      header
      title={userData?.is_password ? 'Change Password' : 'Add Password'}
      twScrollView={'pt-5 pb-5'}>
      <StyledView tw="w-full flex-1 justify-start">
        <Form />
        <StyledButton
          title={'Submit'}
          loading={state.loading}
          loadingProps={{size: 24}}
          disabled={state.loading}
          twContainer="w-full absolute bottom-0"
          onPress={form.handleSubmit(onSubmit)}
        />
      </StyledView>
    </StyledPageView>
  );
};

export default ChangePassword;
