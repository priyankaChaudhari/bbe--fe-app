/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { PATH_LOGIN } from './constants';
import { NON_AUTHORIZATION_APIS } from './constants/ApiConstants';

const requestHandler = (request) => {
  // if (NON_AUTHORIZATION_APIS.includes('/customer-onboarding/')) {
  //   delete request.headers.Authorization;
  //   return request;
  // }
  if (!NON_AUTHORIZATION_APIS.includes(request.url)) {
    let token = localStorage.getItem('token');
    token = token || '';
    request.headers.Authorization = `Token ${token}`;
  }
  return request;
};

const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_BASE_APP_URL + process.env.REACT_APP_API_VERSION,
});

axiosInstance.interceptors.request.use((request) => requestHandler(request));

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = PATH_LOGIN;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
