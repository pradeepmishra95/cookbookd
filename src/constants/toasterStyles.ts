import {MessageOptions} from 'react-native-flash-message';

type toasterStylesType = {
  success: Pick<MessageOptions, 'style' | 'textStyle' | 'titleStyle'>;
  error: Pick<MessageOptions, 'style' | 'textStyle' | 'titleStyle'>;
};

const defaultStyles: Pick<
  MessageOptions,
  'style' | 'textStyle' | 'titleStyle'
> = {
  style: {
    borderRadius: 15,
    paddingRight: 0,
    paddingVertical: 0,
    borderWidth: 2,
    gap: 15,
    alignItems: 'center',
  },
  titleStyle: {
    paddingTop: 25,
    fontSize: 16,
    fontFamily: 'Manrope-SemiBold', // 600
    fontWeight: '600',
    color: '#000',
  },
  textStyle: {
    paddingBottom: 25,
    fontSize: 12,
    marginRight: 15,
    fontFamily: 'Manrope-Medium', // 500
    fontWeight: '500',
    color: '#000',
  },
};

const toasterStyles: toasterStylesType = {
  success: {
    ...defaultStyles,
    style: [
      defaultStyles.style,
      {backgroundColor: '#F0FFFA', borderColor: '#08CB66'},
    ],
  },
  error: {
    ...defaultStyles,
    style: [
      defaultStyles.style,
      {backgroundColor: '#fff8e5', borderColor: '#EA2D29'},
    ],
  },
};

export default toasterStyles;
