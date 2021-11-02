import React from 'react';

import Select from 'react-select';
import NumberFormat from 'react-number-format';
import { bool, number, func, arrayOf, shape, string } from 'prop-types';

import { InputFormField, ContractInputSelect } from '../../../common';

function RevenueShareThreshold({
  thresholdTypeOptions,
  selectedThreshold,
  formData,
  onThresholdTypeChange,
  contractErrorSalesThreshold,
  handleChange,
  displayError,
  contractError,
  yoyPercentageOptions,
  DropdownIndicator,
}) {
  const yoyPercentage = formData?.yoy_percentage;

  return (
    <li>
      <div className="label-heading mb-2">Revenue Share Threshold</div>
      <div className="thershold">
        <ul className="days-tab">
          {thresholdTypeOptions.map((threshold) => {
            return (
              <li
                key={Math.random()}
                className={
                  selectedThreshold.value === threshold.value ||
                  formData.threshold_type === threshold.value ||
                  (!formData.threshold_type && threshold.value === 'None')
                    ? 'p-0 thresholdChecked'
                    : 'p-0'
                }>
                <input
                  className="d-none "
                  type="radio"
                  id={threshold.label}
                  name="threshold_type"
                  value={threshold.value}
                  onClick={(event) => {
                    onThresholdTypeChange(event, 'threshold_type', threshold);
                  }}
                />
                <label
                  className={
                    threshold.label.toLowerCase().includes('yoy')
                      ? 'radio-container customer-list thresholdLable'
                      : 'radio-container customer-list'
                  }
                  htmlFor={threshold.label}>
                  {threshold.label}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      {formData?.threshold_type === 'Fixed' ? (
        <div>
          <InputFormField>
            <div className="input-container  ">
              <span
                className={
                  contractErrorSalesThreshold
                    ? 'input-icon error-msg'
                    : 'input-icon'
                }>
                ${' '}
              </span>
              <NumberFormat
                name="sales_threshold"
                className={
                  contractErrorSalesThreshold
                    ? 'form-control modal-input-control form-control-error'
                    : 'form-control modal-input-control'
                }
                placeholder="Enter threshold"
                onChange={(event) => handleChange(event, 'sales_threshold')}
                defaultValue={formData?.sales_threshold}
                thousandSeparator
                allowNegative={false}
              />
            </div>
            {displayError({ key: 'sales_threshold' })}
          </InputFormField>
        </div>
      ) : (
        ''
      )}
      {formData?.threshold_type === 'YoY + %' ? (
        <div>
          <ContractInputSelect>
            <Select
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  background:
                    contractError && contractError.yoy_percentage
                      ? '#FBF2F2'
                      : '#F4F6FC',
                  // match with the menu
                  // borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
                  // Overwrittes the different states of border
                  borderColor:
                    contractError && contractError.yoy_percentage
                      ? '#D63649'
                      : '#D5D8E1',

                  // Removes weird border around container
                  boxShadow: state.isFocused ? null : null,
                  '&:hover': {
                    // Overwrittes the different states of border
                    boxShadow: state.isFocused ? null : null,
                    outlineColor: state.isFocused ? null : null,
                  },
                }),
                placeholder: (defaultStyles) => {
                  return {
                    ...defaultStyles,
                    color: '556178',
                  };
                },
              }}
              isSearchable={false}
              defaultValue={
                yoyPercentage
                  ? [
                      {
                        label: yoyPercentage,
                        value: yoyPercentage,
                      },
                    ]
                  : []
              }
              options={yoyPercentageOptions}
              name="yoy_percentage"
              components={{ DropdownIndicator }}
              onChange={(event) => {
                handleChange(event, 'yoy_percentage', 'choice');
              }}
              placeholder="Select percentage"
            />
            {displayError({ key: 'yoy_percentage' })}
          </ContractInputSelect>
        </div>
      ) : (
        ''
      )}
    </li>
  );
}

export default RevenueShareThreshold;

RevenueShareThreshold.defaultProps = {
  thresholdTypeOptions: [],
  selectedThreshold: '',
  formData: {},
  onThresholdTypeChange: () => {},
  contractErrorSalesThreshold: false,
  handleChange: () => {},
  displayError: () => {},
  contractError: () => {},
  yoyPercentageOptions: [],
  DropdownIndicator: () => {},
};

RevenueShareThreshold.propTypes = {
  thresholdTypeOptions: arrayOf(shape({})),
  selectedThreshold: string,
  formData: shape({
    threshold_type: string,
    sales_threshold: number,
  }),
  onThresholdTypeChange: func,
  contractErrorSalesThreshold: bool,
  handleChange: func,
  displayError: func,
  contractError: shape({
    yoy_percentage: string,
  }),
  yoyPercentageOptions: arrayOf(shape({})),
  DropdownIndicator: func,
};
