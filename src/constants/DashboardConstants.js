export const financeNavigationOptions = [
  { key: 'retainer', value: 'Monthly Retainer' },
  { key: 'rev share', value: 'Rev Share' },
  { key: 'upsell', value: 'Upsell' },
  { key: 'dsp service', value: 'DSP' },
  { key: 'dspBilling', value: 'DSP Billing' },
];

export const dspColorSet = {
  dspImpressions: '#0045B4',
  dspSpend: '#8C54FF',
  dspTotalProductSales: '#30A8BD',
  dspTotalRoas: '#D6A307',
  dspTotalDpvr: '#E05D37',
  dspTtlNewBrandPurchases: '#89A43C',
  dspProductSales: '#C84EC6',
  dspRoas: '#A04848',
};

export const dspTabOptions = {
  dspSpend: 'DSP Spend',
  dspImpressions: 'Impressions',
  dspProductSales: 'Product Sales',
  dspRoas: 'ROAS',
  dspTotalDpvr: 'Total DPVR',
  dspTtlNewBrandPurchases: 'TTL New Brand Purchases',
  dspTotalProductSales: 'Total Product Sales',
  dspTotalRoas: 'Total ROAS',
};

export const contributionColorSet = {
  High: '#E3F2D2',
  Medium: '#FDF3D7',
  Low: '#F4F6FC',
};

export const InvoicesStatusOptions = [
  { value: 'any', label: 'Any' },
  { value: 'open', label: 'Open' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'paid', label: 'Paid' },
];

export const PartnersStatusOptions = [
  { value: 'any', label: 'Any' },
  { value: 'open', label: 'Open' },
  { value: 'overdue', label: 'Overdue' },
];

export const InvoicesSortByOptions = [
  { value: '', label: 'Status' },
  { value: 'monthly_budget', label: 'Amount' },
  { value: 'generated_at', label: 'Creation Date' },
  { value: 'due_date', label: 'Due Date' },
];

export const PartnersSortByOptions = [
  { value: 'total_outstanding', label: 'Total Outstanding' },
  { value: 'total_overdue', label: 'Total Overdue' },
  { value: 'avg_days_past_due', label: 'Average Days Past Due' },
  { value: 'paid_by_due_date', label: 'Paid By Due Date' },
];

export const FinanceDateTypeOptions = [
  { value: 'allTime', label: 'All-Time' },
  { value: 'custom', label: 'Custom Range' },
];

export const metricsNameForAPI = {
  adSales: 'ad_sales',
  adSpend: 'ad_spend',
  adConversion: 'ad_conversion_rate',
  impressions: 'impressions',
  adCos: 'acos',
  adRoas: 'roas',
  adClicks: 'clicks',
  adClickRate: 'ctr',
  dspImpressions: 'impressions',
  dspSpend: 'dsp_spend',
  dspTotalProductSales: 'total_product_sales',
  dspTotalRoas: 'total_roas',
  dspTotalDpvr: 'total_dpvr',
  dspTtlNewBrandPurchases: 'ttl_new_brand_purchases',
  dspProductSales: 'product_sales',
  dspRoas: 'roas',
  costPerClick: 'cost_per_click',
  revenue: 'revenue',
  traffic: 'traffic',
  unitsSold: 'units_sold',
  conversion: 'conversion',
};

export const DSPFinanceMetrics = [
  {
    value: 'openInvoices',
    key: 'open_invoices',
    label: 'OPEN INVOICES',
    titleColor: '#333333',
    prefix: '',
    postfix: '',
  },
  {
    value: 'totalOverdue',
    key: 'total_overdue',
    label: 'TOTAL OVERDUE',
    titleColor: '#D60000',
    prefix: '$',
    postfix: '',
  },
  {
    value: 'expectedByEOM',
    key: 'expected_by_end_of_month',
    label: 'EXPECTED BY END OF MONTH(S)',
    titleColor: '#333333',
    prefix: '$',
    postfix: '',
  },
  {
    value: '%pastDue',
    key: 'percentage_past_due',
    label: '% PAST DUE',
    titleColor: '#333333',
    prefix: '',
    postfix: '%',
  },
  {
    value: 'avgDaysPastDue',
    key: 'avg_days_past_due',
    label: 'AVG. DAYS PAST DUE',
    titleColor: '#333333',
    prefix: '',
    postfix: ' days',
  },
];

export const BGSComissionMetrics = [
  {
    value: 'openInvoices',
    key: 'total_book_size',
    label: 'TOTAL BOOK SIZE',
    titleColor: '#333333',
    prefix: '$',
    postfix: '',
  },
  {
    value: 'totalOverdue',
    key: 'total_book_size_commission',
    label: 'TOTAL BOOK SIZE COMMISSION',
    titleColor: '#333333',
    prefix: '$',
    postfix: '',
  },
  {
    value: 'expectedByEOM',
    key: 'total_upsells',
    label: 'TOTAL UPSELLS',
    titleColor: '#333333',
    prefix: '$',
    postfix: '',
  },
  {
    value: '%pastDue',
    key: 'total_upselles_commission',
    label: 'TOTAL UPSELL COMMISSION',
    titleColor: '#333333',
    prefix: '$',
    postfix: '',
  },
];

export const DSPBillingMetrics = [
  {
    value: 'amazonAdvertisingLLC',
    key: 'Amazon Advertising LLC',
    label: 'Amazon Advertising LLC',
    titleColor: '#333333',
    prefix: '$',
    postfix: '',
  },
  {
    value: 'amazonOnlineUKLimited',
    key: 'Amazon Online UK Limited',
    label: 'Amazon Online UK Limited',
    titleColor: '#333333',
    prefix: '£',
    postfix: '',
  },
  {
    value: 'amazonOnlineUKLimitedEur',
    key: 'Amazon Online UK Limited (EUR)',
    label: 'Amazon Online UK Limited (EUR)',
    titleColor: '#D60000',
    prefix: '€',
    postfix: '',
  },
  {
    value: 'amazonCommercialServicesPtyLtd',
    key: 'Amazon Commercial Services Pty Ltd.',
    label: 'Amazon Commercial Services Pty Ltd',
    titleColor: '#333333',
    prefix: 'A$',
    postfix: '',
  },
];

export const StatusColorSet = {
  open: '#FDF3D7',
  draft: '#FDF377',
  overdue: '#F7D7DB',
  paid: '#E3F2D2',
  created: '#FDF3D7',
  pending: '#fdf3d7',
  approved: '#E3F2D2',
  rejected: '#F7D7DB',
};

export const BillingVendorOptions = [
  { value: 'Amazon Advertising LLC', label: 'Amazon Advertising LLC' },
  { value: 'Amazon Online UK Limited', label: 'Amazon Online UK Limited' },
  {
    value: 'Amazon Online UK Limited (EUR)',
    label: 'Amazon Online UK Limited (EUR)',
  },
  {
    value: 'Amazon Commercial Services Pty Ltd.',
    label: 'Amazon Commercial Services Pty Ltd.',
  },
];

export const BillingSortByOptions = [
  { value: '', label: 'Status' },
  { value: 'amount', label: 'Amount' },
  { value: 'bill_date', label: 'Bill Date' },
  { value: 'due_date', label: 'Due Date' },
];

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
