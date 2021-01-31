// Auth

export const API_LOGIN = '/login';
export const API_FORGOT_PASSWORD = '/request-password-reset/';
export const API_RESET_PASSWORD = '/reset-password/';
export const API_USER_ME = '/user/me/';
export const API_LOGOUT = '/logout';
export const API_USER = '/user/';
export const API_UPDATE_PASSWORD = '/change-password/';

// Customer
export const API_CUSTOMER = '/customer/';
export const API_CHOICES = '/choice/';
export const API_DOCUMENTS = '/document/';
export const API_CUSTOMER_CONTRACT = '/contract/';
export const API_CUSTOMER_MEMBER = '/customer-user/';
export const API_ACTIVITY_LOG = '/history/';
export const API_CONTACT = '/contact/';
export const API_CREDENTIALS = '/credentials/';
export const API_BGS = '/bgs/';

// Agreement
export const API_AGREEMENT_TEMPLATE = '/agreement-template/';
export const API_AGREEMENT_DETAILS = '/contract-details/';
export const API_MARKETPLACE = '/marketplaces/';
export const API_ADDITIONAL_SERVICES = '/additional-services/';
export const API_SERVICE_TYPE = '/type-of-services/';

// Knowledge Base
export const API_KNOWLEDGE_BASE = '/knowledge/';
export const API_ARTICLE_COLLECTIONS = `${API_KNOWLEDGE_BASE}collections/`;
export const API_ARTICLE_BOARDS = `${API_KNOWLEDGE_BASE}boards/`;
export const API_ARTICLE_CARDS = `${API_KNOWLEDGE_BASE}cards/`;
export const API_ARTICLE_SEARCH = `${API_KNOWLEDGE_BASE}search/`;
export const API_UPDATE_ARTICLE = `${API_KNOWLEDGE_BASE}suggest-update/`;
export const API_CREATE_ARTICLE = `${API_KNOWLEDGE_BASE}suggest-idea/`;

export const API_CONTRACT_DOCUMENT = `${API_CONTACT}contract-pdf/`;
export const API_CREATE_ADDENDUM = '/contract-data/';
export const API_TRANSACTION_DATA = '/transactional-data/';
export const API_CONTRACT_DESIGN = `${API_TRANSACTION_DATA}contract-design/`;
export const API_TRANSACTIONAL_SIGN_URL = `/sign-url/`;

export const NON_AUTHORIZATION_APIS = [
  API_LOGIN,
  API_FORGOT_PASSWORD,
  API_RESET_PASSWORD,
];
