import React from 'react';

import { arrayOf } from 'prop-types';

import Theme from '../../../../theme/Theme';
import { Card } from '../../../../common';
import { BGSComissionMetrics } from '../../../../constants';

const ComissionsMetrics = ({ comissionData }) => {
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
        {BGSComissionMetrics.map((item) => (
          <div className="col-md-3 col-6 mb-3" key={item.value}>
            <Card
              className="fix-height"
              heading={item.label}
              title={renderTitle(comissionData, item.key)}
              titleColor={
                item.key === 'total_overdue' && !comissionData[item.key]
                  ? Theme.black
                  : item.titleColor
              }
              prefix={comissionData[item.key] !== null ? item.prefix : ''}
              postfix={item.postfix}
              type="invoices"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ComissionsMetrics;

ComissionsMetrics.defaultProps = {
  comissionData: [],
};

ComissionsMetrics.propTypes = {
  comissionData: arrayOf(Array),
};
