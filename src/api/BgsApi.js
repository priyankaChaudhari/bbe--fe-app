import axiosInstance from '../axios';
import { API_CUSTOMER } from '../constants/ApiConstants';

export default async function getBGSCustomerList(id, value) {
  console.log(value);
  const params = { user: id, daily_facts: value.type, group_by: value.group };
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
