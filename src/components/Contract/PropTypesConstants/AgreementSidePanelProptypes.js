import {
  string,
  bool,
  number,
  func,
  oneOfType,
  arrayOf,
  shape,
  object,
  objectOf,
  instanceOf,
} from 'prop-types';

export const agreementDefaultProptypes = {
  formData: {},
  loader: false,
  agreementData: {},
  newAddendumData: {},
  notIncludedOneTimeServices: [],
  apiError: {},
  showSection: {},
  updatedFormData: {},
  additionalMonthlyServices: [],
  originalData: {},
  additionalMarketplacesData: [],
  additionalOnetimeServices: [],
  additionalMarketplaceError: {},
  additionalMonthlySerError: {},
  additionalOnetimeSerError: {},
  contractError: {},
  showEditor: false,
  openCollapse: {},
  amazonStoreCustom: false,
  showAmazonPlanDropdown: false,
  showAdditionalMarketplace: {},
  startDate: '',
  sectionError: {},
  activityLoader: false,
  activityData: [],
  images: [],
  activityCount: 0,
  pageNumber: 1,
  isApicalled: false,
  isEditContract: false,
  customerError: {},
  isDocRendered: false,
  oneTimeService: [],
  monthlyService: [],
  AmazonStoreOptions: [],
  originalAddendumData: {},
  marketplacesResult: [],
  marketPlaces: [],
  additionalMarketplaces: [],
  firstMonthDate: '',
  thresholdTypeOptions: [],
  yoyPercentageOptions: [],
  Props: {},
  amendmentData: {},
  sidebarSection: {},
  setFormData: () => {},
  onEditAddendum: () => {},
  setShowEditor: () => {},
  setNewAddendum: () => {},
  setNotIncludedOneTimeServices: () => {},
  showFooter: () => {},
  setApiError: () => {},
  executeScroll: () => {},
  setShowCollpase: () => {},
  setUpdatedFormData: () => {},
  setMonthlyAdditionalServices: () => {},
  setAdditionalMarketplace: () => {},
  setAdditionalOnetimeServices: () => {},
  setAdditionalMarketplaceError: () => {},
  setAdditionalMonthlySerError: () => {},
  setAdditionalOnetimeSerError: () => {},
  setContractError: () => {},
  setOpenCollapse: () => {},
  setOriginalAddendumData: () => {},
  setAmazonStoreCustom: () => {},
  setShowAmazonPlanDropdown: () => {},
  setShowAdditionalMarketplace: () => {},
  setStartDate: () => {},
  setSectionError: () => {},
  setPageNumber: () => {},
  getContractActivityLogInfo: () => {},
  getContractDetails: () => {},
  setIsEditContract: () => {},
  setShowSaveSuccessMsg: () => {},
  setContractLoading: () => {},
  setCustomerErrors: () => {},
  fetchUncommonOptions: () => {},
  checkContractStatus: () => {},
  setShowDiscountModal: () => {},
  setDiscountFlag: () => {},
  setMarketPlaces: () => {},
  setSidebarSection: () => {},
  setAdditionalMarketplaces: () => {},
};

