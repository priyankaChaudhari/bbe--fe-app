/* eslint-disable prefer-destructuring */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-lonely-if */
/* eslint no-shadow: "off" */

import queryString from 'query-string';

import * as actionTypes from './actionTypes';
import axiosInstance from '../../axios';
import { updateUserMe } from '../../api';
import {
  API_LOGIN,
  API_USER_ME,
  API_LOGOUT,
  PATH_LOGIN,
  PATH_CUSTOMER_LIST,
  PATH_CUSTOMER_DETAILS,
  PATH_COMPANY_DETAILS,
  PATH_AMAZON_MERCHANT,
  PATH_SUMMARY,
  PATH_BILLING_DETAILS,
  PATH_ACCOUNT_SETUP_CHOOSE,
  // PATH_BBE_GOAL_DASHBOARD,
  dashboardRolePaths,
} from '../../constants';

export const userRequestInitiated = () => {
  return {
    type: actionTypes.USER_REQUEST_INITIATED,
  };
};

export const userRequestFail = (error, type) => {
  if (type === 'logout') {
    if (error && error.response && error.response.status === 401) {
      window.location.href = PATH_LOGIN;
    }
  }
  return {
    type: actionTypes.USER_REQUEST_FAIL,
    error,
  };
};

export const userMeSuccess = (data, type, history) => {
  if (data.data.role.includes('Customer')) {
    localStorage.setItem('role', data.data.role);
    localStorage.setItem('step', JSON.stringify(data.data.step));
  }
  if (type === 'step') {
    history.push(PATH_COMPANY_DETAILS);
  }
  return {
    type: actionTypes.USER_ME_SUCCESS,
    payload: data,
  };
};

export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('agreementID');
  localStorage.removeItem('email');
  localStorage.removeItem('customer');
  localStorage.removeItem('match');
  localStorage.removeItem('filters');
  localStorage.removeItem('role');
  localStorage.removeItem('step');
  localStorage.removeItem('page');
  localStorage.removeItem('noteFilters');
  localStorage.removeItem('bgs');
  window.location.href = PATH_LOGIN;
};

