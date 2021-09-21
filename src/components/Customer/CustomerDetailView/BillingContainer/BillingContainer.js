import React, { useState } from 'react';

import { shape, string } from 'prop-types';

import { Tabs } from '../../../../common';
import DSPInvoices from './DSPInvoices/DSPInvoices';
import BillingDetails from './BillingDetails/BillingDetails';

const BillingContainer = ({ id, userInfo, onBoardingId, customerStatus }) => {
  const [viewComponent, setViewComponent] = useState('DSPInvoices');

  return (
    <div className="col-lg-6 col-12">
      <Tabs>
        <ul className="tabs">
          <li
            className={viewComponent === 'DSPInvoices' ? 'active' : ''}
            onClick={() => setViewComponent('DSPInvoices')}
            role="presentation">
            DSP Invoices
          </li>
          {customerStatus !== null && (
            <li
              className={viewComponent === 'Billing' ? 'active' : ''}
              onClick={() => setViewComponent('Billing')}
              role="presentation">
              Billing Details
            </li>
          )}
        </ul>
      </Tabs>
      {viewComponent === 'DSPInvoices' ? (
        <DSPInvoices id={id} userInfo={userInfo} />
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
};

BillingContainer.propTypes = {
  id: string.isRequired,
  userInfo: shape({
    customer_onboarding: string,
  }).isRequired,
  onBoardingId: string,
  customerStatus: string,
};
