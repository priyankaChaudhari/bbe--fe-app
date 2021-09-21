import axiosInstance from '../axios';
import { API_DSP_INVOICES } from '../constants/ApiConstants';

export async function getDSPInvoiceData(id) {
  const params = {
    customer: id,
  };
  const result = await axiosInstance
    .get(API_DSP_INVOICES, { params })
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
    .get(`${API_DSP_INVOICES}invoice-total/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
