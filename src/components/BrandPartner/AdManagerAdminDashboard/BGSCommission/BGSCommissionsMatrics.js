import React from 'react';

import { shape } from 'prop-types';

import Theme from '../../../../theme/Theme';
import { Card } from '../../../../common';
import { BGSCommissionMatrics } from '../../../../constants';

const BGSCommissionsMatrics = ({ commissionMatrics }) => {
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
      <div className="white-card-container sticky-metrics mb-4">
        {BGSCommissionMatrics.map((item) => (
          <div className="col-md-3 col-6 mb-3" key={item.key}>
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
              retainer={commissionMatrics.total_retainer}
              revShare={commissionMatrics.total_rev_share}
              dsp={commissionMatrics.total_dsp}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default BGSCommissionsMatrics;

BGSCommissionsMatrics.defaultProps = {
  commissionMatrics: {},
};

BGSCommissionsMatrics.propTypes = {
  commissionMatrics: shape({}),
};
