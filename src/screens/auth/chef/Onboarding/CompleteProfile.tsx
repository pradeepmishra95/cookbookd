import AddressSVG from '@/assets/icons/address.svg';
import HomeSVG from '@/assets/icons/bottom_tab/home.svg';
import CameraSVG from '@/assets/icons/camera.svg';
import EditSVG from '@/assets/icons/custom/EditSVG';
import GallerySVG from '@/assets/icons/gallery.svg';
import {
  StyledButton,
  StyledInput,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import Checkbox from '@/components/Checkbox';
import Divider from '@/components/Divider';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useAuth from '@/store/useAuth';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Image, Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import mime from 'mime';
import {useEffect, useRef, useState} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {AddressType} from '../../common/Address/AddressManagement';

type CompleteProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'chef_complete_profile'
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
  description: string;
  loading: boolean;
  delivery: boolean;
  pickup: boolean;
  bookme: boolean;
  address: {data: AddressType[]; loading: boolean};
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
  description: '',
  delivery: false,
  pickup: false,
  bookme: false,
  address: {data: [], loading: true},
};

type ProgressFooterPropsType = {
  total: number;
  current: number;
  onPress?: () => void;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
};

export const ProgressFooter = ({
  total,
  current,
  onPress,
  disabled,
  label,
  loading,
}: ProgressFooterPropsType) => {
  const {theme} = useTheme();
  const currentValue = (current / total) * 100;
  return (
    <StyledView
      tw="flex-row w-full items-center justify-center pt-2"
      style={{
        paddingHorizontal: 15,
        gap: 5,
        borderTopColor: theme.colors.grey5,
        borderTopWidth: 1,
      }}>
      <PieChart
        donut
        radius={30}
        innerRadius={25}
        data={[
          {value: currentValue, color: theme.colors.yellow},
          {value: 100 - currentValue, color: theme.colors.greyOutline},
        ]}
        innerCircleColor={theme.colors.background}
        centerLabelComponent={() => {
          return <StyledText h3>{`${current}/${total}`}</StyledText>;
        }}
      />

      <StyledButton
        loading={loading ?? false}
        loadingProps={{size: 24}}
        disabled={disabled ?? false}
        onPress={onPress}
        twContainer="flex-1 my-2">
        {label ?? 'Next'}
      </StyledButton>
    </StyledView>
  );
};

