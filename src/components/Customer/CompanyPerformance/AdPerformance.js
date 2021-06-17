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
} from '../../../theme/images/index';
import { DropDown } from './DropDown';
import { ModalBox, Button, WhiteCard, DropDownSelect } from '../../../common';
import {
  dateOptions,
  AdTypesOptions,
} from '../../../constants/CompanyPerformanceConstants';
import { getAdPerformance, getDSPPerformance } from '../../../api';
import DSPPerformanceChart from './DSPPerformanceChart';
import AdPerformanceChart from './AdPerformanceChart';
// import { adResData, dspResData } from './DummyApiRes';

const getSymbolFromCurrency = require('currency-symbol-map');
const _ = require('lodash');

export default function AdPerformance({ marketplaceChoices, id }) {
  const { Option, SingleValue } = components;
  const [marketplaceOptions, setMarketplaceOptions] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [selectedAdType, setSelectedAdType] = useState('all');
  const [selectedAdDF, setSelectedAdDF] = useState('week');
  const [selectedDSPDF, setSelectedDSPDF] = useState('week');
  const [selectedAdBox, setSelectedAdBox] = useState({ adSales: true });
  const [adGroupBy, setAdGroupBy] = useState('daily');
  const [adChartData, setAdChartData] = useState([]);
  const [adCurrentTotal, setAdCurrentTotal] = useState([]);
  const [adPreviousTotal, setAdPreviousTotal] = useState([]);
  const [difference, setDifference] = useState([]);
  const [isApiCall, setIsApiCall] = useState(false);

  const [dspGroupBy, setDSPGroupBy] = useState('daily');
  const [dspChartData, setDSPChartData] = useState([]);
  const [dspTotal, setDSPTotal] = useState({});

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  const [adState, setAdState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'adSelection',
    },
  ]);
  const [dspState, setDSPState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'dspSelection',
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
  const [showDSPCustomDateModal, setShowDSPCustomDateModal] = useState(false);
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
        let indexNumber = index;
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

          // to add the dotted line. we have to check null matrix and add the dummy number like 8
          if (index > 0) {
            indexNumber = index - 1;
          } else {
            indexNumber = index;
          }
          tempData[indexNumber].adSalesDashLength =
            item.ad_sales === null ? 8 : null;
          tempData[indexNumber].adSpendDashLength =
            item.ad_spend === null ? 8 : null;
          tempData[indexNumber].adConversionDashLength =
            item.ad_conversion_rate === null ? 8 : null;
          tempData[indexNumber].impressionsDashLength =
            item.impressions === null ? 8 : null;
          tempData[indexNumber].adCosDashLength = item.acos === null ? 8 : null;
          tempData[indexNumber].adRoasDashLength =
            item.roas === null ? 8 : null;
          tempData[indexNumber].adClicksDashLength =
            item.clicks === null ? 8 : null;
          tempData[indexNumber].adClickRateDashLength =
            item.ctr === null ? 8 : null;
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
      setDifference(response.daily_facts.difference_data);
    } else {
      setDifference([]);
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
          DspPrevious: item.daily_dsp_spend_report,
          previousDate,

          DspPreviousLabel:
            item.daily_dsp_spend_report !== null
              ? item.daily_dsp_spend_report.toFixed(2)
              : '0.00',
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
          tempData[index].DspCurrent = item.daily_dsp_spend_report;

          tempData[index].DspCurrentLabel =
            item.daily_dsp_spend_report !== null
              ? item.daily_dsp_spend_report.toFixed(2)
              : '0.00';

          // to add the dotted line. we have to check null matrix and add the dummy number like 8
          if (index > 0) {
            tempData[index - 1].DspdashLength =
              item.daily_dsp_spend_report === null ? 8 : null;
          } else {
            tempData[index].DspdashLength =
              item.daily_dsp_spend_report === null ? 8 : null;
          }
        } else {
          // if current data count is larger than previous count then
          // generate separate key for current data and defien previou value null and previous label 0
          tempData.push({
            DspCurrent: item.daily_dsp_spend_report,
            date: currentReportDate,
            DspPrevious: null,

            DspCurrentLabel:
              item.daily_dsp_spend_report !== null
                ? item.daily_dsp_spend_report.toFixed(2)
                : '0.00',
            DspPreviousLabel: '0.00',
          });
        }
      });
    }
    // filterout the dsp current total, previous total, and diffrence
    if (response.dsp_spend) {
      let dspTempData = {};
      const dspCurrent =
        response.dsp_spend &&
        response.dsp_spend.current_sum &&
        response.dsp_spend.current_sum.daily_dsp_spend_report;
      const dspPrevious =
        response.dsp_spend &&
        response.dsp_spend.previous_sum &&
        response.dsp_spend.previous_sum.daily_dsp_spend_report;
      const dspDifference =
        response.dsp_spend &&
        response.dsp_spend.difference_data &&
        response.dsp_spend.difference_data.daily_dsp_spend_report;

      dspTempData = {
        currentDspTodal: dspCurrent !== null ? dspCurrent : '0.00',
        previousDspTodal: dspPrevious !== null ? dspPrevious : '0.00',
        dspDifference,
      };
      setDSPTotal(dspTempData);
    } else {
      setDSPTotal({});
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
        }
        if (res && res.status === 200) {
          if (res.data && res.data.daily_facts) {
            const adGraphData = bindAdResponseData(res.data);
            setAdChartData(adGraphData);
          } else {
            setAdChartData([]);
            setAdPreviousTotal([]);
            setAdCurrentTotal([]);
            setDifference([]);
          }
          setIsApiCall(false);
        }
      });

      // const adGraphData = bindAdResponseData(adResData);
      // setAdChartData(adGraphData);
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
        }
        if (res && res.status === 200) {
          if (res.data && res.data.dsp_spend) {
            const dspGraphData = bindDSPResponseData(res.data);
            setDSPChartData(dspGraphData);
          } else {
            setDSPChartData([]);
            setDSPTotal({});
          }
          setIsApiCall(false);
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

      getDSPData(selectedDSPDF, dspGroupBy, list[0].value);
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
    selectedDSPDF,
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

  const applyCustomDate = (flag) => {
    if (flag === 'AdDate') {
      ADYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        selectedMarketplace,
        selectedAdType,
      );
      setShowAdCustomDateModal(false);
    } else {
      DSPYearAndCustomDateFilter(
        dspState[0].startDate,
        dspState[0].endDate,
        'custom',
      );
      setShowDSPCustomDateModal(false);
    }
  };

  const singleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
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
    } else {
      getAdData(selectedAdType, selectedAdDF, adGroupBy, event.value);
    }
    if (selectedDSPDF === 'custom') {
      DSPYearAndCustomDateFilter(
        dspState[0].startDate,
        dspState[0].endDate,
        'custom',
        event.value,
      );
    } else {
      getDSPData(selectedDSPDF, dspGroupBy, event.value);
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
      // getDSPData(selectedDSPDF, value, selectedMarketplace);
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
        selectedAdType,
      );
    } else if (value === 'custom') {
      setShowAdCustomDateModal(true);
    } else {
      setGropuByFilter(value, 'ad');
    }
  };

  const handleDSPDailyFact = (event) => {
    const { value } = event;
    setSelectedDSPDF(value);
    if (value !== 'custom') {
      setDSPState([
        {
          startDate: currentDate,
          endDate: currentDate,
          key: 'dspSelection',
        },
      ]);
    }
    if (value === 'year') {
      DSPYearAndCustomDateFilter(
        new Date(new Date().getFullYear(), 0, 1),
        new Date(),
        'year',
      );
    } else if (value === 'custom') {
      setShowDSPCustomDateModal(true);
    } else {
      setGropuByFilter(value, 'dsp');
    }
  };

  const setBoxToggle = (name) => {
    if (
      Object.prototype.hasOwnProperty.call(selectedAdBox, name) &&
      _.size(selectedAdBox) > 1
    ) {
      setSelectedAdBox(_.omit(selectedAdBox, [name]));
    } else if (_.size(selectedAdBox) < 4) {
      setSelectedAdBox(_.omit(_.assign(selectedAdBox, { [name]: true })));
    }
  };

  const setAdBoxClass = (name, classValue) => {
    let selectedClass = '';
    if (Object.prototype.hasOwnProperty.call(selectedAdBox, name)) {
      if (_.size(selectedAdBox) === 1) {
        selectedClass = 'order-chart-box active fix-height';
      } else {
        selectedClass = `order-chart-box ${classValue} fix-height`;
      }
    } else if (_.size(selectedAdBox) === 4) {
      selectedClass = 'order-chart-box fix-height disabled';
    } else {
      selectedClass = 'order-chart-box fix-height';
    }
    return selectedClass;
  };

  const bindValues = (value, fontSize) => {
    const decimal = _.split(value, '.', 2);
    if (decimal[1] !== undefined) {
      return (
        <span style={{ fontSize }}>
          {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          {/* <span style={{ fontSize: '16px' }}>.{decimal[1].slice(0, 2)}</span> */}
          <span>.{decimal[1].slice(0, 2)}</span>
        </span>
      );
    }
    return (
      <span style={{ fontSize }}>
        {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        {/* <span style={{ fontSize: '16px' }}>.00</span> */}
        <span>.00</span>
      </span>
    );
  };

  /// ////////// start rendering hrml component ///////////
  const renderMarketplaceDropDown = () => {
    return (
      <div className="row">
        <div className="col-12 mb-3">
          {/* {DropDown(
            'cursor',
            marketplaceOptions,
            marketplaceOptions &&
              marketplaceOptions[0] &&
              marketplaceOptions[0].label,
            DropdownIndicator,
            marketplaceOptions && marketplaceOptions[0],
            handleMarketplaceOptions,
          )} */}
          <DropDownSelect className="cursor ">
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
      </div>
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
            <li className="ad-performance">
              {' '}
              {DropDown(
                'days-performance',
                AdTypesOptions,
                null,
                getSelectComponents,
                AdTypesOptions[0],
                handleAdType,
                isApiCall,
              )}
            </li>
            <li className="day-performance">
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
            </li>
          </ul>{' '}
        </div>
      </>
    );
  };

  const addThousandComma = (number, decimalDigits = 2) => {
    // let returnValue = number;
    // if (flag) {
    //   if (number >= 1000000000) {
    //     returnValue = `${parseInt(number / 1000000000, 10).toString()}B`;
    //   }
    //   if (number >= 1000000) {
    //     returnValue = `${parseInt(number / 1000000, 10).toString()}M`;
    //   }
    //   if (number >= 1000) {
    //     returnValue = `${parseInt(number / 1000, 10).toString()}K`;
    //   } else {
    //     returnValue = `${parseInt(number, 10).toString()}`;
    //   }
    //   return returnValue;
    // }
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
            onClick={() => setBoxToggle('adSales')}
            role="presentation"
            className={setAdBoxClass('adSales', 'ad-sales-active')}>
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
            {difference && difference.ad_sales ? (
              difference.ad_sales >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {difference.ad_sales}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {difference.ad_sales.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            onClick={() => setBoxToggle('adSpend')}
            role="presentation"
            className={setAdBoxClass('adSpend', 'ad-spend-active')}>
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

            {difference && difference.ad_spend ? (
              difference.ad_spend >= 0 ? (
                <div className="perentage-value grey mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={UpDowGrayArrow}
                    alt="arrow-down"
                  />
                  {difference.ad_spend}%
                </div>
              ) : (
                <div className="perentage-value grey mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={UpDowGrayArrow}
                    alt="arrow-down"
                  />
                  {difference.ad_spend.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value grey mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            onClick={() => setBoxToggle('adConversion')}
            role="presentation"
            className={setAdBoxClass('adConversion', 'ad-conversion-active')}>
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

            {difference && difference.ad_conversion_rate ? (
              difference.ad_conversion_rate >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {difference.ad_conversion_rate}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {difference.ad_conversion_rate.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            onClick={() => setBoxToggle('impressions')}
            role="presentation"
            className={setAdBoxClass('impressions', 'impression-active')}>
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
            {difference && difference.impressions ? (
              difference.impressions >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {addThousandComma(difference.impressions)}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {difference.impressions.toString().replace('-', '')}%
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
            className={setAdBoxClass('adCos', 'ad-cos-active')}>
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
            {difference && difference.acos ? (
              difference.acos >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {difference.acos}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {difference.acos.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adRoas')}
            role="presentation"
            className={setAdBoxClass('adRoas', 'ad-roas-active')}>
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
            {difference && difference.roas ? (
              difference.roas >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {difference.roas}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {difference.roas.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adClicks')}
            role="presentation"
            className={setAdBoxClass('adClicks', 'ad-click-active')}>
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
            {difference && difference.clicks ? (
              difference.clicks >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {difference.clicks}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {difference.clicks.toString().replace('-', '')}%
                </div>
              )
            ) : (
              <div className="perentage-value down mt-3 pt-1">N/A</div>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adClickRate')}
            role="presentation"
            className={setAdBoxClass('adClickRate', 'ad-clickrate-active')}>
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
            {difference && difference.ctr ? (
              difference.ctr >= 0 ? (
                <div className="perentage-value mt-3 pt-1">
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-down"
                  />
                  {difference.ctr}%
                </div>
              ) : (
                <div className="perentage-value down mt-3 pt-1">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-down"
                  />
                  {difference.ctr.toString().replace('-', '')}%
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
              <li>
                <div className="weeks">
                  <span
                    className={
                      _.size(selectedAdBox) === 1
                        ? 'orange circle'
                        : 'darkGray circle'
                    }
                  />
                  <span>Recent</span>
                </div>
              </li>
              {selectedAdDF !== 'custom' ? (
                <li>
                  <div className="weeks">
                    <span
                      className={
                        _.size(selectedAdBox) === 1
                          ? 'orange block'
                          : 'darkGray block'
                      }
                    />
                    <span>Previous</span>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
        <div
          className={
            _.size(selectedAdBox) === 1
              ? ' col-md-6 col-sm-12 order-md-2 order-1'
              : 'col-md-12 col-sm-12 order-md-2 order-1'
          }>
          {' '}
          <div className="days-container ">
            <ul className="days-tab">
              <li className={adFilters.daily === false ? 'disabled-tab' : ''}>
                {' '}
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

              <li className={adFilters.weekly === false ? 'disabled-tab' : ''}>
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

              <li className={adFilters.month === false ? 'disabled-tab' : ''}>
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

  const renderDSPDailyFacts = () => {
    return (
      <>
        <div className="col-6">
          {' '}
          <p className="black-heading-title mt-3 mb-2"> DSP Ad Performance</p>
        </div>
        <div className="col-6 text-right">
          {' '}
          {DropDown(
            'days-performance',
            dateOptions,
            null,
            getSelectComponents,
            dateOptions[0],
            handleDSPDailyFact,
            isApiCall,
          )}
          {/* <DropDownSelect className="days-performance">
            <Select classNamePrefix="react-select" className="active" />
          </DropDownSelect> */}
        </div>
      </>
    );
  };

  const renderDSPSpendTotals = () => {
    return (
      <>
        <div className="number-rate">
          {currencySymbol}
          {dspTotal && dspTotal.currentDspTodal
            ? bindValues(dspTotal.currentDspTodal, '26px')
            : '0.00'}
        </div>
        <div className="vs">
          vs {currencySymbol}
          {dspTotal && dspTotal.previousDspTodal
            ? bindValues(dspTotal.previousDspTodal, '16px')
            : '0.00'}{' '}
          <span
            className={
              dspTotal && dspTotal.dspDifference > 0
                ? 'perentage-value mt-3 ml-1'
                : 'perentage-value down mt-3 ml-1'
            }>
            {!Number.isNaN(dspTotal && dspTotal.dspDifference) &&
            dspTotal &&
            dspTotal.dspDifference > 0 ? (
              <img className="green-arrow" src={ArrowUpIcon} alt="arrow-up" />
            ) : !Number.isNaN(dspTotal && dspTotal.dspDifference) &&
              dspTotal &&
              dspTotal.dspDifference < 0 ? (
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
            ) : (
              ''
            )}
            {dspTotal &&
            dspTotal.dspDifference &&
            dspTotal &&
            dspTotal.dspDifference !== 'N/A'
              ? `${dspTotal.dspDifference.toString().replace('-', '')}%`
              : 'N/A'}

            {/* <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
            40.75%{' '} */}
          </span>
        </div>
      </>
    );
  };
  const renderDSPGroupBy = () => {
    return (
      <>
        <div className="row mt-4 mb-3">
          <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
            <ul className="rechart-item">
              <li>
                <div className="weeks">
                  <span className="black block" />
                  <span>Recent</span>
                </div>
              </li>
              {selectedDSPDF !== 'custom' ? (
                <li>
                  <div className="weeks">
                    <span className="gray block" />
                    <span>Previous</span>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>

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
                onClick={() => applyCustomDate('AdDate')}
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

  const renderDSPCustomDateModal = () => {
    return (
      <Modal
        isOpen={showDSPCustomDateModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowDSPCustomDateModal(false);
            setDSPState([
              {
                startDate: currentDate,
                endDate: currentDate,
                key: 'dspSelection',
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
                setDSPState([item.dspSelection]);
              }}
              showMonthAndYearPickers={false}
              ranges={dspState}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
              maxDate={currentDate}
              rangeColors={['#FF5933']}
              weekdayDisplayFormat="EEEEE"
              locale={enGB}
            />
            <div className="text-center mt-3">
              <Button
                onClick={() => applyCustomDate('DSPDate')}
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

  return (
    <AddPerformance>
      {renderMarketplaceDropDown()}
      <WhiteCard>
        <div className="row">{renderAdDailyFacts()}</div>
        <div className="row mr-1 ml-1">{renderAdBox()}</div>
        <div className="row mt-4 mb-3">{renderAdGroupBy()}</div>
        <AdPerformanceChart
          chartId="adChart"
          chartData={adChartData}
          currencySymbol={currencySymbol}
          selectedBox={selectedAdBox}
          selectedDF={selectedAdDF}
        />
      </WhiteCard>
      <WhiteCard className="mt-3 mb-3">
        <div className="row">{renderDSPDailyFacts()}</div>
        {renderDSPSpendTotals()}
        {renderDSPGroupBy()}
        <DSPPerformanceChart
          chartId="dspChart"
          chartData={dspChartData}
          currencySymbol={currencySymbol}
          selectedDF={selectedDSPDF}
        />
      </WhiteCard>
      {renderAdCustomDateModal()}
      {renderDSPCustomDateModal()}
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
