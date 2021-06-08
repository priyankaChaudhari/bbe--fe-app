import axiosInstance from '../axios';
import {
  API_ACCOUNT_ASSIGNEE_COUNT,
  API_CUSTOMER_CONTRACT,
  API_DOCUMENTS,
} from '../constants/ApiConstants';

export async function getAgreementList(customer) {
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

export async function getAssigneeCount(customer) {
  const result = await axiosInstance
    .get(API_ACCOUNT_ASSIGNEE_COUNT.replace(':id', customer))
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteDocument(id) {
  const result = await axiosInstance
    .delete(`${API_DOCUMENTS + id}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
