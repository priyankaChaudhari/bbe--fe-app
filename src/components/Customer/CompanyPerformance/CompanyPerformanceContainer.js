import React, { useState } from 'react';

import { arrayOf, shape, string } from 'prop-types';
import { useHistory } from 'react-router-dom';

import PerformanceReport from './SalesPerformanceView/PerformanceReport';
import AdPerformance from './AdPerformanceView/AdPerformance';

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
  const [viewComponent, setViewComponent] = useState(setTab);

  return (
    <>
      {subViewComponent === 'seller' ? (
        <div className="col-lg-6 col-12" key={subViewComponent}>
          {viewComponent === 'salePerformance' ? (
            <PerformanceReport
              marketplaceChoices={marketplaceChoices}
              id={id}
              viewComponent={viewComponent}
              setViewComponent={setViewComponent}
            />
          ) : (
            <AdPerformance
              marketplaceChoices={marketplaceChoices}
              id={id}
              viewComponent={viewComponent}
              setViewComponent={setViewComponent}
            />
          )}
        </div>
      ) : (
        <div className="col-lg-6 col-12" key={subViewComponent}>
          {/* <PerformanceReport
            marketplaceChoices={marketplaceChoices}
            id={id}
            viewComponent={viewComponent}
            setViewComponent={setViewComponent}
          /> */}
          <AdPerformance
            marketplaceChoices={marketplaceChoices}
            id={id}
            viewComponent={viewComponent}
            setViewComponent={setViewComponent}
          />
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
