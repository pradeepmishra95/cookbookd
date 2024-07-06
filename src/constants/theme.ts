import {CreateThemeOptions} from '@rneui/themed';

const theme: CreateThemeOptions = {
  lightColors: {
    primary: '#EA2D29',
    background: '#ffffff',
    secondary: '#1B1B1B',
    searchBg: '#727272',
    grey0: '#F4F4F4',
    grey5: '#727272',
    greyOutline: '#ECECEC',
    yellow: '#FFB500',
    green: '#39BB5D',
    badgeOutline: '#FFFFFF',
    handleColor: '#D9D9D9',
    dividerColor: '#E6E6E6',
    lightText: '#727272',
    bottomTabInactive: '#8F959D',
    lightBg: '#fbfcff',
  },
  darkColors: {
    primary: '#EA2D29',
    background: '#0d0d0f',
    secondary: '#35353C',
    searchBg: '#1F1F23',
    grey0: '#1F1F23',
    grey5: '#828998',
    greyOutline: '#35353C',
    yellow: '#FFB500',
    green: '#39BB5D',
    badgeOutline: '#3D3D43',
    handleColor: '#727272',
    dividerColor: '#666673',
    lightText: '#828998',
    bottomTabInactive: '#8F959D',
    lightBg: '#1a1b1e',
  },
  components: {
    Input: (props, theme) => ({
      placeholderTextColor: theme.colors.black,
      inputContainerStyle: {
        borderRadius: 8,
        borderBottomWidth: 0,
        backgroundColor: theme.colors.grey0,
        padding: 2,
      },
      inputStyle: {
        fontFamily: 'Manrope-Regular',
        fontSize: 14,
        fontWeight: '400',
      },
      leftIconContainerStyle: {
        paddingLeft: 10,
      },
      rightIconContainerStyle: {
        paddingRight: 10,
      },
      errorStyle: {
        fontFamily: 'Manrope-Regular',
        fontSize: 12,
        fontWeight: '400',
        marginBottom: 0,
        marginHorizontal: 6,
      },
      errorProps: {tw: 'mt-2'},
    }),
    Text: props => ({
      style: props.h5 ? [props.h5Style, props.style] : [props.style],
      h1Style: {
        fontSize: 20,
        fontFamily: 'Manrope-SemiBold', // 600
        fontWeight: '600',
      },
      h2Style: {
        fontSize: 18,
        fontFamily: 'Manrope-SemiBold', // 600
        fontWeight: '600',
      },
      h3Style: {
        fontSize: 16,
        fontFamily: 'Manrope-SemiBold', // 600
        fontWeight: '600',
      },
      h4Style: {
        fontSize: 14,
        fontFamily: 'Manrope-SemiBold', // 600
        fontWeight: '600',
      },
      h5Style: {
        fontSize: 10,
        fontFamily: 'Manrope-Medium', // 500
        fontWeight: '500',
      },
    }),
    Button: (props, theme) => ({
      titleStyle: {
        fontSize: 18,
        fontFamily: 'Manrope-Bold', // 700
      },
      buttonStyle: {
        borderRadius: 8,
        paddingVertical: 10,
      },
      disabledStyle: {
        backgroundColor: theme.colors.greyOutline,
      },
      loadingProps: {
        color: theme.colors.black,
      },
    }),
    Skeleton: () => ({animation: 'wave'}),
  },
};
export default theme;
