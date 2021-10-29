import React from 'react';

import ReactTooltip from 'react-tooltip';
import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line camelcase
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import { components } from 'react-select';
import { arrayOf, bool, func, shape, string } from 'prop-types';

import SalesPerformanceChart from './VendorSalePerformanceChart';
import { DropDown } from '../DropDown';
import { ArrowUpIcon, ArrowDownIcon } from '../../../../theme/images';
import {
  vendorSalesMetricsTypeOptions,
  noGraphDataMessage,
  VendorMetricsNames,
} from '../../../../constants';
import {
  WhiteCard,
  PageLoader,
  CustomDateModal,
  NoData,
  DropDownIndicator,
  ToggleButton,
  CardMetrics,
} from '../../../../common';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const _ = require('lodash');

am4core.useTheme(am4themes_dataviz);
export default function SalesPerformancePanel({
  activeSales,
  currencySymbol,
  setActiveSales,
  handleMetricsType,
  isApiCall,
  selectedValue,
  showCustomDateModal,
  state,
  setShowCustomDateModal,
  setState,
  currentDate,
  applyCustomDate,
  filters,
  handleGroupBy,
  groupBy,
  salesCurrentTotal,
  salesDifference,
  salesPreviousTotal,
  salesGraphLoader,
  salesChartData,
  // organicSale,
  // inorganicSale,
  metricsType,
}) {
  const { Option, SingleValue } = components;

  const metricsTypeFilterOption = (props) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>
          {props.data.label}
        </span>
      </div>
    </Option>
  );

  const metricsTypeSingleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>
    </SingleValue>
  );

  const getMetricTypeSelectComponents = () => {
    return {
      Option: metricsTypeFilterOption,
      SingleValue: metricsTypeSingleFilterOption,
      DropDownIndicator,
    };
  };

  // const addThousandComma = (value, decimalDigits = 2) => {
  //   if (value !== undefined && value !== null) {
  //     return value.toFixed(decimalDigits).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   }

  //   return value;
  // };

  const bindValues = (value, name = null) => {
    const decimal = _.split(value, '.', 2);
    if (decimal[1] !== undefined) {
      return (
        <span style={{ fontSize: '26px' }}>
          {name === 'orderedRevenue' || name === 'shippedCOGs'
            ? currencySymbol
            : null}
          {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          <span style={{ fontSize: '16px' }}>.{decimal[1].slice(0, 2)}</span>
        </span>
      );
    }
    return (
      <span style={{ fontSize: '26px' }}>
        {name === 'orderedRevenue' || name === 'shippedCOGs'
          ? currencySymbol
          : null}
        {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </span>
    );
  };

  // const rendeTootipData = () => {
  //   return `
  //   <ul style="padding:0; margin: 0 0 4px 0; max-width: 240px; opacity: 100%;">
  //     <li style="display: ">
  //       <div style="color:#ffffff; font-size: 12px">Sales Breakdown</div>
  //     </li>
  //     <div class="row">
  //         <div class="col-6">
  //          <div style="color: #f4f6fc;
  //         text-transform: uppercase;
  //         font-size: 11px;
  //         margin-top: 8px;
  //        ">Organic Sales
  //       </div>
  //         </div>
  //          <div class="col-6">
  //            <div style="color: #f4f6fc;
  //             font-size: 16px;
  //             margin-left: 25px;
  //             float: right;
  //             text-align: right;
  //             margin-top: 4px;
  //            ">${currencySymbol}${addThousandComma(organicSale)}
  //          </div>
  //          </div>
  //            <div class="col-6">
  //          <div style="color: #f4f6fc;
  //         text-transform: uppercase;
  //         font-size: 11px;
  //         margin-top:7px;
  //        ">In-Organic Sales
  //       </div>
  //         </div>
  //          <div class="col-6">
  //            <div style="color: #f4f6fc;
  //             font-size: 16px;
  //             margin-left: 25px;
  //             float: right;
  //             text-align: right;
  //             margin-top: 4px;
  //            ">${currencySymbol}${addThousandComma(inorganicSale)}
  //          </div>
  //          </div>
  //     </div>

  //   </ul>`;
  // };

  const setSalesBoxClass = (name, classValue) => {
    let selectedClass = '';
    if (Object.prototype.hasOwnProperty.call(activeSales, name)) {
      selectedClass = `order-chart-box ${classValue} fix-height`;
    } else if (_.size(activeSales) === 4) {
      selectedClass = 'order-chart-box fix-height disabled';
    } else {
      selectedClass = 'order-chart-box fix-height';
    }
    return selectedClass;
  };

  const setBoxToggle = (name) => {
    if (
      Object.prototype.hasOwnProperty.call(activeSales, name) &&
      _.size(activeSales) > 1
    ) {
      setActiveSales(_.omit(activeSales, [name]));
    } else if (_.size(activeSales) < 4) {
      setActiveSales(_.omit(_.assign(activeSales, { [name]: true })));
    }
  };

  const renderMetricsType = () => {
    return (
      <div className="col-md-6 col-sm1-12  mb-3">
        {DropDown(
          'days-performance',
          vendorSalesMetricsTypeOptions,
          vendorSalesMetricsTypeOptions[0].label,
          getMetricTypeSelectComponents,
          vendorSalesMetricsTypeOptions[0],
          handleMetricsType,
          isApiCall,
          null,
          metricsType,
        )}
        <div className="clear-fix" />
      </div>
    );
  };

  const rednerSaleGroupBy = () => {
    return (
      <div className="row mt-4 mb-3">
        {_.size(activeSales) <= 2 ? (
          <div className="col-md-5 col-sm-12 order-md-1 order-2 mt-2">
            <ul className="rechart-item">
              <li>
                <div className="weeks">
                  <span
                    // className="orange block"
                    className={
                      _.size(activeSales) === 1
                        ? `${_.keys(activeSales)[0]} adSales circle`
                        : 'darkGray circle'
                    }
                  />
                  <span>Recent</span>
                </div>
              </li>
              {selectedValue.value !== 'custom' ? (
                <li>
                  <div className="weeks">
                    <ul className="dashed-line">
                      <li
                        className={
                          _.size(activeSales) === 1
                            ? `${_.keys(activeSales)[0]} block `
                            : 'darkGray block '
                        }
                      />
                      <li
                        className={
                          _.size(activeSales) === 1
                            ? `${_.keys(activeSales)[0]} block  `
                            : 'darkGray block '
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
          <div className="col-md-5 col-sm-12 order-md-1 order-2 mt-2" />
        )}
        <div className="col-md-7 col-sm-12 order-md-2 order-1">
          <ToggleButton>
            <div className="days-container ">
              <ul className="days-tab">
                <li className={filters.daily === false ? 'disabled-tab' : ''}>
                  {' '}
                  <input
                    className="d-none"
                    type="radio"
                    id="daysCheck"
                    name="flexRadioDefault"
                    value={groupBy}
                    checked={filters.daily && groupBy === 'daily'}
                    onClick={() => handleGroupBy('daily')}
                    onChange={() => {}}
                  />
                  <label htmlFor="daysCheck">Daily</label>
                </li>

                <li className={filters.weekly === false ? 'disabled-tab' : ''}>
                  <input
                    className="d-none"
                    type="radio"
                    value={groupBy}
                    checked={filters.weekly && groupBy === 'weekly'}
                    id="weeklyCheck"
                    name="flexRadioDefault"
                    onChange={() => handleGroupBy('weekly')}
                  />
                  <label htmlFor="weeklyCheck">Weekly</label>
                </li>

                <li className={filters.month === false ? 'disabled-tab' : ''}>
                  <input
                    className=" d-none"
                    type="radio"
                    value={groupBy}
                    checked={filters.month && groupBy === 'monthly'}
                    id="monthlyCheck"
                    name="flexRadioDefault"
                    onChange={() => handleGroupBy('monthly')}
                  />
                  <label htmlFor="monthlyCheck">Monthly</label>
                </li>
              </ul>
            </div>
          </ToggleButton>
        </div>
      </div>
    );
  };

  const renderSalesBox = (matricsName, className) => {
    let currentTotal = 0;
    let previousTotal = 0;
    let difference = 0;
    let boxActiveClass = '';
    const name = matricsName;
    let displayMatricsName;

    if (name === 'orderedRevenue') {
      currentTotal = salesCurrentTotal?.ordered_revenue
        ? salesCurrentTotal.ordered_revenue
        : 0;
      previousTotal = salesPreviousTotal?.ordered_revenue
        ? salesPreviousTotal.ordered_revenue
        : 0;
      difference = salesDifference?.ordered_revenue
        ? salesDifference.ordered_revenue
        : 'N/A';
      boxActiveClass = 'ad-sales-active';
      displayMatricsName = matricsName;
    } else if (name === 'shippedCOGs') {
      currentTotal = salesCurrentTotal?.shipped_cogs
        ? salesCurrentTotal.shipped_cogs
        : 0;
      previousTotal = salesPreviousTotal?.shipped_cogs
        ? salesPreviousTotal.shipped_cogs
        : 0;
      difference = salesDifference?.shipped_cogs
        ? salesDifference.shipped_cogs
        : 'N/A';
      boxActiveClass = 'ad-sales-active';
      displayMatricsName = matricsName;
    } else if (name === 'glanceViews') {
      currentTotal = salesCurrentTotal?.glance_views
        ? salesCurrentTotal.glance_views
        : 0;
      previousTotal = salesPreviousTotal?.glance_views
        ? salesPreviousTotal.glance_views
        : 0;
      difference = salesDifference?.glance_views
        ? salesDifference.glance_views
        : 'N/A';

      boxActiveClass = 'ad-spend-active';
      displayMatricsName = matricsName;
    } else if (name === 'conversionRate') {
      currentTotal = salesCurrentTotal?.conversion_rate
        ? salesCurrentTotal.conversion_rate
        : 0;
      previousTotal = salesPreviousTotal?.conversion_rate
        ? salesPreviousTotal.conversion_rate
        : 0;
      difference = salesDifference?.conversion_rate
        ? salesDifference.conversion_rate
        : 'N/A';

      boxActiveClass = 'ad-conversion-active';
      displayMatricsName = matricsName;
    } else if (name === 'orderedUnits') {
      currentTotal = salesCurrentTotal?.ordered_units
        ? salesCurrentTotal.ordered_units
        : 0;
      previousTotal = salesPreviousTotal?.ordered_units
        ? salesPreviousTotal.ordered_units
        : 0;
      difference = salesDifference?.ordered_units
        ? salesDifference.ordered_units
        : 'N/A';

      boxActiveClass = 'impression-active';
      displayMatricsName = matricsName;
    } else if (name === 'shippedUnits') {
      currentTotal = salesCurrentTotal?.shipped_units
        ? salesCurrentTotal.shipped_units
        : 0;
      previousTotal = salesPreviousTotal?.shipped_units
        ? salesPreviousTotal.shipped_units
        : 0;
      difference = salesDifference?.shipped_units
        ? salesDifference.shipped_units
        : 'N/A';

      boxActiveClass = 'impression-active';
      displayMatricsName = matricsName;
    }

    return (
      <div className={className}>
        <CardMetrics className="fix-height">
          <div
            className={setSalesBoxClass(name, boxActiveClass)}
            onClick={() => setBoxToggle(name)}
            role="presentation">
            {' '}
            <div className="chart-name">
              {VendorMetricsNames[displayMatricsName].toUpperCase()}
            </div>
            <div className="number-rate">
              {name === 'conversionRate'
                ? `${currentTotal.toFixed(2)}%`
                : bindValues(currentTotal, name)}
            </div>
            <div className="vs">
              {' '}
              vs{' '}
              {name === 'conversionRate'
                ? `${previousTotal.toFixed(2)}%`
                : name === 'orderedRevenue' || name === 'shippedCOGs'
                ? `${
                    currencySymbol !== null ? currencySymbol : ''
                  }${previousTotal
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : previousTotal
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>
            <div
              className={
                difference > 0
                  ? 'perentage-value mt-3 pt-1'
                  : 'perentage-value down mt-3 pt-1'
              }>
              {!Number.isNaN(difference) && difference > 0 ? (
                <img className="green-arrow" src={ArrowUpIcon} alt="arrow-up" />
              ) : !Number.isNaN(difference) && difference < 0 ? (
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
              ) : (
                ''
              )}
              {difference !== 'N/A'
                ? `${difference.toString().replace('-', '')}%`
                : 'N/A'}
            </div>
          </div>
        </CardMetrics>

        <ReactTooltip
          id="break-down"
          aria-haspopup="true"
          place="bottom"
          effect="solid"
          backgroundColor="#162c50"
        />
      </div>
    );
  };

  const renderSalePerformancePanel = () => {
    return (
      <WhiteCard>
        <div className="row">
          <div className="col-md-6 col-sm1-12">
            {' '}
            <p className="black-heading-title mt-2 mb-4"> Sales Performance</p>
          </div>
          {renderMetricsType()}
        </div>

        {metricsType.value === 'orderedRevenue' ? (
          <div className="row mr-1 ml-1">
            {renderSalesBox(
              'orderedRevenue',
              'col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3',
            )}
            {renderSalesBox(
              'glanceViews',
              'col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3',
            )}
            {renderSalesBox(
              'conversionRate',
              'col-lg-3 col-md-3 pr-1 pl-1  col-6 mb-3',
            )}
            {renderSalesBox(
              'orderedUnits',
              'col-lg-3 col-md-3 pl-1 pr-0 col-6 mb-3',
            )}
          </div>
        ) : (
          <div className="row mr-1 ml-1">
            {renderSalesBox(
              'shippedCOGs',
              'col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3',
            )}
            {renderSalesBox(
              'glanceViews',
              'col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3',
            )}
            {renderSalesBox(
              'conversionRate',
              'col-lg-3 col-md-3 pr-1 pl-1  col-6 mb-3',
            )}
            {renderSalesBox(
              'shippedUnits',
              'col-lg-3 col-md-3 pl-1 pr-0 col-6 mb-3',
            )}
          </div>
        )}
        {rednerSaleGroupBy()}
        <div className="clear-fix" />

        {salesGraphLoader ? (
          <PageLoader
            component="performance-graph"
            color="#FF5933"
            type="detail"
            width={40}
            height={40}
          />
        ) : salesChartData.length !== 0 ? (
          <SalesPerformanceChart
            chartId="chartdiv"
            chartData={salesChartData}
            currencySymbol={currencySymbol}
            selectedBox={activeSales}
            selectedDF={selectedValue.value}
          />
        ) : (
          <NoData>{noGraphDataMessage}</NoData>
        )}
      </WhiteCard>
    );
  };

  return (
    <>
      {renderSalePerformancePanel()}
      {/* custom date modal for sale performance graph */}
      <CustomDateModal
        id="BT-performancereport-daterange-SPdate"
        isOpen={showCustomDateModal}
        ranges={state}
        onClick={() => {
          setShowCustomDateModal(false);
          setState([
            {
              startDate: currentDate,
              endDate: currentDate,
              key: 'selection',
            },
          ]);
        }}
        onChange={(item) => {
          setState([item.selection]);
        }}
        onApply={() => applyCustomDate('SPDate')}
        currentDate={currentDate}
      />
    </>
  );
}

SalesPerformancePanel.defaultProps = {
  isApiCall: false,
  showCustomDateModal: false,
  salesGraphLoader: false,
  groupBy: '',
  currencySymbol: '',
  selectedValue: {},
  activeSales: {},
  currentDate: {},
  filters: {},
  salesDifference: {},
  salesCurrentTotal: {},
  salesPreviousTotal: {},
  data: {},
  salesChartData: {},
  state: [],
  // inorganicSale: {},
  // organicSale: {},
  metricsType: {},
  applyCustomDate: () => {},
  setActiveSales: () => {},
  handleMetricsType: () => {},
  setShowCustomDateModal: () => {},
  setState: () => {},
  handleGroupBy: () => {},
};

SalesPerformancePanel.propTypes = {
  showCustomDateModal: bool,
  isApiCall: bool,
  salesGraphLoader: bool,
  currencySymbol: string,
  groupBy: string,
  selectedValue: shape({}),
  activeSales: shape({}),
  currentDate: shape({}),
  filters: shape({}),
  data: shape({}),
  salesChartData: arrayOf(shape({})),
  state: arrayOf(shape({})),
  salesDifference: shape({}),
  salesCurrentTotal: shape({}),
  salesPreviousTotal: shape({}),
  // inorganicSale: number,
  // organicSale: number,
  metricsType: shape({}),
  setShowCustomDateModal: func,
  setState: func,
  setActiveSales: func,
  applyCustomDate: func,
  handleMetricsType: func,
  handleGroupBy: func,
};
