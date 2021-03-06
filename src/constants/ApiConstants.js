// Auth
export const API_LOGIN = '/login';
export const API_FORGOT_PASSWORD = '/request-password-reset/';
export const API_RESET_PASSWORD = '/reset-password/';
export const API_USER_ME = '/user/me/';
export const API_LOGOUT = '/logout';
export const API_USER = '/user/';
export const API_UPDATE_PASSWORD = '/change-password/';
export const API_CUSTOMER_NAMES = '/get-customers';

// Customer
export const API_CUSTOMER = '/customer/';
export const API_CHOICES = '/choice/';
export const API_DOCUMENTS = '/document/';
export const API_CUSTOMER_CONTRACT = '/contract/';
export const API_CUSTOMER_MEMBER = '/customer-user/';
export const API_ACTIVITY_LOG = '/activity-log/';
export const API_CUSTOMER_ACTIVITY_LOG = '/customer_history/';
export const API_CONTACT = '/contact/';
export const API_CREDENTIALS = '/credentials/';
export const API_BGS = '/bgs/';
export const API_AMAZON_DETAILS = '/merchant/';
export const API_DELETE_MARKETPLACE = `${API_AMAZON_DETAILS}delete-marketplace/`;
export const API_PERFORMANCE = '/performance/';
export const API_VENDOR_ORDERED = '/performance-ordered-revenue/';
export const API_VENDOR_SHIPPED = '/performance-shipped-cogs/';

// export const API_PERFORMANCE = '/sales-performance/';
export const API_MARKETPLACES = '/marketplaces/';
export const API_ALL_MARKETPLACES = `${API_MARKETPLACES}all-marketplace/`;
export const API_AD_PERFORMANCE = '/performance-metrics/';
export const API_ALLOCATE_BALANCE = `${API_AD_PERFORMANCE}allocate-balance/`;
export const API_ESCROW_BALANCE_MARKETPLACE = `${API_AD_PERFORMANCE}get-escrow-balance-marketplace/`;
export const API_ESCROW_REALLOCATION = '/escrow-reallocation/';
export const API_ADM = '/manager-list/';
export const API_SERVICES_FEE = '/type-of-services/';
export const API_ACCOUNT_MARKETPLACE = `${API_CUSTOMER}:id/marketplace/`;

// BP Proposal
export const API_BP_PROPOSAL = '/dsp-budget-proposal/';

// Report Section API
export const API_REPORTS_TYPES = `${API_CHOICES}report-type`;
export const API_REPORTS_SECTION = '/bbe-reports/';
export const API_REPORTS_DOWNLOAD = '/bbe-reports/download-report/';

// Dashboard
export const API_AD_MANAGER_ADMIN_DASHBOARD = '/manager-dashboard/';
export const API_AD_DASHBOARD = '/ad-dashboard/';
export const API_SALES_DASHBOARD = 'sales-dashboard/';
export const API_BBE_GOAL_DASHBOARD = 'bbe-goals-dashboard/';
export const API_BBE_GOAL_METRICS = `${API_BBE_GOAL_DASHBOARD}performance-snapshot/`;
export const API_BBE_GOAL_DASHBOARD_CONTRIBUTION = `${API_BBE_GOAL_DASHBOARD}contribution/`;
export const API_BGS_COMMISSION = '/bgs-commission/';
export const API_BGS_COMMISSION_MATRICS = `${API_BGS_COMMISSION}top-matrics/`;
export const API_BGS_COMMISSION_INDIVIDUALS = `${API_BGS_COMMISSION}individuals/`;
export const API_BGS_COMMISSION_GROUP_BY_MANAGER = `${API_BGS_COMMISSION}group-by-manager/`;
export const API_BGS_COMMISSION_DETAILS = `${API_BGS_COMMISSION}details/`;

// Billing, Invoice & Budget
export const API_DSP_INVOICES = '/invoice/';
export const API_DSP_BILLING = '/bill/';
export const API_DSP_BUDGET_ADJUSTMENT = '/dsp-budget-adjustment/';
export const API_DSP_BUDGET_ADJUSTMENT_UPCOMIN_INVOICES = `${API_DSP_BUDGET_ADJUSTMENT}upcoming-invoices/`;
export const API_DSP_EMPTY_BUDGET_ADJUSTMENT = `${API_DSP_BUDGET_ADJUSTMENT}empty-adjustment/`;
export const API_DSP_CONTACT = '/dsp-contact/';

