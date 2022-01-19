import React, { useState } from 'react';

import { shape, string } from 'prop-types';
import { useHistory } from 'react-router-dom';

import Invoice from './Invoice/Invoice';
import BillingDetails from './BillingDetails/BillingDetails';
import { Tabs } from '../../../../common';
import {
  billingNavigationOptions,
  financeTabsOptions,
  PATH_CUSTOMER_DETAILS,
} from '../../../../constants';

const BillingContainer = ({
  id,
  userInfo,
  onBoardingId,
  customerStatus,
  redirectType,
  bpName,
}) => {
  const history = useHistory();
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
                  history.push(
                    PATH_CUSTOMER_DETAILS.replace(':id', id),
                    item.key,
                  );
                  setViewComponent(item.key);
                }}
                role="presentation">
                {item.value}
              </li>
            );
          })}

          <li
            className={viewComponent === 'Billing' ? 'active' : ''}
            onClick={() => {
              history.push(PATH_CUSTOMER_DETAILS.replace(':id', id), 'Billing');
              setViewComponent('Billing');
            }}
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
          bpName={bpName}
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
  bpName: '',
};

BillingContainer.propTypes = {
  id: string.isRequired,
  userInfo: shape({
    customer_onboarding: string,
  }).isRequired,
  onBoardingId: string,
  customerStatus: shape({}),
  redirectType: string,
  bpName: string,
};
