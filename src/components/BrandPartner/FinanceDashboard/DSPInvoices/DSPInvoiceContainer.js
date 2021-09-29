import React, { useState } from 'react';

import { string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import DSPInvoicesList from './DSPInvoicesList';
import DSPPartnersList from './DSPPartnersList';
import DSPInvoices from './DSPInvoices';
import { BackToTop, Tabs } from '../../../../common';

export default function DSPInvoiceContainer({ selectedNavigation }) {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const [viewComponent, setViewComponent] = useState('invoices');
  const currentDate = new Date();
  const [timeFrame, setTimeFrame] = useState({
    startDate: `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`,
    endDate: `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`,
  });
  const [timeFrameType, setTimeFrameType] = useState('allTime');
  const [isTimeFrameChange, setIsTimeFrameChange] = useState(false);

  const onTabClick = (selectedTab) => {
    setViewComponent(selectedTab);
  };
  console.log('conatnier', selectedNavigation);
  return (
    <>
      <DSPInvoices
        setTimeFrame={setTimeFrame}
        setTimeFrameType={setTimeFrameType}
        setIsTimeFrameChange={setIsTimeFrameChange}
        selectedNavigation={selectedNavigation}
      />
      {!isDesktop && (
        <Tabs>
          <ul className="tabs">
            <li
              className={viewComponent === 'invoices' ? 'active' : ''}
              onClick={() => onTabClick('invoices')}
              role="presentation">
              Invoices
            </li>

            <li
              className={viewComponent === 'partners' ? 'active' : ''}
              onClick={() => onTabClick('partners')}
              role="presentation">
              Partners
            </li>
          </ul>
        </Tabs>
      )}

      <div className="row mt-3">
        {viewComponent === 'invoices' ? (
          <DSPInvoicesList
            viewComponent={viewComponent}
            onTabClick={onTabClick}
            timeFrame={timeFrame}
            timeFrameType={timeFrameType}
            isTimeFrameChange={isTimeFrameChange}
            setIsTimeFrameChange={setIsTimeFrameChange}
            isDesktop={isDesktop}
            isTablet={isTablet}
            selectedNavigation={selectedNavigation}
          />
        ) : (
          <DSPPartnersList
            viewComponent={viewComponent}
            onTabClick={onTabClick}
            timeFrame={timeFrame}
            timeFrameType={timeFrameType}
            isTimeFrameChange={isTimeFrameChange}
            setIsTimeFrameChange={setIsTimeFrameChange}
            isDesktop={isDesktop}
            isTablet={isTablet}
            selectedNavigation={selectedNavigation}
          />
        )}
        <div className="col-12 mt-5">
          <BackToTop />
        </div>
      </div>
    </>
  );
}

DSPInvoiceContainer.defaultProps = {
  selectedNavigation: '',
};
DSPInvoiceContainer.propTypes = { selectedNavigation: string };
