import React, { useState } from 'react';

import { arrayOf, shape, string } from 'prop-types';
import { useHistory } from 'react-router-dom';

import PerformanceReport from './SellerReporting/PerformanceReport';
import AdPerformance from './AdPerformanceView/AdPerformance';
import VendorSalesPerformanceContainer from './VendorReporting/VendorSalesPerformanceContainer';

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

  return (
    <>
      {subViewComponent === 'seller' ? (
        // seller section
        <div className="col-lg-6 col-12" key={subViewComponent}>
          {sellerViewComponent === 'salePerformance' ? (
            <PerformanceReport
              marketplaceChoices={marketplaceChoices}
              id={id}
              viewComponent={sellerViewComponent}
              setViewComponent={setSellerViewComponent}
            />
          ) : (
            <AdPerformance
              marketplaceChoices={marketplaceChoices}
              id={id}
              viewComponent={sellerViewComponent}
              setViewComponent={setSellerViewComponent}
            />
          )}
        </div>
      ) : (
        // vendor section
        <div className="col-lg-6 col-12" key={subViewComponent}>
          {vendorViewComponent === 'salePerformance' ? (
            <VendorSalesPerformanceContainer
              marketplaceChoices={marketplaceChoices}
              id={id}
              viewComponent={vendorViewComponent}
              setViewComponent={setVendorViewComponent}
            />
          ) : (
            <AdPerformance
              marketplaceChoices={marketplaceChoices}
              id={id}
              viewComponent={vendorViewComponent}
              setViewComponent={setVendorViewComponent}
              selectedUserType={subViewComponent}
            />
          )}
        </div>
      )}
    </>
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
