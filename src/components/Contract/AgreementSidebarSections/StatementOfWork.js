import React from 'react';

import NumberFormat from 'react-number-format';
import { Collapse } from 'react-collapse';
import {
  string,
  bool,
  number,
  func,
  oneOfType,
  arrayOf,
  shape,
  object,
} from 'prop-types';

import AdditionalOneTimeServices from './AdditionalOneTimeServices';
import AdditionalMonthlyServices from './AdditionalMonthlyServices';
import RevenueShareThreshold from './RevenueShareThreshold';
import { StatementDetails, ListingOptimization } from '../../../constants';
import { StatementWork, PlusIcon, MinusIcon } from '../../../theme/images';
import { Button, InputFormField, ErrorMsg } from '../../../common';

function StatementOfWork({
  executeScroll,
  setOpenCollapse,
  openCollapse,
  statementErrCount,
  renderCollapseBtnErrorHtml,
  loader,
  generateHTML,
  displayError,
  apiError,
  thresholdTypeOptions,
  onThresholdTypeChange,
  selectedThreshold,
  formData,
  contractErrorSalesThreshold,
  contractError,
  handleChange,
  onAddDiscount,
  monthlyService,
  showRightTick,
  nextStep,
  showAdditionalMarketplace,
  setShowAdditionalMarketplace,
  showSection,
  yoyPercentageOptions,
  additionalMonthlySerError,
  oneTimeService,
  changeQuantity,
  additionalOnetimeSerError,
  setShowAmazonPlanDropdown,
  amazonService,
  showAmazonPlanDropdown,
  amazonStoreCustom,
  setAmazonStoreCustom,
  AmazonStoreOptions,
  showFooter,
  setContractError,
  setFormData,
  setUpdatedFormData,
  updatedFormData,
  additionalOnetimeServices,
  clearOneTimeQntyError,
  updateAdditionalOnetimeServicesSelectedData,
  DropdownIndicator,
}) {
  const contractType = formData?.contract_type;
  const additionalOneTimeServicesLength =
    formData?.additional_one_time_services?.length;

  const changeListOptimization = (key, flag) => {
    showFooter(true);
    let updatedData = 0;
    if (
      Object.keys(contractError).includes('content_optimization') ||
      Object.keys(contractError).includes('design_optimization')
    ) {
      setContractError({
        ...contractError,
        [key]: '',
      });
    }
    if (flag === 'minus') {
      if (formData && formData[key]) {
        updatedData = parseInt(formData[key], 10) - 1;
      } else {
        updatedData = 0;
      }
    }
    if (flag === 'plus') {
      if (formData && formData[key]) {
        if (parseInt(formData[key], 10) < 20) {
          updatedData = parseInt(formData[key], 10) + 1;
        }
      } else {
        updatedData = 1;
      }
    }
    setFormData({
      ...formData,
      [key]: updatedData,
    });
    setUpdatedFormData({
      ...updatedFormData,
      [key]: updatedData,
    });
  };

  const displayListingOptimizations = () => {
    return (
      <>
        <InputFormField className="mb-3">
          <label htmlFor="additional_one_time_services ">
            LISTING OPTIMIZATIONS (ASIN&rsquo;s PER MONTH)
          </label>
        </InputFormField>
        {ListingOptimization.map((field) => {
          return (
            <React.Fragment key={Math.random()}>
              <div className="row">
                <div className="col-7 mb-3">
                  <label htmlFor={field.label} className="listing-optimazation">
                    {field && field.label}
                  </label>
                </div>
                <div className="col-5 pl-0 text-end">
                  <button
                    type="button"
                    className="decrement"
                    onClick={() => changeListOptimization(field.key, 'minus')}>
                    <img className="minus-icon" src={MinusIcon} alt="" />
                  </button>

                  <NumberFormat
                    name={field.key}
                    className="form-control max-min-number"
                    value={(formData && formData[field.key]) || 0}
                    onChange={(event) =>
                      handleChange(event, 'listing_optimization')
                    }
                    isAllowed={(values) => {
                      const { formattedValue, floatValue } = values;
                      if (floatValue == null) {
                        return formattedValue === '';
                      }
                      return floatValue <= 20;
                    }}
                  />

                  <button
                    type="button"
                    className="increment"
                    disabled={
                      formData &&
                      formData[field.key] &&
                      parseInt(formData[field.key], 10) === 20
                    }
                    onClick={() => changeListOptimization(field.key, 'plus')}>
                    <img className="plus-icon" src={PlusIcon} alt="" />
                  </button>
                </div>
                <div className="col-12">
                  {contractError &&
                  contractError[field.key] &&
                  contractError[field.key][0] ? (
                    <ErrorMsg className="mb-3">
                      {contractError &&
                        contractError[field.key] &&
                        contractError[field.key][0]}
                    </ErrorMsg>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return contractType.toLowerCase().includes('one') ||
    contractType.toLowerCase().includes('dsp') ? null : (
    <>
      <div className="straight-line sidepanel " />
      <div
        className="collapse-btn"
        role="presentation"
        type="button"
        onClick={() => {
          executeScroll('statement');
          setOpenCollapse({ statement: !openCollapse.statement });
        }}>
        <img className="service-agre" src={StatementWork} alt="pdf" />

        <h4
          className={
            statementErrCount
              ? 'sendar-details error-container'
              : 'sendar-details '
          }>
          Statement of Work
          {renderCollapseBtnErrorHtml(
            false,
            statementErrCount,
            'openCollapse.statement',
            'statement',
          )}
        </h4>
        <div className="clear-fix" />
      </div>
      <Collapse isOpened={openCollapse.statement}>
        {loader ? null : (
          <>
            <ul className="collapse-inner">
              {StatementDetails.map((item) => (
                <React.Fragment key={item.key}>
                  <>
                    <li>
                      <InputFormField>
                        <label htmlFor={item.key}>{item.label}</label>
                        {generateHTML(item)}
                        {displayError(item)}
                        {item.key === 'primary_marketplace' &&
                        apiError?.non_field_errors &&
                        apiError.non_field_errors[0]
                          ? displayError('non_field_errors')
                          : ''}
                      </InputFormField>
                    </li>
                  </>
                </React.Fragment>
              ))}
              <RevenueShareThreshold
                thresholdTypeOptions={thresholdTypeOptions}
                selectedThreshold={selectedThreshold}
                formData={formData}
                onThresholdTypeChange={onThresholdTypeChange}
                contractErrorSalesThreshold={contractErrorSalesThreshold}
                handleChange={handleChange}
                displayError={displayError}
                contractError={contractError}
                yoyPercentageOptions={yoyPercentageOptions}
                DropdownIndicator={DropdownIndicator}
              />

              <li>{displayListingOptimizations()}</li>
              <AdditionalMonthlyServices
                onAddDiscount={onAddDiscount}
                formData={formData}
                monthlyService={monthlyService}
                handleChange={handleChange}
                setShowAdditionalMarketplace={setShowAdditionalMarketplace}
                showAdditionalMarketplace={showAdditionalMarketplace}
                generateHTML={generateHTML}
              />

              {!formData?.draft_from ? (
                <AdditionalOneTimeServices
                  onAddDiscount={onAddDiscount}
                  formData={formData}
                  additionalMonthlySerError={additionalMonthlySerError}
                  oneTimeService={oneTimeService}
                  handleChange={handleChange}
                  changeQuantity={changeQuantity}
                  additionalOnetimeSerError={additionalOnetimeSerError}
                  setShowAmazonPlanDropdown={setShowAmazonPlanDropdown}
                  amazonService={amazonService}
                  showAmazonPlanDropdown={showAmazonPlanDropdown}
                  AmazonStoreOptions={AmazonStoreOptions}
                  amazonStoreCustom={amazonStoreCustom}
                  displayError={displayError}
                  setAmazonStoreCustom={setAmazonStoreCustom}
                  showFooter={showFooter}
                  additionalOnetimeServices={additionalOnetimeServices}
                  clearOneTimeQntyError={clearOneTimeQntyError}
                  updateAdditionalOnetimeServicesSelectedData={
                    updateAdditionalOnetimeServicesSelectedData
                  }
                />
              ) : (
                // displayOneTimeServices()
                ''
              )}
              <li>
                <Button
                  className={
                    additionalOneTimeServicesLength &&
                    formData.additional_one_time_services.find(
                      (item) => item.name === 'Amazon Store Package',
                    )
                      ? 'btn-primary btn-next-section sidepanel  mt-1 mb-3 w-100 '
                      : 'btn-primary btn-next-section sidepanel mt-1 mb-3 w-100 '
                  }
                  disabled={
                    (formData?.additional_one_time_services?.length &&
                      formData.additional_one_time_services.find(
                        (item) => item.name === 'Amazon Store Package',
                      )) ||
                    !showRightTick('statement')
                  }
                  onClick={() =>
                    showSection && showSection.dspAddendum
                      ? nextStep('dspAddendum')
                      : nextStep('addendum')
                  }>
                  Proceed to Next Section
                </Button>
              </li>
            </ul>
          </>
        )}
      </Collapse>
    </>
  );
}

export default StatementOfWork;

StatementOfWork.defaultProps = {
  executeScroll: () => {},
  setOpenCollapse: () => {},
  openCollapse: {},
  statementErrCount: 0,
  renderCollapseBtnErrorHtml: () => {},
  loader: false,
  generateHTML: () => {},
  displayError: () => {},
  apiError: {},
  thresholdTypeOptions: [],
  onThresholdTypeChange: () => {},
  selectedThreshold: '',
  formData: {},
  contractErrorSalesThreshold: false,
  contractError: {},
  handleChange: () => {},
  onAddDiscount: () => {},
  monthlyService: [],
  showRightTick: () => {},
  nextStep: () => {},
  showAdditionalMarketplace: false,
  setShowAdditionalMarketplace: () => {},
  showSection: {},
  yoyPercentageOptions: [],
  additionalMonthlySerError: {},
  oneTimeService: [],
  changeQuantity: () => {},
  additionalOnetimeSerError: {},
  setShowAmazonPlanDropdown: () => {},
  amazonService: {},
  showAmazonPlanDropdown: false,
  amazonStoreCustom: bool,
  setAmazonStoreCustom: func,
  AmazonStoreOptions: [],
  showFooter: () => {},
  setContractError: () => {},
  setFormData: () => {},
  setUpdatedFormData: () => {},
  updatedFormData: {},
  additionalOnetimeServices: {},
  clearOneTimeQntyError: () => {},
  updateAdditionalOnetimeServicesSelectedData: () => {},
  DropdownIndicator: () => {},
};

StatementOfWork.propTypes = {
  executeScroll: func,
  setOpenCollapse: func,
  openCollapse: shape({
    agreement: bool,
    statement: bool,
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  statementErrCount: number,
  renderCollapseBtnErrorHtml: func,
  loader: bool,
  generateHTML: func,
  displayError: func,
  apiError: shape({
    non_field_errors: arrayOf(string),
  }),
  thresholdTypeOptions: arrayOf(shape({})),
  onThresholdTypeChange: func,
  selectedThreshold: string,
  formData: shape({
    threshold_type: string,
    additional_one_time_services: arrayOf(shape({})),
    additional_monthly_services: arrayOf(shape({})),
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
  }),
  contractErrorSalesThreshold: bool,
  contractError: shape({
    yoy_percentage: string,
  }),
  handleChange: func,
  onAddDiscount: func,
  monthlyService: arrayOf(shape({})),
  showRightTick: func,
  nextStep: func,
  showAdditionalMarketplace: bool,
  setShowAdditionalMarketplace: func,
  showSection: shape({
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  yoyPercentageOptions: arrayOf(shape({})),
  additionalMonthlySerError: oneOfType([string, object]),
  oneTimeService: arrayOf(shape({})),
  changeQuantity: func,
  additionalOnetimeSerError: shape({
    quantity: number,
    custom_amazon_store_price: number,
  }),
  setShowAmazonPlanDropdown: func,
  amazonService: shape({}),
  showAmazonPlanDropdown: bool,
  amazonStoreCustom: bool,
  setAmazonStoreCustom: func,
  AmazonStoreOptions: arrayOf(shape({})),
  showFooter: func,
  setContractError: func,
  setFormData: func,
  setUpdatedFormData: func,
  updatedFormData: shape({}),
  additionalOnetimeServices: shape({
    create: arrayOf(shape({})),
    delete: arrayOf(string, shape({})),
  }),
  clearOneTimeQntyError: func,
  updateAdditionalOnetimeServicesSelectedData: func,
  DropdownIndicator: func,
};
