import React from 'react';

import { shape } from 'prop-types';

import Theme from '../../../../theme/Theme';
import { Card } from '../../../../common';
import { BGSComissionMatrics } from '../../../../constants';
// import { divide } from 'lodash';

const ComissionsMetrics = ({ commissionMatrics }) => {
  const bindAmount = (orignalNumber, decimalDigits = 2) => {
    const number = Number(orignalNumber);
    if (number !== undefined && number !== null) {
      return number
        .toFixed(decimalDigits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return number;
  };

  const renderTitle = (data, key) => {
    if (data[key] === null) {
      return 'N/A';
    }
    if (typeof data[key] === 'undefined') {
      return '0';
    }
    return bindAmount(data[key], 0);
  };

  return (
    <>
      <div className="white-card-container mb-4">
        {BGSComissionMatrics.map((item) => (
          <div className="col-md-3 col-6 mb-3" key={item.value}>
            <Card
              className="fix-height"
              heading={item.label}
              title={renderTitle(commissionMatrics, item.key)}
              titleColor={
                item.key === 'total_overdue' && !commissionMatrics[item.key]
                  ? Theme.black
                  : item.titleColor
              }
              prefix={commissionMatrics[item.key] !== null ? item.prefix : ''}
              postfix={item.postfix}
              type="invoices"
              breakDown={item.breakdown}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ComissionsMetrics;

ComissionsMetrics.defaultProps = {
  commissionMatrics: {},
};

ComissionsMetrics.propTypes = {
  commissionMatrics: shape({}),
};
