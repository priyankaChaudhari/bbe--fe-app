// Auth
export const PATH_ROOT = '/';
export const PATH_LOGIN = '/signin';
export const PATH_FORGOT_PASSWORD = '/forgot-password';
export const PATH_RESET_PASSWORD = '/set-password';
export const PATH_UNAUTHORIZED_HEADER = '/unauthorized-header/';

// Customer
export const PATH_CUSTOMER_LIST = '/customer';
export const PATH_CUSTOMER_LIST_TABLET = '/customer-tablet';
export const PATH_CUSTOMER_DETAILS = `${PATH_CUSTOMER_LIST}/:id`;

// Contract
export const PATH_AGREEMENT = `${PATH_CUSTOMER_DETAILS}/agreement/:contract_id`;
export const PATH_STATEMENT = `${PATH_CUSTOMER_DETAILS}/statement`;
export const PATH_ADDENDUM = `${PATH_CUSTOMER_DETAILS}/addendum`;
export const PATH_ONE_TIME_AGREEMENT = `${PATH_CUSTOMER_DETAILS}/onetime-addendum`;
export const PATH_SERVICE_AMENDMENT = `${PATH_CUSTOMER_DETAILS}/service-amendment`;
export const PATH_DSP_ADDENDUM = `${PATH_CUSTOMER_DETAILS}/dsp-addendum`;
export const PATH_HELLO_SIGN = `/contract-signature`;
export const PATH_WARNING = '/warning/';

// Account Setup
export const PATH_ACCOUNT_SETUP = '/account-setup/';
export const PATH_ACCOUNT_SETUP_CHOOSE = `${PATH_ACCOUNT_SETUP}choose`;
export const PATH_CREATE_PASSWORD = `${PATH_ACCOUNT_SETUP}create-password`;
export const PATH_COMPANY_DETAILS = `${PATH_ACCOUNT_SETUP}company-details`;
export const PATH_BILLING_DETAILS = `${PATH_ACCOUNT_SETUP}billing-details`;
export const PATH_AMAZON_MERCHANT = `${PATH_ACCOUNT_SETUP}amazon-merchant`;
export const PATH_AMAZON_ACCOUNT = `${PATH_ACCOUNT_SETUP}amazon-account`;
export const PATH_UNAUTHORIZED_COMPANY_DETAILS = `${PATH_ACCOUNT_SETUP}assigned-company-details`;
export const PATH_UNAUTHORIZED_BILLING_DETAILS = `${PATH_ACCOUNT_SETUP}assigned-billing-details`;
export const PATH_UNAUTHORIZED_AMAZON_MERCHANT = `${PATH_ACCOUNT_SETUP}assigned-amazon-merchant`;
export const PATH_UNAUTHORIZED_AMAZON_ACCOUNT = `${PATH_ACCOUNT_SETUP}assigned-amazon-account`;
export const PATH_SUMMARY = '/summary';
export const PATH_THANKS = '/thanks';

// Knowledge Base
export const PATH_ARTICLE_LIST = '/collections/';
export const PATH_ARTICLE_DETAILS = `${PATH_ARTICLE_LIST}:id/`;

// Brand Partner
export const PATH_BGS_DASHBOARD = '/bgs-dashboard/';
export const PATH_TEAM_MEMBER = '/team-member/';
export const PATH_TABLET_TEAM_MEMBER = '/tablet-team-member';
export const PATH_ADM_DASHBOARD = '/adm-dashboard/';
export const PATH_DSP_DASHBOARD = '/dsp-dashboard/';
export const PATH_HYBRID_DASHBOARD = '/hybrid-dashboard/';

// Brand Assets
export const PATH_CHOOSE_BRAND_DELEGATE = `${PATH_CUSTOMER_DETAILS}/choose-delegate/:brandId`;
export const PATH_BRAND_ASSET = `${PATH_CUSTOMER_DETAILS}/brand-asset/:brandId`;
export const PATH_BRAND_ASSET_SUMMARY = `${PATH_CUSTOMER_DETAILS}/brand-summary/:brandId`;
export const PATH_BRAND_ASSET_PREVIEW = `${PATH_CUSTOMER_DETAILS}/brand-preview`;

export const PATH_UNAUTHORIZED_CHOOSE_BRAND_DELEGATE = `${PATH_CUSTOMER_DETAILS}/assigned-choose-delegate/:brandId`;
export const PATH_UNAUTHORIZED_BRAND_ASSET = `${PATH_CUSTOMER_DETAILS}/assigned-brand-asset/:brandId`;
export const PATH_UNAUTHROIZED_BRAND_ASSET_SUMMARY = `${PATH_CUSTOMER_DETAILS}/assigned-brand-summary/:brandId`;

// Product Assets
export const PATH_UPLOAD_PRODUCT_ASSET = '/upload-product-asset';
