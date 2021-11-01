import React, { useState } from 'react';

import { arrayOf, shape, string } from 'prop-types';
import { useHistory } from 'react-router-dom';

import PerformanceReport from './SellerReporting/PerformanceReport';
import AdPerformance from './AdPerformanceView/AdPerformance';
import VendorSalesPerformanceContainer from './VendorReporting/VendorSalesPerformanceContainer';

import { Tabs } from '../../../common';

export default function CompanyPerformance({
  marketplaceChoices,
  id,
  subViewComponent,
}) {
  const history = useHistory();
  const currentDate = new Date();
  const setTab =
    history.location.state === 'adManager'
      ? 'adPerformance'
      : 'salePerformance';
  currentDate.setDate(currentDate.getDate() - 3);
  const [sellerViewComponent, setSellerViewComponent] = useState(setTab);
  const [vendorViewComponent, setVendorViewComponent] = useState(
    'salePerformance',
  );

  const handleOnTabChange = (selectedTab) => {
    if (subViewComponent === 'seller') {
      setSellerViewComponent(selectedTab);
    } else {
      setVendorViewComponent(selectedTab);
    }
  };

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
            />
          )}
        </div>
      );
    }
    return (
      <div key={vendorViewComponent}>
        {vendorViewComponent === 'salePerformance' ? (
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

  const renderActiveTabClass = (selectedClass) => {
    let activeClass = '';
    if (subViewComponent === 'seller') {
      if (sellerViewComponent === selectedClass) {
        activeClass = 'active';
      }
    } else if (vendorViewComponent === selectedClass) {
      activeClass = 'active';
    }
    return activeClass;
  };

  return (
    <div className="col-lg-6 col-12" key={subViewComponent}>
      <Tabs className="mb-3">
        <ul className="tabs">
          <li
            className={renderActiveTabClass('salePerformance')}
            onClick={() => handleOnTabChange('salePerformance')}
            role="presentation">
            Sales Performance
          </li>
          <li
            className={renderActiveTabClass('adPerformance')}
            onClick={() => handleOnTabChange('adPerformance')}
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
};

CompanyPerformance.propTypes = {
  marketplaceChoices: arrayOf(shape({})),
  id: string,
  subViewComponent: string,
};
