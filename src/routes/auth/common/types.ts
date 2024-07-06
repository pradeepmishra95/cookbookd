import {AddressType} from '@/screens/auth/common/Address/AddressManagement';

type AuthRouteType = {
  change_password: undefined;
  terms_and_condition: undefined;
  address_management: undefined;
  address_map: undefined | AddressType;
  address_update: undefined | AddressType;
  guideline: undefined;
  support: undefined;
  notification: undefined;
  all_comments: {index: number; type: string};
  chat: {
    id: number;
    receiver: {
      name: string;
      profile_image: string;
    };
  };
  live_streaming: {
    chefData?: {
      id: number;
      name: string;
      profile_image: string;
    };
    title: string;
    descripton: string;
  };
  post_details: {index: number; type: string};
  video_player: {uri: string};
  report: {id: number; type: 'post' | 'live_stream'};
  all_chats: undefined;
};

export default AuthRouteType;
