/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from 'react';

import Select from 'react-select';
import { Collapse } from 'react-collapse';
import { shape, func, bool, string } from 'prop-types';

import SellerFeeStructure from './SellerFeeStructure';
import VendorFeeStructure from './VendorFeeStructure';
import { Dollar } from '../../../theme/images';
import { getFeeStructure } from '../../../api';
import { Button, ContractInputSelect } from '../../../common';
import {
  accountTypeOptions,
  feeStructureContainerDetails,
} from '../../../constants';

export default function FeeStructureContainer({
  formData,
  setFormData,
  executeScroll,
  setOpenCollapse,
  openCollapse,
  renderCollapseBtnErrorHtml,
  loader,
  nextStep,
  DropdownIndicator,
  marketPlacesOptions,
  setUpdatedFormData,
  updatedFormData,
  setAdditionalMarketplaces,
  revShareOptions,
  showFooter,
  sectionError,
  setSectionError,
  feeStructureErrors,
  setFeeStructureErrors,
  getMonthlyServices,
  showRightTick,
}) {
  const [vendorSameAsSeller, setVendorSameAsSeller] = useState(
    formData?.fee_structure?.vendor?.vendor_same_as_seller || false,
  );

  const checkMandatoryFieldsOfFeeType = (data, section) => {
    let errorCount = sectionError?.[section]?.feeType
      ? sectionError?.[section]?.feeType
      : 0;

    if (
      data &&
      data?.fee_structure?.[section]?.fee_type === 'Retainer Only' &&
      !data?.fee_structure?.[section]?.monthly_retainer
    ) {
      errorCount = 1;
    }

    if (
      data &&
      data?.fee_structure?.[section]?.fee_type === 'Revenue Share Only' &&
      !data?.fee_structure?.[section]?.rev_share
    ) {
      errorCount = 1;
    }

    if (
      data &&
      data?.fee_structure?.[section]?.fee_type === 'Retainer + % Rev Share'
    ) {
      if (!data?.fee_structure?.[section]?.rev_share) {
        errorCount = 1;
      }
      if (!data?.fee_structure?.[section]?.monthly_retainer) {
        errorCount = 1;
      }
      if (
        !data?.fee_structure?.[section]?.rev_share &&
        !data?.fee_structure?.[section]?.monthly_retainer
      ) {
        errorCount = 2;
      }
    }

    if (section === 'seller') {
      setSectionError((prevErrors) => ({
        ...prevErrors,
        seller: { feeType: errorCount },
      }));
    }

    if (section === 'vendor') {
      setSectionError((prevErrors) => ({
        ...prevErrors,
        vendor: { feeType: errorCount },
      }));
    }
  };

  const manageErrorCount = (type, data) => {
    if (type === 'Seller') {
      if (!(data && data?.fee_structure?.seller?.fee_type)) {
        setSectionError((prevErrors) => ({
          ...prevErrors,
          seller: { feeType: 1 },
          vendor: { feeType: 0 },
        }));
      } else {
        checkMandatoryFieldsOfFeeType(data, 'seller');
      }
    }

    if (type === 'Vendor') {
      let errorCountOfVBillingReport = 0;
      if (!(data && data?.fee_structure?.vendor?.vendor_billing_report)) {
        errorCountOfVBillingReport = 1;
      }
      let errorCountOfFeeType = 0;

      if (!(data && data?.fee_structure?.vendor?.fee_type)) {
        errorCountOfFeeType = 1;
      } else {
        checkMandatoryFieldsOfFeeType(data, 'vendor');
      }

      setSectionError((prevErrors) => ({
        ...prevErrors,
        vendor: {
          feeType: errorCountOfFeeType + errorCountOfVBillingReport,
        },
        seller: { feeType: 0 },
      }));
    }

    if (type === 'Hybrid') {
      let sellerErrorcount = 0;
      let vendorErrorcount = 0;

      if (!(data && data?.fee_structure?.seller?.fee_type)) {
        sellerErrorcount += 1;
        setSectionError((prevErrors) => ({
          ...prevErrors,
          seller: { feeType: sellerErrorcount },
        }));
      } else {
        checkMandatoryFieldsOfFeeType(data, 'seller');
      }

      if (!(data && data?.fee_structure?.vendor?.fee_type)) {
        vendorErrorcount += 1;

        setSectionError((prevErrors) => ({
          ...prevErrors,
          vendor: { feeType: vendorErrorcount },
        }));
      } else {
        checkMandatoryFieldsOfFeeType(data, 'vendor');
      }

      if (!(data && data?.fee_structure?.vendor?.vendor_billing_report)) {
        setSectionError((prevErrors) => ({
          ...prevErrors,
          vendor: {
            feeType:
              (prevErrors?.vendor?.feeType ? prevErrors?.vendor?.feeType : 0) +
              1,
          },
          seller: {
            feeType: prevErrors?.seller?.feeType
              ? prevErrors?.seller?.feeType
              : 0,
          },
        }));
      }
    }
  };

  const getFeeStructureDetails = (type) => {
    getFeeStructure(
      formData.id,
      type === 'Hybrid' ? ['Seller', 'Vendor'] : type,
    ).then((res) => {
      if (res?.status === 500) {
        const updatedData = {
          ...formData,
          seller_type: { value: type, label: type },
          fee_structure: {
            seller: {},
            vendor: {},
          },
        };
        setFormData({
          ...formData,
          seller_type: { value: type, label: type },
          fee_structure: {
            seller: {},
            vendor: {},
          },
        });

        manageErrorCount(type, updatedData);
      } else {
        const updatedData = {
          ...formData,
          seller_type: { value: type, label: type },
          fee_structure: {
            seller: res?.data?.seller || {},
            vendor: res?.data?.vendor || {},
          },
        };
        setFormData({
          ...formData,
          seller_type: { value: type, label: type },
          fee_structure: {
            seller: res?.data?.seller || {},
            vendor: res?.data?.vendor || {},
          },
        });

        manageErrorCount(type, updatedData);
      }
    });
  };

  const clearError = (event, key) => {
    if (event && event.value) {
      if (
        (key === 'seller_type' && !(formData && formData[key]?.value)) ||
        !(formData && formData[key])
      ) {
        setSectionError({
          ...sectionError,
          feeStructure: sectionError.feeStructure
            ? sectionError.feeStructure - 1
            : 0,
        });
      }
    }
  };

  const handleChange = (event, key) => {
    showFooter(true);
    if (key === 'primary_marketplace') {
      setAdditionalMarketplaces(
        marketPlacesOptions.filter((op) => op.value !== event.value),
      );
      setFormData({ ...formData, [key]: event?.value });
      setUpdatedFormData({
        ...updatedFormData,
        [key]: event?.value,
      });
    }
    if (key === 'seller_type') {
      if (
        formData?.fee_structure?.vendor?.vendor_same_as_seller &&
        formData.seller_type?.value !== 'Hybrid' &&
        event.value !== 'Hybrid'
      )
        setVendorSameAsSeller(false);

      setFormData({
        ...formData,
        seller_type: event?.value,
        vendor_same_as_seller: false,
      });
      getFeeStructureDetails(event.label);
      setUpdatedFormData({
        ...updatedFormData,
        seller_type: event?.value,
      });
      getMonthlyServices(event?.value);
    }
    clearError(event, key);
  };

  const generateDropdown = (item) => {
    return (
      <Select
        classNamePrefix={
          (!(formData && formData[item.key]) && item.isMandatory) ||
          (item.key === 'seller_type' &&
            !(formData && formData[item.key]?.value) &&
            item.isMandatory)
            ? 'react-select  form-control-error'
            : 'react-select'
        }
        styles={{
          control: (base, state) => ({
            ...base,
            background:
              (!(formData && formData[item.key]) && item.isMandatory) ||
              (item.key === 'seller_type' &&
                !(formData && formData[item.key]?.value) &&
                item.isMandatory)
                ? '#FBF2F2'
                : '#F4F6FC',
            // match with the menu
            // borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
            // Overwrittes the different states of border
            borderColor:
              (!(formData && formData[item.key]) && item.isMandatory) ||
              (item.key === 'seller_type' &&
                !(formData && formData[item.key]?.value) &&
                item.isMandatory)
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
        defaultValue={
          item.key === 'primary_marketplace'
            ? formData.primary_marketplace?.name
              ? {
                  value: formData.primary_marketplace.name,
                  label: formData.primary_marketplace.name,
                }
              : formData?.primary_marketplace
              ? {
                  value: formData.primary_marketplace,
                  label: formData.primary_marketplace,
                }
              : null
            : formData[item.key] && formData[item.key].label
            ? {
                value: formData[item.key].label,
                label: formData[item.key].value,
              }
            : null
        }
        options={
          item.key === 'primary_marketplace'
            ? marketPlacesOptions
            : accountTypeOptions
        }
        name={item.key}
        components={{ DropdownIndicator }}
        onChange={(event) => handleChange(event, item.key)}
      />
    );
  };
  const displayErrorCount = () => {
    if (formData?.seller_type?.value === 'Seller') {
      return sectionError.feeStructure + sectionError?.seller?.feeType;
    }
    if (formData?.seller_type?.value === 'Vendor') {
      return sectionError.feeStructure + sectionError?.vendor?.feeType;
    }
    if (formData?.seller_type?.value === 'Hybrid') {
      return (
        sectionError.feeStructure +
        sectionError?.seller?.feeType +
        sectionError?.vendor?.feeType
      );
    }
    return sectionError.feeStructure;
  };
  return (
    <>
      <div className="straight-line sidepanel " />
      <div
        className="collapse-btn "
        role="presentation"
        type="button"
        onClick={() => {
          executeScroll('statement');
          setOpenCollapse({
            feeStructure: !openCollapse.feeStructure,
          });
        }}>
        <img className="service-agre" src={Dollar} alt="pdf" />
        <h4
          className={
            displayErrorCount()
              ? 'sendar-details error-container'
              : 'sendar-details '
          }>
          Fee Structure
          {renderCollapseBtnErrorHtml(
            false,
            displayErrorCount(),
            openCollapse.feeStructure,
            'feeStructure',
          )}
        </h4>
        <div className="clear-fix" />
      </div>
      <Collapse isOpened={openCollapse.feeStructure}>
        {loader ? null : (
          <ul className="collapse-inner">
            <li>
              {feeStructureContainerDetails.map((item) => (
                <ContractInputSelect
                  className={item.key === 'seller_type' ? 'mt-3' : ''}
                  key={item.key}>
                  <label htmlFor={item.key}>{item.label}</label>
                  {generateDropdown(item)}
                </ContractInputSelect>
              ))}
            </li>
            <li>
              {formData?.seller_type?.label === 'Seller' ? (
                <SellerFeeStructure
                  setFormData={setFormData}
                  updatedFormData={updatedFormData}
                  setUpdatedFormData={setUpdatedFormData}
                  formData={formData}
                  DropdownIndicator={DropdownIndicator}
                  revShareOptions={revShareOptions}
                  section="seller"
                  showFooter={showFooter}
                  setSectionError={setSectionError}
                  sectionError={sectionError}
                  feeStructureErrors={feeStructureErrors}
                  setFeeStructureErrors={setFeeStructureErrors}
                  vendorSameAsSeller={vendorSameAsSeller}
                />
              ) : formData?.seller_type?.label === 'Vendor' ? (
                <VendorFeeStructure
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
                  feeStructureErrors={feeStructureErrors}
                  setFeeStructureErrors={setFeeStructureErrors}
                  vendorSameAsSeller={vendorSameAsSeller}
                  setVendorSameAsSeller={setVendorSameAsSeller}
                />
              ) : formData?.seller_type?.label === 'Hybrid' ? (
                <>
                  <SellerFeeStructure
                    setFormData={setFormData}
                    updatedFormData={updatedFormData}
                    setUpdatedFormData={setUpdatedFormData}
                    formData={formData}
                    DropdownIndicator={DropdownIndicator}
                    revShareOptions={revShareOptions}
                    section="seller"
                    showFooter={showFooter}
                    setSectionError={setSectionError}
                    sectionError={sectionError}
                    feeStructureErrors={feeStructureErrors}
                    setFeeStructureErrors={setFeeStructureErrors}
                    vendorSameAsSeller={vendorSameAsSeller}
                  />
                  <VendorFeeStructure
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
                    feeStructureErrors={feeStructureErrors}
                    setFeeStructureErrors={setFeeStructureErrors}
                    vendorSameAsSeller={vendorSameAsSeller}
                    setVendorSameAsSeller={setVendorSameAsSeller}
                  />
                </>
              ) : null}
            </li>

            <li>
              <Button
                className="btn-primary sidepanel btn-next-section mt-2 mb-3 w-100"
                disabled={!showRightTick('feeStructure')}
                onClick={() => nextStep('statement')}>
                Proceed to Next Section
              </Button>
            </li>
          </ul>
        )}
      </Collapse>
    </>
  );
}

FeeStructureContainer.defaultProps = {
  setOpenCollapse: () => {},
  executeScroll: () => {},
  nextStep: () => {},
  renderCollapseBtnErrorHtml: () => {},
  setUpdatedFormData: () => {},
  setFormData: () => {},
  setAdditionalMarketplaces: () => {},
  formData: {},
  updatedFormData: {},
  openCollapse: {},
  DropdownIndicator: {},
  marketPlacesOptions: {},
  revShareOptions: {},
  loader: false,
  showFooter: false,
  sectionError: {},
  setSectionError: () => {},
  feeStructureErrors: {},
  setFeeStructureErrors: () => {},
  getMonthlyServices: () => {},
  showRightTick: () => {},
};

FeeStructureContainer.propTypes = {
  executeScroll: func,
  setOpenCollapse: func,
  nextStep: func,
  renderCollapseBtnErrorHtml: func,
  formData: shape({
    seller_type: string,
    fee_type: string,
  }),
  openCollapse: shape({
    feeStructure: bool,
  }),
  loader: bool,
  showFooter: bool,
  DropdownIndicator: func,
  setUpdatedFormData: func,
  setFormData: func,
  updatedFormData: func,
  marketPlacesOptions: func,
  setAdditionalMarketplaces: func,
  revShareOptions: func,
  sectionError: shape({
    feeStructure: bool,
  }),
  setSectionError: func,
  feeStructureErrors: shape({}),
  setFeeStructureErrors: func,
  getMonthlyServices: func,
  showRightTick: func,
};
