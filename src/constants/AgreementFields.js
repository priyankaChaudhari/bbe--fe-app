export const AgreementDetails = [
  {
    key: 'contract_type',
    label: 'Contract Type',
    type: 'text',
    placeholder: 'Enter Contract Type',
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
    key: 'contract_address',
    label: 'Customer Address',
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
    type: 'text',
  },
  {
    key: 'fee_type',
    label: 'Fee Type',
    type: 'text',
  },
  {
    key: 'threshold_type',
    label: 'Threshold Type',
    type: 'text',
  },
  {
    key: 'vendor_billing_report',
    label: 'Vendor Billing Report',
    type: 'text',
  },
  {
    key: 'discount_type',
    label: 'Discount Type',
    type: 'text',
  },
  {
    key: 'discount_amount',
    label: 'Discount Amount',
    type: 'number-currency',
  },
  {
    key: 'sales_threshold',
    label: 'Sales Threshold',
    type: 'number-currency',
  },
  {
    key: 'monthly_rev_share',
    label: 'monthly Rev Share',
    type: 'object',
  },
  {
    key: 'quarterly_rev_share',
    label: 'Quarterly Rev Share',
    type: 'object',
  },
  {
    key: 'billing_minimum',
    label: 'BILLING MINIMUM ',
    type: 'number-currency',
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
    value: 'recurring',
    label: 'Recurring Service Agreement',
    sub: 'Standard Cancellation',
  },
  {
    value: 'recurring (90 day notice)',
    label: 'Recurring Service Agreement',
    sub: '90 Day Cancellation',
  },
  { value: 'dsp only', label: 'DSP-Only Agreement', sub: null },
];

export const additionaMarketplaceAmount = 1500;

