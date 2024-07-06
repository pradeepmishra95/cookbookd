import CardSVG from '@/assets/icons/card.svg';
import TrashSVG from '@/assets/icons/trash.svg';
import { StyledPageView, StyledText, StyledView } from '@/components';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BankDetails } from './BankDetailsUpdate';

type BankDetailsManagementProps = NativeStackScreenProps<
  RootStackParamList,
  'chef_bank_details_management'
>;

interface initialStateI {
  bank_details: BankDetails[];
}

const initialState: initialStateI = {
  bank_details: [],
};
const BankDetailsManagement = ({
  navigation,
  route,
}: BankDetailsManagementProps) => {
  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet({
    icon: <CardSVG />,
    text: 'Are you sure you want to delete this account',
    buttonText: 'Delete',
  });

  const {theme} = useTheme();
  const [state, setState] = useState(initialState);

  useEffect(() => {}, []);

  const RightButton = useMemo(
    () => (
      <StyledText
        onPress={() =>
          navigation.navigate('chef_bank_details_update', {
            showProgressFooter: false,
          })
        }
        style={{color: theme.colors.primary}}>
        Add
      </StyledText>
    ),
    [],
  );

  return (
    <StyledPageView
      header
      navigation={navigation}
      twScrollView={'justify-start pt-5'}
      route={route}
      title="Bank Details"
      rightComponent={RightButton}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#EA2D29', '#EA2D29', '#FFB500']}
        className="w-full h-[136] rounded-xl flex-row p-3">
        <StyledView className="justify-around flex-1">
          <StyledView>
            <StyledText className="mb-1 text-white" style={{fontSize: 12}}>
              Account Holder Name
            </StyledText>
            <StyledText h4 style={{color: 'white'}}>
              Tom Colicchio
            </StyledText>
          </StyledView>
          <StyledView>
            <StyledText className="mb-1 text-white" style={{fontSize: 12}}>
              Account Number
            </StyledText>
            <StyledText h4 style={{color: 'white'}}>
              4444 - XXXX - 6565
            </StyledText>
          </StyledView>
        </StyledView>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => BottomSheetRef.current?.present()}>
          <TrashSVG color="white" fontSize={50} />
        </TouchableOpacity>
        <BottomSheet />
      </LinearGradient>
    </StyledPageView>
  );
};

export default BankDetailsManagement;
