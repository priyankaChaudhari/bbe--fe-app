export const dateOptions = [
  { value: 'week', label: 'Recent 7 days', sub: 'vs Previous 7 days' },
  { value: 'month', label: 'Recent Month', sub: 'vs Previous month' },
  { value: '30days', label: 'Recent 30 Days', sub: 'vs Previous 30 days' },
  {
    value: 'custom',
    label: 'Custom Range',
    sub: 'Select start and end dates',
  },
];

export const dateOptionsWithYear = [
  { value: 'week', label: 'Recent 7 days', sub: 'vs Previous 7 days' },
  { value: 'month', label: 'Recent Month', sub: 'vs Previous month' },
  { value: '30days', label: 'Recent 30 Days', sub: 'vs Previous 30 days' },
  { value: 'year', label: 'Year to Date', sub: 'vs Previous year' },
  {
    value: 'custom',
    label: 'Custom Range',
    sub: 'Select start and end dates',
  },
];

export const vendorSalesMetricsTypeOptions = [
  { value: 'orderedRevenue', label: 'Ordered Revenue' },
  { value: 'shippedCOGS', label: 'Shipped COGS' },
];

export const VendorMetricsNames = {
  orderedRevenue: 'Ordered Revenue',
  shippedCOGs: 'Shipped COGs',
  glanceViews: 'Glance Views',
  conversionRate: 'Conversion Rate',
  orderedUnits: 'Ordered Units',
  shippedUnits: 'Shipped Units',
};

export const VendorMetricsColorSet = {
  orderedRevenue: '#0045B4',
  shippedCOGs: '#0045B4',
  glanceViews: '#8C54FF',
  conversionRate: '#30A8BD',
  orderedUnits: '#D6A307',
  shippedUnits: '#D6A307',
};

export const bbDateOptions = [
  { value: 'week', label: 'Recent 7 days' },
  { value: 'month', label: 'Recent Month' },
  { value: '30days', label: 'Recent 30 Days' },
  {
    value: 'custom',
    label: 'Custom Range',
    sub: 'Select start and end dates',
  },
];

export const AdTypesOptions = [
  { value: 'all', label: 'All Ad Types' },
  { value: 'product_campaign_report', label: 'Sponsored Product' },
  { value: 'brand_campaign_report', label: 'Sponsored Brand' },
  { value: 'brand_video_campaign_report', label: 'Sponsored Brands Video' },
  { value: 'sponsored_display_campaign_report', label: 'Sponsored Display' },
];

export const SponsoredAdTypeOptions = [
  { value: 'all', label: 'All Campaigns' },
  { value: 'product_campaign_report', label: 'Product Campaigns' },
  { value: 'brand_campaign_report', label: 'Brand Campaigns' },
  { value: 'brand_video_campaign_report', label: 'Display Campaigns' },
  {
    value: 'sponsored_display_campaign_report',
    label: 'Brand Video Campaigns',
  },
];

export const noGraphDataMessage =
  'We are not pulling data for this dashboard. If we should, please file a help desk ticket and \n we will resolve this issue as soon as possible.';

export const keyContributionConstant = {
  noManagerSelected: [
    {
      id: 'positive',
      label: 'Positive',
    },
    {
      id: 'negative',
      label: 'Negative',
    },
  ],

  managerSelected: [
    {
      id: 'contribution',
      label: 'Contribution',
    },
    {
      id: 'keyMetrics',
      label: 'Key Metrics',
    },
  ],
};

export const keyContributionHeaders = {
  positive: 'Key Contributors',
  negative: 'Key Contributors',
  contribution: 'Contribution',
  keyMetrics: 'Key Metrics',
};

export const metricsCurrency = {
  adSales: { type: 'currency' },
  adSpend: { type: 'currency' },
  adConversion: { type: 'percentage' },
  impressions: { type: 'nocurrency' },
  adCos: { type: 'percentage' },
  adRoas: { type: 'currency' },
  adClicks: { type: 'nocurrency' },
  adClickRate: { type: 'percentage' },
  dspImpressions: { type: 'nocurrency' },
  dspSpend: { type: 'currency' },
  dspTotalProductSales: { type: 'currency' },
  dspTotalRoas: { type: 'currency' },
  dspTotalDpvr: { type: 'percentage' },
  dspTtlNewBrandPurchases: { type: 'percentage' },
  dspProductSales: { type: 'currency' },
  dspRoas: { type: 'currency' },
  costPerClick: { type: 'currency' },
  revenue: { type: 'currency' },
  traffic: { type: 'nocurrency' },
  conversion: { type: 'percentage' },
  unitsSold: { type: 'nocurrency' },
};

export const toogleMetricsData = [
  {
    id: 1,
    name: 'acos',
    label: 'ACOS',
  },
  {
    id: 2,
    name: 'roas',
    label: 'ROAS',
  },
];
