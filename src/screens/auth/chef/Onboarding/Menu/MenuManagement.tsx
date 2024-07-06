import EditSVG from '@/assets/icons/custom/EditSVG';
import DeleteSVG from '@/assets/icons/delete.svg';
import AddMenuSVG from '@/assets/icons/menu.svg';
import TrashSVG from '@/assets/icons/trash.svg';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import toastMessages from '@/constants/toastMessages';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {showToast} from '@/utils/Toaster';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {ProgressFooter} from '../CompleteProfile';
import {MenuType} from './MenuUpdate';

type MenuManagementPropsType = NativeStackScreenProps<
  RootStackParamList,
  'chef_menu_management'
>;

interface initialStateI {
  menus: MenuType[];
  loading: boolean;
  selected: number | null;
}

const initialState: initialStateI = {
  menus: [],
  loading: true,
  selected: null,
};
const MenuManagement = ({route, navigation}: MenuManagementPropsType) => {
  const {theme} = useTheme();
  const [state, setState] = useState(initialState);
  const deleteBottomSheetRef = useRef<BottomSheetModal>(null);
  const AddMenuButton = () => {
    return (
      <StyledButton
        twContainer="my-2"
        twButton="py-2 px-4"
        twTitle="text-white"
        titleStyle={{fontSize: 14}}
        onPress={() => navigation.navigate('chef_menu_update')}
        buttonStyle={{borderColor: theme.colors.greyOutline}}
        type="outline">
        <FeatherIcon
          name="plus"
          style={{marginRight: 5}}
          color={theme.colors.black}
          size={18}
        />
        <StyledText h4>Add Menu</StyledText>
      </StyledButton>
    );
  };

  const deleteMenu = useCallback(async () => {
    const {data, status, HttpStatusCode} = await request(
      'DELETE',
      `${urls.auth.chef.menu.delete}/${state.selected}`,
    );
    if (status === HttpStatusCode.OK && data.success) {
      showToast(toastMessages.delete_menu.success);
    }
    deleteBottomSheetRef.current?.dismiss();
    fetchMenus();
  }, [state.selected]);

  const fetchMenus = useCallback(async () => {
    setState(prev => ({...prev, loading: true}));
    const {data, status, HttpStatusCode} = await request<MenuType[]>(
      'GET',
      urls.auth.chef.menu.get,
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({...prev, menus: data.data}));
    }
    setState(prev => ({...prev, loading: false}));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMenus();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <StyledPageView
      header
      route={route}
      navigation={navigation}
      title="Menu Management"
      twScrollView={'justify-start pt-2'}
      footerComponent={
        <ProgressFooter
          total={4}
          current={3}
          onPress={() =>
            navigation.navigate('chef_bank_details_update', {
              showProgressFooter: true,
            })
          }
        />
      }>
      {state.loading ? (
        <StyledView tw="flex-row my-1" style={{gap: 15}}>
          <Skeleton circle width={90} height={90} />
          <Skeleton style={{flex: 1}} height={90} />
        </StyledView>
      ) : state.menus.length === 0 ? (
        <StyledView tw="flex-1 justify-center items-center">
          <AddMenuSVG />
          <AddMenuButton />
        </StyledView>
      ) : (
        <>
          {state.menus.map((item, i) => (
            <StyledView
              key={i}
              tw="flex-row w-full items-center p-2 mb-3"
              style={{
                borderColor: theme.colors.greyOutline,
                borderWidth: 2,
                borderRadius: 8,
                gap: 15,
              }}>
              {item.images.length > 0 ? (
                <Image
                  style={{height: 90, width: 90, borderRadius: 8}}
                  source={{
                    uri: item.images[0].image,
                  }}
                />
              ) : (
                <StyledView
                  tw="items-center justify-center"
                  style={{width: 90, height: 90, borderRadius: 8}}>
                  <StyledText>No Image</StyledText>
                </StyledView>
              )}

              <StyledView tw="flex-1 h-full gap-2">
                <StyledText h4>{item.title}</StyledText>
                <StyledText h5 style={{color: theme.colors.lightText}}>
                  {item.description.length > 100
                    ? `${item.description.slice(0, 100)}...`
                    : item.description}
                </StyledText>
                <StyledView tw="absolute right-0 top-0 flex-row">
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('chef_menu_update', item);
                    }}>
                    <EditSVG
                      height={30}
                      width={30}
                      color={theme.colors.black}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <TrashSVG
                      color={theme.colors.black}
                      onPress={() => {
                        const {id} = item;
                        if (id) {
                          setState(prev => ({
                            ...prev,
                            selected: id,
                          }));
                          deleteBottomSheetRef.current?.present();
                        }
                      }}
                    />
                  </TouchableOpacity>
                </StyledView>
              </StyledView>
            </StyledView>
          ))}
          <StyledView tw="items-end w-full">
            <AddMenuButton />
          </StyledView>
        </>
      )}
      <StyledBottomSheet
        snapPoints={['30%']}
        bottomSheetRef={deleteBottomSheetRef}
        index={0}>
        <StyledView tw="items-center justify-evenly flex-1">
          <StyledView
            className="items-center justify-center p-4"
            style={{backgroundColor: theme.colors.grey4, borderRadius: 44}}>
            <DeleteSVG />
          </StyledView>
          <StyledText h4 className="w-48 text-center">
            Are you sure you want to delete this menu
          </StyledText>
          <StyledButton
            titleStyle={{fontSize: 16}}
            title={'Delete'}
            onPress={deleteMenu}
            twContainer=" w-48"
          />
        </StyledView>
      </StyledBottomSheet>
    </StyledPageView>
  );
};

export default MenuManagement;
