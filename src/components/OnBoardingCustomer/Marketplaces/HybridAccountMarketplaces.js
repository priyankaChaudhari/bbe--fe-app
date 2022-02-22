import React, { useState } from 'react';

import { Collapse } from 'react-collapse';
import { func, shape, bool } from 'prop-types';

import { InputFormField, ErrorMsg, CheckBox } from '../../../common';

import {
  OrangeCheckMark,
  ForwardOrangeIcon,
  ExternalLinkFileOrange,
  // GreyClockIcon,
} from '../../../theme/images';

const HybridAccountMarketplaces = ({
  accountDetails,
  advertisingFields,
  mapSecondaryMarketplaceValues,
  setDefaultForSecondary,
  sellerAdvertiseForMarketplace,
  vendorAdvertiseForMarketplace,
  apiError,
  mapApiErrors,
}) => {
  const [sellerDetailsCollapse, setSellerDetailsCollapse] = useState(false);
  const [vendorDetailsCollapse, setVendorDetailsCollapse] = useState(false);
  const [doesntSellerAdvertise, setDoesntSellerAdvertise] = useState(
    sellerAdvertiseForMarketplace,
  );
  const [doesntVendorAdvertise, setDoesntVendorAdvertise] = useState(
    vendorAdvertiseForMarketplace,
  );

  return (
    <>
      <fieldset className="shape-without-border mt-3">
        <div>
          {' '}
          <h6 className="small-title">{accountDetails.name}</h6>
          <ul className="amazon-merchant-collapse">
            {/* ---------Seller Central Details Collapse---------- */}
            {accountDetails?.seller_marketplace ? (
              <li className="mt-3">
                {' '}
                <div
                  onClick={() =>
                    setSellerDetailsCollapse(!sellerDetailsCollapse)
                  }
                  role="presentation">
                  <div className="row cursor">
                    <div className="col-10">
                      <div className="completed-status ">
                        <img
                          width="18px"
                          className="orange-check-collapse mr-2"
                          src={OrangeCheckMark}
                          alt="check"
                        />
                        Seller Central Details
                      </div>
                    </div>
                    <div className="col-2 text-right pr-2">
                      <img
                        width="18px"
                        className="orange-arrowdown-collapse mr-2"
                        src={ForwardOrangeIcon}
                        alt="check"
                        style={{
                          transform: sellerDetailsCollapse
                            ? 'rotate(270deg)'
                            : '',
                        }}
                      />
                    </div>
                    <div className="straight-line horizontal-line  mt-3  mx-3" />
                  </div>
                </div>
                <Collapse
                  isOpened={sellerDetailsCollapse}
                  theme={{ content: 'seller-collapse' }}>
                  <p className="normal-text-grey">
                    Navigate to Advertising &gt; Campaign Manager &gt; Access &
                    Settings and enter your <strong> Advertiser Name</strong>{' '}
                    and <strong>ID</strong> below.
                    <br />
                    <span className=" open-link cursor">
                      <a
                        href="https://sellercentral.amazon.com/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Open Seller Central
                        <img
                          className="ml-2 mt-2"
                          width="14px"
                          src={ExternalLinkFileOrange}
                          alt="external-link"
                        />
                      </a>
                    </span>
                  </p>
                  {advertisingFields &&
                    advertisingFields
                      .filter((op) => op.section === 2)
                      .map((item) => (
                        <>
                          <InputFormField className="mt-4" key={item.key}>
                            <label htmlFor={item.label}>
                              {item.label}
                              <input
                                placeholder={`Enter ${item.label}`}
                                className="form-control"
                                onChange={(event) => {
                                  setDefaultForSecondary(
                                    item.key,
                                    event.target.value,
                                    accountDetails.seller_marketplace.id,
                                    'Seller',
                                    accountDetails?.seller_marketplace?.Seller
                                      ?.id,
                                  );
                                }}
                                defaultValue={mapSecondaryMarketplaceValues(
                                  item.key,
                                  accountDetails.seller_marketplace.id,
                                  'Seller',
                                )}
                                readOnly={doesntSellerAdvertise}
                                // readOnly={isChecked}
                              />
                            </label>
                            {Object.keys(apiError).length > 0 ? (
                              <>
                                <ErrorMsg>
                                  {mapApiErrors(
                                    item.key,
                                    accountDetails.seller_marketplace.id,
                                    'Seller',
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
                      htmlFor={`seller${accountDetails.seller_marketplace.id}`}>
                      I do not advertise on this marketplace
                      <input
                        type="checkbox"
                        id={`seller${accountDetails.seller_marketplace.id}`}
                        name={`seller${accountDetails.seller_marketplace.id}`}
                        onChange={() => {
                          setDoesntSellerAdvertise(!doesntSellerAdvertise);
                          setDefaultForSecondary(
                            'doesnt_advertise',
                            !doesntSellerAdvertise,
                            accountDetails.seller_marketplace.id,
                            'Seller',
                            accountDetails?.seller_marketplace?.Seller?.id,
                          );
                        }}
                        defaultChecked={mapSecondaryMarketplaceValues(
                          'doesnt_advertise',
                          accountDetails.seller_marketplace.id,
                          'Seller',
                        )}
                      />
                      <span className="checkmark" />
                    </label>
                  </CheckBox>
                </Collapse>
              </li>
            ) : null}
            {/* <hr /> */}

            {/* ---------Vendor Central Details Collapse---------- */}
            {accountDetails?.vendor_marketplace ? (
              <li className="mt-3">
                {' '}
                <div
                  onClick={() =>
                    setVendorDetailsCollapse(!vendorDetailsCollapse)
                  }
                  role="presentation">
                  <div className="row cursor">
                    <div className="col-10">
                      <div className="completed-status ">
                        <img
                          width="18px"
                          className="orange-check-collapse mr-2"
                          src={OrangeCheckMark}
                          alt="check"
                        />
                        {/* <img
                        width="16px"
                        className="orange-check-collapse mr-2"
                        src={GreyClockIcon}
                        alt="check"
                      /> */}
                        Vendor Central Details
                      </div>
                    </div>
                    <div className="col-2 text-right pr-2">
                      <img
                        width="18px"
                        className="orange-arrowdown-collapse mr-2"
                        src={ForwardOrangeIcon}
                        alt="check"
                        style={{
                          transform: vendorDetailsCollapse
                            ? 'rotate(270deg)'
                            : '',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Collapse
                  isOpened={vendorDetailsCollapse}
                  theme={{ content: 'vendor-collapse' }}>
                  <p className="normal-text-grey">
                    Navigate to Advertising &gt; Campaign Manager &gt; Access &
                    Settings and enter your <strong> Advertiser Name</strong>{' '}
                    and <strong>ID</strong> below.
                    <br />
                    <span className=" open-link cursor">
                      <a
                        href="https://vendorcentral.amazon.com/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Open Vendor Central
                        <img
                          className="ml-2 mt-2"
                          width="14px"
                          src={ExternalLinkFileOrange}
                          alt="external-link"
                        />
                      </a>
                    </span>
                  </p>
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
                                    accountDetails.vendor_marketplace.id,
                                    'Vendor',
                                    accountDetails?.vendor_marketplace?.Vendor
                                      ?.id,
                                  );
                                }}
                                defaultValue={mapSecondaryMarketplaceValues(
                                  item.key,
                                  accountDetails.vendor_marketplace.id,
                                  'Vendor',
                                )}
                                readOnly={doesntVendorAdvertise}
                                // readOnly={isChecked}
                              />
                            </label>
                            {Object.keys(apiError).length > 0 ? (
                              <>
                                <ErrorMsg>
                                  {mapApiErrors(
                                    item.key,
                                    accountDetails.vendor_marketplace.id,
                                    'Vendor',
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
                      htmlFor={`vendor${accountDetails.vendor_marketplace.id}`}>
                      I do not advertise on this marketplace
                      <input
                        type="checkbox"
                        id={`vendor${accountDetails.vendor_marketplace.id}`}
                        name={`vendor${accountDetails.vendor_marketplace.id}`}
                        onChange={() => {
                          setDoesntVendorAdvertise(!doesntVendorAdvertise);
                          setDefaultForSecondary(
                            'doesnt_advertise',
                            !doesntVendorAdvertise,
                            accountDetails.vendor_marketplace.id,
                            'Vendor',
                            accountDetails?.vendor_marketplace?.Vendor?.id,
                          );
                        }}
                        defaultChecked={mapSecondaryMarketplaceValues(
                          'doesnt_advertise',
                          accountDetails.vendor_marketplace.id,
                          'Vendor',
                        )}
                      />
                      <span className="checkmark" />
                    </label>
                  </CheckBox>
                </Collapse>
              </li>
            ) : null}
          </ul>
        </div>
      </fieldset>
    </>
  );
};

HybridAccountMarketplaces.propTypes = {
  accountDetails: shape({}).isRequired,
  advertisingFields: shape({}).isRequired,
  mapSecondaryMarketplaceValues: func.isRequired,
  setDefaultForSecondary: func.isRequired,
  sellerAdvertiseForMarketplace: bool.isRequired,
  vendorAdvertiseForMarketplace: bool.isRequired,
  apiError: shape({}).isRequired,
  mapApiErrors: func.isRequired,
};

export default HybridAccountMarketplaces;
