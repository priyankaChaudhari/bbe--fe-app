import axiosInstance from '../axios';
import { API_PRODUCT_CATALOG } from '../constants/ApiConstants';

export async function getProductCatalog(customer) {
  const params = { customer, expand: 'product_variants' };
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

export async function requestData(customer) {
  const params = { customer };
  const result = await axiosInstance
    .post(API_PRODUCT_CATALOG, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
