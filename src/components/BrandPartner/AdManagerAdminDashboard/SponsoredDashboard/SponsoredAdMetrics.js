import React from 'react';

import { arrayOf, func, string } from 'prop-types';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  UpDowGrayArrow,
} from '../../../../theme/images/index';

const _ = require('lodash');

const SponsoredAdMetrics = ({
  currencySymbol,
  selectedAdMetrics,
  setSelectedAdMetrics,
  adCurrentTotal,
  addThousandComma,
  adPreviousTotal,
  adDifference,
}) => {
  const setBoxClasses = (name, classValue) => {
    let selectedClass = '';
    if (Object.prototype.hasOwnProperty.call(selectedAdMetrics, name)) {
      selectedClass = `order-chart-box ${classValue} fix-height`;
    } else if (_.size(selectedAdMetrics) === 4) {
      selectedClass = 'order-chart-box fix-height disabled';
    } else {
      selectedClass = 'order-chart-box fix-height';
    }
    return selectedClass;
  };

  const setBoxToggle = (name) => {
    if (
      Object.prototype.hasOwnProperty.call(selectedAdMetrics, name) &&
      _.size(selectedAdMetrics) > 1
    ) {
      setSelectedAdMetrics(_.omit(selectedAdMetrics, [name]));
    } else if (_.size(selectedAdMetrics) < 4) {
      setSelectedAdMetrics(
        _.omit(_.assign(selectedAdMetrics, { [name]: true })),
      );
    }
  };

  const renderAdMetrics = () => {
    const currencySign = currencySymbol !== null ? currencySymbol : '';
    return (
      <div className="row mr-1 ml-1">
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adSales')}
            role="presentation"
            className={setBoxClasses('adSales', 'ad-sales-active')}>
            <div className="chart-name">Ad Sales</div>
            <div className="number-rate">
              {adCurrentTotal && adCurrentTotal.ad_sales
                ? `${currencySign}${addThousandComma(adCurrentTotal.ad_sales)}`
                : `${currencySign}0.00`}
            </div>
            <div className="vs">
              {adPreviousTotal && adPreviousTotal.ad_sales
                ? `vs ${currencySign}${addThousandComma(
                    adPreviousTotal.ad_sales,
                  )}`
                : `vs ${currencySign}0.00`}
            </div>
            {adDifference && adDifference.ad_sales ? (
              adDifference.ad_sales >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {adDifference.ad_sales}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {adDifference.ad_sales.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            role="presentation"
            onClick={() => setBoxToggle('adSpend')}
            className={setBoxClasses('adSpend', 'ad-spend-active')}>
            <div className="chart-name">Ad Spend</div>
            <div className="number-rate">
              {/* <span style={{ fontSize: '26px' }}>$241,498.33</span> */}
              {adCurrentTotal && adCurrentTotal.ad_spend
                ? `${currencySign}${addThousandComma(adCurrentTotal.ad_spend)}`
                : `${currencySign}0.00`}
            </div>
            <div className="vs">
              {adPreviousTotal && adPreviousTotal.ad_spend
                ? `vs ${currencySign}${addThousandComma(
                    adPreviousTotal.ad_spend,
                  )}`
                : `vs ${currencySign}0.00`}
            </div>
            {adDifference && adDifference.ad_spend ? (
              adDifference.ad_spend >= 0 ? (
                <div className="perentage-value grey mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={UpDowGrayArrow}
                    alt="arrow-down"
                  />
                  {adDifference.ad_spend}%
                </div>
              ) : (
                <div className="perentage-value grey mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={UpDowGrayArrow}
                    alt="arrow-down"
                  />
                  {adDifference.ad_spend.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value grey mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1  col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adConversion')}
            role="presentation"
            className={setBoxClasses('adConversion', 'ad-conversion-active')}>
            <div className="chart-name">Ad Conversion Rate</div>
            <div className="number-rate">
              {adCurrentTotal && adCurrentTotal.ad_conversion_rate
                ? `${addThousandComma(adCurrentTotal.ad_conversion_rate)}%`
                : `0.00%`}
            </div>
            <div className="vs">
              {adPreviousTotal && adPreviousTotal.ad_conversion_rate
                ? `vs ${addThousandComma(adPreviousTotal.ad_conversion_rate)}%`
                : `vs 0.00%`}
            </div>
            {adDifference && adDifference.ad_conversion_rate ? (
              adDifference.ad_conversion_rate >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {adDifference.ad_conversion_rate}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {adDifference.ad_conversion_rate.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('impressions')}
            role="presentation"
            className={setBoxClasses('impressions', 'impression-active')}>
            <div className="chart-name">Impressions</div>
            <div className="number-rate">
              {adCurrentTotal && adCurrentTotal.impressions
                ? addThousandComma(adCurrentTotal.impressions, 0)
                : `0`}
            </div>
            <div className="vs">
              {adPreviousTotal && adPreviousTotal.impressions
                ? `vs ${addThousandComma(adPreviousTotal.impressions, 0)}`
                : `vs 0`}
            </div>
            {adDifference && adDifference.impressions ? (
              adDifference.impressions >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {addThousandComma(adDifference.impressions)}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {adDifference.impressions.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adCos')}
            role="presentation"
            className={setBoxClasses('adCos', 'ad-cos-active')}>
            <div className="chart-name">ACos</div>
            <div className="number-rate">
              {adCurrentTotal && adCurrentTotal.acos
                ? `${addThousandComma(adCurrentTotal.acos)}%`
                : `0.00%`}
            </div>
            <div className="vs">
              {adPreviousTotal && adPreviousTotal.acos
                ? `vs ${addThousandComma(adPreviousTotal.acos)}%`
                : `vs 0.00%`}
            </div>
            {adDifference && adDifference.acos ? (
              adDifference.acos >= 0 ? (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {adDifference.acos}%
                </div>
              ) : (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {adDifference.acos.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adRoas', 'ad')}
            role="presentation"
            className={setBoxClasses('adRoas', 'ad-roas-active', 'ad')}>
            <div className="chart-name">RoAS</div>
            <div className="number-rate">
              {adCurrentTotal && adCurrentTotal.roas
                ? `${currencySign}${addThousandComma(adCurrentTotal.roas)}`
                : `${currencySign}0.00`}
            </div>
            <div className="vs">
              {' '}
              {adPreviousTotal && adPreviousTotal.roas
                ? `vs ${currencySign}${addThousandComma(adPreviousTotal.roas)}`
                : `vs ${currencySign}0.00`}
            </div>
            {adDifference && adDifference.roas ? (
              adDifference.roas >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {adDifference.roas}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {adDifference.roas.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adClicks', 'ad')}
            role="presentation"
            className={setBoxClasses('adClicks', 'ad-click-active', 'ad')}>
            <div className="chart-name">Clicks</div>
            <div className="number-rate">
              {adCurrentTotal && adCurrentTotal.clicks
                ? addThousandComma(adCurrentTotal.clicks, 0)
                : '0'}
            </div>
            <div className="vs">
              {adPreviousTotal && adPreviousTotal.clicks
                ? `vs ${addThousandComma(adPreviousTotal.clicks, 0)}`
                : `vs 0`}
            </div>
            {adDifference && adDifference.clicks ? (
              adDifference.clicks >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {adDifference.clicks}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {adDifference.clicks.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adClickRate', 'ad')}
            role="presentation"
            className={setBoxClasses(
              'adClickRate',
              'ad-clickrate-active',
              'ad',
            )}>
            <div className="chart-name">Click through rate</div>
            <div className="number-rate">
              {adCurrentTotal && adCurrentTotal.ctr
                ? `${addThousandComma(adCurrentTotal.ctr)}%`
                : `0.00%`}
            </div>
            <div className="vs">
              {adPreviousTotal && adPreviousTotal.ctr
                ? `vs ${addThousandComma(adPreviousTotal.ctr)}%`
                : `vs 0.00%`}
            </div>
            {adDifference && adDifference.ctr ? (
              adDifference.ctr >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {adDifference.ctr}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {adDifference.ctr.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
      </div>
    );
  };
  return <>{renderAdMetrics()}</>;
};

export default SponsoredAdMetrics;

SponsoredAdMetrics.defaultProps = {
  currencySymbol: {},
  setSelectedAdMetrics: () => {},
  selectedAdMetrics: {},
  adCurrentTotal: '',
  addThousandComma: () => {},
  adPreviousTotal: '',
  adDifference: '',
};

SponsoredAdMetrics.propTypes = {
  currencySymbol: string,
  setSelectedAdMetrics: func,
  selectedAdMetrics: string,
  adCurrentTotal: arrayOf(Array),
  addThousandComma: func,
  adPreviousTotal: arrayOf(Array),
  adDifference: arrayOf(Array),
};