// Agreement
export const API_AGREEMENT_TEMPLATE = '/agreement-template/';
export const API_AGREEMENT_DETAILS = '/contract-details/';
export const API_MARKETPLACE = '/marketplaces/';
export const API_MARKETPLACE_BULK_UPDATE = `${API_MARKETPLACE}bulk-update/`;
export const API_ADDITIONAL_SERVICES = '/additional-services/';
export const API_ADDITIONAL_SERVICE_BULK_UPDATE = `${API_ADDITIONAL_SERVICES}bulk-update/`;
export const API_SEND_REMINDER = `${API_CUSTOMER_CONTRACT}send-reminder/`;
export const API_SIGNATURE_STATUS = `${API_CUSTOMER_CONTRACT}check-signature-status/`;
export const API_SERVICE_TYPE = `${API_SERVICES_FEE}service/`;
export const API_CONTRACT_DOCUMENT = `${API_CONTACT}contract-pdf/`;
export const API_CREATE_ADDENDUM = '/contract-data/';
export const API_TRANSACTION_DATA = '/transactional-data/';
export const API_CONTRACT_DESIGN = `${API_TRANSACTION_DATA}contract-design/`;
export const API_TRANSACTIONAL_SIGN_URL = `/sign-url/`;
export const API_CONTRACT_ACTIVITY_LOG = `/contract_history/`;
export const API_THRESHOLD_TYPE = `threshold-type`;
export const API_YOY_PERCENTAGE = `yoy-percentage`;
export const API_PAUSE_AGREEMENT = '/pause-contract/';
export const API_DISCOUNT = '/discount/';
export const API_FEE_STRUCTURE = '/contract-fee-structure/fee-data/';
export const API_SAVE_FEE_STRUCTURE = '/contract-fee-structure/';

// Knowledge Base
export const API_KNOWLEDGE_BASE = '/knowledge/';
export const API_ARTICLE_COLLECTIONS = `${API_KNOWLEDGE_BASE}collections/`;
export const API_ARTICLE_BOARDS = `${API_KNOWLEDGE_BASE}boards/`;
export const API_ARTICLE_CARDS = `${API_KNOWLEDGE_BASE}cards/`;
export const API_ARTICLE_SEARCH = `${API_KNOWLEDGE_BASE}search/`;
export const API_UPDATE_ARTICLE = `${API_KNOWLEDGE_BASE}suggest-update/`;
export const API_CREATE_ARTICLE = `${API_KNOWLEDGE_BASE}suggest-idea/`;

// Onboarding Customer
export const API_ONBOARD_CUSTOMER = '/customer-onboarding/';
export const API_ACCOUNT_SUMMARY = `${API_ONBOARD_CUSTOMER}:id/account-summary/`;
export const API_STEPS_ASSIGNED = '/steps-assigned/';
export const API_VERIFY_TOKEN = `${API_STEPS_ASSIGNED}verify-token/`;
export const API_BILLING_INFO = '/billing-info/';
export const API_PAYMENT_TERMS = '/payment-terms/';
export const API_PAYMENT_TERMS_OPTIONS = `${API_CHOICES}payment-terms`;
export const API_SAVE_PAYMENT_TERMS = `${API_PAYMENT_TERMS}bulk-update/`;
export const API_VIDEO_LINKS = '/customer/:id/get-video-link/';
export const API_EDIT_EMAIL = `${API_STEPS_ASSIGNED}edit-email/`;
export const API_VERIFY_USER = `${API_USER}verify-user/`;
export const API_AMAZON_ACCOUNT_DETAILS = `${API_CUSTOMER}:id/account-step-details/`;
export const API_AMAZON_SELLER_ACCOUNT = '/seller-central/';
export const API_AMAZON_VENDOR_ACCOUNT = '/vendor-central/';
export const API_AMAZON_SELLER_CENTRAL_BULK_CREATE = `${API_AMAZON_SELLER_ACCOUNT}bulk-create/`;
export const API_AMAZON_VENDOR_CENTRAL_BULK_CREATE = `${API_AMAZON_VENDOR_ACCOUNT}bulk-create/`;
export const API_AMAZON_SELLER_CENTRAL_BULK_UPDATE = `${API_AMAZON_SELLER_ACCOUNT}bulk-update/`;
export const API_AMAZON_VENDOR_CENTRAL_BULK_UPDATE = `${API_AMAZON_VENDOR_ACCOUNT}bulk-update/`;

// Brand Assets
export const API_ACCOUNT_ASSIGNEE_COUNT = `${API_CUSTOMER}:id/account-setup-completion/`;
export const API_BRAND_ASSETS = '/brand-assets/';
export const API_BRAND_ASSETS_SUMMARY = `${API_BRAND_ASSETS}summary/`;
export const API_BRAND_ASSETS_COMMENTS = 'comments';

// Notes
export const API_NOTES = `/notes/`;

// Product Catalog
export const API_PRODUCT_CATALOG = '/products/';

export const NON_AUTHORIZATION_APIS = [
  API_LOGIN,
  API_FORGOT_PASSWORD,
  API_RESET_PASSWORD,
  API_SIGNATURE_STATUS,
  API_ONBOARD_CUSTOMER,
  API_CUSTOMER_NAMES,
  API_VERIFY_USER,
  API_BRAND_ASSETS,
];
