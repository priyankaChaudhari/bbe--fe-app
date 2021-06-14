/* eslint no-shadow: "off" */
import axiosInstance from '../../axios';
import { API_CONTACT, API_CUSTOMER } from '../../constants/ApiConstants';
import * as actionTypes from './actionTypes';

export const customerRequestInitiated = () => {
  return {
    type: actionTypes.CUSTOMER_REQUEST_INITIATED,
  };
};

export const customerRequestSuccess = (data) => {
  return {
    type: actionTypes.CUSTOMER_REQUEST_SUCCESS,
    payload: data,
  };
};

export const setCustomerSelectedTab = (data) => {
  return {
    type: actionTypes.CUSTOMER_SELECTED_TAB,
    tab: data,
  };
};

export const customerRequestFail = (error) => {
  return {
    type: actionTypes.CUSTOMER_REQUEST_FAIL,
    error,
  };
};

export const getCustomerDetails = (id) => {
  return (dispatch) => {
    dispatch(customerRequestInitiated());
    axiosInstance
      .get(`${API_CUSTOMER + id}/`)
      .then((response) => {
        dispatch(customerRequestSuccess(response.data));
      })
      .catch((error) => {
        dispatch(customerRequestFail(error));
      });
  };
};

export const contactRequestInitiated = () => {
  return {
    type: actionTypes.CONTACT_REQUEST_INITIATED,
  };
};

export const contactRequestSuccess = (data) => {
  return {
    type: actionTypes.CONTACT_REQUEST_SUCCESS,
    contact: data,
  };
};

export const contactRequestFail = (error) => {
  return {
    type: actionTypes.CONTACT_REQUEST_FAIL,
    error,
  };
};

export const getContactDetails = (id) => {
  return (dispatch) => {
    dispatch(contactRequestInitiated());
    axiosInstance
      .get(API_CONTACT, { params: { customer: id } })
      .then((response) => {
        dispatch(contactRequestSuccess(response.data));
      })
      .catch((error) => {
        dispatch(contactRequestFail(error));
      });
  };
};

export const showBrandAsset = (value) => {
  return {
    type: actionTypes.SHOW_BRAND_ASSET_MSG,
    showBrandAssetMsg: value,
  };
};
