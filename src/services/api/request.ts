import useAuth from '@/store/useAuth';
import useCache from '@/store/useCache';
import {showToast} from '@/utils/Toaster';
import {checkURLToCache} from '@/utils/cache';
import axios, {AxiosResponse} from 'axios';
import HttpStatusCode from './HttpStatusCode';
import client from './client';

type ResponseI<T, Success = true> = {
  data: T;
  message: string;
  success: Success;
};

type ResponseErrorType = {
  [key: string]: string[];
};

const formatError = (E: ResponseI<ResponseErrorType, false>) => {
  if (E.data) {
    return Object.keys(E.data)
      .map(key => {
        const errors = E.data[key];
        // Check if errors is an array before using map
        if (Array.isArray(errors)) {
          return `${errors.map(error => `- ${error}`).join('\n')}`;
        } else {
          return `- ${errors}`; // Handle the case where errors is not an array
        }
      })
      .join('\n');
  } else {
    return E.message ?? 'An unknown error has occurred';
  }
};


const request = <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  params?: object,
  requestData?: object,
  useCacheStore?: boolean,
  useToken?: boolean,
  showError?: boolean,
  token?: string,
) =>
  (async () => {
    try {
      const {getCache, setCache} = useCache.getState();
      const isURLCachable = checkURLToCache(url);
      if ((useCacheStore ?? true) && isURLCachable) {
        const cache = getCache<T>(url);
        if (cache) {
          console.log('used cacheee');

          return {
            data: {
              data: JSON.parse(JSON.stringify(cache)) as T,
              success: true,
              message: '',
            },
            status: 200,
            HttpStatusCode,
          };
        }
      }
      const response: AxiosResponse = await client({
        method,
        url,
        data: method === 'GET' ? undefined : requestData,
        params,
        token:
          useToken !== false ? token ?? useAuth.getState().token : undefined,
        headers: {
          'Content-Type':
            requestData instanceof FormData
              ? 'multipart/form-data'
              : 'application/json',
        },
      });

      const {data, status}: {data: ResponseI<T>; status: number} = response;
      if (isURLCachable) setCache(url, JSON.parse(JSON.stringify(data.data)));
      return {
        data,
        status,
        HttpStatusCode,
      };
    } catch (err: any) {
      // const error = err as AxiosError
      if (!axios.isAxiosError(err)) {
        if (showError !== false) {
          showToast({
            message: 'Ops! An Error has occurred!',
            description:
              'An unexpected error has occurred while processing your request!',
            type: 'error',
          });
        }
        return {
          status: undefined,
          HttpStatusCode,
          data: {success: false, data: null},
        };
      }
      const data = err.response?.data as ResponseI<ResponseErrorType, false>;
      if (showError !== false && data) {
        showToast({
          message: 'Ops! An Error has occurred!',
          description: formatError(data),
          type: 'error',
        });
      }
      return {
        status: err.response?.status,
        HttpStatusCode,
        data,
      };
    }
  })();

export {formatError};
export type {ResponseErrorType, ResponseI};
export default request;
