/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useEffect, useCallback, useRef } from 'react';

import $ from 'jquery';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { components } from 'react-select';
import { useMediaQuery } from 'react-responsive';

import SponsoredFilter from './SponsoredFilter';
import SponsoredAdMetric from './SponsoredAdMetrics';
import SponsoredKeyContribution from './SponsoredKeyContribution';
import AdPerformanceChart from '../../../Customer/CompanyPerformance/AdPerformanceView/AdPerformanceChart';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import {
  getManagersList,
  getAdManagerAdminGraphData,
  getKeyContributionData,
} from '../../../../api';
import {
  WhiteCard,
  PageLoader,
  DropDownIndicator,
  CustomDateModal,
  ToggleButton,
} from '../../../../common';
import {
  dateOptions,
  SponsoredAdTypeOptions,
  noGraphDataMessage,
} from '../../../../constants';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const getSymbolFromCurrency = require('currency-symbol-map');

export default function SponsoredDashboard({ marketplaceChoices, userInfo }) {
  const isAdManagerAdmin =
    (userInfo && userInfo.role === 'Ad Manager Admin') ||
    userInfo.role === 'BGS Manager';

  const isBGSManager = userInfo && userInfo.role === 'BGS Manager';
  const selectInputRef = useRef();
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const { Option, SingleValue } = components;
  const [adChartData, setAdChartData] = useState([]);
  const [adCurrentTotal, setAdCurrentTotal] = useState([]);
  const [adPreviousTotal, setAdPreviousTotal] = useState([]);
  const [adDifference, setAdDifference] = useState([]);
  const [selectedAdMetrics, setSelectedAdMetrics] = useState({ adSales: true });
  const [selectedAdDF, setSelectedAdDF] = useState({
    value: 'week',
    label: 'Recent 7 days',
    sub: 'vs Previous 7 days',
  });
  const [selectedAdManager, setSelectedAdManager] = useState(
    isAdManagerAdmin
      ? {
          value: 'all',
          label: isBGSManager ? 'All BGS' : 'All Ad Manager',
        }
      : { value: userInfo.id, label: '' },
  );
  const [adManagerList, setAdManagerList] = useState([]);
  const [selectedAdType, setSelectedAdType] = useState('all');
  const [marketplaceOptions, setMarketplaceOptions] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState({
    value: 'all',
    label: 'All Marketplaces',
    currency: 'USD',
  });
  const [isCustomDateApply, setIsCustomDateApply] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [adGraphLoader, setAdGraphLoader] = useState(false);

  const [selectedTabMetrics, setSelectedTabMetrics] = useState('adSales');

  const tab = isBGSManager
    ? 'contribution'
    : isAdManagerAdmin
    ? 'positive'
    : 'contribution';

  const [selectedContributionOption, setSelectedContributionOption] = useState(
    tab,
  );

  const [keyContributionLoader, setKeyContributionLoader] = useState(false);
  const [contributionData, setContributionData] = useState([]);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 2);
  const [adState, setAdState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'adSelection',
    },
  ]);
  const [showAdCustomDateModal, setShowAdCustomDateModal] = useState(false);
  const [adFilters, setAdFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });
  const [adGroupBy, setAdGroupBy] = useState('daily');
  const [pageNumber, setPageNumber] = useState();
  const [contributionCount, setContributionCount] = useState(null);

  const getAdManagersList = useCallback(() => {
    getManagersList(
      isBGSManager ? 'BGS' : 'Sponsored Advertising Ad Manager',
    ).then((adm) => {
      if (adm && adm.data && adm.data.length) {
        const list = [
          { value: 'all', label: isBGSManager ? 'All BGS' : 'All Ad Managers' },
        ];
        for (const brand of adm.data) {
          list.push({
            value: brand.id,
            label: `${brand.first_name} ${brand.last_name}`,
            icon:
              brand.documents &&
              brand.documents[0] &&
              Object.values(brand.documents[0]) &&
              Object.values(brand.documents[0])[0],
          });
        }
        setAdManagerList(list);
      }
    });
  }, [isBGSManager]);

  const bindAdResponseData = (response) => {
    const tempData = [];
    // filterout previous data in one temporary object.
    if (response.previous && response.previous.length) {
      response.previous.forEach((item) => {
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
    if (response.current && response.current.length) {
      response.current.forEach((item, index) => {
        const currentReportDate = dayjs(item.report_date).format('MMM D YYYY');
        // add the current data at same index of prevoius in temporary object
        if (response.previous && index < response.previous.length) {
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

    if (response && response.current_sum) {
      setAdCurrentTotal(response.current_sum);
    } else {
      setAdCurrentTotal([]);
    }
    if (response && response.previous_sum) {
      setAdPreviousTotal(response.previous_sum);
    } else {
      setAdPreviousTotal([]);
    }
    if (response && response.difference_data) {
      setAdDifference(response.difference_data);
    } else {
      setAdDifference([]);
    }

    return tempData;
  };

  const getAdData = useCallback(
    (
      adType,
      selectedDailyFact,
      selectedGroupBy,
      marketplace,
      selectedAdManagerUser,
      startDate = null,
      endDate = null,
    ) => {
      setAdGraphLoader(true);
      getAdManagerAdminGraphData(
        'sponsored-dashboard',
        adType,
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        selectedAdManagerUser,
        startDate,
        endDate,
        userInfo,
      ).then((res) => {
        if (res && res.status === 400) {
          setAdGraphLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.result) {
            const adGraphData = bindAdResponseData(res.data.result);
            setAdChartData(adGraphData);
          } else {
            setAdChartData([]);
            setAdPreviousTotal([]);
            setAdCurrentTotal([]);
            setAdDifference([]);
          }
          setAdGraphLoader(false);
        }
      });
    },
    [userInfo],
  );

  const getContributionData = useCallback(
    (
      adType,
      selectedDailyFact,
      marketplace,
      selectedAdManagerUser,
      contributionType,
      selectedMetrics,
      startDate = null,
      endDate = null,
      page,
    ) => {
      setKeyContributionLoader(true);
      getKeyContributionData(
        'sponsored_ad_dashboard',
        adType,
        selectedDailyFact,
        marketplace,
        selectedAdManagerUser,
        contributionType,
        selectedMetrics,
        startDate,
        endDate,
        userInfo,
        page,
      ).then((res) => {
        if (res && res.status === 400) {
          setKeyContributionLoader(false);
        }
        if (res && res.status === 500) {
          setKeyContributionLoader(false);
          setContributionData([]);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.result) {
            setContributionData(res.data.result);
          } else if (res.data && res.data.results) {
            setContributionData(res.data.results);
            setContributionCount(res.data.count);
          } else {
            setContributionData([]);
            setPageNumber(page);
          }
          setKeyContributionLoader(false);
        }
      });
    },
    [userInfo],
  );

  useEffect(() => {
    const list = [];
    if (marketplaceChoices && marketplaceChoices.length > 0)
      for (const option of marketplaceChoices) {
        list.push({
          value: option.name,
          label: option.country,
          currency: option.currency,
        });
      }
    setMarketplaceOptions(list);
    if (responseId === null && list.length && list[0].value !== null) {
      getAdManagersList();
      getContributionData(
        selectedAdType,
        selectedAdDF.value,
        'all',
        selectedAdManager.value,
        selectedContributionOption,
        selectedTabMetrics,
        null,
        null,
        pageNumber,
      );
      getAdData(
        selectedAdType,
        selectedAdDF.value,
        adGroupBy,
        'all',
        selectedAdManager.value,
      );

      setCurrency('USD');
      setCurrencySymbol(getSymbolFromCurrency('USD'));
      setResponseId('12345');
    }
  }, [
    marketplaceChoices,
    responseId,
    currency,
    selectedAdType,
    selectedAdDF,
    adGroupBy,
    selectedAdManager,
    getAdManagersList,
    getAdData,
    selectedContributionOption,
    selectedTabMetrics,
    getContributionData,
    pageNumber,
  ]);

  const setGropuByFilter = (value) => {
    switch (value) {
      case 'week':
        setAdFilters({ daily: true, weekly: false, month: false });
        setAdGroupBy('daily');
        getAdData(
          selectedAdType,
          value,
          'daily',
          selectedMarketplace.value,
          selectedAdManager.value,
        );
        getContributionData(
          selectedAdType,
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
        break;

      case 'month':
        setAdFilters({ daily: true, weekly: true, month: false });
        setAdGroupBy('daily');
        getAdData(
          selectedAdType,
          value,
          'daily',
          selectedMarketplace.value,
          selectedAdManager.value,
        );
        getContributionData(
          selectedAdType,
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
        break;

      case '30days':
        setAdFilters({ daily: true, weekly: true, month: false });
        setAdGroupBy('daily');

        getAdData(
          selectedAdType,
          value,
          'daily',
          selectedMarketplace.value,
          selectedAdManager.value,
        );
        getContributionData(
          selectedAdType,
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
        break;

      default:
        break;
    }
  };

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
    adManagerUser,
  ) => {
    let temp = '';
    let sd = startDate;
    let ed = endDate;
    const diffDays = getDays(startDate, endDate);
    if (diffDays <= 7) {
      temp = 'daily';
      setAdFilters({ daily: true, weekly: false, month: false });
      setAdGroupBy('daily');
    } else if (diffDays <= 30) {
      temp = 'daily';
      setAdFilters({ daily: true, weekly: true, month: true });
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
      getAdData(
        adType,
        dailyFactFlag,
        temp,
        marketplace,
        adManagerUser,
        sd,
        ed,
      );
      if (selectedContributionOption === 'keyMetrics') {
        getContributionData(
          selectedAdType,
          dailyFactFlag,
          marketplace,
          selectedAdManager.value,
          selectedContributionOption,
          selectedTabMetrics,
          sd,
          ed,
          pageNumber,
        );
      }
    }
  };

  const handleAdManagerFilter = (event) => {
    const { value } = event;
    let tabOption = '';
    if (event.value !== selectedAdManager.value) {
      setSelectedAdManager(event);

      if (!isBGSManager && value === 'all') {
        setSelectedContributionOption('positive');
        tabOption = 'positive';
      } else {
        setSelectedContributionOption('contribution');
        tabOption = 'contribution';
      }
      if (selectedAdDF.value === 'custom') {
        ADYearAndCustomDateFilter(
          adState[0].startDate,
          adState[0].endDate,
          'custom',
          selectedMarketplace.value,
          selectedAdType,
          value,
          tabOption,
        );
      } else {
        getAdData(
          selectedAdType,
          selectedAdDF.value,
          adGroupBy,
          selectedMarketplace.value,
          value,
        );
        getContributionData(
          selectedAdType,
          selectedAdDF.value,
          selectedMarketplace.value,
          value,
          tabOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
      }
    }
  };

  const handleMarketplace = (event) => {
    if (event.value !== selectedMarketplace.value) {
      setSelectedMarketplace(event);
      setCurrency(event.currency);
      setCurrencySymbol(getSymbolFromCurrency(event.currency));

      if (selectedAdDF.value === 'custom') {
        ADYearAndCustomDateFilter(
          adState[0].startDate,
          adState[0].endDate,
          'custom',
          event.value,
          selectedAdType,
          selectedContributionOption,
        );
      } else {
        getAdData(
          selectedAdType,
          selectedAdDF.value,
          adGroupBy,
          event.value,
          selectedAdManager.value,
        );
        getContributionData(
          selectedAdType,
          selectedAdDF.value,
          event.value,
          selectedAdManager.value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
      }
    }
  };

  const handleAdDailyFact = (event) => {
    const { value } = event;
    if (value !== selectedAdDF) {
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
      if (value === 'custom') {
        setShowAdCustomDateModal(true);
      } else {
        setGropuByFilter(value);
      }
    }
  };

  const handleAdType = (event) => {
    const { value } = event.target;
    setSelectedAdType(value);
    if (selectedAdDF.value === 'custom') {
      ADYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        selectedMarketplace.value,
        value,
        selectedContributionOption,
      );
    } else {
      getAdData(
        value,
        selectedAdDF.value,
        adGroupBy,
        selectedMarketplace.value,
        selectedAdManager.value,
      );
      getContributionData(
        value,
        selectedAdDF.value,
        selectedMarketplace.value,
        selectedAdManager.value,
        selectedContributionOption,
        selectedTabMetrics,
        null,
        null,
        pageNumber,
      );
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
          selectedAdType,
          selectedAdDF.value,
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
          sd,
          ed,
        );
      } else {
        getAdData(
          selectedAdType,
          selectedAdDF.value,
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
        );
      }
    }
  };

  const handleResetFilter = () => {
    let contributionTab = '';
    $('.checkboxes input:radio').filter("[value='all']").prop('checked', true);
    setSelectedAdType('all');

    setSelectedMarketplace({
      value: 'all',
      label: 'All Marketplaces',
      currency: 'USD',
    });
    if (isAdManagerAdmin) {
      contributionTab = isBGSManager ? 'contribution' : 'positive';
      if (isBGSManager) {
        setSelectedAdManager({
          value: 'all',
          label: 'All BGS',
        });
      } else {
        setSelectedAdManager({
          value: 'all',
          label: 'All Ad Manager',
        });
      }
    } else {
      contributionTab = 'contribution';
      setSelectedAdManager({
        value: userInfo.id,
        label: '',
      });
    }
    setSelectedContributionOption(contributionTab);

    if (selectedAdDF.value === 'custom') {
      ADYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        'all',
        'all',
        'all',
      );
    } else {
      getAdData('all', selectedAdDF.value, adGroupBy, 'all', 'all');
      getContributionData(
        'all',
        selectedAdDF.value,
        'all',
        'all',
        contributionTab,
        selectedTabMetrics,
        null,
        null,
        pageNumber,
      );
    }
  };

  const handleContributionOptions = (type) => {
    if (type !== selectedContributionOption) {
      setSelectedContributionOption(type);
      if (selectedAdDF.value === 'custom' && type === 'contribution') {
        return;
      }

      getContributionData(
        selectedAdType,
        selectedAdDF.value,
        selectedMarketplace.value,
        selectedAdManager.value,
        type,
        selectedTabMetrics,
        null,
        null,
        pageNumber,
      );
    }
  };

  const handleOnMetricsTabChange = (value) => {
    if (value !== selectedTabMetrics) {
      setSelectedTabMetrics(value);
      getContributionData(
        selectedAdType,
        selectedAdDF.value,
        selectedMarketplace.value,
        selectedAdManager.value,
        selectedContributionOption,
        value,
        null,
        null,
        pageNumber,
      );
    }
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getContributionData(
      selectedAdType,
      selectedAdDF.value,
      selectedMarketplace.value,
      selectedAdManager.value,
      selectedContributionOption,
      selectedTabMetrics,
      null,
      null,
      currentPage,
    );
  };
  const renderCustomDateSubLabel = (props) => {
    if (selectedAdDF.value === 'custom' && isCustomDateApply) {
      return `From- ${dayjs(adState[0].startDate).format(
        'MMM D, YYYY',
      )}  To- ${dayjs(adState[0].endDate).format('MMM D, YYYY')}`;
    }

    return props.data.sub;
  };

  const applyCustomDate = () => {
    setIsCustomDateApply(true);
    ADYearAndCustomDateFilter(
      adState[0].startDate,
      adState[0].endDate,
      'custom',
      selectedMarketplace.value,
      selectedAdType,
      selectedAdManager.value,
    );

    setShowAdCustomDateModal(false);
  };

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

  const adMnagerFilterOption = (props) => (
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
      DropDownIndicator,
    };
  };

  const getAdManagerComponents = () => {
    return {
      Option: filterOption,
      SingleValue: adMnagerFilterOption,
      DropDownIndicator,
    };
  };

  const addThousandComma = (number, decimalDigits = 2) => {
    if (number !== undefined && number !== null) {
      return number
        .toFixed(decimalDigits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return number;
  };

  const renderAdGroupBy = () => {
    return (
      <div className="row mt-4 mb-3">
        <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
          <ul className="rechart-item">
            {' '}
            <li>
              <div className="weeks">
                <span className="  darkGray circle" />
                <span>Recent</span>
              </div>
            </li>
            <li>
              <div className="weeks">
                <ul className="dashed-line">
                  <li className="darkGray block " />
                  <li className=" darkGray block " />
                </ul>

                <span>Previous</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-md-6 col-sm-12 order-md-2 order-1">
          <ToggleButton>
            <div className="days-container ">
              <ul className="days-tab">
                <li
                  // id=" BT-adperformance-days"
                  className={adFilters.daily === false ? 'disabled-tab' : ''}>
                  <input
                    className="d-none"
                    type="radio"
                    id="daysCheck"
                    name="flexRadioDefault"
                    value={adGroupBy}
                    checked={adFilters.daily && adGroupBy === 'daily'}
                    onClick={() => handleAdGroupBy('daily')}
                    onChange={() => {}}
                  />
                  <label htmlFor="daysCheck">Daily</label>
                </li>

                <li
                  // id=" BT-adperformance-weekly"
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
                  // id=" BT-adperformance-monthly"
                  className={adFilters.month === false ? 'disabled-tab' : ''}>
                  <input
                    className=" d-none"
                    type="radio"
                    id="monthlyCheck"
                    name="flexRadioDefault"
                    value={adGroupBy}
                    checked={adFilters.month && adGroupBy === 'monthly'}
                    onChange={() => handleAdGroupBy('monthly')}
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

  const renderAdDailyFacts = () => {
    return (
      <div className="row">
        <div className="col-md-6 col-sm1-12">
          {' '}
          <p className="black-heading-title mt-2 mb-4">
            Sponsored Ad Performance
          </p>
        </div>
        <div className="col-md-6 col-sm1-12  mb-3">
          {DropDown(
            'days-performance',
            dateOptions,
            dateOptions[0].label,
            getSelectComponents,
            dateOptions[0],
            handleAdDailyFact,
            adGraphLoader,
            null,
            selectedAdDF,
          )}
          <div className="clear-fix" />
        </div>
      </div>
    );
  };

  return (
    <div className="row mt-3">
      <div className="col-lg-3 col-md-12">
        <SponsoredFilter
          handleResetFilter={handleResetFilter}
          DropdownIndicator={DropDownIndicator}
          marketplaceOptions={marketplaceOptions}
          handleMarketplace={handleMarketplace}
          adManagerList={adManagerList}
          getAdManagerComponents={getAdManagerComponents}
          handleAdManagerFilter={handleAdManagerFilter}
          SponsoredAdTypeOptions={SponsoredAdTypeOptions}
          handleAdType={handleAdType}
          selectedAdType={selectedAdType}
          isApiCall={adGraphLoader}
          selectedAdManager={selectedAdManager}
          selectedMarketplace={selectedMarketplace}
          selectInputRef={selectInputRef}
          isAdManagerAdmin={isAdManagerAdmin}
          isBGSManager={isBGSManager}
        />
      </div>
      <div className="col-lg-9 col-md-12">
        <WhiteCard className="mb-3">
          {renderAdDailyFacts()}
          <SponsoredAdMetric
            currencySymbol={currencySymbol}
            setSelectedAdMetrics={setSelectedAdMetrics}
            selectedAdMetrics={selectedAdMetrics}
            adCurrentTotal={adCurrentTotal}
            addThousandComma={addThousandComma}
            adPreviousTotal={adPreviousTotal}
            adDifference={adDifference}
          />
          {renderAdGroupBy()}
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
              selectedBox={selectedAdMetrics}
              selectedDF={selectedAdDF.value}
            />
          ) : (
            <NoData>{noGraphDataMessage}</NoData>
          )}
        </WhiteCard>

        <SponsoredKeyContribution
          keyContributionLoader={keyContributionLoader}
          isDesktop={isDesktop}
          contributionData={contributionData}
          selectedContributionOption={selectedContributionOption}
          selectedAdManager={selectedAdManager.value}
          handleContributionOptions={handleContributionOptions}
          selectedAdMetrics={selectedAdMetrics}
          selectedTabMetrics={selectedTabMetrics}
          handleOnMetricsTabChange={handleOnMetricsTabChange}
          currencySymbol={currencySymbol}
          selectedAdDF={selectedAdDF}
          isBGSManager={isBGSManager}
          handlePageChange={handlePageChange}
          contributionCount={contributionCount}
          pageNumber={pageNumber}
          count={contributionCount}
        />
        <CustomDateModal
          id="BT-sponsoreddashboard-daterange"
          isOpen={showAdCustomDateModal}
          range={adState}
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
      </div>
    </div>
  );
}

SponsoredDashboard.defaultProps = {
  marketplaceChoices: [],
  selectedMarketplace: '',
};

SponsoredDashboard.propTypes = {
  marketplaceChoices: PropTypes.arrayOf(PropTypes.object),
  selectedMarketplace: PropTypes.string,
};

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
