import React from 'react';

import styled from 'styled-components';
import { arrayOf, bool, func, instanceOf, string } from 'prop-types';

import AdPerformanceChart from './AdPerformanceChart';
import SponsoredAdMetric from '../../../BrandPartner/AdManagerAdminDashboard/SponsoredDashboard/SponsoredAdMetrics';
import { DropDown } from '../DropDown';
import { WhiteCard, PageLoader, ToggleButton } from '../../../../common';
import { AdTypesOptions, noGraphDataMessage } from '../../../../constants';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const _ = require('lodash');

export default function SponsoredPerformance({
  currencySymbol,
  setSelectedAdBox,
  selectedAdBox,
  adCurrentTotal,
  adPreviousTotal,
  adDifference,
  adGraphLoader,
  adChartData,
  selectedAdDF,
  adFilters,
  adGroupBy,
  handleAdGroupBy,
  handleAdType,
  isApiCall,
  selectedAdType,
  getAdTypesSelectComponents,
}) {
  const renderAdTypes = () => {
    return (
      <>
        <div className="col-md-4  col-sm1-12 pr-0">
          {' '}
          <p className="black-heading-title mt-2 mb-4">
            {' '}
            Sponsored Ad Performance
          </p>
        </div>
        <div className="col-md-8 col-sm1-12  mb-3 pl-0">
          <ul className="ad-performance-nav">
            <li
              className="ad-performance"
              id="BT-adperformancedata-alltypesfilter">
              {' '}
              {DropDown(
                'days-performance',
                AdTypesOptions,
                AdTypesOptions[0].label,
                getAdTypesSelectComponents,
                AdTypesOptions[0],
                handleAdType,
                isApiCall,
                null,
                selectedAdType,
              )}
            </li>
          </ul>{' '}
        </div>
      </>
    );
  };

  const addThousandComma = (number, decimalDigits = 2) => {
    if (number !== undefined && number !== null) {
      return number
        .toFixed(decimalDigits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return number;
  };

  const renderAdGroupBy = () => {
    return (
      <>
        {_.size(selectedAdBox) <= 2 ? (
          <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
            <ul className="rechart-item">
              <li id="BT-adperformance-recentgraph">
                <div className="weeks">
                  <span
                    className={
                      _.size(selectedAdBox) === 1
                        ? `${_.keys(selectedAdBox)[0]} circle`
                        : 'darkGray circle'
                    }
                  />

                  <span>Recent</span>
                </div>
              </li>
              {selectedAdDF.value !== 'custom' ? (
                <li id="BT-adperformance-perviousgraph">
                  <div className="weeks">
                    <ul className="dashed-line">
                      <li
                        className={
                          _.size(selectedAdBox) === 1
                            ? `${_.keys(selectedAdBox)[0]} block`
                            : 'darkGray block'
                        }
                      />
                      <li
                        className={
                          _.size(selectedAdBox) === 1
                            ? `${_.keys(selectedAdBox)[0]} block`
                            : 'darkGray block'
                        }
                      />
                    </ul>
                    <span>Previous</span>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
        ) : (
          <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2" />
        )}
        <div className="col-md-6 col-sm-12 order-md-2 order-1">
          <ToggleButton>
            <div className="days-container ">
              <ul className="days-tab">
                <li
                  id="BT-adperformance-days"
                  className={adFilters.daily === false ? 'disabled-tab' : ''}>
                  <input
                    className="d-none"
                    type="radio"
                    id="daysCheck"
                    name="flexRadioDefault"
                    value={adGroupBy}
                    checked={adFilters.daily && adGroupBy === 'daily'}
                    onClick={() => handleAdGroupBy('daily')}
                    onChange={() => {}}
                  />
                  <label htmlFor="daysCheck">Daily</label>
                </li>

                <li
                  id="BT-adperformance-weekly"
                  className={adFilters.weekly === false ? 'disabled-tab' : ''}>
                  <input
                    className="d-none"
                    type="radio"
                    id="weeklyCheck"
                    name="flexRadioDefault"
                    value={adGroupBy}
                    checked={adFilters.weekly && adGroupBy === 'weekly'}
                    onChange={() => handleAdGroupBy('weekly')}
                  />
                  <label htmlFor="weeklyCheck">Weekly</label>
                </li>

                <li
                  id="BT-adperformance-monthly"
                  className={adFilters.month === false ? 'disabled-tab' : ''}>
                  <input
                    className=" d-none"
                    type="radio"
                    id="monthlyCheck"
                    name="flexRadioDefault"
                    value={adGroupBy}
                    checked={adFilters.month && adGroupBy === 'monthly'}
                    onChange={() => handleAdGroupBy('monthly')}
                  />
                  <label htmlFor="monthlyCheck">Monthly</label>
                </li>
              </ul>
            </div>
          </ToggleButton>
        </div>
      </>
    );
  };

  return (
    <WhiteCard>
      <div className="row">{renderAdTypes()}</div>
      <div className="row mr-1 ml-1">
        <SponsoredAdMetric
          currencySymbol={currencySymbol}
          setSelectedAdMetrics={setSelectedAdBox}
          selectedAdMetrics={selectedAdBox}
          adCurrentTotal={adCurrentTotal}
          addThousandComma={addThousandComma}
          adPreviousTotal={adPreviousTotal}
          adDifference={adDifference}
        />
      </div>

      <div className="row mt-4 mb-3">{renderAdGroupBy()}</div>
      {adGraphLoader ? (
        <PageLoader
          component="performance-graph"
          color="#FF5933"
          type="detail"
          width={40}
          height={40}
        />
      ) : adChartData.length >= 1 ? (
        <AdPerformanceChart
          chartId="adChart"
          chartData={adChartData}
          currencySymbol={currencySymbol}
          selectedBox={selectedAdBox}
          selectedDF={selectedAdDF.value}
        />
      ) : (
        <NoData>{noGraphDataMessage}</NoData>
      )}
    </WhiteCard>
  );
}

SponsoredPerformance.defaultProps = {
  currencySymbol: '',
  setSelectedAdBox: () => {},
  selectedAdBox: {},
  adCurrentTotal: {},
  adPreviousTotal: {},
  adDifference: {},
  adGraphLoader: false,
  adChartData: {},
  selectedAdDF: {},
  adFilters: {},
  adGroupBy: '',
  handleAdGroupBy: () => {},
  handleAdType: () => {},
  isApiCall: false,
  selectedAdType: '',
  getAdTypesSelectComponents: () => {},
};

SponsoredPerformance.propTypes = {
  currencySymbol: string,
  setSelectedAdBox: func,
  selectedAdBox: instanceOf(Object),
  adCurrentTotal: instanceOf(Object),
  adPreviousTotal: instanceOf(Object),
  adDifference: instanceOf(Object),
  adGraphLoader: bool,
  adChartData: arrayOf(Array),
  selectedAdDF: instanceOf(Object),
  adFilters: instanceOf(Object),
  adGroupBy: string,
  handleAdGroupBy: func,
  handleAdType: func,
  isApiCall: bool,
  selectedAdType: string,
  getAdTypesSelectComponents: func,
};
const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
