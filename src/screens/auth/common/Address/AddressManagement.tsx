import AddressSVG from '@/assets/icons/address.svg';
import HomeSVG from '@/assets/icons/bottom_tab/home.svg';
import LocationGroupSVG from '@/assets/icons/location_group.svg';
import MoreSVG from '@/assets/icons/more.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import Divider from '@/components/Divider';
import StyledListItem from '@/components/ListItem';
import toastMessages from '@/constants/toastMessages';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {showToast} from '@/utils/Toaster';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Config from 'react-native-config';

export type AddressType = {
  id?: number;
  address_name: string;
  city: string;
  flat_block: string;
  apartment_street_area: string;
  zipcode: string;
  country: string;
  state: string;
  formatted_address?: string;
  location_coordinates: {latitude: number; longitude: number};
};

type AddressManagementProps = NativeStackScreenProps<
  RootStackParamList,
  'address_management'
>;
type initialStateI = {
  addresses: AddressType[];
  selectedAddress: AddressType | null;
  loading: boolean;
  deleteLoading: boolean;
};

const initialState: initialStateI = {
  addresses: [],
  selectedAddress: null,
  loading: true,
  deleteLoading: false,
};

const AddressManagement = ({navigation, route}: AddressManagementProps) => {
  const [state, setState] = useState<initialStateI>(initialState);
  const {theme} = useTheme();
  const bottomSheetClearAll = useRef<BottomSheetModal>(null);
  const bottomSheetDelete = useRef<BottomSheetModal>(null);
  const bottomSheetMore = useRef<BottomSheetModal>(null);

  const deleteAddress = useCallback(async () => {
    setState(prev => ({...prev, deleteLoading: true}));
    const {data, HttpStatusCode, status} = await request(
      'DELETE',
      `${urls.auth.common.address.delete}/${state.selectedAddress?.id}`,
    );
    if (status === HttpStatusCode.OK && data.success) {
      showToast(toastMessages.delete_address.success);
      setState(prev => ({...prev, selectedAddress: null}));
      bottomSheetDelete.current?.dismiss();
      fetchAddresses();
    }
    setState(prev => ({...prev, deleteLoading: false}));
  }, [state.selectedAddress]);

  const editAddress = useCallback(async () => {
    navigation.navigate('address_map', state.selectedAddress ?? undefined);
    setState(prev => ({...prev, selectedAddress: null}));
    bottomSheetMore.current?.dismiss();
  }, [state.selectedAddress]);

  const fetchAddresses = useCallback(async () => {
    setState(prev => ({...prev, loading: true}));
    const {data, status, HttpStatusCode} = await request<AddressType[]>(
      'GET',
      Config.USER_TYPE === 'chef'
        ? urls.auth.common.address.chef.get
        : urls.auth.common.address.customer.get,
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({...prev, addresses: data.data}));
    }
    setState(prev => ({...prev, loading: false}));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAddresses();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      header
      title="Add Address"
      rightComponent={
        <TouchableOpacity
          onPress={() => {
            setState(prev => ({...prev, isDelete: false}));
            bottomSheetClearAll.current?.present();
          }}>
          <StyledText style={{color: theme.colors.primary}}>
            Clear all
          </StyledText>
        </TouchableOpacity>
      }>
      <StyledView tw="flex-1 w-full justify-start gap-y-3 py-3">
        {state.loading ? (
          <StyledView tw="p-3 w-full flex-row gap-x-3">
            <Skeleton height={50} width={50} circle />
            <Skeleton height={48} style={{flex: 1}} />
          </StyledView>
        ) : state.addresses.length > 0 ? (
          state.addresses.map((address, i) => {
            return (
              <StyledListItem
                key={i}
                containerStyle={{
                  backgroundColor: theme.colors.grey0,
                  borderRadius: 8,
                }}
                twContainer={'w-full'}
                title={address.address_name}
                subtitle={address.formatted_address}
                leftComponent={
                  <StyledView
                    className="p-2 items-center justify-center"
                    style={{
                      backgroundColor: theme.colors.greyOutline,
                      borderRadius: 24,
                      height: 48,
                      width: 48,
                    }}>
                    <HomeSVG
                      color={theme.colors.black}
                      width={26}
                      height={21}
                    />
                  </StyledView>
                }
                rightComponent={
                  <TouchableOpacity
                    className=" mb-auto inline"
                    activeOpacity={1}
                    onPress={() => {
                      setState(prev => ({...prev, selectedAddress: address}));
                      bottomSheetMore.current?.present();
                    }}>
                    <MoreSVG color={theme.colors.black} />
                  </TouchableOpacity>
                }
              />
            );
          })
        ) : (
          <StyledView tw="flex-1 items-center justify-center">
            <AddressSVG />
            <StyledText h3 tw="mt-5">
              No Address Added
            </StyledText>
          </StyledView>
        )}
      </StyledView>
      <StyledButton
        title={'+ Add Address'}
        // disabled={state.loading}
        twContainer="w-full my-2"
        onPress={() => navigation.navigate('address_map')}
      />

      <StyledBottomSheet
        bottomSheetRef={bottomSheetClearAll}
        index={0}
        snapPoints={['30%']}
        enablePanDownToClose>
        <StyledView tw="items-center justify-evenly flex-1">
          <StyledView
            className=" rounded-full p-4"
            style={{backgroundColor: theme.colors.grey4}}>
            <LocationGroupSVG />
          </StyledView>
          <StyledText h4 className=" w-60 text-center">
            Are you sure you want to clear all the addresses
          </StyledText>
          <StyledButton title={'Clear All'} twContainer=" w-48" />
        </StyledView>
      </StyledBottomSheet>

      <StyledBottomSheet
        bottomSheetRef={bottomSheetDelete}
        // index={0}
        snapPoints={['30%']}
        enablePanDownToClose={!state.deleteLoading}>
        <StyledView tw="items-center justify-evenly flex-1">
          <StyledView
            className=" rounded-full p-4"
            style={{backgroundColor: theme.colors.grey4}}>
            <LocationGroupSVG />
          </StyledView>
          <StyledText h4 className=" w-60 text-center">
            Are you sure you want to delete this address
          </StyledText>
          <StyledButton
            title={'Delete'}
            onPress={deleteAddress}
            loading={state.deleteLoading}
            disabled={state.deleteLoading}
            twContainer=" w-48"
          />
        </StyledView>
      </StyledBottomSheet>

      <StyledBottomSheet
        bottomSheetRef={bottomSheetMore}
        index={0}
        snapPoints={['18%']}
        enablePanDownToClose>
        <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
          <TouchableOpacity onPress={editAddress} tw="p-2">
            <StyledText h2>Edit</StyledText>
          </TouchableOpacity>
          <Divider linear />
          <TouchableOpacity
            onPress={() => {
              bottomSheetMore.current?.dismiss();
              bottomSheetDelete.current?.present();
            }}
            tw="p-2">
            <StyledText h2>Delete</StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledBottomSheet>
    </StyledPageView>
  );
};

export default AddressManagement;
