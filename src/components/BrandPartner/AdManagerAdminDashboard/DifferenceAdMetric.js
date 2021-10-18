import React from 'react';

import { number, string } from 'prop-types';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  UpDowGrayArrow,
} from '../../../theme/images';

const DifferenceAdMetric = ({ value, type }) => {
  if (value >= 0 || (type === 'dpvr' && value < 0)) {
    return (
      <div
        className={`perentage-value ${
          type === 'spend' ? '' : type === 'acos' ? 'down' : ''
        } mt-3 pt-1`}>
        <img
          className="green-arrow"
          src={
            type === 'spend'
              ? UpDowGrayArrow
              : type === 'acos'
              ? ArrowDownIcon
              : ArrowUpIcon
          }
          alt="arrow-down"
        />
        {value.toString().replace('-', '')}
        {type === 'roas' || type === 'totalRoas' ? '' : '%'}
      </div>
    );
  }
  return (
    <div
      className={`perentage-value ${
        type === 'spend' ? '' : type === 'acos' ? '' : 'down'
      }  mt-3 pt-1`}>
      <img
        className="red-arrow"
        src={
          type === 'spend'
            ? UpDowGrayArrow
            : type === 'acos'
            ? ArrowUpIcon
            : ArrowDownIcon
        }
        alt="arrow-down"
      />
      {value.toString().replace('-', '')}
      {type === 'roas' || type === 'totalRoas' ? '' : '%'}
    </div>
  );
};

export default DifferenceAdMetric;

DifferenceAdMetric.defaultProps = {
  value: '',
  type: '',
};

DifferenceAdMetric.propTypes = {
  value: number,
  type: string,
};
