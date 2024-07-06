import CameraSVG from '@/assets/icons/camera.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import Divider from '@/components/Divider';
import toastMessages from '@/constants/toastMessages';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import { showToast } from '@/utils/Toaster';
import useCustomForm from '@/utils/useCustomForm';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import mime from 'mime';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image as RNImage, TouchableOpacity } from 'react-native';
import { Image, Video } from 'react-native-compressor';
import Config from 'react-native-config';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';

type PostUpdatePropsType = NativeStackScreenProps<
  RootStackParamList,
  'chef_post_update'
>;

interface initialStateI {
  images: Asset[];
  imageLoading: boolean;
  loading: boolean;
  pageLoading: boolean;
}

const initialState: initialStateI = {
  images: [],
  imageLoading: false,
  pageLoading: true,
  loading: false,
};

const PostUpdate = ({navigation, route}: PostUpdatePropsType) => {
  const {theme} = useTheme();
  const [state, setState] = useState<initialStateI>(initialState);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const isUpdating = useMemo(
    () => typeof route.params?.id !== 'undefined',
    [route.params],
  );

  const {form, Form, defaultValues} = useCustomForm(
    {description: ''},
    {description: {placeholder: 'Description', rules: {required: true}}},
  );

  const handleMedia = async (
    type: 'gallery' | 'camera',
    mediaType: 'mixed'
  ) => {
    bottomSheetRef.current?.dismiss();
    setState((prev) => ({ ...prev, imageLoading: true }));
    let result: ImagePickerResponse;
  
    try {
      if (type === 'camera') {
        result = await launchCamera({
          mediaType: 'mixed', // Always set to 'mixed'
        });
      } else {
        result = await launchImageLibrary({
          mediaType: 'mixed', // Always set to 'mixed'
        });
      }
  
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
  
        if (asset.uri) {
          const fileName = asset.fileName ?? '';
          const fileExtension = fileName.split('.').pop()?.toLowerCase();
          console.log('File Extension:', fileExtension);

          if (fileExtension === 'mp4') {
            // Video compression
            try {
              console.log('Video Compression Started...');
              const compressedVideo = await Video.compress(asset.uri, {
                compressionMethod: 'manual',
              });
              console.log('Video Compression Completed:', compressedVideo);
              setState((prev) => ({
                ...prev,
                images: [...prev.images, { ...asset, uri: compressedVideo }],
              }));
            } catch (videoCompressionError) {
              console.error('Error during video compression:', videoCompressionError);
            }
          } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
            // Image compression
            try {
              const compressedImage = await Image.compress(asset.uri, {
                compressionMethod: 'manual',
                maxWidth: 1000,
                quality: 0.8,
              });
              console.log('Image compression completed.--------------------------->');
              setState((prev) => ({
                ...prev,
                images: [...prev.images, { ...asset, uri: compressedImage }],
              }));
            } catch (imageCompressionError) {
              console.error('Error during image compression:', imageCompressionError);
            }
          }
        }
      }
  
      setState((prev) => ({ ...prev, imageLoading: false }));
    } catch (mediaError) {
      console.error('Error during media selection:', mediaError);
      setState((prev) => ({ ...prev, imageLoading: false }));
    }
  };
  
  const onSubmit = async (formData: typeof defaultValues) => {
    if (state.images.length === 0) {
      showToast(toastMessages.images_required.error);
      return;
    }
    setState(prev => ({...prev, loading: true}));
    const form = new FormData();

    if (isUpdating) {
      form.append('_method', 'put');
    }

    let oldImageCount = 0;
    let newImageCount = 0;
    state.images.forEach(image => {
      if (image.fileName?.startsWith('prevMedia-')) {
        form.append(
          `old_media[${oldImageCount}]`,
          image.fileName.split('prevMedia-').pop(),
        );
        oldImageCount++;
      } else {
        form.append(`media[${newImageCount}]`, {
          uri: image.uri,
          name: (image.uri ?? '').split('/').pop(),
          type: mime.getType(image.uri ?? ''),
        });
        newImageCount++;
      }
    });
    Object.keys(formData).forEach(key => {
      form.append(key, formData[key as keyof typeof defaultValues]);
    });

    const {data, status, HttpStatusCode} = await request(
      'POST',
      isUpdating
        ? `${urls.auth.chef.posts.update}/${route.params?.id}`
        : urls.auth.chef.posts.add,
      {},
      form,
    );
    if (status === HttpStatusCode.OK && data.success) {
      if (Config.USER_TYPE === 'chef') {
        const lastRoute = navigation.getState().routes;
        console.log(lastRoute[0]);
        if (
          lastRoute.length > 1 &&
          lastRoute[0].name === 'chef_bottom_tab' &&
          lastRoute[0].params?.screen === 'home'
        ) {
          navigation.navigate('chef_bottom_tab', {
            screen: 'home',
            params: {refresh: true},
          });
          return;
        }
      }
      navigation.goBack();
    }
    setState(prev => ({...prev, loading: false}));
  };

  useEffect(() => {
    if (isUpdating) {
      form.setValue('description', route.params?.description ?? '');
      setState(prev => ({
        ...prev,
        images:
          route.params?.posts_media.map(({id, path, thumbnail, is_video}) => ({
            uri: is_video ? thumbnail : path,
            fileName: `prevMedia-${id}`,
          })) ?? [],
      }));
    }
    setState(prev => ({...prev, pageLoading: false}));
  }, []);

  return (
    <StyledPageView
      header
      route={route}
      navigation={navigation}
      loading={state.pageLoading}
      title={isUpdating ? 'Update Post' : 'Create Post'}
      twScrollView={'justify-start'}>
      <StyledView tw="flex-1 w-full">
        <Form loading={state.loading} />
        <StyledView tw="flex-row mt-3">
          <FlatList
            horizontal
            data={state.images}
            ItemSeparatorComponent={() => <StyledView tw="m-1" />}
            ListHeaderComponent={() => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => bottomSheetRef.current?.present()}
                tw="justify-center items-center mr-2"
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 8,
                  backgroundColor: theme.colors.grey0,
                  gap: 5,
                }}>
                {state.imageLoading ? (
                  <StyledButton loading twButton="bg-transparent" />
                ) : (
                  <>
                    <StyledView
                      tw="rounded-full p-2"
                      style={{backgroundColor: theme.colors.greyOutline}}>
                      <CameraSVG
                        color={theme.colors.black}
                        height={30}
                        width={30}
                      />
                    </StyledView>
                    <StyledText h5>Add Photo/Video</StyledText>
                  </>
                )}
              </TouchableOpacity>
            )}
            renderItem={({item, index}) => (
              <StyledView>
                <RNImage
                  style={{width: 130, height: 130, borderRadius: 8}}
                  source={{uri: item.uri}}
                />
                <TouchableOpacity
                  onPress={() =>
                    setState(prev => {
                      prev.images.splice(index, 1);
                      return {
                        ...prev,
                        images: prev.images,
                      };
                    })
                  }
                  activeOpacity={0.8}
                  style={{backgroundColor: 'rgba(0,0,0,0.8)'}}
                  tw="absolute top-[10] right-[10] rounded-full">
                  <FeatherIcon size={24} name="x" />
                </TouchableOpacity>
              </StyledView>
            )}
          />
        </StyledView>
      </StyledView>
      <StyledButton
        loading={state.loading}
        title={isUpdating ? 'Update' : 'Add'}
        twContainer="w-full"
        onPress={form.handleSubmit(onSubmit)}
      />
<StyledBottomSheet
      bottomSheetRef={bottomSheetRef}
      index={0}
      snapPoints={['16%']}
      enablePanDownToClose
    >
      <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
        <TouchableOpacity onPress={() => handleMedia('camera', 'mixed')} tw="p-3">
          <StyledText h2>Take a Photo</StyledText>
        </TouchableOpacity>
        <Divider linear />
        <TouchableOpacity onPress={() => handleMedia('gallery', 'mixed')} tw="p-3">
          <StyledText h2>Choose a Photo</StyledText>
        </TouchableOpacity>
        <Divider linear />
      </StyledView>
    </StyledBottomSheet>
    </StyledPageView>
  );
};

export default PostUpdate;
