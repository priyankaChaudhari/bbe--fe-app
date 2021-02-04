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
  BuildingIcon,
  PencilPaint,
  HeadSet,
  HelpingHand,
  WareHouse,
  BullHorn,
  PiggyBank,
  AmazonIcon,
  GraphIcon,
  BoxesIcon,
  VisaCardIcons,
  MasterCardIcons,
  DiscoverCardIcons,
  AmercianExpressCardIcons,
} from '../theme/images/index';

export const userDetails = [
  {
    key: 'first_name',
    label: 'First name',
    placeholder: 'Enter First name',
    type: 'text',
    section: 1,
  },

  {
    key: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    type: 'text',
    section: 1,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: 'Invalid email address.',
    },
  },
  {
    key: 'last_name',
    label: 'Last name',
    placeholder: 'Enter Last name',
    type: 'text',
    section: 2,
  },
  {
    key: 'phone_number',
    label: 'Phone',
    placeholder: 'Enter Phone',
    type: 'text',
    section: 2,
  },
  {
    key: 'old_password',
    label: 'Current password',
    placeholder: 'Enter current password',
    type: 'password',
    section: 3,
  },
  {
    key: 'new_password',
    label: 'New password',
    placeholder: 'Enter new password',
    type: 'password',
    section: 4,
  },
];

export const dataHeaders = [
  {
    key: 'contract_company_name',
    name: 'Company Name',
    width: '25%',
    section: 1,
    type: 'icon',
    level: 'contract',
  },
  { key: 'status', name: 'Status', width: '15%', section: 1 },
  {
    key: 'start_date',
    name: 'Start Date',
    width: '10%',
    section: 1,
    level: 'contract',
  },
  {
    key: 'contract_type',
    name: 'Contract Type',
    width: '10%',
    section: 1,
    level: 'contract',
  },

  { key: 'brand', name: 'Brand', width: '10%', text: 'center', section: 1 },
  {
    key: 'monthly_retainer',
    name: 'Monthly Retainer',
    width: '10%',
    section: 2,
    type: 'number-currency',
    level: 'contract',
  },
  {
    key: 'length',
    name: 'Length',
    width: '10%',
    section: 2,
    type: 'number',
    level: 'contract',
  },
  {
    key: 'rev_share',
    name: 'Revenue Share',
    width: '10%',
    section: 2,
    type: 'number-percent',
    level: 'contract',
  },
  {
    key: 'seller_type',
    name: 'Seller Type',
    width: '10%',
    section: 2,
    level: 'contract',
  },
  {
    key: 'brand_growth_strategist',
    name: 'Brand Growth Strategist',
    width: '15%',
    section: 2,
    type: 'icon',
  },
];

export const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,

  responsive: [
    {
      breakpoint: 320,
      settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false },
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 1, slidesToScroll: 1, infinite: false },
    },
  ],
};

export const sortOptions = [
  { value: '-created_at', label: 'Recently Added' },
  { value: '-updated_at', label: 'Last Modified' },
];

export const companyFields = [
  { key: 'description', label: 'Description', section: 1, type: 'textarea' },
  { key: 'website', label: 'Website', section: 1 },
  {
    key: 'social',
    label: 'Social',
    section: 1,
    type: 'social',
    choices: [
      { key: 'facebook', value: FaceBookIcons },
      { key: 'twitter', value: TwitterIcons },
      { key: 'linkedin', value: LinkeDinIcons },
      { key: 'instagram', value: InstagramIcons },
      { key: 'pinterest', value: PinterestIcon },
    ],
  },
  { key: 'phone_number', label: 'Phone', section: 1 },
  { key: 'timezone', label: 'Time Zone', section: 1 },
  { key: 'category', label: 'Category', section: 2, type: 'choice' },
  {
    key: 'annual_revenue',
    label: 'Annual Revenue',
    section: 2,
    type: 'number-currency',
  },
  {
    key: 'number_of_employees',
    label: '# of Employees',
    section: 2,
    type: 'number',
  },
  { key: 'brand', label: 'Brands', section: 2 },
];

