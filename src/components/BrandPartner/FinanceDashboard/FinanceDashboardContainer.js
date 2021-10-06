import React, { useState } from 'react';

import DSPInvoiceContainer from './DSPInvoices/DSPInvoiceContainer';
import DSPBillingContainer from './DSPBilling/DSPBillingContainer';
import { Tabs } from '../../../common';
import { DashboardCard } from '../../../theme/Global';
import { financeNavigationOptions } from '../../../constants/DashboardConstants';

export default function FinanceDashboardContainer() {
  const [viewComponent, setViewComponent] = useState('dspInvoicing');

  const renderComponent = () => {
    switch (viewComponent) {
      case 'revShare':
        return (
          <DSPInvoiceContainer
            selectedNavigation={viewComponent}
            key={viewComponent}
          />
        );

      case 'dspInvoicing':
        return (
          <DSPInvoiceContainer
            selectedNavigation={viewComponent}
            key={viewComponent}
          />
        );

      case 'dspBilling':
        return <DSPBillingContainer />;

      default:
        return '';
    }
  };
  return (
    <DashboardCard>
      <div className="dashboard-container-body">
        <Tabs className="mb-3">
          <ul className="tabs">
            {financeNavigationOptions.map((navigation) => (
              <li
                key={navigation.key}
                className={viewComponent === navigation.key ? 'active' : ''}
                onClick={() => setViewComponent(navigation.key)}
                role="presentation">
                {navigation.value}
              </li>
            ))}
          </ul>
        </Tabs>

        {renderComponent(viewComponent)}
      </div>
    </DashboardCard>
  );
}

FinanceDashboardContainer.defaultProps = {};
FinanceDashboardContainer.propTypes = {};