export const accountTypeOptions = [
  { value: 'Seller', label: 'Seller' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Hybrid', label: 'Hybrid' },
];

export const feeTypeOptions = [
  {
    value: 'Retainer Only',
    label: 'Retainer Only',
    key: 'monthly_retainer',
    type: 'number-currency',
  },
  {
    value: 'Revenue Share Only',
    label: 'Revenue Share Only',
    key: 'rev_share',
    type: 'choice',
  },
  {
    value: 'Retainer + % Rev Share',
    label: 'Retainer + % Rev Share',
    key: 'retinaer_rev_share',
    type: 'choice',
  },
];

// Fee structure

export const feeStructureContainerDetails = [
  {
    key: 'primary_marketplace',
    label: 'Primary MarketPlace',
    type: 'choice',
    placeholder: 'Select Primary Marketplace',
    isMandatory: true,
    part: 'fee structure',
  },
  {
    key: 'seller_type',
    label: 'Account Type',
    type: 'choice',
    placeholder: 'Select Account Type',
    isMandatory: true,
    part: 'fee structure',
  },
];

export const revShareDetails = [
  {
    key: 'rev_share',
    label: 'Revenue Share',
    type: 'choice',
    placeholder: 'Select Revenue Share',
    isMandatory: true,
    suffix: '%',
  },
  {
    key: 'billing_minimum',
    label: 'BILLING MINIMUM (OPTIONAL)',
    type: 'number-currency',
    placeholder: 'Enter Billing Minimum',
    isMandatory: false,
    subtitle:
      'We will charge the greater of the value entered here or the % of revenue',
    prefix: '$',
  },
  {
    key: 'billing_cap',
    label: 'BILLING CAP (OPTIONAL)',
    type: 'number-currency',
    placeholder: 'Enter Billing Cap',
    isMandatory: false,
    subtitle: ' We will charge no more than the amount entered here.',
    prefix: '$',
  },
];

export const revShareAndRetainerDetails = [
  {
    value: 'monthly_retainer',
    label: 'Monthly Retainer',
    key: 'monthly_retainer',
    type: 'number-currency',
    isMandatory: true,
    prefix: '$',
  },
  {
    key: 'rev_share',
    label: 'Revenue Share',
    type: 'choice',
    placeholder: 'Select Revenue Share',
    isMandatory: true,
    suffix: '%',
  },
  {
    key: 'rev_share_threshold',
    label: 'Revenue Share Threshold',
    type: 'threshold',
    isMandatory: false,
    prefix: '$',
  },
  {
    key: 'billing_cap',
    label: 'BILLING CAP (OPTIONAL)',
    type: 'number-currency',
    placeholder: 'Enter Billing Cap',
    isMandatory: false,
    subtitle: ' We will charge no more than the amount entered here.',
    prefix: '$',
  },
];

export const revShareAndRetainerQuarterDetails = [
  {
    value: 'monthly_retainer',
    label: 'Monthly Retainer',
    key: 'monthly_retainer',
    type: 'number-currency',
    isMandatory: true,
    prefix: '$',
  },
  {
    key: 'rev_share',
    label: 'Revenue Share',
    type: 'choice',
    placeholder: 'Select Revenue Share',
    isMandatory: true,
    suffix: '%',
  },
  {
    key: 'rev_share_threshold',
    label: 'Revenue Share Threshold',
    type: 'threshold',
    isMandatory: false,
    prefix: '$',
  },
  {
    key: 'quarter',
    type: 'threshold',
    prefix: '$',
  },
  {
    key: 'billing_cap',
    label: 'BILLING CAP (OPTIONAL)',
    type: 'number-currency',
    placeholder: 'Enter Billing Cap',
    isMandatory: false,
    subtitle: ' We will charge no more than the amount entered here.',
    prefix: '$',
  },
];
export const revShareAndRetainerMonthDetails = [
  {
    value: 'monthly_retainer',
    label: 'Monthly Retainer',
    key: 'monthly_retainer',
    type: 'number-currency',
    isMandatory: true,
    prefix: '$',
  },
  {
    key: 'rev_share',
    label: 'Revenue Share',
    type: 'choice',
    placeholder: 'Select Revenue Share',
    isMandatory: true,
    suffix: '%',
  },
  {
    key: 'rev_share_threshold',
    label: 'Revenue Share Threshold',
    type: 'threshold',
    isMandatory: false,
    prefix: '$',
  },
  {
    key: 'month',
    type: 'threshold',
    prefix: '$',
  },
  {
    key: 'billing_cap',
    label: 'BILLING CAP (OPTIONAL)',
    type: 'number-currency',
    placeholder: 'Enter Billing Cap',
    isMandatory: false,
    subtitle: ' We will charge no more than the amount entered here.',
    prefix: '$',
  },
];

export const quarterlyThresholdOptions = [
  {
    key: '1st quarterly',
    label: '1st Quarter',
    type: 'number-currency',
    placeholder: 'Enter 1st Quarter',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'Q1 Threshold',
  },
  {
    key: '2nd quarterly',
    label: '2nd Quarter',
    type: 'number-currency',
    placeholder: 'Enter 2nd Quarter',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'Q2 Threshold',
  },
  {
    key: '3rd quarterly',
    label: '3rd Quarter',
    type: 'number-currency',
    placeholder: 'Enter 3rd Quarter',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'Q3 Threshold',
  },
  {
    key: '4th quarterly',
    label: '4th Quarter',
    type: 'number-currency',
    placeholder: 'Enter 4th Quarter',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'Q4 Threshold',
  },
];

export const monthlyThresholdOptions = [
  {
    key: 'january month',
    label: 'January',
    type: 'number-currency',
    placeholder: 'Enter January',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'January Threshold',
  },
  {
    key: 'february month',
    label: 'February',
    type: 'number-currency',
    placeholder: 'Enter February',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'February Threshold',
  },
  {
    key: 'march month',
    label: 'March',
    type: 'number-currency',
    placeholder: 'Enter March',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'March Threshold',
  },
  {
    key: 'april month',
    label: 'April',
    type: 'number-currency',
    placeholder: 'Enter April',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'April Threshold',
  },
  {
    key: 'may month',
    label: 'May',
    type: 'number-currency',
    placeholder: 'Enter May',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'May Threshold',
  },
  {
    key: 'june month',
    label: 'June',
    type: 'number-currency',
    placeholder: 'Enter June',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'June Threshold',
  },
  {
    key: 'july month',
    label: 'July',
    type: 'number-currency',
    placeholder: 'Enter July',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'July Threshold',
  },
  {
    key: 'august month',
    label: 'August',
    type: 'number-currency',
    placeholder: 'Enter August',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'August Threshold',
  },
  {
    key: 'september month',
    label: 'September',
    type: 'number-currency',
    placeholder: 'Enter September',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'September Threshold',
  },
  {
    key: 'october month',
    label: 'October',
    type: 'number-currency',
    placeholder: 'Enter October',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'October Threshold',
  },
  {
    key: 'november month',
    label: 'November',
    type: 'number-currency',
    placeholder: 'Enter November',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'November Threshold',
  },
  {
    key: 'december month',
    label: 'December',
    type: 'number-currency',
    placeholder: 'Enter December',
    isMandatory: false,
    prefix: '$',
    fieldOf: 'threshold',
    detail: 'December Threshold',
  },
];

export const vendorReportOptions = [
  { value: 'Shipped COGS', label: 'Shipped COGS' },
  { value: 'Ordered Revenue', label: 'Ordered Revenue' },
];
