import {
  Button,
  ButtonProps,
  Divider,
  DividerProps,
  Input,
  InputProps,
  Text,
  TextProps,
  ThemeConsumer,
} from '@rneui/themed';
import {styled} from 'nativewind';
import React, {ReactNode} from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewProps,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PageHeader, {PageHeaderPropsType} from './PageHeader';

// StyledView

const StyledView = (props: ViewProps & {bg?: boolean}) => (
  <ThemeConsumer>
    {({theme}) => {
      return (
        <Animated.View
          {...props}
          style={[
            props.bg ? {backgroundColor: theme.colors.background} : {},
            props.style,
          ]}>
          {props.children}
        </Animated.View>
      );
    }}
  </ThemeConsumer>
);

// StyledText

const StyledText = styled(Text as React.ComponentType<TextProps>);

// Styled Button

type StyledButtonPropsType = ButtonProps & {
  twContainer?: Array<ButtonProps['containerStyle']>;
  twButton?: Array<ButtonProps['buttonStyle']>;
  twTitle?: Array<ButtonProps['titleStyle']>;
};

const StyledButtonWrapper = ({
  twButton,
  twContainer,
  twTitle,
  ...props
}: StyledButtonPropsType) => {
  return (
    <Button
      {...props}
      containerStyle={[...(twContainer ?? []), props.containerStyle]}
      titleStyle={[...(twTitle ?? []), props.titleStyle]}
      buttonStyle={[...(twButton ?? []), props.buttonStyle]}>
      {props.children}
    </Button>
  );
};

const StyledButton = styled(StyledButtonWrapper, {
  props: {
    twButton: true,
    twContainer: true,
    twTitle: true,
  },
});

// StyledInput

const StyledInput = styled(Input as React.ComponentType<InputProps>);

// StyledDivider

const StyledDivider = styled(Divider as React.ComponentType<DividerProps>);

// StyledScrollView

type StyledScrollViewPropsType = ScrollViewProps & {
  twContainer?: ScrollViewProps['contentContainerStyle'];
  bg?: boolean;
};
const StyledScrollViewWrapper = (props: StyledScrollViewPropsType) => (
  <ThemeConsumer>
    {({theme}) => {
      return (
        <ScrollView
          {...props}
          contentContainerStyle={[
            props.bg ?? true ? {backgroundColor: theme.colors.background} : {},
            props.twContainer,
            props.contentContainerStyle,
          ]}>
          {props.children}
        </ScrollView>
      );
    }}
  </ThemeConsumer>
);

const StyledScrollView = styled(StyledScrollViewWrapper, {
  props: {
    twContainer: true,
  },
});

// StyledPageView

type StyledPageViewPropsType = KeyboardAvoidingViewProps & {
  twScrollView?: Array<ScrollViewProps['style']>;
  scrollViewProps?: ScrollViewProps;
  noInsets?: boolean;
  noPadding?: boolean;
  footerComponent?: ReactNode;
  loading?: boolean;
  isScrollable?: boolean;
};

const StyledPageViewWrapper = (
  props:
    | (StyledPageViewPropsType & {
        header?: false;
      })
    | (StyledPageViewPropsType &
        PageHeaderPropsType & {
          header: true;
        }),
) => {
  const insets = useSafeAreaInsets();
  return (
    <ThemeConsumer>
      {({theme}) => (
        <KeyboardAvoidingView
          {...props}
          style={[
            {
              flex: 1,
              backgroundColor: theme.colors.background,
              paddingTop: !props.noInsets ?? false ? insets.top : 0,
              paddingBottom: !props.noInsets ?? false ? insets.bottom : 0,
            },
            props.style,
          ]}>
          {props.header ? (
            <PageHeader
              route={props.route}
              backButton={props.backButton}
              navigation={props.navigation}
              title={props.title}
              rightComponent={props.rightComponent}
            />
          ) : null}
          <StyledView tw="flex-1">
            {props.isScrollable ?? true ? (
              <StyledScrollView
                twContainer="justify-center items-center"
                keyboardShouldPersistTaps="handled"
                {...props.scrollViewProps}
                contentContainerStyle={[
                  {
                    paddingHorizontal: !props.noPadding ?? false ? 15 : 0,
                    minHeight: '100%',
                  },
                  props.twScrollView,
                ]}>
                {props.children}
              </StyledScrollView>
            ) : (
              <StyledView
                tw={`flex-1 ${props.twScrollView}`}
                style={[props.style]}>
                {props.children}
              </StyledView>
            )}
          </StyledView>
          {props.footerComponent ? props.footerComponent : null}

          {props.loading === true && (
            <>
              <StyledView
                style={[
                  StyleSheet.absoluteFill,
                  {backgroundColor: '#000', opacity: 0.3},
                ]}
                tw="justify-center items-center"
              />
              <StyledView
                style={[StyleSheet.absoluteFill]}
                tw="justify-center items-center bg-transparent">
                <StyledButton
                  loading
                  loadingProps={{size: 40}}
                  twButton={'bg-transparent'}
                />
              </StyledView>
            </>
          )}
        </KeyboardAvoidingView>
      )}
    </ThemeConsumer>
  );
};

const StyledPageView = styled(StyledPageViewWrapper, {
  props: {
    twScrollView: true,
  },
});

export {
  StyledButton,
  StyledDivider,
  StyledInput,
  StyledPageView,
  StyledScrollView,
  StyledText,
  StyledView,
};





