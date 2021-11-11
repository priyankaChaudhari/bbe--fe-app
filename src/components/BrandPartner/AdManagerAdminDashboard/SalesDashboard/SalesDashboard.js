import React, { useState, useEffect, useCallback } from 'react';

import $ from 'jquery';
import dayjs from 'dayjs';
import PropTypes, { arrayOf, shape, string } from 'prop-types';
import { components } from 'react-select';
import { useMediaQuery } from 'react-responsive';

import SalesFilter from './SalesFilter';
import SalesMetrics from './SalesMetrics';
import SalesKeyContribution from './SalesKeyContribution';
import SalePerformanceChart from '../../../Customer/CompanyPerformance/SellerReporting/SalePerformanceChart';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { dateOptionsWithYear, noGraphDataMessage } from '../../../../constants';
import {
  getManagersList,
  getSalesGraphData,
  getSalesKeyContributionData,
  getBgsUserList,
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
  const isBGSManager = userInfo?.role === 'BGS Manager';
  const isAdManagerAdmin = userInfo?.role === 'Ad Manager Admin';
  const isBGSAdmin = userInfo?.role === 'BGS Admin';
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
  const [selectedManager, setSelectedManager] = useState(
    isAdManagerAdmin || isBGSAdmin
      ? {
          value: 'all',
          label: 'All',
        }
      : { value: userInfo.id },
  );

  const [selectedBgs, setSelectedBgs] = useState(
    isBGSManager || isBGSAdmin
      ? {
          value: 'all',
          label: 'All',
        }
      : { value: userInfo.id },
  );
  const [managersList, setManagersList] = useState([]);
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
  const tab = isAdManagerAdmin || isBGSAdmin ? 'positive' : 'contribution';

  const [selectedContributionOption, setSelectedContributionOption] = useState(
    tab,
  );
  const [organicSale, setOrganicSale] = useState(0);
  const [inorganicSale, setInorganicSale] = useState(0);
  const [contributionData, setContributionData] = useState([]);
  const [contributionLoader, setContributionLoader] = useState(false);
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

  const getManagerList = useCallback(() => {
    getManagersList(isBGSAdmin ? 'BGS' : 'sales_performance').then(
      (managersData) => {
        if (managersData && managersData.data && managersData.data.length) {
          const results = managersData.data;
          const list = [{ value: 'all', label: 'All' }];

          for (const brand of results) {
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
          setManagersList(list);
        }
      },
    );
  }, [isBGSAdmin]);

  const getBGSList = useCallback((id) => {
    getBgsUserList(id).then((bgsData) => {
      if (bgsData && bgsData.data && bgsData.data.length) {
        const results = bgsData.data;
        const list = [{ value: 'all', label: 'All' }];

        for (const brand of results) {
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
      selectedManagerUser,
      selectedBgsUser,
      startDate = null,
      endDate = null,
    ) => {
      setSalesGraphLoader(true);
      getSalesGraphData(
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        selectedManagerUser,
        selectedBgsUser,
        isBGSManager,
        isBGSAdmin,
        startDate,
        endDate,
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
    [isBGSManager, isBGSAdmin],
  );

  const getContributionData = useCallback(
    (
      selectedDailyFact,
      marketplace,
      selectedManagerUser,
      selectedBgsUser,
      contributionType,
      selectedMetrics,
      startDate = null,
      endDate = null,
      page,
    ) => {
      setContributionLoader(true);
      getSalesKeyContributionData(
        selectedDailyFact,
        marketplace,
        selectedManagerUser,
        selectedBgsUser,
        contributionType,
        selectedMetrics,
        isBGSManager,
        isBGSAdmin,
        startDate,
        endDate,
        page,
      ).then((res) => {
        if (res && (res.status === 400 || res.status === 400)) {
          setContributionLoader(false);
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
          setContributionLoader(false);
        }
      });
    },
    [isBGSManager, isBGSAdmin],
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
      if (isAdManagerAdmin || isBGSAdmin) getManagerList();
      if (isBGSAdmin || isBGSManager)
        getBGSList(isBGSManager ? userInfo.id : null);

      getContributionData(
        selectedSalesDF.value,
        'all',
        selectedManager.value,
        selectedBgs.value,
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
        selectedManager.value,
        selectedBgs.value,
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
    selectedManager,
    selectedBgs,
    selectedContributionOption,
    selectedTabMetrics,
    pageNumber,
    isBGSManager,
    isAdManagerAdmin,
    isBGSAdmin,
    userInfo,
    getContributionData,
    getBGSList,
    getManagerList,
    getSalesData,
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
          selectedManager.value,
          selectedBgs.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
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
          selectedManager.value,
          selectedBgs.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
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
          selectedManager.value,
          selectedBgs.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
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
    managerUser,
    bgsUser,
  ) => {
    let temp = '';
    let sd = startDate;
    let ed = endDate;

    const diffDays = getDays(startDate, endDate);

    if (diffDays <= 30) {
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
      getSalesData(
        dailyFactFlag,
        temp,
        marketplace,
        managerUser,
        bgsUser,
        sd,
        ed,
      );

      if (selectedContributionOption === 'keyMetrics') {
        getContributionData(
          dailyFactFlag,
          marketplace,
          selectedManager.value,
          selectedBgs.value,
          selectedContributionOption,
          selectedTabMetrics,
          sd,
          ed,
          pageNumber,
        );
      }
    } else {
      getSalesData(dailyFactFlag, temp, marketplace, managerUser, bgsUser);
      getContributionData(
        dailyFactFlag,
        marketplace,
        selectedManager.value,
        selectedBgs.value,
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
          selectedManager.value,
          selectedBgs.value,
        );
      } else {
        getSalesData(
          selectedSalesDF.value,
          salesGroupBy,
          event.value,
          selectedManager.value,
          selectedBgs.value,
        );
        getContributionData(
          selectedSalesDF.value,
          event.value,
          selectedManager.value,
          selectedBgs.value,
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
          selectedManager.value,
          selectedBgs.value,
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

  const handleManagerList = (event) => {
    const { value } = event;
    let tabOption = '';

    if (event.value !== selectedManager.value) {
      setSelectedManager(event);
      if ((isAdManagerAdmin || isBGSAdmin) && value === 'all') {
        tabOption = 'positive';
      } else {
        tabOption = 'contribution';
      }

      setSelectedContributionOption(tabOption);

      if (selectedSalesDF.value === 'custom') {
        salesYearAndCustomDateFilter(
          customDateState[0].startDate,
          customDateState[0].endDate,
          'custom',
          selectedMarketplace.value,
          value,
          selectedBgs.value,
          tabOption,
        );
      } else {
        getSalesData(
          selectedSalesDF.value,
          salesGroupBy,
          selectedMarketplace.value,
          value,
          selectedBgs.value,
        );
        getContributionData(
          selectedSalesDF.value,
          selectedMarketplace.value,
          value,
          selectedBgs.value,
          tabOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
      }
    }
  };

  const handleBGSList = (event) => {
    const { value } = event;

    if (event.value !== selectedBgs.value) {
      setSelectedBgs(event);

      if (selectedSalesDF.value === 'custom') {
        salesYearAndCustomDateFilter(
          customDateState[0].startDate,
          customDateState[0].endDate,
          'custom',
          selectedMarketplace.value,
          selectedManager.value,
          value,
        );
      } else {
        getSalesData(
          selectedSalesDF.value,
          salesGroupBy,
          selectedMarketplace.value,
          selectedManager.value,
          value,
        );
        getContributionData(
          selectedSalesDF.value,
          selectedMarketplace.value,
          selectedManager.value,
          value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          pageNumber,
        );
      }
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
          selectedManager.value,
          selectedBgs.value,
          sd,
          ed,
        );
      } else {
        getSalesData(
          selectedSalesDF.value,
          value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
        );
      }
    }
  };

  const handleResetFilter = () => {
    let contributionTab = 'contribution';
    $('.checkboxes input:radio').filter("[value='all']").prop('checked', true);
    setCurrency('USD');
    setCurrencySymbol(getSymbolFromCurrency('USD'));
    setSelectedMarketplace({
      value: 'all',
      label: 'All Marketplaces',
      currency: 'USD',
    });

    if (isAdManagerAdmin || isBGSManager || isBGSAdmin) {
      setSelectedManager({
        value: 'all',
        label: 'All',
      });
      setSelectedBgs({
        value: 'all',
        label: 'All',
      });
      contributionTab = isBGSManager ? 'contribution' : 'positive';
    } else {
      setSelectedManager({
        value: userInfo.id,
      });
      setSelectedBgs({
        value: userInfo.id,
      });
    }
    setSelectedContributionOption(contributionTab);
    // setSelectedContributionOption('contribution');

    if (selectedSalesDF.value === 'custom') {
      salesYearAndCustomDateFilter(
        customDateState[0].startDate,
        customDateState[0].endDate,
        'custom',
        'all',
        'all',
        'all',
        'all',
      );
    } else {
      getSalesData(selectedSalesDF.value, salesGroupBy, 'all', 'all', 'all');
      getContributionData(
        selectedSalesDF.value,
        'all',
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
      if (selectedSalesDF.value === 'custom' && type === 'contribution') {
        return;
      }

      getContributionData(
        selectedSalesDF.value,
        selectedMarketplace.value,
        selectedManager.value,
        selectedBgs.value,
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
        selectedManager.value,
        selectedBgs.value,
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
      selectedManager.value,
      selectedBgs.value,
    );

    setShowAdCustomDateModal(false);
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getContributionData(
      selectedSalesDF.value,
      selectedMarketplace.value,
      selectedManager.value,
      selectedBgs.value,
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
          managersList={managersList}
          handleManagerList={handleManagerList}
          handleBGSList={handleBGSList}
          selectedManager={selectedManager}
          selectedBgs={selectedBgs}
          bgsList={bgsList}
          isApiCall={salesGraphLoader}
          selectedMarketplace={selectedMarketplace}
          isBGSManager={isBGSManager}
          isAdManagerAdmin={isAdManagerAdmin}
          isBGSAdmin={isBGSAdmin}
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
          keyContributionLoader={contributionLoader}
          isDesktop={isDesktop}
          contributionData={contributionData}
          selectedContributionOption={selectedContributionOption}
          handleContributionOptions={handleContributionOptions}
          selectedSalesMetrics={selectedSalesMetrics}
          selectedTabMetrics={selectedTabMetrics}
          handleOnMetricsTabChange={handleOnMetricsTabChange}
          currencySymbol={currencySymbol}
          selectedManager={selectedManager.value}
          selectedSalesDF={selectedSalesDF}
          handlePageChange={handlePageChange}
          contributionCount={contributionCount}
          pageNumber={pageNumber}
          count={contributionCount}
          isApiCall={contributionLoader}
          isBGSManager={isBGSManager}
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
