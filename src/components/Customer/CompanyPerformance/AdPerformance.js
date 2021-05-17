/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { components } from 'react-select';
import Modal from 'react-modal';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import dayjs from 'dayjs';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { WhiteCard } from '../../../theme/Global';
import {
  ArrowDownIcon,
  CaretUp,
  CloseIcon,
  ArrowUpIcon,
} from '../../../theme/images/index';
import { DropDown } from './DropDown';
import { ModalBox, Button } from '../../../common';
import {
  dateOptions,
  AdTypesOptions,
} from '../../../constants/CompanyPerformanceConstants';
import { getAdPerformance, getDSPPerformance } from '../../../api';
import DSPPerformanceChart from './DSPPerformanceChart';
import AdPerformanceChart from './AdPerformanceChart';

const getSymbolFromCurrency = require('currency-symbol-map');
const _ = require('lodash');

export default function AdPerformance({ marketplaceChoices, id }) {
  const { Option, SingleValue } = components;
  const [marketplaceOptions, setMarketplaceOptions] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [selectedAdType, setSelectedAdType] = useState('SponsoredProduct');
  const [selectedAdDF, setSelectedAdDF] = useState('week');
  const [selectedDSPDF, setSelectedDSPDF] = useState('week');
  const [selectedAdBox, setSelectedAdBox] = useState({ adSales: true });
  const [adGroupBy, setAdGroupBy] = useState('daily');
  // const [adChartData, setAdChartData] = useState([]);
  const [dspGroupBy, setDSPGroupBy] = useState('daily');
  const [dspChartData, setDSPChratData] = useState([]);
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

  const calculateSalesDifference = (currentTotal, previousTotal) => {
    const diff = ((currentTotal - previousTotal) * 100) / previousTotal;
    if (diff === -Infinity || diff === Infinity || Number.isNaN(diff)) {
      return 'N/A';
    }
    return parseFloat(diff.toFixed(2));
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
          //
        }
        if (res && res.status === 200 && res.data && res.data.daily_facts) {
          // console.log('resss', res.data);
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
      getDSPPerformance(
        id,
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        startDate,
        endDate,
      ).then((res) => {
        if (res && res.status === 400) {
          //
        }
        if (res && res.status === 200 && res.data && res.data.daily_facts) {
          const tempRevenueData = [];
          const dspSpendTodal = {
            previousDspTodal: 0,
            currentDspTodal: 0,
            difference: 0,
          };
          if (
            res.data.daily_facts.previous &&
            res.data.daily_facts.previous.length
          ) {
            res.data.daily_facts.previous.forEach((resData) => {
              tempRevenueData.push({
                value2: resData.revenue,
                label2: resData.revenue !== null ? resData.revenue : '0.00',
              });
            });
          }
          if (
            res.data.daily_facts.current &&
            res.data.daily_facts.current.length
          ) {
            res.data.daily_facts.current.forEach((resData, index) => {
              const dayDate = dayjs(resData.report_date).format('MMM D YYYY');
              dspSpendTodal.currentDspTodal += resData.revenue;
              if (
                res.data.daily_facts.previous &&
                index < res.data.daily_facts.previous.length
              ) {
                tempRevenueData[index].date = dayDate;
                tempRevenueData[index].value1 = resData.revenue;

                if (index > 0) {
                  tempRevenueData[index - 1].dashLength =
                    resData.revenue === null ? 8 : null;
                }

                tempRevenueData[index].dashLength =
                  resData.revenue === null ? 8 : null;
                tempRevenueData[index].label1 =
                  resData.revenue !== null ? resData.revenue : '0.00';

                dspSpendTodal.previousDspTodal +=
                  res.data.daily_facts.previous[index].revenue;
              } else {
                tempRevenueData.push({
                  date: dayDate,
                  value1: resData.revenue,
                  label1: resData.revenue !== null ? resData.revenue : '0.00',
                  label2: '0.00',
                });
              }
            });
          }
          dspSpendTodal.difference = calculateSalesDifference(
            dspSpendTodal.currentDspTodal,
            dspSpendTodal.previousDspTodal,
          );
          setDSPTotal(dspSpendTodal);
          setDSPChratData(tempRevenueData);
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

  const bindValues = (value) => {
    const decimal = _.split(value, '.', 2);
    if (decimal[1] !== undefined) {
      return (
        <span style={{ fontSize: '26px' }}>
          {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          {/* <span style={{ fontSize: '16px' }}>.{decimal[1].slice(0, 2)}</span> */}
          <span>.{decimal[1].slice(0, 2)}</span>
        </span>
      );
    }
    return (
      <span style={{ fontSize: '26px' }}>
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
          {DropDown(
            'cursor',
            marketplaceOptions,
            marketplaceOptions &&
              marketplaceOptions[0] &&
              marketplaceOptions[0].label,
            DropdownIndicator,
            marketplaceOptions && marketplaceOptions[0],
            handleMarketplaceOptions,
          )}
        </div>
      </div>
    );
  };

  const renderAdDailyFacts = () => {
    return (
      <>
        <div className="col-md-3  col-sm1-12">
          {' '}
          <p className="black-heading-title mt-2 mb-4"> Ad Performance</p>
        </div>
        <div className="col-md-9 col-sm1-12  mb-3 pl-0">
          <ul className="ad-performance-nav">
            <li className="ad-performance">
              {' '}
              {DropDown(
                'days-performance',
                AdTypesOptions,
                null,
                getSelectComponents(),
                AdTypesOptions[0],
                handleAdType,
              )}
            </li>
            <li className="day-performance">
              {' '}
              {DropDown(
                'days-performance',
                dateOptions,
                null,
                getSelectComponents(),
                dateOptions[0],
                handleAdDailyFact,
              )}
            </li>
          </ul>{' '}
        </div>
      </>
    );
  };

  const renderAdBox = () => {
    return (
      <>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-2">
          <div
            onClick={() => setBoxToggle('adSales')}
            role="presentation"
            className={setAdBoxClass('adSales', 'ad-sales-active')}>
            <div className="chart-name">Ad Sales </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3 pt-1">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            onClick={() => setBoxToggle('adSpend')}
            role="presentation"
            className={setAdBoxClass('adSpend', 'ad-spend-active')}>
            <div className="chart-name">Ad Spend </div>
            <div className="number-rate">$15,050.28</div>
            <div className="vs">vs $11,114.90</div>
            <div className="perentage-value down mt-3 ">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            onClick={() => setBoxToggle('adConversion')}
            role="presentation"
            className={setAdBoxClass('adConversion', 'ad-conversion-active')}>
            <div className="chart-name">Ad Conversion Rate</div>
            <div className="number-rate">15.28%</div>
            <div className="vs">vs 14.90%</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-2">
          <div
            onClick={() => setBoxToggle('impressions')}
            role="presentation"
            className={setAdBoxClass('impressions', 'impression-active')}>
            <div className="chart-name">Impressions </div>
            <div className="number-rate">1528K</div>
            <div className="vs">vs 110K</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adCos')}
            role="presentation"
            className={setAdBoxClass('adCos', 'ad-cos-active')}>
            <div className="chart-name">Acos</div>
            <div className="number-rate">$1,550.55</div>
            <div className="vs">vs $1,114.88</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adRoas')}
            role="presentation"
            className={setAdBoxClass('adRoas', 'ad-roas-active')}>
            <div className="chart-name">RoAS </div>
            <div className="number-rate">50.28</div>
            <div className="vs">vs 4.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adClicks')}
            role="presentation"
            className={setAdBoxClass('adClicks', 'ad-click-active')}>
            <div className="chart-name">Clicks </div>
            <div className="number-rate">15,050</div>
            <div className="vs">vs 1,114</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
          <div
            onClick={() => setBoxToggle('adClickRate')}
            role="presentation"
            className={setAdBoxClass('adClickRate', 'ad-clickrate-active')}>
            <div className="chart-name">Click through rate </div>
            <div className="number-rate">0.28%</div>
            <div className="vs">vs 4.90</div>
            <div className="perentage-value down mt-3">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
              40.75%
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAdGroupBy = () => {
    return (
      <>
        {_.size(selectedAdBox) === 1 ? (
          <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
            <ul className="rechart-item">
              <li>
                <div className="weeks">
                  <span className="orange block" />
                  <span>Recent</span>
                </div>
              </li>
              {selectedAdDF !== 'custom' ? (
                <li>
                  <div className="weeks">
                    <span className="gray block" />
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
          <p className="black-heading-title mt-3 mb-2"> DSP Spend</p>
        </div>
        <div className="col-6 text-right">
          {' '}
          {DropDown(
            'days-performance',
            dateOptions,
            null,
            getSelectComponents(),
            dateOptions[0],
            handleDSPDailyFact,
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
            ? bindValues(dspTotal.currentDspTodal)
            : '0.00'}
        </div>
        <div className="vs">
          vs {currencySymbol}
          {dspTotal && dspTotal.previousDspTodal
            ? bindValues(dspTotal.previousDspTodal)
            : '0.00'}{' '}
          <span
            className={
              dspTotal && dspTotal.difference > 0
                ? 'perentage-value mt-3 ml-1'
                : 'perentage-value down mt-3 ml-1'
            }>
            {!Number.isNaN(dspTotal && dspTotal.difference) &&
            dspTotal &&
            dspTotal.difference > 0 ? (
              <img className="green-arrow" src={ArrowUpIcon} alt="arrow-up" />
            ) : !Number.isNaN(dspTotal && dspTotal.difference) &&
              dspTotal &&
              dspTotal.difference < 0 ? (
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
            ) : (
              ''
            )}
            {dspTotal &&
            dspTotal.difference &&
            dspTotal &&
            dspTotal.difference !== 'N/A'
              ? `${dspTotal.difference.toString().replace('-', '')}%`
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
          chartData={null}
          currencySymbol={currencySymbol}
          selectedBox={selectedAdBox}
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
      margin-right: 10px;

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
  @media only screen and (max-width: 1105px) {
    .ad-performance-nav {
      li {
        
        &.ad-performance {
          max-width: 195px;
          width: 100%;
        }
        &.day-performance {
          max-width: 230px;
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
