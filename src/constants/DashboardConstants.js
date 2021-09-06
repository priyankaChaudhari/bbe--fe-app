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
  { value: 'created_at', label: 'Newest' },
  { value: 'monthly_budget', label: 'Amount' },
  { value: 'generated_at', label: 'Creation Date' },
  { value: 'due_date', label: 'Due Date' },
];

export const PartnersSortByOptions = [
  { value: 'total_outstanding', label: 'Total Outstanding' },
  { value: 'total_overdue', label: 'Total Overdue' },
  { value: 'average_days_past_due', label: 'Average Days Past Due' },
  { value: 'paid_by_due_date', label: 'Paid By Due Date' },
];

export const FinanceDateTypeOptions = [
  { value: 'allTime', label: 'All-Time' },
  { value: 'custom', label: 'Custom Range' },
];

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

export const InvoiceStatusColorSet = {
  open: '#FDF3D7',
  draft: '#FDF377',
  overdue: '#F7D7DB',
  paid: '#E3F2D2',
};