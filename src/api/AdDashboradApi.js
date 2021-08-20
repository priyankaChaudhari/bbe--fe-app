import { metricsNameForAPI } from '../constants/CompanyPerformanceConstants';
import axiosInstance from '../axios';
import {
  API_CUSTOMER,
  API_AD_MANAGER_ADMIN_DASHBOARD,
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
        page: 1,
        sequence: 'desc',
        'order-by': 'ad_sales',
      };
    } else {
      params = {
        ...params,
        page: 1,
        sequence: 'desc',
        'order-by': 'dsp_spend',
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

export async function getDspPacindgData(dailyFacts, marketplace, user) {
  const params = {
    dsp_daily_facts: dailyFacts,
    dsp_marketplace: marketplace,
    user,
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
