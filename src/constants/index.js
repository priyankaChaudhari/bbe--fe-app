// Auth
export const PATH_ROOT = '/';
export const PATH_LOGIN = '/signin';
export const PATH_FORGOT_PASSWORD = '/forgot-password';
export const PATH_RESET_PASSWORD = '/set-password';

// Customer
export const PATH_CUSTOMER_LIST = '/customer';
export const PATH_CUSTOMER_DETAILS = `${PATH_CUSTOMER_LIST}/:id`;
export const PATH_COMPANY_DETAIL = '/company-detail';
export const PATH_CUSTOMER_ACTIVITY = '/customer-activity';

// Details
export const PATH_ACCOUNT_DETAILS = '/customer-account/:id';

// Contract
export const PATH_AGREEMENT = `${PATH_CUSTOMER_DETAILS}/agreement`;
export const PATH_STATEMENT = `${PATH_CUSTOMER_DETAILS}/statement`;
export const PATH_ADDENDUM = `${PATH_CUSTOMER_DETAILS}/addendum`;
export const PATH_ONE_TIME_AGREEMENT = `${PATH_CUSTOMER_DETAILS}/onetime-addendum`;
export const PATH_SERVICE_AMENDMENT = `${PATH_CUSTOMER_DETAILS}/service-amendment`;
export const PATH_DSP_ADDENDUM = `${PATH_CUSTOMER_DETAILS}/dsp-addendum`;
export const PATH_HELLO_SIGN = `/contract-signature`;

// Account Setup
export const PATH_ACCOUNT_SETUP = '/account-setup/';
export const PATH_CREATE_PASSWORD = `${PATH_ACCOUNT_SETUP}create-password`;
export const PATH_COMPANY_DETAILS = `${PATH_ACCOUNT_SETUP}company-details`;
export const PATH_AMAZON_ACCOUNT = `${PATH_ACCOUNT_SETUP}amazon-account`;
export const PATH_BILLING_DETAILS = `${PATH_ACCOUNT_SETUP}billing-details`;

// Knowledge Base
export const PATH_ARTICLE_LIST = '/collections/';
export const PATH_ARTICLE_DETAILS = `${PATH_ARTICLE_LIST}:id/`;
