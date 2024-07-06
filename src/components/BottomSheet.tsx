import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import {ThemeConsumer} from '@rneui/themed';
import {styled} from 'nativewind';
import {Ref, memo, useCallback} from 'react';

type StyledBottomSheetWrapperPropsType = {
  tw?: BottomSheetProps['style'];
  twBackground?: BottomSheetProps['backgroundStyle'];
  twHandleIndicator?: BottomSheetProps['handleIndicatorStyle'];
  bottomSheetRef?: Ref<BottomSheetModal>;
};

type BottomSheetModalData<T> = {
  data: T;
};

const StyledBottomSheetWrapper = ({
  children,
  twBackground,
  twHandleIndicator,
  bottomSheetRef,
  tw,
  ...props
}: BottomSheetModalProps & StyledBottomSheetWrapperPropsType) => {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
    ),
    [],
  );
  return (
    <ThemeConsumer>
      {({theme}) => {
        return (
          <BottomSheetModal
            keyboardBlurBehavior="restore"
            backdropComponent={renderBackdrop}
            {...props}
            ref={bottomSheetRef}
            style={[
              {
                paddingHorizontal: 15,
              },
              tw,
              props.style,
            ]}
            backgroundStyle={[
              {
                backgroundColor: theme.colors.greyOutline,
              },
              twBackground,
              props.backgroundStyle,
            ]}
            handleIndicatorStyle={[
              {backgroundColor: theme.colors.handleColor},
              twHandleIndicator,
              props.handleIndicatorStyle,
            ]}
            onChange={() => {}}>
            {children}
          </BottomSheetModal>
        );
      }}
    </ThemeConsumer>
  );
};

const StyledBottomSheet = styled(StyledBottomSheetWrapper, {
  props: {twBackground: true, twHandleIndicator: true},
});

export default memo(StyledBottomSheet);
export type {BottomSheetModalData};
