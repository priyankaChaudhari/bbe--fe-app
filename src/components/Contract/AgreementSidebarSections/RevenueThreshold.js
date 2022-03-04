import React from 'react';

import { shape, func, string } from 'prop-types';

import { InputFormField, ErrorMsg } from '../../../common';
import {
  monthlyThresholdOptions,
  quarterlyThresholdOptions,
} from '../../../constants';

export default function RevenueThreshold({
  formData,
  handleChange,
  generateHTML,
  section,
  feeStructureErrors,
  selectedCurrency,
}) {
  const thresholdOptions = [
    { value: 'None', label: 'None', type: `${section}_none` },
    { value: 'Fixed', label: 'Fixed', type: `${section}_fixed` },
    { value: 'quarterly', label: 'Quarterly', type: `${section}_quarterly` },
    { value: 'monthly', label: 'Monthly', type: `${section}_monthly` },
  ];

  const generateThresholdOptions = () => {
    if (formData?.fee_structure?.[section]?.threshold_type === 'Fixed') {
      return (
        <InputFormField className="mt-3">
          <div className="input-container">
            <span className="input-icon ">{selectedCurrency} </span>
            {generateHTML({
              key: 'sales_threshold',
              type: 'number-currency',
              fieldOf: 'threshold',
            })}
          </div>
        </InputFormField>
      );
    }
    if (formData?.fee_structure?.[section]?.threshold_type === 'quarterly') {
      return (
        <>
          {quarterlyThresholdOptions.map((item) => (
            <InputFormField key={item.key}>
              <div className="row">
                <div className="col-4 pr-0 mt-3">
                  <label
                    className="quartely-threshold"
                    htmlFor="Monthly Retainer">
                    {item.label}
                  </label>
                </div>
                <div className="col-8">
                  <div className="input-container">
                    <span className="input-icon">{selectedCurrency} </span>
                    {generateHTML(item)}
                  </div>
                </div>
              </div>
            </InputFormField>
          ))}
        </>
      );
    }
    if (formData?.fee_structure?.[section]?.threshold_type === 'monthly') {
      return (
        <>
          {monthlyThresholdOptions.map((item) => (
            <InputFormField key={item.key}>
              <div className="row">
                <div className="col-4 pr-0 mt-3">
                  <label
                    className="quartely-threshold"
                    htmlFor="Monthly Retainer">
                    {item.label}
                  </label>
                </div>
                <div className="col-8">
                  <div className="input-container">
                    <span className="input-icon">{selectedCurrency} </span>
                    {generateHTML(item)}
                  </div>
                </div>
              </div>
            </InputFormField>
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <>
      <div className="thershold mb-2">
        <ul className="days-tab">
          <>
            {thresholdOptions.map((threshold) => {
              return (
                <li
                  key={Math.random()}
                  className={
                    formData?.fee_structure?.[section]?.threshold_type ===
                      threshold.value ||
                    (!formData?.fee_structure?.[section]?.threshold_type &&
                      threshold.value === 'None')
                      ? 'p-0 thresholdChecked'
                      : 'p-0'
                  }>
                  <input
                    className="d-none "
                    type="radio"
                    id={threshold.type}
                    name="threshold_type"
                    value={threshold.value}
                    onClick={(event) =>
                      handleChange(event, 'threshold_type', section)
                    }
                  />
                  <label
                    className={
                      threshold?.label?.toLowerCase().includes('yoy')
                        ? 'radio-container customer-list thresholdLable'
                        : 'radio-container customer-list'
                    }
                    htmlFor={threshold.type}>
                    {threshold.label}
                  </label>
                </li>
              );
            })}
          </>
        </ul>
      </div>
      {generateThresholdOptions()}
      <ErrorMsg>{feeStructureErrors?.[section]?.quarterly_rev_share}</ErrorMsg>
      <ErrorMsg>{feeStructureErrors?.[section]?.monthly_rev_share}</ErrorMsg>
      <ErrorMsg>{feeStructureErrors?.[section]?.sales_threshold}</ErrorMsg>
    </>
  );
}

RevenueThreshold.defaultProps = {
  handleChange: () => {},
  generateHTML: () => {},
  formData: {},
  feeStructureErrors: {},
};

RevenueThreshold.propTypes = {
  formData: shape({
    fee_structure: shape({}),
  }),
  handleChange: func,
  generateHTML: func,
  section: string.isRequired,
  feeStructureErrors: shape({}),
  selectedCurrency: string.isRequired,
};
