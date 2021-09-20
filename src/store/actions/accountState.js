/* eslint no-shadow: "off" */

import axiosInstance from '../../axios';
import { API_CUSTOMER_CONTRACT } from '../../constants/ApiConstants';
import * as actionTypes from './actionTypes';

export const customerAccountRequestInitiated = () => {
  return {
    type: actionTypes.CUSTOMER_ACCOUNT_REQUEST_INITIATED,
  };
};

export const customerAccountRequestSuccess = (data, multipleAgreement) => {
  return {
    type: actionTypes.CUSTOMER_ACCOUNT_REQUEST_SUCCESS,
    payload: data,
    multipleAgreement,
  };
};

export const customerAccountRequestFail = (error) => {
  return {
    type: actionTypes.CUSTOMER_ACCOUNT_REQUEST_FAIL,
    error,
  };
};

export const getAccountDetails = (id) => {
  const params = { customer: id, latest: 'True' };
  return (dispatch) => {
    dispatch(customerAccountRequestInitiated());
    axiosInstance
      .get(API_CUSTOMER_CONTRACT, { params })
      .then((response) => {
        dispatch(
          customerAccountRequestSuccess(
            response.data && response.data.results && response.data.results[0],
            response.data && response.data.results && response.data.results,
          ),
        );
      })
      .catch((error) => {
        dispatch(customerAccountRequestFail(error));
      });
  };
};
