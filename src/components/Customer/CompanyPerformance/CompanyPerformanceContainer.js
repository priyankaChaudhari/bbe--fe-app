/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import PerformanceReport from './PerformanceReport';
import AdPerformance from './AdPerformance';

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
        {/* <Tab className="mb-3">
          <ul className="tabs">
            <li
              className={viewComponent === 'salePerformance' ? 'active' : ''}
              onClick={() => setViewComponent('salePerformance')}
              role="presentation">
              Performance Report
            </li> */}
        {/* <li
              className={viewComponent === 'adPerformance' ? 'active' : ''}
              onClick={() => setViewComponent('adPerformance')}
              role="presentation">
              Ad Performance
            </li> */}
        {/* </ul>
        </Tab> */}
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

CompanyPerformance.propTypes = {
  id: PropTypes.string.isRequired,
};
