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
  API_BGS_COMMISSION_DETAILS,
  API_BGS_COMMISSION_INDIVIDUALS,
  API_BGS_COMMISSION_MATRICS,
  API_BGS_COMMISSION_GROUP_BY_MANAGER,
  API_BBE_GOAL_DASHBOARD,
} from '../constants';

export async function getAdManagerAdminGraphData(
  dashboardType,
  adType,
  dailyFacts,
  groupBy,
  marketplace,
  managerUser,
  bgsUser,
  isBGSManager,
  isBGSAdmin,
  isBGS,
  startDate,
  endDate,
) {
  let params = {
    daily_facts: dailyFacts,
    group_by: groupBy,
    marketplace,
  };
  if (isBGS) {
    params = {
      ...params,
      bgs_manager: 'all',
      user: bgsUser,
    };
  } else if (isBGSManager || isBGSAdmin) {
    params = {
      ...params,
      bgs_manager: managerUser,
      user: bgsUser,
    };
  } else {
    params = {
      ...params,
      user: managerUser,
    };
  }

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
  managerUser,
  bgsUser,
  isBGSManager,
  isBGSAdmin,
  isBGS,
  contributionType,
  selectedMetric,
  startDate,
  endDate,
  pageNumber,
) {
  const metricName = metricsNameForAPI[selectedMetric];

  let params = {
    dashboard: dashboardType,
    daily_facts: dailyFacts,
    marketplace,
  };

  if (isBGS) {
    params = {
      ...params,
      bgs_manager: 'all',
      user: bgsUser,
    };
  } else if (isBGSManager || isBGSAdmin) {
    params = {
      ...params,
      bgs_manager: managerUser,
      user: bgsUser,
    };
  } else {
    params = {
      ...params,
      user: managerUser,
    };
  }

  if (startDate && endDate) {
    params = {
      ...params,
      start_date: startDate,
      end_date: endDate,
    };
  }

  if (contributionType === 'keyMetrics') {
    if (params?.user === 'all') {
      delete params.user;
    }
    if (params?.bgs_manager === 'all') {
      delete params.bgs_manager;
    }
    if (marketplace === 'all') {
      delete params.marketplace;
    }
    if (dashboardType === 'sponsored_ad_dashboard') {
      params = {
        ...params,

        sequence: 'desc',
        'order-by': 'company_name',
        page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
      };
    } else {
      params = {
        ...params,
        sequence: 'desc',
        'order-by': 'company_name',
        page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
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
  managerUser,
  bgsUser,
  spendingType,
  isBGSManager = false,
  isBGSAdmin = false,
  isBGS = false,
) {
  let params = {
    daily_facts: 'month',
    marketplace,
    order_by: spendingType,
  };
  if (isBGS) {
    params = {
      ...params,
      bgs_manager: 'all',
      user: bgsUser,
    };
  } else if (isBGSManager || isBGSAdmin) {
    params = {
      ...params,
      bgs_manager: managerUser,
      user: bgsUser,
    };
  } else {
    params = {
      ...params,
      user: managerUser,
    };
  }

  let result = {};
  result = await axiosInstance
    .get(`${API_AD_DASHBOARD}dsp-pacing-dashboard/`, { params })
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
  managerUser,
  bgsUser,
  isBGSManager,
  isBGSAdmin,
  isBGS,
  startDate,
  endDate,
) {
  let params = {
    daily_facts: dailyFacts,
    group_by: groupBy,
    marketplace,
  };

  if (isBGS) {
    params = {
      ...params,
      bgs_manager: 'all',
      user: bgsUser,
    };
  } else if (isBGSManager || isBGSAdmin) {
    params = {
      ...params,
      bgs_manager: managerUser,
      user: bgsUser,
    };
  } else {
    params = {
      ...params,
      user: managerUser,
    };
  }

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
  managerUser,
  bgsUser,
  contributionType,
  selectedMetric,
  isBGSManager,
  isBGSAdmin,
  isBGS,
  startDate,
  endDate,
  pageNumber,
) {
  const metricName = metricsNameForAPI[selectedMetric];

  let params = {
    daily_facts: dailyFacts,
    marketplace,
    dashboard: 'sales_performance',
  };

  if (isBGS) {
    params = {
      ...params,
      bgs_manager: 'all',
      user: bgsUser,
    };
  } else if (isBGSManager || isBGSAdmin) {
    params = {
      ...params,
      bgs_manager: managerUser,
      user: bgsUser,
    };
  } else {
    params = {
      ...params,
      user: managerUser,
    };
  }

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
      sequence: 'desc',
      'order-by': 'company_name',
      dashboard: 'sale_performance',
      page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
    };

    if (params?.user === 'all') {
      delete params.user;
    }
    if (params?.bgs_manager === 'all') {
      delete params.bgs_manager;
    }

    if (marketplace === 'all') {
      delete params.marketplace;
    }
  } else {
    params = {
      ...params,
      order_by: contributionType,
      metric: metricName,
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
    invoice_type: selectedNavigation,
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
  let params = {
    invoice_type: selectedNavigation,
  };

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

export async function getBgsCommissionMatrics(date) {
  const params = {
    start_date: `${date[0].getFullYear()}-${
      date[0].getMonth() + 1
    }-${date[0].getDate()}`,
    end_date: `${date[1].getFullYear()}-${
      date[1].getMonth() + 1
    }-${date[1].getDate()}`,
  };

  const result = await axiosInstance
    .get(API_BGS_COMMISSION_MATRICS, {
      params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBgsCommissionGroupByTable(
  date,
  orderBy = 'full_name',
) {
  const params = {
    start_date: `${date[0].getFullYear()}-${
      date[0].getMonth() + 1
    }-${date[0].getDate()}`,
    end_date: `${date[1].getFullYear()}-${
      date[1].getMonth() + 1
    }-${date[1].getDate()}`,
    'order-by': `${orderBy}`,
  };

  const result = await axiosInstance
    .get(API_BGS_COMMISSION_GROUP_BY_MANAGER, {
      params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBgsCommissionTableIndividualsData(date, orderBy) {
  const params = {
    start_date: `${date[0].getFullYear()}-${
      date[0].getMonth() + 1
    }-${date[0].getDate()}`,
    end_date: `${date[1].getFullYear()}-${
      date[1].getMonth() + 1
    }-${date[1].getDate()}`,
    'order-by': `${orderBy}`,
  };

  const result = await axiosInstance
    .get(API_BGS_COMMISSION_INDIVIDUALS, {
      params,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBgsBrandPartners(bgs, startDate, endDate) {
  const { isBgsManager, managerId, id } = bgs;
  const params = {
    start_date: startDate,
    end_date: endDate,
    manager_id: !isBgsManager ? managerId : id,
  };

  const result = await axiosInstance
    .get(`${API_BGS_COMMISSION_DETAILS + id}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getRevShareContributionData(month, type, pageNumber) {
  const params = {
    type,
    page: pageNumber,
    month,
  };

  const result = await axiosInstance
    .get(`${API_AD_MANAGER_ADMIN_DASHBOARD}key-contributors/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });

  return result;
}

export async function getBBEGoalMetrics(monthYear) {
  const params = {
    month_year: monthYear,
  };

  const result = await axiosInstance
    .get(`${API_BBE_GOAL_DASHBOARD}`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });

  return result;
}
