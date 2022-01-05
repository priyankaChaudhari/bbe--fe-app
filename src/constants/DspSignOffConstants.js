export const InvoiceApprovalHeader = {
  standard: 'Proposed DSP Invoice Adjustment',
  'permanent additional': 'Proposed DSP Invoice Adjustment',
  'one time': 'Proposed One-Time DSP Invoice Adjustment',
  pause: 'Proposed Pause of DSP Invoice',
};

export const InvoiceTypeNames = {
  standard: 'Standard',
  'permanent additional': 'Permanent Additional',
  'one time': 'One-Time',
};

export const InvoiceCurrentMonthHeader = {
  standard: 'Current monthly DSP invoice amount',
  'permanent additional': 'Current monthly DSP invoice amount',
  'one time': 'One-time DSP Invoice',
  pause: 'Current monthly DSP invoice amount',
};

export const InvoiceNewMonthHeader = {
  standard: 'New monthly DSP invoice',
  'permanent additional': 'New monthly DSP invoice',
  'one time': 'One-time DSP Invoice',
  pause: 'New DSP invoice for ',
};

export const InvoiceInfo = {
  standard: {
    mainHeading: 'This will be your new, ongoing invoice amount. ',
    boldHeading:
      'The first bill for this amount will be due APPLICABLE_MONTH 25.',
  },
  'permanent additional': {
    mainHeading: 'This will be your new, ongoing invoice amount. ',
    boldHeading:
      'The first bill for this amount will be due APPLICABLE_MONTH 25.',
  },
  'one time': {
    mainHeading:
      'The will be a one-off invoice, providing additional budget for ',
    boldHeading: 'APPLICABLE_MONTH only. ',
    mainHeading2:
      'This invoice will be sent as soon as you approve this proposal.',
  },
  pause: {
    mainHeading: 'The changes will apply to ',
    boldHeading: 'APPLICABLE_MONTH only',
  },
};

export const invoiceApprovalFlag = [
  { value: 'yes', label: 'I approve the new DSP invoice amount' },
  { value: 'no', label: 'I want to reject the proposal' },
];

export const TotalInvoiceHeader = {
  standard: 'Total',
  'permanent additional': 'Total',
  'one time': 'One-time total',
  pause: 'Total invoice',
};