const CompleteProfile = ({route, navigation}: CompleteProfileProps) => {
  const {theme} = useTheme();
  const bottomSheetProfileRef = useRef<BottomSheetModal>(null);
  const bottomSheetCoverRef = useRef<BottomSheetModal>(null);
  const [state, setState] = useState(initialState);
  const {width} = Dimensions.get('screen');
  const userData = useAuth(state => state.userData);

  useEffect(() => {
    const fetchAddresses = async () => {
      setState(prev => ({...prev, address: {...prev.address, loading: true}}));
      const {data, status, HttpStatusCode} = await request<AddressType[]>(
        'GET',
        urls.auth.common.address.chef.get,
      );
      if (status === HttpStatusCode.OK && data.success) {
        setState(prev => ({
          ...prev,
          address: {...prev.address, data: data.data},
        }));
        console.log(data.data);
      }
      setState(prev => ({...prev, address: {...prev.address, loading: false}}));
    };
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAddresses();
    });

    return unsubscribe;
  }, [navigation]);

  const handleImage = async (
    type: 'cover' | 'profile',
    action: 'gallery' | 'camera' | 'reset',
  ) => {
    if (type === 'cover') {
      bottomSheetCoverRef.current?.dismiss();
    } else {
      bottomSheetProfileRef.current?.dismiss();
    }
    setState(prev => ({
      ...prev,
      imageLoading: {...prev.imageLoading, [type]: true},
    }));

    let result: ImagePickerResponse;
    if (action === 'reset') {
      setState(prev => ({
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

    if (result.assets && result.assets.length > 0)
      setState(prev => ({
        ...prev,
        selectedImage: {
          ...prev.selectedImage,
          [type]: result.assets ? result.assets[0] ?? null : null,
        },
      }));

    setState(prev => ({
      ...prev,
      imageLoading: {
        ...prev.imageLoading,
        [type]: false,
      },
    }));
  };

  const onSubmit = async () => {
    setState(prev => ({...prev, loading: true}));
    let formData = new FormData();
    formData.append('_method', 'put');
    if (
      state.selectedImage.cover &&
      state.selectedImage.cover.fileName !== 'prevCoverImage'
    ) {
      formData.append('cover_image', {
        uri: state.selectedImage.cover.uri,
        name: (state.selectedImage.cover.uri ?? '').split('/').pop(),
        type: mime.getType(state.selectedImage.cover.uri ?? ''),
      });
    }
    if (
      state.selectedImage.profile &&
      state.selectedImage.profile.fileName !== 'prevProfileImage'
    ) {
      formData.append('profile_image', {
        uri: state.selectedImage.profile.uri,
        name: (state.selectedImage.profile.uri ?? '').split('/').pop(),
        type: mime.getType(state.selectedImage.profile.uri ?? ''),
      });
    }
    formData.append('description', state.description);
    formData.append('service_type[delivery]', state.delivery);
    formData.append('service_type[pickup]', state.pickup);
    formData.append('service_type[bookme]', state.bookme);

    const {data, status, HttpStatusCode} = await request<string>(
      'POST',
      urls.auth.chef.profile.update,
      {},
      formData,
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({...prev, loading: false}));
      navigation.replace('chef_availability');
    }
    setState(prev => ({...prev, loading: false}));
  };

  const AddAddressButton = () => {
    return (
      <StyledButton
        twContainer="my-2"
        twButton="py-2 px-4"
        twTitle="text-white"
        titleStyle={{fontSize: 14}}
        onPress={() => navigation.navigate('address_update')}
        buttonStyle={{borderColor: theme.colors.greyOutline}}
        type="outline">
        <FeatherIcon
          name="plus"
          style={{marginRight: 5}}
          color={theme.colors.black}
          size={18}
        />
        <StyledText h4>Add Address</StyledText>
      </StyledButton>
    );
  };

  useEffect(() => {
    if (userData) {
      if (userData.profile_image) {
        setState(prev => ({
          ...prev,
          selectedImage: {
            ...prev.selectedImage,
            profile: {
              uri: userData.profile_image,
              fileName: `prevProfileImage`,
            },
          },
        }));
      }
      if (userData.cover_images) {
        setState(prev => ({
          ...prev,
          selectedImage: {
            ...prev.selectedImage,
            profile: {uri: userData.cover_images, fileName: `prevCoverImage`},
          },
        }));
      }
    }
  }, []);

  return (
    <StyledPageView
      header
      noPadding
      route={route}
      backButton={false}
      title="Complete Profile"
      navigation={navigation}
      footerComponent={
        <ProgressFooter
          current={1}
          total={4}
          loading={state.loading}
          // disabled={state.addresses.length === 0}
          onPress={onSubmit}
        />
      }
      twScrollView={'justify-start'}>
      {/* Images Boxes */}
      <StyledView tw="w-full flex-row" style={{gap: 10, paddingHorizontal: 15}}>
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
              <FeatherIcon name="user" size={35} color={theme.colors.grey5} />
              <StyledText h4 tw="mt-1" style={{color: theme.colors.grey5}}>
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
            <CameraSVG color={theme.colors.secondary} height={30} width={30} />
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
              <GallerySVG height={35} width={35} color={theme.colors.grey5} />
              <StyledText h4 tw="mt-1" style={{color: theme.colors.grey5}}>
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
            <CameraSVG color={theme.colors.secondary} height={30} width={30} />
          </TouchableOpacity>
        </StyledView>
      </StyledView>

      <StyledView tw="w-full mt-4" style={{paddingHorizontal: 15}}>
        <StyledText h2>Tell us about why you cook</StyledText>
        <StyledText tw="mt-1" h4 style={{color: theme.colors.lightText}}>
          Every chef gets their own page, and your name is will know you and
          search for you. You can change it at any time,
        </StyledText>
        <StyledInput
          multiline
          numberOfLines={4}
          placeholder="Description"
          textAlignVertical="top"
          style={{fontSize: 14}}
          placeholderTextColor={theme.colors.lightText}
          containerStyle={{
            paddingHorizontal: 0,
            marginTop: 10,
            flexDirection: 'column-reverse',
          }}
          onChangeText={desc =>
            setState(prev => ({
              ...prev,
              description:
                prev.description.length <= 250 ? desc : prev.description,
            }))
          }
          value={state.description}
          errorStyle={{display: 'none'}}
          inputContainerStyle={{paddingHorizontal: 10}}
          label={
            <StyledText
              tw="w-full text-right"
              style={{color: theme.colors.lightText}}
              h4>
              {state.description.length}/250
            </StyledText>
          }
        />
      </StyledView>
      <Divider tw="my-3" />
      <StyledView tw="w-full" style={{paddingHorizontal: 15}}>
        <StyledText h2 tw="mb-2">
          Service Type
        </StyledText>
        <StyledView tw="flex-row my-1" style={{gap: 30}}>
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
      <Divider tw="my-3" />
      <StyledView tw="w-full" style={{paddingHorizontal: 15}}>
        <StyledText h2 tw="mb-2">
          Address
        </StyledText>

        {state.address.loading ? (
          <StyledView tw="flex-row my-1" style={{gap: 10}}>
            <Skeleton circle width={40} height={40} />
            <Skeleton style={{flex: 1}} height={40} />
          </StyledView>
        ) : state.address.data.length === 0 ? (
          <StyledView tw="w-full items-center my-6">
            <AddressSVG />
            <AddAddressButton />
          </StyledView>
        ) : (
          <>
            {state.address.data.map((address, i) => (
              <StyledView key={i} tw="flex-row my-1" style={{gap: 10}}>
                <StyledView
                  tw="p-2"
                  style={{
                    backgroundColor: theme.colors.grey0,
                    borderRadius: 30,
                  }}>
                  <HomeSVG height={30} width={30} color={theme.colors.black} />
                </StyledView>
                <StyledView tw="flex-1">
                  <StyledText h4>{address.address_name}</StyledText>
                  <StyledText h5>{address.formatted_address}</StyledText>
                </StyledView>
                <StyledView tw="absolute right-0 top-0 flex-row">
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('address_update', address);
                    }}>
                    <EditSVG
                      height={30}
                      width={30}
                      color={theme.colors.black}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    {/* <TrashSVG
                      color={theme.colors.black}
                      onPress={() => {
                        const {id} = address;
                        if (id) {
                          setState(prev => ({
                            ...prev,
                            selected: id,
                          }));
                          deleteBottomSheetRef.current?.present();
                        }
                      }}
                    /> */}
                  </TouchableOpacity>
                </StyledView>
              </StyledView>
            ))}
            <Divider tw="my-2" />
            <StyledView tw="flex-row justify-end">
              <AddAddressButton />
            </StyledView>
          </>
        )}
      </StyledView>

      {/* Bottom Sheets for images */}
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
    </StyledPageView>
  );
};

export default CompleteProfile;
