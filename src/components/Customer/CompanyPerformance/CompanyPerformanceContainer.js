import React, { useState } from 'react';

import { arrayOf, shape, string, func } from 'prop-types';
import { useHistory } from 'react-router-dom';

import PerformanceReport from './SellerReporting/PerformanceReport';
import AdPerformance from './AdPerformanceView/AdPerformance';
import VendorSalesPerformanceContainer from './VendorReporting/VendorSalesPerformanceContainer';

import { Tabs } from '../../../common';

export default function CompanyPerformance({
  marketplaceChoices,
  id,
  subViewComponent,
  memberData,
  getActivityLogInfo,
}) {
  const history = useHistory();
  const currentDate = new Date();
  const setTab =
    history.location.state === 'adManager' ? 'adPerformance' : 'adPerformance';
  currentDate.setDate(currentDate.getDate() - 3);
  const [sellerViewComponent, setSellerViewComponent] = useState(setTab);

  const renderViewComponents = () => {
    if (subViewComponent === 'seller') {
      return (
        <div key={sellerViewComponent}>
          {sellerViewComponent === 'salePerformance' ? (
            <PerformanceReport
              marketplaceChoices={marketplaceChoices}
              id={id}
            />
          ) : (
            <AdPerformance
              marketplaceChoices={marketplaceChoices}
              id={id}
              accountType={subViewComponent}
              memberData={memberData}
              getActivityLogInfo={getActivityLogInfo}
            />
          )}
        </div>
      );
    }
    return (
      <div key={sellerViewComponent}>
        {sellerViewComponent === 'salePerformance' ? (
          <VendorSalesPerformanceContainer
            marketplaceChoices={marketplaceChoices}
            id={id}
          />
        ) : (
          <AdPerformance
            marketplaceChoices={marketplaceChoices}
            id={id}
            accountType={subViewComponent}
          />
        )}
      </div>
    );
  };

  return (
    <div className="col-lg-6 col-12" key={subViewComponent}>
      <Tabs className="mb-3">
        <ul className="tabs">
          <li
            className={
              sellerViewComponent === 'salePerformance' ? 'active' : ''
            }
            onClick={() => setSellerViewComponent('salePerformance')}
            role="presentation">
            Sales Performance
          </li>
          <li
            className={sellerViewComponent === 'adPerformance' ? 'active' : ''}
            onClick={() => setSellerViewComponent('adPerformance')}
            role="presentation">
            Ad Performance
          </li>
        </ul>
      </Tabs>

      {renderViewComponents()}
    </div>
  );
}

CompanyPerformance.defaultProps = {
  marketplaceChoices: [],
  id: '',
  subViewComponent: 'seller',
  memberData: [],
  getActivityLogInfo: () => {},
};

CompanyPerformance.propTypes = {
  marketplaceChoices: arrayOf(shape({})),
  id: string,
  subViewComponent: string,
  memberData: arrayOf(shape({})),
  getActivityLogInfo: func,
};
