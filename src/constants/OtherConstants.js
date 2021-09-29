import {
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
} from '../theme/images';

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

export const managementLink =
  'https://sites.google.com/buyboxexperts.com/employee-engagement/home';
export const helpDeskLink =
  'https://bbe.atlassian.net/servicedesk/customer/portals';

export const BrandSteps = [
  {
    key: 'brand_logo',
    url: 'brand-logo',
    label: 'Brand Logo',
    step: 1,
    subtitle: 'Please upload one or more versions of your brand logo.',
    format: 'AI or EPS file',
    skip: 'brand-guidelines',
  },
  {
    key: 'brand_guidelines',
    url: 'brand-guidelines',
    label: 'Brand Guidelines',
    step: 2,
    subtitle:
      'Please upload a brand style guide. This should include specifics around brand colors, logo usage, fonts, tone of voice and other relevant information.',
    format: 'PDF',
    skip: 'font-files',
  },
  {
    key: 'font_files',
    url: 'font-files',
    label: 'Font Files',
    step: 3,
    subtitle:
      'Please upload the raw font files that are used across your brand identity, such as for your logo or any specific fonts used on your website and marketing material.',
    format: 'OTF, TTF, WOFF',
    skip: 'iconography',
  },
  {
    key: 'iconography',
    url: 'iconography',
    label: 'Iconography',
    step: 4,
    subtitle:
      "Please upload any iconography you use across your brand's various platforms, such as your website and marketing material.",

    format: 'AI, EPS, SVG',
    skip: 'additional-brand-material',
  },
  {
    key: 'additional_brand_material',
    url: 'additional-brand-material',
    label: 'Additional Brand Material',
    step: 5,
    subtitle:
      'Please upload anything else you have that will help us understand and represent your brand image as accurately as possible.',
    format: '',
    skip: 'summary',
  },
];
