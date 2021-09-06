/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';

import { Tabs } from '../../../common';

import { DashboardCard } from '../../../theme/Global';
import FinanceInvoices from './FinanceInvoices';
import FinancePartners from './FinancePartners';
import FinanceDSP from './FinanceDSP';

export default function FinanceDashboardContainer() {
  const [viewComponent, setViewComponent] = useState('invoices');
  const currentDate = new Date();
  const [timeFrame, setTimeFrame] = useState({
    startDate: `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`,
    endDate: `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`,
  });
  const [timeFrameType, setTimeFrameType] = useState('allTime');
  const [isTimeFrameChange, setIsTimeFrameChange] = useState(false);

  return (
    <DashboardCard>
      <div className="dashboard-container-body">
        <FinanceDSP
          setTimeFrame={setTimeFrame}
          setTimeFrameType={setTimeFrameType}
          setIsTimeFrameChange={setIsTimeFrameChange}
        />
        <Tabs>
          <ul className="tabs">
            <li
              className={viewComponent === 'invoices' ? 'active' : ''}
              onClick={() => setViewComponent('invoices')}
              role="presentation">
              Invoices
            </li>

            <li
              className={viewComponent === 'partners' ? 'active' : ''}
              onClick={() => setViewComponent('partners')}
              role="presentation">
              Partners
            </li>
          </ul>
        </Tabs>
        <div className="row mt-3">
          {viewComponent === 'invoices' ? (
            <FinanceInvoices
              timeFrame={timeFrame}
              timeFrameType={timeFrameType}
              isTimeFrameChange={isTimeFrameChange}
              setIsTimeFrameChange={setIsTimeFrameChange}
            />
          ) : (
            <FinancePartners
              timeFrame={timeFrame}
              timeFrameType={timeFrameType}
              isTimeFrameChange={isTimeFrameChange}
              setIsTimeFrameChange={setIsTimeFrameChange}
            />
          )}
        </div>
      </div>
    </DashboardCard>
  );
}

FinanceDashboardContainer.defaultProps = {};
FinanceDashboardContainer.propTypes = {};
