import React, { useState } from 'react';

import { arrayOf, shape, string } from 'prop-types';
import { useHistory } from 'react-router-dom';

import PerformanceReport from './SalesPerformanceView/PerformanceReport';
import AdPerformance from './AdPerformanceView/AdPerformance';

export default function CompanyPerformance({ marketplaceChoices, id }) {
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
      <div className="col-lg-6 col-12">
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
    </>
  );
}

CompanyPerformance.defaultProps = {
  marketplaceChoices: [],
  id: '',
};

CompanyPerformance.propTypes = {
  marketplaceChoices: arrayOf(shape({})),
  id: string,
};
