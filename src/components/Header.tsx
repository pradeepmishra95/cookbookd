import LocationSVG from '@/assets/icons/custom/LocationSVG';
import LetterLogoChef from '@/assets/icons/letter_logo_chef.svg';
import NotificationSVG from '@/assets/icons/notification.svg';
import { StyledText, StyledView } from '@/components';
import useAddress from '@/store/useAddress';
import useAuth from '@/store/useAuth';
import useData from '@/store/useData';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { Skeleton, useTheme } from '@rneui/themed';
import React, { useRef } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import StyledBottomSheet from './BottomSheet';
import Divider from './Divider';

type HeaderProps = {
  bottomComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
};
export const Header = ({bottomComponent, rightComponent}: HeaderProps) => {
  const {theme} = useTheme();
  const userData = useAuth(state => state.userData);
  const {selectedAddress, addressLoading, addresses, setSelectedAddress} =
    useAddress();
  const {notificationCount, chatCount} = useData();
  const navigation = useNavigation();
  const locationBottomSheet = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  return (
    <StyledView className="w-full items-center justify-center py-4 gap-y-3">
      <StyledView className="w-full flex-row justify-between items-center">
        <StyledView className="flex-row gap-x-2 items-center">
          <StyledView>
            <StyledView>
              {Config.USER_TYPE === 'chef' && (
                <LetterLogoChef
                  style={{position: 'absolute', bottom: -4, left: -4}}
                />
              )}
              <Image
                style={{height: 36, width: 36, borderRadius: 36}}
                source={{
                  uri: userData?.profile_image,
                }}
              />
            </StyledView>
          </StyledView>
          <StyledView className="">
            <StyledText h4>Welcome {userData?.first_name}</StyledText>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={addressLoading}
              onPress={() => {
                locationBottomSheet.current?.present('data');
              }}
              className="flex-row items-center justify-center gap-x-1">
              {addressLoading ? (
                <>
                  <Skeleton circle width={24} height={25} />
                  <Skeleton style={{flex: 1}} width={50} height={15} />
                </>
              ) : (
                <>
                  <LocationSVG
                    width={24}
                    height={25}
                    color={theme.colors.black}
                  />
                  <StyledText h3>
                    {selectedAddress?.city?.length ?? 0 > 10
                      ? `${selectedAddress?.city.slice(0, 10)}...`
                      : selectedAddress?.city ?? '--'}
                  </StyledText>
                  <FeatherIcon
                    color={theme.colors.black}
                    // size={selected !== '' ? 16 : 18}
                    className="mt-auto"
                    name={'chevron-down'}
                  />
                </>
              )}
            </TouchableOpacity>
          </StyledView>
        </StyledView>
        <StyledView tw="flex-row" style={{gap: 15}}>
          {rightComponent}
          <StyledView className="relative">
            <FeatherIcon
              name="message-square"
              size={24}
              color={theme.colors.black}
              onPress={() => navigation.navigate('all_chats')}
            />
            <StyledView
              className="absolute"
              style={{
                width: 19,
                height: 19,
                borderRadius: 19,
                backgroundColor: theme.colors.primary,
                transform: [{translateX: 9}, {translateY: -9}],
              }}>
              <StyledText style={{color: 'white'}} className="text-center">
                {chatCount}
              </StyledText>
            </StyledView>
          </StyledView>

          <StyledView className="relative">
            <NotificationSVG
              color={theme.colors.black}
              onPress={() => navigation.navigate('notification')}
            />
            <StyledView
              className="absolute"
              style={{
                width: 19,
                height: 19,
                borderRadius: 19,
                backgroundColor: theme.colors.primary,
                transform: [{translateX: 9}, {translateY: -9}],
              }}>
              <StyledText style={{color: 'white'}} className="text-center">
                {notificationCount}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
      {bottomComponent}

      <StyledBottomSheet
        bottomSheetRef={locationBottomSheet}
        index={0}
        snapPoints={['35%']}
        enablePanDownToClose>
        <StyledView tw="flex-1" style={{paddingBottom: insets.bottom}}>
          <BottomSheetFlatList
            data={addresses}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            ListHeaderComponent={() => (
              <StyledText h1 tw="py-1">
                Select Address
              </StyledText>
            )}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  tw="flex-1 flex-row items-center"
                  style={{gap: 10}}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedAddress(item);
                    locationBottomSheet.current?.dismiss();
                  }}>
                  <StyledView
                    style={{
                      borderRadius: 20,
                      borderColor: theme.colors.handleColor,
                      padding: 2,
                      borderWidth: 2,
                    }}>
                    <StyledView
                      style={{
                        backgroundColor:
                          selectedAddress?.id === item.id
                            ? theme.colors.primary
                            : 'transparent',
                        width: 10,
                        height: 10,
                        borderRadius: 20,
                      }}
                    />
                  </StyledView>
                  <StyledView tw="flex-1">
                    <StyledText h2 h2Style={{color: theme.colors.lightText}}>
                      {item.address_name}
                    </StyledText>
                    <StyledText h3>
                      {item.formatted_address ?? 'N/A'}
                    </StyledText>
                  </StyledView>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <Divider linear tw="my-3" />}
            ListFooterComponent={() => <StyledView tw="py-3" />}
          />
        </StyledView>
      </StyledBottomSheet>
    </StyledView>
  );
};
