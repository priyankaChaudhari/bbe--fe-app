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

export const newAgreementTypes = [
  {
    value: 'standard_cancellation',
    label: 'Recurring Service Agreement',
    sub: 'Standard Cancellation',
  },
  {
    value: '90_day_cancellation',
    label: 'Recurring Service Agreement',
    sub: '90 Day Cancellation',
  },
  { value: 'dsp_only', label: 'DSP-Only Agreement', sub: '' },
];

export const additionaMarketplaceAmount = 1500;
