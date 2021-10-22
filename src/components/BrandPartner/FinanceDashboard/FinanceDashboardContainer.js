import React, { useState } from 'react';

import InvoiceContainer from './Invoice/InvoiceContainer';
import DSPBillingContainer from './DSPBilling/DSPBillingContainer';
import { Tabs } from '../../../common';
import { DashboardCard } from '../../../theme/Global';
import { financeNavigationOptions } from '../../../constants';

export default function FinanceDashboardContainer() {
  const [viewComponent, setViewComponent] = useState('revShare');

  const renderComponent = () => {
    switch (viewComponent) {
      case 'revShare':
        return (
          <InvoiceContainer
            selectedNavigation={viewComponent}
            key={viewComponent}
          />
        );

      case 'dspInvoicing':
        return (
          <InvoiceContainer
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
