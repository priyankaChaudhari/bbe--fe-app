// Auth
export {
  resetPassword,
  getEmail,
  updateUserInfo,
  updatePassword,
  userCustomerRoleList,
  updateUserMe,
  getCustomerNames,
  getUserData,
} from './AuthApi';

// customer
export {
  getCustomerList,
  getCustomers,
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
  getCustomerActivityLog,
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
  getBuyBoxChartData,
  getAdPerformance,
  getDSPPerformance,
  getDspPacingData,
} from './CustomerApi';

// Ad dashboard API
export {
  getAdManagerAdminGraphData,
  getKeyContributionData,
  getDspPacingDahboardData,
} from './AdDashboradApi';

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
  getAdManagers,
  getThresholdType,
  getYoyPercentage,
  getManagersList,
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

export {
  updateOnBoardCustomer,
  askSomeoneData,
  getStepDetails,
  updateAskSomeoneData,
  verifyStepToken,
  accountSummary,
  saveBillingInfo,
  getVideoLink,
  editCustomerEmail,
  verifyStepUser,
  getBillingDetails,
} from './OnboardingCustomerApi';

export {
  getAgreementList,
  getAssigneeCount,
  deleteDocument,
  updateBrandAssetStep,
  getBrandAssetsSummary,
  getBrandAssetsDetail,
  downloadBrandAssetImages,
  deleteComment,
  updateComment,
} from './BrandAssestsApi';

export {
  getNotes,
  saveNotes,
  updateNotes,
  deleteNote,
  getRecentNotes,
} from './NotesApi';

export {
  getProductCatalog,
  requestProductAssets,
  getRequestedProducts,
  updateProductAsset,
} from './ProductCatalogApi';
