import axiosInstance from '../axios';
import {
  API_ACCOUNT_ASSIGNEE_COUNT,
  API_CUSTOMER_CONTRACT,
  API_DOCUMENTS,
  API_BRAND_ASSETS,
  API_BRAND_ASSETS_SUMMARY,
  API_BRAND_ASSETS_COMMENTS,
} from '../constants/ApiConstants';

export async function getAgreementList(customer) {
  const fields = 'contract_type,start_date,end_date,id';
  const params = {
    customer,
    contract_status: 'active',
    fields,
  };
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

export async function getAssigneeCount(customer) {
  const result = await axiosInstance
    .get(API_ACCOUNT_ASSIGNEE_COUNT.replace(':id', customer))
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function deleteDocument(id) {
  const result = await axiosInstance
    .delete(`${API_DOCUMENTS + id}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateBrandAssetStep(id, data) {
  const result = await axiosInstance
    .patch(`${API_BRAND_ASSETS + id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBrandAssetsSummary(id) {
  const params = { brand_asset: id };
  const result = await axiosInstance
    .get(API_BRAND_ASSETS_SUMMARY, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getBrandAssetsDetail(id) {
  const result = await axiosInstance
    .get(`${API_BRAND_ASSETS + id}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function downloadBrandAssetImages(data) {
  const result = await axiosInstance
    .post(`${API_DOCUMENTS}download/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function storeNewCommentData(
  message,
  documentId,
  reAssignedEmail,
  position,
  annotationNumber,
  showClickModal,
) {
  let data = {
    message,
    document: documentId,
    re_assigned_email: reAssignedEmail,
  };

  if (showClickModal) {
    data = {
      ...data,
      x_coordinate: position.left,
      y_coordinate: position.top,
      annotation: annotationNumber,
    };
  }

  const result = await axiosInstance
    .post(`${API_BRAND_ASSETS_COMMENTS}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getCommentsData(pageNumber, documentId) {
  const params = { document: documentId, page: pageNumber };
  const result = await axiosInstance
    .get(`${API_BRAND_ASSETS_COMMENTS}/`, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
