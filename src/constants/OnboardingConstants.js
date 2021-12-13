import {
  PATH_AMAZON_MERCHANT,
  PATH_BILLING_DETAILS,
  PATH_COMPANY_DETAILS,
  PATH_SUMMARY,
} from './RouteConstants';

export const achDetails = [
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

export const billingAddress = [
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
export const paymentTermValueLabel = [
  {
    value: 'auto pay',
    label: 'Autopay',
  },
  {
    value: 'due on receipt',
    label: 'Due on Receipt',
  },
  {
    value: 'net 7',
    label: 'NET 7',
  },
  {
    value: 'net 14',
    label: 'NET 14',
  },
  {
    value: 'net 30',
    label: 'NET 30',
  },
];
export const paymentType = [
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

export const amazonSellerAccountDetails = [
  {
    key: 'seller_central_name',
    label: 'Seller Central Account Name',
    section: 1,
  },
  { key: 'merchant_id', label: 'Merchant ID', section: 1 },
  { key: 'advertiser_name', label: 'Advertiser Name', section: 2 },
  { key: 'advertiser_id', label: 'Advertiser Entity ID', section: 2 },
];

export const amazonVendorAccountDetails = [
  {
    key: 'vendor_central_name',
    label: 'Vendor Central Account Name',
    section: 1,
  },
  { key: 'vendor_code', label: 'Vendor Code', section: 1 },
  { key: 'advertiser_name', label: 'Advertiser Name', section: 2 },
  { key: 'advertiser_id', label: 'Advertiser Entity ID', section: 2 },
];

export const authorizeLink =
  'https://www.authorize.net/en-us/about-us/dpa.html';

export const customVideoStyle = {
  width: '16px',
  marginRight: '6px',
  verticalAlign: 'text-bottom',
  cursor: 'pointer',
};

export const billingTerms =
  'I hereby acknowledge that I am an authorized signer on the account listed above and hereby authorize payments to be made to BBE using this payment method to satisfy any and all invoices or bills on our account with BBE moving forward until or unless further notice is provided in writing. I further agree to the additional Terms & Conditions for these payment and agree to the terms and conditions found ';

export const delegatedInfo =
  ' If you’re unable to provide this information or you think this was sent to you unintentionally, please let them know via the email address highlighted above.';
