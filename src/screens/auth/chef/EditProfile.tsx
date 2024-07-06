
import CameraSVG from '@/assets/icons/camera.svg';
import PhoneSVG from '@/assets/icons/custom/PhoneSVG';
import SmsSVG from '@/assets/icons/custom/SmsSVG';
import GallerySVG from '@/assets/icons/gallery.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import Checkbox from '@/components/Checkbox';
import Divider from '@/components/Divider';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useCustomForm from '@/utils/useCustomForm';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, useTheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import mime from 'mime';
import React, { createElement, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Image as RNCompressedImage } from 'react-native-compressor';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AddressType } from '../common/Address/AddressManagement.js';
import { AvailabilityType } from './Availibility';

type EditProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'chef_edit_profile'
>;

interface initialStateI {
  imageLoading: {
    profile: boolean;
    cover: boolean;
  };
  selectedImage: {
    profile: Asset | null;
    cover: Asset | null;
  };
  loading: boolean;
  delivery: boolean;
  pickup: boolean;
  bookme: boolean;
}

const initialState: initialStateI = {
  imageLoading: {
    profile: false,
    cover: false,
  },
  selectedImage: {
    profile: null,
    cover: null,
  },
  loading: false,
  delivery: false,
  pickup: false,
  bookme: false,
};

type ServiceType = {bookme: boolean; delivery: boolean; pickup: boolean};

export type UserDetailsType = {
  first_name: string;
  last_name: string;
  average_rating: number;
  total_ratings: number;
  email: string;
  phone_number: string;
  followers: string;
  service_type: ServiceType;
  description: string;
  status: number;
  profile_image: string;
  cover_images: string;
};

export type ProfileData = {
  address: AddressType;
  is_followed: boolean;
  availibility: AvailabilityType;
  user_details: UserDetailsType;
};

