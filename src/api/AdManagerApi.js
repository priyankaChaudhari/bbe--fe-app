import axiosInstance from '../axios';
import { API_CUSTOMER } from '../constants/ApiConstants';

export default async function getAdManagerCustomerList(id, value) {
  const params = { user: id, ad_performace: value.type };
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
