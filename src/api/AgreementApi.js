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
  API_MARKETPLACE_BULK_UPDATE,
  API_ADDITIONAL_SERVICE_BULK_UPDATE,
  API_SEND_REMINDER,
  API_SIGNATURE_STATUS,
  API_ACTIVITY_LOG,
  API_CUSTOMER_CONTRACT,
  API_SERVICES_FEE,
  API_CUSTOMER,
  API_PAUSE_AGREEMENT,
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

export async function getcontract(id) {
  const params = { expand: '~all' };

  const result = await axiosInstance
    .get(`${API_CUSTOMER_CONTRACT + id}/`, { params })
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

export async function createMarketplaceBulk(data) {
  const params = { expand: '~all' };
  const result = await axiosInstance
    .post(API_MARKETPLACE_BULK_UPDATE, data, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createAdditionalServiceBulk(data) {
  const params = { expand: '~all' };
  const result = await axiosInstance
    .post(API_ADDITIONAL_SERVICE_BULK_UPDATE, data, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createAdditionalServices(data) {
  const params = { expand: '~all' };
  const result = await axiosInstance
    .post(API_ADDITIONAL_SERVICES, data, { params })
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

export async function sendReminderOfContract(data) {
  const result = await axiosInstance
    .get(API_SEND_REMINDER, { params: data })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function checksignatureStatus(data) {
  const result = await axiosInstance
    .get(API_SIGNATURE_STATUS, { params: data })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getContractActivityLog(pageNumber, id) {
  const params = {
    page: pageNumber === '' || pageNumber === undefined ? 1 : pageNumber,
    model: 'contract',
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

export async function getServicesFee() {
  const result = await axiosInstance
    .get(API_SERVICES_FEE)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function createContract(data) {
  const result = await axiosInstance
    .post(API_CUSTOMER_CONTRACT, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBGSManagers(id) {
  const result = await axiosInstance
    .get(`${API_CUSTOMER + id}/get-bgs-manager/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteContract(id) {
  const result = await axiosInstance
    .delete(`${API_CUSTOMER_CONTRACT + id}/`)
    .then(() => {
      return '';
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function savePauseAgreement(id, data) {
  if (id) {
    const result = await axiosInstance
      .patch(`${API_PAUSE_AGREEMENT + id}/`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
    return result;
  }
  const result = await axiosInstance
    .post(API_PAUSE_AGREEMENT, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getPauseAgreement(contract) {
  const params = { contract };
  const result = await axiosInstance
    .get(API_PAUSE_AGREEMENT, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getPauseAgreementDetails(pauseContractId) {
  const result = await axiosInstance
    .get(`${API_PAUSE_AGREEMENT + pauseContractId}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updatePauseAgreement(pauseId, data) {
  const result = await axiosInstance
    .patch(`${API_PAUSE_AGREEMENT + pauseId}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getAmendment(contractId) {
  const result = await axiosInstance
    .get(`${API_CUSTOMER_CONTRACT + contractId}/amendments/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
