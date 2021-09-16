import React, { useState } from 'react';
import { Tabs } from '../../../common';
import { DashboardCard } from '../../../theme/Global';
import DSPInvoiceContainer from './DSPInvoices/DSPInvoiceContainer';
import DSPBillingContainer from './DSPBilling/DSPBillingContainer';

export default function FinanceDashboardContainer() {
  const [viewComponent, setViewComponent] = useState('billing');
  return (
    <DashboardCard>
      <div className="dashboard-container-body">
        <Tabs className="mb-3">
          <ul className="tabs">
            <li
              className={viewComponent === 'invoices' ? 'active' : ''}
              onClick={() => setViewComponent('invoices')}
              role="presentation">
              DSP Invoicing
            </li>

            {/* <li
              className={viewComponent === 'billing' ? 'active' : ''}
              onClick={() => setViewComponent('billing')}
              role="presentation">
              DSP Billing
            </li> */}
          </ul>
        </Tabs>

        {viewComponent === 'invoices' ? (
          <DSPInvoiceContainer />
        ) : (
          <DSPBillingContainer />
        )}
      </div>
    </DashboardCard>
  );
}

FinanceDashboardContainer.defaultProps = {};
FinanceDashboardContainer.propTypes = {};
