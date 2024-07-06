import CameraSVG from '@/assets/icons/camera.svg';
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
import baseTheme from '@/constants/theme';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useAuth, { UserDataI } from '@/store/useAuth';
import useCustomForm from '@/utils/useCustomForm';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, useTheme as useRNUITheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import mime from 'mime';
import React, { createElement, useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Image as RNCompressedImage } from 'react-native-compressor';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import FeatherIcon from 'react-native-vector-icons/Feather';


type EditProfilePropsType = NativeStackScreenProps<
  RootStackParamList,
  'customer_edit_profile'
>;

interface initialStateI {
  selectedImage: Asset | null;
  imageLoading: boolean;
  loading: boolean;
}

const initialState: initialStateI = {
  selectedImage: null,
  imageLoading: false,
  loading: false,
};

const EditProfile = ({navigation, route}: EditProfilePropsType) => {
  const {theme} = useRNUITheme();
  const userData = useAuth(state => state.userData);
  const login = useAuth(state => state.login);
  const [state, setState] = useState(initialState);
  const bottomSheetProfileRef = useRef<BottomSheetModal>(null);

  const animationProgress = useDerivedValue(() => {
    return theme.mode === 'dark' ? withTiming(1) : withTiming(0);
  }, [theme]);

  const animatedBackground = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      [
        baseTheme.lightColors?.background ?? '#FFF',
        baseTheme.darkColors?.background ?? '#000',
      ],
    );
    return {
      backgroundColor,
    };
  });

  const {Form, form, defaultValues} = useCustomForm(
    {first_name: '', last_name: '', phone_number: '', email: ''},
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
    },
    [state],
  );

  const handleImage = async (action: 'gallery' | 'camera' | 'reset') => {
    bottomSheetProfileRef.current?.dismiss();

    setState(prev => ({
      ...prev,
      imageLoading: true,
    }));

    let result: ImagePickerResponse;
    if (action === 'reset') {
      setState(prev => ({
        ...prev,
        selectedImage: null,
      }));
      return;
    } else if (action === 'camera') {
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

    if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      if (selectedAsset.uri) {
        console.log('Selected Asset:', selectedAsset);

        const compressedImage = await RNCompressedImage.compress(
          selectedAsset.uri,
          {
            compressionMethod: 'manual',
            maxWidth: 1000,
            quality: 0.8,
          }
        );

        console.log('Compressed Image:', compressedImage);

        setState((prev) => ({
          ...prev,
          selectedImage: {
            uri: compressedImage,
            fileName: compressedImage,
          },
        }));
      }
    }

    setState((prev) => ({
      ...prev,
      imageLoading: false,
    }));
  };

  const onSubmit = async (formData: typeof defaultValues) => {
    setState(prev => ({...prev, loading: true}));
    let form = new FormData();
    form.append('_method', 'put');
    if (
      state.selectedImage &&
      state.selectedImage.fileName !== 'prevCoverImage'
    ) {
      form.append('profile_image', {
        uri: state.selectedImage.uri,
        name: (state.selectedImage.uri ?? '').split('/').pop(),
        type: mime.getType(state.selectedImage.uri ?? ''),
      });
    }

    Object.keys(formData).forEach(key => {
      form.append(key, formData[key as keyof typeof defaultValues]);
    });

    const {data, status, HttpStatusCode} = await request<
      Omit<UserDataI, 'token'>
    >('POST', urls.auth.customer.profile.update, {}, form);
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({...prev, loading: false}));
      login({...data.data, token: userData?.token ?? ''});
      navigation.goBack();
    }
    setState(prev => ({...prev, loading: false}));
  };

  useEffect(() => {
    if (userData) {
      form.setValue('first_name', userData.first_name);
      form.setValue('last_name', userData.last_name);
      form.setValue('email', userData.email);
      form.setValue('phone_number', userData.phone_number);
      if (userData.profile_image && userData.profile_image !== '') {
        setState(prev => ({
          ...prev,
          selectedImage: {
            fileName: 'prevProfileImage',
            uri: userData.profile_image,
          },
          imageLoading: false,
        }));
      }
    }
  }, []);

  return (
    <StyledPageView
      header
      navigation={navigation}
      route={route}
      twScrollView={'justify-start'}
      title="Edit Profile">
      <Divider style={{opacity: 0.1}} />
      <StyledView
        tw="justify-center items-center my-8"
        style={[
          {
            height: 100,
            width: 100,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: '#FFFFFF',
          },
          animatedBackground,
        ]}>
        {state.imageLoading ? (
          <StyledButton loading twButton="bg-transparent" />
        ) : state.selectedImage ? (
          <Image
            source={{uri: state.selectedImage.uri}}
            style={{
              height: 100,
              width: 100,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: '#FFFFFF',
            }}
          />
        ) : (
          <FeatherIcon name="user" size={60} color={theme.colors.grey5} />
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={state.loading}
          style={{
            backgroundColor: theme.colors.yellow,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.colors.badgeOutline,
          }}
          onPress={() => {
            bottomSheetProfileRef.current?.present();
          }}
          tw="p-1 absolute right-0 bottom-0">
          <CameraSVG color={theme.colors.secondary} height={30} width={30} />
        </TouchableOpacity>
      </StyledView>
      <Form loading={state.loading} />

      <StyledButton
        loading={state.loading}
        onPress={form.handleSubmit(onSubmit)}
        twContainer="w-full mt-auto mb-3">
        Update
      </StyledButton>

      {/* Bottom sheets */}
      <StyledBottomSheet
        bottomSheetRef={bottomSheetProfileRef}
        index={0}
        snapPoints={state.selectedImage ? ['24%'] : ['16%']}
        enablePanDownToClose>
        <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
          {state.selectedImage ? (
            <>
              <TouchableOpacity onPress={() => handleImage('reset')} tw="p-3">
                <StyledText h2>Remove Photo</StyledText>
              </TouchableOpacity>
              <Divider linear />
            </>
          ) : null}
          <TouchableOpacity onPress={() => handleImage('camera')} tw="p-3">
            <StyledText h2>Take a Photo...</StyledText>
          </TouchableOpacity>

          <Divider linear />
          <TouchableOpacity onPress={() => handleImage('gallery')} tw="p-3">
            <StyledText h2>Choose a Photo...</StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledBottomSheet>
    </StyledPageView>
  );
};

export default EditProfile;
