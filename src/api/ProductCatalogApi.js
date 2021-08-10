import axiosInstance from '../axios';
import { API_PRODUCT_CATALOG } from '../constants/ApiConstants';

export async function getProductCatalog(customer, filters) {
  const params = { customer, expand: 'product_variants', ...filters };

  const result = await axiosInstance
    .get(API_PRODUCT_CATALOG, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function requestProductAssets(params) {
  // const params = { customer };
  const result = await axiosInstance
    .post(`${API_PRODUCT_CATALOG}request-assets/`, params)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function getRequestedProducts(id) {
  const result = await axiosInstance
    .get(`product-assets/${id}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

export async function updateProductAsset(id, data) {
  const result = await axiosInstance
    .patch(`product-assets/${id}/`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
