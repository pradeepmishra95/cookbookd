import '@rneui/themed';
import {StyleProp, TextStyle} from 'react-native';

declare module '@rneui/themed' {
  export interface TextProps {
    h5?: boolean;
    h5Style?: StyleProp<TextStyle>;
  }
  export interface Colors {
    yellow: string;
    green: string;
    badgeOutline: string;
    handleColor: string;
    dividerColor: string;
    lightText: string;
    bottomTabInactive: string;
    lightBg: string;
  }
  export interface ComponentTheme {
    Text: Partial<TextProps>;
  }
}
