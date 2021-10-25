import React from 'react';

import {
  bool,
  number,
  func,
  arrayOf,
  shape,
  oneOfType,
  string,
} from 'prop-types';

import { InputFormField, CheckBox } from '../../../common';

function AdditionalMonthlyServices({
  onAddDiscount,
  formData,
  monthlyService,
  handleChange,
  setShowAdditionalMarketplace,
  showAdditionalMarketplace,
  generateHTML,
}) {
  const formDataAdditionalMarketplacesLength =
    formData?.additional_marketplaces?.length;

  return (
    <li>
      <InputFormField className="mb-3">
        <label htmlFor="additional_one_time_services ">Monthly Services</label>
        <div
          className="add-discount"
          role="presentation"
          onClick={() => onAddDiscount('monthly')}>
          {formData?.monthly_discount_amount && formData.monthly_discount_type
            ? 'Edit Discount'
            : 'Add Discount'}
        </div>
      </InputFormField>
      {monthlyService &&
        monthlyService.map((serviceData) => (
          <CheckBox key={serviceData?.value}>
            <label
              className="check-container customer-pannel"
              htmlFor={serviceData.value}>
              {serviceData.label}
              <input
                type="checkbox"
                name={serviceData.label}
                id={serviceData.value}
                onClick={(event) =>
                  handleChange(
                    event,
                    'additional_monthly_services',
                    'checkbox',
                    serviceData,
                  )
                }
                defaultChecked={
                  formData?.additional_monthly_services?.length &&
                  formData.additional_monthly_services.find(
                    (item) =>
                      item.service?.id === serviceData.value ||
                      item.service_id === serviceData.value,
                  )
                }
              />
              <span className="checkmark" />
            </label>
          </CheckBox>
        ))}

      <CheckBox>
        <label
          className="check-container customer-pannel"
          htmlFor="additional_marketplaces">
          Additional Marketplaces
          <input
            type="checkbox"
            id="additional_marketplaces"
            onClick={(event) => {
              setShowAdditionalMarketplace(event.target.checked);
              handleChange(
                event,
                'additional_marketplaces_checkbox',
                'checkbox',
              );
            }}
            defaultChecked={formDataAdditionalMarketplacesLength}
          />
          <span className="checkmark" />
        </label>
      </CheckBox>

      {showAdditionalMarketplace ? (
        <>
          <InputFormField>
            {generateHTML({
              key: 'additional_marketplaces',
              label: 'Additional Market Places',
              type: 'multichoice',
            })}
          </InputFormField>
        </>
      ) : (
        ''
      )}
    </li>
  );
}

export default AdditionalMonthlyServices;
AdditionalMonthlyServices.defaultProps = {
  onAddDiscount: () => {},
  formData: {},
  monthlyService: [],
  handleChange: () => {},
  setShowAdditionalMarketplace: () => {},
  showAdditionalMarketplace: false,
  generateHTML: () => {},
};

AdditionalMonthlyServices.propTypes = {
  onAddDiscount: func,
  formData: shape({
    additional_monthly_services: arrayOf(shape({})),
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
  }),
  monthlyService: arrayOf(shape({})),
  handleChange: func,
  setShowAdditionalMarketplace: func,
  showAdditionalMarketplace: bool,
  generateHTML: func,
};
