import axiosInstance from '../axios';
import {
  API_PERFORMANCE,
  API_AD_PERFORMANCE,
  API_VENDOR_ORDERED,
  API_VENDOR_SHIPPED,
  API_ALLOCATE_BALANCE,
  API_ESCROW_BALANCE_MARKETPLACE,
  API_ESCROW_REALLOCATION,
} from '../constants';

export async function getPerformance(
  customer,
  dailyFacts,
  groupBy,
  marketplace,
  startDate,
  endDate,
) {
  let params = {};
  if (startDate && endDate) {
    params = {
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
      start_date: startDate,
      end_date: endDate,
    };
  } else {
    params = {
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
    };
  }
  const result = await axiosInstance
    .get(`${API_PERFORMANCE + customer}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getVendorReportingData(
  customer,
  dailyFacts,
  groupBy,
  marketplace,
  startDate,
  endDate,
  metricsType,
) {
  let params = {};
  const api =
    metricsType === 'orderedRevenue' ? API_VENDOR_ORDERED : API_VENDOR_SHIPPED;
  if (startDate && endDate) {
    params = {
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
      start_date: startDate,
      end_date: endDate,
    };
  } else {
    params = {
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
    };
  }

  const result = await axiosInstance
    .get(`${api + customer}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBuyBoxChartData(
  customer,
  marketplace,
  bbDailyFact,
  groupBy,
  startDate,
  endDate,
) {
  let params = {};
  if (startDate && endDate) {
    params = {
      daily_facts: 'week',
      group_by: groupBy,
      marketplace,
      bbep_interval: bbDailyFact,
      start_date: startDate,
      end_date: endDate,
    };
  } else {
    params = {
      daily_facts: 'week',
      group_by: groupBy,
      marketplace,
      bbep_interval: bbDailyFact,
    };
  }

  const result = await axiosInstance
    .get(`${API_PERFORMANCE + customer}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAdPerformance(
  customer,
  adType,
  dailyFacts,
  groupBy,
  marketplace,
  startDate,
  endDate,
  accountType,
) {
  let params = {};
  if (startDate && endDate) {
    params = {
      sponsored_type: adType,
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
      start_date: startDate,
      end_date: endDate,
      account_type: accountType,
    };
  } else {
    params = {
      sponsored_type: adType,
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
      account_type: accountType,
    };
  }
  const result = await axiosInstance
    .get(`${API_AD_PERFORMANCE + customer}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDSPPerformance(
  customer,
  dailyFacts,
  groupBy,
  marketplace,
  startDate,
  endDate,
) {
  let params = {};
  if (startDate && endDate) {
    params = {
      dsp_daily_facts: dailyFacts,
      dsp_group_by: groupBy,
      dsp_marketplace: marketplace,
      dsp_start_date: startDate,
      dsp_end_date: endDate,
    };
  } else {
    params = {
      dsp_daily_facts: dailyFacts,
      dsp_group_by: groupBy,
      dsp_marketplace: marketplace,
    };
  }
  const result = await axiosInstance
    .get(`${API_AD_PERFORMANCE + customer}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDSPPacingGraphData(customer, marketplace) {
  const params = { dsp_marketplace: marketplace, dsp_pacing_graph: true };

  const result = await axiosInstance
    .get(`${API_AD_PERFORMANCE + customer}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDspPacingData(id, marketplace) {
  const params = { dsp_pacing: 'month', dsp_marketplace: marketplace };
  const result = await axiosInstance
    .get(`${API_AD_PERFORMANCE + id}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
export async function getEscrowBalanceMarketplaceData(id) {
  const params = { customer_id: id };
  const result = await axiosInstance
    .get(`${API_ESCROW_BALANCE_MARKETPLACE}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
export async function storeAllocatedBudget(data, customerId, marketplace) {
  const allocateMonths = [];
  for (const option of data) {
    allocateMonths.push({
      escrow_allocated_converted_usd: Number(
        option.escrow_allocated_converted_usd,
      ),
      month_year: option.month_year,
    });
  }

  const params = {
    customer_id: customerId,
    marketplace,
    allocate_balance: allocateMonths,
  };

  const result = await axiosInstance
    .post(API_ALLOCATE_BALANCE, params)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
export async function storeEscrowReallocation(data) {
  const result = await axiosInstance
    .post(API_ESCROW_REALLOCATION, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
