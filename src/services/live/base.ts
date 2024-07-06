import useAuth from '@/store/useAuth';
import Config from 'react-native-config';

const PROTOCOL = 'wss';
const DOMAIN = 'cookbookd.mtesthub.in';
const SUFFIX = 'websocket/comment';

const getBaseURL = (id: number) => {
  const {userData} = useAuth.getState();
  return `${PROTOCOL}://${DOMAIN}/${SUFFIX}?access_token=${userData?.token}&sender=${
    Config.USER_TYPE === 'chef' ? 1 : 0
  }`.concat(Config.USER_TYPE === 'chef' ? '' : `&chef_id=${id}`);
};

export {getBaseURL};
