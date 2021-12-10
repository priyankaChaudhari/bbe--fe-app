import axiosInstance from '../axios';
import { API_DSP_BUDGET_ADJUSTMENT, API_DSP_INVOICES } from '../constants';

export async function getInvoiceData(invoiceType, id) {
  const params = {
    customer: id,
    invoice_type: invoiceType,
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

export async function getMetricsInvoiceData(invoiceType, id) {
  const params = {
    customer: id,
    invoice_type: invoiceType,
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

export async function getDSPBudgetAdjustData(invoiceType) {
  const params = {
    dsp_invoice_subtype: invoiceType,
  };
  const result = await axiosInstance
    .get(`${API_DSP_BUDGET_ADJUSTMENT}invoice-total/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
