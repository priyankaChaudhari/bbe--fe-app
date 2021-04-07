/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useCallback } from 'react';
// import { useMediaQuery } from 'react-responsive';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Modal from 'react-modal';
import Select, { components } from 'react-select';
import { parseInt } from 'lodash';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import { getPerformance, getBuyBoxChartData } from '../../api';

import {
  ArrowUpIcon,
  ArrowDownIcon,
  CaretUp,
  CloseIcon,
} from '../../theme/images/index';
import { DropDownSelect, ModalBox, Button } from '../../common';
import { WhiteCard } from '../../theme/Global';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const _ = require('lodash');
const getSymbolFromCurrency = require('currency-symbol-map');

export default function CompanyPerformance({ marketplaceChoices, id }) {
  const { Option, SingleValue } = components;
  const [lineChartData, setLineChartData] = useState([{}]);
  const [bBChartData, setBBChartData] = useState([{}]);
  const [dspData, setDspData] = useState(null);
  const [dspSpend, setDspSpend] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [pieData, setPieData] = useState([
    { name: 'Inventory', value: 'N/A' },
    { name: 'Total', value: 1000 },
  ]);

  const COLORS = ['#97ca61', '#EAEFF2'];
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // sales performance varibales and BB %
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  const [state, setState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'selection',
    },
  ]);

  const [BBstate, setBBState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'BBselection',
    },
  ]);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [showBBCustomDateModal, setShowBBCustomDateModal] = useState(false);
  const [groupBy, setGroupBy] = useState('daily');
  const [BBGroupBy, setBBGroupBy] = useState('daily');
  const [amazonOptions, setAmazonOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('week');
  const [bBDailyFact, setBBDailyFact] = useState('week');
  const [selectedAmazonValue, setSelectedAmazonValue] = useState(null);
  // end

  const [revenueData, setRevenueData] = useState([{}]);
  const [unitsSoldData, setUnitsSoldData] = useState([{}]);
  const [trafficData, setTrafficData] = useState([{}]);
  const [conversionData, setConversionData] = useState([{}]);
  const [allSalesTotal, setAllSalesTotal] = useState({});
  const [filters, setFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });

  const [activeSales, setActiveSales] = useState('revenue');
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

  const reportOptions = [
    { value: 'week', label: 'Recent Week', sub: 'vs Previous week' },
    { value: 'month', label: 'Recent Month', sub: 'vs Previous month' },
    { value: '30days', label: 'Recent 30 Days', sub: 'vs Previous 30 days' },
    { value: 'year', label: 'Year to Date', sub: 'vs Previous year' },
    {
      value: 'custom',
      label: 'Custom Range',
      sub: 'Select start and end dates',
    },
  ];

  const BBReportOptions = [
    { value: 'week', label: 'Recent Week', sub: 'vs Previous week' },
    { value: 'month', label: 'Recent Month', sub: 'vs Previous month' },
    { value: '30days', label: 'Recent 30 Days', sub: 'vs Previous 30 days' },
    { value: 'year', label: 'Year to Date', sub: 'vs Previous year' },
    {
      value: 'custom',
      label: 'Custom Range',
      sub: 'Select start and end dates',
    },
  ];

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

  const calculateSalesDifference = (currentTotal, previousTotal) => {
    const diff = ((currentTotal - previousTotal) * 100) / previousTotal;
    if (diff === -Infinity || diff === Infinity || Number.isNaN(diff)) {
      return 'N/A';
    }
    return parseFloat(diff.toFixed(2));
  };

  const getBBData = useCallback(
    (marketplace, BBdailyFact, bBGroupBy, startDate = null, endDate = null) => {
      // setIsLoading({ loader: true, type: 'button' });
      getBuyBoxChartData(
        id,
        marketplace,
        BBdailyFact,
        bBGroupBy,
        startDate,
        endDate,
      ).then((res) => {
        if (res && res.status === 400) {
          // setApiError(res && res.data);
          // setIsLoading({ loader: false, type: 'button' });
        }
        if (res && res.status === 200 && res.data && res.data.bbep) {
          const avg =
            res.data.bbep
              .filter((record) => record.bbep)
              .reduce((acc, record) => acc + record.bbep, 0) /
              res.data.bbep.length || 0;

          const tempBBData = res.data.bbep.map((data) => {
            return {
              date: dayjs(data.report_date).format('MMM D'),
              value: data.bbep,
              avg: avg.toFixed(2),
            };
          });
          setBBChartData(tempBBData);
        }
      });
    },
    [id],
  );

  const getData = useCallback(
    (
      selectedDailyFact,
      selectedGroupBy,
      marketplace,
      startDate = null,
      endDate = null,
    ) => {
      // setIsLoading({ loader: true, type: 'button' });
      getPerformance(
        id,
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        startDate,
        endDate,
      ).then((res) => {
        if (res && res.status === 400) {
          // setApiError(res && res.data);
          // setIsLoading({ loader: false, type: 'button' });
        }
        if (res && res.status === 200 && res.data && res.data.daily_facts) {
          const tempRevenueData = [];
          const tempUnitsSoldData = [];
          const tempTrafficData = [];
          const tempConversionData = [];
          const revenueTotal = {
            previousRevenueTotal: 0,
            currentRevenueTotal: 0,
            difference: 0,
          };
          const trafficTotal = {
            previousTrafficTotal: 0,
            currentTrafficTotal: 0,
            difference: 0,
          };
          const unitsTotal = {
            previousUnitsTotal: 0,
            currentUnitsTotal: 0,
            difference: 0,
          };
          const conversionTotal = {
            previousConversionTotal: 0,
            currentConversionTotal: 0,
            difference: 0,
          };
          // setIsLoading({ loader: false, type: 'button' });
          if (
            res.data.daily_facts.previous &&
            res.data.daily_facts.previous.length
          ) {
            res.data.daily_facts.previous.forEach((resData) => {
              // revenueTotal.previousRevenueTotal += resData.revenue;
              // unitsTotal.previousUnitsTotal += resData.units_sold;
              // trafficTotal.previousTrafficTotal += resData.traffic;
              // conversionTotal.previousConversionTotal += resData.conversion;
              // const dayDate = dayjs(resData.report_date).format('MMM D YYYY');
              tempRevenueData.push({ 'vs $': resData.revenue });
              tempTrafficData.push({ 'vs $': resData.traffic });
              tempUnitsSoldData.push({ 'vs $': resData.units_sold });
              tempConversionData.push({ 'vs $': resData.conversion });
            });
            // conversionTotal.previousConversionTotal /=
            //   res.data.daily_facts.previous.length;
          }
          if (
            res.data.daily_facts.current &&
            res.data.daily_facts.current.length
          ) {
            res.data.daily_facts.current.forEach((resData, index) => {
              // const key = ' $';
              const dayDate = dayjs(resData.report_date).format('MMM D YYYY');
              revenueTotal.currentRevenueTotal += resData.revenue;
              unitsTotal.currentUnitsTotal += resData.units_sold;
              trafficTotal.currentTrafficTotal += resData.traffic;
              conversionTotal.currentConversionTotal += resData.conversion;
              if (
                res.data.daily_facts.previous &&
                index < res.data.daily_facts.previous.length
              ) {
                tempUnitsSoldData[index].name = dayDate;
                tempRevenueData[index].name = dayDate;
                tempTrafficData[index].name = dayDate;
                tempConversionData[index].name = dayDate;
                tempRevenueData[index][' $'] = resData.revenue;
                tempUnitsSoldData[index][' $'] = resData.units_sold;
                tempTrafficData[index][' $'] = resData.traffic;
                tempConversionData[index][' $'] = resData.conversion;
                conversionTotal.previousConversionTotal +=
                  res.data.daily_facts.previous[index].conversion;
                revenueTotal.previousRevenueTotal +=
                  res.data.daily_facts.previous[index].revenue;
                unitsTotal.previousUnitsTotal +=
                  res.data.daily_facts.previous[index].units_sold;
                trafficTotal.previousTrafficTotal +=
                  res.data.daily_facts.previous[index].traffic;
              } else {
                tempRevenueData.push({
                  name: dayDate,
                  ' $': resData.revenue,
                });
                tempTrafficData.push({
                  name: dayDate,
                  ' $': resData.traffic,
                });
                tempUnitsSoldData.push({
                  name: dayDate,
                  ' $': resData.units_sold,
                });
                tempConversionData.push({
                  name: dayDate,
                  ' $': resData.conversion,
                });
              }
            });
            conversionTotal.currentConversionTotal /=
              res.data.daily_facts.current.length;
            conversionTotal.previousConversionTotal /=
              res.data.daily_facts.current.length;
          }
          revenueTotal.difference = calculateSalesDifference(
            revenueTotal.currentRevenueTotal,
            revenueTotal.previousRevenueTotal,
          );
          unitsTotal.difference = calculateSalesDifference(
            unitsTotal.currentUnitsTotal,
            unitsTotal.previousUnitsTotal,
          );
          trafficTotal.difference = calculateSalesDifference(
            trafficTotal.currentTrafficTotal,
            trafficTotal.previousTrafficTotal,
          );
          conversionTotal.difference = calculateSalesDifference(
            conversionTotal.currentConversionTotal,
            conversionTotal.previousConversionTotal,
          );
          setAllSalesTotal({
            revenue: revenueTotal,
            units: unitsTotal,
            traffic: trafficTotal,
            conversion: conversionTotal,
          });
          setLineChartData(tempRevenueData);
          setRevenueData(tempRevenueData);
          setUnitsSoldData(tempUnitsSoldData);
          setTrafficData(tempTrafficData);
          setConversionData(tempConversionData);
          if (res.data.pf_oi_is && res.data.pf_oi_is.length) {
            const lastUpdated = res.data.pf_oi_is[0].latest_date;
            res.data.pf_oi_is[0].latest_date = dayjs(lastUpdated).format(
              'MMM DD YYYY',
            );
            if (res.data.dsp_spend && res.data.dsp_spend.length) {
              setDspSpend({
                value: res.data.dsp_spend[0].monthly_spend.toFixed(2),
                date: dayjs(res.data.dsp_spend[0].report_date).format(
                  'MMM DD YYYY',
                ),
              });
            }
            setDspData(res.data.pf_oi_is[0]);
            const ipiValue = parseFloat(
              res.data.pf_oi_is[0].inventory_performance_index,
            );
            if (Number.isNaN(ipiValue)) {
              setPieData([
                {
                  name: 'Inventory',
                  value: 'N/A',
                },
                {
                  name: 'Total',
                  value: 1000,
                },
              ]);
            } else {
              setPieData([
                {
                  name: 'Inventory',
                  value: ipiValue,
                },
                {
                  name: 'Total',
                  value: 1000 - ipiValue,
                },
              ]);
            }
          } else {
            setPieData([
              { name: 'Inventory', value: 'N/A' },
              { name: 'Total', value: 1000 },
            ]);
          }
        }
      });
    },
    [id],
  );
  const setChartData = (value) => {
    if (value === 'traffic') {
      setLineChartData(trafficData);
      setActiveSales('traffic');
    }
    if (value === 'units sold') {
      setLineChartData(unitsSoldData);
      setActiveSales('units sold');
    }
    if (value === 'conversion') {
      setLineChartData(conversionData);
      setActiveSales('conversion');
    }
    if (value === 'revenue') {
      setLineChartData(revenueData);
      setActiveSales('revenue');
    }
  };

  const CustomizedLabel = (data) => {
    const dataLength = bBChartData.length - 1;

    if (data && data.index === dataLength && bBChartData) {
      return (
        <>
          <circle cx={data.x} cy={data.y} r={20} w={40} h={40} fill="#BFC5D2" />
          <text
            className="cust-label-avg"
            x={data.x} // {dataLength === 0 ? data.x : data.x * dataLength}
            y={data.y}
            dy={5}
            fontSize={14}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black">
            {bBChartData[0].avg}%
          </text>
        </>
      );
    }
    return null;
  };

  const xDataFormater = (date) => {
    if (date) {
      if (selectedValue === 'month' && groupBy === 'weekly') {
        const weekNumber = Math.ceil(dayjs(date).date() / 7);
        switch (weekNumber) {
          case 1:
            return 'Wk1';
          case 2:
            return 'Wk2';
          case 3:
            return 'Wk3';
          case 4:
            return 'Wk4';
          default:
            return 'Wk';
        }
      }
      if (selectedValue === 'month' && groupBy === 'daily') {
        return dayjs(date).format('MMM D');
      }
      // if (selectedValue === '30days' && groupBy === 'daily') {
      //   return dayjs(date).date();
      // }
      if (groupBy === 'monthy') {
        return monthNames[dayjs(date).month()];
      }
      return dayjs(date).format('MMM D');
    }
    return date;
  };

  const DataFormater = (number) => {
    let returnValue = number;
    if (number >= 1000000000) {
      returnValue = `${parseInt(number / 1000000000).toString()}B`;
    }
    if (number >= 1000000) {
      returnValue = `${parseInt(number / 1000000).toString()}M`;
    }
    if (number >= 1000) {
      returnValue = `${parseInt(number / 1000).toString()}K`;
    } else {
      returnValue = `${parseInt(number).toString()}`;
    }

    if (activeSales === 'revenue') {
      returnValue = `${currencySymbol}${returnValue}`;
    }
    return returnValue;
  };

  const getDays = (startDate, endDate) => {
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const checkDifferenceBetweenDates = (startDate, endDate, flag = null) => {
    let temp = '';
    let sd = startDate;
    let ed = endDate;
    const diffDays = getDays(startDate, endDate);
    if (diffDays <= 30) {
      temp = 'daily';
      setFilters({ daily: true, weekly: false, month: false });
      setGroupBy('daily');
    } else if (diffDays > 30 && diffDays <= 180) {
      temp = 'weekly';
      setFilters({ daily: false, weekly: true, month: false });
      setGroupBy('weekly');
    } else if (diffDays > 180) {
      temp = 'monthly';
      setFilters({ daily: false, weekly: false, month: true });
      setGroupBy('monthly');
    }

    if (flag === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;
      getData(flag, temp, selectedAmazonValue, sd, ed);
    } else {
      // flag==='year
      getData(flag, temp, selectedAmazonValue);
    }
  };

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropdownIndicator,
    };
  };

  const setGropuByFilter = (value) => {
    switch (value) {
      case 'week':
        setFilters({ daily: true, weekly: false, month: false });
        setGroupBy('daily');
        getData(value, 'daily', selectedAmazonValue);
        break;

      case 'month':
        setFilters({ daily: true, weekly: true, month: false });
        setGroupBy('daily');
        getData(value, 'daily', selectedAmazonValue);
        break;

      case '30days':
        setFilters({ daily: true, weekly: false, month: false });
        setGroupBy('daily');
        getData(value, 'daily', selectedAmazonValue);
        break;

      default:
        break;
    }
  };

  const BBYearAndCustomDateFilter = (startDate, endDate, value) => {
    let temp = '';

    let sd = startDate;
    let ed = endDate;
    const diffDays = getDays(startDate, endDate);

    if (diffDays <= 30) {
      temp = 'daily';
      setBBGroupBy('daily');
    } else if (diffDays > 30 && diffDays <= 180) {
      temp = 'weekly';
      setBBGroupBy('weekly');
    } else if (diffDays > 180) {
      temp = 'monthly';
      setBBGroupBy('monthly');
    }

    if (value === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;
      getBBData(selectedAmazonValue, value, temp, sd, ed);
    } else {
      getBBData(selectedAmazonValue, value, temp);
    }
  };

  const handleDailyFact = (value) => {
    setSelectedValue(value);
    if (value !== 'custom') {
      setState([
        {
          startDate: currentDate,
          endDate: currentDate,
          key: 'selection',
        },
      ]);
    }
    if (value === 'year') {
      checkDifferenceBetweenDates(
        new Date(new Date().getFullYear(), 0, 1),
        new Date(),
        'year',
      );
    } else if (value === 'custom') {
      setShowCustomDateModal(true);
    } else {
      setGropuByFilter(value);
    }
  };

  const handleBBDailyFact = (value) => {
    setBBDailyFact(value);

    if (value !== 'custom') {
      setBBState([
        {
          startDate: currentDate,
          endDate: currentDate,
          key: 'BBselection',
        },
      ]);
    }
    if (value === 'year') {
      BBYearAndCustomDateFilter(
        new Date(new Date().getFullYear(), 0, 1),
        new Date(),
        'year',
      );
    } else if (value === 'custom') {
      setShowBBCustomDateModal(true);
    } else {
      getBBData(selectedAmazonValue, value, 'daily');
      setBBGroupBy('daily');
    }
  };

  const handleAmazonOptions = (event) => {
    setSelectedAmazonValue(event.value);
    setCurrency(event.currency);
    setCurrencySymbol(getSymbolFromCurrency(event.currency));
    if (selectedValue === 'custom') {
      checkDifferenceBetweenDates(
        state[0].startDate,
        state[0].endDate,
        'custom',
      );
    } else {
      getData(selectedValue, groupBy, event.value);
      getBBData(event.value, bBDailyFact, BBGroupBy);
    }
  };

  const handleGroupBy = (value) => {
    if (value !== groupBy) {
      setGroupBy(value);
      getData(selectedValue, value, selectedAmazonValue);
    }
  };

  const applyCustomeDate = (flag) => {
    if (flag === 'BBDate') {
      BBYearAndCustomDateFilter(
        BBstate[0].startDate,
        BBstate[0].endDate,
        'custom',
      );
      setShowBBCustomDateModal(false);
    } else {
      checkDifferenceBetweenDates(
        state[0].startDate,
        state[0].endDate,
        'custom',
      );
      setShowCustomDateModal(false);
    }
  };

  const renderLegendText = (value, entry) => {
    const { color } = entry;
    if (value === ' $') {
      return <span style={{ color }}>Recent</span>;
    }
    if (value === 'vs $') {
      return <span style={{ color }}>Previous</span>;
    }
    return null;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      if (payload.length === 2) {
        const current = payload[0].value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const previous = payload[1].value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (
          <div className="custom-tooltip">
            <p className="main-label">
              {activeSales === 'revenue'
                ? `${activeSales} (${currency})`
                : activeSales}
            </p>
            <p className="label-1">
              {activeSales === 'revenue'
                ? `${currencySymbol}${current}`
                : current}
            </p>
            <p className="label-2">
              {activeSales === 'revenue'
                ? `vs ${currencySymbol}${previous}`
                : previous}
            </p>
          </div>
        );
      }
      if (payload.length === 1 && payload[0].dataKey === ' $') {
        const current = payload[0].value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (
          <div className="custom-tooltip">
            <p className="main-label">
              {activeSales === 'revenue'
                ? `${activeSales} (${currency})`
                : activeSales}
            </p>
            <p className="label-1">
              {activeSales === 'revenue'
                ? `${currencySymbol}${current}`
                : current}
            </p>
            <p className="label-2">
              {activeSales === 'revenue'
                ? `vs ${currencySymbol}0.00`
                : 'vs 0.00'}
            </p>
          </div>
        );
      }
      if (payload.length === 1 && payload[0].dataKey === 'vs $') {
        const previous = payload[0].value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (
          <div className="custom-tooltip">
            <p className="main-label">
              {activeSales === 'revenue'
                ? `${activeSales} (${currency})`
                : activeSales}
            </p>
            <p className="label-1">
              {activeSales === 'revenue' ? `${currencySymbol}0.00` : '0.00'}
            </p>
            <p className="label-2">
              {activeSales === 'revenue'
                ? `vs ${currencySymbol}${previous}`
                : previous}
            </p>
          </div>
        );
      }
    }
    return null;
  };

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
    setAmazonOptions(list);

    if (responseId === null && list.length && list[0].value !== null) {
      setSelectedAmazonValue(list[0].value);
      setCurrency(list[0].currency);
      setCurrencySymbol(getSymbolFromCurrency(list[0].currency));
      getData(selectedValue, groupBy, list[0].value);
      getBBData(list[0].value, bBDailyFact, 'daily');
      setResponseId('12345');
    }
  }, [
    marketplaceChoices,
    getData,
    getBBData,
    responseId,
    groupBy,
    selectedValue,
    selectedAmazonValue,
    bBDailyFact,
  ]);

  // const calculateDataMin = (dataMin) => {
  //   if (dataMin !== Infinity) {
  //     return dataMin - (dataMin * 10) / 100;
  //   }
  //   return 0;
  // };

  const bindValues = (value) => {
    const decimal = _.split(value, '.', 2);
    if (decimal[1] !== undefined) {
      return (
        <span style={{ fontSize: '26px' }}>
          {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          <span style={{ fontSize: '16px' }}>.{decimal[1].slice(0, 2)}</span>
        </span>
      );
    }
    return (
      <span style={{ fontSize: '26px' }}>
        {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        <span style={{ fontSize: '16px' }}>.00</span>
      </span>
    );
  };

  const renderSPCustomDateModal = () => {
    return (
      <Modal
        isOpen={showCustomDateModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowCustomDateModal(false);
            setState([
              {
                startDate: currentDate,
                endDate: currentDate,
                key: 'selection',
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
                setState([item.selection]);
              }}
              showMonthAndYearPickers={false}
              ranges={state}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
              maxDate={currentDate}
              rangeColors={['#FF5933']}
              weekdayDisplayFormat="EEEEE"
              locale={enGB}
            />
            <div className="text-center mt-3">
              <Button
                onClick={() => applyCustomeDate('SPDate')}
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

  const renderBBCustomDateModal = () => {
    return (
      <Modal
        isOpen={showBBCustomDateModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowBBCustomDateModal(false);
            setBBState([
              {
                startDate: currentDate,
                endDate: currentDate,
                key: 'BBselection',
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
                setBBState([item.BBselection]);
              }}
              showMonthAndYearPickers={false}
              ranges={BBstate}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
              maxDate={currentDate}
              rangeColors={['#FF5933']}
              weekdayDisplayFormat="EEEEE"
              locale={enGB}
            />
            <div className="text-center mt-3">
              <Button
                onClick={() => applyCustomeDate('BBDate')}
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
    <>
      <div className="col-lg-8 col-12">
        <div className="row">
          <div className="col-12 mb-3">
            <DropDownSelect className="cursor">
              <Select
                classNamePrefix="react-select"
                className="active"
                options={amazonOptions}
                placeholder={
                  amazonOptions && amazonOptions[0] && amazonOptions[0].label
                }
                components={{ DropdownIndicator }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    neutral50: '#1A1A1A',
                  },
                })}
                defaultValue={amazonOptions && amazonOptions[0]}
                onChange={(event) => handleAmazonOptions(event)}
              />
            </DropDownSelect>{' '}
          </div>
        </div>
        <WhiteCard>
          <div className="row">
            <div className="col-md-6 col-sm1-12">
              {' '}
              <p className="black-heading-title mt-0 mb-4">
                {' '}
                Sales Performance
              </p>
            </div>
            <div className="col-md-6 col-sm1-12  mb-3">
              <DropDownSelect className="days-performance ">
                <Select
                  classNamePrefix="react-select"
                  className="active"
                  components={getSelectComponents()}
                  options={reportOptions}
                  defaultValue={reportOptions[0]}
                  onChange={(event) => handleDailyFact(event.value)}
                />
              </DropDownSelect>{' '}
              <div className="clear-fix" />
            </div>
            <div className="col-12 text-right mb-3" />
          </div>

          <div className="row mr-1 ml-1">
            <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
              <div
                className={
                  activeSales === 'revenue'
                    ? 'order-chart-box active fix-height '
                    : 'order-chart-box fix-height '
                }
                onClick={() => setChartData('revenue')}
                role="presentation">
                {' '}
                <div className="chart-name">Revenue ({currency})</div>
                <div className="number-rate">
                  {allSalesTotal && allSalesTotal.revenue
                    ? // allSalesTotal.revenue.currentRevenueTotal
                      // .toFixed(2)
                      // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      bindValues(allSalesTotal.revenue.currentRevenueTotal)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs{' '}
                  {allSalesTotal && allSalesTotal.revenue
                    ? allSalesTotal.revenue.previousRevenueTotal
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </div>
                <div
                  className={
                    allSalesTotal &&
                    allSalesTotal.revenue &&
                    allSalesTotal.revenue.difference > 0
                      ? 'perentage-value'
                      : 'perentage-value down'
                  }>
                  {allSalesTotal &&
                  allSalesTotal.revenue &&
                  !Number.isNaN(allSalesTotal.revenue.difference) &&
                  allSalesTotal.revenue.difference > 0 ? (
                    <img
                      className="green-arrow"
                      src={ArrowUpIcon}
                      alt="arrow-up"
                    />
                  ) : allSalesTotal &&
                    allSalesTotal.revenue &&
                    allSalesTotal.revenue.difference &&
                    !Number.isNaN(allSalesTotal.revenue.difference) &&
                    allSalesTotal.revenue.difference < 0 ? (
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-down"
                    />
                  ) : (
                    ''
                  )}
                  {allSalesTotal &&
                  allSalesTotal.revenue &&
                  allSalesTotal.revenue.difference &&
                  allSalesTotal.revenue.difference !== 'N/A'
                    ? `${allSalesTotal.revenue.difference
                        .toString()
                        .replace('-', '')}%`
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
              <div
                className={
                  activeSales === 'units sold'
                    ? 'order-chart-box active fix-height '
                    : 'order-chart-box fix-height '
                }
                onClick={() => setChartData('units sold')}
                role="presentation">
                <div className="chart-name">Units Sold</div>
                <div className="number-rate">
                  {allSalesTotal && allSalesTotal.units
                    ? // allSalesTotal.units.currentUnitsTotal
                      // .toFixed(2)
                      // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      bindValues(allSalesTotal.units.currentUnitsTotal)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs{' '}
                  {allSalesTotal && allSalesTotal.units
                    ? allSalesTotal.units.previousUnitsTotal
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </div>
                <div
                  className={
                    allSalesTotal &&
                    allSalesTotal.units &&
                    allSalesTotal.units.difference > 0
                      ? 'perentage-value'
                      : 'perentage-value down'
                  }>
                  {allSalesTotal &&
                  allSalesTotal.units &&
                  !Number.isNaN(allSalesTotal.units.difference) &&
                  allSalesTotal.units.difference > 0 ? (
                    <img
                      className="green-arrow"
                      src={ArrowUpIcon}
                      alt="arrow-up"
                    />
                  ) : allSalesTotal &&
                    allSalesTotal.units &&
                    allSalesTotal.units.difference &&
                    !Number.isNaN(allSalesTotal.units.difference) &&
                    allSalesTotal.units.difference < 0 ? (
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                  ) : (
                    ''
                  )}
                  {allSalesTotal &&
                  allSalesTotal.units &&
                  allSalesTotal.units.difference &&
                  allSalesTotal.units.difference !== 'N/A'
                    ? `${allSalesTotal.units.difference
                        .toString()
                        .replace('-', '')}%`
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-3 pr-1 pl-1  col-6 mb-3
             ">
              <div
                className={
                  activeSales === 'traffic'
                    ? 'order-chart-box active fix-height '
                    : 'order-chart-box fix-height '
                }
                onClick={() => setChartData('traffic')}
                role="presentation">
                <div className="chart-name">Traffic</div>
                <div className="number-rate">
                  {allSalesTotal && allSalesTotal.traffic
                    ? // allSalesTotal.traffic.currentTrafficTotal
                      //  .toFixed(2)
                      //  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      bindValues(allSalesTotal.traffic.currentTrafficTotal)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs{' '}
                  {allSalesTotal && allSalesTotal.traffic
                    ? allSalesTotal.traffic.previousTrafficTotal
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </div>
                <div
                  className={
                    allSalesTotal &&
                    allSalesTotal.traffic &&
                    allSalesTotal.traffic.difference > 0
                      ? 'perentage-value'
                      : 'perentage-value down'
                  }>
                  {allSalesTotal &&
                  allSalesTotal.traffic &&
                  !Number.isNaN(allSalesTotal.traffic.difference) &&
                  allSalesTotal.traffic.difference > 0 ? (
                    <img
                      className="green-arrow"
                      src={ArrowUpIcon}
                      alt="arrow-up"
                    />
                  ) : allSalesTotal &&
                    allSalesTotal.traffic &&
                    allSalesTotal.traffic.difference &&
                    !Number.isNaN(allSalesTotal.traffic.difference) &&
                    allSalesTotal.traffic.difference < 0 ? (
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                  ) : (
                    ''
                  )}
                  {allSalesTotal &&
                  allSalesTotal.traffic &&
                  allSalesTotal.traffic.difference &&
                  allSalesTotal.traffic.difference !== 'N/A'
                    ? `${allSalesTotal.traffic.difference
                        .toString()
                        .replace('-', '')}%`
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 pl-1 pr-0 col-6 mb-3">
              <div
                className={
                  activeSales === 'conversion'
                    ? 'order-chart-box active fix-height '
                    : 'order-chart-box fix-height '
                }
                onClick={() => setChartData('conversion')}
                role="presentation">
                <div className="chart-name">Conversion</div>
                <div className="number-rate">
                  {allSalesTotal && allSalesTotal.conversion
                    ? `${allSalesTotal.conversion.currentConversionTotal.toFixed(
                        2,
                      )}%`
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs
                  {allSalesTotal && allSalesTotal.conversion
                    ? `${allSalesTotal.conversion.previousConversionTotal.toFixed(
                        2,
                      )}%`
                    : 0}
                </div>
                <div
                  className={
                    allSalesTotal &&
                    allSalesTotal.conversion &&
                    allSalesTotal.conversion.difference > 0
                      ? 'perentage-value'
                      : 'perentage-value down'
                  }>
                  {allSalesTotal &&
                  allSalesTotal.conversion &&
                  allSalesTotal.conversion.difference &&
                  !Number.isNaN(allSalesTotal.conversion.difference) &&
                  allSalesTotal.conversion.difference > 0 ? (
                    <img
                      className="green-arrow"
                      src={ArrowUpIcon}
                      alt="arrow-up"
                    />
                  ) : allSalesTotal &&
                    allSalesTotal.conversion &&
                    allSalesTotal.conversion.difference &&
                    !Number.isNaN(allSalesTotal.conversion.difference) &&
                    allSalesTotal.conversion.difference < 0 ? (
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                  ) : (
                    ''
                  )}
                  {allSalesTotal &&
                  allSalesTotal.conversion &&
                  allSalesTotal.conversion.difference &&
                  allSalesTotal.conversion.difference !== 'N/A'
                    ? `${allSalesTotal.conversion.difference
                        .toString()
                        .replace('-', '')}%`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
              <ul className="rechart-item">
                <li>
                  <div className="weeks">
                    <span className="orange block" />
                    <span>Recent</span>
                  </div>
                </li>
                <li>
                  <div className="weeks">
                    <span className="gray block" />
                    <span>Previous</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-md-6 col-sm-12 order-md-2 order-1">
              {' '}
              <div className="days-container ">
                <ul className="days-tab">
                  <li className={filters.daily === false ? 'disabled-tab' : ''}>
                    {' '}
                    <input
                      className="d-none"
                      type="radio"
                      id="daysCheck"
                      name="flexRadioDefault"
                      value={groupBy}
                      checked={filters.daily}
                      onClick={() => handleGroupBy('daily')}
                      onChange={() => {}}
                    />
                    <label htmlFor="daysCheck">Daily</label>
                  </li>

                  <li
                    className={filters.weekly === false ? 'disabled-tab' : ''}>
                    <input
                      className="d-none"
                      type="radio"
                      value={groupBy}
                      checked={filters.weekly && groupBy === 'weekly'}
                      id="weeklyCheck"
                      name="flexRadioDefault"
                      onChange={() => handleGroupBy('weekly')}
                    />
                    <label htmlFor="weeklyCheck">Weekly</label>
                  </li>

                  <li className={filters.month === false ? 'disabled-tab' : ''}>
                    <input
                      className=" d-none"
                      type="radio"
                      value={groupBy}
                      checked={filters.month}
                      id="monthlyCheck"
                      name="flexRadioDefault"
                      onChange={() => handleGroupBy('monthly')}
                    />
                    <label htmlFor="monthlyCheck">Monthly</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="clear-fix" />

          <ResponsiveContainer width="99%" height={400}>
            <LineChart
              data={lineChartData}
              margin={{
                top: 40,
                right: 30,
                left: 0,
                bottom: 20,
              }}>
              {/* <CartesianGrid strokeDasharray="none" /> */}
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                dy={20}
                tickFormatter={xDataFormater}
              />
              <YAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tickFormatter={DataFormater}
                dx={-10}
                allowDataOverflow
                // domain={[0, (dataMax) => (dataMax * 10) / 100 + dataMax]}
                // domain={[
                //   (dataMin) => calculateDataMin(dataMin),
                //   (dataMax) => (dataMax * 10) / 100 + dataMax,
                // ]}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                className="tolltip-revenue"
                formatter={renderLegendText}
              />
              <Line dataKey=" $" stroke="#FF5933" />
              <Line dataKey="vs $" stroke="#BFC5D2" />
            </LineChart>
          </ResponsiveContainer>
        </WhiteCard>

        <div className="row mt-3">
          <div className="col-md-4 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">DSP Spend</p>
              <div className="speed-rate">
                {dspSpend && dspSpend.value
                  ? `${currencySymbol}${dspSpend.value
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                  : 'N/A'}
              </div>
              <div className="last-update">
                Last updated: {dspSpend && dspSpend.date}
              </div>
            </WhiteCard>{' '}
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">Positive Feedback</p>
              <div className="seller-health positive">
                {dspData && dspData.feedback_30
                  ? `${dspData && dspData.feedback_30}%`
                  : 'N/A'}
              </div>
              <div className="seller-update mb-3">Last 30 days</div>
              <div className="seller-health positive ">
                {dspData && dspData.feedback_365
                  ? `${dspData && dspData.feedback_365}%`
                  : 'N/A'}
              </div>
              <div className="seller-update mb-5">Last 12 months</div>
              <div className="last-update ">
                Last updated: {dspData && dspData.latest_date}
              </div>
            </WhiteCard>
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              {' '}
              <p className="black-heading-title mt-0 mb-4">Order Issues</p>
              <div className="seller-health">
                {dspData && dspData.order_defect_fba
                  ? `${dspData && dspData.order_defect_fba}%`
                  : 'N/A'}
              </div>
              <div className="seller-update mb-3">Order Defect Rate</div>
              <div className="seller-health  ">
                {dspData && dspData.policy_issues
                  ? dspData.policy_issues
                  : 'N/A'}
              </div>
              <div className="seller-update mb-5">Policy Violations</div>
              <div className="last-update ">
                Last updated: {dspData && dspData.latest_date}
              </div>
            </WhiteCard>
          </div>
        </div>
        <div className="row ">
          <div className="col-md-4 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">
                Inventory Score (IPI)
              </p>
              {/* <PiechartResponsive> */}
              <ResponsiveContainer width="99%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx={90}
                    cy={100}
                    startAngle={180}
                    marginBottom={40}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884D8"
                    paddingAngle={6}
                    dataKey="value">
                    <Cell key="cell-0" fill={COLORS[0]} />
                    <Cell key="cell-1" fill={COLORS[1]} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* </PiechartResponsive> */}

              <div className="average">
                {pieData && pieData.length && !Number.isNaN(pieData[0].value)
                  ? pieData[0].value
                  : 'N/A'}
                <div className="out-off">Out of 1000</div>
              </div>
              <br />
              <div className="last-update mt-3 ">
                Last updated: {dspData && dspData.latest_date}
              </div>
            </WhiteCard>
          </div>

          <div className="col-md-8 col-sm-12 mb-3 ">
            <WhiteCard className="fix-height">
              <div className="row">
                <div className="col-6 ">
                  {' '}
                  <p className="black-heading-title mt-0 mb-4"> Buy Box %</p>
                </div>
                <div className="col-6 text-right mb-1">
                  <DropDownSelect className="days-performance ">
                    <Select
                      classNamePrefix="react-select"
                      className="active"
                      // components={getSelectComponents()}
                      options={BBReportOptions}
                      defaultValue={BBReportOptions[0]}
                      onChange={(event) => handleBBDailyFact(event.value)}
                    />
                  </DropDownSelect>{' '}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-sm-12 order-md-1 order-2">
                  <ul className="rechart-item">
                    <li>
                      <div className="weeks">
                        <span className="black block" />
                        <span>Daily %</span>
                      </div>
                    </li>
                    <li>
                      <div className="weeks">
                        <span className="gray block" />
                        <span>Average</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <ResponsiveContainer width="99%" height={200}>
                <LineChart
                  // width={300}
                  // height={200}
                  data={bBChartData}
                  margin={{
                    top: 30,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Legend />
                  <Line
                    dataKey="avg"
                    dot={false}
                    stroke="#BFC5D2"
                    activeDot={false}>
                    <LabelList content={<CustomizedLabel />} />
                  </Line>
                  <Line
                    dataKey="value"
                    dot={false}
                    stroke="BLACK"
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <br />
              <br />
              <div className="last-update ">
                Last updated: {dspData && dspData.latest_date}
              </div>
            </WhiteCard>
          </div>
        </div>
        {renderSPCustomDateModal()}
        {renderBBCustomDateModal()}
      </div>
    </>
  );
}

CompanyPerformance.propTypes = {
  id: PropTypes.string.isRequired,
  // agreement: PropTypes.shape({
  //   id: PropTypes.string,
  //   additional_marketplaces: PropTypes.arrayOf(PropTypes.object),
  //   primary_marketplace: PropTypes.shape({
  //     id: PropTypes.string,
  //   }),
  // }).isRequired,
};

// const PiechartResponsive = styled.div`
//   .recharts-wrapper {
//     .recharts-surface {
//       width: 250px;
//       @media only screen and (max-width: 1119px) {
//         width: 220px;
//       }
//       @media only screen and (max-width: 1044px) {
//         width: 210px;
//       }
//       @media only screen and (max-width: 991px) {
//         width: 310px;
//       }
//       @media only screen and (max-width: 920px) {
//         width: 280px;
//       }
//       @media only screen and (max-width: 846px) {
//         width: 240px;
//       }
//       @media only screen and (max-width: 767px) {
//         width: 622px;
//       }
//       @media only screen and (max-width: 640px) {
//         width: 546px;
//       }
//       @media only screen and (max-width: 590px) {
//         width: 512px;
//       }
//       @media only screen and (max-width: 530px) {
//         width: 557px;
//       }
//       @media only screen and (max-width: 500px) {
//         width: 450px;
//       }
//       @media only screen and (max-width: 475px) {
//         width: 335px;
//       }
//       @media only screen and (max-width: 400px) {
//         width: 260px;
//       }
//     }
//   }
// `;
