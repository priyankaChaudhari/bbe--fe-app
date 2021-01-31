import axiosInstance from '../axios';
import {
  API_ADDITIONAL_SERVICES,
  API_AGREEMENT_DETAILS,
  API_AGREEMENT_TEMPLATE,
  API_MARKETPLACE,
  API_SERVICE_TYPE,
  API_CONTRACT_DOCUMENT,
  API_CREATE_ADDENDUM,
  API_TRANSACTION_DATA,
  API_CONTRACT_DESIGN,
  API_TRANSACTIONAL_SIGN_URL,
} from '../constants/ApiConstants';

export async function agreementTemplate() {
  const result = await axiosInstance
    .get(API_AGREEMENT_TEMPLATE)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function agreementDetails(id) {
  const result = await axiosInstance
    .get(`${API_AGREEMENT_DETAILS + id}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createMarketplace(data) {
  const result = await axiosInstance
    .post(API_MARKETPLACE, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateMarketplace(id, data) {
  const result = await axiosInstance
    .patch(`${API_MARKETPLACE + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteMarketplace(id, key) {
  const value =
    key === 'additional_monthly_services' ||
    key === 'additional_one_time_services'
      ? API_ADDITIONAL_SERVICES
      : API_MARKETPLACE;

  const result = await axiosInstance
    .delete(`${value + id}/`)
    .then(() => {
      return '';
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createAdditionalServices(data) {
  const result = await axiosInstance
    .post(API_ADDITIONAL_SERVICES, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateAdditionalServices(id, data) {
  const result = await axiosInstance
    .patch(`${API_ADDITIONAL_SERVICES + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getServiceTypes() {
  const result = await axiosInstance
    .get(API_SERVICE_TYPE)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createAgreement(data) {
  const result = await axiosInstance
    .post(API_CONTRACT_DOCUMENT, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createAddendum(data) {
  const result = await axiosInstance
    .post(API_CREATE_ADDENDUM, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAddendum(data) {
  const result = await axiosInstance
    .get(API_CREATE_ADDENDUM, { params: data })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateAddendum(id, data) {
  const result = await axiosInstance
    .patch(`${API_CREATE_ADDENDUM + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createTransactionData(data) {
  const result = await axiosInstance
    .post(API_TRANSACTION_DATA, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getTransactionData(data) {
  const result = await axiosInstance
    .get(API_TRANSACTION_DATA, { params: data })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createContractDesign(data) {
  const result = await axiosInstance
    .post(API_CONTRACT_DESIGN, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function transactionalSignUp(data) {
  const result = await axiosInstance
    .get(API_TRANSACTIONAL_SIGN_URL, { params: data })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
