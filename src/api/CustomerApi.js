/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */

import queryString from 'query-string';
import { metricsNameForAPI } from '../constants/CompanyPerformanceConstants';
import axiosInstance from '../axios';
import {
  API_ACTIVITY_LOG,
  API_AMAZON_DETAILS,
  API_CONTACT,
  API_CREDENTIALS,
  API_CUSTOMER,
  API_CUSTOMER_CONTRACT,
  API_CUSTOMER_MEMBER,
  API_DELETE_MARKETPLACE,
  API_DOCUMENTS,
  API_PERFORMANCE,
  API_AD_PERFORMANCE,
  API_AD_MANAGER_ADMIN_DASHBOARD,
} from '../constants/ApiConstants';

export async function getCustomerList(
  pageNumber,
  sort,
  filterOptions,
  searchQuery,
  performance,
  adPerformance,
  dspAdPerformance,
  expiringSoon,
  dailyFacts,
  orderByFlag,
) {
  let params = {
    page:
      pageNumber === '' || pageNumber === undefined
        ? 1
        : localStorage.getItem('page')
        ? localStorage.getItem('page')
        : pageNumber,
    'order-by': sort['order-by'] || '-created_at',
  };

  if (expiringSoon) {
    params = {
      ...params,
      expiring_soon: true,
    };
    delete params['order-by'];
  }

  if (searchQuery) {
    params = {
      ...params,
      q: searchQuery,
    };
  }

  if (performance) {
    params = {
      ...params,
      ...dailyFacts,
      ...orderByFlag,
      dashboard: 'sale_performance',
    };
  }
  if (adPerformance) {
    params = {
      ...params,
      ...dailyFacts,
      ...orderByFlag,
      dashboard: 'sponsored_ad_dashboard',
    };
  }
  if (dspAdPerformance) {
    params = {
      ...params,
      ...dailyFacts,
      ...orderByFlag,
      dashboard: 'dsp_ad_performance',
    };
  }

  let statusParams = {};
  if (filterOptions && filterOptions.status && filterOptions.status.length) {
    statusParams = queryString.stringify({
      status: filterOptions.status,
    });
  }
  let contractStatusParams = {};
  if (
    filterOptions &&
    filterOptions.contract_status &&
    filterOptions.contract_status.length
  ) {
    const index = filterOptions.contract_status.indexOf('signed');
    if (index !== -1) {
      filterOptions.contract_status[index] = 'active';
    }
    contractStatusParams = queryString.stringify({
      contract_status: filterOptions.contract_status,
    });
  }
  let bgsParams = {};

  if (
    filterOptions &&
    filterOptions.user &&
    filterOptions.user.length &&
    !adPerformance &&
    !dspAdPerformance
  ) {
    bgsParams = queryString.stringify({ user: filterOptions.user });
    params = {
      ...params,
    };
  }

  if (
    filterOptions &&
    filterOptions.ad_user &&
    filterOptions.ad_user.length &&
    adPerformance
  ) {
    bgsParams = queryString.stringify({ user: filterOptions.ad_user });
  }

  if (
    filterOptions &&
    filterOptions.dsp_user &&
    filterOptions.dsp_user.length &&
    dspAdPerformance
  ) {
    bgsParams = queryString.stringify({ user: filterOptions.dsp_user });
  }

  let contract = {};
  if (
    filterOptions &&
    filterOptions.contract_type &&
    filterOptions.contract_type.length
  ) {
    contract = queryString.stringify({
      contract_type:
        filterOptions.contract_type === 'any'
          ? []
          : filterOptions.contract_type,
    });
  }

  const result = await axiosInstance
    .get(
      `${API_CUSTOMER}?${
        statusParams && statusParams.length ? statusParams : ''
      }${bgsParams && bgsParams.length ? `&${bgsParams}` : ''}${
        contract && contract.length ? `&${contract}` : ''
      }${
        contractStatusParams && contractStatusParams.length
          ? `&${contractStatusParams}`
          : ''
      }`,
      { params },
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateCustomer(data = null, id) {
  if (data && Object.keys(data).length > 0) {
    const result = await axiosInstance
      .post(`${API_CUSTOMER + id}`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return null;
}

export async function getCustomerDetails(id) {
  const result = await axiosInstance
    .get(`${API_CUSTOMER + id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDocuments(id, type, docType) {
  const result = await axiosInstance
    .get(
      `${API_DOCUMENTS}?entity_type=${type}&&entity_id=${id}&&document_type=${docType}`,
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateCustomerDetails(id, data) {
  const result = await axiosInstance
    .patch(`${API_CUSTOMER + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getDocumentList() {
  const params = { document_type: 'profile_photo' };
  const result = await axiosInstance
    .get(API_DOCUMENTS, { params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAccountDetails(id) {
  const params = { customer: id };
  const result = await axiosInstance
    .get(API_CUSTOMER_CONTRACT, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateAccountDetails(id, data) {
  const result = await axiosInstance
    .patch(`${API_CUSTOMER_CONTRACT + id}/?expand=~all`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getCustomerMembers(id, pageNumber) {
  const customer = id
    ? {
        customer: id,
        page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
      }
    : { page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber };
  const params = customer;
  const result = await axiosInstance
    .get(API_CUSTOMER_MEMBER, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteCustomerMember(id) {
  const result = await axiosInstance
    .delete(`${API_CUSTOMER_MEMBER + id}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateCustomerMember(data) {
  const result = await axiosInstance
    .post(`${API_CUSTOMER_MEMBER}bulk-update/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function addCustomerMember(data, id) {
  const params = queryString.stringify({ customer_id: id, user_id: data });

  const result = await axiosInstance
    .post(`${API_CUSTOMER_MEMBER}bulk-create/?${params}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getActivityLog(pageNumber, id) {
  const params = {
    page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
  };
  if (id !== undefined) {
    const result = await axiosInstance
      .get(API_CUSTOMER + id + API_ACTIVITY_LOG, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return null;
}

export async function getCustomerActivityLog(pageNumber, id) {
  const params = {
    page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
    model: 'customer',
    id,
  };
  if (id !== undefined) {
    const result = await axiosInstance
      .get(API_ACTIVITY_LOG, { params })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  return null;
}

export async function createContactInfo(data) {
  const result = await axiosInstance
    .post(API_CONTACT, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateContactInfo(id, data) {
  const result = await axiosInstance
    .patch(`${API_CONTACT + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteContactInfo(id) {
  const result = await axiosInstance
    .delete(`${API_CONTACT + id}/`)
    .then(() => {
      return {};
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getCredentials(id) {
  const params = {
    customer: id,
  };
  const result = await axiosInstance
    .get(API_CREDENTIALS, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createCredentials(data) {
  const result = await axiosInstance
    .post(API_CREDENTIALS, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateCredentials(id, data) {
  const result = await axiosInstance
    .patch(`${API_CREDENTIALS + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteCredentials(id) {
  const result = await axiosInstance
    .delete(`${API_CREDENTIALS + id}/`)
    .then(() => {
      return {};
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createAmazonDetails(data) {
  const result = await axiosInstance
    .post(API_AMAZON_DETAILS, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAmazonDetails(customer) {
  const params = { customer };
  const result = await axiosInstance
    .get(API_AMAZON_DETAILS, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateAmazonDetails(id, data, customer) {
  const params = { customer };
  const result = await axiosInstance
    .patch(`${API_AMAZON_DETAILS + id}/`, data, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteAmazonMarketplace(merchant, marketplace) {
  const params = { merchant_id: merchant, marketplace_id: marketplace };
  const result = await axiosInstance
    .post(API_DELETE_MARKETPLACE, '', { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

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
    };
  } else {
    params = {
      sponsored_type: adType,
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
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

export async function getCustomers(
  pageNumber,
  dashboard,
  dailyFacts,
  orderBy,
  sequence,
  startDate,
  endDate,
) {
  let params = {};
  const page =
    pageNumber === '' || pageNumber === undefined
      ? 1
      : localStorage.getItem('page')
      ? localStorage.getItem('page')
      : pageNumber;
  if (startDate && endDate) {
    params = {
      page,
      dashboard,
      daily_facts: dailyFacts,
      'order-by': orderBy,
      sequence,
      start_date: startDate,
      end_date: endDate,
    };
  } else {
    params = {
      page,
      dashboard,
      daily_facts: dailyFacts,
      'order-by': orderBy,
      sequence,
    };
  }
  const result = await axiosInstance
    .get(`${API_CUSTOMER}`, { params })
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

export async function getAdManagerAdminGraphData(
  dashboardType,
  adType,
  dailyFacts,
  groupBy,
  marketplace,
  user,
  startDate,
  endDate,
) {
  let params = {};
  if (startDate && endDate) {
    if (dashboardType === 'sponsored-dashboard') {
      params = {
        sponsored_type: adType,
        daily_facts: dailyFacts,
        group_by: groupBy,
        marketplace,
        user,
        start_date: startDate,
        end_date: endDate,
      };
    } else {
      params = {
        daily_facts: dailyFacts,
        group_by: groupBy,
        marketplace,
        user,
        start_date: startDate,
        end_date: endDate,
      };
    }
  } else if (dashboardType === 'sponsored-dashboard') {
    params = {
      sponsored_type: adType,
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
      user,
    };
  } else {
    params = {
      daily_facts: dailyFacts,
      group_by: groupBy,
      marketplace,
      user,
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
) {
  const metricName = metricsNameForAPI[selectedMetric];

  let params = {
    dashboard: dashboardType,
    daily_facts: dailyFacts,
    marketplace,
    user,
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
      page: 1,
      sequence: 'asc',
    };
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
