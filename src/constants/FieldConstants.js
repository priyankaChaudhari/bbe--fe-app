import {
  PATH_AMAZON_MERCHANT,
  PATH_BILLING_DETAILS,
  PATH_COMPANY_DETAILS,
  PATH_SUMMARY,
} from '.';
import {
  LinkeDinIcons,
  FaceBookIcons,
  TwitterIcons,
  InstagramIcons,
  PinterestIcon,
  ToolIcon,
  UserIcon,
  AdBannerIcon,
  UpChevronIcon,
  OpenBook,
  CompanyKnowledge,
  Creative,
  CustomerService,
  HelpingHand,
  Logistics,
  BullHorn,
  NextIcon,
  ProductivityTools,
  PiggyBank,
  AmazonIcon,
  SellerSupport,
  BoxesIcon,
  SquareFbIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  ViewExternalLink,
  CopyIcon,
  PauseIcon,
  CloseCircleIcon,
  DeleteIcon,
} from '../theme/images/index';

export const sortByOrderOptions = [
  { value: true, label: 'Highest to Lowest' },
  { value: false, label: 'Lowest to Highest' },
];

export const sortOptions = [
  { value: '-created_at', label: 'Recently Added' },
  { value: '-updated_at', label: 'Last Modified' },
  { value: 'expiring_soon', label: 'Expiry Date' },
];

export const performanceSortOptions = [
  { value: 'revenue', label: 'Revenue', order: true, class: 'revenue' },
  {
    value: 'units_sold',
    label: 'Units Sold',
    order: true,
    class: 'units_sold',
  },
  { value: 'traffic', label: 'Traffic', order: true, class: 'traffic' },
  {
    value: 'conversion',
    label: 'Conversion',
    order: true,
    class: 'conversion',
  },
];

export const sadSortOptions = [
  { value: 'ad_sales', label: 'Ad Sales', order: true, class: 'revenue' },
  { value: 'ad_spend', label: 'Ad Spend', order: true, class: 'units_sold' },
  {
    value: 'impressions',
    label: 'Ad Impressions',
    order: true,
    class: 'traffic',
  },
  { value: 'acos', label: 'ACOS', order: true, class: 'conversion' },
];

export const dadSortOptions = [
  {
    value: 'impressions',
    label: 'Impressions',
    order: true,
    class: 'revenue',
  },
  { value: 'dsp_spend', label: 'DSP Spend', order: true, class: 'units_sold' },
  {
    value: 'total_product_sales',
    label: 'Total Product Sales',
    order: true,
    class: 'traffic',
  },
  {
    value: 'total_roas',
    label: 'Total ROAS',
    order: true,
    class: 'conversion',
  },
];

export const timeFrameFilters = [
  { value: 'week', label: 'Recent 7 days' },
  { value: 'month', label: 'Recent Month' },
  { value: '30days', label: 'Recent 30 days' },
  {
    value: 'custom',
    label: 'Custom Period',
    sub: 'Select start and end dates',
  },
];

export const editCompanyFields = [
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    property: 'col-md-12',
  },
  { key: 'brand', label: 'Brands', property: 'col-md-6' },
  { key: 'phone_number', label: 'Phone', property: 'col-md-6', type: 'text' },
  {
    key: 'social',
    label: 'Social',

    type: 'social',
    property: 'col-md-12',
    choices: [
      { key: 'facebook', item: FaceBookIcons, label: 'Facebook' },
      { key: 'twitter', item: TwitterIcons, label: 'Twitter' },
      { key: 'linkedin', item: LinkeDinIcons, label: 'LinkedIn' },
      { key: 'instagram', item: InstagramIcons, label: 'Instagram' },
      { key: 'pinterest', item: PinterestIcon, label: 'Pinterest' },
    ],
  },
];

