import React, { useState, useEffect } from 'react';

import { oneOfType, shape, string, object } from 'prop-types';

import Invoice from './Invoice/Invoice';
import BillingDetails from './BillingDetails/BillingDetails';
import { Tabs } from '../../../../common';
import {
  financeTabsOptions,
  billingNavigationOptions,
} from '../../../../constants';

const BillingContainer = ({
  id,
  userInfo,
  onBoardingId,
  customerStatus,
  redirectType,
}) => {
  const [viewComponent, setViewComponent] = useState(redirectType);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (redirectType in billingNavigationOptions) {
      setViewComponent(redirectType);
    } else {
      setViewComponent('Billing');
    }
  }, [redirectType]);

  const onLoading = (value) => {
    setLoader(value);
  };

  return (
    <div className="col-lg-6 col-12">
      <Tabs>
        <ul className="tabs">
          {financeTabsOptions.map((item) => {
            return (
              <li
                className={
                  viewComponent === item.key
                    ? 'active'
                    : loader
                    ? 'disabled'
                    : ''
                }
                key={item.key}
                onClick={() => {
                  setViewComponent(item.key);
                }}
                role="presentation">
                {item.value}
              </li>
            );
          })}

          {customerStatus && customerStatus.value !== 'pending' ? (
            <li
              className={viewComponent === 'Billing' ? 'active' : ''}
              onClick={() => setViewComponent('Billing')}
              role="presentation">
              Billing Details
            </li>
          ) : null}
        </ul>
      </Tabs>
      {viewComponent === 'dsp service' ||
      viewComponent === 'rev share' ||
      viewComponent === 'upsell' ||
      viewComponent === 'retainer' ? (
        <Invoice
          onLoading={onLoading}
          invoiceType={viewComponent}
          id={id}
          userInfo={userInfo}
        />
      ) : (
        <BillingDetails
          id={id}
          userInfo={userInfo}
          onBoardingId={onBoardingId}
        />
      )}
    </div>
  );
};

export default BillingContainer;

BillingContainer.defaultProps = {
  onBoardingId: null,
  customerStatus: null,
  redirectType: 'Billing',
};

BillingContainer.propTypes = {
  id: string.isRequired,
  userInfo: shape({
    customer_onboarding: string,
  }).isRequired,
  onBoardingId: string,
  customerStatus: oneOfType({
    string,
    object,
  }),
  redirectType: string,
};
