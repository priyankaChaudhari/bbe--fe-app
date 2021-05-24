import axiosInstance from '../axios';
import {
  API_ACCOUNT_SUMMARY,
  API_BILLING_INFO,
  API_EDIT_EMAIL,
  API_ONBOARD_CUSTOMER,
  API_STEPS_ASSIGNED,
  API_VERIFY_TOKEN,
  API_VERIFY_USER,
  API_VIDEO_LINKS,
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

export async function accountSummary(id) {
  const result = await axiosInstance
    .get(API_ACCOUNT_SUMMARY.replace(':id', id))
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getVideoLink(id) {
  const result = await axiosInstance
    .get(API_VIDEO_LINKS.replace(':id', id))
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function editCustomerEmail(data) {
  const result = await axiosInstance
    .post(API_EDIT_EMAIL, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function verifyStepUser(email, customerOnboarding) {
  const result = await axiosInstance
    .post(API_VERIFY_USER, { email, customer_onboarding: customerOnboarding })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBillingDetails(customer) {
  const params = { customer };
  if (customer !== undefined) {
    const result = await axiosInstance
      .get(API_BILLING_INFO, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return '';
}

export async function saveBillingInfo(data, id) {
  if (id) {
    const result = await axiosInstance
      .patch(`${API_BILLING_INFO + id}/`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  const result = await axiosInstance
    .post(API_BILLING_INFO, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
