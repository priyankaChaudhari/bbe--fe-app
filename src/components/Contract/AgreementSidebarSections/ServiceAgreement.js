import React from 'react';

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
  objectOf,
} from 'prop-types';

import AdditionalOneTimeServices from './AdditionalOneTimeServices';
import { AgreementDetails } from '../../../constants';
import { ServiceAgreementIcon } from '../../../theme/images';
import { Button, InputFormField } from '../../../common';

function ServiceAgreement({
  executeScroll,
  setOpenCollapse,
  openCollapse,
  agreementErrCount,
  statementErrCount,
  renderCollapseBtnErrorHtml,
  loader,
  generateHTML,
  displayError,
  showRightTick,
  formData,
  nextStep,
  onAddDiscount,
  additionalMonthlySerError,
  oneTimeService,
  handleChange,
  changeQuantity,
  additionalOnetimeSerError,
  setShowAmazonPlanDropdown,
  amazonService,
  showAmazonPlanDropdown,
  AmazonStoreOptions,
  amazonStoreCustom,
  setAmazonStoreCustom,
  showFooter,
  additionalOnetimeServices,
  clearOneTimeQntyError,
  updateAdditionalOnetimeServicesSelectedData,
  discountData,
  servicesFees,
}) {
  const contractType = formData?.contract_type;
  const additionalOneTimeServicesLength =
    formData?.additional_one_time_services?.length;

  return (
    <>
      <div
        className="collapse-btn "
        role="presentation"
        type="button"
        onClick={() => {
          executeScroll('agreement');
          setOpenCollapse({ agreement: !openCollapse.agreement });
        }}>
        <img className="service-agre" src={ServiceAgreementIcon} alt="pdf" />

        <h4
          className={
            agreementErrCount ||
            (statementErrCount && contractType?.toLowerCase()?.includes('one'))
              ? 'sendar-details error-container'
              : 'sendar-details'
          }>
          {contractType?.toLowerCase()?.includes('one') ? (
            <>
              One Time Service Agreement
              {renderCollapseBtnErrorHtml(
                'isOneTimeService',
                agreementErrCount || statementErrCount,
                openCollapse.agreement,
                'service_agreement',
              )}
            </>
          ) : (
            <>
              Service Agreement
              {renderCollapseBtnErrorHtml(
                false,
                agreementErrCount,
                openCollapse.agreement,
                'service_agreement',
              )}
            </>
          )}
        </h4>

        <div className="clear-fix" />
      </div>
      <Collapse isOpened={openCollapse.agreement}>
        {loader ? null : (
          <ul className="collapse-inner">
            {AgreementDetails.map((item) =>
              item.key !== 'contract_address' ? (
                <React.Fragment key={item.key}>
                  {item.key === 'length' &&
                  contractType === 'one time' ? null : (
                    <li>
                      <InputFormField>
                        <label htmlFor={item.key}>{item.label}</label>
                        {generateHTML(item)}
                        {displayError(item)}
                      </InputFormField>
                    </li>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment key={item.key}>
                  <li>
                    <InputFormField>
                      <label htmlFor={item.key}>{item.label}</label>
                      {item.sections.map((subFields) => (
                        <React.Fragment key={subFields.key}>
                          <label htmlFor={subFields.key}>
                            {generateHTML(subFields)}
                          </label>
                          {displayError(subFields)}
                        </React.Fragment>
                      ))}
                    </InputFormField>
                  </li>
                  {contractType?.toLowerCase()?.includes('one') &&
                  !formData?.draft_from ? (
                    <>
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
                        servicesFees={servicesFees}
                      />
                    </>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ),
            )}

            <li>
              <Button
                className="btn-primary sidepanel btn-next-section mt-2 mb-3 w-100"
                disabled={
                  !showRightTick('service_agreement') ||
                  (additionalOneTimeServicesLength &&
                    formData.additional_one_time_services.find(
                      (item) => item.name === 'Amazon Store Package',
                    ) &&
                    contractType?.toLowerCase()?.includes('one'))
                }
                onClick={() =>
                  nextStep(
                    contractType?.toLowerCase()?.includes('one')
                      ? 'addendum'
                      : contractType?.toLowerCase()?.includes('dsp')
                      ? 'dspAddendum'
                      : contractType?.toLowerCase()?.includes('recurring')
                      ? 'feeStructure'
                      : 'statement',
                  )
                }>
                Proceed to Next Section
              </Button>
            </li>
          </ul>
        )}
      </Collapse>
    </>
  );
}

export default ServiceAgreement;

ServiceAgreement.defaultProps = {
  executeScroll: () => {},
  setOpenCollapse: () => {},
  openCollapse: {},
  agreementErrCount: 0,
  statementErrCount: 0,
  renderCollapseBtnErrorHtml: () => {},
  loader: false,
  generateHTML: () => {},
  displayError: () => {},
  showRightTick: () => {},
  formData: {},
  nextStep: () => {},
  onAddDiscount: () => {},
  additionalMonthlySerError: {},
  oneTimeService: [],
  handleChange: () => {},
  changeQuantity: () => {},
  additionalOnetimeSerError: {},
  setShowAmazonPlanDropdown: () => {},
  amazonService: {},
  showAmazonPlanDropdown: false,
  AmazonStoreOptions: [],
  amazonStoreCustom: false,
  setAmazonStoreCustom: () => {},
  showFooter: () => {},
  additionalOnetimeServices: {},
  clearOneTimeQntyError: () => {},
  updateAdditionalOnetimeServicesSelectedData: () => {},
  discountData: [],
  servicesFees: [],
};

ServiceAgreement.propTypes = {
  executeScroll: func,
  setOpenCollapse: func,
  openCollapse: shape({
    agreement: bool,
    statement: bool,
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  agreementErrCount: number,
  statementErrCount: number,
  renderCollapseBtnErrorHtml: func,
  loader: bool,
  generateHTML: func,
  displayError: func,
  showRightTick: func,
  formData: shape({
    additional_one_time_services: arrayOf(shape({})),
    draft_from: oneOfType([string, objectOf(object)]),
  }),
  nextStep: func,
  onAddDiscount: func,
  additionalMonthlySerError: oneOfType([string, object]),
  oneTimeService: arrayOf(shape({})),
  handleChange: func,
  changeQuantity: func,
  additionalOnetimeSerError: shape({
    quantity: number,
    custom_amazon_store_price: number,
  }),
  setShowAmazonPlanDropdown: func,
  amazonService: shape({}),
  showAmazonPlanDropdown: bool,
  AmazonStoreOptions: arrayOf(shape({})),
  amazonStoreCustom: bool,
  setAmazonStoreCustom: func,
  showFooter: func,
  additionalOnetimeServices: shape({
    create: arrayOf(shape({})),
    delete: arrayOf(string, shape({})),
  }),
  clearOneTimeQntyError: func,
  updateAdditionalOnetimeServicesSelectedData: func,
  discountData: arrayOf(shape({})),
  servicesFees: arrayOf(shape({})),
};
