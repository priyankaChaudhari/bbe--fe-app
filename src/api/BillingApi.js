import dayjs from 'dayjs';
import axiosInstance from '../axios';
import {
  API_DSP_BUDGET_ADJUSTMENT,
  API_DSP_EMPTY_BUDGET_ADJUSTMENT,
  API_DSP_INVOICES,
} from '../constants';

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

export async function sendReminderOfAdjustment(customerId, adjustmentId) {
  const data = {
    customer: customerId,
    dsp_budget: adjustmentId,
  };
  const result = await axiosInstance
    .post(API_DSP_BUDGET_ADJUSTMENT, data)
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
    .get(`${API_DSP_BUDGET_ADJUSTMENT}`, { params })
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
  const finalInvoiceAdjust = {
    customer: customerId,
    dsp_invoice_subtype: invoiceType,
    applicable_from: dayjs(appliedDate.value).format('YYYY-MM-DD'),
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
      is_sent_for_pause: type === 'pause',
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
