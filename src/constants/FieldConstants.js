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
  VisaCardIcons,
  MasterCardIcons,
  DiscoverCardIcons,
  AmercianExpressCardIcons,
  SquareFbIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
} from '../theme/images/index';

export const userDetails = [
  {
    key: 'first_name',
    label: 'First name',
    placeholder: 'Enter First name',
    type: 'text',
    section: 1,
    pattern: {
      value: /^[0-9a-zA-Z ]*$/i,
      message: 'Special characters are not allowed.',
    },
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
    pattern: {
      value: /^[0-9a-zA-Z ]*$/i,
      message: 'Special characters are not allowed.',
    },
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
  { value: 'expiring_soon', label: 'Expiry Date' },
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
    key: 'description',
    label: 'Description',
    type: 'textarea',
    property: 'col-md-12',
  },
  { key: 'brand', label: 'Brands', property: 'col-md-6' },
  { key: 'merchant_id', label: 'Merchant ID', property: 'col-md-6' },
  { key: 'phone_number', label: 'Phone', property: 'col-md-12', type: 'text' },
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
    key: 'contract_company_name',
    label: 'Company Name',
    property: 'col-9',
    type: 'text',
    level: 'agreement',
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
    level: 'agreement',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
    property: 'col-md-6',
    level: 'agreement',
  },
  {
    key: 'state',
    label: 'State',
    type: 'text',
    property: 'col-md-6',
    level: 'agreement',
  },

  {
    key: 'zip_code',
    label: 'Postal Code',
    property: 'col-md-6',
    type: 'number',
    level: 'agreement',
  },
  {
    key: 'number_of_employees',
    label: 'Company Size',
    property: 'col-md-6',
    type: 'number',
  },

  {
    key: 'annual_revenue',
    label: 'Annual Revenue',
    type: 'number-currency',
    property: 'col-md-6',
  },
  {
    key: 'category',
    label: 'Category',
    type: 'choice',
    property: 'col-md-6',
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
    placeholder: 'Enter Customer Name',
    isMandatory: true,
    part: 'agreement',
    error: false,
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
      },
      {
        key: 'state',
        type: 'text',
        placeholder: 'Enter State',
        isMandatory: true,
        part: 'agreement',
        error: false,
      },
      {
        key: 'city',
        type: 'text',
        placeholder: 'Enter City',
        isMandatory: true,
        part: 'agreement',
        error: false,
      },
      {
        key: 'zip_code',
        type: 'number',
        placeholder: 'Enter Postcode',
        isMandatory: true,
        part: 'agreement',
        error: false,
      },
    ],
  },
];

export const ListingOptimization = [
  {
    key: 'content_optimization',
    label: 'Content',
  },
  {
    key: 'design_optimization',
    label: 'Design',
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
  // {
  //   key: 'additional_marketplaces',
  //   label: 'Additional Market Places',
  //   type: 'multichoice',
  // },
  {
    key: 'rev_share',
    label: 'Revenue Share',
    type: 'choice',
    placeholder: 'Select Revenue Share',
    isMandatory: true,
    part: 'statement',
  },
  {
    key: 'sales_threshold',
    label: 'REVENUE THRESHOLD',
    type: 'number-currency',
    placeholder: 'Enter Revenue Threshold (Optional)',
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

export const Billing = [
  { key: 'account_name', label: 'Account Name', type: 'text' },
  { key: 'bank_name', label: 'Bank Name', type: 'text' },
  { key: 'account_number', label: 'Account Number', type: 'number' },
  { key: 'routing_number', label: 'Routing Number', type: 'number' },
  { key: 'ach', label: 'payment type', type: 'checkbox' },
  {
    key: 'credit_card',
    choices: [
      {
        key: 'visa',
        label: 'Visa',
        icon: VisaCardIcons,
        type: 'radio',
      },
      {
        key: 'mastercard',
        label: 'Mastercard',
        icon: MasterCardIcons,
        type: 'radio',
      },
      {
        key: 'discover',
        label: 'Discover',
        icon: DiscoverCardIcons,
        type: 'radio',
      },
      {
        key: 'american_express',
        label: 'American Express',
        icon: AmercianExpressCardIcons,
        type: 'radio',
      },
    ],
    details: [
      {
        key: 'card_name',
        label: 'Cardholder Name',
        type: 'text',
        property: '',
      },
      {
        key: 'card_number',
        label: 'Credit Card Number',
        type: 'number',
        property: '',
        format: '#### #### #### ####',
      },
      {
        key: 'exp_date',
        label: 'EXP. Date',
        type: 'number',
        property: 'col-8 pr-0',
        format: '##/##',
      },
      {
        key: 'cvv',
        label: 'CVV',
        type: 'number',
        property: 'col-4',
        format: '###',
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

export const BillingAddress = [
  {
    key: 'address',
    label: 'Address',
    type: 'text',
    property: '',
    section: 'address',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
    property: '',
    section: 'address',
  },
  {
    key: 'state',
    label: 'State',
    type: 'text',
    property: 'col-6',
    section: 'address',
  },
  {
    key: 'postal_code',
    label: 'Postal Code',
    type: 'number',
    property: 'col-6',
    format: '#####',
    section: 'address',
  },
  {
    key: 'first_name',
    label: 'First name',
    type: 'text',
    property: '',
    section: 'contact',
  },
  {
    key: 'last_name',
    label: 'Last name',
    type: 'text',
    property: '',
    section: 'contact',
  },

  {
    key: 'email',
    label: 'Email',
    type: 'email',
    property: 'col-6',
    section: 'contact',
  },
  {
    key: 'phone_number',
    label: 'Phone number',
    type: 'number',
    property: 'col-6',
    section: 'contact',
  },
];
