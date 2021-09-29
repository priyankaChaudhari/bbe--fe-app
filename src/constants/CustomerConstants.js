import {
  LinkeDinIcons,
  FaceBookIcons,
  TwitterIcons,
  InstagramIcons,
  PinterestIcon,
  SquareFbIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  ViewExternalLink,
  CopyIcon,
  PauseIcon,
  CloseCircleIcon,
  DeleteIcon,
} from '../theme/images';

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

export const sortByOrderOptions = [
  { value: true, label: 'Highest to Lowest' },
  { value: false, label: 'Lowest to Highest' },
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

export const options = [
  { value: 'contract_details', label: 'Accounts' },
  { value: 'performance', label: 'Sales Performance' },
  { value: 'sponsored_ad_performance', label: 'Sponsored Ad Performance' },
  { value: 'dsp_ad_performance', label: 'DSP Ad Performance' },
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