export const editAccountFields = [
  {
    key: 'company_name',
    label: 'Company Name',
    property: 'col-9',
    type: 'text',
  },
  { key: 'website', label: 'Website', type: 'text', property: 'col-md-6' },
  {
    key: 'country',
    label: 'Country',
    type: 'choice',
    property: 'col-md-6',
  },
  {
    key: 'address',
    label: 'Address',
    property: 'col-12',
    type: 'text',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
    property: 'col-md-6',
  },
  {
    key: 'state',
    label: 'State',
    type: 'text',
    property: 'col-md-6',
  },

  {
    key: 'zip_code',
    label: 'Postal Code',
    property: 'col-md-12',
    type: 'text',
  },
];

export const AgreementDetails = [
  {
    key: 'company_name',
    label: 'Customer Name',
    type: 'text',
    placeholder: 'Enter Customer Name',
    isMandatory: true,
    part: 'agreement',
    error: false,
    field: 'customer',
  },
  {
    key: 'start_date',
    label: 'Contract Start Date',
    type: 'date',
    placeholder: 'Select Date',
    isMandatory: true,
    part: 'agreement',
    error: false,
  },
  {
    key: 'length',
    label: 'Contract Length',
    type: 'choice',
    placeholder: 'Select Contract Length',
    isMandatory: true,
    part: 'agreement',
    error: false,
  },
  {
    key: 'contract_address',
    label: 'Contract Address',
    sections: [
      {
        key: 'address',
        type: 'text',
        placeholder: 'Enter Address',
        isMandatory: true,
        part: 'agreement',
        error: false,
        field: 'customer',
      },
      {
        key: 'state',
        type: 'text',
        placeholder: 'Enter State',
        isMandatory: true,
        part: 'agreement',
        error: false,
        field: 'customer',
      },
      {
        key: 'city',
        type: 'text',
        placeholder: 'Enter City',
        isMandatory: true,
        part: 'agreement',
        error: false,
        field: 'customer',
      },
      {
        key: 'zip_code',
        type: 'text',
        placeholder: 'Enter Postcode',
        isMandatory: true,
        part: 'agreement',
        error: false,
        field: 'customer',
      },
    ],
  },
];

export const ListingOptimization = [
  {
    key: 'content_optimization',
    label: 'Copy',
    type: 'text',
  },
  {
    key: 'design_optimization',
    label: 'Design',
    type: 'text',
  },
];

export const remainingFieldsOfContract = [
  {
    key: 'contract_status',
    label: 'Contract Status',
    type: 'object',
  },
  {
    key: 'contract_type',
    label: 'Contract Type',
    type: 'text',
  },
  {
    key: 'monthly_discount_amount',
    label: 'Monthly discount amount',
    type: 'number-currency',
  },
  {
    key: 'monthly_discount_type',
    label: 'Monthly discount type',
    type: 'text',
  },
  {
    key: 'one_time_deal_amount',
    label: 'One time deal amount',
    type: 'number-currency',
  },
  {
    key: 'one_time_discount_amount',
    label: 'One time discount amount',
    type: 'number-currency',
  },
  {
    key: 'one_time_discount_type',
    label: 'One time discount type',
    type: 'text',
  },
  {
    key: 'sales_threshold',
    label: 'Sales Threshold',
    type: 'text',
  },
  {
    key: 'seller_type',
    label: 'Seller Type',
    type: 'text',
  },
  {
    key: 'threshold_type',
    label: 'Threshold Type',
    type: 'text',
  },
  {
    key: 'yoy_percentage',
    label: 'YOY Percentage',
    type: 'text',
  },
];

export const StatementDetails = [
  {
    key: 'monthly_retainer',
    label: 'Monthly Retainer',
    type: 'number-currency',
    placeholder: 'Enter Monthly Retainer',
    isMandatory: true,
    part: 'statement',
  },
  {
    key: 'primary_marketplace',
    label: 'Primary MarketPlace',
    type: 'choice',
    placeholder: 'Select Primary Marketplace',
    isMandatory: true,
    part: 'statement',
  },
  {
    key: 'rev_share',
    label: 'Revenue Share',
    type: 'choice',
    placeholder: 'Select Revenue Share',
    isMandatory: true,
    part: 'statement',
  },
  {
    key: 'billing_cap',
    label: 'BILLING CAP',
    type: 'number-currency',
    placeholder: 'Enter Billing Cap',
    isMandatory: false,
    part: 'statement',
  },
];

