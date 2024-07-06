import { PostType } from '@/components/Post';
import { NavigatorScreenParams } from '@react-navigation/native';

type AuthRoutesType = {
  customer_bottom_tab: NavigatorScreenParams<CustomerBottomTabParamListType>;
  customer_edit_profile: undefined;
  customer_settings: undefined;
  saved_post:undefined;
  customer_chef_profile: {id: number};
  customer_search: undefined;
  customer_menu: undefined;
  customer_menu_search: undefined;
  customer_followers: {id: number; followers: string};
  customer_popular_cuisines:undefined;
  customer_top_rated_chefs: undefined;
  customer_top_rated_chefs_search: undefined;
  customer_menu_details: {menu_id?: number};
  customer_live_chefs: undefined;
  Home:undefined;
};

export type CustomerBottomTabParamListType = {
  home: undefined | (Partial<PostType> & {index: number});
  orders: undefined;
  favorites: undefined;
  account: undefined;
};
export default AuthRoutesType;
