import React from 'react';

import { arrayOf, shape } from 'prop-types';

import { ArrowRightIcon } from '../../theme/images';
import {
  AgreementDetails,
  StatementDetails,
  DSPAddendumDetails,
  ListingOptimization,
  remainingFieldsOfContract,
  accountTypeOptions,
  feeStructureContainerDetails,
  revShareDetails,
  revShareAndRetainerDetails,
  revShareAndRetainerQuarterDetails,
  revShareAndRetainerMonthDetails,
  quarterlyThresholdOptions,
  monthlyThresholdOptions,
  vendorReportOptions,
} from '../../constants';

function ServicesAmendment({ amendmentData }) {
  const allFields = [
    ...AgreementDetails,
    ...StatementDetails,
    ...DSPAddendumDetails,
    ...ListingOptimization,
    ...remainingFieldsOfContract,
    ...accountTypeOptions,
    ...feeStructureContainerDetails,
    ...revShareDetails,
    ...revShareAndRetainerDetails,
    ...revShareAndRetainerQuarterDetails,
    ...revShareAndRetainerMonthDetails,
    ...quarterlyThresholdOptions,
    ...monthlyThresholdOptions,
    ...vendorReportOptions,
  ];
  const amendmentDataUpdatedLength = amendmentData?.updated?.length;
  const amendmentDataAddendumStatus = amendmentData?.addendum?.status;
  const amendmentDataMonthlyServicesLength =
    amendmentData?.monthly_services?.length;
  const amendmentDataAdditionalMarketplacesLength =
    amendmentData?.additional_marketplaces?.length;

  const displayValue = (value, type) => {
    if (type && type.includes('number')) {
      if (value === null) {
        return 'None';
      }
      return `$${
        value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }`;
    }
    if (type === 'object') {
      if (value === null) {
        return 'None';
      }
      return JSON.stringify(value);
    }
    return value === null ? 'None' : value;
  };

  const displayUpdatedFields = () => {
    if (amendmentDataUpdatedLength) {
      return amendmentData.updated.map((item) => {
        const originalField = allFields.find(
          (data) => data?.key === item?.label,
        );
        return (
          <li>
            <div className="row w-100">
              <div className="col-12 mb-2">
                <div className="label">
                  {originalField && originalField.label
                    ? originalField.label
                    : item.label}{' '}
                  <span className="label">
                    {item?.account_type && item?.account_type === 'vendor'
                      ? '(Vendor)'
                      : '(Seller)'}
                  </span>
                </div>
              </div>

              <div className="col-8 text-left mb-3">
                <span className=" new-basic-text text-delete ">
                  {displayValue(
                    item?.old,
                    originalField && originalField?.type,
                  )}
                </span>
                <span>
                  <img
                    className="next-arrow"
                    src={ArrowRightIcon}
                    alt="arrow"
                  />
                </span>
                <span className=" new-basic-text">
                  {displayValue(
                    item?.new,
                    originalField && originalField?.type,
                  )}
                </span>
              </div>
              <div className="col-4 mb-3">
                <div className="added-remove-text">Updated</div>
              </div>
            </div>
          </li>
        );
      });
    }
    return null;
  };

  const displayAdditionalService = (key) => {
    return (
      amendmentData &&
      amendmentData[key] &&
      amendmentData[key].length &&
      amendmentData[key].map((item) => {
        return (
          <>
            <div className="col-8 text-left mb-3">
              <p className="m-0">
                <span
                  className={
                    item.status === 'removed'
                      ? '  basic-text text-delete  '
                      : ' basic-text '
                  }>
                  {item.label}
                </span>
                <span className="ml-1 basic-text">
                  {item?.account_type && item?.account_type === 'vendor'
                    ? '(Vendor)'
                    : '(Seller)'}
                </span>
              </p>
            </div>
            <div className="col-4 mb-3">
              <div className="added-remove-text">
                {item.status === 'added' ? 'Added' : 'Removed'}
              </div>
            </div>
          </>
        );
      })
    );
  };

  const displayAmendments = () => {
    return !amendmentDataMonthlyServicesLength &&
      !amendmentDataAdditionalMarketplacesLength &&
      !amendmentDataAddendumStatus &&
      !amendmentDataUpdatedLength ? (
      <div className="text-center mt-3">No data found</div>
    ) : (
      <div className="amendments-section">
        <ul className="menu">
          {displayUpdatedFields()}
          <li>
            <div className="row w-100">
              {amendmentDataMonthlyServicesLength ? (
                <>
                  <div className="col-12 mb-2">
                    <div className="label">Monthly Services</div>
                  </div>
                  {displayAdditionalService('monthly_services')}
                </>
              ) : (
                ''
              )}
              {amendmentDataAdditionalMarketplacesLength ? (
                <>
                  <div className="col-8 text-left mb-3">
                    <p className=" basic-text ">Additional Marketplaces</p>
                  </div>
                  {displayAdditionalService('additional_marketplaces')}
                </>
              ) : (
                ''
              )}
              {amendmentDataAddendumStatus ? (
                <>
                  <div className="col-8 text-left mb-3 mt-3">
                    <div className="label">Addendum</div>
                  </div>
                  <div className="col-4 mb-3 mt-3">
                    <div className="added-remove-text">
                      {amendmentDataAddendumStatus === 'added'
                        ? 'Added'
                        : amendmentDataAddendumStatus === 'removed'
                        ? 'Removed'
                        : 'Updated'}
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </li>
        </ul>
      </div>
    );
  };
  return <div>{displayAmendments()}</div>;
}

export default ServicesAmendment;

ServicesAmendment.defaultProps = {
  amendmentData: {},
};
ServicesAmendment.propTypes = {
  amendmentData: shape({
    addendum: arrayOf(shape({})),
    additional_marketplaces: arrayOf(shape({})),
    monthly_services: arrayOf(shape({})),
    updated: arrayOf(shape({})),
  }),
};