export const userRequestSuccess = (data, history, customer, onboardingId) => {
  const params = queryString.parse(history.location.search);
  localStorage.removeItem('email');
  localStorage.setItem('token', data.token);

  if (params?.callback) {
    if (params?.customer && params?.step) {
      if ((data.user.step !== null && data.user.step[params.customer]) === 6) {
        history.push(PATH_CUSTOMER_DETAILS.replace(':id', params.customer));
      } else {
        history.push({ pathname: params.callback, search: 'openCollapse' });
      }
      if (params.step === 6) {
        history.push(PATH_CUSTOMER_DETAILS.replace(':id', params.customer));
      }
    } else {
      history.push(params.callback);
    }
  } else {
    if (
      data.user.role.includes('Customer') &&
      data.user.customer &&
      data.user.customer.length === 0
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('customer');
      localStorage.removeItem('match');
      localStorage.removeItem('filters');
      localStorage.removeItem('role');
      localStorage.removeItem('step');
      history.push({
        pathname: PATH_ACCOUNT_SETUP_CHOOSE,
        search: `alreadyAssigned=true&first_name=${
          data.user && data.user.re_assigned_user_details.first_name
        }&last_name=${
          data.user && data.user.re_assigned_user_details.last_name
        }&email=${data.user.re_assigned_user_details.email}`,
      });
    }

    let id = '';
    if (
      data?.user?.customer !== null &&
      typeof data?.user?.customer === 'object'
    ) {
      const customerId = data?.user?.customer_onboarding?.find(
        (op) => Object.keys(op)[0] === onboardingId,
      );
      id = Object.values(customerId)[0];
      localStorage.setItem('customer', Object.values(customerId)[0]);
    } else {
      id =
        data.user.step &&
        Object.keys(data.user.step)?.find(
          (op) => op === (customer.customer || data?.user?.customer),
        );
      localStorage.setItem('customer', customer.customer);
    }

    if (data?.user?.role?.includes('Customer')) {
      if (data?.user?.customer_onboarding === null) {
        clearToken();
      } else {
        if (!id) {
          history.push(PATH_COMPANY_DETAILS);
        } else {
          if (!data.user.step || !data.user.step[id]) {
            history.push(PATH_COMPANY_DETAILS);
            const detail = { step: { ...data.user.step, [id]: 1 } };
            updateUserMe(data.user.id, detail).then((user) => {
              if (user?.status === 200) {
                history.push(PATH_COMPANY_DETAILS);
              }
            });
          }
          if (data.user.step[id] === 1) {
            history.push(PATH_COMPANY_DETAILS);
          }
          if (data.user.step[id] === 2) {
            history.push(PATH_BILLING_DETAILS);
          }
          if (data.user.step[id] === 3) {
            history.push(PATH_AMAZON_MERCHANT);
          }
          // if (data.user.step[id] === 4) {
          //   history.push(PATH_AMAZON_ACCOUNT);
          // }
          if (data.user.step[id] === 4 || data.user.step[id] === 5) {
            history.push(PATH_SUMMARY);
          }
          if (data.user.step[id] === 6) {
            history.push(
              PATH_CUSTOMER_DETAILS.replace(
                ':id',
                customer.customer || data.user.customer,
              ),
            );
          }
        }
      }
    } else {
      if (Object.keys(dashboardRolePaths).includes(data.user.role)) {
        history.push(dashboardRolePaths[data.user.role]);
      } else history.push(PATH_CUSTOMER_LIST);
    }
    // else {
    //   if (data.user.role !== 'Customer') {
    //     history.push(PATH_BBE_GOAL_DASHBOARD);
    //   } else history.push(PATH_CUSTOMER_LIST);
    // }
  }

  return {
    type: actionTypes.USER_REQUEST_SUCCESS,
    payload: data,
  };
};

export const userMe = (history, customer) => {
  return (dispatch) => {
    axiosInstance
      .get(API_USER_ME, {
        params: customer || { customer: localStorage.getItem('customer') },
      })
      .then((data) => {
        dispatch(userMeSuccess(data, '', history));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('agreementID');
        localStorage.removeItem('email');
        localStorage.removeItem('customer');
        localStorage.removeItem('match');
        localStorage.removeItem('filters');
        localStorage.removeItem('role');
        localStorage.removeItem('step');
        localStorage.removeItem('page');
        localStorage.removeItem('bgs');
        const params = queryString.parse(history?.location.search);
        if (history.location.pathname !== '/') {
          const stringified = queryString.stringify({
            ...params,
            callback: history.location.pathname,
          });
          history.push({
            pathname: PATH_LOGIN,
            search: `${stringified}`,
          });
        } else {
          history.push(PATH_LOGIN);
        }
      });
  };
};

export const login = (history, data, customer, id) => {
  return (dispatch) => {
    dispatch(userRequestInitiated());
    axiosInstance
      .post(API_LOGIN, data, { params: customer })
      .then((data) => {
        dispatch(userRequestSuccess(data.data, history, customer, id));
        // dispatch(userMe(history, customer));
      })
      .catch((error) => {
        dispatch(userRequestFail(error, ''));
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(userRequestInitiated());
    axiosInstance
      .post(API_LOGOUT, {})
      .then(() => {
        dispatch(clearToken());
      })
      .catch((error) => {
        dispatch(userRequestFail(error, 'logout'));
      });
  };
};

export const clearErrorMessage = () => {
  return {
    type: actionTypes.CLEAR_ERROR_MESSAGE,
  };
};

export const showOnboardingMsg = (value) => {
  return {
    type: actionTypes.SHOW_FORGOT_PASSWORD_ERROR,
    showForgotMsg: value,
  };
};

export const showResetPasswordMsg = () => {
  return {
    type: actionTypes.SHOW_RESET_PASSWORD_ERROR,
    showResetMsg: true,
  };
};
