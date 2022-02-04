import React, { useCallback, useEffect, useState, useRef } from 'react';

import dayjs from 'dayjs';
import _ from 'lodash';
import getSymbolFromCurrency from 'currency-symbol-map';
import styled from 'styled-components';
import { arrayOf, bool, shape, string } from 'prop-types';
import { components } from 'react-select';
import { useMediaQuery } from 'react-responsive';

import DSPMetrics from './DSPMetrics';
import DSPPacing from './DSPPacing';
import DSPKeyContributors from './DSPKeyContributors';
import DSPFilter from './DSPFilter';
import Theme from '../../../../theme/Theme';
import DSPPerformanceChart from '../../../Customer/CompanyPerformance/AdPerformanceView/DSPPerformanceChart';
import {
  CustomDateModal,
  DropdownIndicator,
  PageLoader,
  WhiteCard,
  ToggleButton,
} from '../../../../common';
import {
  getAdManagerAdminGraphData,
  getDspPacingDahboardData,
  getKeyContributionData,
  getManagersList,
  getBgsUserList,
} from '../../../../api';
import useBindDSPResponseData from '../../../../hooks/useBindDspData';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { dateOptions, noGraphDataMessage } from '../../../../constants';

const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
const month = dayjs(currentDate).format('MMMM');

