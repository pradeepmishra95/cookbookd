import {PostType} from '@/components/Post';
import {ProfileData} from '@/screens/auth/chef/BottomTab/Account';
import {MenuType} from '@/screens/auth/chef/Onboarding/Menu/MenuUpdate';
import {BankDetails} from '@/screens/auth/chef/Settings/BankDetails/BankDetailsUpdate';
import {NavigatorScreenParams} from '@react-navigation/native';

type AuthRoutesType = {
  chef_bottom_tab: NavigatorScreenParams<ChefBottomTabParamListType>;
  chef_complete_profile: undefined;
  chef_availability:
    | undefined
    | {
        title: string;
        mode: 'page';
      };
  chef_menu_management: undefined;
  chef_menu_update: undefined | MenuType;
  chef_bank_details_management: undefined;
  chef_bank_details_update:
    | {showProgressFooter?: boolean; id?: undefined}
    | (BankDetails & {showProgressFooter?: never});
  chef_settings: undefined;
  chef_bank_details: undefined;
  chef_manage_followers: {
    followers: string;
  };
  chef_order_details: {
    customer_name: string;
  };
  chef_edit_profile: ProfileData['user_details'];
  chef_post_update: undefined | PostType;
  chef_menu_search: undefined;
  chef_go_live: undefined;
};

export type ChefBottomTabParamListType = {
  home: undefined | {refresh: boolean};
  orders: undefined;
  menu: undefined;
  account: undefined;
};

export default AuthRoutesType;
