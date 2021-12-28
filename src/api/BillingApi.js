import dayjs from 'dayjs';
import axiosInstance from '../axios';
import {
  API_DSP_BUDGET_ADJUSTMENT,
  API_DSP_EMPTY_BUDGET_ADJUSTMENT,
  API_DSP_INVOICES,
} from '../constants';

export async function getInvoiceData(invoiceType, id, pageNumber) {
  const params = {
    customer: id,
    invoice_type: invoiceType,
    page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
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

export async function getUpcomingInvoiceData(type, id, pageNumber) {
  const params = {
    customer: id,
    adjustment_data: 'upcoming',
    invoice_type: type,
    page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
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

export async function sendReminderOfAdjustment(customerId, adjustmentId) {
  const data = {
    customer: customerId,
    dsp_budget: adjustmentId,
  };
  const result = await axiosInstance
    .post(`${API_DSP_BUDGET_ADJUSTMENT}send-reminder/`, data)
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

export async function getDSPBudgetAdjustData(
  invoiceType,
  customerId,
  budgetApproved,
) {
  let params = {
    dsp_invoice_subtype: invoiceType,
    customer: customerId,
  };
  if (budgetApproved) {
    params = {
      ...params,
      budget_approved: true,
    };
  }
  const result = await axiosInstance
    .get(`${API_DSP_BUDGET_ADJUSTMENT}detailed-adjustments/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDSPBudgetAdjustDetail(dspAdjustmentID) {
  const result = await axiosInstance
    .get(`${API_DSP_BUDGET_ADJUSTMENT + dspAdjustmentID}/`)
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateDSPBudgetAdjustment(dspAdjustmentID, data) {
  const result = await axiosInstance
    .patch(`${API_DSP_BUDGET_ADJUSTMENT + dspAdjustmentID}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function postDSPBudgetAdjustPauseInvoiceData(
  invoiceData,
  appliedDate,
  invoiceType,
  customerId,
  type,
) {
  const todaysDate = new Date();
  const day = todaysDate.getDate();
  const finalInvoiceAdjust = {
    customer: customerId,
    dsp_invoice_subtype: invoiceType,
    applicable_from:
      invoiceType === 'standard'
        ? dayjs(appliedDate.value).format('YYYY-MM-DD')
        : dayjs(day + appliedDate.value).format('YYYY-MM-DD'),
    is_sent_for_pause: type === 'pause',
    adjustments: [],
  };
  invoiceData.forEach((item) => {
    finalInvoiceAdjust.adjustments.push({
      new_budget: item.newAmount
        ? parseFloat(item.newAmount.replace(/,/g, ''))
        : item.new_budget,
      old_budget: item.new_budget,
      marketplace: item.marketplace,
      marketplace_id: item.marketplace_id,
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

export async function getDSPEmptyBudgetAdjustment(customerId) {
  const params = {
    customer: customerId,
  };
  const result = await axiosInstance
    .get(`${API_DSP_EMPTY_BUDGET_ADJUSTMENT}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