const DSPDashboard = ({ marketplaceChoices, userInfo }) => {
  const mounted = useRef(false);
  const isAdManagerAdmin = userInfo?.role === 'Ad Manager Admin';
  const isBGSManager = userInfo?.role === 'BGS Manager';
  const isBGSAdmin = userInfo?.role === 'BGS Admin';
  const isBGS = userInfo?.role === 'BGS';
  const selectInputRef = useRef();
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const { Option, SingleValue } = components;
  const [dspGraphLoader, setDspGraphLoader] = useState(false);
  const tab = isAdManagerAdmin || isBGSAdmin ? 'positive' : 'contribution';
  const [selectedContributionOption, setSelectedContributionOption] = useState(
    tab,
  );
  const [keyContributionLoader, setKeyContributionLoader] = useState(false);
  const [showAdCustomDateModal, setShowAdCustomDateModal] = useState(false);
  const [isCustomDateApply, setIsCustomDateApply] = useState(false);
  const [dspPacingLoader, setDspPacingLoader] = useState(false);
  const [marketplaceOptions, setMarketplaceOptions] = useState([]);
  const [managerList, setManagersList] = useState([]);
  const [bgsList, setBgsList] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  const [tempDspChartData, setTempDSPChartData] = useState(null);
  const [dspPacingData, setDspPacingData] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [contributionCount, setContributionCount] = useState(null);
  const [dspGroupBy, setDSPGroupBy] = useState('daily');
  const [selectedSpendingOption, setSelectedSpendingOption] = useState(
    'overspending',
  );
  const [selectedDspMetrics, setSelectedDspMetrics] = useState({
    dspImpressions: true,
  });
  const [selectedTabMatrics, setSelectedTabMetrics] = useState(
    'dspImpressions',
  );
  const [selectedMarketplace, setSelectedMarketplace] = useState({
    value: 'all',
    label: 'All Marketplaces',
    currency: 'USD',
  });
  const [selectedAdDF, setSelectedAdDF] = useState({
    value: 'week',
    label: 'Recent 7 days',
    sub: 'vs Previous 7 days',
  });
  const [dspFilters, setDSPFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });
  const [adState, setAdState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'adSelection',
    },
  ]);
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

  const {
    dspChartData,
    dspCurrentTotal,
    dspPreviousTotal,
    dspDifference,
  } = useBindDSPResponseData(tempDspChartData);

  const getManagerList = useCallback(() => {
    getManagersList(isBGSAdmin ? 'BGS' : 'dsp_ad_performance').then(
      (managersData) => {
        if (mounted.current) {
          if (
            managersData &&
            managersData.data &&
            managersData.data.length > 0
          ) {
            const list = [{ value: 'all', label: 'All' }];
            for (const brand of managersData.data) {
              list.push({
                value: brand.id,
                label: `${brand.first_name} ${brand.last_name}`,
                icon:
                  brand.documents &&
                  brand.documents[0] &&
                  Object.values(brand.documents[0]) &&
                  Object.values(brand.documents[0])[0],
              });
              setManagersList(list);
            }
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

  const getDSPData = useCallback(
    (
      selectedDailyFact,
      selectedGroupBy,
      marketplace,
      selectedManagerUser,
      selectedBgsUser,
      startDate = null,
      endDate = null,
    ) => {
      setDspGraphLoader(true);
      getAdManagerAdminGraphData(
        'dsp-dashboard',
        null,
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
            setDspGraphLoader(false);
          }
          if (res && res.status === 200) {
            if (res.data && res.data.result) {
              setTempDSPChartData(res.data.result);
            } else {
              setTempDSPChartData(null);
            }
            setDspGraphLoader(false);
          }
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
      selectedMatrics,
      startDate = null,
      endDate = null,
      page,
    ) => {
      setKeyContributionLoader(true);
      getKeyContributionData(
        'dsp_ad_performance',
        null,
        selectedDailyFact,
        marketplace,
        selectedManagerUser,
        selectedBgsUser,
        isBGSManager,
        isBGSAdmin,
        isBGS,
        contributionType,
        selectedMatrics,
        startDate,
        endDate,
        page,
      ).then((res) => {
        if (mounted.current) {
          if (res && res.status === 500) {
            setKeyContributionLoader(false);
            setContributionData(null);
          }

          if (res && res.status === 400) {
            setKeyContributionLoader(false);
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
        }
      });
    },
    [isBGSManager, isBGSAdmin, isBGS],
  );

  const getDSPPacingData = useCallback(
    (marketplace, selectedManagerUser, selectedBgsUser, spendingOption) => {
      setDspPacingLoader(true);
      getDspPacingDahboardData(
        marketplace,
        selectedManagerUser,
        selectedBgsUser,
        spendingOption,
        isBGSManager,
        isBGSAdmin,
        isBGS,
      ).then((res) => {
        if (mounted.current) {
          if (res && res.status === 400) {
            setDspPacingLoader(false);
          }
          if (res && res.status === 200) {
            if (res.data && res.data.result) {
              setDspPacingData(res.data.result);
            } else if (res.data && res.data.results) {
              setDspPacingData(res.data.results);
            } else {
              setDspPacingData(null);
            }
          }
          setDspPacingLoader(false);
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
      getDSPData(
        selectedAdDF.value,
        dspGroupBy,
        selectedMarketplace.value,
        selectedManager.value,
        selectedBgs.value,
      );
      getContributionData(
        selectedAdDF.value,
        'all',
        selectedManager.value,
        selectedBgs.value,
        selectedContributionOption,
        selectedTabMatrics,
        null,
        null,
        pageNumber,
      );
      getDSPPacingData(
        selectedMarketplace.value,
        selectedManager.value,
        selectedBgs.value,
        selectedSpendingOption,
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
    currency,
    isAdManagerAdmin,
    isBGSAdmin,
    isBGSManager,
    responseId,
    userInfo,
    selectedAdDF,
    dspGroupBy,
    selectedMarketplace,
    selectedSpendingOption,
    pageNumber,
    selectedManager,
    selectedTabMatrics,
    selectedContributionOption,
    selectedBgs,
    getBGSList,
    getDSPPacingData,
    getManagerList,
    getDSPData,
    getContributionData,
  ]);

  const getDays = (startDate, endDate) => {
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const DSPYearAndCustomDateFilter = (
    startDate,
    endDate,
    value,
    marketplace = selectedMarketplace.value,
    managerUser,
    bgsUser,
  ) => {
    let temp = '';
    let sd = startDate;
    let ed = endDate;
    const diffDays = getDays(startDate, endDate);
    if (diffDays <= 30) {
      temp = 'daily';
      setDSPFilters({ daily: true, weekly: false, month: false });
      setDSPGroupBy('daily');
    } else if (diffDays > 30 && diffDays <= 60) {
      temp = 'daily';
      setDSPFilters({ daily: true, weekly: true, month: false });
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

      getDSPData(value, temp, marketplace, managerUser, bgsUser, sd, ed);
      if (selectedContributionOption === 'keyMetrics') {
        getContributionData(
          value,
          marketplace,
          managerUser,
          bgsUser,
          selectedContributionOption,
          selectedTabMatrics,
          sd,
          ed,
          1,
        );
        setPageNumber(1);
      }
    }
  };

  const handleMarketplaceOptions = (event) => {
    setSelectedMarketplace(event);
    setCurrency(event.currency);
    setCurrencySymbol(getSymbolFromCurrency(event.currency));
    if (selectedAdDF.value === 'custom') {
      DSPYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        event.value,
        selectedManager.value,
        selectedBgs.value,
      );
    } else {
      getDSPData(
        selectedAdDF.value,
        dspGroupBy,
        event.value,
        selectedManager.value,
        selectedBgs.value,
      );
      getContributionData(
        selectedAdDF.value,
        event.value,
        selectedManager.value,
        selectedBgs.value,
        selectedContributionOption,
        selectedTabMatrics,
        null,
        null,
        1,
      );
      setPageNumber(1);
    }
    getDSPPacingData(
      event.value,
      selectedManager.value,
      selectedBgs.value,
      selectedSpendingOption,
    );
  };

  const handleManagerFilter = (event) => {
    const { value } = event;
    let tabOption = '';
    let bgsUser = selectedBgs.value;
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

    if (!isBGSManager && value === 'all') {
      setSelectedContributionOption('positive');
      tabOption = 'positive';
    } else {
      setSelectedContributionOption('contribution');
      tabOption = 'contribution';
    }
    if (selectedAdDF.value === 'custom') {
      DSPYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        selectedMarketplace.value,
        value,
        bgsUser,
      );
    } else {
      getDSPData(
        selectedAdDF.value,
        dspGroupBy,
        selectedMarketplace.value,
        value,
        bgsUser,
      );
      getContributionData(
        selectedAdDF.value,
        selectedMarketplace.value,
        value,
        bgsUser,
        tabOption,
        selectedTabMatrics,
        null,
        null,
        1,
      );
      setPageNumber(1);
    }
    getDSPPacingData(
      selectedMarketplace.value,
      value,
      bgsUser,
      selectedSpendingOption,
    );
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
      if (selectedAdDF.value === 'custom') {
        DSPYearAndCustomDateFilter(
          adState[0].startDate,
          adState[0].endDate,
          'custom',
          selectedMarketplace.value,
          manager,
          value,
        );
      } else {
        getDSPData(
          selectedAdDF.value,
          dspGroupBy,
          selectedMarketplace.value,
          manager,
          value,
        );
        getContributionData(
          selectedAdDF.value,
          selectedMarketplace.value,
          manager,
          value,
          selectedContributionOption,
          selectedTabMatrics,
          null,
          null,
          1,
        );
        setPageNumber(1);
      }
      getDSPPacingData(
        selectedMarketplace.value,
        manager,
        value,
        selectedSpendingOption,
      );
    }
  };

  const setGropuByFilter = (value) => {
    switch (value) {
      case 'week':
        setDSPFilters({ daily: true, weekly: false, month: false });
        setDSPGroupBy('daily');
        getDSPData(
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
          selectedTabMatrics,
          null,
          null,
          pageNumber,
        );
        break;

      case 'month':
        setDSPFilters({ daily: true, weekly: true, month: false });
        setDSPGroupBy('daily');
        getDSPData(
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
          selectedTabMatrics,
          null,
          null,
          pageNumber,
        );
        break;

      case '30days':
        setDSPFilters({ daily: true, weekly: true, month: false });
        setDSPGroupBy('daily');
        getDSPData(
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
          selectedTabMatrics,
          null,
          null,
          pageNumber,
        );
        break;

      default:
        break;
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
    if (value === 'custom') {
      setShowAdCustomDateModal(true);
    } else {
      setGropuByFilter(value);
    }
  };

  const handleResetFilter = () => {
    let contributionTab = 'contribution';
    let userManger = 'all';
    let userBgs = 'all';
    setSelectedMarketplace({
      value: 'all',
      label: 'All Marketplaces',
      currency: 'USD',
    });

    setCurrency('USD');
    setCurrencySymbol(getSymbolFromCurrency('USD'));

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

    if (selectedAdDF.value === 'custom') {
      DSPYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        'all',
        userManger,
        userBgs,
      );
    } else {
      getDSPData(selectedAdDF.value, dspGroupBy, 'all', userManger, userBgs);
      getContributionData(
        selectedAdDF.value,
        'all',
        userManger,
        userBgs,
        selectedContributionOption,
        selectedTabMatrics,
        null,
        null,
        1,
      );
      setPageNumber(1);
    }
    getDSPPacingData('all', userManger, userBgs, selectedSpendingOption);
  };

  const renderCustomDateSubLabel = (data) => {
    if (selectedAdDF.value === 'custom' && isCustomDateApply) {
      return `From- ${dayjs(adState[0].startDate).format(
        'MMM D, YYYY',
      )}  To- ${dayjs(adState[0].endDate).format('MMM D, YYYY')}`;
    }
    return data.sub;
  };

  const filterOption = ({ data, ...props }) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: Theme.black }}>
          {data.label}
        </span>
        <div style={{ fontSize: '12px', color: Theme.gray40 }}>{data.sub}</div>
      </div>
    </Option>
  );

  const singleFilterOption = ({ data, ...props }) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: Theme.black }}>{data.label}</span>

      <div style={{ fontSize: '12px', color: Theme.gray40 }}>
        {renderCustomDateSubLabel(data)}
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
      DropdownIndicator,
    };
  };

  const getAdManagerComponents = () => {
    return {
      Option: filterOption,
      SingleValue: adMnagerFilterOption,
      DropdownIndicator,
    };
  };

  const applyCustomDate = () => {
    setIsCustomDateApply(true);

    DSPYearAndCustomDateFilter(
      adState[0].startDate,
      adState[0].endDate,
      'custom',
      selectedMarketplace.value,
      selectedManager.value,
      selectedBgs.value,
    );

    setShowAdCustomDateModal(false);
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

        getDSPData(
          selectedAdDF.value,
          value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
          sd,
          ed,
        );
      } else {
        getDSPData(
          selectedAdDF.value,
          value,
          selectedMarketplace.value,
          selectedManager.value,
          selectedBgs.value,
        );
      }
    }
  };

  const setBoxToggle = (name) => {
    if (
      Object.prototype.hasOwnProperty.call(selectedDspMetrics, name) &&
      _.size(selectedDspMetrics) > 1
    ) {
      setSelectedDspMetrics(_.omit(selectedDspMetrics, [name]));
    } else if (_.size(selectedDspMetrics) < 4) {
      setSelectedDspMetrics(
        _.omit(_.assign(selectedDspMetrics, { [name]: true })),
      );
    }
  };

  const setBoxClasses = (name, classValue) => {
    let selectedClass = '';
    if (Object.prototype.hasOwnProperty.call(selectedDspMetrics, name)) {
      selectedClass = `order-chart-box ${classValue} fix-height`;
    } else if (_.size(selectedDspMetrics) === 4) {
      selectedClass = 'order-chart-box fix-height disabled';
    } else {
      selectedClass = 'order-chart-box fix-height';
    }
    return selectedClass;
  };

  const handleContribution = (value) => {
    if (value !== selectedContributionOption) {
      setSelectedContributionOption(value);
      if (selectedAdDF.value === 'custom' && value) {
        return;
      }

      getContributionData(
        selectedAdDF.value,
        selectedMarketplace.value,
        selectedManager.value,
        selectedBgs.value,
        value,
        selectedTabMatrics,
        null,
        null,
        1,
      );
      setPageNumber(1);
    }
  };

  const handleOnMatricsTabChange = (value) => {
    if (value !== selectedTabMatrics) {
      setSelectedTabMetrics(value);
      getContributionData(
        selectedAdDF.value,
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

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getContributionData(
      selectedAdDF.value,
      selectedMarketplace.value,
      selectedManager.value,
      selectedBgs.value,
      selectedContributionOption,
      selectedTabMatrics,
      null,
      null,
      currentPage,
    );
  };

  const handleSpendingOptions = (type) => {
    if (type !== selectedSpendingOption) {
      setSelectedSpendingOption(type);
      getDSPPacingData(
        selectedMarketplace.value,
        selectedManager.value,
        selectedBgs.value,
        type,
      );
    }
  };

  const renderDspDailyFact = () => {
    return (
      <div className="row">
        <div className="col-md-6 col-sm1-12">
          {' '}
          <p className="black-heading-title mt-2 mb-4"> DSP Ad Performance</p>
        </div>
        <div className="col-md-6 col-sm1-12  mb-3">
          {DropDown(
            'days-performance',
            dateOptions,
            dateOptions[0].label,
            getSelectComponents,
            dateOptions[0],
            handleAdDailyFact,
            dspGraphLoader,
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
        <DSPFilter
          options={marketplaceOptions}
          handleMarketplaceOptions={handleMarketplaceOptions}
          managerList={managerList}
          getAdManagerComponents={getAdManagerComponents}
          handleManagerFilter={handleManagerFilter}
          isApiCall={dspGraphLoader}
          handleResetFilter={handleResetFilter}
          selectInputRef={selectInputRef}
          selectedManager={selectedManager}
          selectedBgs={selectedBgs}
          bgsList={bgsList}
          handleBGSList={handleBGSList}
          selectedMarketplace={selectedMarketplace}
          isAdManagerAdmin={isAdManagerAdmin}
          isBGSManager={isBGSManager}
          isBGSAdmin={isBGSAdmin}
        />
      </div>
      <div className="col-lg-9 col-md-12">
        <WhiteCard className="mb-3">
          {renderDspDailyFact()}
          <DSPMetrics
            currencySymbol={currencySymbol}
            dspCurrentTotal={dspCurrentTotal}
            dspDifference={dspDifference}
            dspPreviousTotal={dspPreviousTotal}
            setBoxToggle={setBoxToggle}
            setBoxClasses={setBoxClasses}
          />
          <CustomDateModal
            id="BT-dspdashboard-daterange"
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
                {selectedAdDF.value !== 'custom' ? (
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
                      className={
                        dspFilters.daily === false ? 'disabled-tab' : ''
                      }>
                      {' '}
                      <input
                        className="d-none"
                        type="radio"
                        id="daysCheck"
                        name="flexRadioDefault1"
                        value={dspGroupBy}
                        checked={dspFilters.daily && dspGroupBy === 'daily'}
                        onClick={() => handleDSPGroupBy('daily')}
                        onChange={() => {}}
                      />
                      <label htmlFor="daysCheck">Daily</label>
                    </li>

                    <li
                      className={
                        dspFilters.weekly === false ? 'disabled-tab' : ''
                      }>
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
                      className={
                        dspFilters.month === false ? 'disabled-tab' : ''
                      }>
                      <input
                        className=" d-none"
                        type="radio"
                        id="monthlyCheck"
                        name="flexRadioDefault1"
                        value={dspGroupBy}
                        checked={dspFilters.month && dspGroupBy === 'monthly'}
                        onChange={() => handleDSPGroupBy('monthly')}
                      />
                      <label htmlFor="monthlyCheck">Monthly</label>
                    </li>
                  </ul>
                </div>
              </ToggleButton>
            </div>
          </div>
          {dspGraphLoader ? (
            <PageLoader
              component="performance-graph"
              color={Theme.orange}
              type="detail"
              width={40}
              height={40}
            />
          ) : dspChartData.length >= 1 ? (
            <DSPPerformanceChart
              chartId="dspChart"
              chartData={dspChartData}
              currencySymbol={currencySymbol}
              selectedBox={selectedDspMetrics}
              selectedDF={selectedAdDF.value}
              isDashboard
            />
          ) : (
            <NoData>{noGraphDataMessage}</NoData>
          )}
        </WhiteCard>

        <DSPKeyContributors
          selectedContributionOption={selectedContributionOption}
          selectedManager={selectedManager.value}
          selectedDSPMatrics={selectedDspMetrics}
          selectedTabMatrics={selectedTabMatrics}
          loader={keyContributionLoader}
          data={contributionData}
          currencySymbol={currencySymbol}
          isDesktop={isDesktop}
          selectedAdDF={selectedAdDF}
          isAdManagerAdmin={isAdManagerAdmin}
          isBGSAdmin={isBGSAdmin}
          contributionCount={contributionCount}
          pageNumber={pageNumber}
          count={contributionCount}
          handleContribution={handleContribution}
          handlePageChange={handlePageChange}
          handleOnMatricsTabChange={handleOnMatricsTabChange}
        />
        <DSPPacing
          currencySymbol={currencySymbol}
          loader={dspPacingLoader}
          dspSpendData={dspPacingData && dspPacingData.dsp_pacing_all[0]}
          data={dspPacingData}
          selectedOption={selectedSpendingOption}
          month={month}
          handleSpendingOptions={handleSpendingOptions}
        />
      </div>
    </div>
  );
};

export default DSPDashboard;

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;

DSPDashboard.defaultProps = {
  marketplaceChoices: [],
  data: {
    label: '',
    sub: '',
  },
  selectProps: {
    menuIsOpen: false,
  },
  userInfo: {},
};

DSPDashboard.propTypes = {
  data: shape({
    label: string,
    sub: string,
  }),
  selectProps: shape({
    menuIsOpen: bool,
  }),
  marketplaceChoices: arrayOf(Array),
  userInfo: shape({
    role: string.isRequired,
    id: string,
  }),
};
