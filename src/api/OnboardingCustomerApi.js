import axiosInstance from '../axios';
import {
  API_ONBOARD_CUSTOMER,
  API_STEPS_ASSIGNED,
  API_VERIFY_TOKEN,
} from '../constants/ApiConstants';

export async function updateOnBoardCustomer(id, data) {
  const result = await axiosInstance
    .patch(`${API_ONBOARD_CUSTOMER + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function askSomeoneData(data) {
  const result = await axiosInstance
    .post(API_STEPS_ASSIGNED, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateAskSomeoneData(id, data) {
  const result = await axiosInstance
    .patch(`${API_STEPS_ASSIGNED + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getStepDetails(customer, step) {
  const params = { customer_onboarding: customer, step };
  const result = await axiosInstance
    .get(API_STEPS_ASSIGNED, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function verifyStepToken(key) {
  const params = { key };
  const result = await axiosInstance
    .get(API_VERIFY_TOKEN, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
