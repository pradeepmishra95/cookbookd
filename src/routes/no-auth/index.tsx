import ForgotPassword from '@/screens/no-auth/ForgotPassword';
import CreateNewPassword from '@/screens/no-auth/ForgotPassword/CreateNewPassword';
import Login from '@/screens/no-auth/Login';
import Onboarding from '@/screens/no-auth/Onboarding';
import CreateAccount from '@/screens/no-auth/registration/CreateAccount';
import {Platform} from 'react-native';

const renderNoAuthRoutes = (RootStack: any) => {
  return (
    <>
      <RootStack.Screen
        name="onboarding"
        component={Onboarding}
        options={Platform.OS === 'android' ? {statusBarStyle: 'light'} : {}}
      />
      <RootStack.Screen name="login" component={Login} />
      <RootStack.Screen name="create_account" component={CreateAccount} />
      <RootStack.Screen name="forgot_password" component={ForgotPassword} />
      <RootStack.Screen
        name="create_new_password"
        component={CreateNewPassword}
      />
    </>
  );
};
export default renderNoAuthRoutes;
