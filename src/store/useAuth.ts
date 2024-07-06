import { removeAuthFromStorage, syncAuthToStorage } from '@/utils/auth';
import { create } from 'zustand';

interface UserDataI {
  id: number;
  driver: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image: string;
  token: string;
  is_email_verified: 0 | 1;
  is_phone_verified: 0 | 1;
  is_password: boolean;
  cover_images: string;
  step:
    | 'chef_complete_profile'
    | 'chef_availability'
    | 'chef_menu_management'
    | 'chef_bank_details_update'
    | 'chef_bottom_tab';
  average_rating: string;
  total_ratings: string;
}

interface useAuthI {
  isLoggedIn: boolean;
  userData: UserDataI | null;
  token: string | null;
  login: (userData: UserDataI) => void;
  logout: () => void;
}

const useAuth = create<useAuthI>(set => ({
  isLoggedIn: false,
  userData: null,
  token: null,
  login: userData => {
    set({userData, token: userData.token, isLoggedIn: true});
    syncAuthToStorage('token', userData.token);
    syncAuthToStorage('user_data', userData);
  },
  logout: () => {
    set({userData: null, token: null, isLoggedIn: false});
    removeAuthFromStorage();
  },
}));

export default useAuth;
export type { UserDataI, useAuthI };
