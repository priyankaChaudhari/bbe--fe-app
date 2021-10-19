import axiosInstance from '../axios';
import {
  API_CUSTOMER,
  API_AD_MANAGER_ADMIN_DASHBOARD,
  API_AD_DASHBOARD,
  API_DSP_INVOICES,
  API_DSP_BILLING,
  API_CUSTOMER_CONTRACT,
  API_SALES_DASHBOARD,
  metricsNameForAPI,
} from '../constants';

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
  if (
    (userInfo && userInfo.role === 'Ad Manager Admin') ||
    userInfo.role === 'BGS Manager'
  ) {
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
    .get(`${API_AD_DASHBOARD}${dashboardType}/`, { params })
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
  if (
    (userInfo && userInfo.role === 'Ad Manager Admin') ||
    userInfo.role === 'BGS Manager'
  ) {
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

export async function getSalesGraphData(
  dailyFacts,
  groupBy,
  marketplace,
  user,
  startDate,
  endDate,
  userInfo,
) {
  let selectedUser = '';
  if (userInfo && userInfo.role === 'BGS Manager') {
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

  const result = await axiosInstance
    .get(`${API_AD_DASHBOARD}${API_SALES_DASHBOARD}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getSalesKeyContributionData(
  dailyFacts,
  marketplace,
  user,
  contributionType,
  selectedMetric,
  startDate,
  endDate,
  userInfo,
) {
  let selectedUser = '';
  if (userInfo && userInfo.role === 'BGS Manager') {
    selectedUser = user;
  } else {
    selectedUser = userInfo && userInfo.id;
  }

  let params = {
    daily_facts: dailyFacts,
    marketplace,
    user: selectedUser,
    dashboard: 'sales_performance',
  };

  if (startDate && endDate) {
    params = {
      ...params,
      start_date: startDate,
      end_date: endDate,
    };
  }

  if (contributionType === 'keyMetrics') {
    params = {
      ...params,
      no_page: '',
      sequence: 'desc',
      'order-by': 'company_name',
      dashboard: 'sale_performance',
    };
  } else {
    params = {
      ...params,
      order_by: contributionType,
      metric: selectedMetric,
    };
  }

  // if (user === 'all') {
  //   delete params.user;
  // }
  // if (marketplace === 'all') {
  //   delete params.marketplace;
  // }

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

export async function getFinanceInvoices(
  type,
  searchKey,
  status,
  sortBy,
  timeFilterType,
  timeFilter,
  page,
  selectedNavigation,
) {
  let params = {
    page,
    type,
  };

  if (sortBy !== '') {
    if (type === 'partner') {
      params = {
        ...params,
        sort: `-${sortBy}`,
      };
    } else {
      params = {
        ...params,
        sort_by: `-${sortBy}`,
      };
    }
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

  if (selectedNavigation === 'revShare') {
    params = {
      ...params,
      invoice_type: 'rev share',
    };
  } else {
    params = {
      ...params,
      invoice_type: 'dsp service',
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

export async function getDSPFinances(
  timeFilter,
  startDate,
  endDate,
  selectedNavigation,
) {
  let params = {};

  if (timeFilter === 'custom') {
    params = {
      ...params,
      start_month_year: startDate,
      end_month_year: endDate,
      timeframe: timeFilter,
    };
  }

  if (selectedNavigation === 'revShare') {
    params = {
      ...params,
      invoice_type: 'rev share',
    };
  } else {
    params = {
      ...params,
      invoice_type: 'dsp service',
    };
  }

  let result = {};
  result = await axiosInstance
    .get(`${API_DSP_INVOICES}finance-detail/`, { params })
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
  page,
  timeFilterType,
  timeFilter,
) {
  let params = {
    page,
    vendor,
  };

  if (sortBy !== '') {
    params = {
      ...params,
      'order-by': `-${sortBy}`,
    };
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

export async function getEnableInvoices(page) {
  const params = { is_invoicing_enable: 'False', page };
  let result = {};

  result = await axiosInstance
    .get(`${API_CUSTOMER_CONTRACT}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function setEnableInvoices(id) {
  const result = await axiosInstance
    .patch(`${API_CUSTOMER_CONTRACT}${id}/`, { is_invoicing_enable: true })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
