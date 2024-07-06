import storageKeys from '@/constants/storageKeys';
import {useThemeI} from '@/store/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appearance, ColorSchemeName} from 'react-native';

const checkStoredTheme = async (setTheme: useThemeI['setTheme']) => {
  try {
    let userTheme = (await AsyncStorage.getItem(
      storageKeys.theme,
    )) as ColorSchemeName;
    if (!userTheme) {
      userTheme = Appearance.getColorScheme();
    }
    setTheme(userTheme ?? 'light');
  } catch (e) {
    console.log(e);
  }
};

const syncThemeToStorage = async (theme: NonNullable<ColorSchemeName>) => {
  try {
    await AsyncStorage.setItem(storageKeys.theme, theme);
  } catch (e) {
    console.log(e);
  }
};

export {checkStoredTheme, syncThemeToStorage};
