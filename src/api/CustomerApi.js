import queryString from 'query-string';

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
  API_ACCOUNT_MARKETPLACE,
  API_USER,
} from '../constants';

export async function getCustomerList(
  pageNumber,
  sort,
  filterOptions,
  searchQuery,
  contractDetails,
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
  if (contractDetails) {
    params = {
      ...params,
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

  let accountTypeParams = {};
  if (filterOptions?.customer_account_type?.length) {
    accountTypeParams = queryString.stringify({
      customer_account_type: filterOptions.customer_account_type,
    });
  }
  let statusParams = {};
  if (filterOptions?.status?.length) {
    statusParams = queryString.stringify({
      status: filterOptions.status,
    });
  }
  let contractStatusParams = {};
  if (filterOptions?.contract_status?.length) {
    const index = filterOptions.contract_status.indexOf('signed');
    if (index !== -1) {
      filterOptions.contract_status[index] = 'active';
    }
    contractStatusParams = queryString.stringify({
      contract_status: filterOptions.contract_status,
    });
  }

  let bgsParams = {};

  if (filterOptions?.cd_user?.length && contractDetails) {
    bgsParams = queryString.stringify({ user: filterOptions.cd_user });
    params = {
      ...params,
    };
  }

  if (filterOptions?.user?.length && performance) {
    bgsParams = queryString.stringify({ user: filterOptions.user });
    params = {
      ...params,
    };
  }

  if (filterOptions?.ad_user?.length && adPerformance) {
    bgsParams = queryString.stringify({ user: filterOptions.ad_user });
  }

  if (filterOptions?.dsp_user?.length && dspAdPerformance) {
    bgsParams = queryString.stringify({ user: filterOptions.dsp_user });
  }

  let contract = {};
  if (filterOptions?.contract_type?.length) {
    contract = queryString.stringify({
      contract_type:
        filterOptions.contract_type === 'any'
          ? []
          : filterOptions.contract_type,
    });
  }

  let pipeline = {};
  if (filterOptions?.pipeline?.length) {
    pipeline = queryString.stringify({
      pipeline: filterOptions.pipeline === 'all' ? [] : filterOptions.pipeline,
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
      }${
        accountTypeParams && accountTypeParams.length
          ? `&${accountTypeParams}`
          : ''
      }${pipeline && pipeline.length ? `&${pipeline}` : ''}`,
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
    .get(`${API_CUSTOMER + id}/`)
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

export async function getCustomerMembers(id) {
  const result = await axiosInstance
    .get(`${API_CUSTOMER_MEMBER}?customer=${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAllMembers(
  role,
  findMembers,
  pageNumber,
  searchQuery,
) {
  const page = pageNumber === '' || pageNumber === undefined ? 1 : pageNumber;
  const result = await axiosInstance
    .get(
      `${API_USER}?role=${role}&find-members=${findMembers}&page=${page}&q=${searchQuery}`,
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function addCustomerMembers(data) {
  const result = await axiosInstance
    .post(`${API_CUSTOMER_MEMBER}bulk-create/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

// Remove delete, update, add Customer Meber API's after role enhancement
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

export async function getAccountMarketplace(id) {
  const result = await axiosInstance
    .get(API_ACCOUNT_MARKETPLACE.replace(':id', id))
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getCustomerContactDetails(id) {
  const params = {
    customer: id,
  };
  const result = await axiosInstance
    .get(API_CONTACT, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
