/* eslint-disable react/prop-types */
import React from 'react';

import Select from 'react-select';
import { arrayOf, shape, func, string, oneOfType, number } from 'prop-types';

import {
  CheckBox,
  ContractInputSelect,
  DropdownIndicator,
} from '../../../common';

function AdditionalMarketplaces({
  formData,
  getOptions,
  accountType,
  showFooter,
  additionalMarketplacesData,
  setFormData,
  agreementData,
  setAdditionalMarketplaces,
  originalData,
  updateAdditionalMarketplaces,
  setAdditionalMarketplace,
  setMarketPlaces,
  marketplacesResult,
  defaultData,
  setShowAdditionalMarketplace,
  showAdditionalMarketplace,
}) {
  const originalDataAdditionalMarketplacesLength =
    originalData?.additional_marketplaces?.length;

  const getServicesAccordingToAccType = (data, option) => {
    const result = data && data.filter((item) => item.account_type === option);
    return result;
  };

  const handleChange = (event, key, type, accntType, val) => {
    showFooter(true);
    if (key === 'additional_marketplaces_checkbox') {
      if (event.target.checked) {
        if (
          agreementData?.primary_marketplace?.name ||
          formData?.primary_marketplace
        ) {
          setAdditionalMarketplaces(
            marketplacesResult.filter(
              (op) =>
                op.value !==
                (formData.primary_marketplace.name
                  ? formData.primary_marketplace.name
                  : formData.primary_marketplace),
            ),
          );
        } else {
          setAdditionalMarketplaces(marketplacesResult);
        }
      } else {
        const listOfSelectedMarketplace = getServicesAccordingToAccType(
          formData?.additional_marketplaces,
          accountType,
        );

        const vendorMarketplaceResult = getServicesAccordingToAccType(
          formData?.additional_marketplaces,
          accountType === 'Vendor' ? 'Seller' : 'Vendor',
        );

        const itemsToBeDelete = listOfSelectedMarketplace?.filter((item) => {
          if (item.id) {
            return item;
          }
          return null;
        });

        if (itemsToBeDelete?.length) {
          const list = itemsToBeDelete.map((item) => item.id);
          additionalMarketplacesData.delete = [
            ...list,
            ...additionalMarketplacesData.delete,
          ];
          additionalMarketplacesData.create = [];
        }

        setFormData({
          ...formData,
          additional_marketplaces: vendorMarketplaceResult,
        });
      }
      updateAdditionalMarketplaces();
      setAdditionalMarketplace({
        ...additionalMarketplacesData,
      });

      setMarketPlaces(marketplacesResult);
    } else if (type === 'multichoice') {
      if (val.action === 'select-option') {
        const itemInFormData =
          originalDataAdditionalMarketplacesLength &&
          originalData.additional_marketplaces.find(
            (item) =>
              item &&
              item.name === val.option.value &&
              item.account_type === accountType,
          );

        // checked whether checked item present in newly created list
        if (
          additionalMarketplacesData?.create &&
          additionalMarketplacesData.create.find((item) =>
            item.name
              ? item.name === val.option.value &&
                item.account_type === accountType
              : item.value === val.option.value &&
                item.account_type === accountType,
          )
        ) {
          // if checked item is already present in newly created list then don't do anything
        } else {
          // if checked item not found in newly created list then  again check whether it is present in original formData variable because if it is found in formData then we need to add that found item in newly created list bcoz we need id and all of that item to push in newly created list.
          // here we check whether checked item present in orginal formDAta list then add that found item in newly created list
          if (itemInFormData) {
            additionalMarketplacesData.create.push(itemInFormData);
            const list = formData.additional_marketplaces;
            list.push(itemInFormData);
            setFormData({
              ...formData,
              additional_marketplaces: list,
            });
            updateAdditionalMarketplaces();
          }
          // else we create dict as BE required for new item and we push that in newly created list
          else {
            additionalMarketplacesData.create.push({
              name: val.option.value,
              contract_id: originalData && originalData.id,
              account_type: accountType,
            });
            setFormData({
              ...formData,
              additional_marketplaces: additionalMarketplacesData.create,
            });
            updateAdditionalMarketplaces();
          }
          // here we fnally update state variable
          setAdditionalMarketplace({
            ...additionalMarketplacesData,
          });
        }
        // suppose checked item present in original formData then we have to remove its id from newly created delete list.
        if (itemInFormData) {
          const updatedDeleteList = additionalMarketplacesData.delete?.filter(
            (item) => item !== itemInFormData.id,
          );
          additionalMarketplacesData.delete = updatedDeleteList;
        }
        setAdditionalMarketplace({
          ...additionalMarketplacesData,
        });
        if (additionalMarketplacesData.create) {
          setMarketPlaces(
            marketplacesResult?.filter(
              (choice) =>
                !additionalMarketplacesData.create.some(
                  (item) => item.name === choice.value,
                ),
            ),
          );
        }
      }
      if (val.action === 'remove-value') {
        const itemInFormData =
          originalDataAdditionalMarketplacesLength &&
          originalData.additional_marketplaces.find(
            (item) =>
              item &&
              item.name === val.removedValue.value &&
              item.account_type === accountType,
          );
        // if unchecked item found in original list then add its id to newly created delte list
        if (itemInFormData?.id) {
          additionalMarketplacesData.delete.push(itemInFormData.id);
        }

        // now we filter newly created list with removed unchecked item from it
        const updatedCreateList = additionalMarketplacesData.create
          .filter((item) => item.account_type === accntType)
          .filter((item) =>
            item.name
              ? item.name !== val.removedValue.value
              : item.value !== val.removedValue.value,
          );

        const otherList = additionalMarketplacesData.create.filter(
          (item) => item.account_type !== accntType,
        );
        additionalMarketplacesData.create = updatedCreateList.concat(otherList);

        const list = formData.additional_marketplaces;
        const deletedUncheckedItemList = list
          .filter((item) => item.account_type === accntType)
          .filter((item) =>
            item.name
              ? item.name !== val.removedValue.value
              : item.value !== val.removedValue.value,
          );

        const otherFormDataList = list.filter(
          (item) => item.account_type !== accntType,
        );

        setFormData({
          ...formData,
          additional_marketplaces: deletedUncheckedItemList.concat(
            otherFormDataList,
          ),
        });
        updateAdditionalMarketplaces();
        setAdditionalMarketplace({
          ...additionalMarketplacesData,
        });
        if (updatedCreateList) {
          setMarketPlaces(
            marketplacesResult.filter(
              (choice) =>
                !updatedCreateList.some((item) => item.name === choice.value),
            ),
          );
        }
      }
    }
  };

  const generateMultiChoice = (item) => {
    return (
      <Select
        classNamePrefix="react-select"
        options={getOptions(item.key, 'multi')}
        isMulti
        name={item.key}
        onChange={(event, value) =>
          handleChange(event, item.key, 'multichoice', item.accountType, value)
        }
        defaultValue={
          defaultData?.[accountType]?.length ? defaultData[accountType] : null
        }
        components={{ DropdownIndicator }}
        isClearable={false}
      />
    );
  };

  return (
    <>
      <CheckBox>
        <label
          className="check-container customer-pannel"
          htmlFor={accountType}>
          Additional Marketplaces
          <input
            type="checkbox"
            id={accountType}
            onClick={(event) => {
              setShowAdditionalMarketplace({
                ...showAdditionalMarketplace,
                [accountType]: {
                  showDropdown: event.target.checked,
                },
              });
              handleChange(
                event,
                'additional_marketplaces_checkbox',
                'checkbox',
                accountType,
              );
            }}
            checked={showAdditionalMarketplace[accountType]?.showDropdown}
          />
          <span className="checkmark" />
        </label>
      </CheckBox>

      <ContractInputSelect>
        {showAdditionalMarketplace[accountType]?.showDropdown
          ? generateMultiChoice({
              key: 'additional_marketplaces',
              label: 'Additional Market Places',
              type: 'multichoice',
              accountType,
            })
          : ''}
      </ContractInputSelect>
    </>
  );
}

