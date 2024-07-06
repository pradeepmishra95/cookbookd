import {StyledText, StyledView} from '@/components';
import {useTheme} from '@rneui/themed';
import {TextProps, ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type DividerPropsWithTitleType = {
  linear?: false;
  heading?: string;
  gap?: number;
  height?: number;
  childProps?: ViewProps;
  headingProps?: TextProps;
} & ViewProps;

type DividerPropsGradientType = {
  linear: true;
  height?: number;
  heading?: undefined;
  gap?: undefined;
  childProps?: undefined;
  headingProps?: undefined;
} & ViewProps;

const Divider = ({
  linear,
  height,
  ...props
}: DividerPropsGradientType | DividerPropsWithTitleType) => {
  const {theme} = useTheme();
  if (linear)
    return (
      <StyledView tw="w-full items-center">
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          {...props}
          style={[{width: '70%', height: height ?? 2}, props.style]}
          colors={['#FFFFFF00', theme.colors.dividerColor, '#FFFFFF00']}
        />
      </StyledView>
    );

  const {heading, gap, childProps, headingProps} = props;
  return (
    <StyledView
      tw="w-full flex-row items-center"
      {...props}
      style={[heading ? {gap: gap ?? 10} : {}, props?.style]}>
      <StyledView
        tw="flex-1"
        {...childProps}
        style={[
          {
            height: height ?? 2,
            backgroundColor: theme.colors.grey5,
          },
          childProps?.style,
        ]}
      />
      {heading ? (
        <>
          <StyledText
            {...headingProps}
            h4
            // h4Style={{fontFamily: 'Manrope-ExtraLight'}}
            style={[
              {
                color: theme.colors.grey5,
              },
              headingProps?.style,
            ]}>
            {heading}
          </StyledText>
          <StyledView
            tw="flex-1"
            {...childProps}
            style={[
              {
                height: height ?? 2,
                backgroundColor: theme.colors.grey5,
              },
              childProps?.style,
            ]}
          />
        </>
      ) : null}
    </StyledView>
  );
};

export default Divider;
