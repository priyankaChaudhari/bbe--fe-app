import { metricsNameForAPI } from '../constants/CompanyPerformanceConstants';
import axiosInstance from '../axios';
import {
  API_CUSTOMER,
  API_AD_MANAGER_ADMIN_DASHBOARD,
  API_DSP_INVOICES,
  API_DSP_BILLING,
} from '../constants/ApiConstants';

export async function getAdManagerAdminGraphData(
  dashboardType,
  adType,
  dailyFacts,
  groupBy,
  marketplace,
  user,
  startDate,
  endDate,
  userInfo,
) {
  let selectedUser = '';
  if (userInfo && userInfo.role === 'Ad Manager Admin') {
    selectedUser = user;
  } else {
    selectedUser = userInfo && userInfo.id;
  }

  let params = {
    daily_facts: dailyFacts,
    group_by: groupBy,
    marketplace,
    user: selectedUser,
  };

  if (startDate && endDate) {
    params = {
      ...params,
      start_date: startDate,
      end_date: endDate,
    };
  }

  if (dashboardType === 'sponsored-dashboard') {
    params = {
      ...params,
      sponsored_type: adType,
    };
  }

  const result = await axiosInstance
    .get(`${API_AD_MANAGER_ADMIN_DASHBOARD}${dashboardType}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getKeyContributionData(
  dashboardType,
  adType,
  dailyFacts,
  marketplace,
  user,
  contributionType,
  selectedMetric,
  startDate,
  endDate,
  userInfo,
) {
  const metricName = metricsNameForAPI[selectedMetric];

  let selectedUser = '';
  if (userInfo && userInfo.role === 'Ad Manager Admin') {
    selectedUser = user;
  } else {
    selectedUser = userInfo && userInfo.id;
  }

  let params = {
    dashboard: dashboardType,
    daily_facts: dailyFacts,
    marketplace,
    user: selectedUser,
  };

  if (startDate && endDate) {
    params = {
      ...params,
      start_date: startDate,
      end_date: endDate,
    };
  }

  if (contributionType === 'keyMetrics') {
    if (dashboardType === 'sponsored_ad_dashboard') {
      params = {
        ...params,
        no_page: '',
        sequence: 'desc',
        'order-by': 'company_name',
      };
    } else {
      params = {
        ...params,
        no_page: '',
        sequence: 'desc',
        'order-by': 'company_name',
      };
    }
  } else {
    params = {
      ...params,
      order_by: contributionType,
      metric: metricName,
    };
  }

  if (dashboardType === 'sponsored_ad_dashboard') {
    params = {
      ...params,
      sponsored_type: adType,
    };
  }

  let result = {};
  if (contributionType === 'keyMetrics') {
    result = await axiosInstance
      .get(`${API_CUSTOMER}`, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  } else {
    result = await axiosInstance
      .get(`${API_AD_MANAGER_ADMIN_DASHBOARD}key-contributors/`, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  }
  return result;
}

export async function getDspPacingDahboardData(
  marketplace,
  user,
  spendingType,
) {
  const params = {
    daily_facts: 'month',
    marketplace,
    user,
    order_by: spendingType,
  };

  let result = {};
  result = await axiosInstance
    .get(`${API_AD_MANAGER_ADMIN_DASHBOARD}dsp-pacing/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getFinanceInvoices(
  type,
  searchKey,
  status,
  sortBy,
  timeFilterType,
  timeFilter,
  page,
) {
  let params = {
    page,
    type,
  };

  if (type === 'partner') {
    params = {
      ...params,
      sort: `${sortBy}`,
    };
  } else {
    params = {
      ...params,
      sort_by: `-${sortBy}`,
    };
  }

  if (sortBy === '') {
    delete params.sort_by;
  }

  if (searchKey !== '') {
    params = {
      ...params,
      q: searchKey,
    };
  }

  if (timeFilterType === 'custom') {
    params = {
      ...params,
      timeframe: timeFilterType,
      start_month_year: timeFilter.startDate,
      end_month_year: timeFilter.endDate,
    };
  }

  if (status !== 'any') {
    params = {
      ...params,
      invoice_status: status,
    };
  }
  let result = {};
  result = await axiosInstance
    .get(`${API_DSP_INVOICES}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDSPFinances(timeFilter, startDate, endDate) {
  let params = {};

  if (timeFilter === 'custom') {
    params = {
      ...params,
      start_month_year: startDate,
      end_month_year: endDate,
      timeframe: timeFilter,
    };
  }

  let result = {};
  result = await axiosInstance
    .get(`${API_DSP_INVOICES}finance-detail`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBills(
  searchKey,
  vendor,
  sortBy,
  timeFilterType,
  timeFilter,
  page,
) {
  let params = {
    page,
    vendor,
    sort_by: `-${sortBy}`,
  };

  if (sortBy === '') {
    delete params.sort_by;
  }

  if (searchKey !== '') {
    params = {
      ...params,
      q: searchKey,
    };
  }

  if (timeFilterType === 'custom') {
    params = {
      ...params,
      timeframe: timeFilterType,
      start_month_year: timeFilter.startDate,
      end_month_year: timeFilter.endDate,
    };
  }

  let result = {};
  result = await axiosInstance
    .get(`${API_DSP_BILLING}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDSPBillingMetrics(timeFilter, startDate, endDate) {
  let params = {};

  if (timeFilter === 'custom') {
    params = {
      ...params,
      start_month_year: startDate,
      end_month_year: endDate,
      timeframe: timeFilter,
    };
  }

  let result = {};
  result = await axiosInstance
    .get(`${API_DSP_BILLING}bill-detail/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