export const DSPAddendumDetails = [
  {
    key: 'start_date',
    label: 'Advertising Start Date',
    type: 'date',
    placeholder: 'Enter Advertising Start Date',
    info:
      'The advertising start date is auto populated based on the contract start date and amended to fall on the 1st or 16th of the month.',
    isMandatory: false,
    part: 'dsp',
  },
  {
    key: 'dsp_fee',
    label: 'Monthly Ad Budget',
    type: 'number-currency',
    placeholder: 'Enter budget',
    isMandatory: true,
    part: 'dsp',
    // info: 'The minimum monthly budget is $10,000.',
  },
  {
    key: 'dsp_length',
    label: 'INITIAL PERIOD (MONTHS)',
    type: 'choice',
    placeholder: 'Select Period',
    isMandatory: true,
    part: 'dsp',
  },
];

export const collectionDetails = [
  {
    key: '3rd Party Tools',
    icon: ToolIcon,
  },
  {
    key: 'Account Management',
    icon: UserIcon,
  },
  {
    key: 'Advertising',
    icon: AdBannerIcon,
  },
  {
    key: 'Amazon 101',
    icon: AmazonIcon,
  },
  {
    key: 'BBE',
    icon: UpChevronIcon,
  },
  {
    key: 'Catalog',
    icon: OpenBook,
  },
  {
    key: 'Company Knowledge',
    icon: CompanyKnowledge,
  },
  {
    key: 'Creative',
    icon: Creative,
  },
  {
    key: 'Customer Service',
    icon: CustomerService,
  },
  {
    key: 'Human Resource',
    icon: HelpingHand,
  },
  {
    key: 'Logistics',
    icon: Logistics,
  },
  {
    key: 'Marketing',
    icon: BullHorn,
  },
  {
    key: 'NEXT',
    icon: NextIcon,
  },
  {
    key: 'Productivity Tools',
    icon: ProductivityTools,
  },
  {
    key: 'Sales',
    icon: PiggyBank,
  },
  {
    key: 'Seller Support - Seller Performance',
    icon: SellerSupport,
  },
  {
    key: 'Vendor Collection',
    icon: BoxesIcon,
  },
];

export const SocialIcons = [
  {
    key: 'facebook',
    value: FaceBookIcons,
    label: 'Facebook',
    onboard: SquareFbIcon,
    property: 'social-media face-book mr-1',
  },
  {
    key: 'twitter',
    value: TwitterIcons,
    label: 'Twitter',
    onboard: TwitterIcon,
    property: 'social-media mr-1',
  },
  {
    key: 'linkedin',
    value: LinkeDinIcons,
    label: 'LinkedIn',
    onboard: LinkedinIcon,
    property: 'social-media linedin mr-1',
  },
  {
    key: 'instagram',
    value: InstagramIcons,
    label: 'Instagram',
    onboard: InstagramIcon,
    property: 'social-media  insta mr-1',
  },
  {
    key: 'pinterest',
    value: PinterestIcon,
    label: 'Pinterest',
    onboard: PinterestIcon,
    property: 'social-media  insta mr-1',
  },
];

export const ACHDetails = [
  { key: 'account_name', label: 'Name on Account', type: 'text' },
  { key: 'bank_name', label: 'Bank Name', type: 'text' },
  { key: 'account_number', label: 'Account Number', type: 'number' },
  { key: 'routing_number', label: 'Routing Number', type: 'number' },
];

export const creditCardDetails = [
  {
    details: [
      {
        key: 'card_holder_name',
        label: 'Cardholder Name',
        type: 'text',
        property: 'col-12',
      },
      {
        key: 'card_number',
        label: 'Credit Card Number',
        type: 'number',
        property: 'col-12',
        format: '#### #### #### ####',
      },
      {
        key: 'expiration_date',
        label: 'Expiration Date',
        type: 'number',
        property: 'col-8 pr-0',
        format: '##/##',
      },
      {
        key: 'card_code',
        label: 'CVV',
        type: 'number',
        property: 'col-4',
        format: '####',
      },
    ],
  },
];

