import axiosInstance from '../axios';
import { API_CUSTOMER } from '../constants/ApiConstants';

export default async function getAdManagerCustomerList(pageNumber, id, value) {
  const params = {
    page: pageNumber,
    user: id,
    ad_performace: value.type,
    role: 'ad_manager',
  };

  const result = await axiosInstance
    .get(API_CUSTOMER, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
