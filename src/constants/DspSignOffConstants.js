export const InvoiceApprovalHeader = {
  standard: 'Proposed DSP Invoice Adjustment',
  additional: 'Proposed DSP Invoice Adjustment',
  oneTime: 'Proposed One-Time DSP Invoice Adjustment',
  pause: 'Proposed Pause of DSP Invoice',
};

export const InvoiceCurrentMonthHeader = {
  standard: 'Current monthly DSP invoice amount',
  additional: 'Current monthly DSP invoice amount',
  oneTime: 'One-time DSP Invoice',
  pause: 'Current monthly DSP invoice amount',
};

export const InvoiceNewMonthHeader = {
  standard: 'New monthly DSP invoice',
  additional: 'New monthly DSP invoice',
  oneTime: 'One-time DSP Invoice',
  pause: 'New DSP invoice for ',
};

export const InvoiceInfo = {
  standard: {
    mainHeading: 'This will be your new, ongoing invoice amount. ',
    boldHeading: 'The first bill for this amount will be due November 22.',
  },
  additional: {
    mainHeading: 'This will be your new, ongoing invoice amount. ',
    boldHeading: 'The first bill for this amount will be due November 22.',
  },
  oneTime: {
    mainHeading:
      'The will be a one-off invoice, providing additional budget for ',
    boldHeading: 'December only. ',
    mainHeading2:
      'This invoice will be sent as soon as you approve this proposal.',
  },
  pause: {
    mainHeading: 'The changes will apply to ',
    boldHeading: 'November only',
  },
};

export const invoiceApprovalFlag = [
  { value: 'yes', label: 'I approve the new DSP invoice amount' },
  { value: 'no', label: 'I want to reject the proposal' },
];

export const TotalInvoiceHeader = {
  standard: 'Total',
  additional: 'Total',
  oneTime: 'One-time total',
  pause: 'Total invoice',
};
