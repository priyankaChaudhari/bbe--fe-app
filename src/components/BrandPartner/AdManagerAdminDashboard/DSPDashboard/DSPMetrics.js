import React, { useCallback } from 'react';

import { array, func, object, oneOfType, string } from 'prop-types';

import DifferenceAdMetric from '../DifferenceAdMetric';
import CardMetrics from '../../../../common/CardMetrics';

const DSPMetrics = ({
  setBoxToggle,
  setBoxClasses,
  dspCurrentTotal,
  dspPreviousTotal,
  dspDifference,
  currencySymbol,
}) => {
  const addThousandComma = useCallback((number, decimalDigits = 2) => {
    if (number !== undefined && number !== null) {
      return number
        .toFixed(decimalDigits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return number;
  }, []);
  const currencySign = currencySymbol !== null ? currencySymbol : '';

  return (
    <div className="row mr-1 ml-1">
      <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-2">
        <CardMetrics className="fix-height">
          <div
            id="BT-dspad-impressioncard"
            onClick={() => setBoxToggle('dspImpressions', 'dsp')}
            role="presentation"
            className={setBoxClasses(
              'dspImpressions',
              'ad-sales-active',
              'dsp',
            )}>
            <div className="chart-name">Impressions </div>
            <div className="number-rate">
              {dspCurrentTotal && dspCurrentTotal.impressions
                ? `${addThousandComma(dspCurrentTotal.impressions, 0)}`
                : `0`}
            </div>
            <div className="vs">
              {dspPreviousTotal && dspPreviousTotal.impressions
                ? `vs ${addThousandComma(dspPreviousTotal.impressions, 0)}`
                : `vs 0`}
            </div>
            {dspDifference && dspDifference.impressions ? (
              <DifferenceAdMetric value={dspDifference.impressions} />
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </CardMetrics>
      </div>
      <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
        <CardMetrics className="fix-height">
          <div
            id="BT-dspad-dspspendcard"
            onClick={() => setBoxToggle('dspSpend', 'dsp')}
            role="presentation"
            className={setBoxClasses('dspSpend', 'ad-spend-active', 'dsp')}>
            <div className="chart-name">Dsp Spend </div>
            <div className="number-rate">
              {dspCurrentTotal && dspCurrentTotal.dsp_spend
                ? `${currencySign}${addThousandComma(
                    dspCurrentTotal.dsp_spend,
                  )}`
                : `${currencySign}0.00`}
            </div>
            <div className="vs">
              {dspPreviousTotal && dspPreviousTotal.dsp_spend
                ? `vs ${currencySign}${addThousandComma(
                    dspPreviousTotal.dsp_spend,
                  )}`
                : `vs ${currencySign}0.00`}
            </div>

            {dspDifference && dspDifference.dsp_spend ? (
              <DifferenceAdMetric
                value={dspDifference.dsp_spend}
                type="spend"
              />
            ) : (
              <div className="perentage-value grey mt-3 pt-1">N/A</div>
            )}
          </div>
        </CardMetrics>
      </div>
      <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
        <CardMetrics className="fix-height">
          <div
            id="BT-dspad-totalproductcard"
            onClick={() => setBoxToggle('dspTotalProductSales', 'dsp')}
            role="presentation"
            className={setBoxClasses(
              'dspTotalProductSales',
              'ad-conversion-active',
              'dsp',
            )}>
            <div className="chart-name">Total Product Sales</div>
            <div className="number-rate">
              {dspCurrentTotal && dspCurrentTotal.total_product_sales
                ? `${currencySign}${addThousandComma(
                    dspCurrentTotal.total_product_sales,
                  )}`
                : `${currencySign}0.00`}
            </div>
            <div className="vs">
              {dspPreviousTotal && dspPreviousTotal.total_product_sales
                ? `vs ${currencySign}${addThousandComma(
                    dspPreviousTotal.total_product_sales,
                  )}`
                : `vs ${currencySign}0.00`}
            </div>

            {dspDifference && dspDifference.total_product_sales ? (
              <DifferenceAdMetric value={dspDifference.total_product_sales} />
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </CardMetrics>
      </div>
      <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
        <CardMetrics className="fix-height">
          <div
            id="BT-dspad-totalroascard"
            onClick={() => setBoxToggle('dspTotalRoas', 'dsp')}
            role="presentation"
            className={setBoxClasses(
              'dspTotalRoas',
              'impression-active',
              'dsp',
            )}>
            <div className="chart-name">Total ROAS </div>
            <div className="number-rate">
              {dspCurrentTotal && dspCurrentTotal.total_roas
                ? `${currencySign}${addThousandComma(
                    dspCurrentTotal.total_roas,
                  )}`
                : `${currencySign}0.00`}
            </div>
            <div className="vs">
              {dspPreviousTotal && dspPreviousTotal.total_roas
                ? `vs ${currencySign}${addThousandComma(
                    dspPreviousTotal.total_roas,
                  )}`
                : `vs ${currencySign}0.00`}
            </div>
            {dspDifference && dspDifference.total_roas ? (
              <DifferenceAdMetric
                value={dspDifference.total_roas}
                type="totalRoas"
              />
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </CardMetrics>
      </div>
      <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
        <CardMetrics className="fix-height">
          <div
            id="BT-dspad-totaldpvrcard"
            onClick={() => setBoxToggle('dspTotalDpvr', 'dsp')}
            role="presentation"
            className={setBoxClasses('dspTotalDpvr', 'ad-cos-active', 'dsp')}>
            <div className="chart-name">Total DPVR</div>
            <div className="number-rate">
              {dspCurrentTotal && dspCurrentTotal.total_dpvr
                ? `${addThousandComma(dspCurrentTotal.total_dpvr)}%`
                : `0.00%`}
            </div>
            <div className="vs">
              {dspPreviousTotal && dspPreviousTotal.total_dpvr
                ? `vs ${addThousandComma(dspPreviousTotal.total_dpvr)}%`
                : `vs 0.00%`}
            </div>
            {dspDifference && dspDifference.total_dpvr ? (
              <DifferenceAdMetric
                value={dspDifference.total_dpvr}
                type="dpvr"
              />
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </CardMetrics>
      </div>
      <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
        <CardMetrics className="fix-height">
          <div
            id="BT-dspad-TTLBrandcard"
            onClick={() => setBoxToggle('dspTtlNewBrandPurchases', 'dsp')}
            role="presentation"
            className={setBoxClasses(
              'dspTtlNewBrandPurchases',
              'ad-roas-active',
              'dsp',
            )}>
            <div className="chart-name">TTL New Brand Purchases </div>
            <div className="number-rate">
              {dspCurrentTotal && dspCurrentTotal.ttl_new_brand_purchases
                ? `${addThousandComma(
                    dspCurrentTotal.ttl_new_brand_purchases,
                  )}%`
                : `0.00%`}
            </div>
            <div className="vs">
              {' '}
              {dspPreviousTotal && dspPreviousTotal.ttl_new_brand_purchases
                ? `vs ${addThousandComma(
                    dspPreviousTotal.ttl_new_brand_purchases,
                  )}%`
                : `vs 0.00%`}
            </div>
            {dspDifference && dspDifference.ttl_new_brand_purchases ? (
              <DifferenceAdMetric
                value={dspDifference.ttl_new_brand_purchases}
              />
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </CardMetrics>
      </div>
      <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
        <CardMetrics className="fix-height">
          <div
            id="BT-dspad-productsalescard"
            onClick={() => setBoxToggle('dspProductSales', 'dsp')}
            role="presentation"
            className={setBoxClasses(
              'dspProductSales',
              'ad-click-active',
              'dsp',
            )}>
            <div className="chart-name">Product sales </div>
            <div className="number-rate">
              {dspCurrentTotal && dspCurrentTotal.product_sales
                ? `${currencySign}${addThousandComma(
                    dspCurrentTotal.product_sales,
                    2,
                  )}`
                : `${currencySign}0`}
            </div>
            <div className="vs">
              {dspPreviousTotal && dspPreviousTotal.product_sales
                ? `vs ${currencySign}${addThousandComma(
                    dspPreviousTotal.product_sales,
                    2,
                  )}`
                : `vs ${currencySign}0`}
            </div>
            {dspDifference && dspDifference.product_sales ? (
              <DifferenceAdMetric value={dspDifference.product_sales} />
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </CardMetrics>
      </div>
      <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
        <CardMetrics className="fix-height">
          <div
            id="BT-dspad-roascard"
            onClick={() => setBoxToggle('dspRoas', 'dsp')}
            role="presentation"
            className={setBoxClasses('dspRoas', 'ad-clickrate-active', 'dsp')}>
            <div className="chart-name">ROAS </div>
            <div className="number-rate">
              {dspCurrentTotal && dspCurrentTotal.roas
                ? `${currencySign}${addThousandComma(dspCurrentTotal.roas)}`
                : `${currencySign}0.00`}
            </div>
            <div className="vs">
              {dspPreviousTotal && dspPreviousTotal.roas
                ? `vs ${currencySign}${addThousandComma(dspPreviousTotal.roas)}`
                : `vs ${currencySign}0.00`}
            </div>
            {dspDifference && dspDifference.roas ? (
              <DifferenceAdMetric value={dspDifference.roas} type="roas" />
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </CardMetrics>
      </div>
    </div>
  );
};

export default DSPMetrics;

DSPMetrics.defaultProps = {
  currencySymbol: '$',
};

DSPMetrics.propTypes = {
  setBoxToggle: func.isRequired,
  setBoxClasses: func.isRequired,
  dspCurrentTotal: oneOfType([object, array]).isRequired,
  dspPreviousTotal: oneOfType([object, array]).isRequired,
  dspDifference: oneOfType([object, array]).isRequired,
  currencySymbol: string,
};
