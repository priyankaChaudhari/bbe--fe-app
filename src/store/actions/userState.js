/* eslint no-shadow: "off" */

import axiosInstance from '../../axios';
import {
  API_LOGIN,
  API_USER_ME,
  API_LOGOUT,
} from '../../constants/ApiConstants';
import {
  PATH_LOGIN,
  PATH_CUSTOMER_LIST,
  PATH_CUSTOMER_DETAILS,
  PATH_AMAZON_ACCOUNT,
  PATH_BILLING_DETAILS,
  PATH_COMPANY_DETAILS,
} from '../../constants/index';
import * as actionTypes from './actionTypes';

export const userRequestInitiated = () => {
  return {
    type: actionTypes.USER_REQUEST_INITIATED,
  };
};

export const userRequestSuccess = (data, history) => {
  localStorage.setItem('token', data.token);
  if (data.user && data.user.role === 'Customer') {
    if (data.user.step === null) {
      history.push(PATH_COMPANY_DETAILS);
    }
    if (data.user.step === 2) {
      history.push(PATH_AMAZON_ACCOUNT);
    }
    if (data.user.step === 3) {
      history.push(PATH_BILLING_DETAILS);
    }
    if (data.user.step === 4) {
      history.push(PATH_CUSTOMER_DETAILS.replace(data.user.customer));
    }
  } else {
    history.push(PATH_CUSTOMER_LIST);
  }

  return {
    type: actionTypes.USER_REQUEST_SUCCESS,
    payload: data,
  };
};

export const userRequestFail = (error) => {
  return {
    type: actionTypes.USER_REQUEST_FAIL,
    error,
  };
};

export const login = (history, data) => {
  return (dispatch) => {
    dispatch(userRequestInitiated());
    axiosInstance
      .post(API_LOGIN, data)
      .then((data) => {
        dispatch(userRequestSuccess(data.data, history));
      })
      .catch((error) => {
        dispatch(userRequestFail(error));
      });
  };
};

export const userMeSuccess = (data) => {
  return {
    type: actionTypes.USER_ME_SUCCESS,
    payload: data,
  };
};

export const clearToken = () => {
  localStorage.removeItem('token');
  window.location.href = PATH_LOGIN;
};

export const userMe = (history) => {
  return (dispatch) => {
    axiosInstance
      .get(API_USER_ME)
      .then((data) => {
        dispatch(userMeSuccess(data));
      })
      .catch(() => {
        dispatch(clearToken());
        history.push(PATH_LOGIN);
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
        dispatch(userRequestFail(error));
      });
  };
};

export const clearErrorMessage = () => {
  return {
    type: actionTypes.CLEAR_ERROR_MESSAGE,
  };
};

export const showForgotPasswordMsg = () => {
  return {
    type: actionTypes.SHOW_FORGOT_PASSWORD_ERROR,
    showForgotMsg: true,
  };
};

export const showResetPasswordMsg = () => {
  return {
    type: actionTypes.SHOW_RESET_PASSWORD_ERROR,
    showResetMsg: true,
  };
};
