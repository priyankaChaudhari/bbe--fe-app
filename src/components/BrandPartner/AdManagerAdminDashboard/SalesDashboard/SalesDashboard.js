import React, { useState, useEffect, useCallback, useRef } from 'react';

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
import {
  dateOptionsWithYearOverYear,
  noGraphDataMessage,
} from '../../../../constants';
import {
  getManagersList,
  getSalesGraphData,
  getSalesKeyContributionData,
  getBgsUserList,
} from '../../../../api';
import {
  WhiteCard,
  PageLoader,
  DropdownIndicator,
  CustomDateModal,
  NoData,
  ToggleButton,
} from '../../../../common';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const getSymbolFromCurrency = require('currency-symbol-map');

export default function SalesDashboard({ marketplaceChoices, userInfo }) {
  const mounted = useRef(false);
  const isAdManagerAdmin = userInfo?.role === 'Ad Manager Admin';
  const isBGSManager = userInfo?.role === 'BGS Manager';
  const isBGSAdmin = userInfo?.role === 'BGS Admin';
  const isBGS = userInfo?.role === 'BGS';
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
    isAdManagerAdmin || isBGSAdmin || isBGS
      ? {
          value: 'all',
          label: 'All',
        }
      : { value: userInfo?.id },
  );

  const [selectedBgs, setSelectedBgs] = useState(
    isBGSManager || isBGSAdmin
      ? {
          value: 'all',
          label: 'All',
        }
      : { value: userInfo?.id },
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
        if (mounted.current) {
          if (
            managersData &&
            managersData.data &&
            managersData.data.length > 0
          ) {
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
        }
      },
    );
  }, [isBGSAdmin]);

  const getBGSList = useCallback((id) => {
    getBgsUserList(id).then((bgsData) => {
      if (mounted.current) {
        if (bgsData && bgsData.data && bgsData.data.length > 0) {
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
              bgsManager: brand.bgs_manager,
            });
          }
          setBgsList(list);
        }
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
            item.conversion !== null ? item.conversion.toFixed(2) : '0',
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
            item.conversion !== null ? item.conversion.toFixed(2) : '0';
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
              item.conversion !== null ? item.conversion.toFixed(2) : '0',

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
        isBGS,
        startDate,
        endDate,
      ).then((res) => {
        if (mounted.current) {
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
        }
      });
    },
    [isBGSManager, isBGSAdmin, isBGS],
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
        isBGS,
        startDate,
        endDate,
        page,
      ).then((res) => {
        if (mounted.current) {
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
        }
      });
    },
    [isBGSManager, isBGSAdmin, isBGS],
  );

  useEffect(() => {
    mounted.current = true;

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
        getBGSList(isBGSManager ? userInfo?.id : null);

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
    return () => {
      mounted.current = false;
    };
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
    selectedTabOption,
  ) => {
    let temp = '';
    let sd = startDate;
    let ed = endDate;

    const diffDays = getDays(startDate, endDate);

    if (diffDays <= 30) {
      temp = 'daily';
      setGroupByFilters({ daily: true, weekly: false, month: false });
      setSalesGroupBy('daily');
    } else if (diffDays > 30 && diffDays <= 60) {
      temp = 'daily';
      setGroupByFilters({ daily: true, weekly: true, month: false });
      setSalesGroupBy('daily');
    } else if (diffDays > 60) {
      temp = 'weekly';
      setGroupByFilters({ daily: false, weekly: true, month: true });
      setSalesGroupBy('weekly');
    }

    if (dailyFactFlag === 'custom' || dailyFactFlag === 'yearOverYear') {
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

      if (
        dailyFactFlag === 'yearOverYear' ||
        selectedTabOption === 'keyMetrics'
      ) {
        getContributionData(
          dailyFactFlag,
          marketplace,
          selectedManager.value,
          selectedBgs.value,
          selectedTabOption,
          selectedTabMetrics,
          sd,
          ed,
          1,
        );
      }
    } else {
      // for year to date
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
        1,
      );
    }
    setPageNumber(1);
  };

  const handleMarketplace = (event) => {
    if (event.value !== selectedMarketplace.value) {
      setSelectedMarketplace(event);
      setCurrency(event.currency);
      setCurrencySymbol(getSymbolFromCurrency(event.currency));

      if (
        selectedSalesDF.value === 'custom' ||
        selectedSalesDF.value === 'yearOverYear'
      ) {
        salesYearAndCustomDateFilter(
          customDateState[0].startDate,
          customDateState[0].endDate,
          selectedSalesDF.value,
          event.value,
          selectedManager.value,
          selectedBgs.value,
          selectedContributionOption,
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
          1,
        );
        setPageNumber(1);
      }
    }
  };

  const handleSalesDailyFact = (event) => {
    const { value } = event;
    if (value !== selectedSalesDF) {
      setSelectedSalesDF(event);
      setIsCustomDateApply(false);
      if (value !== 'custom' || value !== 'yearOverYear') {
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

      if (value === 'custom' || value === 'yearOverYear') {
        setShowAdCustomDateModal(true);
      } else {
        setGropuByFilter(value);
      }
    }
  };

  const handleManagerList = (event) => {
    const { value } = event;
    let bgsUser = selectedBgs.value;
    let tabOption = '';

    if (event.value !== selectedManager.value) {
      setSelectedManager(event);

      if (isBGSAdmin) {
        if (value === 'all') {
          getBGSList(null);
        } else {
          getBGSList(value);
        }
        setBgsList([{ value: 'all', label: 'All' }]);
        bgsUser = 'all';
        setSelectedBgs({
          value: 'all',
          label: 'All',
        });
      }

      if ((isAdManagerAdmin || isBGSAdmin) && value === 'all') {
        tabOption = 'positive';
      } else {
        tabOption = 'contribution';
      }

      setSelectedContributionOption(tabOption);

      if (
        selectedSalesDF.value === 'custom' ||
        selectedSalesDF.value === 'yearOverYear'
      ) {
        salesYearAndCustomDateFilter(
          customDateState[0].startDate,
          customDateState[0].endDate,
          selectedSalesDF.value,
          selectedMarketplace.value,
          value,
          bgsUser,
          tabOption,
        );
      } else {
        getSalesData(
          selectedSalesDF.value,
          salesGroupBy,
          selectedMarketplace.value,
          value,
          bgsUser,
        );
        getContributionData(
          selectedSalesDF.value,
          selectedMarketplace.value,
          value,
          bgsUser,
          tabOption,
          selectedTabMetrics,
          null,
          null,
          1,
        );
        setPageNumber(1);
      }
    }
  };

  const handleBGSList = (event) => {
    const { value } = event;
    let manager = selectedManager.value;

    if (event.value !== selectedBgs.value) {
      setSelectedBgs(event);

      if (isBGSAdmin && selectedManager.value === 'all') {
        const found = bgsList.find(
          (bgsUser) => bgsUser.value === value && bgsUser.bgsManager !== null,
        );

        if (found !== undefined) {
          setSelectedManager({
            value: found?.bgsManager?.id,
            label: `${found.bgsManager.first_name} ${found.bgsManager.last_name}`,
          });
          manager = found?.bgsManager?.id;
          getBGSList(manager);
        } else {
          setSelectedManager({
            value: 'all',
            label: 'All',
          });
          manager = 'all';
          getBGSList(null);
        }
      }

      if (
        selectedSalesDF.value === 'custom' ||
        selectedSalesDF.value === 'yearOverYear'
      ) {
        salesYearAndCustomDateFilter(
          customDateState[0].startDate,
          customDateState[0].endDate,
          selectedSalesDF.value,
          selectedMarketplace.value,
          manager,
          value,
          selectedContributionOption,
        );
      } else {
        getSalesData(
          selectedSalesDF.value,
          salesGroupBy,
          selectedMarketplace.value,
          manager,
          value,
        );
        getContributionData(
          selectedSalesDF.value,
          selectedMarketplace.value,
          manager,
          value,
          selectedContributionOption,
          selectedTabMetrics,
          null,
          null,
          1,
        );
        setPageNumber(1);
      }
    }
  };

  const handleSalesGroupBy = (value) => {
    if (value !== salesGroupBy) {
      setSalesGroupBy(value);

      if (
        selectedSalesDF.value === 'custom' ||
        selectedSalesDF.value === 'yearOverYear'
      ) {
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
    let userManger = 'all';
    let userBgs = 'all';
    $('.checkboxes input:radio').filter("[value='all']").prop('checked', true);
    setCurrency('USD');
    setCurrencySymbol(getSymbolFromCurrency('USD'));
    setSelectedMarketplace({
      value: 'all',
      label: 'All Marketplaces',
      currency: 'USD',
    });
    if (isBGSAdmin) {
      getBGSList(null);
    }

    if (isBGS) {
      userBgs = userInfo?.id;
      userManger = 'all';
    } else if (isBGSManager) {
      userBgs = 'all';
      userManger = userInfo?.id;
      setSelectedBgs({
        value: 'all',
        label: 'All',
      });
      contributionTab = 'contribution';
    } else if (isAdManagerAdmin || isBGSAdmin) {
      userManger = 'all';
      setSelectedManager({
        value: 'all',
        label: 'All',
      });
      setSelectedBgs({
        value: 'all',
        label: 'All',
      });
      contributionTab = 'positive';
    } else {
      userManger = userInfo?.id;
      setSelectedManager({
        value: userInfo?.id,
      });
      setSelectedBgs({
        value: userInfo?.id,
      });
    }
    setSelectedContributionOption(contributionTab);

    if (
      selectedSalesDF.value === 'custom' ||
      selectedSalesDF.value === 'yearOverYear'
    ) {
      salesYearAndCustomDateFilter(
        customDateState[0].startDate,
        customDateState[0].endDate,
        selectedSalesDF.value,
        'all',
        'all',
        userBgs,
        selectedContributionOption,
      );
    } else {
      getSalesData(
        selectedSalesDF.value,
        salesGroupBy,
        'all',
        userManger,
        userBgs,
      );
      getContributionData(
        selectedSalesDF.value,
        'all',
        userManger,
        userBgs,
        contributionTab,
        selectedTabMetrics,
        null,
        null,
        1,
      );
      setPageNumber(1);
    }
  };

  const handleContributionOptions = (type) => {
    if (type !== selectedContributionOption) {
      setSelectedContributionOption(type);
      if (selectedSalesDF.value === 'custom' && type === 'contribution') {
        return;
      }
      if (selectedSalesDF.value === 'yearOverYear') {
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

        getContributionData(
          selectedSalesDF.value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
          type,
          selectedTabMetrics,
          sd,
          ed,
          1,
        );
      } else {
        getContributionData(
          selectedSalesDF.value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
          type,
          selectedTabMetrics,
          null,
          null,
          1,
        );
      }
      setPageNumber(1);
    }
  };

  const handleOnMetricsTabChange = (value) => {
    if (value !== selectedTabMetrics) {
      setSelectedTabMetrics(value);

      if (selectedSalesDF.value === 'yearOverYear') {
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

        getContributionData(
          selectedSalesDF.value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
          selectedContributionOption,
          value,
          sd,
          ed,
          pageNumber,
        );
      } else {
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
    }
  };

  const renderCustomDateSubLabel = (props) => {
    if (selectedSalesDF.value === 'custom' && isCustomDateApply) {
      return `From- ${dayjs(customDateState[0].startDate).format(
        'MMM D, YYYY',
      )}  To- ${dayjs(customDateState[0].endDate).format('MMM D, YYYY')}`;
    }
    if (selectedSalesDF.value === 'yearOverYear' && isCustomDateApply) {
      return `From ${dayjs(customDateState[0].startDate).format(
        'D MMM',
      )}  To ${dayjs(customDateState[0].endDate).format('D MMM')}`;
    }

    return props.data.sub;
  };

  const applyCustomDate = () => {
    setIsCustomDateApply(true);
    salesYearAndCustomDateFilter(
      customDateState[0].startDate,
      customDateState[0].endDate,
      selectedSalesDF.value,
      selectedMarketplace.value,
      selectedManager.value,
      selectedBgs.value,
      selectedContributionOption,
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
      DropdownIndicator,
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
      DropdownIndicator,
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
            {selectedSalesDF.value !== 'custom' ? (
              <li>
                <div className="weeks">
                  <ul className="dashed-line">
                    <li className="darkGray block " />
                    <li className=" darkGray block " />
                  </ul>

                  <span>Previous</span>
                </div>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="col-md-6 col-sm-12 order-md-2 order-1">
          <ToggleButton>
            <div className="days-container ">
              <ul className="days-tab">
                <li
                  id="BT-salesDashboard-days"
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
            dateOptionsWithYearOverYear,
            dateOptionsWithYearOverYear[0].label,
            getSelectComponents,
            dateOptionsWithYearOverYear[0],
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
          isAdManagerAdmin={isAdManagerAdmin}
          isBGSAdmin={isBGSAdmin}
        />
        <CustomDateModal
          id="BT-salesSponsoredDashboard-daterange"
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
    role: [],
    id: '',
  },
  data: {},
};

SalesDashboard.propTypes = {
  marketplaceChoices: arrayOf(PropTypes.object),
  selectedMarketplace: string,
  userInfo: shape({
    role: string.isRequired,
    id: string,
  }),
  data: shape({ sub: string, label: string }),
};
