import axios from 'axios';
import {getBaseURL} from './base';

const client = axios.create({
  baseURL: getBaseURL(),
});

client.interceptors.request.use(request => {
  // Uncomment when necessary
  // console.log({url: request.url, params: request.params, data: request.data});
  const {token} = request;
  if (token) request.headers.setAuthorization(`Bearer ${token}`, true);
  request.headers.set('X-TIMEZONE-OFFSET', new Date().getTimezoneOffset());
  console.log('headers >> ', request.headers);

  return request;
});

client.interceptors.response.use(
  response => {
    // Uncomment when necessary
    console.log('success >> ');
    console.log({
      url: response.request.responseURL,
      response: response.data,
      status: response.status,
    });
    return response;
  },
  error => {
    console.log('error >> ');
    console.log({
      url: error?.request?.responseURL,
      response: error.response?.data,
      status: error?.response?.status,
    });
    return Promise.reject(error);
  },
);

export default client;