export const agreementSidePanelPropTypes = {
  Props: shape({
    selectProps: shape({
      menuIsOpen: bool,
    }),
  }),
  id: string.isRequired,
  setFormData: func,
  loader: bool,
  formData: shape({
    company_name: string,
    customer_id: shape({
      company_name: string,
      address: string,
      city: string,
      state: string,
      zip_code: string,
    }),
    threshold_type: string,
    additional_services: arrayOf(arrayOf(shape({}))),
    start_date: oneOfType([string, instanceOf(Date)]),
    sales_threshold: string,
    yoy_percentage: string,
    primary_marketplace: oneOfType([
      string,
      shape({
        fee: number,
        name: string,
        id: string,
      }),
    ]),
    length: oneOfType([
      string,
      shape({
        value: string,
        label: string,
      }),
    ]),
    additional_marketplaces: arrayOf(shape({})),
    additional_monthly_services: arrayOf(shape({})),
    additional_one_time_services: arrayOf(shape({})),
    quantity: number,
    contract_status: shape({
      label: string,
      value: string,
    }),
    contract_type: string,
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
    one_time_discount_type: oneOfType([string, number]),
    one_time_discount_amount: oneOfType([string, number]),
    dsp_fee: string,
    dsp_length: oneOfType([
      string,
      shape({
        value: string,
        label: string,
      }),
    ]),
    monthly_retainer: oneOfType([string, number]),
    rev_share: oneOfType([
      string,
      shape({
        value: string,
        label: string,
      }),
    ]),
    draft_from: oneOfType([string, objectOf(object)]),
  }),

  agreementData: shape({
    id: string,
    contract_type: string,
    contract_status: shape({
      label: string,
      value: string,
    }),
    primary_marketplace: oneOfType([
      string,
      shape({
        fee: number,
        name: string,
        id: string,
      }),
    ]),
    start_date: oneOfType([string, instanceOf(Date)]),
    additional_monthly_services: arrayOf(shape({})),
    additional_marketplaces: arrayOf(shape({})),
    steps_completed: objectOf(bool),
    additional_one_time_services: arrayOf(shape({})),
    sales_threshold: string,
    draft_from: string,
  }),
  newAddendumData: shape({
    id: string,
    addendum: string,
  }),

  onEditAddendum: func,
  setShowEditor: func,
  setNewAddendum: func,
  notIncludedOneTimeServices: arrayOf(shape({})),
  setNotIncludedOneTimeServices: func,

  apiError: shape({
    quantity: arrayOf(string),
    service: arrayOf(string),
    non_field_errors: arrayOf(string),
    amazon_store_package_custom: arrayOf(string),
  }),
  showFooter: func,
  setApiError: func,
  executeScroll: func,
  showSection: shape({
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  setShowCollpase: func,
  updatedFormData: shape({
    additional_services: arrayOf(arrayOf(shape({}))),
    start_date: string,
    company_name: string,
    primary_marketplace: oneOfType([
      string,
      shape({
        fee: number,
        name: string,
        id: string,
      }),
    ]),
    additional_marketplaces: oneOfType([object, arrayOf(object)]),
    additional_monthly_services: oneOfType([object, arrayOf(object)]),
    additional_one_time_services: oneOfType([object, arrayOf(object)]),
    quantity: number,
    addendum: string,
  }),
  setUpdatedFormData: func,
  additionalMonthlyServices: shape({
    create: arrayOf(shape({})),
    delete: arrayOf(string, shape({})),
  }),
  setMonthlyAdditionalServices: func,
  originalData: shape({
    id: string,
    additional_services: arrayOf(arrayOf(shape({}))),
    start_date: string,
    company_name: string,
    primary_marketplace: shape({
      fee: number,
      name: string,
      id: string,
    }),
    additional_marketplaces: arrayOf(shape({})),
    additional_monthly_services: arrayOf(shape({})),
    additional_one_time_services: arrayOf(shape({})),
    quantity: number,
  }),
  additionalMarketplacesData: shape({
    create: arrayOf(shape({})),
    delete: arrayOf(string, shape({})),
  }),
  setAdditionalMarketplace: func,
  additionalOnetimeServices: shape({
    create: arrayOf(shape({})),
    delete: arrayOf(string, shape({})),
  }),
  setAdditionalOnetimeServices: func,
  additionalMarketplaceError: oneOfType([string, object]),
  setAdditionalMarketplaceError: func,
  additionalMonthlySerError: oneOfType([string, object]),
  setAdditionalMonthlySerError: func,
  additionalOnetimeSerError: shape({
    quantity: number,
    custom_amazon_store_price: number,
  }),
  setAdditionalOnetimeSerError: func,
  contractError: shape({
    billing_cap: oneOfType([string, number]),
    yoy_percentage: string,
    sales_threshold: string,
    dsp_fee: string,
  }),
  setContractError: func,
  setOriginalAddendumData: func,
  showEditor: bool,
  openCollapse: shape({
    agreement: bool,
    statement: bool,
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  setOpenCollapse: func,
  amazonStoreCustom: bool,
  setAmazonStoreCustom: func,
  showAmazonPlanDropdown: bool,
  setShowAmazonPlanDropdown: func,
  showAdditionalMarketplace: shape({}),
  setShowAdditionalMarketplace: func,
  startDate: oneOfType([string, instanceOf(Date)]),
  setStartDate: func,
  sectionError: shape({
    agreement: number,
    dsp: number,
    statement: number,
  }),
  setSectionError: func,
  setPageNumber: func,
  getContractActivityLogInfo: func,
  activityLoader: bool,
  activityData: arrayOf(shape({})),
  images: arrayOf(shape({})),
  activityCount: oneOfType([arrayOf(object), number]),
  pageNumber: number,
  isApicalled: bool,
  getContractDetails: func,
  isEditContract: bool,
  setIsEditContract: func,
  setShowSaveSuccessMsg: func,
  setContractLoading: func,
  customerError: objectOf(shape({})),
  setCustomerErrors: func,
  isDocRendered: bool,
  oneTimeService: arrayOf(shape({})),
  monthlyService: arrayOf(shape({})),
  AmazonStoreOptions: arrayOf(shape({})),
  fetchUncommonOptions: func,
  originalAddendumData: oneOfType([
    number,
    objectOf(object),
    shape({
      id: string,
    }),
  ]),
  checkContractStatus: func,
  setShowDiscountModal: func,
  setDiscountFlag: func,
  marketplacesResult: arrayOf(shape({})),
  marketPlaces: arrayOf(shape({})),
  setMarketPlaces: func,
  additionalMarketplaces: arrayOf(shape({})),
  setAdditionalMarketplaces: func,
  firstMonthDate: oneOfType([string, instanceOf(Date)]),
  thresholdTypeOptions: arrayOf(shape({})),
  yoyPercentageOptions: arrayOf(shape({})),
  amendmentData: oneOfType([string, object]),
  sidebarSection: string,
  setSidebarSection: func,
};