export const customerContactDetails = [
  {
    key: 'first_name',
    label: 'First name',
    type: 'text',
    property: 'col-md-6',
  },
  {
    key: 'last_name',
    label: 'Last name',
    type: 'text',
    property: 'col-md-6',
  },
  {
    key: 'role',
    label: 'Role',
    type: 'text',
    property: 'col-md-12',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    property: 'col-md-12',
  },
  {
    key: 'phone_number',
    label: 'Phone number',
    type: 'text',
    property: 'col-md-12',
  },
];

export const BillingAddress = [
  {
    key: 'address',
    label: 'Address',
    type: 'text',
    property: 'col-12',
    section: 'address',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
    property: 'col-12',
    section: 'address',
  },
  {
    key: 'state',
    label: 'State',
    type: 'text',
    property: 'col-6 pr-2',
    section: 'address',
  },
  {
    key: 'postal_code',
    label: 'Postal Code',
    type: 'text',
    property: 'col-6 pl-2',
    section: 'address',
  },
  {
    key: 'first_name',
    label: 'First name',
    type: 'text',
    property: 'col-6 pr-2',
    section: 'contact',
  },
  {
    key: 'last_name',
    label: 'Last name',
    type: 'text',
    property: 'col-6 pl-2',
    section: 'contact',
  },

  {
    key: 'email',
    label: 'Email',
    type: 'email',
    property: 'col-6 pr-2',
    section: 'contact',
  },
  {
    key: 'phone_number',
    label: 'Phone number',
    type: 'number',
    property: 'col-6 pl-2',
    section: 'contact',
  },
];

export const PaymentType = [
  { key: 'ach', label: 'ACH', type: 'radio' },
  { key: 'credit_card', label: 'Credit Card', type: 'radio' },
];

export const whichStep = [
  {
    key: 'digital presence',
    stepof: 2,
    title: 'Your company’s digital presence',
    skip: PATH_BILLING_DETAILS,
    bar: '40',
    path: 'company-details',
    subTitle: 'Need help on why we need this information?',
    video: true,
  },
  {
    key: 'billing information',
    stepof: 3,
    title: 'Billing Information',
    skip: PATH_AMAZON_MERCHANT,
    back: PATH_COMPANY_DETAILS,
    bar: '60',
    path: 'billing-details',
    video: false,
  },
  {
    key: 'merchant id',
    stepof: 4,
    title: 'Amazon Account Names & IDs',
    skip: PATH_SUMMARY,
    back: PATH_BILLING_DETAILS,
    bar: '80',
    path: 'amazon-merchant',
    subTitle:
      'If you don’t have access to your Amazon Seller Central and Vender Central admin accounts then you can use the checkbox below to assign this step to someone that does.',
    video: false,
  },
];

export const stepPath = [
  {
    key: 'digital presence',
    view: PATH_COMPANY_DETAILS,
    title: "Your Company's Digital Presence",
  },
  {
    key: 'billing information',
    title: 'Billing Information',
    view: PATH_BILLING_DETAILS,
  },
  {
    key: 'merchant id',
    title: 'Amazon Account Names & IDs',
    view: PATH_AMAZON_MERCHANT,
  },
];

export const BrandSteps = [
  {
    key: 'brand_logo',
    url: 'brand-logo',
    label: 'Brand Logo',
    step: 1,
    subtitle: 'Please upload one or more versions of your brand logo.',
    format: 'AI or EPS file',
    skip: 'brand-guidelines',
  },
  {
    key: 'brand_guidelines',
    url: 'brand-guidelines',
    label: 'Brand Guidelines',
    step: 2,
    subtitle:
      'Please upload a brand style guide. This should include specifics around brand colors, logo usage, fonts, tone of voice and other relevant information.',
    format: 'PDF',
    skip: 'font-files',
  },
  {
    key: 'font_files',
    url: 'font-files',
    label: 'Font Files',
    step: 3,
    subtitle:
      'Please upload the raw font files that are used across your brand identity, such as for your logo or any specific fonts used on your website and marketing material.',
    format: 'OTF, TTF, WOFF',
    skip: 'iconography',
  },
  {
    key: 'iconography',
    url: 'iconography',
    label: 'Iconography',
    step: 4,
    subtitle:
      "Please upload any iconography you use across your brand's various platforms, such as your website and marketing material.",

    format: 'AI, EPS, SVG',
    skip: 'additional-brand-material',
  },
  {
    key: 'additional_brand_material',
    url: 'additional-brand-material',
    label: 'Additional Brand Material',
    step: 5,
    subtitle:
      'Please upload anything else you have that will help us understand and represent your brand image as accurately as possible.',
    format: '',
    skip: 'summary',
  },
];