export default AdditionalMarketplaces;

AdditionalMarketplaces.defaultProps = {
  formData: {},
  getOptions: () => {},
  accountType: '',
  showFooter: () => {},
  additionalMarketplacesData: {},
  setFormData: () => {},
  agreementData: {},
  setAdditionalMarketplaces: () => {},
  originalData: {},
  updateAdditionalMarketplaces: () => {},
  setAdditionalMarketplace: () => {},
  setMarketPlaces: () => {},
  marketplacesResult: [],
  defaultData: {},
  setShowAdditionalMarketplace: () => {},
  showAdditionalMarketplace: {},
};
AdditionalMarketplaces.propTypes = {
  formData: shape({
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
    one_time_discount_type: oneOfType([string, number]),
    one_time_discount_amount: oneOfType([string, number]),
  }),
  getOptions: func,
  accountType: string,
  showFooter: func,
  additionalMarketplacesData: shape({}),
  setFormData: func,
  agreementData: shape({}),
  setAdditionalMarketplaces: func,
  originalData: shape({}),
  updateAdditionalMarketplaces: func,
  setAdditionalMarketplace: func,
  setMarketPlaces: func,
  marketplacesResult: arrayOf(shape({})),
  defaultData: shape({}),
  setShowAdditionalMarketplace: func,
  showAdditionalMarketplace: shape({}),
};
