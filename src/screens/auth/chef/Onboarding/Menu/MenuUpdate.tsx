import CameraSVG from '@/assets/icons/camera.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import Divider from '@/components/Divider';
import { SelectOptions } from '@/components/Select';
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
import { FlatList, Image, TouchableOpacity } from 'react-native';
import { Image as RNCompressedImage } from 'react-native-compressor';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';

type MenuUpdatePropsType = NativeStackScreenProps<
  RootStackParamList,
  'chef_menu_update'
>;

export type MenuType = {
  id?: number;
  title: string;
  cuisine_id: string | null;
  category_id: string | null;
  price: string;
  description: string;
  images: {image: string; id: number}[];
};
interface initialStateI {
  title: string;
  cuisine: {
    options: SelectOptions[];
    loading: boolean;
  };
  category: {
    options: SelectOptions[];
    loading: boolean;
  };
  images: Asset[];
  imageLoading: boolean;

  loading: boolean;
  pageLoading: boolean;
}

const initialState: initialStateI = {
  title: '',
  cuisine: {options: [], loading: false},
  category: {options: [], loading: false},
  images: [],
  imageLoading: false,
  pageLoading: true,
  loading: false,
};

const MenuUpdate = ({route, navigation}: MenuUpdatePropsType) => {
  const {theme} = useTheme();
  const [state, setState] = useState<initialStateI>(initialState);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const isUpdating = useMemo(
    () => typeof route.params?.id !== 'undefined',
    [route.params],
  );

  const {form, Form, defaultValues} = useCustomForm(
    {title: '', cuisine_id: '', category_id: '', price: '', description: ''},
    {
      title: {
        rules: {required: true},
        placeholder: 'Title',
      },
      cuisine_id: {
        rules: {required: true},
        placeholder: 'Select Cuisine',
        type: 'select',
        options: state.cuisine.options,
        selectProps: {search: true, loading: state.cuisine.loading},
      },
      category_id: {
        rules: {required: true},
        placeholder: 'Select Category',
        type: 'select',
        options: state.category.options,
        selectProps: {search: true, loading: state.category.loading},
      },
      price: {
        rules: {required: true},
        placeholder: 'Price',
        inputProps: {
          keyboardType: 'numeric',
        },
      },
      description: {
        rules: {required: true},
        placeholder: 'Description',
        inputProps: {
          multiline: true,
          maxLength: 250,
          numberOfLines: 4,
          textAlignVertical: 'top',
        },
        showCount: true,
      },
    },
    [state],
  );

  const handleImage = async (type: 'gallery' | 'camera') => {
    bottomSheetRef.current?.dismiss();
    setState(prev => ({...prev, imageLoading: true}));
    let result: ImagePickerResponse;
  
    if (type === 'camera') {
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
        const compressedImage = await RNCompressedImage.compress(
          selectedAsset.uri,
          {
            compressionMethod: 'manual',
            maxWidth: 1000,
            quality: 0.8,
          }
        );
  
        setState(prev => ({
          ...prev,
          images: [...prev.images, { uri: compressedImage, fileName: compressedImage }],
        }));
      }
    }
  
    setState(prev => ({...prev, imageLoading: false}));
  };

  const onSubmit = async (formData: typeof defaultValues) => {
    if (state.images.length === 0) {
      showToast(toastMessages.images_required.error);
      return;
    }
    setState(prev => ({...prev, loading: true}));
    const form = new FormData();
    if (isUpdating) {
      let oldImageCount = 0;
      let newImageCount = 0;
      state.images.forEach(image => {
        if (image.fileName?.startsWith('prevImage-')) {
          form.append(
            `old_images[${oldImageCount}]`,
            image.fileName.split('prevImage-').pop(),
          );
          oldImageCount++;
        } else {
          form.append(`images[${newImageCount}]`, {
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
    } else {
      let imageCount = 0;
      state.images.forEach(image => {
        form.append(`0[images][${imageCount}]`, {
          uri: image.uri,
          name: (image.uri ?? '').split('/').pop(),
          type: mime.getType(image.uri ?? ''),
        });
        imageCount++;
      });
      Object.keys(formData).forEach(key => {
        form.append(`0[${key}]`, formData[key as keyof typeof defaultValues]);
      });
    }

    for (let item of form.getParts()) {
      console.log({item});
    }

    const {data, status, HttpStatusCode} = await request(
      'POST',
      isUpdating
        ? `${urls.auth.chef.menu.update}/${route.params?.id}`
        : urls.auth.chef.menu.add,
      {},
      form,
    );
    if (status === HttpStatusCode.OK && data.success) {
      navigation.goBack();
    }
    setState(prev => ({...prev, loading: false}));
  };

  useEffect(() => {
    if (isUpdating) {
      form.setValue('title', route.params?.title ?? '');
      form.setValue('description', route.params?.description ?? '');
      form.setValue('price', route.params?.price ?? '');
      setState(prev => ({
        ...prev,
        images:
          route.params?.images.map(({id, image}) => ({
            uri: image,
            fileName: `prevImage-${id}`,
          })) ?? [],
      }));
    }
    setState(prev => ({...prev, pageLoading: false}));
    (async () => {
      setState(prev => ({
        ...prev,
        category: {...prev.category, loading: true},
      }));
      const {data, HttpStatusCode, status} = await request<SelectOptions[]>(
        'GET',
        urls.auth.common.constants.category,
      );
      if (status === HttpStatusCode.OK && data.success) {
        setState(prev => ({
          ...prev,
          category: {...prev.category, options: data.data},
        }));
        if (isUpdating)
          form.setValue('category_id', route.params?.category_id ?? '');
      }
      setState(prev => ({
        ...prev,
        category: {...prev.category, loading: false},
      }));
    })();
    (async () => {
      setState(prev => ({...prev, cuisine: {...prev.cuisine, loading: true}}));
      const {data, HttpStatusCode, status} = await request<SelectOptions[]>(
        'GET',
        urls.auth.common.constants.cuisine,
      );
      if (status === HttpStatusCode.OK && data.success) {
        setState(prev => ({
          ...prev,
          cuisine: {...prev.cuisine, options: data.data},
        }));
        if (isUpdating)
          form.setValue('cuisine_id', route.params?.cuisine_id ?? '');
      }
      setState(prev => ({...prev, cuisine: {...prev.cuisine, loading: false}}));
    })();
  }, []);
  return (
    <StyledPageView
      header
      route={route}
      navigation={navigation}
      loading={state.pageLoading}
      title={isUpdating ? 'Update Menu' : 'Add Menu'}>
      <StyledView tw="flex-1 w-full">
        <Form loading={state.loading} />
        <StyledText h4>Upload Photo</StyledText>
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
                    <StyledText h5>Add Photo</StyledText>
                  </>
                )}
              </TouchableOpacity>
            )}
            renderItem={({item, index}) => (
              <StyledView>
                <Image
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
        loadingProps={{size: 24}}
        disabled={state.loading}
        onPress={form.handleSubmit(onSubmit)}
        twContainer="my-2 w-full">
        {isUpdating ? 'Update' : 'Add'}
      </StyledButton>
      <StyledBottomSheet
        bottomSheetRef={bottomSheetRef}
        index={0}
        snapPoints={['16%']}
        enablePanDownToClose>
        <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
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

export default MenuUpdate;