export const accountFields = [
  { key: 'contract_type', label: 'Agreement type', section: 1 },
  {
    key: 'one_time_deal_amount',
    label: 'One time deal amount',
    section: 1,
    type: 'number-currency',
  },
  { key: 'length', label: 'Agreement Length', section: 1, type: 'choice' },
  { key: 'channel', label: 'Channel', section: 1, type: 'choice' },
  {
    key: 'dsp_fee',
    label: 'DSP Monthly AD Budget',
    section: 1,
    type: 'number-currency',
  },
  { key: 'start_date', label: 'Agreement Start Date', section: 2 },
  {
    key: 'rev_share',
    label: 'Rev Share %',
    section: 2,
    type: 'choice',
  },
  {
    key: 'monthly_retainer',
    label: 'Monthly Retainer',
    section: 2,
    type: 'number-currency',
  },
  { key: 'seller_type', label: 'Seller type', section: 2, type: 'choice' },
  {
    key: 'additional_monthly_services',
    label: 'Additional Monthly services',
    type: 'multichoice',
    section: 2,
  },
  {
    key: 'additional_one_time_services',
    label: 'Additional One-time services',
    type: 'multichoice',
    section: 2,
  },
  {
    key: 'sales_threshold',
    label: 'Sales Threshold',
    section: 1,
    type: 'number-currency',
  },
];

export const awsDetails = [
  { key: 'merchant_id', label: 'Merchant ID', section: 1, type: 'text' },
  { key: 'marketplace_id', label: 'Marketplace ID', section: 1, type: 'text' },
  { key: 'secret_key', label: 'Secret ID', section: 1, type: 'password' },
  { key: 'aws', label: 'AWS access key ID', section: 1, type: 'password' },
  {
    key: 'account_management_email',
    label: 'Account Management Email',
    type: 'email',
    section: 2,
  },
  {
    key: 'data_bots',
    label: 'Data Bots Email',
    type: 'email',
    section: 2,
  },
  {
    key: 'Vendor',
    label: 'Vendor Central Username and Password',
    section: 2,
  },
  {
    key: 'Seller',
    label: 'Seller Central Username and Password',
    type: 'email',
    section: 2,
  },
];

export const editCompanyFields = [
  {
    key: 'contract_company_name',
    label: 'Company name',
    property: 'col-md-9',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    property: 'col-md-12',
  },
  { key: 'website', label: 'Website', property: 'col-md-6' },
  { key: 'phone_number', label: 'Phone', property: 'col-md-6', type: 'text' },

  {
    key: 'country',
    label: 'Country',
    property: 'col-md-6',
    type: 'choice',
  },
  { key: 'timezone', label: 'Time Zone', property: 'col-md-6 ' },
  {
    key: 'address',
    label: 'Address',
    property: 'col-md-12',
  },
  {
    key: 'city',
    label: 'City',
    property: 'col-md-6 ',
  },
  {
    key: 'state',
    label: 'State',
    property: 'col-md-6',
  },
  {
    key: 'zip_code',
    label: 'Post code',
    property: 'col-md-12',
    type: 'number',
  },
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
  {
    key: 'category',
    label: 'Category',
    property: 'col-md-6',
    type: 'choice',
  },
  {
    key: 'number_of_employees',
    label: '# of Employees',

    type: 'number',
    property: 'col-md-6 ',
  },
  {
    key: 'annual_revenue',
    label: 'Annual Revenue',
    type: 'number-currency',
    property: 'col-md-6',
  },

  { key: 'brand', label: 'Brands', property: 'col-md-6' },
];

export const editAccountFields = [
  {
    key: 'contract_type',
    label: 'Agreement Type',
    property: 'col-12 ',
    type: 'choice',
  },
  {
    key: 'start_date',
    label: 'Agreement Start Date',
    type: 'date',
    property: 'col-md-12',
  },
  {
    key: 'one_time_deal_amount',
    label: 'One time deal amount',
    type: 'number-currency',
    property: 'col-md-6',
  },
  {
    key: 'rev_share',
    label: 'Rev Share %',
    type: 'choice',
    property: 'col-md-6',
  },
  {
    key: 'length',
    label: 'Agreement Length',
    property: 'col-md-6',
    type: 'choice',
  },
  {
    key: 'monthly_retainer',
    label: 'Monthly Retainer',
    type: 'number-currency',
    property: 'col-md-6',
  },

  { key: 'channel', label: 'Channel', type: 'choice', property: 'col-md-6' },

  {
    key: 'dsp_fee',
    label: 'DSP Monthly AD Budget',
    type: 'number-currency',
    property: 'col-md-6',
  },

  {
    key: 'sales_threshold',
    label: 'Sales Threshold',
    property: 'col-md-6',
    type: 'number-currency',
  },
  {
    key: 'seller_type',
    label: 'Seller type',
    type: 'choice',
    property: 'col-md-6',
  },
  {
    key: 'additional_one_time_services',
    label: 'Additional One-time services',
    type: 'multichoice',
    property: 'col-md-12',
  },
  {
    key: 'additional_monthly_services',
    label: 'Additional Monthly services',
    type: 'multichoice',
    property: 'col-md-12',
  },
];

