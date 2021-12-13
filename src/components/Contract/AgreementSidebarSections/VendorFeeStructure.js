import React from 'react';

import Select from 'react-select';
import { shape, func, bool } from 'prop-types';

import SellerFeeStructure from './SellerFeeStructure';
import { vendorReportOptions } from '../../../constants';
import { CheckBox, ContractInputSelect, ErrorMsg } from '../../../common';

export default function VendorFeeStructure({
  setFormData,
  setUpdatedFormData,
  formData,
  updatedFormData,
  DropdownIndicator,
  revShareOptions,
  showFooter,
  setSectionError,
  sectionError,
  feeStructureErrors,
  setFeeStructureErrors,
  setVendorSameAsSeller,
  vendorSameAsSeller,
}) {
  const handleCheckbox = (event) => {
    showFooter(true);
    const vendorId = formData?.fee_structure?.vendor?.id;
    if (event.target.checked) {
      setVendorSameAsSeller(true);
      setFormData({
        ...formData,
        fee_structure: {
          ...formData.fee_structure,
          vendor: {
            ...formData.fee_structure.seller,
            id: vendorId,
            vendor_billing_report:
              formData.fee_structure.vendor.vendor_billing_report,
            vendor_same_as_seller: true,
          },
          seller: {
            ...formData.fee_structure.seller,
            vendor_same_as_seller: true,
          },
        },
      });

      setUpdatedFormData({
        ...updatedFormData,
        fee_structure: {
          ...updatedFormData.fee_structure,
          vendor: {
            ...updatedFormData?.fee_structure?.seller,
            vendor_billing_report:
              formData.fee_structure.vendor.vendor_billing_report,
            vendor_same_as_seller: true,
          },
        },
      });

      setSectionError({
        ...sectionError,
        vendor: {
          feeType: !(
            formData && formData?.fee_structure?.vendor?.vendor_billing_report
          )
            ? sectionError?.seller?.feeType
              ? sectionError?.seller?.feeType + 1
              : 0
            : sectionError?.seller?.feeType
            ? sectionError?.seller?.feeType
            : 0,
        },
        seller: {
          feeType: sectionError?.seller?.feeType
            ? sectionError?.seller?.feeType
            : 0,
        },
      });
      setFeeStructureErrors({
        ...feeStructureErrors,
        vendor: {
          ...feeStructureErrors.seller,
        },
      });
    }
    if (!event.target.checked) {
      setVendorSameAsSeller(false);
      setFormData({
        ...formData,
        fee_structure: {
          ...formData.fee_structure,
          vendor: {
            ...formData.fee_structure.vendor,
            vendor_same_as_seller: false,
            id: vendorId,
          },
          seller: {
            ...formData.fee_structure.seller,
            vendor_same_as_seller: false,
          },
        },
      });
      setUpdatedFormData({
        ...updatedFormData,
        fee_structure: {
          ...updatedFormData.fee_structure,
          vendor: {
            vendor_billing_report:
              formData.fee_structure.vendor.vendor_billing_report,
            vendor_same_as_seller: false,
          },
        },
      });
    }
  };

  const clearError = (key) => {
    if (!(formData && formData?.fee_structure?.vendor?.[key])) {
      setSectionError({
        ...sectionError,
        vendor: {
          feeType: sectionError?.vendor?.feeType
            ? sectionError?.vendor?.feeType - 1
            : 0,
        },
      });
      setFeeStructureErrors({
        ...feeStructureErrors,
        vendor: {
          ...feeStructureErrors.vendor,
          [key]: '',
        },
      });
    }
  };

  const handleChange = (event, key) => {
    clearError(key);
    showFooter(true);

    setFormData({
      ...formData,
      fee_structure: {
        ...formData.fee_structure,
        vendor: {
          ...formData.fee_structure.vendor,
          [key]: event.value,
        },
      },
    });
    setUpdatedFormData({
      ...updatedFormData,
      fee_structure: {
        ...updatedFormData.fee_structure,
        vendor: {
          ...updatedFormData?.fee_structure?.vendor,
          [key]: event.value,
        },
      },
    });
  };

  const generateDropdown = (item) => {
    return (
      <Select
        classNamePrefix={
          !(formData && formData?.fee_structure?.vendor?.[item.key]) &&
          item.isMandatory
            ? 'react-select  form-control-error'
            : 'react-select'
        }
        styles={{
          control: (base, state) => ({
            ...base,
            background:
              !(formData && formData?.fee_structure?.vendor?.[item.key]) &&
              item.isMandatory
                ? '#FBF2F2'
                : '#F4F6FC',
            // match with the menu
            // borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
            // Overwrittes the different states of border
            borderColor:
              !(formData && formData?.fee_structure?.vendor?.[item.key]) &&
              item.isMandatory
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
        }}
        placeholder={item.placeholder || 'Select'}
        value={
          formData?.fee_structure?.vendor?.[item.key]
            ? {
                value: formData?.fee_structure?.vendor?.[item.key],
                label: formData?.fee_structure?.vendor?.[item.key],
              }
            : null
        }
        options={vendorReportOptions}
        name={item.key}
        components={{ DropdownIndicator }}
        onChange={(event) => handleChange(event, item.key, 'choices')}
      />
    );
  };

  return (
    <>
      {formData?.seller_type?.label === 'Hybrid' ? (
        <div className=" liner-titles spacing mt-3 mb-3">
          Vendor Fee Structure
        </div>
      ) : (
        ''
      )}
      <ContractInputSelect className="mb-3">
        <label htmlFor="Vendor Billing Report">Vendor Billing Report</label>
        {generateDropdown({
          key: 'vendor_billing_report',
          label: 'Vendor Billing Report',
          type: 'choice',
          isMandatory: true,
          placeholder: 'Select Vendor Billing Report',
        })}
        <ErrorMsg>{feeStructureErrors?.vendor?.vendor_billing_report}</ErrorMsg>
      </ContractInputSelect>
      {formData?.seller_type?.label === 'Hybrid' ? (
        <CheckBox className="mt-1 mb-4">
          <label className="check-container customer-pannel " htmlFor="step">
            Apply same fee structure as seller sales
            <input
              className="checkboxes"
              type="checkbox"
              id="step"
              readOnly
              defaultChecked={
                formData?.fee_structure?.vendor?.vendor_same_as_seller
              }
              onChange={(event) => handleCheckbox(event, 'checkbox')}
            />
            <span className="checkmark" />
          </label>
        </CheckBox>
      ) : (
        ''
      )}

      <SellerFeeStructure
        setFormData={setFormData}
        updatedFormData={updatedFormData}
        setUpdatedFormData={setUpdatedFormData}
        formData={formData}
        DropdownIndicator={DropdownIndicator}
        revShareOptions={revShareOptions}
        section="vendor"
        showFooter={showFooter}
        setSectionError={setSectionError}
        sectionError={sectionError}
        vendorSameAsSeller={vendorSameAsSeller}
        feeStructureErrors={feeStructureErrors}
        setFeeStructureErrors={setFeeStructureErrors}
      />
    </>
  );
}

VendorFeeStructure.defaultProps = {
  setUpdatedFormData: () => {},
  setFormData: () => {},
  formData: {},
  updatedFormData: {},
  DropdownIndicator: {},
  revShareOptions: {},
  showFooter: false,
  setSectionError: () => {},
  sectionError: {},
  feeStructureErrors: {},
  setFeeStructureErrors: () => {},
  setVendorSameAsSeller: () => {},
};

VendorFeeStructure.propTypes = {
  formData: shape({
    fee_structure: shape({}),
  }),
  DropdownIndicator: func,
  setUpdatedFormData: func,
  setFormData: func,
  updatedFormData: func,
  revShareOptions: func,

  showFooter: bool,
  setSectionError: func,
  sectionError: shape({}),
  feeStructureErrors: shape({}),
  setFeeStructureErrors: func,
  setVendorSameAsSeller: func,
  vendorSameAsSeller: bool.isRequired,
};
