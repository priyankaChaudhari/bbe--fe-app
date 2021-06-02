import axiosInstance from '../axios';
import { API_CUSTOMER_CONTRACT } from '../constants/ApiConstants';

export default async function getAgreementList(customer) {
  const fields = 'contract_type,start_date,end_date,id';
  const params = {
    customer,
    contract_status: 'active',
    fields,
  };
  const result = await axiosInstance
    .get(API_CUSTOMER_CONTRACT, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
