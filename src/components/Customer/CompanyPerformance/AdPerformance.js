/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import Modal from 'react-modal';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import dayjs from 'dayjs';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {
  ArrowDownIcon,
  CaretUp,
  CloseIcon,
  ArrowUpIcon,
  UpDowGrayArrow,
  ArrowRightBlackIcon,
} from '../../../theme/images/index';
import { DropDown } from './DropDown';
import {
  ModalBox,
  Button,
  WhiteCard,
  DropDownSelect,
  PageLoader,
} from '../../../common';
import {
  dateOptions,
  AdTypesOptions,
} from '../../../constants/CompanyPerformanceConstants';
import { getAdPerformance, getDSPPerformance } from '../../../api';
import DSPPerformanceChart from './DSPPerformanceChart';
import AdPerformanceChart from './AdPerformanceChart';

import Theme from '../../../theme/Theme';
import { DspAdPacing } from '../../BrandPartner';

const getSymbolFromCurrency = require('currency-symbol-map');
const _ = require('lodash');

export default function AdPerformance({
  marketplaceChoices,
  id,
  viewComponent,
  setViewComponent,
}) {
  const { Option, SingleValue } = components;
  const [marketplaceOptions, setMarketplaceOptions] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [selectedAdType, setSelectedAdType] = useState('all');
  const [selectedAdDF, setSelectedAdDF] = useState('week');
  const [selectedAdBox, setSelectedAdBox] = useState({ adSales: true });
  const [selectedDspBox, setSelectedDspBox] = useState({
    dspImpressions: true,
  });
  const [showDspAdPacingModal, setShowDspAdPacingModal] = useState({
    show: false,
  });
  const [adGroupBy, setAdGroupBy] = useState('daily');
  const [adChartData, setAdChartData] = useState([]);
  const [adCurrentTotal, setAdCurrentTotal] = useState([]);
  const [adPreviousTotal, setAdPreviousTotal] = useState([]);
  const [adDifference, setAdDifference] = useState([]);
  const [isApiCall, setIsApiCall] = useState(false);
  const [adGraphLoader, setAdGraphLoader] = useState(false);
  const [dspGraphLoader, setDspGraphLoader] = useState(false);

  const [dspGroupBy, setDSPGroupBy] = useState('daily');
  const [dspChartData, setDSPChartData] = useState([]);
  const [dspData, setDspData] = useState({});
  const [dspCurrentTotal, setDspCurrentTotal] = useState([]);
  const [dspPreviousTotal, setDspPreviousTotal] = useState([]);
  const [dspDifference, setDspDifference] = useState([]);
  const [isCustomDateApply, setIsCustomDateApply] = useState(false);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
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
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '420px ',
      width: '100% ',
      minHeight: '390px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

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
      // transform: 'translate(-50%, -50%)',
    },
  };
  const noDataMessage =
    'We are not pulling data for this dashboard. If we should, please file a help desk ticket and \n we will resolve this issue as soon as possible.';

  /// ////////////////////////////////////////////////////////////////////////
  //
  // function name: bindAdResponseData
  // Descrition : this function is used to manage the ad performance api response and
  // filter out this response.
  // required parameters : One
  // parameter Descrition: 1. response of ad performance api
  //
  /// ////////////////////////////////////////////////////////////////////////////////
  const bindAdResponseData = (response) => {
    const tempData = [];

    // filterout previous data in one temporary object.
    if (response.daily_facts.previous && response.daily_facts.previous.length) {
      response.daily_facts.previous.forEach((item) => {
        const previousDate = dayjs(item.report_date).format('MMM D YYYY');
        tempData.push({
          adSalesPrevious: item.ad_sales,
          adSpendPrevious: item.ad_spend,
          adConversionPrevious: item.ad_conversion_rate,
          impressionsPrevious: item.impressions,
          adCosPrevious: item.acos,
          adRoasPrevious: item.roas,
          adClicksPrevious: item.clicks,
          adClickRatePrevious: item.ctr,
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
        });
      });
    }

    // filterout current data in one temporary object.
    if (response.daily_facts.current && response.daily_facts.current.length) {
      response.daily_facts.current.forEach((item, index) => {
        const currentReportDate = dayjs(item.report_date).format('MMM D YYYY');
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
            date: currentReportDate,

            adSalesPrevious: null,
            adSpendPrevious: null,
            adConversionPrevious: null,
            impressionsPrevious: null,
            adCosPrevious: null,
            adRoasPrevious: null,
            adClicksPrevious: null,
            adClickRatePrevious: null,

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

            adSalesPreviousLabel: '0.00',
            adSpendPreviousLabel: '0.00',
            adConversionPreviousLabel: '0.00',
            impressionsPreviousLabel: '0',
            adCosPreviousLabel: '0.00',
            adRoasPreviousLabel: '0.00',
            adClicksPreviousLabel: '0',
            adClickRatePreviousLabel: '0.00',
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

  /// ////////////////////////////////////////////////////////////////////////
  //
  // function name: bindDSPResponseData
  // Descrition : this function is used to manage the DSP performance api response and
  // filter out this response.
  // required parameters : One
  // parameter Descrition: 1. response of DSP performance api
  //
  /// ////////////////////////////////////////////////////////////////////////////////

  const bindDSPResponseData = (response) => {
    const tempData = [];

    // filterout previous data in one temporary object.
    if (response.dsp_spend.previous && response.dsp_spend.previous.length) {
      response.dsp_spend.previous.forEach((item) => {
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
        const currentReportDate = dayjs(item.report_date).format('MMM D YYYY');
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

  /// ////////////////////////////////////////////////////////////////////////
  //
  // function name: getAdData
  // Descrition : this function is used to get the ad performace graph data
  // This functional internaly call the BE api
  // required parameters : Six
  // parameter Descrition: 1. advertisement type filter
  //  2. daily facts filter - required
  //  3. group by filter - required
  //  4. marketplace - required
  //  5. start date - optional
  //  6. end date - optional
  //
  /// ////////////////////////////////////////////////////////////////////////////////
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
      ).then((res) => {
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
      });
    },
    [id],
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
        if (res && res.status === 400) {
          setIsApiCall(false);
          setDspGraphLoader(false);
        }
        if (res && res.status === 200) {
          setDspData(res.data);
          if (res.data && res.data.dsp_spend) {
            const dspGraphData = bindDSPResponseData(res.data);

            setDSPChartData(dspGraphData);
          } else {
            setDSPChartData([]);
          }
          setIsApiCall(false);
          setDspGraphLoader(false);
        }
      });
    },
    [id],
  );

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
    setMarketplaceOptions(list);
    if (responseId === null && list.length && list[0].value !== null) {
      setSelectedMarketplace(list[0].value);
      setCurrency(list[0].currency);
      setCurrencySymbol(getSymbolFromCurrency(list[0].currency));
      getAdData(selectedAdType, selectedAdDF, adGroupBy, list[0].value);

      getDSPData(selectedAdDF, dspGroupBy, list[0].value);
      setResponseId('12345');
    }
  }, [
    getAdData,
    getDSPData,
    marketplaceChoices,
    responseId,
    selectedMarketplace,
    currencySymbol,
    currency,
    adGroupBy,
    dspGroupBy,
    selectedAdType,
    selectedAdDF,
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
    if (diffDays <= 60) {
      temp = 'daily';
      setAdFilters({ daily: true, weekly: false, month: false });
      setAdGroupBy('daily');
    } else if (diffDays > 60 && diffDays <= 180) {
      temp = 'weekly';
      setAdFilters({ daily: false, weekly: true, month: false });
      setAdGroupBy('weekly');
    } else if (diffDays > 180) {
      temp = 'monthly';
      setAdFilters({ daily: false, weekly: false, month: true });
      setAdGroupBy('monthly');
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

    if (diffDays <= 60) {
      temp = 'daily';
      setDSPFilters({ daily: true, weekly: false, month: false });
      setDSPGroupBy('daily');
    } else if (diffDays > 60 && diffDays <= 180) {
      temp = 'weekly';
      setDSPFilters({ daily: false, weekly: true, month: false });
      setDSPGroupBy('weekly');
    } else if (diffDays > 180) {
      temp = 'monthly';
      setDSPFilters({ daily: false, weekly: false, month: true });
      setDSPGroupBy('monthly');
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
      selectedAdType,
    );

    DSPYearAndCustomDateFilter(
      adState[0].startDate,
      adState[0].endDate,
      'custom',
    );

    setShowAdCustomDateModal(false);
  };

  const renderCustomDateSubLabel = (props) => {
    if (selectedAdDF === 'custom' && isCustomDateApply) {
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
          getAdData(selectedAdType, value, 'daily', selectedMarketplace);
          break;
        } else {
          setDSPFilters({ daily: true, weekly: false, month: false });
          setDSPGroupBy('daily');
          getDSPData(selectedAdType, value, 'daily', selectedMarketplace);
          break;
        }

      case 'month':
        if (type === 'ad') {
          setAdFilters({ daily: true, weekly: false, month: false });
          setAdGroupBy('daily');
          getAdData(selectedAdType, value, 'daily', selectedMarketplace);
          break;
        } else {
          setDSPFilters({ daily: true, weekly: false, month: false });
          setDSPGroupBy('daily');

          getDSPData(value, 'daily', selectedMarketplace);
          break;
        }

      case '30days':
        if (type === 'ad') {
          setAdFilters({ daily: true, weekly: false, month: false });
          setAdGroupBy('daily');
          getAdData(selectedAdType, value, 'daily', selectedMarketplace);
          break;
        } else {
          setDSPFilters({ daily: true, weekly: false, month: false });
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
    if (selectedAdDF === 'custom') {
      ADYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        event.value,
        selectedAdType,
      );

      DSPYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        event.value,
      );
    } else {
      getAdData(selectedAdType, selectedAdDF, adGroupBy, event.value);
      getDSPData(selectedAdDF, dspGroupBy, event.value);
    }
  };

  const handleAdGroupBy = (value) => {
    if (value !== adGroupBy) {
      setAdGroupBy(value);
      getAdData(selectedAdType, selectedAdDF, value, selectedMarketplace);
    }
  };

  const handleDSPGroupBy = (value) => {
    if (value !== dspGroupBy) {
      setDSPGroupBy(value);
      getDSPData(selectedAdDF, value, selectedMarketplace);
    }
  };

  const handleAdType = (event) => {
    const { value } = event;
    setSelectedAdType(value);

    if (selectedAdDF === 'custom') {
      ADYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        selectedMarketplace,
        value,
      );
    } else {
      getAdData(value, selectedAdDF, adGroupBy, selectedMarketplace);
    }
  };

  const handleAdDailyFact = (event) => {
    const { value } = event;
    setSelectedAdDF(value);
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
    if (value === 'custom') {
      setShowAdCustomDateModal(true);
    } else {
      setGropuByFilter(value, 'ad');
      setGropuByFilter(value, 'dsp');
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

  /// ////////// start rendering hrml component ///////////
  const renderMarketplaceDropDown = () => {
    return (
      <Tab className="mb-3">
        <WhiteCard>
          <ul className="tabs">
            <li
              className={viewComponent === 'salePerformance' ? 'active' : ''}
              onClick={() => setViewComponent('salePerformance')}
              role="presentation">
              Sales Performance
            </li>
            <li
              className={viewComponent === 'adPerformance' ? 'active' : ''}
              onClick={() => setViewComponent('adPerformance')}
              role="presentation">
              Ad Performance
            </li>
          </ul>
          <div className="row">
            <div className="col-md-4  col-sm-12 ">
              <div className="view-data-for mt-4 ">View data for</div>{' '}
            </div>
            <div className="col-md-4 col-sm-6 mt-2 pt-1 pl-0">
              {' '}
              <DropDownSelect
                id="BT-adperformancedata-countryfilter"
                className={isApiCall ? `cursor  disabled` : 'cursor '}>
                <Select
                  classNamePrefix="react-select"
                  className="active"
                  components={DropdownIndicator}
                  options={marketplaceOptions}
                  defaultValue={marketplaceOptions && marketplaceOptions[0]}
                  onChange={(event) => handleMarketplaceOptions(event)}
                  placeholder={
                    marketplaceOptions &&
                    marketplaceOptions[0] &&
                    marketplaceOptions[0].label
                  }
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      neutral50: '#1A1A1A',
                    },
                  })}
                />
              </DropDownSelect>
            </div>
            <div
              className="col-md-4 col-sm-6  mt-2 pt-1 pl-0 "
              id="BT-adperformancedata-daysfilter">
              {' '}
              {DropDown(
                'days-performance',
                dateOptions,
                null,
                getSelectComponents,
                dateOptions[0],
                handleAdDailyFact,
                isApiCall,
              )}
            </div>
          </div>
        </WhiteCard>
      </Tab>
    );
  };

  const renderAdDailyFacts = () => {
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
                null,
                getAdTypesSelectComponents,
                AdTypesOptions[0],
                handleAdType,
                isApiCall,
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

  const renderAdBox = () => {
    const currencySign = currencySymbol !== null ? currencySymbol : '';
    return (
      <>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-2">
          <div
            id="BT-sponsored-adsalescard"
            onClick={() => setBoxToggle('adSales', 'ad')}
            role="presentation"
            className={setBoxClasses('adSales', 'ad-sales-active', 'ad')}>
            <div className="chart-name">Ad Sales </div>
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
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            id="BT-sponsored-adspendcard"
            onClick={() => setBoxToggle('adSpend', 'ad')}
            role="presentation"
            className={setBoxClasses('adSpend', 'ad-spend-active', 'ad')}>
            <div className="chart-name">Ad Spend </div>
            <div className="number-rate">
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
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            id="BT-sponsored-adconversioncard"
            onClick={() => setBoxToggle('adConversion', 'ad')}
            role="presentation"
            className={setBoxClasses(
              'adConversion',
              'ad-conversion-active',
              'ad',
            )}>
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
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            id="BT-sponsored-impressionscard"
            onClick={() => setBoxToggle('impressions', 'ad')}
            role="presentation"
            className={setBoxClasses('impressions', 'impression-active', 'ad')}>
            <div className="chart-name">Impressions </div>
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
            id="BT-sponsored-Acoscard"
            onClick={() => setBoxToggle('adCos', 'ad')}
            role="presentation"
            className={setBoxClasses('adCos', 'ad-cos-active', 'ad')}>
            <div className="chart-name">Acos</div>
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
            id="BT-sponsored-Roascard"
            onClick={() => setBoxToggle('adRoas', 'ad')}
            role="presentation"
            className={setBoxClasses('adRoas', 'ad-roas-active', 'ad')}>
            <div className="chart-name">RoAS </div>
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
            id="BT-sponsored-clickcard"
            onClick={() => setBoxToggle('adClicks', 'ad')}
            role="presentation"
            className={setBoxClasses('adClicks', 'ad-click-active', 'ad')}>
            <div className="chart-name">Clicks </div>
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
            id="BT-sponsored-clickratecard"
            onClick={() => setBoxToggle('adClickRate', 'ad')}
            role="presentation"
            className={setBoxClasses(
              'adClickRate',
              'ad-clickrate-active',
              'ad',
            )}>
            <div className="chart-name">Click through rate </div>
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
      </>
    );
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
              {selectedAdDF !== 'custom' ? (
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
        <div
          className={
            _.size(selectedAdBox) === 1
              ? ' col-md-6 col-sm-12 order-md-2 order-1'
              : 'col-md-6 col-sm-12 order-md-2 order-1'
          }>
          {' '}
          <div className="days-container ">
            <ul className="days-tab">
              <li
                id=" BT-adperformance-days"
                className={adFilters.daily === false ? 'disabled-tab' : ''}>
                <input
                  className="d-none"
                  type="radio"
                  id="daysCheck"
                  name="flexRadioDefault"
                  value={adGroupBy}
                  checked={adFilters.daily}
                  onClick={() => handleAdGroupBy('daily')}
                  onChange={() => {}}
                />
                <label htmlFor="daysCheck">Daily</label>
              </li>

              <li
                id=" BT-adperformance-weekly"
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
                id=" BT-adperformance-monthly"
                className={adFilters.month === false ? 'disabled-tab' : ''}>
                <input
                  className=" d-none"
                  type="radio"
                  id="monthlyCheck"
                  name="flexRadioDefault"
                  value={adGroupBy}
                  checked={adFilters.month}
                  onChange={() => handleAdGroupBy('monthly')}
                />
                <label htmlFor="monthlyCheck">Monthly</label>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  };

  const renderDSPBox = () => {
    const currencySign = currencySymbol !== null ? currencySymbol : '';
    return (
      <>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-2">
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
              dspDifference.impressions >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.impressions}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.impressions.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
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
              dspDifference.dsp_spend >= 0 ? (
                <div className="perentage-value grey mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={UpDowGrayArrow}
                    alt="arrow-down"
                  />
                  {dspDifference.dsp_spend}%
                </div>
              ) : (
                <div className="perentage-value grey mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={UpDowGrayArrow}
                    alt="arrow-down"
                  />
                  {dspDifference.dsp_spend.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value grey mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
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
              dspDifference.total_product_sales >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.total_product_sales}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.total_product_sales
                    .toString()
                    .replace('-', '')}
                  %
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
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
              dspDifference.total_roas >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {addThousandComma(dspDifference.total_roas)}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.total_roas.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
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
              dspDifference.total_dpvr < 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.total_dpvr.toString().replace('-', '')}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.total_dpvr}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
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
              dspDifference.ttl_new_brand_purchases >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.ttl_new_brand_purchases}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.ttl_new_brand_purchases
                    .toString()
                    .replace('-', '')}
                  %
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
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
              dspDifference.product_sales >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.product_sales}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.product_sales.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
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
              dspDifference.roas >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.roas}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {dspDifference.roas.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
      </>
    );
  };
  const renderDSPGroupBy = () => {
    return (
      <>
        <div className="row mt-4 mb-3">
          {_.size(selectedDspBox) <= 2 ? (
            <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
              <ul className="rechart-item">
                <li>
                  <div className="weeks">
                    <span
                      className={
                        _.size(selectedDspBox) === 1
                          ? `${_.keys(selectedDspBox)[0]} circle`
                          : 'darkGray circle'
                      }
                    />

                    <span>Recent</span>
                  </div>
                </li>
                {selectedAdDF !== 'custom' ? (
                  <li>
                    <div className="weeks">
                      <ul className="dashed-line">
                        <li
                          className={
                            _.size(selectedDspBox) === 1
                              ? `${_.keys(selectedDspBox)[0]} block`
                              : 'darkGray block'
                          }
                        />
                        <li
                          className={
                            _.size(selectedDspBox) === 1
                              ? `${_.keys(selectedDspBox)[0]} block`
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
            {' '}
            <div className="days-container ">
              <ul className="days-tab">
                <li
                  className={dspFilters.daily === false ? 'disabled-tab' : ''}>
                  {' '}
                  <input
                    className="d-none"
                    type="radio"
                    id="daysCheck"
                    name="flexRadioDefault1"
                    value={dspGroupBy}
                    checked={dspFilters.daily}
                    onClick={() => handleDSPGroupBy('daily')}
                    onChange={() => {}}
                  />
                  <label htmlFor="daysCheck">Daily</label>
                </li>

                <li
                  className={dspFilters.weekly === false ? 'disabled-tab' : ''}>
                  <input
                    className="d-none"
                    type="radio"
                    id="weeklyCheck"
                    name="flexRadioDefault1"
                    value={dspGroupBy}
                    checked={dspFilters.weekly && dspGroupBy === 'weekly'}
                    onChange={() => handleDSPGroupBy('weekly')}
                  />
                  <label htmlFor="weeklyCheck">Weekly</label>
                </li>

                <li
                  className={dspFilters.month === false ? 'disabled-tab' : ''}>
                  <input
                    className=" d-none"
                    type="radio"
                    id="monthlyCheck"
                    name="flexRadioDefault1"
                    value={dspGroupBy}
                    checked={dspFilters.month}
                    onChange={() => handleDSPGroupBy('monthly')}
                  />
                  <label htmlFor="monthlyCheck">Monthly</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAdCustomDateModal = () => {
    return (
      <Modal
        isOpen={showAdCustomDateModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
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
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body">
            <h4>Select Date Range</h4>
            <DateRange
              editableDateInputs
              onChange={(item) => {
                setAdState([item.adSelection]);
              }}
              showMonthAndYearPickers={false}
              ranges={adState}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
              maxDate={currentDate}
              rangeColors={['#FF5933']}
              weekdayDisplayFormat="EEEEE"
              locale={enGB}
            />
            <div className="text-center mt-3">
              <Button
                onClick={() => applyCustomDate()}
                type="button"
                className="btn-primary on-boarding   w-100">
                Apply
              </Button>
            </div>
          </div>
        </ModalBox>
      </Modal>
    );
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
        <DspAdPacing dspData={dspData} />
      </Modal>
    );
  };

  const displayDspPacingLabel = () => {
    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === 1
    ) {
      return (
        <span>
          Overspending
          <img
            className="right-arrow-icon"
            width="18px"
            src={ArrowRightBlackIcon}
            alt="arrow"
          />
        </span>
      );
    }
    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === 0
    ) {
      return (
        <span>
          On Track
          <img
            className="right-arrow-icon"
            width="18px"
            src={ArrowRightBlackIcon}
            alt="arrow"
          />
        </span>
      );
    }
    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === -1
    ) {
      return (
        <span>
          Underspending
          <img
            className="right-arrow-icon"
            width="18px"
            src={ArrowRightBlackIcon}
            alt="arrow"
          />
        </span>
      );
    }
    return '';
  };

  return (
    <AddPerformance>
      {renderMarketplaceDropDown()}
      {renderDspAdPacingModal()}
      <WhiteCard>
        <div className="row">{renderAdDailyFacts()}</div>
        <div className="row mr-1 ml-1">{renderAdBox()}</div>
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
            selectedDF={selectedAdDF}
          />
        ) : (
          <NoData>{noDataMessage}</NoData>
        )}
      </WhiteCard>
      <WhiteCard className="mt-3 mb-3">
        <div className="row">
          <div className="col-12">
            {' '}
            <p className="black-heading-title mt-3 mb-0"> DSP Ad Performance</p>
            <p className="gray-normal-text mb-4 mt-1">
              Monthly Budget Pacing (January):{' '}
              <span
                className="orange-text"
                role="presentation"
                onClick={() => setShowDspAdPacingModal({ show: true })}>
                {displayDspPacingLabel()}
              </span>
            </p>
          </div>
        </div>
        <div className="row mr-1 ml-1">{renderDSPBox()}</div>

        {renderDSPGroupBy()}
        {dspGraphLoader ? (
          <PageLoader
            component="performance-graph"
            color="#FF5933"
            type="detail"
            width={40}
            height={40}
          />
        ) : dspChartData.length >= 1 ? (
          <DSPPerformanceChart
            chartId="dspChart"
            chartData={dspChartData}
            currencySymbol={currencySymbol}
            selectedBox={selectedDspBox}
            selectedDF={selectedAdDF}
          />
        ) : (
          <NoData>{noDataMessage}</NoData>
        )}
      </WhiteCard>
      {renderAdCustomDateModal()}
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
`;

const Tab = styled.div`
  .tabs {
    list-style-type: none;
    position: relative;
    text-align: left;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid ${Theme.gray11};

    li {
      display: inline-block;
      margin-right: 60px;
      padding-bottom: 15px;
      font-weight: normal;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-family: ${Theme.baseFontFamily};
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &.a {
        text-decoration: none;
      }

      &.active {
        padding-bottom: 16px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
  .view-data-for {
    margin-right: 60px;
    font-weight: normal;
    color: ${Theme.black};
    font-size: ${Theme.extraMedium};
    font-family: ${Theme.baseFontFamily};
    width: 100%;
  }

  @media only screen and (max-width: 767px) {
    .tabs {
      li {
        font-size: 14px;
        margin-right: 25px;
      }
    }
    .view-data-for {
      text-align: center;
      padding-bottom: 10px;
  }
`;

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
