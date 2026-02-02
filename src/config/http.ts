import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { Platform } from 'react-native';
import urls from './urls';

export const getRequestLog = (config: AxiosRequestConfig, moreData?: object) =>
  JSON.stringify(
    {
      method: config?.method?.toUpperCase(),
      url: axios.getUri(config),
      headers: {
        ...config?.headers,
        ...(config?.headers?.Authorization && {
          Authorization: 'Bearer [REDACTED]',
        }),
      },
      params: config?.params,
      data: config?.data,
      ...moreData,
    },
    null,
    2,
  );

// Main authenticated HTTP instance (for auth endpoints with /api prefix)
const http = axios.create({
  baseURL: urls.serviceUrl,
  headers: {
    mobile_app: true,
    device_source: Platform.OS,
  },
});

// Set the token before requests (only for authenticated instance)
http.interceptors.request.use(async config => {
  const newConfig = { ...config };
  newConfig.headers = new axios.AxiosHeaders({
    ...config?.headers,
  });

  newConfig.params = {
    ...(config.params || {}),
    key: 'X099S4DNJ8HJ',
    format: 'json',
  };

  return newConfig;
});

const responseHandler = (res: AxiosResponse) => res;

const errorHandler = async (error: any) => {
  console.log(
    '<--- ERROR RESPONSE HANDLER ---> ',
    getRequestLog(error.config, {
      status: error?.response?.status,
      data: error?.response?.data,
    }),
  );
  return Promise.reject(error);
};

http.interceptors.response.use(responseHandler, errorHandler);

export { http };
