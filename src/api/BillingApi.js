import axiosInstance from '../axios';
import { API_FINANCE_DASHBOARD } from '../constants/ApiConstants';

export async function getDSPInvoiceData(id) {
  const params = {
    customer: id,
  };
  const result = await axiosInstance
    .get(API_FINANCE_DASHBOARD, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getMetricsInvoiceData(id) {
  const params = {
    customer: id,
  };
  const result = await axiosInstance
    .get(`${API_FINANCE_DASHBOARD}invoice-total/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
