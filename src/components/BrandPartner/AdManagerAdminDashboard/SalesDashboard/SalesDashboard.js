import React, { useState, useEffect, useCallback } from 'react';

import $ from 'jquery';
import dayjs from 'dayjs';
import PropTypes, { arrayOf, shape, string } from 'prop-types';
import { components } from 'react-select';
import { useMediaQuery } from 'react-responsive';

import SalesFilter from './SalesFilter';
import SalesMetrics from './SalesMetrics';
import SalesKeyContribution from './SalesKeyContribution';
import SalePerformanceChart from '../../../Customer/CompanyPerformance/SalesPerformanceView/SalePerformanceChart';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { dateOptionsWithYear, noGraphDataMessage } from '../../../../constants';
import {
  getManagersList,
  getSalesGraphData,
  getSalesKeyContributionData,
} from '../../../../api';
import {
  WhiteCard,
  PageLoader,
  DropDownIndicator,
  CustomDateModal,
  NoData,
  ToggleButton,
} from '../../../../common';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const getSymbolFromCurrency = require('currency-symbol-map');

export default function SalesDashboard({ marketplaceChoices, userInfo }) {
  const isBGSManager = userInfo && userInfo.role === 'BGS Manager';

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const { Option, SingleValue } = components;
  const [salesChartData, setSalesChartData] = useState([]);
  const [salesCurrentTotal, setSalesCurrentTotal] = useState([]);
  const [salesPreviousTotal, setSalesPreviousTotal] = useState([]);
  const [salesDifference, setSalesDifference] = useState([]);
  const [selectedSalesMetrics, setSelectedSalesMetrics] = useState({
    revenue: true,
  });
  const [selectedSalesDF, setSelectedSalesDF] = useState({
    value: 'week',
    label: 'Recent 7 days',
    sub: 'vs Previous 7 days',
  });
  const [selectedBgsUser, setSelectedBgsUser] = useState(
    isBGSManager
      ? {
          value: 'all',
        }
      : { value: userInfo.id, label: '' },
  );
  const [bgsList, setBgsList] = useState([]);
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
  const [salesGraphLoader, setSalesGraphLoader] = useState(false);
  const [selectedTabMetrics, setSelectedTabMetrics] = useState('revenue');
  const [selectedContributionOption, setSelectedContributionOption] = useState(
    'contribution',
  );
  const [organicSale, setOrganicSale] = useState(0);
  const [inorganicSale, setInorganicSale] = useState(0);
  const [contributionData, setContributionData] = useState({
    contributionData: [],
    contributionLoader: false,
    keyMetricsData: [],
    keyMetricLoader: false,
  });
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  const [customDateState, setCustomDateState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'salesSelection',
    },
  ]);
  const [showAdCustomDateModal, setShowAdCustomDateModal] = useState(false);
  const [groupByFilters, setGroupByFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });
  const [salesGroupBy, setSalesGroupBy] = useState('daily');
  const [pageNumber, setPageNumber] = useState();
  const [contributionCount, setContributionCount] = useState(null);

  const getBGSList = useCallback(() => {
    getManagersList('BGS').then((bgsData) => {
      if (bgsData && bgsData.data && bgsData.data.length) {
        const list = [{ value: 'all', label: 'All' }];
        for (const brand of bgsData.data) {
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
        setBgsList(list);
      }
    });
  }, []);

  const bindSalesResponseData = (response) => {
    const tempData = [];

    // filterout previous data in one temporary object.
    if (response.previous && response.previous.length) {
      response.previous.forEach((item) => {
        const previousDate = dayjs(item.report_date).format('MMM D YYYY');
        tempData.push({
          revenuePrevious: item.revenue,
          unitsSoldPrevious: item.units_sold,
          trafficPrevious: item.traffic,
          conversionPrevious: item.conversion,
          previousDate,

          revenuePreviousLabel:
            item.revenue !== null ? item.revenue.toFixed(2) : '0.00',
          unitsSoldPreviousLabel:
            item.units_sold !== null ? item.units_sold.toFixed(2) : '0.00',
          trafficPreviousLabel:
            item.traffic !== null ? item.traffic.toFixed(2) : '0.00',
          conversionPreviousLabel:
            item.conversion !== null ? item.conversion : '0',
        });
      });
    }

    // filterout current data in one temporary object.
    if (response.current && response.current.length) {
      response.current.forEach((item, index) => {
        const currentReportDate = dayjs(item.report_date).format('MMM D YYYY');
        let indexNumber = index;
        // add the current data at same index of prevoius in temporary object
        if (response.previous && index < response.previous.length) {
          tempData[index].date = currentReportDate;
          tempData[index].revenueCurrent = item.revenue;
          tempData[index].unitsSoldCurrent = item.units_sold;
          tempData[index].trafficCurrent = item.traffic;
          tempData[index].conversionCurrent = item.conversion;

          tempData[index].revenueCurrentLabel =
            item.revenue !== null ? item.revenue.toFixed(2) : '0.00';
          tempData[index].unitsSoldCurrentLabel =
            item.units_sold !== null ? item.units_sold.toFixed(2) : '0.00';
          tempData[index].trafficCurrentLabel =
            item.traffic !== null ? item.traffic.toFixed(2) : '0.00';
          tempData[index].conversionCurrentLabel =
            item.conversion !== null ? item.conversion : '0';

          // to add the dotted line. we have to check null matrix and add the dummy number like 8
          if (index > 0) {
            indexNumber = index - 1;
          } else {
            indexNumber = index;
          }
          tempData[indexNumber].revenueDashLength =
            item.revenue === null ? 8 : null;
          tempData[indexNumber].unitsSoldDashLength =
            item.units_sold === null ? 8 : null;
          tempData[indexNumber].trafficDashLength =
            item.traffic === null ? 8 : null;
          tempData[indexNumber].conversionDashLength =
            item.conversion === null ? 8 : null;
        } else {
          // if current data count is larger than previous count then
          // generate separate key for current data and defien previous value null and previous label 0
          tempData.push({
            revenueCurrent: item.revenue,
            unitsSoldCurrent: item.units_sold,
            trafficCurrent: item.traffic,
            conversionCurrent: item.conversion,
            date: currentReportDate,

            revenuePrevious: null,
            unitsSoldPrevious: null,
            trafficPrevious: null,
            conversionPrevious: null,

            revenueCurrentLabel:
              item.revenue !== null ? item.revenue.toFixed(2) : '0.00',
            unitsSoldCurrentLabel:
              item.units_sold !== null ? item.units_sold.toFixed(2) : '0.00',
            trafficCurrentLabel:
              item.traffic !== null ? item.traffic.toFixed(2) : '0.00',
            conversionCurrentLabel:
              item.conversion !== null ? item.conversion : '0',

            revenuePreviousLabel: '0.00',
            unitsSoldPreviousLabel: '0.00',
            trafficPreviousLabel: '0.00',
            conversionPreviousLabel: '0',
          });
        }
      });
    }

    // filterout the dsp current total, previous total, and diffrence
    if (response && response.current_sum) {
      setSalesCurrentTotal(response.current_sum);
    } else {
      setSalesCurrentTotal([]);
    }
    if (response && response.previous_sum) {
      setSalesPreviousTotal(response.previous_sum);
    } else {
      setSalesPreviousTotal([]);
    }
    if (response && response.difference_data) {
      setSalesDifference(response.difference_data);
    } else {
      setSalesDifference([]);
    }
    return tempData;
  };

  const getSalesData = useCallback(
    (
      selectedDailyFact,
      selectedGroupBy,
      marketplace,
      selectedBgs,
      startDate = null,
      endDate = null,
    ) => {
      setSalesGraphLoader(true);
      getSalesGraphData(
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        selectedBgs,
        startDate,
        endDate,
        userInfo,
      ).then((res) => {
        if (res && res.status === 400) {
          setSalesGraphLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.result) {
            const response = res.data.result;
            const salesGraphData = bindSalesResponseData(response);
            setSalesChartData(salesGraphData);
            // brekdown tooltip values
            if (response && response.inorganic_sale) {
              setInorganicSale(response.inorganic_sale);
            }

            if (response && response.organic_sale) {
              setOrganicSale(response.organic_sale);
            }
          } else {
            setSalesChartData([]);
            setSalesPreviousTotal([]);
            setSalesCurrentTotal([]);
            setSalesDifference([]);
          }
          setSalesGraphLoader(false);
        }
        setSalesGraphLoader(false);
      });
    },
    [userInfo],
  );

  const getContributionData = useCallback(
    (
      selectedDailyFact,
      marketplace,
      selectedBgs,
      contributionType,
      selectedMetrics,
      startDate = null,
      endDate = null,
      page,
    ) => {
      if (contributionType === 'keyMetrics') {
        setContributionData({ ...contributionData, keyMetricLoader: true });
      } else {
        setContributionData({ ...contributionData, contributionLoader: true });
      }
      getSalesKeyContributionData(
        selectedDailyFact,
        marketplace,
        selectedBgs,
        contributionType,
        selectedMetrics,
        startDate,
        endDate,
        userInfo,
        page,
      ).then((res) => {
        if (res && res.status === 400) {
          setContributionData({
            ...contributionData,
            keyMetricLoader: false,
            contributionLoader: false,
          });
        }
        if (res && res.status === 200) {
          if (res.data && res.data.result) {
            setContributionData((prevState) => ({
              ...prevState,
              contributionData: res.data.result,
              contributionLoader: false,
            }));
          } else if (res.data && res.data.results) {
            setContributionData((prevState) => ({
              ...prevState,
              keyMetricsData: res.data.results,
              keyMetricLoader: false,
            }));
            setContributionCount(res.data.count);
          } else {
            setContributionData((prevState) => ({
              ...prevState,
              contributionData: [],
              keyMetricsData: [],
              contributionLoader: false,
              keyMetricLoader: false,
            }));
          }

          setPageNumber(page);
        } else {
          setContributionData((prevState) => ({
            ...prevState,
            contributionData: [],
            keyMetricsData: [],
            contributionLoader: false,
            keyMetricLoader: false,
          }));
        }
      });
    },
    [contributionData, userInfo],
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
      getBGSList();
      getContributionData(
        selectedSalesDF.value,
        'all',
        selectedBgsUser.value,
        selectedContributionOption,
        selectedTabMetrics,
        null,
        null,
        pageNumber,
      );
      getSalesData(
        selectedSalesDF.value,
        salesGroupBy,
        'all',
        selectedBgsUser.value,
      );

      setCurrency('USD');
      setCurrencySymbol(getSymbolFromCurrency('USD'));
      setResponseId('12345');
    }
  }, [
    marketplaceChoices,
    responseId,
    currency,
    selectedSalesDF,
    salesGroupBy,
    selectedBgsUser,
    getBGSList,
    getSalesData,
    selectedContributionOption,
    selectedTabMetrics,
    getContributionData,
    pageNumber,
  ]);

  const setGropuByFilter = (value) => {
    switch (value) {
      case 'week':
        setGroupByFilters({ daily: true, weekly: false, month: false });
        setSalesGroupBy('daily');
        getSalesData(
          value,
          'daily',
          selectedMarketplace.value,
          selectedBgsUser.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedBgsUser.value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
        break;

      case 'month':
        setGroupByFilters({ daily: true, weekly: true, month: false });
        setSalesGroupBy('daily');
        getSalesData(
          value,
          'daily',
          selectedMarketplace.value,
          selectedBgsUser.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedBgsUser.value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
        break;

      case '30days':
        setGroupByFilters({ daily: true, weekly: true, month: false });
        setSalesGroupBy('daily');

        getSalesData(
          value,
          'daily',
          selectedMarketplace.value,
          selectedBgsUser.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedBgsUser.value,
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

  const salesYearAndCustomDateFilter = (
    startDate,
    endDate,
    dailyFactFlag,
    marketplace,
    bgsUser,
  ) => {
    let temp = '';
    let sd = startDate;
    let ed = endDate;

    const diffDays = getDays(startDate, endDate);

    if (diffDays <= 7) {
      temp = 'daily';
      setGroupByFilters({ daily: true, weekly: false, month: false });
      setSalesGroupBy('daily');
    } else if (diffDays <= 30) {
      temp = 'daily';
      setGroupByFilters({ daily: true, weekly: true, month: false });
      setSalesGroupBy('daily');
    } else if (diffDays > 30 && diffDays <= 60) {
      temp = 'daily';
      setGroupByFilters({ daily: true, weekly: true, month: true });
      setSalesGroupBy('daily');
    } else if (diffDays > 60) {
      temp = 'weekly';
      setGroupByFilters({ daily: false, weekly: true, month: true });
      setSalesGroupBy('weekly');
    }

    if (dailyFactFlag === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;
      getSalesData(dailyFactFlag, temp, marketplace, bgsUser, sd, ed);

      if (selectedContributionOption === 'keyMetrics') {
        getContributionData(
          dailyFactFlag,
          marketplace,
          selectedBgsUser.value,
          selectedContributionOption,
          selectedTabMetrics,
          sd,
          ed,
          pageNumber,
        );
      }
    } else {
      getSalesData(dailyFactFlag, temp, marketplace, bgsUser);
      getContributionData(
        dailyFactFlag,
        marketplace,
        selectedBgsUser.value,
        selectedContributionOption,
        selectedTabMetrics,
        null,
        null,
        pageNumber,
      );
    }
  };

  const handleMarketplace = (event) => {
    if (event.value !== selectedMarketplace.value) {
      setSelectedMarketplace(event);
      setCurrency(event.currency);
      setCurrencySymbol(getSymbolFromCurrency(event.currency));

      if (selectedSalesDF.value === 'custom') {
        salesYearAndCustomDateFilter(
          customDateState[0].startDate,
          customDateState[0].endDate,
          'custom',
          event.value,
          selectedBgsUser.value,
        );
      } else {
        getSalesData(
          selectedSalesDF.value,
          salesGroupBy,
          event.value,
          selectedBgsUser.value,
        );
        getContributionData(
          selectedSalesDF.value,
          event.value,
          selectedBgsUser.value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
      }
    }
  };

  const handleSalesDailyFact = (event) => {
    const { value } = event;
    if (value !== selectedSalesDF) {
      setSelectedSalesDF(event);
      setIsCustomDateApply(false);
      if (value !== 'custom') {
        setCustomDateState([
          {
            startDate: currentDate,
            endDate: currentDate,
            key: 'salesSelection',
          },
        ]);
      }
      if (value === 'year') {
        salesYearAndCustomDateFilter(
          new Date(new Date().getFullYear(), 0, 1),
          new Date(),
          'year',
          selectedMarketplace.value,
          selectedBgsUser.value,
          selectedContributionOption,
        );
      }

      if (value === 'custom') {
        setShowAdCustomDateModal(true);
      } else {
        setGropuByFilter(value);
      }
    }
  };

  const handleBgsList = (event) => {
    const { value } = event.target;
    setSelectedBgsUser({
      value,
    });
    if (selectedSalesDF.value === 'custom') {
      salesYearAndCustomDateFilter(
        customDateState[0].startDate,
        customDateState[0].endDate,
        'custom',
        selectedMarketplace.value,
        value,
        selectedContributionOption,
      );
    } else {
      getSalesData(
        selectedSalesDF.value,
        salesGroupBy,
        selectedMarketplace.value,
        value,
      );
      getContributionData(
        selectedSalesDF.value,
        selectedMarketplace.value,
        value,
        selectedContributionOption,
        selectedTabMetrics,
        null,
        null,
        pageNumber,
      );
    }
  };

  const handleSalesGroupBy = (value) => {
    if (value !== salesGroupBy) {
      setSalesGroupBy(value);

      if (selectedSalesDF.value === 'custom') {
        const { startDate } = customDateState[0];
        const { endDate } = customDateState[0];
        let sd = startDate;
        let ed = endDate;
        sd = `${startDate.getDate()}-${
          startDate.getMonth() + 1
        }-${startDate.getFullYear()}`;
        ed = `${endDate.getDate()}-${
          endDate.getMonth() + 1
        }-${endDate.getFullYear()}`;

        getSalesData(
          selectedSalesDF.value,
          value,
          selectedMarketplace.value,
          selectedBgsUser.value,
          sd,
          ed,
        );
      } else {
        getSalesData(
          selectedSalesDF.value,
          value,
          selectedMarketplace.value,
          selectedBgsUser.value,
        );
      }
    }
  };

  const handleResetFilter = () => {
    $('.checkboxes input:radio').filter("[value='all']").prop('checked', true);

    setSelectedMarketplace({
      value: 'all',
      label: 'All Marketplaces',
      currency: 'USD',
    });

    if (isBGSManager) {
      setSelectedBgsUser({
        value: 'all',
      });
    } else {
      setSelectedBgsUser({
        value: userInfo.id,
      });
    }

    setSelectedContributionOption('contribution');

    if (selectedSalesDF.value === 'custom') {
      salesYearAndCustomDateFilter(
        customDateState[0].startDate,
        customDateState[0].endDate,
        'custom',
        'all',
        'all',
        'all',
      );
    } else {
      getSalesData(selectedSalesDF.value, salesGroupBy, 'all', 'all');
      getContributionData(
        selectedSalesDF.value,
        'all',
        'all',
        'contribution',
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
      if (selectedSalesDF.value === 'custom' && type === 'contribution') {
        return;
      }

      getContributionData(
        selectedSalesDF.value,
        selectedMarketplace.value,
        selectedBgsUser.value,
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
        selectedSalesDF.value,
        selectedMarketplace.value,
        selectedBgsUser.value,
        selectedContributionOption,
        value,
        null,
        null,
        pageNumber,
      );
    }
  };

  const renderCustomDateSubLabel = (props) => {
    if (selectedSalesDF.value === 'custom' && isCustomDateApply) {
      return `From- ${dayjs(customDateState[0].startDate).format(
        'MMM D, YYYY',
      )}  To- ${dayjs(customDateState[0].endDate).format('MMM D, YYYY')}`;
    }

    return props.data.sub;
  };

  const applyCustomDate = () => {
    setIsCustomDateApply(true);
    salesYearAndCustomDateFilter(
      customDateState[0].startDate,
      customDateState[0].endDate,
      'custom',
      selectedMarketplace.value,
      selectedBgsUser.value,
    );

    setShowAdCustomDateModal(false);
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getContributionData(
      selectedSalesDF.value,
      selectedMarketplace.value,
      selectedBgsUser.value,
      selectedContributionOption,
      selectedTabMetrics,
      null,
      null,
      currentPage,
    );
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

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropDownIndicator,
    };
  };

  const singleMarketplaceFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
    </SingleValue>
  );

  const getMarketplaceSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleMarketplaceFilterOption,
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

  const renderSalesGroupBy = () => {
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
                  className={
                    groupByFilters.daily === false ? 'disabled-tab' : ''
                  }>
                  <input
                    className="d-none"
                    type="radio"
                    id="daysCheck"
                    name="flexRadioDefault"
                    value={salesGroupBy}
                    checked={groupByFilters.daily && salesGroupBy === 'daily'}
                    onClick={() => handleSalesGroupBy('daily')}
                    onChange={() => {}}
                  />
                  <label htmlFor="daysCheck">Daily</label>
                </li>

                <li
                  // id=" BT-adperformance-weekly"
                  className={
                    groupByFilters.weekly === false ? 'disabled-tab' : ''
                  }>
                  <input
                    className="d-none"
                    type="radio"
                    id="weeklyCheck"
                    name="flexRadioDefault"
                    value={salesGroupBy}
                    checked={groupByFilters.weekly && salesGroupBy === 'weekly'}
                    onChange={() => handleSalesGroupBy('weekly')}
                  />
                  <label htmlFor="weeklyCheck">Weekly</label>
                </li>

                <li
                  // id=" BT-adperformance-monthly"
                  className={
                    groupByFilters.month === false ? 'disabled-tab' : ''
                  }>
                  <input
                    className=" d-none"
                    type="radio"
                    id="monthlyCheck"
                    name="flexRadioDefault"
                    value={salesGroupBy}
                    checked={groupByFilters.month && salesGroupBy === 'monthly'}
                    onChange={() => handleSalesGroupBy('monthly')}
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

  const renderSalesDailyFacts = () => {
    return (
      <div className="row">
        <div className="col-md-6 col-sm1-12">
          {' '}
          <p className="black-heading-title mt-2 mb-4">Sales Performance</p>
        </div>
        <div className="col-md-6 col-sm1-12  mb-3">
          {DropDown(
            'days-performance',
            dateOptionsWithYear,
            dateOptionsWithYear[0].label,
            getSelectComponents,
            dateOptionsWithYear[0],
            handleSalesDailyFact,
            salesGraphLoader,
            null,
            selectedSalesDF,
          )}
          <div className="clear-fix" />
        </div>
      </div>
    );
  };

  return (
    <div className="row mt-3">
      <div className="col-lg-3 col-md-12">
        <SalesFilter
          handleResetFilter={handleResetFilter}
          getSelectComponents={getMarketplaceSelectComponents}
          marketplaceOptions={marketplaceOptions}
          handleMarketplace={handleMarketplace}
          bgsList={bgsList}
          handleBgsList={handleBgsList}
          selectedBgs={selectedBgsUser}
          isApiCall={salesGraphLoader}
          selectedMarketplace={selectedMarketplace}
          isBGSManager={isBGSManager}
        />
      </div>
      <div className="col-lg-9 col-md-12">
        <WhiteCard className="mb-3">
          {renderSalesDailyFacts()}
          <SalesMetrics
            currencySymbol={currencySymbol}
            selectedSalesMetrics={selectedSalesMetrics}
            setSelectedSalesMetrics={setSelectedSalesMetrics}
            salesCurrentTotal={salesCurrentTotal}
            addThousandComma={addThousandComma}
            salesPreviousTotal={salesPreviousTotal}
            salesDifference={salesDifference}
            organicSale={organicSale}
            inorganicSale={inorganicSale}
          />
          {renderSalesGroupBy()}
          {salesGraphLoader ? (
            <PageLoader
              component="performance-graph"
              color="#FF5933"
              type="detail"
              width={40}
              height={40}
            />
          ) : salesChartData.length >= 1 ? (
            <SalePerformanceChart
              chartId="adChart"
              chartData={salesChartData}
              currencySymbol={currencySymbol}
              selectedBox={selectedSalesMetrics}
              selectedDF={selectedSalesDF.value}
              isDashboard
            />
          ) : (
            <NoData>{noGraphDataMessage}</NoData>
          )}
        </WhiteCard>

        <SalesKeyContribution
          keyContributionLoader={
            selectedContributionOption === 'contribution'
              ? contributionData.contributionLoader
              : contributionData.keyMetricLoader
          }
          isDesktop={isDesktop}
          contributionData={
            selectedContributionOption === 'contribution'
              ? contributionData.contributionData
              : contributionData.keyMetricsData
          }
          selectedContributionOption={selectedContributionOption}
          handleContributionOptions={handleContributionOptions}
          selectedSalesMetrics={selectedSalesMetrics}
          selectedTabMetrics={selectedTabMetrics}
          handleOnMetricsTabChange={handleOnMetricsTabChange}
          currencySymbol={currencySymbol}
          selectedSalesDF={selectedSalesDF}
          handlePageChange={handlePageChange}
          contributionCount={contributionCount}
          pageNumber={pageNumber}
          count={contributionCount}
        />
        <CustomDateModal
          id="BT-sponsoreddashboard-daterange"
          isOpen={showAdCustomDateModal}
          range={customDateState}
          onClick={() => {
            setShowAdCustomDateModal(false);
            setCustomDateState([
              {
                startDate: currentDate,
                endDate: currentDate,
                key: 'salesSelection',
              },
            ]);
          }}
          onChange={(item) => {
            setCustomDateState([item.salesSelection]);
          }}
          onApply={() => applyCustomDate()}
          currentDate={currentDate}
        />
      </div>
    </div>
  );
}

SalesDashboard.defaultProps = {
  marketplaceChoices: [],
  selectedMarketplace: '',
  userInfo: {
    role: '',
    id: '',
  },
  data: {},
};

SalesDashboard.propTypes = {
  marketplaceChoices: arrayOf(PropTypes.object),
  selectedMarketplace: string,
  userInfo: shape({
    role: string,
    id: string,
  }),
  data: shape({ sub: string, label: string }),
};
