import React from 'react';
import PropTypes from 'prop-types';
import { ArrowRightIcon } from '../../theme/images/index';
import {
  AgreementDetails,
  StatementDetails,
  DSPAddendumDetails,
  ListingOptimization,
  remainingFieldsOfContract,
} from '../../constants/FieldConstants';

function ServicesAmendment({ amendmentData }) {
  const allFields = [
    ...AgreementDetails,
    ...StatementDetails,
    ...DSPAddendumDetails,
    ...ListingOptimization,
    ...remainingFieldsOfContract,
  ];

  const displayValue = (value, type) => {
    if (type && type.includes('number')) {
      if (value === null) {
        return 'None';
      }
      return `$${
        value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }`;
    }
    return value === null ? 'None' : value;
  };

  const displayUpdatedFields = () => {
    if (
      amendmentData &&
      amendmentData.updated &&
      amendmentData.updated.length
    ) {
      return amendmentData.updated.map((item) => {
        const originalField = allFields.find((data) => data.key === item.label);
        return (
          <li>
            <div className="row w-100">
              <div className="col-12 mb-2">
                <div className="label">
                  {originalField && originalField.label
                    ? originalField.label
                    : item.label}
                </div>
              </div>

              <div className="col-8 text-left mb-3">
                <span className=" new-basic-text text-delete ">
                  {' '}
                  {displayValue(item.old, originalField && originalField.type)}
                </span>
                <span>
                  <img
                    className="next-arrow"
                    src={ArrowRightIcon}
                    alt="arrow"
                  />{' '}
                </span>
                <span className=" new-basic-text">
                  {displayValue(item.new, originalField && originalField.type)}
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
              <p
                className={
                  item.status === 'removed'
                    ? '  basic-text text-delete  '
                    : ' basic-text '
                }>
                {item.label}
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
    return !(
      amendmentData &&
      amendmentData.monthly_services &&
      amendmentData.monthly_services.length
    ) &&
      !(
        amendmentData &&
        amendmentData.additional_marketplaces &&
        amendmentData.additional_marketplaces.length
      ) &&
      !(
        amendmentData &&
        amendmentData.addendum &&
        amendmentData.addendum.status
      ) &&
      !(
        amendmentData &&
        amendmentData.updated &&
        amendmentData.updated.length
      ) ? (
      <div className="text-center mt-3">No data found</div>
    ) : (
      <div className="amendments-section">
        <ul className="menu">
          {displayUpdatedFields()}

          <li>
            <div className="row w-100">
              {amendmentData &&
              amendmentData.monthly_services &&
              amendmentData.monthly_services.length ? (
                <>
                  <div className="col-12 mb-2">
                    <div className="label">Monthly Services</div>
                  </div>
                  {displayAdditionalService('monthly_services')}
                </>
              ) : (
                ''
              )}
              {amendmentData &&
              amendmentData.additional_marketplaces &&
              amendmentData.additional_marketplaces.length ? (
                <>
                  <div className="col-8 text-left mb-3">
                    <p className=" basic-text ">Additional Marketplaces</p>
                  </div>
                  {displayAdditionalService('additional_marketplaces')}
                </>
              ) : (
                ''
              )}

              {amendmentData &&
              amendmentData.addendum &&
              amendmentData.addendum.status ? (
                <>
                  <div className="col-8 text-left mb-3 mt-3">
                    <div className="label">Addendum</div>
                  </div>
                  <div className="col-4 mb-3 mt-3">
                    <div className="added-remove-text">
                      {amendmentData &&
                      amendmentData.addendum &&
                      amendmentData.addendum.status === 'added'
                        ? 'Added'
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
  amendmentData: PropTypes.shape({
    addendum: PropTypes.arrayOf(PropTypes.object),
    additional_marketplaces: PropTypes.arrayOf(PropTypes.object),
    monthly_services: PropTypes.arrayOf(PropTypes.object),
    updated: PropTypes.arrayOf(PropTypes.object),
  }),
};
