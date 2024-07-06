import SmsSVG from '@/assets/icons/custom/SmsSVG';
import {StyledButton, StyledPageView, StyledView} from '@/components';
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

type CustomerSupportProps = NativeStackScreenProps<
  RootStackParamList,
  'support'
>;

interface initialStateI {
  loading: boolean;
}

const initialState: initialStateI = {
  loading: false,
};

const CustomerSupport = ({navigation, route}: CustomerSupportProps) => {
  const [state, setState] = useState<initialStateI>(initialState);
  const {theme} = useTheme();

  const {Form, form, defaultValues} = useCustomForm(
    {
      email: '',
      feedback: '',
    },
    {
      email: {
        rules: {required: true},
        placeholder: 'Email Address',
        inputProps: {
          autoComplete: 'email',
          leftIcon: React.createElement(SmsSVG, {
            color: theme.colors.black,
          }),
        },
      },
      feedback: {
        rules: {required: true},
        placeholder: 'Write Here',
        inputProps: {
          multiline: true,
          maxLength: 250,
          numberOfLines: 4,
          textAlignVertical: 'top',
        },
        showCount: true,
      },
    },
  );

  const onSubmit = async (formData: typeof defaultValues) => {
    if (!Regex.email.test(formData.email ?? '')) {
      form.setError('email', {type: 'emal'});
      return;
    }
    setState(prev => ({...prev, loading: true}));
    const {data, HttpStatusCode, status} = await request(
      'POST',
      urls.auth.common.support_center,
      {},
      formData,
    );
    if (status === HttpStatusCode.OK && data.success) {
      showToast(toastMessages.support_center.success);
      form.reset();
    }
    setState(prev => ({...prev, loading: false}));
  };

  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      header
      title="Support Center"
      twScrollView={'pt-5 pb-5'}>
      <StyledView tw="w-full flex-1 justify-start">
        <Form loading={state.loading} />
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

export default CustomerSupport;
