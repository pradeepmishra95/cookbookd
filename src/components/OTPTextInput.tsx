import {StyledInput, StyledText, StyledView} from '@/components';
import isNum from '@/utils/isNum';
import {useTheme} from '@rneui/themed';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Keyboard, TextInput, TouchableOpacity, ViewProps} from 'react-native';

type OTPTextInputPropsType = {
  size?: number;
  verified?: boolean;
};

type OTPTextInput = {
  value: string;
  focus: () => void;
  blur: () => void;
};

interface initialStateI {
  value: string[];
  focused: boolean;
}

const initialState: initialStateI = {
  value: [],
  focused: false,
};

const DEFAULT_OTP_SIZE = 6;

const OTPTextInput = forwardRef(
  (
    {size, verified, ...props}: OTPTextInputPropsType & ViewProps,
    ref: React.ForwardedRef<OTPTextInput>,
  ) => {
    const [state, setState] = useState(initialState);
    const {theme} = useTheme();
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      Keyboard.removeAllListeners('keyboardDidHide');
      if (typeof verified === 'undefined' || !verified)
        Keyboard.addListener('keyboardDidHide', () => {
          inputRef.current?.blur();
        });
    }, [verified]);

    useImperativeHandle(
      ref,
      () => ({
        value: state.value.join(''),
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
      }),
      [state.value, inputRef],
    );

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={typeof verified === 'undefined' ? false : verified}
        onPress={() => {
          if (inputRef && !inputRef.current?.isFocused()) {
            inputRef.current?.focus();
          }
        }}>
        <StyledView tw="w-full flex-row justify-evenly" {...props}>
          <StyledInput
            tw="w-full hidden"
            ref={inputRef}
            disabled={typeof verified === 'undefined' ? false : verified}
            onFocus={() => setState(prev => ({...prev, focused: true}))}
            onBlur={() => setState(prev => ({...prev, focused: false}))}
            inputContainerStyle={{display: 'none'}}
            containerStyle={{display: 'none'}}
            keyboardType="numeric"
            value={state.value.join('')}
            onKeyPress={event => {
              const {key} = event.nativeEvent;
              if (
                state.value.length < (size ?? DEFAULT_OTP_SIZE) ||
                key === 'Backspace'
              ) {
                if (key === 'Backspace') {
                  setState(prev => ({
                    ...prev,
                    value: prev.value.slice(0, prev.value.length - 1),
                  }));
                } else if (isNum(key)) {
                  setState(prev => ({
                    ...prev,
                    value: [...prev.value, key],
                  }));
                }
              }
            }}
          />
          {[...Array(size ?? DEFAULT_OTP_SIZE).keys()].map((_, i) => (
            <StyledView
              tw="justify-center items-center"
              style={{
                backgroundColor: theme.colors.grey0,
                borderWidth: 2,
                borderRadius: 5,
                height: 50,
                width: 50,
                borderColor:
                  verified !== true
                    ? state.focused &&
                      (state.value.length === i ||
                        ((size ?? DEFAULT_OTP_SIZE) === i + 1 &&
                          state.value.length >= i + 1))
                      ? theme.colors.primary
                      : 'transparent'
                    : theme.colors.success,
              }}
              key={i}>
              <StyledText h2>
                {state.value.length > i ? state.value[i] : ''}
              </StyledText>
            </StyledView>
          ))}
        </StyledView>
      </TouchableOpacity>
    );
  },
);

export default OTPTextInput;
