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
import AdditionalMarketplaces from './AdditionalMarketplaces';
import { ListingOptimization } from '../../../constants';
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
  formData,
  contractError,
  handleChange,
  onAddDiscount,
  monthlyService,
  showRightTick,
  nextStep,
  showAdditionalMarketplace,
  setShowAdditionalMarketplace,
  showSection,
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
  setShowCollpase,
  originalData,
  additionalMonthlyServices,
  updateAdditionalMonthlyServices,
  setMonthlyAdditionalServices,
  fetchUncommonOptions,
  getOptions,
  additionalMarketplacesData,
  agreementData,
  setAdditionalMarketplaces,
  updateAdditionalMarketplaces,
  setAdditionalMarketplace,
  setMarketPlaces,
  marketplacesResult,
  discountData,
}) {
  const contractType = formData?.contract_type;
  const additionalOneTimeServicesLength =
    formData?.additional_one_time_services?.length;
  const accountType = formData?.seller_type?.value;

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
                    allowNegative={false}
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

  const displayAdditionalMonthlyServices = (type) => {
    return (
      <AdditionalMonthlyServices
        onAddDiscount={onAddDiscount}
        formData={formData}
        monthlyService={monthlyService[type]}
        handleChange={handleChange}
        setShowAdditionalMarketplace={setShowAdditionalMarketplace}
        showAdditionalMarketplace={showAdditionalMarketplace}
        generateHTML={generateHTML}
        accountType={type}
        showFooter={showFooter}
        setShowCollpase={setShowCollpase}
        showSection={showSection}
        originalData={originalData}
        additionalMonthlyServices={additionalMonthlyServices}
        setFormData={setFormData}
        updateAdditionalMonthlyServices={updateAdditionalMonthlyServices}
        setMonthlyAdditionalServices={setMonthlyAdditionalServices}
        fetchUncommonOptions={fetchUncommonOptions}
        getOptions={getOptions}
        discountData={discountData}
      />
    );
  };

  const getServicesAccordingToAccType = (data, option) => {
    const result = data && data.filter((item) => item.account_type === option);
    return result;
  };

  const getData = (data, option) => {
    const result = getServicesAccordingToAccType(data, option);
    const multi = [];
    if (result && result.length) {
      for (const month of result) {
        multi.push({
          label: month.name,
          value: month.name,
        });
      }
      return { [option]: multi };
    }
    return data;
  };

  return contractType?.toLowerCase()?.includes('one') ||
    contractType?.toLowerCase()?.includes('dsp') ? null : (
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
            openCollapse.statement,
            'statement',
          )}
        </h4>
        <div className="clear-fix" />
      </div>
      <Collapse isOpened={openCollapse.statement}>
        {loader ? null : (
          <>
            <ul className="collapse-inner">
              <li>{displayListingOptimizations()}</li>
              {accountType === 'Seller' || accountType === 'Vendor' ? (
                <li>
                  {displayAdditionalMonthlyServices(accountType)}{' '}
                  <AdditionalMarketplaces
                    formData={formData}
                    getOptions={getOptions}
                    accountType={accountType}
                    showFooter={showFooter}
                    additionalMarketplacesData={additionalMarketplacesData}
                    setFormData={setFormData}
                    agreementData={agreementData}
                    setAdditionalMarketplaces={setAdditionalMarketplaces}
                    originalData={originalData}
                    updateAdditionalMarketplaces={updateAdditionalMarketplaces}
                    setAdditionalMarketplace={setAdditionalMarketplace}
                    setMarketPlaces={setMarketPlaces}
                    marketplacesResult={marketplacesResult}
                    defaultData={getData(
                      formData?.additional_marketplaces,
                      accountType,
                    )}
                    setShowAdditionalMarketplace={setShowAdditionalMarketplace}
                    showAdditionalMarketplace={showAdditionalMarketplace}
                  />
                </li>
              ) : (
                ''
              )}
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
                  discountData={discountData}
                />
              ) : (
                // displayOneTimeServices()
                ''
              )}

              {accountType === 'Hybrid' ? (
                <>
                  <li className=" liner-titles spacing "> Seller Services</li>
                  <li>
                    {displayAdditionalMonthlyServices('Seller')}

                    <AdditionalMarketplaces
                      formData={formData}
                      getOptions={getOptions}
                      accountType="Seller"
                      showFooter={showFooter}
                      additionalMarketplacesData={additionalMarketplacesData}
                      setFormData={setFormData}
                      agreementData={agreementData}
                      setAdditionalMarketplaces={setAdditionalMarketplaces}
                      originalData={originalData}
                      updateAdditionalMarketplaces={
                        updateAdditionalMarketplaces
                      }
                      setAdditionalMarketplace={setAdditionalMarketplace}
                      setMarketPlaces={setMarketPlaces}
                      marketplacesResult={marketplacesResult}
                      defaultData={getData(
                        formData?.additional_marketplaces,
                        'Seller',
                      )}
                      setShowAdditionalMarketplace={
                        setShowAdditionalMarketplace
                      }
                      showAdditionalMarketplace={showAdditionalMarketplace}
                    />
                  </li>

                  <li className=" liner-titles spacing "> Vendor Services</li>
                  <li>
                    {displayAdditionalMonthlyServices('Vendor')}
                    <AdditionalMarketplaces
                      formData={formData}
                      getOptions={getOptions}
                      accountType="Vendor"
                      showFooter={showFooter}
                      additionalMarketplacesData={additionalMarketplacesData}
                      setFormData={setFormData}
                      agreementData={agreementData}
                      setAdditionalMarketplaces={setAdditionalMarketplaces}
                      originalData={originalData}
                      updateAdditionalMarketplaces={
                        updateAdditionalMarketplaces
                      }
                      setAdditionalMarketplace={setAdditionalMarketplace}
                      setMarketPlaces={setMarketPlaces}
                      marketplacesResult={marketplacesResult}
                      defaultData={getData(
                        formData?.additional_marketplaces,
                        'Vendor',
                      )}
                      setShowAdditionalMarketplace={
                        setShowAdditionalMarketplace
                      }
                      showAdditionalMarketplace={showAdditionalMarketplace}
                    />
                  </li>
                </>
              ) : (
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

  formData: {},
  contractError: {},
  handleChange: () => {},
  onAddDiscount: () => {},
  monthlyService: [],
  showRightTick: () => {},
  nextStep: () => {},
  showAdditionalMarketplace: false,
  setShowAdditionalMarketplace: () => {},
  showSection: {},
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
  setShowCollpase: () => {},
  originalData: {},
  additionalMonthlyServices: {},
  updateAdditionalMonthlyServices: () => {},
  setMonthlyAdditionalServices: () => {},
  fetchUncommonOptions: () => {},
  getOptions: () => {},
  additionalMarketplacesData: {},
  agreementData: {},
  setAdditionalMarketplaces: () => {},
  updateAdditionalMarketplaces: () => {},
  setAdditionalMarketplace: () => {},
  setMarketPlaces: () => {},
  marketplacesResult: [],
  discountData: [],
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

  formData: shape({
    threshold_type: string,
    additional_one_time_services: arrayOf(shape({})),
    additional_monthly_services: arrayOf(shape({})),
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
  }),
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
  setShowCollpase: func,
  originalData: {},
  additionalMonthlyServices: shape({}),
  updateAdditionalMonthlyServices: func,
  setMonthlyAdditionalServices: func,
  fetchUncommonOptions: func,
  getOptions: func,
  additionalMarketplacesData: shape({}),
  agreementData: {},
  setAdditionalMarketplaces: func,
  updateAdditionalMarketplaces: func,
  setAdditionalMarketplace: func,
  setMarketPlaces: func,
  marketplacesResult: arrayOf(shape({})),
  discountData: [],
};
