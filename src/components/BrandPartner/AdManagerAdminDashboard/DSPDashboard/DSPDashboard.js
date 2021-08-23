/* eslint-disable jsx-a11y/label-has-associated-control */
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
import DSPPerformanceChart from '../../../Customer/CompanyPerformance/DSPPerformanceChart';
import {
  CustomDateModal,
  DropDownIndicator,
  PageLoader,
  WhiteCard,
} from '../../../../common';
import {
  getAdManagerAdminGraphData,
  getDspPacingDahboardData,
  getKeyContributionData,
  getManagersList,
} from '../../../../api';
import useBindDSPResponseData from '../../../../hooks/useBindDspData';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import {
  dateOptions,
  noGraphDataMessage,
} from '../../../../constants/CompanyPerformanceConstants';

const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 2);
const month = dayjs(currentDate).format('MMMM');

const DSPDashboard = ({ marketplaceChoices, userInfo }) => {
  const isAdManagerAdmin = userInfo && userInfo.role === 'Ad Manager Admin';
  const selectInputRef = useRef();
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const { Option, SingleValue } = components;
  const [dspGraphLoader, setDspGraphLoader] = useState(false);

  const [selectedKeyContribution, setSelectedKeyContribution] = useState(true);
  const [keyContributionLoader, setKeyContributionLoader] = useState(false);
  const [showAdCustomDateModal, setShowAdCustomDateModal] = useState(false);
  const [isCustomDateApply, setIsCustomDateApply] = useState(false);
  const [dspPacingLoader, setDspPacingLoader] = useState(false);

  const [marketplaceOptions, setMarketplaceOptions] = useState([]);
  const [dspManagerList, setDSPManagerList] = useState([]);
  const [selectedAdManager, setSelectedAdManager] = useState(
    isAdManagerAdmin
      ? {
          value: 'all',
          label: 'All Ad Manager',
        }
      : { value: userInfo.id, label: '' },
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
  const [dspGroupBy, setDSPGroupBy] = useState('daily');
  const [selectedSpendingOption, setSelectedSpendingOption] = useState(
    'overspending',
  );

  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  const [tempDspChartData, setTempDSPChartData] = useState(null);
  const [dspPacingData, setDspPacingData] = useState(null);
  const [responseId, setResponseId] = useState(null);

  const [selectedDspMetrics, setSelectedDspMetrics] = useState({
    dspImpressions: true,
  });
  const [adState, setAdState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'adSelection',
    },
  ]);

  const [dspFilters, setDSPFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });

  const [selectedTabMatrics, setSelectedTabMetrics] = useState(
    'dspImpressions',
  );

  const {
    dspChartData,
    dspCurrentTotal,
    dspPreviousTotal,
    dspDifference,
  } = useBindDSPResponseData(tempDspChartData);

  const keyContributionValue = useCallback((adManager, keyContribution) => {
    if (adManager === 'all') {
      if (keyContribution) {
        return 'positive';
      }

      return 'negative';
    }
    if (keyContribution) {
      return 'contribution';
    }
    return 'keyMetrics';
  }, []);

  const getAdManagersList = useCallback(() => {
    getManagersList('DSP Ad Manager').then((adm) => {
      if (adm && adm.data && adm.data.length) {
        const list = [{ value: 'all', label: 'All Ad Managers' }];
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
          setDSPManagerList(list);
        }
      }
    });
  }, []);

  const getDays = (startDate, endDate) => {
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDSPData = useCallback(
    (
      selectedDailyFact,
      selectedGroupBy,
      marketplace,
      selectedAdManagerUser,
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
        selectedAdManagerUser,
        startDate,
        endDate,
        userInfo,
      ).then((res) => {
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
      });
    },
    [userInfo],
  );

  const getContributionData = useCallback(
    (
      selectedDailyFact,
      marketplace,
      selectedAdManagerUser,
      contributionType,
      selectedMatrics,
      startDate = null,
      endDate = null,
    ) => {
      setKeyContributionLoader(true);
      getKeyContributionData(
        'dsp_ad_performance',
        null,
        selectedDailyFact,
        marketplace,
        selectedAdManagerUser,
        contributionType,
        selectedMatrics,
        startDate,
        endDate,
        userInfo,
      ).then((res) => {
        if (res && res.status === 400) {
          setKeyContributionLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.result) {
            setContributionData(res.data.result);
          } else if (res.data && res.data.results) {
            setContributionData(res.data.results);
          } else {
            setContributionData([]);
          }
          setKeyContributionLoader(false);
        }
      });
    },
    [userInfo],
  );

  const getDSPPacingData = useCallback(
    (marketplace, selectedAdManagerUser, spendingOption) => {
      setDspPacingLoader(true);
      getDspPacingDahboardData(
        marketplace,
        selectedAdManagerUser,
        spendingOption,
      ).then((res) => {
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
      });
    },
    [],
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
      getDSPData(selectedAdDF.value, dspGroupBy, selectedMarketplace.value);
      getContributionData(
        selectedAdDF.value,
        'all',
        selectedAdManager.value,
        keyContributionValue(selectedAdManager.value, selectedKeyContribution),
        selectedTabMatrics,
      );
      getDSPPacingData(
        selectedMarketplace.value,
        selectedAdManager.value,
        selectedSpendingOption,
      );
      setCurrency('USD');
      setCurrencySymbol(getSymbolFromCurrency('USD'));
      setResponseId('12345');
    }
  }, [
    marketplaceChoices,
    currency,
    getAdManagersList,
    responseId,
    getDSPData,
    selectedAdDF,
    dspGroupBy,
    selectedMarketplace,
    getContributionData,
    selectedAdManager,
    selectedTabMatrics,
    keyContributionValue,
    selectedKeyContribution,
    getDSPPacingData,
    selectedSpendingOption,
  ]);

  const DSPYearAndCustomDateFilter = (
    startDate,
    endDate,
    value,
    marketplace = selectedMarketplace.value,
    adManagerUser,
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

    // } else if (diffDays > 60 && diffDays <= 180) {
    //   temp = 'weekly';
    //   setDSPFilters({ daily: false, weekly: true, month: true });
    //   setDSPGroupBy('weekly');
    // } else if (diffDays > 180) {
    //   temp = 'weekly';
    //   setDSPFilters({ daily: false, weekly: true, month: true });
    //   setDSPGroupBy('weekly');
    // }

    if (value === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;

      getDSPData(value, temp, marketplace, adManagerUser, sd, ed);
      if (!selectedKeyContribution) {
        getContributionData(
          value,
          marketplace,
          selectedAdManager.value,
          keyContributionValue(
            selectedAdManager.value,
            selectedKeyContribution,
          ),
          selectedTabMatrics,
          sd,
          ed,
        );
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
        selectedAdManager.value,
      );
    } else {
      getDSPData(selectedAdDF.value, dspGroupBy, event.value);
      getContributionData(
        selectedAdDF.value,
        event.value,
        selectedAdManager.value,
        keyContributionValue(selectedAdManager.value, selectedKeyContribution),
        selectedTabMatrics,
      );
      getDSPPacingData(
        event.value,
        selectedAdManager.value,
        selectedSpendingOption,
      );
    }
  };

  const handleAdManagerFilter = (event) => {
    const { value } = event;
    setSelectedAdManager(event);
    setSelectedKeyContribution(true);
    if (selectedAdDF.value === 'custom') {
      DSPYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        selectedMarketplace.value,
        value,
      );
    } else {
      getDSPData(
        selectedAdDF.value,
        dspGroupBy,
        selectedMarketplace.value,
        value,
      );
      getContributionData(
        selectedAdDF.value,
        selectedMarketplace.value,
        value,
        keyContributionValue(value, true),
        selectedTabMatrics,
      );
      getDSPPacingData(
        selectedMarketplace.value,
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
          selectedAdManager.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
          keyContributionValue(
            selectedAdManager.value,
            selectedKeyContribution,
          ),
          selectedTabMatrics,
        );
        break;

      case 'month':
        setDSPFilters({ daily: true, weekly: false, month: false });
        setDSPGroupBy('daily');
        getDSPData(
          value,
          'daily',
          selectedMarketplace.value,
          selectedAdManager.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
          keyContributionValue(
            selectedAdManager.value,
            selectedKeyContribution,
          ),
          selectedTabMatrics,
        );
        break;

      case '30days':
        setDSPFilters({ daily: true, weekly: false, month: false });
        setDSPGroupBy('daily');
        getDSPData(
          value,
          'daily',
          selectedMarketplace.value,
          selectedAdManager.value,
        );
        getContributionData(
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
          keyContributionValue(
            selectedAdManager.value,
            selectedKeyContribution,
          ),
          selectedTabMatrics,
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
    setSelectedMarketplace({
      value: 'all',
      label: 'All Marketplaces',
      currency: 'USD',
    });

    if (isAdManagerAdmin) {
      setSelectedAdManager({
        value: 'all',
        label: 'All Ad Manager',
      });
    } else {
      setSelectedAdManager({
        value: userInfo.id,
        label: '',
      });
    }

    setSelectedKeyContribution(!isAdManagerAdmin);

    if (selectedAdDF.value === 'custom') {
      DSPYearAndCustomDateFilter(
        adState[0].startDate,
        adState[0].endDate,
        'custom',
        'all',
        'all',
      );
    } else {
      getDSPData(selectedAdDF.value, dspGroupBy, 'all', 'all');
      getContributionData(
        selectedAdDF.value,
        'all',
        'all',
        keyContributionValue(isAdManagerAdmin ? 'all' : '', true),
        selectedTabMatrics,
      );
    }
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

  const applyCustomDate = () => {
    setIsCustomDateApply(true);

    DSPYearAndCustomDateFilter(
      adState[0].startDate,
      adState[0].endDate,
      'custom',
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
          selectedAdManager.value,
          sd,
          ed,
        );
      } else {
        getDSPData(
          selectedAdDF.value,
          value,
          selectedMarketplace.value,
          selectedAdManager.value,
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
    if (value !== selectedKeyContribution) {
      setSelectedKeyContribution(value);
      if (selectedAdDF.value === 'custom' && value) {
        return;
      }

      getContributionData(
        selectedAdDF.value,
        selectedMarketplace.value,
        selectedAdManager.value,
        keyContributionValue(selectedAdManager.value, value),
        selectedTabMatrics,
      );
    }
  };

  const handleOnMatricsTabChange = (value) => {
    if (value !== selectedTabMatrics) {
      setSelectedTabMetrics(value);
      getContributionData(
        selectedAdDF.value,
        selectedMarketplace.value,
        selectedAdManager.value,
        keyContributionValue(selectedAdManager.value, selectedKeyContribution),
        value,
      );
    }
  };

  const handleSpendingOptions = (type) => {
    if (type !== selectedSpendingOption) {
      setSelectedSpendingOption(type);
      getDSPPacingData(
        selectedMarketplace.value,
        selectedAdManager.value,
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
          adManagerList={dspManagerList}
          getAdManagerComponents={getAdManagerComponents}
          handleAdManagerFilter={handleAdManagerFilter}
          isApiCall={dspGraphLoader}
          handleResetFilter={handleResetFilter}
          selectInputRef={selectInputRef}
          selectedAdManager={selectedAdManager}
          selectedMarketplace={selectedMarketplace}
          isAdManagerAdmin={isAdManagerAdmin}
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
                      checked={dspFilters.daily}
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
          selectedKeyContribution={selectedKeyContribution}
          selectedAdManager={selectedAdManager.value}
          handleContribution={handleContribution}
          selectedDSPMatrics={selectedDspMetrics}
          selectedTabMatrics={selectedTabMatrics}
          handleOnMatricsTabChange={handleOnMatricsTabChange}
          loader={keyContributionLoader}
          data={contributionData}
          currencySymbol={currencySymbol}
          isDesktop={isDesktop}
          selectedAdDF={selectedAdDF}
        />
        <DSPPacing
          currencySymbol={currencySymbol}
          loader={dspPacingLoader}
          dspSpendData={dspPacingData && dspPacingData.dsp_pacing_all[0]}
          data={dspPacingData}
          handleSpendingOptions={handleSpendingOptions}
          selectedOption={selectedSpendingOption}
          month={month}
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
    role: string,
    id: string,
  }),
};
