import axiosInstance from '../axios';
import { API_CUSTOMER } from '../constants/ApiConstants';

export default async function getBGSCustomerList(pageNumber, id, value) {
  const params = {
    page: pageNumber,
    user: id,
    daily_facts: value.type,
    role: 'growth_strategist',
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
