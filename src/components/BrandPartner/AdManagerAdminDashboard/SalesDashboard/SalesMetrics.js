import React from 'react';

import ReactTooltip from 'react-tooltip';
import { func, instanceOf, number, string } from 'prop-types';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  UpDowGrayArrow,
} from '../../../../theme/images';

const _ = require('lodash');

const SalesMetrics = ({
  currencySymbol,
  selectedSalesMetrics,
  setSelectedSalesMetrics,
  salesCurrentTotal,
  addThousandComma,
  salesPreviousTotal,
  salesDifference,
  organicSale,
  inorganicSale,
}) => {
  const rendeTootipData = () => {
    return `
    <ul style="padding:0; margin: 0 0 4px 0; max-width: 240px; width: 100%;opacity: 100%;"> 
      <li style="display: "> 
        <div style="color:#ffffff; font-size: 12px">Sales Breakdown</div>
      </li>
      <div class="row">
          <div class="col-6">
           <div style="color: #f4f6fc;
          text-transform: uppercase;
          font-size: 11px;
          margin-top: 8px;
         ">Organic Sales
        </div>
          </div>
           <div class="col-6">
             <div style="color: #f4f6fc;
              font-size: 16px;
              margin-left: 25px;
              float: right;
              text-align: right;
              margin-top: 4px;
             ">${currencySymbol}${addThousandComma(organicSale)}
           </div>
           </div>
             <div class="col-6">
           <div style="color: #f4f6fc;
          text-transform: uppercase;
          font-size: 11px;
          margin-top:7px;
         ">In-Organic Sales
        </div>
          </div>
           <div class="col-6">
             <div style="color: #f4f6fc;
              font-size: 16px;
              margin-left: 25px;
              float: right;
              text-align: right;
              margin-top: 4px;
             ">${currencySymbol}${addThousandComma(inorganicSale)}
           </div>
           </div>
      </div>
     
    </ul>`;
  };
  const setBoxClasses = (name, classValue) => {
    let selectedClass = '';
    if (Object.prototype.hasOwnProperty.call(selectedSalesMetrics, name)) {
      selectedClass = `order-chart-box ${classValue} fix-height`;
    } else if (_.size(selectedSalesMetrics) === 4) {
      selectedClass = 'order-chart-box fix-height disabled';
    } else {
      selectedClass = 'order-chart-box fix-height';
    }
    return selectedClass;
  };

  const setBoxToggle = (name) => {
    if (
      Object.prototype.hasOwnProperty.call(selectedSalesMetrics, name) &&
      _.size(selectedSalesMetrics) > 1
    ) {
      setSelectedSalesMetrics(_.omit(selectedSalesMetrics, [name]));
    } else if (_.size(selectedSalesMetrics) < 4) {
      setSelectedSalesMetrics(
        _.omit(_.assign(selectedSalesMetrics, { [name]: true })),
      );
    }
  };

  const renderSalesMetrics = () => {
    const currencySign = currencySymbol !== null ? currencySymbol : '';
    return (
      <div className="row mr-1 ml-1">
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <div
            id="BT-sale-revenuecard"
            onClick={() => setBoxToggle('revenue')}
            role="presentation"
            className={setBoxClasses('revenue', 'ad-sales-active')}>
            <div className="row">
              <div className="chart-name col-6 ">Total Sales</div>
              <div
                className="col-6 pl-0 label-card-text text-right"
                data-tip={rendeTootipData()}
                data-html
                data-for="break-down">
                Breakdown
              </div>
            </div>
            <div className="number-rate">
              {salesCurrentTotal && salesCurrentTotal.revenue
                ? `${currencySign}${addThousandComma(
                    salesCurrentTotal.revenue,
                  )}`
                : `${currencySign}0.00`}
            </div>
            <div className="vs">
              {salesPreviousTotal && salesPreviousTotal.revenue
                ? `vs ${currencySign}${addThousandComma(
                    salesPreviousTotal.revenue,
                  )}`
                : `vs ${currencySign}0.00`}
            </div>
            {salesDifference && salesDifference.revenue ? (
              salesDifference.revenue >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {salesDifference.revenue}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {salesDifference.revenue.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            id="BT-sale-trafficcard"
            role="presentation"
            onClick={() => setBoxToggle('traffic')}
            className={setBoxClasses('traffic', 'ad-spend-active')}>
            <div className="chart-name">Traffic</div>
            <div className="number-rate">
              {salesCurrentTotal && salesCurrentTotal.traffic
                ? `${addThousandComma(salesCurrentTotal.traffic)}`
                : `0.00`}
            </div>
            <div className="vs">
              {salesPreviousTotal && salesPreviousTotal.traffic
                ? `vs ${addThousandComma(salesPreviousTotal.traffic)}`
                : `vs 0.00`}
            </div>
            {salesDifference && salesDifference.traffic ? (
              salesDifference.traffic >= 0 ? (
                <div className="perentage-value grey mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={UpDowGrayArrow}
                    alt="arrow-down"
                  />
                  {salesDifference.traffic}%
                </div>
              ) : (
                <div className="perentage-value grey mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={UpDowGrayArrow}
                    alt="arrow-down"
                  />
                  {salesDifference.traffic.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value grey mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1  col-6 mb-3">
          <div
            id="BT-sale-conversioncard"
            onClick={() => setBoxToggle('conversion')}
            role="presentation"
            className={setBoxClasses('conversion', 'ad-conversion-active')}>
            <div className="chart-name">Conversion</div>
            <div className="number-rate">
              {salesCurrentTotal && salesCurrentTotal.conversion
                ? `${addThousandComma(salesCurrentTotal.conversion)}%`
                : `0.00%`}
            </div>
            <div className="vs">
              {salesPreviousTotal && salesPreviousTotal.conversion
                ? `vs ${addThousandComma(salesPreviousTotal.conversion)}%`
                : `vs 0.00%`}
            </div>
            {salesDifference && salesDifference.conversion ? (
              salesDifference.conversion >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {salesDifference.conversion}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {salesDifference.conversion.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            id="BT-sale-unitsoldcard"
            onClick={() => setBoxToggle('unitsSold')}
            role="presentation"
            className={setBoxClasses('unitsSold', 'impression-active')}>
            <div className="chart-name">units Sold</div>
            <div className="number-rate">
              {salesCurrentTotal && salesCurrentTotal.units_sold
                ? addThousandComma(salesCurrentTotal.units_sold, 0)
                : `0`}
            </div>
            <div className="vs">
              {salesPreviousTotal && salesPreviousTotal.units_sold
                ? `vs ${addThousandComma(salesPreviousTotal.units_sold, 0)}`
                : `vs 0`}
            </div>
            {salesDifference && salesDifference.units_sold ? (
              salesDifference.units_sold >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {addThousandComma(salesDifference.units_sold)}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {salesDifference.units_sold.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>

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

  return <>{renderSalesMetrics()}</>;
};

export default SalesMetrics;

SalesMetrics.defaultProps = {
  currencySymbol: {},
  selectedSalesMetrics: {},
  salesCurrentTotal: {},
  salesPreviousTotal: {},
  salesDifference: {},
  addThousandComma: () => {},
  setSelectedSalesMetrics: () => {},
  inorganicSale: {},
  organicSale: {},
};

SalesMetrics.propTypes = {
  currencySymbol: string,
  selectedSalesMetrics: instanceOf(Object),
  salesCurrentTotal: instanceOf(Object),
  salesPreviousTotal: instanceOf(Object),
  salesDifference: instanceOf(Object),
  inorganicSale: number,
  organicSale: number,
  addThousandComma: func,
  setSelectedSalesMetrics: func,
};
