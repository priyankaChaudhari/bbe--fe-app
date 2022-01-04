import React from 'react';

import Select from 'react-select';
import NumberFormat from 'react-number-format';
import { shape, func, string, bool } from 'prop-types';

import RevenueThreshold from './RevenueThreshold';
import { ContractInputSelect, InputFormField, ErrorMsg } from '../../../common';
import {
  feeTypeOptions,
  revShareAndRetainerDetails,
  revShareDetails,
} from '../../../constants';

export default function SellerFeeStructure({
  setFormData,
  updatedFormData,
  setUpdatedFormData,
  formData,
  DropdownIndicator,
  revShareOptions,
  section,
  vendorSameAsSeller,
  showFooter,
  setSectionError,
  sectionError,
  feeStructureErrors,
  setFeeStructureErrors,
}) {
  const checkMandatoryFieldsOfFeeType = (event) => {
    let errorCount = sectionError?.[section]?.feeType;
    if (event?.value === 'Retainer Only') {
      if (!(formData && formData?.fee_structure?.[section]?.monthly_retainer)) {
        errorCount = 1;
      } else {
        errorCount = 0;
      }
    }

    if (event?.value === 'Revenue Share Only') {
      if (!(formData && formData?.fee_structure?.[section]?.rev_share)) {
        errorCount = 1;
      } else {
        errorCount = 0;
      }
    }

    if (event?.value === 'Retainer + % Rev Share') {
      if (
        !(formData && formData?.fee_structure?.[section]?.monthly_retainer) &&
        !(formData && formData?.fee_structure?.[section]?.rev_share)
      ) {
        errorCount = 2;
      } else if (
        !(formData && formData?.fee_structure?.[section]?.monthly_retainer)
      ) {
        errorCount = 1;
      } else if (!(formData && formData?.fee_structure?.[section]?.rev_share)) {
        errorCount = 1;
      } else {
        errorCount = 0;
      }
    }

    if (
      section === 'vendor' &&
      !(formData && formData?.fee_structure?.vendor?.vendor_billing_report)
    ) {
      errorCount += 1;
    }

    if (formData && formData?.fee_structure?.vendor?.vendor_same_as_seller) {
      setSectionError({
        ...sectionError,
        [section]: { feeType: errorCount },
        vendor: {
          feeType: !(
            formData && formData?.fee_structure?.vendor?.vendor_billing_report
          )
            ? errorCount + 1
            : errorCount,
        },
      });
    } else {
      setSectionError({
        ...sectionError,
        [section]: { feeType: errorCount },
      });
    }
  };

  const clearErrorCount = (event, key) => {
    if (key === 'fee_type') {
      if (formData && formData?.fee_structure?.[section]?.[key]) {
        setSectionError({
          ...sectionError,
          [section]: {
            feeType: sectionError?.[section].feeType
              ? sectionError?.[section].feeType - 1
              : 0,
          },
        });
      }

      checkMandatoryFieldsOfFeeType(event);
    }

    if (key === 'rev_share') {
      if (!(formData && formData?.fee_structure?.[section]?.[key])) {
        if (
          formData &&
          formData?.fee_structure?.vendor?.vendor_same_as_seller
        ) {
          setSectionError({
            ...sectionError,
            [section]: {
              feeType: sectionError?.[section]?.feeType
                ? sectionError?.[section]?.feeType - 1
                : 0,
            },
            vendor: {
              feeType: !(
                formData &&
                formData?.fee_structure?.vendor?.vendor_billing_report
              )
                ? (sectionError?.[section]?.feeType
                    ? sectionError?.[section]?.feeType - 1
                    : 0) + 1
                : sectionError?.[section]?.feeType
                ? sectionError?.[section]?.feeType - 1
                : 0,
            },
          });
          setFeeStructureErrors((prevState) => ({
            ...prevState,
            seller: {
              ...feeStructureErrors?.[section],
              rev_share: '',
            },
            vendor: {
              ...feeStructureErrors?.[section],
              rev_share: '',
            },
          }));
        } else {
          setSectionError({
            ...sectionError,
            [section]: {
              feeType: sectionError?.[section]?.feeType
                ? sectionError?.[section]?.feeType - 1
                : 0,
            },
          });
          setFeeStructureErrors((prevState) => ({
            ...prevState,
            [section]: {
              ...feeStructureErrors?.[section],
              rev_share: '',
            },
          }));
        }
      }
    }
  };

  const clearMonthlyServiceError = (event, key) => {
    let errorCount = sectionError?.[section]?.feeType;
    if (event && event.value) {
      if (
        key === 'monthly_retainer' &&
        !(formData && formData?.fee_structure?.[section]?.[key])
      ) {
        errorCount -= 1;
      }
    } else if (
      key === 'monthly_retainer' &&
      formData &&
      formData?.fee_structure?.[section]?.[key]
    ) {
      errorCount += 1;
    }

    if (
      formData &&
      formData?.fee_structure?.vendor?.vendor_same_as_seller &&
      section === 'seller'
    ) {
      setSectionError({
        ...sectionError,
        [section]: { feeType: errorCount },
        vendor: {
          feeType: !(
            formData && formData?.fee_structure?.vendor?.vendor_billing_report
          )
            ? errorCount + 1
            : errorCount,
        },
      });

      setFeeStructureErrors((prevState) => ({
        ...prevState,
        seller: {
          ...feeStructureErrors?.[section],
          monthly_retainer: '',
        },
        vendor: {
          ...feeStructureErrors?.[section],
          monthly_retainer: '',
        },
      }));
    } else {
      setSectionError({
        ...sectionError,
        [section]: { feeType: errorCount },
      });
      setFeeStructureErrors((prevState) => ({
        ...prevState,
        [section]: {
          ...feeStructureErrors?.[section],
          monthly_retainer: '',
        },
      }));
    }
  };

  const validateBillingCap = (event, key) => {
    if (
      (key === 'billing_cap' || key === 'billing_minimum') &&
      formData?.fee_structure?.[section]?.fee_type === 'Revenue Share Only'
    ) {
      if (
        key === 'billing_cap' &&
        formData?.fee_structure?.[section]?.billing_minimum
      ) {
        if (
          parseInt(formData?.fee_structure?.[section]?.billing_minimum, 10) >
          parseInt(event.value, 10)
        ) {
          setFeeStructureErrors({
            ...feeStructureErrors,
            [section]: {
              ...feeStructureErrors?.[section],
              billing_cap: 'Billing CAP must be greater than Billing Minimum',
              billing_minimum: '',
            },
          });

          if (
            !feeStructureErrors?.[section]?.billing_cap &&
            !feeStructureErrors?.[section]?.billing_minimum
          ) {
            setSectionError((prevState) => ({
              ...prevState,
              [section]: { feeType: prevState?.[section]?.feeType + 1 },
            }));
          }
        } else {
          setFeeStructureErrors({
            ...feeStructureErrors,
            [section]: {
              ...feeStructureErrors?.[section],
              billing_cap: '',
              billing_minimum: '',
            },
          });

          if (
            feeStructureErrors?.[section]?.billing_cap ||
            feeStructureErrors?.[section]?.billing_minimum
          ) {
            setSectionError((prevState) => ({
              ...prevState,
              [section]: { feeType: prevState?.[section]?.feeType - 1 },
            }));
          }
        }
      }

      if (
        key === 'billing_minimum' &&
        formData?.fee_structure?.[section]?.billing_cap
      ) {
        if (
          parseInt(event.value, 10) >
          parseInt(formData?.fee_structure?.[section]?.billing_cap, 10)
        ) {
          setFeeStructureErrors({
            ...feeStructureErrors,
            [section]: {
              ...feeStructureErrors?.[section],
              billing_minimum: 'Billing Minimum must be less than Billing CAP',
              billing_cap: '',
            },
          });

          if (
            !feeStructureErrors?.[section]?.billing_minimum &&
            !feeStructureErrors?.[section]?.billing_cap
          ) {
            setSectionError((prevState) => ({
              ...prevState,
              [section]: { feeType: prevState?.[section]?.feeType + 1 },
            }));
          }
        } else {
          setFeeStructureErrors({
            ...feeStructureErrors,
            [section]: {
              ...feeStructureErrors?.[section],
              billing_cap: '',
              billing_minimum: '',
            },
          });

          if (
            feeStructureErrors?.[section]?.billing_cap ||
            feeStructureErrors?.[section]?.billing_minimum
          ) {
            setSectionError((prevState) => ({
              ...prevState,
              [section]: { feeType: prevState?.[section]?.feeType - 1 },
            }));
          }
        }
      }
    }
  };

  const handleChange = (event, key, type) => {
    showFooter(true);
    if (key === 'fee_type') {
      setFeeStructureErrors((prevState) => ({
        ...prevState,
        [section]: {},
      }));
    }

    if (key.includes('quarterly')) {
      setFormData({
        ...formData,
        fee_structure: {
          ...formData?.fee_structure,
          [section]: {
            ...formData?.fee_structure?.[section],
            quarterly_rev_share: {
              ...formData?.fee_structure?.[section].quarterly_rev_share,
              [key]: event.value,
            },
          },
        },
      });
      setUpdatedFormData({
        ...updatedFormData,
        fee_structure: {
          ...updatedFormData?.fee_structure,
          [section]: {
            ...updatedFormData?.fee_structure?.[section],
            quarterly_rev_share: {
              ...updatedFormData?.fee_structure?.[section]?.quarterly_rev_share,
              [key]: event.value,
            },
          },
        },
      });
    } else if (key.search(/\bmonth\b/) >= 0) {
      setFormData({
        ...formData,
        fee_structure: {
          ...formData?.fee_structure,
          [section]: {
            ...formData?.fee_structure?.[section],
            monthly_rev_share: {
              ...formData?.fee_structure?.[section]?.monthly_rev_share,
              [key]: event?.value,
            },
          },
        },
      });
      setUpdatedFormData({
        ...updatedFormData,
        fee_structure: {
          ...updatedFormData?.fee_structure,
          [section]: {
            ...updatedFormData?.fee_structure?.[section],
            monthly_rev_share: {
              ...updatedFormData?.fee_structure?.[section]?.monthly_rev_share,
              [key]: event?.value,
            },
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        fee_structure: {
          ...formData?.fee_structure,
          [section]: {
            ...formData?.fee_structure?.[section],
            [key]:
              type === 'choices' || type === 'numberformat'
                ? event?.value
                  ? event?.value
                  : null
                : event?.target?.value
                ? event?.target?.value
                : null,
          },
        },
      });

      setUpdatedFormData({
        ...updatedFormData,
        fee_structure: {
          ...updatedFormData?.fee_structure,
          [section]: {
            ...updatedFormData?.fee_structure?.[section],
            [key]:
              type === 'choices' || type === 'numberformat'
                ? event?.value
                  ? event?.value
                  : null
                : event?.target?.value
                ? event.target.value
                : null,
          },
        },
      });

      if (type === 'choices') {
        clearErrorCount(event, key, type);
      }
      if (type === 'numberformat') {
        clearMonthlyServiceError(event, key, type);
      }
    }

    if (
      (key === 'threshold_type' &&
        (feeStructureErrors?.[section]?.quarterly_rev_share ||
          feeStructureErrors?.[section]?.monthly_rev_share ||
          feeStructureErrors?.[section]?.sales_threshold)) ||
      (formData?.fee_structure?.[section]?.quarterly_rev_share &&
        Object.keys(formData?.fee_structure?.[section]?.quarterly_rev_share)
          .length === 3 &&
        event.value &&
        feeStructureErrors?.[section]?.quarterly_rev_share) ||
      (formData?.fee_structure?.[section]?.monthly_rev_share &&
        Object.keys(formData?.fee_structure?.[section]?.monthly_rev_share)
          .length === 11 &&
        event.value &&
        feeStructureErrors?.[section]?.monthly_rev_share) ||
      (feeStructureErrors?.[section]?.sales_threshold &&
        (formData?.fee_structure?.[section]?.sales_threshold || event.value))
    ) {
      if (
        formData &&
        formData?.fee_structure?.vendor?.vendor_same_as_seller &&
        formData?.seller_type?.value === 'Hybrid'
      ) {
        setSectionError({
          ...sectionError,
          seller: {
            feeType: sectionError?.seller?.feeType
              ? sectionError?.seller?.feeType - 1
              : 0,
          },
          vendor: {
            feeType: !(
              formData && formData?.fee_structure?.vendor?.vendor_billing_report
            )
              ? sectionError?.seller?.feeType - 1 + 1
              : sectionError?.seller?.feeType - 1,
          },
        });

        setFeeStructureErrors((prevState) => ({
          ...prevState,
          seller: {
            ...feeStructureErrors?.seller,
            quarterly_rev_share: '',
            billing_cap: '',
            monthly_rev_share: '',
            sales_threshold: '',
          },
          vendor: {
            ...feeStructureErrors?.vendor,
            quarterly_rev_share: '',
            billing_cap: '',
            monthly_rev_share: '',
            sales_threshold: '',
          },
        }));
      } else {
        setSectionError({
          ...sectionError,
          [section]: { feeType: sectionError?.[section]?.feeType - 1 },
        });

        setFeeStructureErrors((prevState) => ({
          ...prevState,
          [section]: {
            ...feeStructureErrors?.[section],
            quarterly_rev_share: '',
            billing_cap: '',
            monthly_rev_share: '',
            sales_threshold: '',
          },
        }));
      }
    }
    if (vendorSameAsSeller && formData?.seller_type?.value === 'Hybrid') {
      const vendorId = formData?.fee_structure?.vendor?.id;
      setFormData((prevState) => ({
        ...prevState,
        fee_structure: {
          ...prevState?.fee_structure,
          vendor: {
            ...prevState?.fee_structure?.seller,
            id: vendorId,
            vendor_billing_report:
              prevState?.fee_structure?.vendor?.vendor_billing_report,
          },
        },
      }));
      setUpdatedFormData((prevState) => ({
        ...prevState,
        fee_structure: {
          ...prevState?.fee_structure,
          vendor: prevState?.fee_structure?.seller,
        },
      }));
    }
    validateBillingCap(event, key);
  };

  const generateDropdown = (item) => {
    return (
      <Select
        classNamePrefix={
          !(formData && formData?.fee_structure?.[section]?.[item.key]) &&
          item.isMandatory
            ? 'react-select  form-control-error'
            : 'react-select'
        }
        styles={{
          control: (base, state) => ({
            ...base,
            zIndex: 9999,
            background:
              !(formData && formData?.fee_structure?.[section]?.[item.key]) &&
              item.isMandatory
                ? '#FBF2F2'
                : '#F4F6FC',
            // match with the menu
            // borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
            // Overwrittes the different states of border
            borderColor:
              !(formData && formData?.fee_structure?.[section]?.[item.key]) &&
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
          formData?.fee_structure?.[section]?.[item.key]
            ? {
                value: formData?.fee_structure?.[section]?.[item.key],
                label: formData?.fee_structure?.[section]?.[item.key],
              }
            : null
        }
        options={item.key === 'fee_type' ? feeTypeOptions : revShareOptions}
        name={item.key}
        components={{ DropdownIndicator }}
        onChange={(event) => handleChange(event, item.key, 'choices')}
      />
    );
  };

  const generateInput = (item) => {
    return (
      <input
        className={
          formData?.fee_structure?.[section]?.[item.key]
            ? 'form-control'
            : 'form-control form-control-error'
        }
        disabled={item.key === 'contract_type'}
        type="text"
        placeholder={item.placeholder || item.label}
        onChange={(event) => handleChange(event, item.key)}
        name={item.key}
        defaultValue={formData?.fee_structure?.[section]?.[item.key]}
      />
    );
  };

  const generateHTML = (item) => {
    if (item?.type?.includes('number')) {
      return (
        <>
          <NumberFormat
            className={
              (!(formData && formData?.fee_structure?.[section]?.[item.key]) &&
                item.isMandatory) ||
              (feeStructureErrors?.[section]?.quarterly_rev_share &&
                !formData?.fee_structure?.[section]?.quarterly_rev_share?.[
                  item.key
                ] &&
                item.fieldOf === 'threshold') ||
              (feeStructureErrors?.[section]?.monthly_rev_share &&
                !formData?.fee_structure?.[section]?.monthly_rev_share?.[
                  item.key
                ] &&
                item.fieldOf === 'threshold') ||
              (feeStructureErrors?.[section]?.sales_threshold &&
                !formData?.fee_structure?.[section]?.sales_threshold &&
                item.fieldOf === 'threshold') ||
              (item.key === 'billing_cap' &&
                feeStructureErrors?.[section]?.billing_cap) ||
              (item.key === 'billing_minimum' &&
                feeStructureErrors?.[section]?.billing_minimum)
                ? 'form-control  form-control-error'
                : 'form-control '
            }
            name={item.key}
            id={item.key}
            value={
              item.key.includes('quarterly')
                ? formData?.fee_structure?.[section]?.quarterly_rev_share?.[
                    item.key
                  ]
                : item.key.search(/\bmonth\b/) >= 0
                ? formData.fee_structure?.[section]?.monthly_rev_share?.[
                    item.key
                  ]
                : formData?.fee_structure?.[section]?.[item.key]
            }
            placeholder={item.placeholder || item.label}
            suffix={item.type === 'number-percent' ? '%' : ''}
            onValueChange={(event) =>
              handleChange(event, item.key, 'numberformat', item)
            }
            thousandSeparator
            decimalScale={2}
            isAllowed={(values) => {
              const { formattedValue, floatValue } = values;
              if (floatValue == null) {
                return formattedValue === '';
              }
              return floatValue <= 100000000;
            }}
            allowNegative={false}
          />
        </>
      );
    }
    if (item.type === 'choice') {
      return (
        <ContractInputSelect>{generateDropdown(item)}</ContractInputSelect>
      );
    }
    if (item.type === 'text') return <>{generateInput(item)}</>;
    return '';
  };

  return (
    <>
      {formData?.seller_type?.label === 'Hybrid' && section !== 'vendor' ? (
        <div className=" liner-titles spacing mt-2 mb-3">
          Seller Fee Structure
        </div>
      ) : (
        ''
      )}
      <ContractInputSelect
        className={
          section === 'vendor' &&
          formData?.seller_type?.label === 'Hybrid' &&
          (vendorSameAsSeller ||
            formData?.fee_structure?.vendor?.vendor_same_as_seller)
            ? '  disabled'
            : ''
        }>
        <label htmlFor="fee type">FEE TYPE</label>
        {generateDropdown({
          key: 'fee_type',
          label: 'Fee type',
          type: 'choice',
          placeholder: 'Select Fee Type',
          isMandatory: true,
        })}
        {formData?.fee_structure?.[section]?.fee_type === 'Retainer Only' ? (
          <InputFormField className="mt-3">
            <label htmlFor="Monthly Retainer">Monthly Retainer</label>
            <div className="input-container">
              <span className="input-icon">$ </span>
              {generateHTML({
                value: 'monthly_retainer',
                label: 'Monthly Retainer',
                key: 'monthly_retainer',
                type: 'number-currency',
                isMandatory: true,
                prefix: '$',
              })}
            </div>
            <ErrorMsg>
              {feeStructureErrors?.[section]?.monthly_retainer}
            </ErrorMsg>
          </InputFormField>
        ) : formData?.fee_structure?.[section]?.fee_type ===
          'Revenue Share Only' ? (
          <>
            {revShareDetails.map((field) => (
              <>
                <InputFormField className="mt-3" key={field.key}>
                  <label htmlFor={field.key}>{field.label}</label>
                  <div className="input-container">
                    {field.prefix ? (
                      <span className="input-icon">{field.prefix} </span>
                    ) : (
                      ''
                    )}
                    {generateHTML(field)}
                    {field.suffix ? (
                      <span className="input-icon end">{field.suffix} </span>
                    ) : (
                      ''
                    )}
                  </div>
                  <p style={{ color: '#556178' }} className="mt-1 mb-0">
                    {field.subtitle}
                  </p>
                </InputFormField>
                {field.key === 'billing_cap' ? (
                  <ErrorMsg>
                    {feeStructureErrors?.[section]?.billing_cap}
                  </ErrorMsg>
                ) : (
                  ''
                )}
                {field.key === 'billing_minimum' ? (
                  <ErrorMsg>
                    {feeStructureErrors?.[section]?.billing_minimum}
                  </ErrorMsg>
                ) : (
                  ''
                )}
                {field.key === 'rev_share' ? (
                  <ErrorMsg>
                    {feeStructureErrors?.[section]?.rev_share}
                  </ErrorMsg>
                ) : (
                  ''
                )}
              </>
            ))}
          </>
        ) : formData?.fee_structure?.[section]?.fee_type ===
          'Retainer + % Rev Share' ? (
          <>
            {revShareAndRetainerDetails.map((field) => (
              <>
                <InputFormField className="mt-3" key={field.key}>
                  <label htmlFor={field.key}>{field.label}</label>

                  {field.type === 'threshold' ? (
                    <RevenueThreshold
                      formData={formData}
                      handleChange={handleChange}
                      generateHTML={generateHTML}
                      setFormData={setFormData}
                      section={section}
                      feeStructureErrors={feeStructureErrors}
                    />
                  ) : (
                    <>
                      <div className="input-container">
                        {field.prefix ? (
                          <span className="input-icon ">{field.prefix} </span>
                        ) : (
                          ''
                        )}
                        {generateHTML(field)}
                        {field.suffix ? (
                          <span className="input-icon end">
                            {field.suffix}{' '}
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                    </>
                  )}

                  <p style={{ color: '#556178' }} className="mt-1 mb-0">
                    {field.subtitle}
                  </p>
                </InputFormField>

                {field.key === 'monthly_retainer' ? (
                  <ErrorMsg>
                    {feeStructureErrors?.[section]?.monthly_retainer}
                  </ErrorMsg>
                ) : (
                  ''
                )}
                {field.key === 'rev_share' ? (
                  <ErrorMsg>
                    {feeStructureErrors?.[section]?.rev_share}
                  </ErrorMsg>
                ) : (
                  ''
                )}
                {field.key === 'billing_cap' ? (
                  <ErrorMsg>
                    {feeStructureErrors?.[section]?.billing_cap}
                  </ErrorMsg>
                ) : (
                  ''
                )}
              </>
            ))}
          </>
        ) : (
          ''
        )}
      </ContractInputSelect>
    </>
  );
}

SellerFeeStructure.defaultProps = {
  setUpdatedFormData: () => {},
  setFormData: () => {},
  formData: {},
  updatedFormData: {},
  DropdownIndicator: {},
  revShareOptions: {},
  showFooter: () => {},
  setSectionError: () => {},
  sectionError: {},
  vendorSameAsSeller: false,
  feeStructureErrors: {},
  setFeeStructureErrors: () => {},
};

SellerFeeStructure.propTypes = {
  formData: shape({
    fee_structure: shape({}),
  }),
  DropdownIndicator: func,
  setUpdatedFormData: func,
  setFormData: func,
  updatedFormData: shape({}),
  revShareOptions: func,
  section: string.isRequired,
  vendorSameAsSeller: bool,
  showFooter: func,
  setSectionError: func,
  sectionError: shape({}),
  feeStructureErrors: shape({}),
  setFeeStructureErrors: func,
};
