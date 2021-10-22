import React, { useState, useEffect } from 'react';

import { shape, string } from 'prop-types';

import Invoice from './Invoice/Invoice';
import BillingDetails from './BillingDetails/BillingDetails';
import { Tabs } from '../../../../common';

const BillingContainer = ({
  id,
  userInfo,
  onBoardingId,
  customerStatus,
  redirectType,
}) => {
  const [viewComponent, setViewComponent] = useState('rev share');

  useEffect(() => {
    if (redirectType === 'dspInvoicing') {
      setViewComponent('dsp service');
    } else {
      setViewComponent('rev share');
    }
  }, [redirectType]);

  return (
    <div className="col-lg-6 col-12">
      <Tabs>
        <ul className="tabs">
          <li
            className={viewComponent === 'rev share' ? 'active' : ''}
            onClick={() => setViewComponent('rev share')}
            role="presentation">
            Rev Share Invoices
          </li>
          <li
            className={viewComponent === 'upsell invoices' ? 'active' : ''}
            onClick={() => setViewComponent('upsell invoices')}
            role="presentation">
            Upsell Invoices
          </li>
          <li
            className={viewComponent === 'dsp service' ? 'active' : ''}
            onClick={() => setViewComponent('dsp service')}
            role="presentation">
            DSP Invoices
          </li>
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
      viewComponent === 'upsell invoices' ? (
        <Invoice invoiceType={viewComponent} id={id} userInfo={userInfo} />
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
  redirectType: null,
};

BillingContainer.propTypes = {
  id: string.isRequired,
  userInfo: shape({
    customer_onboarding: string,
  }).isRequired,
  onBoardingId: string,
  customerStatus: string,
  redirectType: string,
};
