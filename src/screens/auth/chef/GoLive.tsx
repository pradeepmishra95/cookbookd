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
import {showToast} from '@/utils/Toaster';
import useCustomForm from '@/utils/useCustomForm';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import mime from 'mime';
import {useCallback, useRef, useState} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';

type GoLivePropsType = NativeStackScreenProps<
  RootStackParamList,
  'chef_go_live'
>;

interface initialStateI {
  images: Asset[];
  imageLoading: boolean;
  loading: boolean;
}

const initialState: initialStateI = {
  images: [],
  imageLoading: false,
  loading: false,
};

const GoLive = ({navigation, route}: GoLivePropsType) => {
  const [state, setState] = useState(initialState);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {theme} = useTheme();
  const {Form, form, defaultValues} = useCustomForm(
    {title: '', description: ''},
    {
      title: {
        placeholder: 'Live Title',
        rules: {required: true},
      },
      description: {
        placeholder: 'Live Description',
        rules: {required: true},
      },
    },
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

    if (result.assets && result.assets.length > 0)
      setState(prev => ({
        ...prev,
        images: [...prev.images, (result.assets as Asset[])[0]],
      }));

    setState(prev => ({...prev, imageLoading: false}));
  };

  const onSubmit = useCallback(
    async (formData: typeof defaultValues) => {
      if (state.images.length === 0) {
        showToast(toastMessages.images_required.error);
        return;
      }
      setState(prev => ({...prev, loading: true}));
      const form = new FormData();
      form.append('thumbnail', {
        uri: state.images[0].uri,
        name: (state.images[0].uri ?? '').split('/').pop(),
        type: mime.getType(state.images[0].uri ?? ''),
      });
      Object.keys(formData).forEach(key => {
        form.append(key, formData[key as keyof typeof defaultValues]);
      });

      const {data, status, HttpStatusCode} = await request<any>(
        'POST',
        urls.auth.chef.live.go_live,
        {},
        form,
      );
      if (status === HttpStatusCode.OK && data.success) {
        navigation.replace('live_streaming', {
          title: formData.title ?? '',
          descripton: formData.description ?? '',
        });
      }
      setState(prev => ({...prev, loading: false}));
    },
    [state],
  );

  return (
    <StyledPageView
      twScrollView="justify-start"
      header
      navigation={navigation}
      route={route}
      title={'Go Live'}>
      <StyledView tw="flex-1 w-full">
        <Form />
        <StyledText h4>Upload Photo</StyledText>
        <StyledView tw="flex-row mt-3">
          <FlatList
            horizontal
            data={state.images}
            ItemSeparatorComponent={() => <StyledView tw="m-1" />}
            ListHeaderComponent={() => (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={state.images.length > 0}
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
        twContainer="w-full"
        title={'Go Live'}
        loading={state.loading}
        disabled={state.loading}
        onPress={form.handleSubmit(onSubmit)}
      />

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

export default GoLive;
