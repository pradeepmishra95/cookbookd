/// <reference types="nativewind/types" />

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ID?: string;
    APP_NAME?: string;
    VERSION_CODE?: string;
    VERSION_NAME?: string;
    USER_TYPE?: 'chef' | 'customer';
  }

  export const Config: NativeConfig;
  export default Config;
}
