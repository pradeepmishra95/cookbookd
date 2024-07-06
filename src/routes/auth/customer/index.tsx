import Orders from '@/screens/auth/chef/BottomTab/Orders';
import Account from '@/screens/auth/customer/BottomTab/Account';
import EditProfile from '@/screens/auth/customer/BottomTab/Account/EditProfile';
import Settings from '@/screens/auth/customer/BottomTab/Account/Settings';
import Favorites from '@/screens/auth/customer/BottomTab/Favorites';
import Home from '@/screens/auth/customer/BottomTab/Home';
import TabBar from '@/screens/auth/customer/BottomTab/TabBar';
import ChefProfile from '@/screens/auth/customer/ChefProfile.tsx';
import Followers from '@/screens/auth/customer/ChefProfile.tsx/Followers';
import LiveChefs from '@/screens/auth/customer/LiveChefs';
import Menu from '@/screens/auth/customer/Menu';
import MenuDetails from '@/screens/auth/customer/Menu/MenuDetails';
import MenuSearch from '@/screens/auth/customer/Menu/MenuSearch';
import Search from '@/screens/auth/customer/Search';
import TopRatedChefs from '@/screens/auth/customer/TopRatedChefs';
import TopRatedChefsSearch from '@/screens/auth/customer/TopRatedChefs/Search';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@rneui/themed';
import renderCommonAuthRoutes from '../common';
import { CustomerBottomTabParamListType } from './types';
import PopularCuisines from '@/screens/auth/customer/PopularCuisines';
import SavedPost from '@/screens/auth/customer/BottomTab/Account/Saved';

const BottomTab = () => {
  const BottomTab = createBottomTabNavigator<CustomerBottomTabParamListType>();
  const {theme} = useTheme();
  return (
    <BottomTab.Navigator
      tabBar={TabBar}
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: theme.colors.background,
        tabBarInactiveTintColor: theme.colors.bottomTabInactive,
        tabBarActiveTintColor: theme.colors.primary,
      }}>
      <BottomTab.Screen name="home" component={Home} />
      <BottomTab.Screen name="orders" component={Orders} />
      <BottomTab.Screen name="favorites" component={Favorites} />
      <BottomTab.Screen name="account" component={Account} />
    </BottomTab.Navigator>
  );
};
const renderAuthRoutes = (RootStack: any) => {
  return (
    <>
      <RootStack.Screen name="customer_bottom_tab" component={BottomTab} />

      {/* Render Common Auth Routes */}
      {renderCommonAuthRoutes(RootStack)}
      {/* --- */}
      <RootStack.Screen name="customer_edit_profile" component={EditProfile} />
      <RootStack.Screen name="customer_settings" component={Settings} />
      <RootStack.Screen name="saved_post" component={SavedPost} />
      <RootStack.Screen name="customer_chef_profile" component={ChefProfile} />
      <RootStack.Screen name="customer_search" component={Search} />
      <RootStack.Screen name="customer_menu" component={Menu} />
      <RootStack.Screen name="customer_menu_search" component={MenuSearch} />
      <RootStack.Screen name="customer_followers" component={Followers} />
      <RootStack.Screen name="Home" component={Home} />
      <RootStack.Screen name="customer_popular_cuisines" component={PopularCuisines}/>
      <RootStack.Screen
        name="customer_top_rated_chefs"
        component={TopRatedChefs}
      />
      <RootStack.Screen
        name="customer_top_rated_chefs_search"
        component={TopRatedChefsSearch}
      />
      <RootStack.Screen name="customer_menu_details" component={MenuDetails} />
      <RootStack.Screen name="customer_live_chefs" component={LiveChefs} />
    </>
  );
};
export default renderAuthRoutes;
