/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
// import Select from 'react-select';

import PerformanceReport from './PerformanceReport';
import AdPerformance from './AdPerformance';
import Theme from '../../../theme/Theme';
import { WhiteCard } from '../../../common';

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
      <div className="col-lg-8 col-12">
        <Tab className="mb-3">
          <WhiteCard>
            <ul className="tabs">
              <li
                className={viewComponent === 'salePerformance' ? 'active' : ''}
                onClick={() => setViewComponent('salePerformance')}
                role="presentation">
                Sales Performance
              </li>
              <li
                className={viewComponent === 'adPerformance' ? 'active' : ''}
                onClick={() => setViewComponent('adPerformance')}
                role="presentation">
                Ad Performance
              </li>
            </ul>
          </WhiteCard>
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
  .view-data {
    margin-right: 60px;
    font-weight: normal;
    color: ${Theme.black};
    font-size: ${Theme.extraMedium};
    font-family: ${Theme.baseFontFamily};
  }

  @media only screen and (max-width: 767px) {
    .tabs {
      li {
        font-size: 14px;
        margin-right: 25px;
      }
    }
    .view-data {
     text-align: center;
    padding-bottom: 10px;
  }
`;