const EditProfile = ({navigation, route}: EditProfileProps) => {
  const {theme} = useTheme();
  const bottomSheetProfileRef = useRef<BottomSheetModal>(null);
  const bottomSheetCoverRef = useRef<BottomSheetModal>(null);
  const [state, setState] = useState(initialState);
  const {width} = Dimensions.get('screen');
  const [previousProfileImage, setPreviousProfileImage] = useState<string>('');
  const [previousCoverImage, setPreviousCoverImage] = useState<string>('');

  // const userData = useAuth(state => state.userData);

  const {Form, form, defaultValues} = useCustomForm(
    {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      description: '',
    },
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
      description: {
        rules: {required: true},
        placeholder: 'Desciption',
        showCount: true,
        inputProps: {
          maxLength: 250,
          numberOfLines: 4,
          textAlignVertical: 'top',
          multiline: true,
        },
      },
    },
  );

  const onSubmit = async (formData: typeof defaultValues) => {
    setState(prev => ({...prev, loading: true}));
    let form = new FormData();
    form.append('_method', 'put');

    // Check if profile image is selected or use the previous image
    if (
      state.selectedImage.profile &&
      state.selectedImage.profile.fileName !== 'prevProfileImage'
    ) {
      form.append('profile_image', {
        uri: state.selectedImage.profile.uri,
        name: (state.selectedImage.profile.uri ?? '').split('/').pop(),
        type: mime.getType(state.selectedImage.profile.uri ?? ''),
      });
    } else {
      form.append('profile_image', {
        uri: previousProfileImage,
        name: (previousProfileImage ?? '').split('/').pop(),
        type: mime.getType(previousProfileImage ?? ''),
      });
    }

    // Check if cover image is selected or use the previous image
    if (
      state.selectedImage.cover &&
      state.selectedImage.cover.fileName !== 'prevCoverImage'
    ) {
      form.append('cover_image', {
        uri: state.selectedImage.cover.uri,
        name: (state.selectedImage.cover.uri ?? '').split('/').pop(),
        type: mime.getType(state.selectedImage.cover.uri ?? ''),
      });
    } else {
      form.append('cover_image', previousCoverImage);
      form.append('cover_image', {
        uri: previousCoverImage,
        name: (previousCoverImage ?? '').split('/').pop(),
        type: mime.getType(previousCoverImage ?? ''),
      });
    }

    form.append('service_type[delivery]', state.delivery);
    form.append('service_type[pickup]', state.pickup);
    form.append('service_type[bookme]', state.bookme);

    Object.keys(formData).forEach(key => {
      form.append(key, formData[key as keyof typeof defaultValues]);
    });

    const {data, status, HttpStatusCode} = await request<string>(
      'POST',
      urls.auth.chef.profile.update,
      {},
      form,
    );

    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({...prev, loading: false}));
      navigation.goBack();
    }

    setState(prev => ({...prev, loading: false}));
  };

  const handleImage = async (
    type: 'cover' | 'profile',
    action: 'gallery' | 'camera' | 'reset',
  ) => {
    let result: ImagePickerResponse;
  
    if (action === 'reset') {
      console.log('Resetting image...');
      setState((prev) => ({
        ...prev,
        selectedImage: {
          ...prev.selectedImage,
          [type]: null,
        },
        imageLoading: {
          ...prev.imageLoading,
          [type]: false,
        },
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
  
    console.log('ImagePicker Response:', result);
  
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
            ...prev.selectedImage,
            [type]: { uri: compressedImage, fileName: compressedImage },
          },
        }));
      }
    }
  
    setState((prev) => ({
      ...prev,
      imageLoading: {
        ...prev.imageLoading,
        [type]: false,
      },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({...prev, loading: true}));

      const {data, status, HttpStatusCode} = await request<ProfileData>(
        'GET',
        urls.auth.common.chef_profile,
      );

      if (status === HttpStatusCode.OK && data.success) {
        // Update the state with the fetched data
        const userDetails = data.data.user_details;

        form.setValue('first_name', userDetails.first_name);
        form.setValue('last_name', userDetails.last_name);
        form.setValue('phone_number', userDetails.phone_number);
        form.setValue('email', userDetails.email);
        form.setValue('description', userDetails.description);

        // from database we are recieving string values for delivery,pickup and bookme ("true", "false") and because of that the checkbox is not display accurate data and also after converting thm to boolean and sending them to databse it again converts them to string only so thats why ==="true" is done below
        setState(prev => ({
          ...prev,
          delivery: userDetails.service_type.delivery === 'true',
          bookme: userDetails.service_type.bookme === 'true',
          pickup: userDetails.service_type.pickup === 'true',
          selectedImage: {
            profile: {
              uri: userDetails.profile_image,
              fileName: 'prevProfileImage',
            },
            cover: {uri: userDetails.cover_images, fileName: 'prevCoverImage'},
          },
          loading: false,
        }));

        setPreviousProfileImage(userDetails.profile_image);
        setPreviousCoverImage(userDetails.cover_images);
      } else {
        setState(prev => ({...prev, loading: false}));
      }
    };

    fetchData();
  }, []);

  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      header
      title="Edit Profile"
      twScrollView={'justify-start pt-5'}>
      {state.loading ? (
        <StyledView tw="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </StyledView>
      ) : (
        <>
          <StyledView tw="w-full">
            <StyledView tw="w-full flex-row mb-4" style={{gap: 10}}>
              <StyledView
                tw="justify-center flex-1 items-center"
                style={{
                  backgroundColor: theme.colors.grey0,
                  height: 130,
                  borderRadius: 15,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: theme.colors.greyOutline,
                }}>
                {state.imageLoading.profile ? (
                  <StyledButton loading twButton="bg-transparent" />
                ) : state.selectedImage.profile ? (
                  <StyledView
                    tw="justify-center w-full items-center"
                    style={{
                      height: 130,
                      borderRadius: 15,
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={{uri: state.selectedImage.profile.uri}}
                      style={{height: 130, width: width / 3, borderRadius: 15}}
                    />
                  </StyledView>
                ) : (
                  <>
                    <FeatherIcon
                      name="user"
                      size={35}
                      color={theme.colors.grey5}
                    />
                    <StyledText
                      h4
                      tw="mt-1"
                      style={{color: theme.colors.grey5}}>
                      Profile Image
                    </StyledText>
                  </>
                )}

                <TouchableOpacity
                  disabled={state.loading}
                  style={{
                    backgroundColor: theme.colors.yellow,
                    borderRadius: 20,
                    borderWidth: 1,
                    zIndex: 500,
                    borderColor: theme.colors.badgeOutline,
                  }}
                  onPress={() => {
                    bottomSheetProfileRef.current?.present();
                  }}
                  tw="p-1 absolute bottom-[-15%]">
                  <CameraSVG
                    color={theme.colors.secondary}
                    height={30}
                    width={30}
                  />
                </TouchableOpacity>
              </StyledView>

              <StyledView
                tw="justify-center items-center flex-[2]"
                style={{
                  backgroundColor: theme.colors.grey0,
                  height: 130,
                  borderRadius: 15,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: theme.colors.greyOutline,
                }}>
                {state.imageLoading.cover ? (
                  <StyledButton loading twButton="bg-transparent" />
                ) : state.selectedImage.cover ? (
                  <StyledView
                    tw="justify-center w-full items-center"
                    style={{
                      height: 130,
                      borderRadius: 15,
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={{uri: state.selectedImage.cover.uri}}
                      style={{
                        height: 130,
                        width: (width * 2) / 3,
                        borderRadius: 15,
                      }}
                    />
                  </StyledView>
                ) : (
                  <>
                    <GallerySVG
                      height={35}
                      width={35}
                      color={theme.colors.grey5}
                    />
                    <StyledText
                      h4
                      tw="mt-1"
                      style={{color: theme.colors.grey5}}>
                      Cover Photo
                    </StyledText>
                  </>
                )}

                <TouchableOpacity
                  disabled={state.loading}
                  style={{
                    backgroundColor: theme.colors.yellow,
                    borderRadius: 20,
                    borderWidth: 1,
                    zIndex: 500,
                    borderColor: theme.colors.badgeOutline,
                  }}
                  onPress={() => {
                    bottomSheetCoverRef.current?.present();
                  }}
                  tw="p-1 absolute bottom-[-15%]">
                  <CameraSVG
                    color={theme.colors.secondary}
                    height={30}
                    width={30}
                  />
                </TouchableOpacity>
              </StyledView>
            </StyledView>

            <StyledView tw="w-full mb-4">
              <StyledText h2 tw="mb-1">
                Service Type
              </StyledText>
              <StyledView tw="flex-row my-1" style={{gap: 8}}>
                <Checkbox
                  status={state.delivery}
                  toggleStatus={() =>
                    setState(prev => ({...prev, delivery: !prev.delivery}))
                  }
                  label="Delivery"
                />
                <Checkbox
                  status={state.pickup}
                  toggleStatus={() =>
                    setState(prev => ({...prev, pickup: !prev.pickup}))
                  }
                  label="Pick Up"
                />
                <Checkbox
                  status={state.bookme}
                  toggleStatus={() =>
                    setState(prev => ({...prev, bookme: !prev.bookme}))
                  }
                  label="Book Me"
                />
              </StyledView>
            </StyledView>

            <Form loading={state.loading} />
          </StyledView>

          <StyledButton
            onPress={form.handleSubmit(onSubmit)}
            twContainer="w-full"
            loading={state.loading}
            loadingProps={{size: 24}}
            disabled={state.imageLoading.cover || state.imageLoading.profile}>
            Update
          </StyledButton>
        </>
      )}
     
      <StyledBottomSheet
        bottomSheetRef={bottomSheetProfileRef}
        index={0}
        snapPoints={state.selectedImage.profile ? ['24%'] : ['16%']}
        enablePanDownToClose>
        <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
          {state.selectedImage.profile ? (
            <>
              <TouchableOpacity
                onPress={() => handleImage('profile', 'reset')}
                tw="p-3">
                <StyledText h2>Remove Photo</StyledText>
              </TouchableOpacity>
              <Divider linear />
            </>
          ) : null}
          <TouchableOpacity
            onPress={() => handleImage('profile', 'camera')}
            tw="p-3">
            <StyledText h2>Take a Photo...</StyledText>
          </TouchableOpacity>

          <Divider linear />
          <TouchableOpacity
            onPress={() => handleImage('profile', 'gallery')}
            tw="p-3">
            <StyledText h2>Choose a Photo...</StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledBottomSheet>
      <StyledBottomSheet
        bottomSheetRef={bottomSheetCoverRef}
        index={0}
        snapPoints={state.selectedImage.cover ? ['24%'] : ['16%']}
        enablePanDownToClose>
        <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
          {state.selectedImage.cover ? (
            <>
              <TouchableOpacity
                onPress={() => handleImage('cover', 'reset')}
                tw="p-3">
                <StyledText h2>Remove Photo</StyledText>
              </TouchableOpacity>
              <Divider linear />
            </>
          ) : null}
          <TouchableOpacity
            onPress={() => handleImage('cover', 'camera')}
            tw="p-3">
            <StyledText h2>Take a Photo...</StyledText>
          </TouchableOpacity>

          <Divider linear />
          <TouchableOpacity
            onPress={() => handleImage('cover', 'gallery')}
            tw="p-3">
            <StyledText h2>Choose a Photo...</StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledBottomSheet>
    </StyledPageView>
  );
};

export default EditProfile;
