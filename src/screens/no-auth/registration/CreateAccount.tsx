import CameraSVG from '@/assets/icons/camera.svg';
import LockSVG from '@/assets/icons/custom/LockSVG';
import PhoneSVG from '@/assets/icons/custom/PhoneSVG';
import SmsSVG from '@/assets/icons/custom/SmsSVG';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import Divider from '@/components/Divider';
import OAuthButtonGroup from '@/components/OAuthButtonGroup';
import Regex from '@/constants/Regex';
import urls from '@/constants/urls';
import { openVerfication } from '@/screens/Verification';
import request from '@/services/api/request';
import useAuth, { UserDataI } from '@/store/useAuth';
import useCustomForm from '@/utils/useCustomForm';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import { createElement, useRef, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';

type CreateAccountProps = NativeStackScreenProps<
  RootStackParamList,
  'create_account'
>;

interface initialStateI {
  selectedTab: number;
  passwordVisible: boolean;
  rememberMe: boolean;
  loading: boolean;
  selectedImage: Asset | null;
  imageLoading: boolean;
}

const initialState: initialStateI = {
  selectedTab: 0,
  passwordVisible: false,
  rememberMe: false,
  loading: false,
  selectedImage: null,
  imageLoading: false,
};

const CreateAccount = ({navigation, route}: CreateAccountProps) => {
  const [state, setState] = useState(initialState);
  const {theme} = useTheme();
  console.log((state.selectedImage?.uri ?? '').replace('file://', ''));

  const {Form, form, defaultValues} = useCustomForm(
    {first_name: '', last_name: '', phone_number: '', email: '', password: ''},
    {
      first_name: {
        rules: {required: true},
        placeholder: 'First Name',
        inputProps: {
          autoComplete: 'name',
          leftIcon: createElement(FeatherIcon, {
            color: theme.colors.black,
            name: 'user',
            size: 24,
          }),
        },
      },
      last_name: {
        rules: {required: true},
        placeholder: 'Last Name',
        inputProps: {
          autoComplete: 'name',
          leftIcon: createElement(FeatherIcon, {
            color: theme.colors.black,
            name: 'user',
            size: 24,
          }),
        },
      },
      phone_number: {
        rules: {required: true},
        placeholder: 'Phone Number',
        inputProps: {
          autoComplete: 'cc-number',
          keyboardType: 'numeric',
          leftIcon: createElement(PhoneSVG, {
            color: theme.colors.black,
          }),
        },
      },
      email: {
        rules: {required: true},
        placeholder: 'Email Address',
        inputProps: {
          autoComplete: 'email',

          leftIcon: createElement(SmsSVG, {
            color: theme.colors.black,
          }),
        },
      },
      password: {
        rules: {required: true},
        placeholder: 'Password',
        inputProps: {
          autoComplete: 'current-password',
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
              <FeatherIcon
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
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const login = useAuth(state => state.login);
  const handleProfileImage = async (type: 'gallery' | 'camera' | 'reset') => {
    bottomSheetRef.current?.dismiss();
    setState(prev => ({...prev, imageLoading: true}));
    let result: ImagePickerResponse;
    if (type === 'reset') {
      setState(prev => ({
        ...prev,
        selectedImage: null,
        imageLoading: false,
      }));
      return;
    } else if (type === 'camera') {
      result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
      });
    } else {
      result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      });
    }

    if (result.assets && result.assets.length > 0)
      setState(prev => ({
        ...prev,
        selectedImage: result.assets ? result.assets[0] ?? null : null,
      }));

    setState(prev => ({...prev, imageLoading: false}));
  };
  const onSubmit = async (formData: typeof defaultValues) => {
    if (state.selectedTab === 0 && !Regex.email.test(formData.email ?? '')) {
      form.setError('email', {type: 'email'});
      return;
    }
    if (!Regex.password.test(formData.password ?? '')) {
      form.setError('password', {type: 'password'});
      return;
    }
    setState(prev => ({...prev, loading: true}));
    const {data, HttpStatusCode, status} = await request<UserDataI>(
      'POST',
      Config.USER_TYPE === 'chef'
        ? urls.no_auth.chef.registration
        : urls.no_auth.customer.registration,
      {},
      {
        ...formData,
        profile_photo: state.selectedImage ? state.selectedImage.base64 : null,
      },
    );
    if (HttpStatusCode.OK === status && data.success) {
      login(data.data);
      openVerfication(data.data, navigation);
    }
    setState(prev => ({...prev, loading: false}));
  };
  return (
    <StyledPageView
      header
      route={route}
      navigation={navigation}
      title="Create Account">
      <StyledView className="w-full flex-1 bg-transparent items-center justify-center">
        <StyledView
          tw="justify-center items-center"
          style={{
            backgroundColor: theme.colors.grey0,
            height: 120,
            width: 120,
            borderRadius: 60,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.colors.greyOutline,
          }}>
          {state.imageLoading ? (
            <StyledButton loading twButton="bg-transparent" />
          ) : state.selectedImage ? (
            <Image
              source={{uri: state.selectedImage.uri}}
              style={{height: 120, width: 120, borderRadius: 60}}
            />
          ) : (
            <FeatherIcon name="user" size={50} color={theme.colors.grey5} />
          )}

          <TouchableOpacity
            disabled={state.loading}
            style={{
              backgroundColor: theme.colors.yellow,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.colors.badgeOutline,
            }}
            onPress={() => {
              bottomSheetRef.current?.present();
            }}
            tw="p-1 absolute right-0 bottom-0">
            <CameraSVG color={theme.colors.secondary} height={30} width={30} />
          </TouchableOpacity>
        </StyledView>
        <Form loading={state.loading} />
        <StyledButton
          onPress={form.handleSubmit(onSubmit)}
          twContainer="w-full"
          loading={state.loading}
          loadingProps={{size: 24}}
          disabled={state.imageLoading}>
          Continue
        </StyledButton>
        <Divider heading="Or continue with" style={{marginVertical: 30}} />
        <OAuthButtonGroup
          mode="register"
          tw="flex-row bg-transparent"
          style={{gap: 10, marginBottom: 30}}
          loadingColor={theme.colors.black}
          appleLight={theme.mode === 'dark'}
          color={theme.colors.background}
        />
      </StyledView>
      <StyledView tw="flex-row" style={{gap: 5}}>
        <StyledText style={{color: theme.colors.grey5}} h4>
          Already have an account?
        </StyledText>
        <StyledText h4 onPress={() => navigation.replace('login')}>
          Sign In
        </StyledText>
      </StyledView>
      {Config.USER_TYPE === 'customer' && (
        <StyledText tw="p-2" style={{color: theme.colors.primary}} h4>
          Become a Chef
        </StyledText>
      )}
      <StyledBottomSheet
        bottomSheetRef={bottomSheetRef}
        index={0}
        snapPoints={state.selectedImage ? ['24%'] : ['16%']}
        enablePanDownToClose>
        <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
          {state.selectedImage ? (
            <>
              <TouchableOpacity
                onPress={() => handleProfileImage('reset')}
                tw="p-3">
                <StyledText h2>Remove Photo</StyledText>
              </TouchableOpacity>
              <Divider linear />
            </>
          ) : null}
          <TouchableOpacity
            onPress={() => handleProfileImage('camera')}
            tw="p-3">
            <StyledText h2>Take a Photo...</StyledText>
          </TouchableOpacity>

          <Divider linear />
          <TouchableOpacity
            onPress={() => handleProfileImage('gallery')}
            tw="p-3">
            <StyledText h2>Choose a Photo...</StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledBottomSheet>
    </StyledPageView>
  );
};

export default CreateAccount;
