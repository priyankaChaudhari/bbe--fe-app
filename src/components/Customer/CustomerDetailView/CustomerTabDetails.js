import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { func, shape, string } from 'prop-types';

import { setCustomerSelectedTab } from '../../../store/actions/customerState';
import {
  CatalogBox,
  FileContract,
  HeartMonitorIcon,
  Organization,
  BillingIcon,
  ExchangeIcon,
  CaretUp,
} from '../../../theme/images';

export default function CustomerTabDetails({
  role,
  setViewComponent,
  viewComponent,
  customer,
  subViewComponent,
  setSubViewComponent,
}) {
  const dispatch = useDispatch();
  const [isCollapseOpen, setIsCollapseOpen] = useState(
    viewComponent === 'performance',
  );

  const handleMenuOnclick = (selectedTab) => {
    setViewComponent(selectedTab);
    dispatch(setCustomerSelectedTab('performance'));
    if (selectedTab !== 'performance') {
      setIsCollapseOpen(false);
    } else if (isCollapseOpen === false) {
      setIsCollapseOpen(true);
    }
  };
  return (
    <ul className="left-details-card d-lg-block d-none">
      {role === 'Customer' ? (
        <li
          onClick={() => {
            setViewComponent('dashboard');
          }}
          role="presentation">
          <div
            className={`left-details ${
              viewComponent === 'dashboard' ? 'active' : ''
            }`}>
            <img
              className="file-contract"
              src={HeartMonitorIcon}
              alt="monitor"
            />
            Dashboard
          </div>
        </li>
      ) : (
        ''
      )}
      {role !== 'Customer' ? (
        <li
          onClick={() => {
            handleMenuOnclick('performance');
          }}
          role="presentation">
          <div
            className={`left-details ${
              viewComponent === 'performance' ? 'active' : ''
            }`}>
            <img
              className="file-contract"
              src={HeartMonitorIcon}
              alt="monitor"
            />
            Performance
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapseOpen(!isCollapseOpen);
              }}
              role="presentation">
              <img
                src={CaretUp}
                alt="caret"
                style={{
                  transform: isCollapseOpen ? 'rotate(180deg)' : '',
                  width: '25px',
                  height: '25px',
                }}
              />
            </div>
          </div>
          {isCollapseOpen ? (
            <ul className="sub-category">
              <li
                onClick={() => {
                  setSubViewComponent('seller');
                }}
                role="presentation"
                className={`sub-category-details ${
                  subViewComponent === 'seller' ? 'active' : ''
                }`}>
                {' '}
                Seller Reporting
              </li>
              <li
                onClick={() => {
                  setSubViewComponent('vendor');
                }}
                role="presentation"
                className={`sub-category-details ${
                  subViewComponent === 'vendor' ? 'active' : ''
                }`}>
                Vendor Reporting
              </li>
            </ul>
          ) : null}
        </li>
      ) : (
        ''
      )}
      <li
        onClick={() => {
          setViewComponent('agreement');
          dispatch(setCustomerSelectedTab('agreement'));
        }}
        role="presentation">
        <div
          className={`left-details ${
            viewComponent === 'agreement' ? 'active' : ''
          }`}>
          <img className="file-contract" src={FileContract} alt="" />
          Agreements
        </div>
      </li>

      {/* waiting for MWS token */}

      {/* {role === 'Customer' ? (
                          ''
                        ) : (
                          <li
                            onClick={() => {
                              setViewComponent('product catalog');
                              dispatch(
                                setCustomerSelectedTab('product catalog'),
                              );
                            }}
                            role="presentation">
                            <div
                              className={`left-details ${
                                viewComponent === 'product catalog'
                                  ? 'active'
                                  : ''
                              }`}>
                              <img
                                className="file-contract"
                                src={CatalogBox}
                                alt=""
                              />
                              Product Catalog
                            </div>
                          </li>
                        )} */}
      {customer &&
      customer.brand_assets &&
      customer.brand_assets.is_completed ? (
        <li
          onClick={() => {
            setViewComponent('brand asset');
            // dispatch(setCustomerSelectedTab('brand asset'));
          }}
          role="presentation">
          <div
            className={`left-details ${
              viewComponent === 'brand asset' ? 'active' : ''
            }`}>
            <img className="file-contract" src={CatalogBox} alt="" />
            Brand Assets
          </div>
        </li>
      ) : (
        ''
      )}

      <li
        onClick={() => {
          setViewComponent('company');
          dispatch(setCustomerSelectedTab('company'));
        }}
        role="presentation">
        <div
          className={`left-details ${
            viewComponent === 'company' ? 'active' : ''
          }`}>
          <img src={Organization} alt="" />
          Company Details
        </div>
      </li>
      <li onClick={() => setViewComponent('billing')} role="presentation">
        <div
          className={`left-details ${
            viewComponent === 'billing' ? 'active' : ''
          }`}>
          <img src={BillingIcon} alt="dollar-invoice" />
          Billing
        </div>
      </li>
      <li
        onClick={() => {
          setViewComponent('activity');
          dispatch(setCustomerSelectedTab('activity'));
        }}
        role="presentation">
        <div
          className={`left-details ${
            viewComponent === 'activity' ? 'active' : ''
          }`}>
          <img src={ExchangeIcon} alt="" />
          Activity
        </div>
      </li>
    </ul>
  );
}

CustomerTabDetails.propTypes = {
  setViewComponent: func.isRequired,
  role: string.isRequired,
  viewComponent: string.isRequired,
  customer: shape({
    id: string,
  }).isRequired,
  subViewComponent: string.isRequired,
  setSubViewComponent: func.isRequired,
};
