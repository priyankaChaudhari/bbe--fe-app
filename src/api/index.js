// Auth
export {
  resetPassword,
  getEmail,
  updateUserInfo,
  updatePassword,
  userCustomerRoleList,
  updateUserMe,
} from './AuthApi';

// customer
export {
  getCustomerList,
  updateCustomer,
  getCustomerDetails,
  getDocuments,
  updateCustomerDetails,
  getDocumentList,
  getAccountDetails,
  updateAccountDetails,
  getCustomerMembers,
  deleteCustomerMember,
  updateCustomerMember,
  addCustomerMember,
  getActivityLog,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
  getCredentials,
  createCredentials,
  updateCredentials,
  deleteCredentials,
  createAmazonDetails,
  getAmazonDetails,
  updateAmazonDetails,
  deleteAmazonMarketplace,
  getPerformance,
} from './CustomerApi';

// Choices
export {
  getStatus,
  getCountry,
  getState,
  getCategories,
  getChannels,
  getSellerType,
  getRoles,
  getContactRoles,
  getGrowthStrategist,
  getOneTimeService,
  getMonthlyService,
  getLength,
  getRevenueShare,
  getMarketplaces,
  getAdditionalServices,
  getContractStatus,
  getMarketPlaceList,
} from './ChoicesApi';

// Contract
export {
  agreementTemplate,
  agreementDetails,
  createMarketplace,
  updateMarketplace,
  deleteMarketplace,
  createAdditionalServices,
  updateAdditionalServices,
  getServiceTypes,
  createAgreement,
  createAddendum,
  getAddendum,
  updateAddendum,
  createTransactionData,
  createContractDesign,
  transactionalSignUp,
  getTransactionData,
  createAdditionalServiceBulk,
  createMarketplaceBulk,
  sendReminderOfContract,
  checksignatureStatus,
  getContractActivityLog,
} from './AgreementApi';

// Knowledge Base
export {
  getArticleCollections,
  getArticleBoards,
  getArticleCards,
  getArticleSearch,
  updateArticle,
  createArticle,
} from './ArticleApi';

// export default {getBGSCustomerList} from './BgsApi'