export const contactDetails = [
  {
    key: 'first_name',
    label: 'First name',
    type: 'text',
    property: 'col-md-3',
  },
  {
    key: 'last_name',
    label: 'Last name',
    type: 'text',
    property: 'col-md-3',
  },
  {
    key: 'role',
    label: 'Role',
    type: 'choice',
    property: 'col-md-6',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    property: 'col-md-6',
  },
  {
    key: 'phone_number',
    label: 'Phone number',
    type: 'text',
    property: 'col-md-6',
  },
];

export const AgreementDetails = [
  {
    key: 'contract_company_name',
    label: 'Customer Name',
    type: 'text',
  },
  {
    key: 'start_date',
    label: 'Contract Start Date',
    type: 'date',
  },
  {
    key: 'length',
    label: 'Contract Length',
    type: 'choice',
  },
  {
    key: 'address',
    label: 'Address',
    type: 'text',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
  },
  {
    key: 'state',
    label: 'State',
    type: 'text',
  },
  {
    key: 'zip_code',
    label: '  Postcode',
    type: 'number',
  },
];

export const StatementDetails = [
  {
    key: 'monthly_retainer',
    label: 'Monthly Retainer',
    type: 'number-currency',
  },
  {
    key: 'primary_marketplace',
    label: 'Market Places',
    type: 'choice',
  },
  {
    key: 'additional_marketplaces',
    label: 'Additional Market Places',
    type: 'multichoice',
  },
  {
    key: 'rev_share',
    label: 'Revenue Share',
    type: 'choice',
  },
  {
    key: 'sales_threshold',
    label: 'Sales Threshold (Optional)',
    type: 'number-currency',
  },
  {
    key: 'dsp_fee',
    label: 'DSP Budget',
    type: 'number-currency',
  },
  {
    key: 'additional_monthly_services',
    label: 'Additional Monthly services',
    type: 'multichoice',
  },
  // {
  //   key: 'additional_one_time_services',
  //   label: 'Additional One-time services',
  //   type: 'add',
  // },
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
    icon: BuildingIcon,
  },
  {
    key: 'Creative',
    icon: PencilPaint,
  },
  {
    key: 'Customer Service',
    icon: HeadSet,
  },
  {
    key: 'Human Resource',
    icon: HelpingHand,
  },
  {
    key: 'Logistics',
    icon: WareHouse,
  },
  {
    key: 'Marketing',
    icon: BullHorn,
  },
  {
    key: 'Sales',
    icon: PiggyBank,
  },
  {
    key: 'Seller Support - Seller Performance',
    icon: GraphIcon,
  },
  {
    key: 'Vendor Collection',
    icon: BoxesIcon,
  },
];

export const SocialIcons = [
  { key: 'facebook', value: FaceBookIcons, label: 'Facebook' },
  { key: 'twitter', value: TwitterIcons, label: 'Twitter' },
  { key: 'linkedin', value: LinkeDinIcons, label: 'LinkedIn' },
  { key: 'instagram', value: InstagramIcons, label: 'Instagram' },
  { key: 'pinterest', value: PinterestIcon, label: 'Pinterest' },
];

export const Billing = [
  { key: 'account_name', label: 'Account Name', type: 'text' },
  { key: 'bank_name', label: 'Bank Name', type: 'text' },
  { key: 'account_number', label: 'Account Number', type: 'number' },
  { key: 'routing_number', label: 'Routing Number', type: 'number' },
  { key: 'ach', label: 'ACH', type: 'radio' },
  {
    key: 'credit_card',
    choices: [
      {
        key: 'visa',
        label: 'Visa',
        icon: VisaCardIcons,
      },
      {
        key: 'mastercard',
        label: 'Mastercard',
        icon: MasterCardIcons,
      },
      {
        key: 'discover',
        label: 'Discover',
        icon: DiscoverCardIcons,
      },
      {
        key: 'american_express',
        label: 'American Express',
        icon: AmercianExpressCardIcons,
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

export const AmazonMarketplaceDetails = [
  { key: 'merchant_id', label: 'Merchant ID', section: 1 },
  { key: 'marketplace_id', label: 'Marketplace ID', section: 1 },
  {
    key: 'account_management_email',
    label: 'Account Management Credentials',
    section: 2,
  },
  { key: 'data_bots_email', label: 'Data Bots Credentials', section: 2 },
];
