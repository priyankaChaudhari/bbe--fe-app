import axiosInstance from '../axios';
import { API_ONBOARD_CUSTOMER } from '../constants/ApiConstants';

export default async function updateOnBoardCustomer(id, data) {
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
