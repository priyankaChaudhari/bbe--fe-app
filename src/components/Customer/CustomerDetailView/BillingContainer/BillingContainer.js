import React, { useState } from 'react';

import { arrayOf, shape, string } from 'prop-types';

import Invoice from './Invoice/Invoice';
import BillingDetails from './BillingDetails/BillingDetails';
import { Tabs } from '../../../../common';
import {
  billingNavigationOptions,
  financeTabsOptions,
} from '../../../../constants';

const BillingContainer = ({
  id,
  userInfo,
  onBoardingId,
  customerStatus,
  redirectType,
  memberData,
}) => {
  const [viewComponent, setViewComponent] = useState(redirectType);
  const [loader, setLoader] = useState(false);

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
                key={item.key}
                className={
                  viewComponent === item.key
                    ? 'active'
                    : loader
                    ? 'disabled'
                    : ''
                }
                onClick={() => {
                  setViewComponent(item.key);
                }}
                role="presentation">
                {item.value}
              </li>
            );
          })}

          <li
            className={viewComponent === 'Billing' ? 'active' : ''}
            onClick={() => setViewComponent('Billing')}
            role="presentation">
            Billing Details
          </li>
        </ul>
      </Tabs>
      {billingNavigationOptions.includes(viewComponent) ? (
        <Invoice
          onLoading={onLoading}
          invoiceType={viewComponent}
          id={id}
          memberData={memberData}
        />
      ) : (
        <BillingDetails
          id={id}
          userInfo={userInfo}
          onBoardingId={onBoardingId}
          customerStatus={customerStatus}
        />
      )}
    </div>
  );
};

export default BillingContainer;

BillingContainer.defaultProps = {
  onBoardingId: null,
  customerStatus: {},
  redirectType: 'retainer',
  memberData: [],
};

BillingContainer.propTypes = {
  id: string.isRequired,
  userInfo: shape({
    customer_onboarding: string,
  }).isRequired,
  onBoardingId: string,
  customerStatus: shape({}),
  redirectType: string,
  memberData: arrayOf(shape({})),
};
