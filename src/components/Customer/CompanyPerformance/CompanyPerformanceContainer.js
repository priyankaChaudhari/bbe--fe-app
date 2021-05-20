/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import PerformanceReport from './PerformanceReport';
import AdPerformance from './AdPerformance';
import Theme from '../../../theme/Theme';

export default function CompanyPerformance({ marketplaceChoices, id }) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  const [viewComponent, setViewComponent] = useState('salePerformance');

  return (
    <>
      <div className="col-lg-8 col-12">
        <Tab className="mb-3">
          <ul className="tabs">
            <li
              className={viewComponent === 'salePerformance' ? 'active' : ''}
              onClick={() => setViewComponent('salePerformance')}
              role="presentation">
              Performance Report
            </li>
            {/* <li
              className={viewComponent === 'adPerformance' ? 'active' : ''}
              onClick={() => setViewComponent('adPerformance')}
              role="presentation">
              Ad Performance
            </li> */}
          </ul>
        </Tab>
        {viewComponent === 'salePerformance' ? (
          <PerformanceReport marketplaceChoices={marketplaceChoices} id={id} />
        ) : (
          <AdPerformance marketplaceChoices={marketplaceChoices} id={id} />
        )}
      </div>
    </>
  );
}

CompanyPerformance.propTypes = {
  id: PropTypes.string.isRequired,
};

const Tab = styled.div`
  .tabs {
    list-style-type: none;
    position: relative;
    text-align: left;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid ${Theme.gray11};

    li {
      display: inline-block;
      margin-right: 60px;
      padding-bottom: 15px;
      font-weight: normal;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-family: ${Theme.baseFontFamily};
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &.a {
        text-decoration: none;
      }

      &.active {
        padding-bottom: 16px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
  @media only screen and (max-width: 767px) {
    .tabs {
      li {
        font-size: 14px;
        margin-right: 25px;
      }
    }
  }
`;
