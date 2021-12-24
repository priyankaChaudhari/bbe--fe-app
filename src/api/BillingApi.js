import dayjs from 'dayjs';
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

export async function getUpcomingInvoiceData(id) {
  const params = {
    customer: id,
    adjustment_data: 'upcoming',
  };
  const result = await axiosInstance
    .get(API_DSP_BUDGET_ADJUSTMENT, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getInvoiceAdjustmentData(id, page = 1) {
  const params = {
    customer: id,
    adjustment_data: 'past',
    page,
  };
  const result = await axiosInstance
    .get(API_DSP_BUDGET_ADJUSTMENT, { params })
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

export async function getDSPBudgetAdjustData(invoiceType, customerId) {
  const params = {
    dsp_invoice_subtype: invoiceType,
    customer: customerId,
  };
  const result = await axiosInstance
    .get(`${API_DSP_BUDGET_ADJUSTMENT}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function postDSPBudgetAdjustInvoiceData(
  invoiceData,
  appliedDate,
  invoiceType,
) {
  const finalInvoiceAdjust = [];
  invoiceData.forEach((item) => {
    finalInvoiceAdjust.push({
      customer: item.customer,
      dsp_invoice_subtype: invoiceType,
      applicable_from: dayjs(appliedDate.value).format('YYYY-MM-DD'),
      new_budget: item.newAmount
        ? parseFloat(item.newAmount.replace(/,/g, ''))
        : item.old_budget,
      old_budget: item.old_budget,
      marketplace: item.marketplace,
    });
  });

  const result = await axiosInstance
    .post(`${API_DSP_BUDGET_ADJUSTMENT}`, finalInvoiceAdjust)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function postDSPBudgetPauseInvoiceData(invoiceData, appliedDate) {
  const finalInvoiceAdjust = [];
  invoiceData.forEach((item) => {
    finalInvoiceAdjust.push({
      customer: item.customer,
      dsp_invoice_subtype: 'standard',
      applicable_from: dayjs(appliedDate.value).format('YYYY-MM-DD'),
      marketplace: item.marketplace,
      is_sent_for_pause: item.is_sent_for_pause,
    });
  });

  const result = await axiosInstance
    .post(`${API_DSP_BUDGET_ADJUSTMENT}`, finalInvoiceAdjust)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
