import axios from 'axios';

import { NON_AUTHORIZATION_APIS } from './constants/ApiConstants';

const requestHandler = (request) => {
  if (!NON_AUTHORIZATION_APIS.includes(request.url)) {
    if (
      (request.url.includes('/customer-onboarding/') &&
        !request.url.includes('/account-summary/')) ||
      request.url.includes('/assigned-choose-delegate/')
    ) {
      delete request.headers.Authorization;
    } else {
      let token = localStorage.getItem('token');
      token = token || '';
      request.headers.Authorization = `Token ${token}`;
    }
    const ifMatch = localStorage.getItem('match');
    if (ifMatch) {
      request.headers['If-Match'] = ifMatch;
      delete request.headers.Authorization;
    }
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
      //  window.location.href = PATH_LOGIN;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
