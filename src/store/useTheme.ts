import {syncThemeToStorage} from '@/utils/theme';
import {ColorSchemeName} from 'react-native';
import {create} from 'zustand';

interface useThemeI {
  theme: NonNullable<ColorSchemeName>;
  toggleTheme: () => void;
  setTheme: (theme: NonNullable<ColorSchemeName>) => void;
}

const useTheme = create<useThemeI>((set, get) => ({
  theme: 'light',
  toggleTheme: () => {
    const theme = get().theme == 'dark' ? 'light' : 'dark';
    set({theme});
    syncThemeToStorage(theme);
  },
  setTheme: theme => {
    set({theme});
    syncThemeToStorage(theme);
  },
}));

export default useTheme;
export type {useThemeI};