export const additionaMarketplaceAmount = 1500;

export const managementLink =
  'https://sites.google.com/buyboxexperts.com/employee-engagement/home';
export const helpDeskLink =
  'https://bbe.atlassian.net/servicedesk/customer/portals';

export const options = [
  { value: 'contract_details', label: 'Accounts' },
  { value: 'performance', label: 'Sales Performance' },
  { value: 'sponsored_ad_performance', label: 'Sponsored Ad Performance' },
  { value: 'dsp_ad_performance', label: 'DSP Ad Performance' },
];
export const contractChoices = [
  { value: 'any', label: 'Any' },
  { value: 'recurring', label: 'Recurring' },
  { value: 'one time', label: 'One Time' },
  { value: 'dsp only', label: 'DSP Only' },
  { value: 'recurring (90 day notice)', label: 'Recurring (90 day notice)' },
];
export const contractStatus = [
  { value: 'active', label: 'Signed' },
  { value: 'pending contract signature', label: 'Pending Signature' },
  { value: 'pending contract approval', label: 'Pending Approval' },
  { value: 'pending contract', label: 'Pending Contract' },
];
export const AmazonSellerAccountDetails = [
  {
    key: 'seller_central_name',
    label: 'Seller Central Account Name',
    section: 1,
  },
  { key: 'merchant_id', label: 'Merchant ID', section: 1 },
  { key: 'advertiser_name', label: 'Advertiser Name', section: 2 },
  { key: 'advertiser_id', label: 'Advertiser Entity ID', section: 2 },
];

export const AmazonVendorAccountDetails = [
  {
    key: 'vendor_central_name',
    label: 'Vendor Central Account Name',
    section: 1,
  },
  { key: 'vendor_code', label: 'Vendor Code', section: 1 },
  { key: 'advertiser_name', label: 'Advertiser Name', section: 2 },
  { key: 'advertiser_id', label: 'Advertiser Entity ID', section: 2 },
];

export const contractOptions = [
  { value: 'view', label: 'View Agreement', icon: ViewExternalLink },
  { value: 'draft', label: 'Draft New Version', icon: CopyIcon },
  { value: 'pause', label: 'Pause Agreement', icon: PauseIcon },
  { value: 'cancel', label: 'Cancel Agreement', icon: CloseCircleIcon },
];

export const draftContractOptions = [
  { value: 'view', label: 'View Agreement', icon: ViewExternalLink },
  { value: 'edit', label: 'Edit Agreement', icon: CopyIcon },
  { value: 'delete', label: 'Delete Agreement', icon: DeleteIcon },
];

export const pauseAgreementOptions = [
  { value: 'view', label: 'View Agreement', icon: ViewExternalLink },
  { value: 'draft', label: 'Draft New Version', icon: CopyIcon },
  { value: 'unpause', label: 'Unpause Agreement', icon: PauseIcon },
  { value: 'cancel', label: 'Cancel Agreement', icon: CloseCircleIcon },
];

export const agreementOptions = [
  { key: 'monthly_retainer', label: 'Monthly Retainer' },
  { key: 'rev_share', label: 'Rev Share' },
  { key: 'sales_threshold', label: 'Sales Threshold' },
  { key: 'billing_cap', label: 'Billing Cap' },
  {
    key: 'content_optimization',
    label: 'Copy Optimization',
  },
  {
    key: 'design_optimization',
    label: 'Design Optimization',
  },
];
