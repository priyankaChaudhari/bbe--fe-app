/* eslint-disable guard-for-in */

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
} from '../constants/ApiConstants';

export async function getCustomerList(
  pageNumber,
  sort,
  filterOptions,
  searchQuery,
) {
  const params = {
    page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
    q: searchQuery,
    'order-by': sort['order-by'],
  };

  let statusParams = {};
  if (filterOptions && filterOptions.status && filterOptions.status.length) {
    statusParams = queryString.stringify({ status: filterOptions.status });
  }
  let bgsParams = {};
  if (filterOptions && filterOptions.user && filterOptions.user.length) {
    bgsParams = queryString.stringify({ user: filterOptions.user });
  }

  let contract = {};
  if (
    filterOptions &&
    filterOptions.contract_type &&
    filterOptions.contract_type.length
  ) {
    contract = queryString.stringify({
      contract_type: filterOptions.contract_type,
    });
  }

  const result = await axiosInstance
    .get(
      `${API_CUSTOMER}?${
        statusParams && statusParams.length ? statusParams : ''
      }${bgsParams && bgsParams.length ? `&${bgsParams}` : ''}${
        contract && contract.length ? `&${contract}` : ''
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

export async function getDocuments(id, type) {
  const result = await axiosInstance
    .get(`${API_DOCUMENTS}?entity_type=${type}&&entity_id=${id}`)
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
    .patch(`${API_CUSTOMER_CONTRACT + id}/`, data)
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
