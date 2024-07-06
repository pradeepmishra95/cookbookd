import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useTheme} from '@rneui/themed';
import React, {ReactNode, useCallback, useRef} from 'react';
import {StyledButton, StyledText, StyledView} from '../components';
import StyledBottomSheet, {
  BottomSheetModalData,
} from '../components/BottomSheet';

type CommonBottomSheetProps<T> = {
  icon?: ReactNode;
  text?: string;
  buttonText?: string;
  onButtonPress?: (data?: T) => void;
  loading?: boolean;
};
const useCommonBottomSheet = <T,>(
  props: CommonBottomSheetProps<T>,
  dependency: React.DependencyList = [],
) => {
  const BottomSheetRef = useRef<BottomSheetModal>(null);
  const {theme} = useTheme();

  const BottomSheet = useCallback(() => {
    return (
      <StyledBottomSheet
        bottomSheetRef={BottomSheetRef}
        index={0}
        snapPoints={['28%']}
        enablePanDownToClose>
        {({data}: BottomSheetModalData<T>) => (
          <StyledView
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <StyledView
              style={{
                backgroundColor: theme.colors.grey4,
                padding: 4,
                width: 76,
                height: 76,
                borderRadius: 76,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {props.icon}
            </StyledView>
            <StyledText h4 tw="text-center">
              {props.text}
            </StyledText>
            <StyledButton
              title={props.buttonText}
              onPress={() =>
                typeof props.onButtonPress === 'function'
                  ? props.onButtonPress(data)
                  : null
              }
              loading={props.loading}
              twContainer="w-44"
            />
          </StyledView>
        )}
      </StyledBottomSheet>
    );
  }, dependency);
  return {BottomSheet, BottomSheetRef};
};

export default useCommonBottomSheet;
