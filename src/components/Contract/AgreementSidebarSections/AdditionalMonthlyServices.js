import React from 'react';

import { number, func, arrayOf, shape, oneOfType, string } from 'prop-types';

import { InputFormField, CheckBox } from '../../../common';

function AdditionalMonthlyServices({
  onAddDiscount,
  formData,
  monthlyService,
  accountType,
  showFooter,
  setShowCollpase,
  showSection,
  originalData,
  additionalMonthlyServices,
  setFormData,
  updateAdditionalMonthlyServices,
  setMonthlyAdditionalServices,
  fetchUncommonOptions,
  discountData,
}) {
  const handleChange = (event, key, type, val) => {
    showFooter(true);
    if (key === 'additional_monthly_services') {
      const itemInFormData =
        originalData?.additional_monthly_services?.length &&
        originalData.additional_monthly_services.find(
          (item) => item && item?.service && item?.service?.id === val?.id,
        );
      // if item checked
      if (event.target.checked) {
        if (event.target.name === 'DSP Advertising') {
          setShowCollpase({ ...showSection, dspAddendum: true });
        }
        // checked whether checked item present in newly created list
        if (
          additionalMonthlyServices?.create?.length &&
          additionalMonthlyServices.create.find((item) =>
            item?.service_id
              ? item?.service_id === val?.id
              : item?.service?.id === val?.id,
          )
        ) {
          // if checked item is already present in newly created list then don't do anything
        } else {
          // if checked item not found in newly created list then  again check whether it is present in original formData variable because if it is found in formData then we need to add that found item in newly created list bcoz we need id and all of that item to push in newly created list.
          // here we check whether checked item present in orginal formDAta list then add that found item in newly created list
          if (itemInFormData) {
            additionalMonthlyServices.create.push(itemInFormData);
            const list = formData.additional_monthly_services;
            list.push(itemInFormData);
            setFormData({
              ...formData,
              additional_monthly_services: list,
            });

            updateAdditionalMonthlyServices();
          }
          // else we create dict as BE required for new item and we push that in newly created list
          else {
            additionalMonthlyServices.create.push({
              name: event.target.name,
              service_id: val?.id,
              contract_id: originalData?.id,
              account_type: accountType,
            });

            let list = formData.additional_monthly_services;
            if (!list) {
              list = [];
            }
            list.push({
              name: event.target.name,
              service_id: val?.id,
              contract_id: originalData?.id,
              account_type: accountType,
            });
            setFormData({
              ...formData,
              additional_monthly_services: list,
            });

            updateAdditionalMonthlyServices();
          }
          // here we fnally update state variable
          setMonthlyAdditionalServices({
            ...additionalMonthlyServices,
          });
        }
        // suppose checked item present in original formData then we have to remove its id from newly created delete list.
        if (itemInFormData) {
          const updatedDeleteList = additionalMonthlyServices.delete.filter(
            (item) => item !== itemInFormData.id,
          );
          additionalMonthlyServices.delete = updatedDeleteList;
        }

        setMonthlyAdditionalServices({
          ...additionalMonthlyServices,
        });

        fetchUncommonOptions(
          monthlyService,
          additionalMonthlyServices.create,
          'monthly_service',
        );
      }
      // if item unchecked or removed
      else {
        // if unchecked item found in original list then add its id to newly created delte list
        if (itemInFormData) {
          additionalMonthlyServices.delete.push(itemInFormData.id);
        }
        // now we filter newly created list with removed unchecked item from it
        const updatedCreateList = additionalMonthlyServices.create.filter(
          (item) =>
            item?.service_id
              ? item?.service_id !== val?.id
              : item?.service?.id !== val?.id,
        );

        additionalMonthlyServices.create = updatedCreateList;

        const list = formData.additional_monthly_services;
        const deletedUncheckedItemList = list.filter((item) =>
          item?.service_id
            ? item?.service_id !== val?.id
            : item?.service?.id !== val?.id,
        );

        setFormData({
          ...formData,
          additional_monthly_services: deletedUncheckedItemList,
        });
        updateAdditionalMonthlyServices();
        setMonthlyAdditionalServices({
          ...additionalMonthlyServices,
        });

        if (event.target.name === 'DSP Advertising') {
          if (
            additionalMonthlyServices?.create?.length &&
            additionalMonthlyServices.create.find((item) =>
              item?.name
                ? item?.name === 'DSP Advertising'
                : item?.service?.name === 'DSP Advertising',
            )
          ) {
            //
          } else {
            setShowCollpase({ ...showSection, dspAddendum: false });
          }
        }
        fetchUncommonOptions(
          monthlyService,
          additionalMonthlyServices.create,
          'monthly_service',
        );
      }
    }
  };
  const showDiscountLabel = () => {
    const discount =
      discountData?.length &&
      discountData.filter(
        (item) =>
          item?.service_type === 'monthly service' &&
          item?.account_type === accountType,
      );
    if (discount?.length && discount[0]?.type) {
      return 'Edit Discount';
    }
    return 'Add Discount';
  };

  return (
    <>
      <InputFormField className="mb-3">
        <label htmlFor="additional_one_time_services ">Monthly Services</label>
        <div
          className="add-discount"
          role="presentation"
          onClick={() => onAddDiscount('monthly service', accountType)}>
          {showDiscountLabel()}
        </div>
      </InputFormField>
      {monthlyService &&
        monthlyService.map((serviceData) => (
          <CheckBox key={serviceData?.id}>
            <label
              className="check-container customer-pannel"
              htmlFor={serviceData?.id}>
              {serviceData?.name}
              <input
                type="checkbox"
                name={serviceData?.name}
                id={serviceData?.id}
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
                      item?.service?.id === serviceData?.id ||
                      item?.service_id === serviceData?.id,
                  )
                }
              />
              <span className="checkmark" />
            </label>
          </CheckBox>
        ))}
    </>
  );
}

export default AdditionalMonthlyServices;
AdditionalMonthlyServices.defaultProps = {
  onAddDiscount: () => {},
  formData: {},
  monthlyService: [],
  accountType: '',
  showFooter: () => {},
  setShowCollpase: () => {},
  showSection: () => {},
  originalData: {},
  additionalMonthlyServices: {},
  setFormData: () => {},
  updateAdditionalMonthlyServices: () => {},
  setMonthlyAdditionalServices: () => {},
  fetchUncommonOptions: () => {},
  discountData: [],
};

AdditionalMonthlyServices.propTypes = {
  onAddDiscount: func,
  formData: shape({
    additional_monthly_services: arrayOf(shape({})),
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
  }),
  monthlyService: arrayOf(shape({})),
  accountType: string,
  showFooter: func,
  setShowCollpase: func,
  showSection: func,
  originalData: shape({}),
  additionalMonthlyServices: shape({}),
  setFormData: () => {},
  updateAdditionalMonthlyServices: () => {},
  setMonthlyAdditionalServices: () => {},
  fetchUncommonOptions: () => {},
  discountData: arrayOf(shape()),
};
