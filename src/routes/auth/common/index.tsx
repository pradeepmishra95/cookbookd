import AddressManagement from '@/screens/auth/common/Address/AddressManagement';
import AddressMap from '@/screens/auth/common/Address/AddressMap';
import AddressUpdate from '@/screens/auth/common/Address/AddressUpdate';
import AllChats from '@/screens/auth/common/AllChats';
import AllComments from '@/screens/auth/common/AllComments';
import ChangePassword from '@/screens/auth/common/ChangePassword';
import Chat from '@/screens/auth/common/Chat';
import CustomerSupport from '@/screens/auth/common/CustomerSupport';
import Guideline from '@/screens/auth/common/Guideline';
import LiveStreaming from '@/screens/auth/common/LiveStreaming';
import Notification from '@/screens/auth/common/Notification';
import PostDetails from '@/screens/auth/common/PostDetails';
import Report from '@/screens/auth/common/Report';
import TermsAndConditions from '@/screens/auth/common/TermsAndConditions';
import VideoPlayer from '@/screens/auth/common/VideoPlayer';

const renderCommonAuthRoutes = (RootStack: any) => {
  return (
    <>
      <RootStack.Screen
        name="address_management"
        component={AddressManagement}
      />
      <RootStack.Screen name="address_update" component={AddressUpdate} />
      <RootStack.Screen name="address_map" component={AddressMap} />
      <RootStack.Screen name="change_password" component={ChangePassword} />
      <RootStack.Screen name="guideline" component={Guideline} />
      <RootStack.Screen
        name="terms_and_condition"
        component={TermsAndConditions}
      />
      <RootStack.Screen name="support" component={CustomerSupport} />
      <RootStack.Screen name="chat" component={Chat} />
      <RootStack.Screen name="live_streaming" component={LiveStreaming} />
      <RootStack.Screen name="notification" component={Notification} />
      <RootStack.Screen name="post_details" component={PostDetails} />
      <RootStack.Screen name="all_comments" component={AllComments} />
      <RootStack.Screen name="video_player" component={VideoPlayer} />
      <RootStack.Screen name="report" component={Report} />
      <RootStack.Screen name="all_chats" component={AllChats} />
    </>
  );
};

export default renderCommonAuthRoutes;
