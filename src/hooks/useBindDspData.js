import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

let tempData = [];
const useBindDSPResponseData = (response) => {
  const [dspCurrentTotal, setDspCurrentTotal] = useState([]);
  const [dspPreviousTotal, setDspPreviousTotal] = useState([]);
  const [dspDifference, setDspDifference] = useState([]);

  // filterout previous data in one temporary object.
  useEffect(() => {
    tempData = [];
    setDspCurrentTotal([]);
    setDspPreviousTotal([]);
    setDspDifference([]);
    if (response !== null) {
      if (response.previous && response.previous.length) {
        response.previous.forEach((item) => {
          const previousDate = dayjs(item.report_date).format('MMM D YYYY');
          tempData.push({
            dspImpressionsPrevious: item.impressions,
            dspSpendPrevious: item.dsp_spend,
            dspTotalProductSalesPrevious: item.total_product_sales,
            dspTotalRoasPrevious: item.total_roas,
            dspTotalDpvrPrevious: item.total_dpvr,
            dspTtlNewBrandPurchasesPrevious: item.ttl_new_brand_purchases,
            dspProductSalesPrevious: item.product_sales,
            dspRoasPrevious: item.roas,
            previousDate,

            dspImpressionsPreviousLabel:
              item.impressions !== null ? item.impressions.toFixed(2) : '0.00',
            dspSpendPreviousLabel:
              item.dsp_spend !== null ? item.dsp_spend.toFixed(2) : '0.00',
            dspTotalProductSalesPreviousLabel:
              item.total_product_sales !== null
                ? item.total_product_sales.toFixed(2)
                : '0.00',
            dspTotalRoasPreviousLabel:
              item.total_roas !== null ? item.total_roas.toFixed(2) : '0',
            dspTotalDpvrPreviousLabel:
              item.total_dpvr !== null ? item.total_dpvr.toFixed(2) : '0.00',
            dspTtlNewBrandPurchasesPreviousLabel:
              item.ttl_new_brand_purchases !== null
                ? item.ttl_new_brand_purchases
                : '0',
            dspProductSalesPreviousLabel:
              item.product_sales !== null
                ? item.product_sales.toFixed(2)
                : '0.00',
            dspRoasPreviousLabel:
              item.roas !== null ? item.roas.toFixed(2) : '0.00',
          });
        });
      }

      // filterout current data in one temporary object.
      if (response.current && response.current.length) {
        response.current.forEach((item, index) => {
          const currentReportDate = dayjs(item.report_date).format(
            'MMM D YYYY',
          );
          // add the current data at same index of prevoius in temporary object
          if (response.previous && index < response.previous.length) {
            tempData[index].date = currentReportDate;
            tempData[index].dspImpressionsCurrent = item.impressions;
            tempData[index].dspSpendCurrent = item.dsp_spend;
            tempData[index].dspTotalProductSalesCurrent =
              item.total_product_sales;
            tempData[index].dspTotalRoasCurrent = item.total_roas;
            tempData[index].dspTotalDpvrCurrent = item.total_dpvr;
            tempData[index].dspTtlNewBrandPurchasesCurrent =
              item.ttl_new_brand_purchases;
            tempData[index].dspProductSalesCurrent = item.product_sales;
            tempData[index].dspRoasCurrent = item.roas;

            tempData[index].dspImpressionsCurrentLabel =
              item.impressions !== null ? item.impressions.toFixed(2) : '0.00';
            tempData[index].dspSpendCurrentLabel =
              item.dsp_spend !== null ? item.dsp_spend.toFixed(2) : '0.00';
            tempData[index].dspTotalProductSalesCurrentLabel =
              item.total_product_sales !== null
                ? item.total_product_sales.toFixed(2)
                : '0.00';
            tempData[index].dspTotalRoasCurrentLabel =
              item.total_roas !== null ? item.total_roas.toFixed(2) : '0';
            tempData[index].dspTotalDpvrCurrentLabel =
              item.total_dpvr !== null ? item.total_dpvr.toFixed(2) : '0.00';
            tempData[index].dspTtlNewBrandPurchasesCurrentLabel =
              item.ttl_new_brand_purchases !== null
                ? item.ttl_new_brand_purchases.toFixed(2)
                : '0.00';
            tempData[index].dspProductSalesCurrentLabel =
              item.product_sales !== null ? item.product_sales : '0';
            tempData[index].dspRoasCurrentLabel =
              item.roas !== null ? item.roas.toFixed(2) : '0.00';
          } else {
            // if current data count is larger than previous count then
            // generate separate key for current data and defien previou value null and previous label 0
            tempData.push({
              dspImpressionsCurrent: item.impressions,
              dspSpendCurrent: item.dsp_spend,
              dspTotalProductSalesCurrent: item.total_product_sales,
              dspTotalRoasCurrent: item.total_roas,
              dspTotalDpvrCurrent: item.total_dpvr,
              dspTtlNewBrandPurchasesCurrent: item.ttl_new_brand_purchases,
              dspProductSalesCurrent: item.product_sales,
              dspRoasCurrent: item.roas,
              date: currentReportDate,

              dspImpressionsPrevious: null,
              dspSpendPrevious: null,
              dspTotalProductSalesPrevious: null,
              dspTotalRoasPrevious: null,
              dspTotalDpvrPrevious: null,
              dspTtlNewBrandPurchasesPrevious: null,
              dspProductSalesPrevious: null,
              dspRoasPrevious: null,

              dspImpressionsCurrentLabel:
                item.impressions !== null
                  ? item.impressions.toFixed(2)
                  : '0.00',
              dspSpendCurrentLabel:
                item.dsp_spend !== null ? item.dsp_spend.toFixed(2) : '0.00',
              dspTotalProductSalesCurrentLabel:
                item.total_product_sales !== null
                  ? item.total_product_sales.toFixed(2)
                  : '0.00',
              dspTotalRoasCurrentLabel:
                item.total_roas !== null ? item.total_roas.toFixed(2) : '0',
              dspTotalDpvrCurrentLabel:
                item.total_dpvr !== null ? item.total_dpvr.toFixed(2) : '0.00',
              dspTtlNewBrandPurchasesCurrentLabel:
                item.ttl_new_brand_purchases !== null
                  ? item.ttl_new_brand_purchases.toFixed(2)
                  : '0.00',
              dspProductSalesCurrentLabel:
                item.product_sales !== null ? item.product_sales : '0',
              dspRoasCurrentLabel:
                item.roas !== null ? item.roas.toFixed(2) : '0.00',

              dspImpressionsPreviousLabel: '0.00',
              dspSpendPreviousLabel: '0.00',
              dspTotalProductSalesPreviousLabel: '0.00',
              dspTotalRoasPreviousLabel: '0',
              dspTotalDpvrPreviousLabel: '0.00',
              dspTtlNewBrandPurchasesPreviousLabel: '0.00',
              dspProductSalesPreviousLabel: '0',
              dspRoasPreviousLabel: '0.00',
            });
          }
        });
      }
      // filterout the dsp current total, previous total, and diffrence
      if (response && response.current_sum) {
        setDspCurrentTotal(response.current_sum);
      } else {
        setDspCurrentTotal([]);
      }
      if (response && response.previous_sum) {
        setDspPreviousTotal(response.previous_sum);
      } else {
        setDspPreviousTotal([]);
      }
      if (response && response.difference_data) {
        setDspDifference(response.difference_data);
      } else {
        setDspDifference([]);
      }
    } else {
      setDspCurrentTotal([]);
      setDspPreviousTotal([]);
      setDspDifference([]);
      tempData = [];
    }
  }, [response]);
  return {
    dspChartData: tempData,
    dspCurrentTotal,
    dspPreviousTotal,
    dspDifference,
  };
};

export default useBindDSPResponseData;
