import Availibality from '@/screens/auth/chef/Availibility';
import Account from '@/screens/auth/chef/BottomTab/Account';
import Home from '@/screens/auth/chef/BottomTab/Home';
import Menu from '@/screens/auth/chef/BottomTab/Menu';
import MenuSearch from '@/screens/auth/chef/BottomTab/MenuSearch';
import Orders from '@/screens/auth/chef/BottomTab/Orders';
import OrderDetails from '@/screens/auth/chef/BottomTab/Orders/OrderDetails';
import TabBar from '@/screens/auth/chef/BottomTab/TabBar';
import EditProfile from '@/screens/auth/chef/EditProfile';
import GoLive from '@/screens/auth/chef/GoLive';
import ManageFollowers from '@/screens/auth/chef/ManageFollowers';
import CompleteProfile from '@/screens/auth/chef/Onboarding/CompleteProfile';
import MenuManagement from '@/screens/auth/chef/Onboarding/Menu/MenuManagement';
import AddMenu from '@/screens/auth/chef/Onboarding/Menu/MenuUpdate';
import PostUpdate from '@/screens/auth/chef/PostUpdate';
import Settings from '@/screens/auth/chef/Settings';
import BankDetailsManagement from '@/screens/auth/chef/Settings/BankDetails/BankDetailsManagement';
import BankDetailsUpdate from '@/screens/auth/chef/Settings/BankDetails/BankDetailsUpdate';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '@rneui/themed';
import renderCommonAuthRoutes from '../common';
import {ChefBottomTabParamListType} from './types';

const BottomTab = () => {
  const BottomTab = createBottomTabNavigator<ChefBottomTabParamListType>();
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
      <BottomTab.Screen name="menu" component={Menu} />
      <BottomTab.Screen name="account" component={Account} />
    </BottomTab.Navigator>
  );
};

const renderAuthRoutes = (RootStack: any) => {
  return (
    <>
      {/* Normal Routes */}
      <RootStack.Screen name="chef_bottom_tab" component={BottomTab} />
      <RootStack.Screen name="chef_availability" component={Availibality} />
      <RootStack.Screen name="chef_edit_profile" component={EditProfile} />
      <RootStack.Screen
        name="chef_manage_followers"
        component={ManageFollowers}
      />
      <RootStack.Screen name="chef_post_update" component={PostUpdate} />
      <RootStack.Screen name="chef_menu_search" component={MenuSearch} />
      {/* --- */}

      {/* Onboarding Screens */}
      <RootStack.Screen
        name="chef_complete_profile"
        component={CompleteProfile}
      />
      <RootStack.Screen
        name="chef_menu_management"
        component={MenuManagement}
      />
      <RootStack.Screen name="chef_menu_update" component={AddMenu} />

      {/* --- */}

      {/* Settings Screens */}
      <RootStack.Screen name="chef_settings" component={Settings} />
      <RootStack.Screen
        name="chef_bank_details_management"
        component={BankDetailsManagement}
      />
      <RootStack.Screen
        name="chef_bank_details_update"
        component={BankDetailsUpdate}
      />
      {/* --- */}

      {/* Order Screens */}
      <RootStack.Screen name="chef_order_details" component={OrderDetails} />
      {/* --- */}

      <RootStack.Screen name="chef_go_live" component={GoLive} />

      {/* Render Common Auth Routes */}
      {renderCommonAuthRoutes(RootStack)}
      {/* --- */}
    </>
  );
};
export default renderAuthRoutes;
