/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'; // useLayoutEffect, // useCallback, // useState, // useEffect,
import styled from 'styled-components';
import Select, { components } from 'react-select';
import { DropDownSelect } from '../../../common';
import { WhiteCard } from '../../../theme/Global';
import { ArrowDownIcon, CaretUp } from '../../../theme/images/index';
import { DropDown } from './DropDown';

const getSymbolFromCurrency = require('currency-symbol-map');

export default function AdPerformance({ marketplaceChoices }) {
  const [amazonOptions, setAmazonOptions] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);

  useEffect(() => {
    const list = [];
    if (marketplaceChoices && marketplaceChoices.length > 0)
      for (const option of marketplaceChoices) {
        list.push({
          value: option.name,
          label: option.country_currency.country,
          currency: option.country_currency.currency,
        });
      }
    setAmazonOptions(list);
    if (responseId === null && list.length && list[0].value !== null) {
      setSelectedMarketplace(list[0].value);
      setCurrency(list[0].currency);
      setCurrencySymbol(getSymbolFromCurrency(list[0].currency));
      // getData(selectedValue, groupBy, list[0].value);
      // getBBData(list[0].value, bBDailyFact, 'daily');
      setResponseId('12345');
    }
  }, [
    marketplaceChoices,
    responseId,
    selectedMarketplace,
    currencySymbol,
    currency,
  ]);

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const handleAmazonOptions = (event) => {
    setSelectedMarketplace(event.value);
    setCurrency(event.currency);
    setCurrencySymbol(getSymbolFromCurrency(event.currency));
    // if (selectedValue === 'custom') {
    //   checkDifferenceBetweenDates(
    //     state[0].startDate,
    //     state[0].endDate,
    //     'custom',
    //   );
    // } else {
    //   getData(selectedValue, groupBy, event.value);
    //   getBBData(event.value, bBDailyFact, BBGroupBy);
    // }
  };

  const renderMarketplaceDropDown = () => {
    return (
      <div className="row">
        <div className="col-12 mb-3">
          {DropDown(
            amazonOptions,
            amazonOptions && amazonOptions[0] && amazonOptions[0].label,
            DropdownIndicator,
            amazonOptions && amazonOptions[0],
            handleAmazonOptions,
          )}
        </div>
      </div>
    );
  };

  const renderAdBox = () => {
    return (
      <>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-2">
          <div className="order-chart-box ad-sales-active fix-height">
            <div className="chart-name">Ad Sales </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div className="order-chart-box ad-spend-active fix-height">
            <div className="chart-name">Ad Spend </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div className="order-chart-box ad-conversion-active fix-height">
            <div className="chart-name">Ad Conversion Rate</div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div className="order-chart-box impression-active fix-height">
            <div className="chart-name">Impressions </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <div className="order-chart-box ad-cos-active fix-height">
            <div className="chart-name">Ad Cos</div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div className="order-chart-box ad-roas-active  fix-height">
            <div className="chart-name">RoAS </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div className="order-chart-box ad-click-active  fix-height">
            <div className="chart-name">Clicks </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div className="order-chart-box ad-clickrate-active fix-height">
            <div className="chart-name">Click through rate </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAdDailyFacts = () => {
    return (
      <>
        <div className="col-md-3  col-sm1-12">
          {' '}
          <p className="black-heading-title mt-2 mb-5"> Ad Performance</p>
        </div>
        <div className="col-md-9 col-sm1-12  mb-3 pl-0">
          <ul className="ad-performance-nav">
            <li className="ad-performance">
              {' '}
              <DropDownSelect>
                <Select classNamePrefix="react-select" className="active" />
              </DropDownSelect>
            </li>
            <li className="day-performance">
              {' '}
              <DropDownSelect className="days-performance">
                <Select classNamePrefix="react-select" className="active" />
              </DropDownSelect>
            </li>
          </ul>{' '}
        </div>
      </>
    );
  };

  const renderAdGroupBy = () => {
    return (
      <>
        <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
          <ul className="rechart-item">
            <li>
              <div className="weeks">
                <span className="orange block" />
                <span>Recent</span>
              </div>
            </li>
            {/* {selectedValue !== 'custom' ? ( */}
            <li>
              <div className="weeks">
                <span className="gray block" />
                <span>Previous</span>
              </div>
            </li>
            {/* ) : null} */}
          </ul>
        </div>
        <div className="col-md-12 mt-4">
          {' '}
          <div className="days-container ">
            <ul className="days-tab">
              <li>
                {' '}
                <input
                  className="d-none"
                  type="radio"
                  id="daysCheck"
                  name="flexRadioDefault"
                />
                <label htmlFor="daysCheck">Daily</label>
              </li>

              <li>
                <input
                  className="d-none"
                  type="radio"
                  id="weeklyCheck"
                  name="flexRadioDefault"
                />
                <label htmlFor="weeklyCheck">Weekly</label>
              </li>

              <li>
                <input
                  className=" d-none"
                  type="radio"
                  id="monthlyCheck"
                  name="flexRadioDefault"
                />
                <label htmlFor="monthlyCheck">Monthly</label>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };

  const renderDSPDailyFacts = () => {
    return (
      <>
        <div className="col-6">
          {' '}
          <p className="black-heading-title mt-2 mb-2"> DSP Spend</p>
        </div>
        <div className="col-6 text-right">
          {' '}
          <DropDownSelect className="days-performance">
            <Select classNamePrefix="react-select" className="active" />
          </DropDownSelect>
        </div>
      </>
    );
  };

  return (
    <AddPerformance>
      {renderMarketplaceDropDown()}
      <WhiteCard>
        <div className="row">{renderAdDailyFacts()}</div>
        <div className="row mr-1 ml-1">{renderAdBox()}</div>
        <div className="row">{renderAdGroupBy()}</div>
      </WhiteCard>
      <WhiteCard className="mt-3">
        <div className="row">{renderDSPDailyFacts()}</div>
        <div className="number-rate">$15,050.28</div>
        <div className="vs">
          vs $11,114.90{' '}
          <span className="perentage-value down mt-3 ml-1">
            <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
            40.75%{' '}
          </span>
        </div>
      </WhiteCard>
    </AddPerformance>
  );
}

// AddPerformance.propTypes = {
//   id: PropTypes.string.isRequired,
// };
const AddPerformance = styled.div`
  .ad-performance-nav {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: right;

    li {
      display: inline-block;
      margin-right: 10px;

      &:last-child {
        margin-right: 0px;
      }
      &.ad-performance {
        max-width: 220px;
        width: 100%;
        vertical-align: top;
      }
      &.day-performance {
        max-width: 259px;
        width: 100%;
      }
    }
  }
  @media only screen and (max-width: 1105px) {
    .ad-performance-nav {
      li {
        
        &.ad-performance {
          max-width: 195px;
          width: 100%;
        }
        &.day-performance {
          max-width: 230px;
          width: 100%;
        }
      }
    }

  }
   @media only screen and (max-width: 1105px) { 

     .ad-performance-nav {
      li {
         &.ad-performance {
          max-width: 100%;
          width: 100%;
          margin-bottom: 20px;
        }
        &.day-performance {
          max-width: 100%;
          width: 100%;
        }
      }
   }
`;
