import request from '@/services/api/request';
import urls from './urls';

const config = {
  AGORA_APP_ID: '41fbad332edf47fbae0c9a8d5a20ce9b',
  GOOGLE_MAP_KEY: 'AIzaSyCXM2CVmVkOsoIj3G7ZHnvZX-GycYcXMeU',
  CACHED_URLS: [
    urls.auth.common.constants.country,
    urls.auth.common.constants.account_type,
    urls.auth.common.constants.category,
    urls.auth.common.constants.cuisine,
  ],
  APP_START_CACHED_URLS: <Parameters<typeof request>[]>[
    ['GET', urls.auth.common.constants.category],
    ['GET', urls.auth.common.constants.cuisine],
  ],
};

export default config;
