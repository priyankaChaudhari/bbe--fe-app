/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import _ from 'lodash';
import $ from 'jquery';
import getSymbolFromCurrency from 'currency-symbol-map';
import styled from 'styled-components';
import { arrayOf, bool, shape, string } from 'prop-types';
import { components } from 'react-select';
import { useMediaQuery } from 'react-responsive';

import {
  CustomDateModal,
  DropDownIndicator,
  PageLoader,
  WhiteCard,
} from '../../../../common';
import {
  getAdManagerAdminGraphData,
  getKeyContributionData,
  getManagersList,
} from '../../../../api';
import useBindDSPResponseData from '../../../../hooks/useBindDspData';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import {
  dateOptions,
  noGraphDataMessage,
} from '../../../../constants/CompanyPerformanceConstants';
import DSPMetrics from './DSPMetrics';
import DSPPacing from './DSPPacing';
import DSPKeyContributors from './DSPKeyContributors';
import DSPFilter from './DSPFilter';
import Theme from '../../../../theme/Theme';
import DSPPerformanceChart from '../../../Customer/CompanyPerformance/DSPPerformanceChart';
import { getDspPacindgData } from '../../../../api/CustomerApi';
import { dspPacingTestData } from '../../../../constants/DSPPacingData';

const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 3);

const DSPDashboard = ({ marketplaceChoices }) => {
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

  const [selectedAdManager, setSelectedAdManager] = useState({
    value: 'all',
    label: 'All Ad Manager',
  });
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [selectedAdDF, setSelectedAdDF] = useState({
    value: 'week',
    label: 'Recent 7 days',
    sub: 'vs Previous 7 days',
  });
  const [dspGroupBy, setDSPGroupBy] = useState('daily');
  const [selectedSpendingOption, setSelectedSpendingOption] = useState(
    'overSpending',
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
    getManagersList('Sponsored Advertising Ad Manager').then((adm) => {
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
      ).then((res) => {
        if (res && res.status === 400) {
          setDspGraphLoader(false);
        }
        if (res && res.status === 200) {
          // setDspData(res.data);
          if (res.data && res.data.result) {
            setTempDSPChartData(res.data.result);
          } else {
            setTempDSPChartData(null);
          }
          setDspGraphLoader(false);
        }
      });
    },
    [],
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
    [],
  );

  const getDSPPacingData = useCallback(
    (selectedDailyFact, marketplace, selectedAdManagerUser) => {
      setDspPacingLoader(true);
      getDspPacindgData(
        selectedDailyFact,
        marketplace,
        selectedAdManagerUser,
      ).then((res) => {
        if (res && res.status === 400) {
          setDspPacingLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.result) {
            // setDspPacingData(res.data.result);
          } else if (res.data && res.data.results) {
            // setDspPacingData(res.data.results);
          } else {
            setDspPacingData(null);
          }
        }
        setDspPacingLoader(false);
        setDspPacingData(dspPacingTestData.result);
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
      getDSPData(selectedAdDF.value, dspGroupBy, selectedMarketplace);
      getContributionData(
        selectedAdDF.value,
        'all',
        selectedAdManager.value,
        keyContributionValue(selectedAdManager.value, selectedKeyContribution),
        selectedTabMatrics,
      );
      getDSPPacingData(
        selectedAdDF.value,
        selectedMarketplace,
        selectedAdManager.value,
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
  ]);

  const DSPYearAndCustomDateFilter = (
    startDate,
    endDate,
    value,
    marketplace = selectedMarketplace,
    adManagerUser,
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

      getDSPData(value, temp, marketplace, adManagerUser, sd, ed);
    } else {
      getDSPData(value, temp, marketplace, adManagerUser);
    }
  };

  const handleMarketplaceOptions = (event) => {
    setSelectedMarketplace(event.value);
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
        selectedMarketplace,
        selectedAdManager.value,
        keyContributionValue(selectedAdManager.value, selectedKeyContribution),
        selectedTabMatrics,
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
        selectedMarketplace,
        value,
      );
    } else {
      getDSPData(selectedAdDF.value, dspGroupBy, selectedMarketplace, value);
      getContributionData(
        selectedAdDF.value,
        selectedMarketplace,
        value,
        keyContributionValue(value, true),
        selectedTabMatrics,
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
          selectedMarketplace,
          selectedAdManager.value,
        );
        getContributionData(
          value,
          selectedMarketplace,
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
          selectedMarketplace,
          selectedAdManager.value,
        );
        getContributionData(
          value,
          selectedMarketplace,
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
          selectedMarketplace,
          selectedAdManager.value,
        );
        getContributionData(
          value,
          selectedMarketplace,
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
    $('.checkboxes input:radio').filter("[value='all']").prop('checked', true);
    setSelectedAdManager({ value: 'all', label: 'All Ad Manager' });
    setSelectedMarketplace('all');
    setSelectedKeyContribution(true);

    getDSPData(selectedAdDF.value, dspGroupBy, 'all', 'all');
    getContributionData(
      selectedAdDF.value,
      'all',
      'all',
      keyContributionValue('all', true),
      selectedTabMatrics,
    );
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

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
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
      getDSPData(
        selectedAdDF.value,
        value,
        selectedMarketplace,
        selectedAdManager.value,
      );
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
      getContributionData(
        selectedAdDF.value,
        selectedMarketplace,
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
        selectedMarketplace,
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
        selectedAdDF.value,
        selectedMarketplace.value,
        selectedAdManager.value,
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
          {/* {DropDown(
            'days-performance',
            dateOptions,
            null,
            getSelectComponents,
            dateOptions[0],
            handleAdDailyFact,
          )} */}

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
          getSelectComponents={getSelectComponents}
          handleAdManagerFilter={handleAdManagerFilter}
          isApiCall={dspGraphLoader}
          handleResetFilter={handleResetFilter}
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
                      checked={dspFilters.month}
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
          // data={dspPacingData}
          data={dspPacingData}
          handleSpendingOptions={handleSpendingOptions}
          selectedOption={selectedSpendingOption}
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
};
