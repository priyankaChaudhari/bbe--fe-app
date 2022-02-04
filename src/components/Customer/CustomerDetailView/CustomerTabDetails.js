import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { func, shape, string } from 'prop-types';
import { useHistory } from 'react-router-dom';

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
import { PATH_CUSTOMER_DETAILS } from '../../../constants';

export default function CustomerTabDetails({
  role,
  setViewComponent,
  viewComponent,
  customer,
  subViewComponent,
  setSubViewComponent,
}) {
  const history = useHistory();
  const customerAccountType = customer?.customer_account_type;
  const dispatch = useDispatch();
  const [isCollapseOpen, setIsCollapseOpen] = useState(
    viewComponent === 'performance',
  );

  const handleMenuOnclick = (selectedTab) => {
    history.push(PATH_CUSTOMER_DETAILS.replace(':id', customer?.id), 'Billing');
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
            handleMenuOnclick('dashboard');
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
              style={{ position: 'relative' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapseOpen(!isCollapseOpen);
              }}
              role="presentation">
              <img
                src={CaretUp}
                alt="caret"
                className="collapse-arrow-icon"
                style={{
                  transform: isCollapseOpen ? 'rotate(180deg)' : '',
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
                  customerAccountType === 'Vendor' ? 'disabled' : null
                }${subViewComponent === 'seller' ? ' active' : ''}`}>
                {' '}
                Seller Reporting
              </li>
              <li
                onClick={() => {
                  setSubViewComponent('vendor');
                }}
                role="presentation"
                className={`sub-category-details ${
                  customerAccountType === 'Seller' ? 'disabled' : null
                }${subViewComponent === 'vendor' ? ' active' : ''}`}>
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
          handleMenuOnclick('agreement');
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
                              handleMenuOnclick('product catalog');
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
            handleMenuOnclick('brand asset');
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
          handleMenuOnclick('company');
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
      <li onClick={() => handleMenuOnclick('billing')} role="presentation">
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
          handleMenuOnclick('activity');
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

CustomerTabDetails.defaultProps = {
  subViewComponent: '',
};

CustomerTabDetails.propTypes = {
  setViewComponent: func.isRequired,
  role: string.isRequired,
  viewComponent: string.isRequired,
  customer: shape({
    id: string,
  }).isRequired,
  subViewComponent: string,
  setSubViewComponent: func.isRequired,
};
