import React from 'react';

import { shape } from 'prop-types';

import { Card } from '../../../../../common';
import Theme from '../../../../../theme/Theme';

const MetricsInvoices = ({ data }) => {
  const returnFromatNumber = (value, type, decimalDigits = 0) => {
    if (value) {
      return `${type === 'currency' ? '$' : ''}${value
        .toFixed(decimalDigits)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${
        type === 'percentage' ? '%' : ''
      }`;
    }
    return `${type === 'currency' ? '$' : ''}0${
      type === 'percentage' ? '%' : ''
    }`;
  };
  const renderCard = (heading, title, subTitle, titleColor) => {
    return (
      <div className="col-md-3 col-lg-3 col-6  pl-2 pr-2 mb-3">
        <Card
          className="fix-height"
          heading={heading}
          title={title}
          subTitle={subTitle}
          titleColor={titleColor}
        />
      </div>
    );
  };
  return (
    <div className="row">
      {data && (
        <>
          {renderCard(
            'Total Outstanding',
            returnFromatNumber(data.total_outstanding, 'currency'),
            `${data.total_outstanding_cnt} open or overdue invoices`,
          )}
          {renderCard(
            'Amount Overdue',
            returnFromatNumber(data.amount_overdue, 'currency'),
            `${data.amount_overdue_cnt} overdue invoice`,
            Theme.red,
          )}
          {renderCard(
            'Average days past due',
            `${
              data.avg_days_past_due !== 0
                ? data.avg_days_past_due
                    .toFixed(1)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0
            } days`,
            'After due date',
          )}
          {renderCard(
            'Paid by due date',
            returnFromatNumber(data.paid_by_due_date, 'percentage', 1),
          )}
        </>
      )}
    </div>
  );
};

export default MetricsInvoices;

MetricsInvoices.defaultProps = {
  data: {
    total_outstanding: 0,
    amount_overdue: 0,
    avg_days_past_due: 0,
    paid_by_due_date: 0,
  },
};

MetricsInvoices.propTypes = {
  data: shape({}),
};
