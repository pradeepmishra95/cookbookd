import Logo from '@/assets/images/custom/Logo';
import BottomLeft from '@/assets/images/splash/bottom_left.svg';
import BottomRight from '@/assets/images/splash/bottom_right.svg';
import TopSVG from '@/assets/images/splash/top.svg';
import useAuth from '@/store/useAuth';
import useTheme from '@/store/useTheme';
import {checkStoredAuth} from '@/utils/auth';
import {cacheAddressesAtAppStart, cacheRequestsAtAppStart} from '@/utils/cache';
import {checkStoredTheme} from '@/utils/theme';
import {useEffect} from 'react';
import {Dimensions, StatusBar, Text, View} from 'react-native';
import {getVersion} from 'react-native-device-info';

const SplashScreen = ({
  setSplashLoading,
}: {
  setSplashLoading: React.Dispatch<boolean>;
}) => {
  const {height} = Dimensions.get('screen');
  const setTheme = useTheme(state => state.setTheme);
  const login = useAuth(state => state.login);

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        await checkStoredTheme(setTheme);
        await checkStoredAuth(login);
        await cacheAddressesAtAppStart();
        await cacheRequestsAtAppStart();
        setSplashLoading(false);
      })();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View tw="flex-1 justify-center items-center bg-white" style={{height}}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <TopSVG viewBox="0 0 216 152" className="absolute top-0 left-0" />
      <Logo />
      <BottomLeft tw="absolute bottom-0 left-0" />
      <BottomRight tw="absolute bottom-0  right-0" />
      <Text tw="absolute bottom-[20px] text-black">Version {getVersion()}</Text>
    </View>
  );
};

export default SplashScreen;
