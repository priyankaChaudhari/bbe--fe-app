/* eslint-disable jsx-a11y/label-has-associated-control */
import React from // useEffect,
// useState,
// useCallback,
// useLayoutEffect,
'react';
import styled from 'styled-components';
import Select from 'react-select';
import { DropDownSelect } from '../../../common';
import { WhiteCard } from '../../../theme/Global';
import { ArrowDownIcon } from '../../../theme/images/index';
// import { DropDown } from './DropDown';

export default function AdPerformance() {
  // const [amazonOptions, setAmazonOptions] = useState([]);

  // useEffect(() => {
  // const list = [];
  // if (marketplaceChoices && marketplaceChoices.length > 0)
  //   for (const option of marketplaceChoices) {
  //     list.push({
  //       value: option.name,
  //       label: option.country_currency.country,
  //       currency: option.country_currency.currency,
  //     });
  //   }
  // setAmazonOptions(list);
  // if (responseId === null && list.length && list[0].value !== null) {
  //   setSelectedAmazonValue(list[0].value);
  //   setCurrency(list[0].currency);
  //   setCurrencySymbol(getSymbolFromCurrency(list[0].currency));
  //   getData(selectedValue, groupBy, list[0].value);
  //   getBBData(list[0].value, bBDailyFact, 'daily');
  //   setResponseId('12345');
  // }
  // }, [marketplaceChoices]);

  // const DropdownIndicator = (props) => {
  //   return (
  //     components.DropdownIndicator && (
  //       <components.DropdownIndicator {...props}>
  //         <img
  //           src={CaretUp}
  //           alt="caret"
  //           style={{
  //             transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
  //             width: '25px',
  //             height: '25px',
  //           }}
  //         />
  //       </components.DropdownIndicator>
  //     )
  //   );
  // };

  const renderMarketplaceDropDown = () => {
    return (
      <div className="row">
        <div className="col-12 mb-3">
          <DropDownSelect className="cursor">
            <Select classNamePrefix="react-select" className="active" />
          </DropDownSelect>{' '}
        </div>
      </div>
    );
  };

  const renderAdBox = () => {
    return (
      <>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
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
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
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
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
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
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
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
          <div className="order-chart-box  fix-height">
            <div className="chart-name">Ad Cos</div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <div className="order-chart-box  fix-height">
            <div className="chart-name">RoAS </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <div className="order-chart-box  fix-height">
            <div className="chart-name">Clicks </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <div className="order-chart-box  fix-height">
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
          <p className="black-heading-title mt-0 mb-4"> Ad Performance</p>
        </div>
        <div className="col-md-9 col-sm1-12  mb-3 pr-0">
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
        margin-right: 23px;
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
`;
