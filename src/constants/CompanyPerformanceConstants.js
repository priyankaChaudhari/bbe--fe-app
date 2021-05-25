export const dateOptions = [
  { value: 'week', label: 'Recent Week', sub: 'vs Previous week' },
  { value: 'month', label: 'Recent Month', sub: 'vs Previous month' },
  { value: '30days', label: 'Recent 30 Days', sub: 'vs Previous 30 days' },
  { value: 'year', label: 'Year to Date', sub: 'vs Previous year' },
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
