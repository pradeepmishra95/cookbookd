import EnterLocation from '@/screens/EnterLocation';
import Verification from '@/screens/Verification';

const renderCommonRoutes = (RootStack: any) => {
  return (
    <>
      <RootStack.Screen
        name="verification"
        component={Verification}
        initialParams={{}}
        options={{gestureEnabled: false}}
      />
      <RootStack.Screen name="enter_location" component={EnterLocation} />
    </>
  );
};

export default renderCommonRoutes;
