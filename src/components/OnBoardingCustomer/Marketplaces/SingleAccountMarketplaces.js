import React, { useState } from 'react';

import { shape, string, func, bool, arrayOf } from 'prop-types';

import { InputFormField, ErrorMsg, CheckBox } from '../../../common';

const SingleAccountMarketplaces = ({
  accountDetails,
  advertisingFields,
  mapSecondaryMarketplaceValues,
  setDefaultForSecondary,
  accountType,
  advertiseForMarketplace,
  apiError,
  mapApiErrors,
}) => {
  const [doesntAdvertise, setDoesntAdvertise] = useState(
    advertiseForMarketplace,
  );

  return (
    <>
      <h6 className="small-title mt-3">{accountDetails.name}</h6>
      {advertisingFields &&
        advertisingFields
          .filter((op) => op.section === 2)
          .map((item) => (
            <>
              <InputFormField className="mt-3" key={item.key}>
                <label htmlFor={item.label}>
                  {item.label}
                  <input
                    placeholder={`Enter ${item.label}`}
                    className="form-control"
                    onChange={(event) => {
                      setDefaultForSecondary(
                        item.key,
                        event.target.value,
                        accountType === 'Seller'
                          ? accountDetails.seller_marketplace.id
                          : accountDetails.vendor_marketplace.id,
                        accountType,
                        accountType === 'Seller'
                          ? accountDetails?.seller_marketplace?.[accountType]
                              ?.id
                          : accountDetails?.vendor_marketplace?.[accountType]
                              ?.id,
                      );
                    }}
                    defaultValue={mapSecondaryMarketplaceValues(
                      item.key,
                      accountType === 'Seller'
                        ? accountDetails.seller_marketplace.id
                        : accountDetails.vendor_marketplace.id,
                      accountType,
                    )}
                    readOnly={doesntAdvertise}
                    // readOnly={isChecked}
                  />
                </label>
                {Object.keys(apiError).length > 0 ? (
                  <>
                    <ErrorMsg>
                      {mapApiErrors(
                        item.key,
                        accountType === 'Seller'
                          ? accountDetails.seller_marketplace.id
                          : accountDetails.vendor_marketplace.id,
                        accountType,
                      )}
                    </ErrorMsg>
                  </>
                ) : null}
              </InputFormField>
            </>
          ))}
      <CheckBox className="mt-3 mb-4">
        <label
          className="check-container customer-pannel"
          htmlFor={accountDetails.name}>
          I do not advertise on this marketplace
          <input
            type="checkbox"
            id={accountDetails.name}
            name={accountDetails.name}
            onChange={() => {
              setDoesntAdvertise(!doesntAdvertise);
              setDefaultForSecondary(
                'doesnt_advertise',
                !doesntAdvertise,
                accountType === 'Seller'
                  ? accountDetails.seller_marketplace.id
                  : accountDetails.vendor_marketplace.id,
                accountType,
                accountType === 'Seller'
                  ? accountDetails?.seller_marketplace?.Seller?.id
                  : accountDetails?.vendor_marketplace?.Vendor?.id,
              );
            }}
            defaultChecked={mapSecondaryMarketplaceValues(
              'doesnt_advertise',
              accountType === 'Seller'
                ? accountDetails.seller_marketplace.id
                : accountDetails.vendor_marketplace.id,
              accountType,
            )}
          />
          <span className="checkmark" />
        </label>
      </CheckBox>
      <div className="straight-line horizontal-line  mt-3 " />
    </>
  );
};

SingleAccountMarketplaces.propTypes = {
  accountDetails: shape({}).isRequired,
  advertisingFields: arrayOf(shape).isRequired,
  mapSecondaryMarketplaceValues: func.isRequired,
  setDefaultForSecondary: func.isRequired,
  accountType: string.isRequired,
  advertiseForMarketplace: bool.isRequired,
  apiError: shape({}).isRequired,
  mapApiErrors: func.isRequired,
};

export default SingleAccountMarketplaces;
