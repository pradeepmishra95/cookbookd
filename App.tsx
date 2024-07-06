import theme from '@/constants/theme';
import ChefAuthRoutesType from '@/routes/auth/chef/types';
import CommonAuthRoutesType from '@/routes/auth/common/types';
import CustomerAuthRoutesType from '@/routes/auth/customer/types';
import renderCommonRoutes from '@/routes/common';
import CommonRoutesType from '@/routes/common/types';
import renderNoAuthRoutes from '@/routes/no-auth';
import NoAuthRoutes from '@/routes/no-auth/type';
import SplashScreen from '@/screens/SplashScreen';
import { openVerfication } from '@/screens/Verification';
import WebSocketBus from '@/services/ws/WebSocketBus';
import useAuth from '@/store/useAuth';
import useTheme from '@/store/useTheme';
import Toaster from '@/utils/Toaster';
import { cacheFavoritesAtAppStart } from '@/utils/cache';
import { registerDeviceForNotification } from '@/utils/notification';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeConsumer, ThemeProvider, createTheme } from '@rneui/themed';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import Config from 'react-native-config';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type RootStackParamList = NoAuthRoutes &
  ChefAuthRoutesType &
  CommonRoutesType &
  CustomerAuthRoutesType &
  CommonAuthRoutesType;

// Global Declaration for RootParamList
// https://reactnavigation.org/docs/typescript#specifying-default-types-for-usenavigation-link-ref-etc

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const App = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  const isLoggedIn = useAuth(state => state.isLoggedIn);
  const navigationRef = createNavigationContainerRef<RootStackParamList>();
  const [splashLoading, setSplashLoading] = useState(true);
  const themeMode = useTheme(state => state.theme);
  const userData = useAuth(state => state.userData);

  let renderAuthRoutes: (RootStack: any) => React.JSX.Element;
  if (Config.USER_TYPE === 'chef') {
    renderAuthRoutes = require('@/routes/auth/chef')['default'];
  } else {
    renderAuthRoutes = require('@/routes/auth/customer')['default'];
  }

  useEffect(() => {
    if (!splashLoading) {
      if (isLoggedIn) {
        cacheFavoritesAtAppStart();
        if (userData) {
          openVerfication(userData, navigationRef as any);
        }
      } else {
        navigationRef.navigate('onboarding');
      }
    }
  }, [splashLoading, isLoggedIn]);

  useEffect(() => {
    dayjs.extend(customParseFormat);
    dayjs.extend(relativeTime);
    dayjs.extend(calendar);
    dayjs.extend(updateLocale);
    dayjs.extend(localeData);
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    registerDeviceForNotification(isLoggedIn).then(func => {
      unsubscribe = func;
    });

    return unsubscribe;
  }, [isLoggedIn]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={createTheme({...theme, mode: themeMode})}>
        <ThemeConsumer>
          {({theme}) => (
            <BottomSheetModalProvider>
              {splashLoading ? (
                <SplashScreen setSplashLoading={setSplashLoading} />
              ) : (
                <NavigationContainer ref={navigationRef}>
                  <RootStack.Navigator
                    screenOptions={{
                      headerShown: false,
                      animation: 'slide_from_right',

                      ...(Platform.OS === 'android'
                        ? {
                            statusBarStyle:
                              theme.mode === 'dark' ? 'light' : 'dark',
                            statusBarColor: 'transparent',
                            statusBarTranslucent: true,
                          }
                        : {}),
                    }}>
                    {isLoggedIn ? (
                      <>{renderAuthRoutes(RootStack)}</>
                    ) : (
                      renderNoAuthRoutes(RootStack)
                    )}
                    {renderCommonRoutes(RootStack)}
                  </RootStack.Navigator>
                  <StatusBar
                    translucent
                    barStyle={
                      theme.mode === 'dark' ? 'light-content' : 'dark-content'
                    }
                    backgroundColor={'transparent'}
                  />
                </NavigationContainer>
              )}
              <Toaster />
              {isLoggedIn && <WebSocketBus navigationRef={navigationRef} />}
            </BottomSheetModalProvider>
          )}
        </ThemeConsumer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
