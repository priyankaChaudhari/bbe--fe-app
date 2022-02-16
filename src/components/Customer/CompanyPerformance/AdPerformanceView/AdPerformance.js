import React, { useEffect, useState, useCallback, useRef } from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Modal from 'react-modal';
import dayjs from 'dayjs';
import { components } from 'react-select';
import { arrayOf, func, instanceOf, shape, string } from 'prop-types';
import DSPPerformance from './DSPPerformance';
import SponsoredPerformance from './SponsoredPerformance';
import AdPerformanceFilters from './AdPerformanceFilters';
import { DspAdPacing } from '../../../BrandPartner';
import { CloseIcon } from '../../../../theme/images';
import { CustomDateModal, DropdownIndicator } from '../../../../common';
import { dateOptions, noGraphDataMessage } from '../../../../constants';
import {
  getAdPerformance,
  getDSPPerformance,
  getDspPacingData,
  getDSPPacingGraphData,
} from '../../../../api';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const getSymbolFromCurrency = require('currency-symbol-map');
const _ = require('lodash');

export default function AdPerformance({
  marketplaceChoices,
  id,
  accountType,
  getActivityLogInfo,
  memberData,
}) {
  const mounted = useRef(false);
  const { Option, SingleValue } = components;
  const [marketplaceOptions, setMarketplaceOptions] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(null);
  const [marketplaceDefaultValue, setMarketplaceDefaultValue] = useState([]);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [selectedAdType, setSelectedAdType] = useState({
    value: 'all',
    label: 'All Ad Types',
  });
  const [selectedAdDF, setSelectedAdDF] = useState({
    value: 'week',
    label: 'Recent 7 days',
    sub: 'vs Previous 7 days',
  });
  const [selectedAdBox, setSelectedAdBox] = useState({ adSales: true });
  const [selectedDspBox, setSelectedDspBox] = useState({
    dspImpressions: true,
  });
  const [showDspAdPacingModal, setShowDspAdPacingModal] = useState({
    show: false,
  });
  const [showDspBudgetModal, setShowDspBudgetModal] = useState(false);
  const [adGroupBy, setAdGroupBy] = useState('daily');
  const [performancePacingFlag, setPerformancePacingFlag] = useState(
    'performance',
  );
  const [adChartData, setAdChartData] = useState([]);
  const [adCurrentTotal, setAdCurrentTotal] = useState([]);
  const [adPreviousTotal, setAdPreviousTotal] = useState([]);
  const [adDifference, setAdDifference] = useState([]);
  const [isApiCall, setIsApiCall] = useState(false);
  const [adGraphLoader, setAdGraphLoader] = useState(false);
  const [dspGraphLoader, setDspGraphLoader] = useState(false);
  const [isDspPacingLoading, setIsDspPacingLoading] = useState(false);

  const [dspGroupBy, setDSPGroupBy] = useState('daily');
  const [dspChartData, setDSPChartData] = useState([]);
  const [dspPacingChartData, setDSPPacingChartData] = useState([]);
  const [dspData, setDspData] = useState({});
  const [dspCurrentTotal, setDspCurrentTotal] = useState([]);
  const [dspPreviousTotal, setDspPreviousTotal] = useState([]);
  const [dspDifference, setDspDifference] = useState([]);
  const [isCustomDateApply, setIsCustomDateApply] = useState(false);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  const [adState, setAdState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'adSelection',
    },
  ]);

  const [adFilters, setAdFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });

  const [dspFilters, setDSPFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });

  const [showAdCustomDateModal, setShowAdCustomDateModal] = useState(false);

  const customDspAdPacingStyles = {
    content: {
      top: '50%',
      right: '0px',
      bottom: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      maxHeight: '100%',
      overlay: ' {zIndex: 1000}',
      inset: '0% 0% 0% auto',
      marginRight: '0',
      borderRadius: '1px !important',
    },
  };

  const userInfo = useSelector((state) => state.userState.userInfo);
  const [isAllowToSplitBalance, setIsAllowToSplitBalance] = useState(false);
  useEffect(() => {
    if (userInfo?.role?.includes('Ad Manager Admin')) {
      setIsAllowToSplitBalance(true);
    } else {
      for (const user of memberData) {
        if (user.user) {
          if (
            (user?.role_group?.name === 'DSP Ad Manager' ||
              user?.role_group?.name === 'BGS Manager' ||
              user?.role_group?.name === 'BGS') &&
            user?.user?.id === userInfo?.id
          ) {
            setIsAllowToSplitBalance(true);
            break;
          }
        }
      }
    }
  }, [memberData, userInfo]);

  const bindAdResponseData = (response) => {
    const tempData = [];
    // filterout previous data in one temporary object.
    if (response.daily_facts.previous && response.daily_facts.previous.length) {
      response.daily_facts.previous.forEach((item) => {
        const previousDate = dayjs(item.revised_date).format('MMM D YYYY');
        tempData.push({
          adSalesPrevious: item.ad_sales,
          adSpendPrevious: item.ad_spend,
          adConversionPrevious: item.ad_conversion_rate,
          impressionsPrevious: item.impressions,
          adCosPrevious: item.acos,
          adRoasPrevious: item.roas,
          adClicksPrevious: item.clicks,
          adClickRatePrevious: item.ctr,
          costPerClickPrevious: item.cost_per_click,
          previousDate,

          adSalesPreviousLabel:
            item.ad_sales !== null ? item.ad_sales.toFixed(2) : '0.00',
          adSpendPreviousLabel:
            item.ad_spend !== null ? item.ad_spend.toFixed(2) : '0.00',
          adConversionPreviousLabel:
            item.ad_conversion_rate !== null
              ? item.ad_conversion_rate.toFixed(2)
              : '0.00',
          impressionsPreviousLabel:
            item.impressions !== null ? item.impressions : '0',
          adCosPreviousLabel:
            item.acos !== null ? item.acos.toFixed(2) : '0.00',
          adRoasPreviousLabel:
            item.roas !== null ? item.roas.toFixed(2) : '0.00',
          adClicksPreviousLabel: item.clicks !== null ? item.clicks : '0',
          adClickRatePreviousLabel:
            item.ctr !== null ? item.ctr.toFixed(2) : '0.00',
          costPerClickPreviousLabel:
            item.cost_per_click !== null
              ? item.cost_per_click.toFixed(2)
              : '0.00',
        });
      });
    }

    // filterout current data in one temporary object.
    if (response.daily_facts.current && response.daily_facts.current.length) {
      response.daily_facts.current.forEach((item, index) => {
        const currentReportDate = dayjs(item.revised_date).format('MMM D YYYY');
        // let indexNumber = index;
        // add the current data at same index of prevoius in temporary object
        if (
          response.daily_facts.previous &&
          index < response.daily_facts.previous.length
        ) {
          tempData[index].date = currentReportDate;
          tempData[index].adSalesCurrent = item.ad_sales;
          tempData[index].adSpendCurrent = item.ad_spend;
          tempData[index].adConversionCurrent = item.ad_conversion_rate;
          tempData[index].impressionsCurrent = item.impressions;
          tempData[index].adCosCurrent = item.acos;
          tempData[index].adRoasCurrent = item.roas;
          tempData[index].adClicksCurrent = item.clicks;
          tempData[index].adClickRateCurrent = item.ctr;
          tempData[index].costPerClickCurrent = item.cost_per_click;

          tempData[index].adSalesCurrentLabel =
            item.ad_sales !== null ? item.ad_sales.toFixed(2) : '0.00';
          tempData[index].adSpendCurrentLabel =
            item.ad_spend !== null ? item.ad_spend.toFixed(2) : '0.00';
          tempData[index].adConversionCurrentLabel =
            item.ad_conversion_rate !== null
              ? item.ad_conversion_rate.toFixed(2)
              : '0.00';
          tempData[index].impressionsCurrentLabel =
            item.impressions !== null ? item.impressions : '0';
          tempData[index].adCosCurrentLabel =
            item.acos !== null ? item.acos.toFixed(2) : '0.00';
          tempData[index].adRoasCurrentLabel =
            item.roas !== null ? item.roas.toFixed(2) : '0.00';
          tempData[index].adClicksCurrentLabel =
            item.clicks !== null ? item.clicks : '0';
          tempData[index].adClickRateCurrentLabel =
            item.ctr !== null ? item.ctr.toFixed(2) : '0.00';
          tempData[index].costPerClickCurrentLabel =
            item.cost_per_click !== null
              ? item.cost_per_click.toFixed(2)
              : '0.00';
        } else {
          // if current data count is larger than previous count then
          // generate separate key for current data and defien previou value null and previous label 0
          tempData.push({
            adSalesCurrent: item.ad_sales,
            adSpendCurrent: item.ad_spend,
            adConversionCurrent: item.ad_conversion_rate,
            impressionsCurrent: item.impressions,
            adCosCurrent: item.acos,
            adRoasCurrent: item.roas,
            adClicksCurrent: item.clicks,
            adClickRateCurrent: item.ctr,
            costPerClickCurrent: item.cost_per_click,
            date: currentReportDate,

            adSalesPrevious: null,
            adSpendPrevious: null,
            adConversionPrevious: null,
            impressionsPrevious: null,
            adCosPrevious: null,
            adRoasPrevious: null,
            adClicksPrevious: null,
            adClickRatePrevious: null,
            costPerClickPrevious: null,

            adSalesCurrentLabel:
              item.ad_sales !== null ? item.ad_sales.toFixed(2) : '0.00',
            adSpendCurrentLabel:
              item.ad_spend !== null ? item.ad_spend.toFixed(2) : '0.00',
            adConversionCurrentLabel:
              item.ad_conversion_rate !== null
                ? item.ad_conversion_rate.toFixed(2)
                : '0.00',
            impressionsCurrentLabel:
              item.impressions !== null ? item.impressions : '0',
            adCosCurrentLabel:
              item.acos !== null ? item.acos.toFixed(2) : '0.00',
            adRoasCurrentLabel:
              item.roas !== null ? item.roas.toFixed(2) : '0.00',
            adClicksCurrentLabel: item.clicks !== null ? item.clicks : '0',
            adClickRateCurrentLabel:
              item.ctr !== null ? item.ctr.toFixed(2) : '0.00',
            costPerClickCurrentLabel:
              item.cost_per_click !== null
                ? item.cost_per_click.toFixed(2)
                : '0.00',

            adSalesPreviousLabel: '0.00',
            adSpendPreviousLabel: '0.00',
            adConversionPreviousLabel: '0.00',
            impressionsPreviousLabel: '0',
            adCosPreviousLabel: '0.00',
            adRoasPreviousLabel: '0.00',
            adClicksPreviousLabel: '0',
            adClickRatePreviousLabel: '0.00',
            costPerClickPreviousLabel: '0.00',
          });
        }
      });
    }

    if (response.daily_facts && response.daily_facts.current_sum) {
      setAdCurrentTotal(response.daily_facts.current_sum);
    } else {
      setAdCurrentTotal([]);
    }
    if (response.daily_facts && response.daily_facts.previous_sum) {
      setAdPreviousTotal(response.daily_facts.previous_sum);
    } else {
      setAdPreviousTotal([]);
    }
    if (response.daily_facts && response.daily_facts.difference_data) {
      setAdDifference(response.daily_facts.difference_data);
    } else {
      setAdDifference([]);
    }

    return tempData;
  };

  const bindDSPResponseData = (response) => {
    const tempData = [];

    // filterout previous data in one temporary object.
    if (response.dsp_spend.previous && response.dsp_spend.previous.length) {
      response.dsp_spend.previous.forEach((item) => {
        const previousDate = dayjs(item.revised_date).format('MMM D YYYY');
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
            item.total_roas !== null ? item.total_roas : '0',
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
    if (response.dsp_spend.current && response.dsp_spend.current.length) {
      response.dsp_spend.current.forEach((item, index) => {
        const currentReportDate = dayjs(item.revised_date).format('MMM D YYYY');
        // add the current data at same index of prevoius in temporary object
        if (
          response.dsp_spend.previous &&
          index < response.dsp_spend.previous.length
        ) {
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
            item.total_roas !== null ? item.total_roas : '0';
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
              item.impressions !== null ? item.impressions.toFixed(2) : '0.00',
            dspSpendCurrentLabel:
              item.dsp_spend !== null ? item.dsp_spend.toFixed(2) : '0.00',
            dspTotalProductSalesCurrentLabel:
              item.total_product_sales !== null
                ? item.total_product_sales.toFixed(2)
                : '0.00',
            dspTotalRoasCurrentLabel:
              item.total_roas !== null ? item.total_roas : '0',
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
    if (response.dsp_spend && response.dsp_spend.current_sum) {
      setDspCurrentTotal(response.dsp_spend.current_sum);
    } else {
      setDspCurrentTotal([]);
    }
    if (response.dsp_spend && response.dsp_spend.previous_sum) {
      setDspPreviousTotal(response.dsp_spend.previous_sum);
    } else {
      setDspPreviousTotal([]);
    }
    if (response.dsp_spend && response.dsp_spend.difference_data) {
      setDspDifference(response.dsp_spend.difference_data);
    } else {
      setDspDifference([]);
    }
    return tempData;
  };

  const bindDSPPacingResponseData = (response) => {
    const tempData = [];

    // filterout previous data in one temporary object.
    if (response && response.length) {
      response.forEach((item) => {
        const monthYear = dayjs(item.month_year).format('MMM YY');
        tempData.push({
          monthYear,
          invoiceAmount: item.invoice_amount !== null ? item.invoice_amount : 0,
          invoiceAmountUsd:
            item.invoice_amount_converted_usd !== null
              ? item.invoice_amount_converted_usd
              : 0,
          carryOver: item.carry_over !== null ? item.carry_over : 0,
          carryOverUsd:
            item.carry_over_converted_usd !== null
              ? item.carry_over_converted_usd
              : 0,
          totalInitialBudget:
            item.total_budget !== null ? item.total_budget : 0,
          totalInitialbudgetUsd:
            item.total_budget_converted_usd !== null
              ? item.total_budget_converted_usd
              : 0,
          actualSpent: item.total_spend,
          actualSpentUsd: item.total_spend_converted_usd,
          dspPacingFlag: item.dsp_pacing_flag,
          colorCode: item.dsp_pacing_flag === '0' ? '#d6a307' : '#d63649',
        });
      });
    }
    return tempData;
  };

  const getAdData = useCallback(
    (
      adType,
      selectedDailyFact,
      selectedGroupBy,
      marketplace,
      startDate = null,
      endDate = null,
    ) => {
      setIsApiCall(true);
      setAdGraphLoader(true);
      getAdPerformance(
        id,
        adType,
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        startDate,
        endDate,
        accountType,
      ).then((res) => {
        if (mounted.current) {
          if (res && res.status === 400) {
            setIsApiCall(false);
            setAdGraphLoader(false);
          }
          if (res && res.status === 200) {
            if (res.data && res.data.daily_facts) {
              const adGraphData = bindAdResponseData(res.data);
              setAdChartData(adGraphData);
            } else {
              setAdChartData([]);
              setAdPreviousTotal([]);
              setAdCurrentTotal([]);
              setAdDifference([]);
            }
            setIsApiCall(false);
            setAdGraphLoader(false);
          }
        }
      });
    },
    [id, accountType],
  );

  const getDSPData = useCallback(
    (
      selectedDailyFact,
      selectedGroupBy,
      marketplace,
      startDate = null,
      endDate = null,
    ) => {
      setIsApiCall(true);
      setDspGraphLoader(true);
      getDSPPerformance(
        id,
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        startDate,
        endDate,
      ).then((res) => {
        if (mounted.current) {
          if (res && res.status === 400) {
            setIsApiCall(false);
            setDspGraphLoader(false);
          }
          if (res && res.status === 200) {
            if (res.data && res.data.dsp_spend) {
              const dspGraphData = bindDSPResponseData(res.data);
              setDSPChartData(dspGraphData);
            } else {
              setDSPChartData([]);
              setDspCurrentTotal([]);
              setDspPreviousTotal([]);
              setDspDifference([]);
            }
            setIsApiCall(false);
            setDspGraphLoader(false);
          }
        }
      });
    },
    [id],
  );

  const getDSPPacing = useCallback(
    (marketplace) => {
      setIsDspPacingLoading(true);
      getDspPacingData(id, marketplace).then((res) => {
        if (mounted.current) {
          if (res && res.status === 200) {
            setDspData(res.data);
            if (res?.data?.dsp_pacing?.escrow_converted_usd >= 0) {
              setIsAllowToSplitBalance(true);
            } else {
              setIsAllowToSplitBalance(false);
            }
          }
          setIsDspPacingLoading(false);
        }
      });
    },
    [id],
  );

  const getPacingGraphData = useCallback(
    (marketplace) => {
      setIsApiCall(true);
      setDspGraphLoader(true);
      getDSPPacingGraphData(id, marketplace).then((res) => {
        if (mounted.current) {
          if (res && res.status === 400) {
            setIsApiCall(false);
            setDspGraphLoader(false);
          }
          if (res && res.status === 200) {
            // setDspData(res.data);
            if (res.data && res.data.dsp_pacing_graph) {
              const dspPacingGraphData = bindDSPPacingResponseData(
                res.data && res.data.dsp_pacing_graph,
              );
              setDSPPacingChartData(dspPacingGraphData);
            } else {
              setDSPPacingChartData([]);
            }
            setIsApiCall(false);
            setDspGraphLoader(false);
          }
        }
      });
    },
    [id],
  );
  useEffect(() => {
    mounted.current = true;
    const list = [];
    if (marketplaceChoices && marketplaceChoices.length > 0)
      for (const option of marketplaceChoices) {
        list.push({
          value: option.name,
          label: option.country_currency.country,
          currency: option.country_currency.currency,
        });
      }
    setMarketplaceOptions(list);
    if (responseId === null && list.length && list[0].value !== null) {
      let marketplace = list[0];
      marketplace = list.filter((op) => op.value === 'Amazon.com');
      if (marketplace.length === 0) {
        marketplace[0] = _.nth(list, 0);
      }
      setMarketplaceDefaultValue(marketplace);
      setSelectedMarketplace(marketplace[0].value);
      setCurrency(marketplace[0].currency);
      setCurrencySymbol(getSymbolFromCurrency(marketplace[0].currency));
      getAdData(
        selectedAdType.value,
        selectedAdDF.value,
        adGroupBy,
        marketplace[0].value,
      );

      if (accountType !== 'vendor') {
        getDSPData(selectedAdDF.value, dspGroupBy, marketplace[0].value);
        getDSPPacing(marketplace[0].value);
      }
      setResponseId('12345');
    }

    return () => {
      mounted.current = false;
    };
  }, [
    getAdData,
    getDSPData,
    getDSPPacing,
    marketplaceChoices,
    responseId,
    selectedMarketplace,
    currencySymbol,
    currency,
    adGroupBy,
    dspGroupBy,
    selectedAdType,
    selectedAdDF,
    accountType,
  ]);

  const getDays = (startDate, endDate) => {
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const ADYearAndCustomDateFilter = (
    startDate,
    endDate,
    dailyFactFlag,
    marketplace,
    adType,
  ) => {
    let temp = '';
    let sd = startDate;
    let ed = endDate;
    const diffDays = getDays(startDate, endDate);
    if (diffDays <= 30) {
      temp = 'daily';
      setAdFilters({ daily: true, weekly: true, month: false });
      setAdGroupBy('daily');
    } else if (diffDays > 30 && diffDays <= 60) {
      temp = 'daily';
      setAdFilters({ daily: true, weekly: true, month: true });
      setAdGroupBy('daily');
    } else if (diffDays > 60) {
      temp = 'weekly';
      setAdFilters({ daily: false, weekly: true, month: true });
      setAdGroupBy('weekly');
    }

    if (dailyFactFlag === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;
      getAdData(adType, dailyFactFlag, temp, marketplace, sd, ed);
    } else {
      // dailyFactFlag==='year
      getAdData(adType, dailyFactFlag, temp, marketplace);
    }
  };

  const DSPYearAndCustomDateFilter = (
    startDate,
    endDate,
    value,
    marketplace = selectedMarketplace,
  ) => {
    let temp = '';

    let sd = startDate;
    let ed = endDate;
    const diffDays = getDays(startDate, endDate);

    if (diffDays <= 30) {
      temp = 'daily';
      setDSPFilters({ daily: true, weekly: true, month: false });
      setDSPGroupBy('daily');
    } else if (diffDays > 30 && diffDays <= 60) {
      temp = 'daily';
      setDSPFilters({ daily: true, weekly: true, month: true });
      setDSPGroupBy('daily');
    } else if (diffDays > 60) {
      temp = 'weekly';
      setDSPFilters({ daily: false, weekly: true, month: true });
      setDSPGroupBy('weekly');
    }

    if (value === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;

      getDSPData(value, temp, marketplace, sd, ed);
    } else {
      getDSPData(value, temp, marketplace);
    }
  };

  const applyCustomDate = () => {
    setIsCustomDateApply(true);
    ADYearAndCustomDateFilter(
      adState[0].startDate,
      adState[0].endDate,
      'custom',
      selectedMarketplace,
      selectedAdType.value,
    );

    DSPYearAndCustomDateFilter(
      adState[0].startDate,
      adState[0].endDate,
      'custom',
    );

    setShowAdCustomDateModal(false);
  };

  const renderCustomDateSubLabel = (props) => {
    if (selectedAdDF.value === 'custom' && isCustomDateApply) {
      return `From- ${dayjs(adState[0].startDate).format(
        'MMM D, YYYY',
      )}  To- ${dayjs(adState[0].endDate).format('MMM D, YYYY')}`;
    }

    return props.data.sub;
  };

  const singleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>
        {renderCustomDateSubLabel(props)}
      </div>
    </SingleValue>
  );

  const filterOption = (props) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>
          {props.data.label}
        </span>

        <div style={{ fontSize: '12px', color: '#556178' }}>
          {props.data.sub}
        </div>
      </div>
    </Option>
  );

  const adTypesSingleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
    </SingleValue>
  );

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropdownIndicator,
    };
  };

  const getAdTypesSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: adTypesSingleFilterOption,
      DropdownIndicator,
    };
  };

  const setGropuByFilter = (value, type) => {
    switch (value) {
      case 'week':
        if (type === 'ad') {
          setAdFilters({ daily: true, weekly: false, month: false });
          setAdGroupBy('daily');
          getAdData(selectedAdType.value, value, 'daily', selectedMarketplace);
          break;
        } else {
          setDSPFilters({ daily: true, weekly: false, month: false });
          setDSPGroupBy('daily');
          getDSPData(value, 'daily', selectedMarketplace);
          break;
        }

      case 'month':
        if (type === 'ad') {
          setAdFilters({ daily: true, weekly: true, month: false });
          setAdGroupBy('daily');
          getAdData(selectedAdType.value, value, 'daily', selectedMarketplace);
          break;
        } else {
          setDSPFilters({ daily: true, weekly: true, month: false });
          setDSPGroupBy('daily');

          getDSPData(value, 'daily', selectedMarketplace);
          break;
        }

      case '30days':
        if (type === 'ad') {
          setAdFilters({ daily: true, weekly: true, month: false });
          setAdGroupBy('daily');
          getAdData(selectedAdType.value, value, 'daily', selectedMarketplace);
          break;
        } else {
          setDSPFilters({ daily: true, weekly: true, month: false });
          setDSPGroupBy('daily');

          getDSPData(value, 'daily', selectedMarketplace);
          break;
        }

      default:
        break;
    }
  };

  const handleMarketplaceOptions = (event) => {
    setSelectedMarketplace(event.value);
    setCurrency(event.currency);
    setCurrencySymbol(getSymbolFromCurrency(event.currency));
    getDSPPacing(event.value);
    if (selectedAdDF.value === 'custom') {
      ADYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        event.value,
        selectedAdType.value,
      );

      DSPYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        event.value,
      );
    } else {
      getAdData(
        selectedAdType.value,
        selectedAdDF.value,
        adGroupBy,
        event.value,
      );
      getDSPData(selectedAdDF.value, dspGroupBy, event.value);
    }
    if (performancePacingFlag === 'pacing') {
      getPacingGraphData(event.value);
    }
  };

  const handleAdGroupBy = (value) => {
    if (value !== adGroupBy) {
      setAdGroupBy(value);

      if (selectedAdDF.value === 'custom') {
        const { startDate } = adState[0];
        const { endDate } = adState[0];
        let sd = startDate;
        let ed = endDate;
        sd = `${startDate.getDate()}-${
          startDate.getMonth() + 1
        }-${startDate.getFullYear()}`;
        ed = `${endDate.getDate()}-${
          endDate.getMonth() + 1
        }-${endDate.getFullYear()}`;

        getAdData(
          selectedAdType.value,
          selectedAdDF.value,
          value,
          selectedMarketplace,
          sd,
          ed,
        );
      } else {
        getAdData(
          selectedAdType.value,
          selectedAdDF.value,
          value,
          selectedMarketplace,
        );
      }
    }
  };

  const handleDSPGroupBy = (value) => {
    if (value !== dspGroupBy) {
      setDSPGroupBy(value);

      if (selectedAdDF.value === 'custom') {
        const { startDate } = adState[0];
        const { endDate } = adState[0];
        let sd = startDate;
        let ed = endDate;
        sd = `${startDate.getDate()}-${
          startDate.getMonth() + 1
        }-${startDate.getFullYear()}`;
        ed = `${endDate.getDate()}-${
          endDate.getMonth() + 1
        }-${endDate.getFullYear()}`;

        getDSPData(selectedAdDF.value, value, selectedMarketplace, sd, ed);
      } else {
        getDSPData(selectedAdDF.value, value, selectedMarketplace);
      }
    }
  };

  const handleAdType = (event) => {
    const { value } = event;
    setSelectedAdType(event);

    if (selectedAdDF.value === 'custom') {
      ADYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        selectedMarketplace,
        value,
      );
    } else {
      getAdData(value, selectedAdDF.value, adGroupBy, selectedMarketplace);
    }
  };

  const handleAdDailyFact = (event) => {
    const { value } = event;
    setSelectedAdDF(event);
    setIsCustomDateApply(false);
    if (value !== 'custom') {
      setAdState([
        {
          startDate: currentDate,
          endDate: currentDate,
          key: 'adSelection',
        },
      ]);
    }
    if (value === 'year') {
      ADYearAndCustomDateFilter(
        new Date(new Date().getFullYear(), 0, 1),
        new Date(),
        'year',
        selectedMarketplace,
        selectedAdType.value,
      );
      DSPYearAndCustomDateFilter(
        new Date(new Date().getFullYear(), 0, 1),
        new Date(),
        'year',
        selectedMarketplace,
      );
    }
    if (value === 'custom') {
      setShowAdCustomDateModal(true);
    } else {
      setGropuByFilter(value, 'ad');
      setGropuByFilter(value, 'dsp');
    }
  };

  const handlePeformancePacingFlag = (value) => {
    setPerformancePacingFlag(value);
    if (value === 'performance') {
      if (selectedAdDF.value === 'custom') {
        const { startDate } = adState[0];
        const { endDate } = adState[0];
        let sd = startDate;
        let ed = endDate;
        sd = `${startDate.getDate()}-${
          startDate.getMonth() + 1
        }-${startDate.getFullYear()}`;
        ed = `${endDate.getDate()}-${
          endDate.getMonth() + 1
        }-${endDate.getFullYear()}`;

        getDSPData(selectedAdDF.value, dspGroupBy, selectedMarketplace, sd, ed);
      } else {
        getDSPData(selectedAdDF.value, dspGroupBy, selectedMarketplace);
      }
    } else {
      getPacingGraphData(selectedMarketplace);
    }
  };

  const setBoxToggle = (name, GraphType) => {
    if (GraphType === 'ad') {
      if (
        Object.prototype.hasOwnProperty.call(selectedAdBox, name) &&
        _.size(selectedAdBox) > 1
      ) {
        setSelectedAdBox(_.omit(selectedAdBox, [name]));
      } else if (_.size(selectedAdBox) < 4) {
        setSelectedAdBox(_.omit(_.assign(selectedAdBox, { [name]: true })));
      }
    } else if (GraphType === 'dsp') {
      if (
        Object.prototype.hasOwnProperty.call(selectedDspBox, name) &&
        _.size(selectedDspBox) > 1
      ) {
        setSelectedDspBox(_.omit(selectedDspBox, [name]));
      } else if (_.size(selectedDspBox) < 4) {
        setSelectedDspBox(_.omit(_.assign(selectedDspBox, { [name]: true })));
      }
    }
  };

  const setBoxClasses = (name, classValue, graphType) => {
    let selectedClass = '';
    if (graphType === 'ad') {
      if (Object.prototype.hasOwnProperty.call(selectedAdBox, name)) {
        selectedClass = `order-chart-box ${classValue} fix-height`;
      } else if (_.size(selectedAdBox) === 4) {
        selectedClass = 'order-chart-box fix-height disabled';
      } else {
        selectedClass = 'order-chart-box fix-height';
      }
    } else if (graphType === 'dsp') {
      if (Object.prototype.hasOwnProperty.call(selectedDspBox, name)) {
        selectedClass = `order-chart-box ${classValue} fix-height`;
      } else if (_.size(selectedDspBox) === 4) {
        selectedClass = 'order-chart-box fix-height disabled';
      } else {
        selectedClass = 'order-chart-box fix-height';
      }
    }
    return selectedClass;
  };

  const renderDspAdPacingModal = () => {
    return (
      <Modal
        isOpen={showDspAdPacingModal.show}
        style={customDspAdPacingStyles}
        ariaHideApp={false}
        contentLabel="Add team modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => setShowDspAdPacingModal({ show: false })}
          role="presentation"
        />
        <DspAdPacing
          dspData={dspData}
          isDspPacingLoading={isDspPacingLoading}
          currencySymbol={currencySymbol}
          customerId={id}
          marketplace={selectedMarketplace}
          marketplaceOptions={marketplaceOptions}
          onModalClose={() => {
            if (selectedAdDF.value === 'custom') {
              DSPYearAndCustomDateFilter(
                adState[0].startDate,
                adState[0].endDate,
                'custom',
                selectedMarketplace,
              );
            } else {
              getDSPData(selectedAdDF.value, dspGroupBy, selectedMarketplace);
            }
            getDSPPacing(selectedMarketplace);
            if (performancePacingFlag !== 'performance')
              getPacingGraphData(selectedMarketplace);
          }}
          isAllowToSplitBalance={isAllowToSplitBalance}
          showDspBudgetModal={showDspBudgetModal}
          setShowDspBudgetModal={setShowDspBudgetModal}
          getActivityLogInfo={getActivityLogInfo}
        />
      </Modal>
    );
  };

  return (
    <AddPerformance>
      <AdPerformanceFilters
        marketplaceDefaultValue={marketplaceDefaultValue}
        marketplaceOptions={marketplaceOptions}
        handleMarketplaceOptions={handleMarketplaceOptions}
        dateOptions={dateOptions}
        getSelectComponents={getSelectComponents}
        DropdownIndicator={{ DropdownIndicator }}
        selectedAdDF={selectedAdDF}
        handleAdDailyFact={handleAdDailyFact}
        isApiCall={isApiCall}
      />
      {renderDspAdPacingModal()}

      {/* sponsored ad performance panel */}
      <SponsoredPerformance
        currencySymbol={currencySymbol}
        setSelectedAdBox={setSelectedAdBox}
        selectedAdBox={selectedAdBox}
        adCurrentTotal={adCurrentTotal}
        adPreviousTotal={adPreviousTotal}
        adDifference={adDifference}
        adGraphLoader={adGraphLoader}
        adChartData={adChartData}
        selectedAdDF={selectedAdDF}
        adFilters={adFilters}
        adGroupBy={adGroupBy}
        handleAdGroupBy={handleAdGroupBy}
        handleAdType={handleAdType}
        isApiCall={isApiCall}
        selectedAdType={selectedAdType}
        getAdTypesSelectComponents={getAdTypesSelectComponents}
      />

      {/* DSP ad performance panel */}

      {accountType === 'seller' ? (
        <DSPPerformance
          dspData={dspData}
          setShowDspAdPacingModal={setShowDspAdPacingModal}
          selectedDspBox={selectedDspBox}
          dspFilters={dspFilters}
          handleDSPGroupBy={handleDSPGroupBy}
          dspGroupBy={dspGroupBy}
          selectedAdDF={selectedAdDF}
          currencySymbol={currencySymbol}
          dspCurrentTotal={dspCurrentTotal}
          dspDifference={dspDifference}
          dspPreviousTotal={dspPreviousTotal}
          setBoxToggle={setBoxToggle}
          setBoxClasses={setBoxClasses}
          dspChartData={dspChartData}
          dspPacingChartData={dspPacingChartData}
          dspGraphLoader={dspGraphLoader}
          noGraphDataMessage={noGraphDataMessage}
          performancePacingFlag={performancePacingFlag}
          handlePeformancePacing={handlePeformancePacingFlag}
          isAllowToSplitBalance={isAllowToSplitBalance}
          setShowDspBudgetModal={setShowDspBudgetModal}
        />
      ) : null}

      <CustomDateModal
        id="BT-adperformance-daterange"
        isOpen={showAdCustomDateModal}
        ranges={adState}
        onClick={() => {
          setShowAdCustomDateModal(false);
          setAdState([
            {
              startDate: currentDate,
              endDate: currentDate,
              key: 'adSelection',
            },
          ]);
        }}
        onChange={(item) => {
          setAdState([item.adSelection]);
        }}
        onApply={() => applyCustomDate()}
        currentDate={currentDate}
      />
    </AddPerformance>
  );
}
AdPerformance.defaultProps = {
  marketplaceChoices: {},
  id: '',
  accountType: 'seller',
  memberData: [],
  data: {},
  getActivityLogInfo: () => {},
};

AdPerformance.propTypes = {
  marketplaceChoices: instanceOf(Object),
  id: string,
  accountType: string,
  memberData: arrayOf(shape({})),
  data: shape({
    label: string,
    sub: string,
  }),
  getActivityLogInfo: func,
};

const AddPerformance = styled.div`
  .ad-performance-nav {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: right;

    li {
      display: inline-block;
      margin-right: 6px;

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

  @media only screen and (max-width: 1255px) {
    .ad-performance-nav {
      li {
        &.ad-performance {
          max-width: 192px;
          width: 100%;
        }
        &.day-performance {
          max-width: 227px;
          width: 100%;
        }
      }
    }
  }
  @media only screen and (max-width: 1084px) {
    .ad-performance-nav {
      li {
        &.ad-performance {
          max-width: 165px;
          width: 100%;
        }
        &.day-performance {
          max-width: 210px;
          width: 100%;
        }
      }
    }
  }
  @media only screen and (max-width: 767px) {
    .ad-performance-nav {
      li {
        &.ad-performance {
          max-width: 100%;
          width: 100%;
          margin-bottom: 15px;
        }
        &.day-performance {
          max-width: 100%;
          width: 100%;
        }
      }
    }
  }
`;
