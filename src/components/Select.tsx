import {StyledButton, StyledText, StyledView} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {useTheme} from '@rneui/themed';
import {ReactNode, useCallback, useMemo, useRef, useState} from 'react';
import {Keyboard, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Checkbox from './Checkbox';
import Divider from './Divider';

export type SelectOptions = {
  key: string;
  label: string;
  value: string;
};

export type SelectPropsType = {
  options: SelectOptions[];
  selected: string | undefined;
  setSelected: (item: string | null) => void;
  placeholder?: string;
  search?: boolean;
  disabled?: boolean;
  loading?: boolean;
  left?: ReactNode;
  errorMessage?: string | undefined;
};

const Select = ({
  options,
  selected,
  setSelected,
  placeholder,
  search,
  disabled,
  loading,
  left,
  errorMessage,
  ...props
}: SelectPropsType & Omit<TouchableOpacityProps, 'disabled'>) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {theme} = useTheme();
  const [searchText, setSearchText] = useState('');

  const searchOptions = useMemo(
    () =>
      searchText === ''
        ? options
        : options.filter(each => each.label.includes(searchText)),
    [options, searchText],
  );
  const label = useMemo(
    () =>
      selected && selected !== ''
        ? options.find(each => each.value === selected)?.label
        : '',
    [selected, options],
  );

  const renderItem = useCallback(
    ({item}: {item: SelectOptions}) => (
      <TouchableOpacity
        onPress={() => {
          setSelected(selected === item.value ? null : item.value);
          bottomSheetRef.current?.dismiss();
        }}
        tw="w-full p-4 flex-row justify-between">
        <StyledText h2>{item.label}</StyledText>
        <Checkbox
          loading
          status={selected === item.value}
          toggleStatus={() => {}}
        />
      </TouchableOpacity>
    ),
    [selected],
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        tw="flex-row w-full items-center"
        onPress={() => {
          Keyboard.dismiss();
          bottomSheetRef.current?.present();
        }}
        disabled={disabled || loading}
        style={[
          {
            paddingHorizontal: 10,
            paddingVertical: 16,
            backgroundColor: theme.colors.grey0,
            borderRadius: 8,
          },
          props.style,
          errorMessage
            ? {
                borderColor: theme.colors.primary,
                borderWidth: 1,
                borderBottomWidth: 1,
              }
            : {
                borderColor: 'transparent',
                borderWidth: 1,
                borderBottomWidth: 1,
              },
        ]}>
        {left}
        <StyledView tw="flex-row flex-1 justify-between items-center">
          <StyledText
            h4
            h4Style={[
              {
                fontFamily: 'Manrope-Regular',
                fontWeight: '400',
              },
              disabled ? {color: theme.colors.lightText} : {},
            ]}>
            {selected !== '' ? label : placeholder ?? 'Select a value'}
          </StyledText>
          <TouchableOpacity
            tw="justify-end flex-row px-2"
            activeOpacity={0.8}
            onPress={() => {
              if (selected) setSelected('');
            }}
            disabled={selected === ''}>
            {loading ? (
              <StyledButton
                loading
                twButton={'bg-transparent p-0'}
                loadingProps={{size: 16}}
              />
            ) : (
              <FeatherIcon
                color={disabled ? theme.colors.lightText : theme.colors.black}
                size={selected !== '' ? 16 : 18}
                name={selected !== '' ? 'x' : 'chevron-down'}
              />
            )}
          </TouchableOpacity>
        </StyledView>
      </TouchableOpacity>
      <StyledText
        tw="mt-2"
        style={{
          fontFamily: 'Manrope-Regular',
          fontSize: 12,
          fontWeight: '400',
          color: theme.colors.error,
          marginHorizontal: 6,
        }}>
        {errorMessage}
      </StyledText>
      <StyledBottomSheet
        bottomSheetRef={bottomSheetRef}
        index={0}
        snapPoints={options.length < 5 ? ['25%'] : ['50%']}
        style={{paddingHorizontal: 15}}>
        {search && (
          <BottomSheetTextInput
            style={{marginVertical: 10}}
            placeholder="Search.."
            onChangeText={text => setSearchText(text)}
            value={searchText}
          />
        )}
        <BottomSheetFlatList
          style={{flex: 1}}
          data={searchOptions}
          keyExtractor={i => i.key}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider linear />}
        />
      </StyledBottomSheet>
    </>
  );
};

export default Select;
