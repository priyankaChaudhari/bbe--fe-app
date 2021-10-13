import React, { useRef } from 'react';

import { func, instanceOf, string } from 'prop-types';

import ToogleMetrics from '../../../../common/ToogleMetrics';
import CardMetrics from '../../../../common/CardMetrics';
import DifferenceAdMetric from '../DifferenceAdMetric';
import { toogleMetricsData } from '../../../../constants';

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
  const toogleMetrics = useRef('acos');

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
      if ('adCos' in selectedAdMetrics && name === 'adRoas') {
        const values = selectedAdMetrics;
        delete values.adCos;
      } else if ('adRoas' in selectedAdMetrics && name === 'adCos') {
        const values = selectedAdMetrics;
        delete values.adRoas;
      }
      setSelectedAdMetrics(
        _.omit(_.assign(selectedAdMetrics, { [name]: true })),
      );
    }
  };

  const onToggleMetrics = () => {
    if (toogleMetrics.current === 'acos') {
      setBoxToggle('adCos');
    } else if (toogleMetrics.current === 'roas') {
      setBoxToggle('adRoas', 'ad');
    }
  };

  const renderAdMetrics = () => {
    const currencySign = currencySymbol !== null ? currencySymbol : '';
    return (
      <div className="row mr-1 ml-1">
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <CardMetrics className="fix-height">
            <div
              id="BT-sponsored-adsalescard"
              onClick={() => setBoxToggle('adSales')}
              role="presentation"
              className={setBoxClasses('adSales', 'ad-sales-active')}>
              <div className="chart-name">Ad Sales</div>
              <div className="number-rate">
                {adCurrentTotal && adCurrentTotal.ad_sales
                  ? `${currencySign}${addThousandComma(
                      adCurrentTotal.ad_sales,
                    )}`
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
                <DifferenceAdMetric value={adDifference.ad_sales} />
              ) : (
                <div className="perentage-value down mt-3 pt-1">N/A</div>
              )}
            </div>
          </CardMetrics>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <CardMetrics className="fix-height">
            <div
              id="BT-sponsored-adspendcard"
              role="presentation"
              onClick={() => setBoxToggle('adSpend')}
              className={setBoxClasses('adSpend', 'ad-spend-active')}>
              <div className="chart-name">Ad Spend</div>
              <div className="number-rate">
                {adCurrentTotal && adCurrentTotal.ad_spend
                  ? `${currencySign}${addThousandComma(
                      adCurrentTotal.ad_spend,
                    )}`
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
                <DifferenceAdMetric
                  value={adDifference.ad_spend}
                  type="spend"
                />
              ) : (
                <div className="perentage-value grey mt-3 pt-1">N/A</div>
              )}
            </div>
          </CardMetrics>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1  col-6 mb-3">
          <CardMetrics className="fix-height">
            <div
              id="BT-sponsored-adconversioncard"
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
                  ? `vs ${addThousandComma(
                      adPreviousTotal.ad_conversion_rate,
                    )}%`
                  : `vs 0.00%`}
              </div>
              {adDifference && adDifference.ad_conversion_rate ? (
                <DifferenceAdMetric value={adDifference.ad_conversion_rate} />
              ) : (
                <div className="perentage-value down mt-3 pt-1">N/A</div>
              )}
            </div>
          </CardMetrics>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <CardMetrics className="fix-height">
            <div
              id="BT-sponsored-impressionscard"
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
                <DifferenceAdMetric value={adDifference.impressions} />
              ) : (
                <div className="perentage-value down mt-3 pt-1">N/A</div>
              )}
            </div>
          </CardMetrics>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <CardMetrics className="fix-height">
            <div
              id="BT-sponsored-AcosRoascard"
              onClick={onToggleMetrics}
              role="presentation"
              className={
                toogleMetrics.current === 'acos'
                  ? setBoxClasses('adCos', 'ad-cos-active')
                  : setBoxClasses('adRoas', 'ad-cos-active')
              }>
              <ToogleMetrics
                data={toogleMetricsData}
                onToogle={(val) => {
                  toogleMetrics.current = val;
                }}
                value={toogleMetrics.current}
              />

              <div className="number-rate">
                {toogleMetrics.current === 'acos'
                  ? adCurrentTotal && adCurrentTotal.acos
                    ? `${addThousandComma(adCurrentTotal.acos)}%`
                    : `0.00%`
                  : adCurrentTotal && adCurrentTotal.roas
                  ? `${currencySign}${addThousandComma(adCurrentTotal.roas)}`
                  : `${currencySign}0.00`}
              </div>
              <div className="vs">
                {toogleMetrics.current === 'acos'
                  ? adPreviousTotal && adPreviousTotal.acos
                    ? `vs ${addThousandComma(adPreviousTotal.acos)}%`
                    : `vs 0.00%`
                  : adPreviousTotal && adPreviousTotal.roas
                  ? `vs ${currencySign}${addThousandComma(
                      adPreviousTotal.roas,
                    )}`
                  : `vs ${currencySign}0.00`}
              </div>
              {(adDifference && adDifference.acos) ||
              (adDifference && adDifference.roas) ? (
                toogleMetrics.current === 'acos' ? (
                  <DifferenceAdMetric value={adDifference.acos} type="acos" />
                ) : (
                  <DifferenceAdMetric value={adDifference.roas} />
                )
              ) : (
                <div className="perentage-value down mt-3 pt-1">N/A</div>
              )}
            </div>
          </CardMetrics>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <CardMetrics className="fix-height">
            <div
              id="BT-sponsored-costPerClick"
              onClick={() => setBoxToggle('costPerClick')}
              role="presentation"
              className={setBoxClasses('costPerClick', 'costPerClick-active')}>
              <div className="chart-name">Cost Per Click</div>
              <div className="number-rate">
                {adCurrentTotal && adCurrentTotal.cost_per_click
                  ? `${currencySign}${addThousandComma(
                      adCurrentTotal.cost_per_click,
                    )}`
                  : `${currencySign}0.00`}
              </div>
              <div className="vs">
                {adPreviousTotal && adPreviousTotal.cost_per_click
                  ? `vs ${currencySign}${addThousandComma(
                      adPreviousTotal.cost_per_click,
                    )}`
                  : `vs ${currencySign}0.00`}
              </div>
              {adDifference && adDifference.cost_per_click ? (
                <DifferenceAdMetric value={adDifference.cost_per_click} />
              ) : (
                <div className="perentage-value down mt-3 pt-1">N/A</div>
              )}
            </div>
          </CardMetrics>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <CardMetrics className="fix-height">
            <div
              id="BT-sponsored-clickcard"
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
                <DifferenceAdMetric value={adDifference.clicks} />
              ) : (
                <div className="perentage-value down mt-3 pt-1">N/A</div>
              )}
            </div>
          </CardMetrics>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <CardMetrics className="fix-height">
            <div
              id="BT-sponsored-clickratecard"
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
                <DifferenceAdMetric value={adDifference.ctr} />
              ) : (
                <div className="perentage-value down mt-3 pt-1">N/A</div>
              )}
            </div>
          </CardMetrics>
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
  adCurrentTotal: {},
  addThousandComma: () => {},
  adPreviousTotal: {},
  adDifference: {},
};

SponsoredAdMetrics.propTypes = {
  currencySymbol: string,
  setSelectedAdMetrics: func,
  selectedAdMetrics: instanceOf(Object),
  adCurrentTotal: instanceOf(Object),
  addThousandComma: func,
  adPreviousTotal: instanceOf(Object),
  adDifference: instanceOf(Object),
};
