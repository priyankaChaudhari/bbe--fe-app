import axiosInstance from '../axios';
import {
  API_RESET_PASSWORD,
  API_FORGOT_PASSWORD,
  API_USER,
  API_UPDATE_PASSWORD,
} from '../constants/ApiConstants';

export async function getEmail(data = null) {
  if (data && Object.keys(data).length > 0) {
    const result = await axiosInstance
      .post(API_FORGOT_PASSWORD, data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return null;
}

export async function resetPassword(data = null) {
  if (data && Object.keys(data).length > 0) {
    const result = await axiosInstance
      .post(API_RESET_PASSWORD, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return null;
}

export async function updateUserInfo(data = null, id) {
  if (data && Object.keys(data).length > 0) {
    const result = await axiosInstance
      .patch(`${API_USER + id}/`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return null;
}

export async function updatePassword(data = null) {
  if (data && Object.keys(data).length > 0) {
    const result = await axiosInstance
      .patch(API_UPDATE_PASSWORD, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return null;
}

export async function userCustomerRoleList(id, pageNumber, searchQuery, role) {
  const params = {
    'other-users-for-customer': id,
    page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
    q: searchQuery,
    role,
  };
  const result = await axiosInstance
    .get(API_USER, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateUserMe(id, data) {
  const result = await axiosInstance
    .patch(`${API_USER + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
