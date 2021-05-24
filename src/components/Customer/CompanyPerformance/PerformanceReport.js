/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import Select, { components } from 'react-select';
import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Modal from 'react-modal';

import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import { DropDownSelect, ModalBox, Button, WhiteCard } from '../../../common';
import { getPerformance, getBuyBoxChartData } from '../../../api';

import {
  ArrowUpIcon,
  ArrowDownIcon,
  CaretUp,
  CloseIcon,
} from '../../../theme/images/index';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DropDown } from './DropDown';
import { dateOptions } from '../../../constants/CompanyPerformanceConstants';

const _ = require('lodash');
const getSymbolFromCurrency = require('currency-symbol-map');

am4core.useTheme(am4themes_dataviz);
export default function PerformanceReport({ marketplaceChoices, id }) {
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
  const [isApiSuccess, setIsApiSuccess] = useState(false);
  const COLORS = ['#97ca61', '#EAEFF2'];
  // sales performance varibales and BB % start
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
  // sales performance varibales and BB % end

  //
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

  useLayoutEffect(() => {
    const chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.paddingRight = 20;
    chart.logo.disabled = true; // disable amchart logo
    chart.data = lineChartData; // bind th data

    // render X axis
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    // dateAxis.renderer.grid.template.disabled = true;
    dateAxis.dy = 10;
    dateAxis.cursorTooltipEnabled = false;

    // render y axis
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.bigNumberPrefixes = [
      { number: 1e3, suffix: 'K' },
      { number: 1e6, suffix: 'M' },
      { number: 1e9, suffix: 'B' },
    ];
    valueAxis.numberFormatter.smallNumberPrefixes = [];
    valueAxis.min = 0;

    // add currency only for revenue

    if (activeSales === 'revenue') {
      valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
    } else {
      valueAxis.numberFormatter.numberFormat = '#.#a';
    }

    // create a tooltip
    const flag = selectedValue !== 'custom';
    let tooltipHeader = '';
    let tooltipCurrent = '';
    let tooltipPrevious = '';

    if (activeSales === 'revenue') {
      tooltipHeader = `[bold]${activeSales.toUpperCase()} (${currency})\n`;
      tooltipCurrent = `${currencySymbol}{label1}[/]`;
      tooltipPrevious = flag
        ? `\n[#BFC5D2] vs ${currencySymbol}{label2}[/]`
        : '';
    } else if (activeSales === 'conversion') {
      tooltipHeader = `[bold]${activeSales.toUpperCase()}\n`;
      tooltipCurrent = `{label1}%[/]`;
      tooltipPrevious = flag ? `\n[#BFC5D2]vs {label2}%[/]` : '';
    } else {
      tooltipHeader = `[bold]${activeSales.toUpperCase()}\n`;
      tooltipCurrent = `{label1}[/]`;
      tooltipPrevious = flag ? `\n[#BFC5D2]vs {label2}[/]` : '';
    }

    // Create series for previous data
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value2';
    series.dataFields.dateX = 'name';
    series.strokeWidth = 2;
    series.stroke = am4core.color('#BFC5D2');
    series.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    series.fill = am4core.color('#2e384d');
    series.propertyFields.strokeDasharray = 'dashLength';

    // add bullet for
    const circleBullet2 = series.bullets.push(new am4charts.CircleBullet());
    circleBullet2.circle.fill = am4core.color('#fff');
    circleBullet2.circle.strokeWidth = 1;
    circleBullet2.circle.radius = 3;

    // series for current data
    const series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = 'value1';
    series2.dataFields.dateX = 'name';
    series2.strokeWidth = 2;
    series2.minBulletDistance = 10;
    series2.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`;
    series2.stroke = am4core.color('#FF5933');
    series2.fill = am4core.color('#2e384d');

    const circleBullet = series2.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.fill = am4core.color('#fff');
    circleBullet.circle.strokeWidth = 1;
    circleBullet.circle.radius = 3;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    chart.cursor.lineX.disabled = true;
    chart.cursor.snapToSeries = [series, series2];
    chart.cursor.behavior = 'none'; // disable zoom-in func.

    return () => {
      chart.dispose();
    };
  }, [lineChartData, activeSales, currency, currencySymbol, selectedValue]);

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

  if (isApiSuccess) {
    if (activeSales === 'traffic') {
      setLineChartData(trafficData);
    } else if (activeSales === 'units sold') {
      setLineChartData(unitsSoldData);
    } else if (activeSales === 'conversion') {
      setLineChartData(conversionData);
    } else if (activeSales === 'revenue') {
      setLineChartData(revenueData);
    }
    setIsApiSuccess(false);
  }

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
          const total = tempBBData && tempBBData.length ? tempBBData.length : 0;
          for (let i = 0; i <= Math.floor((total * 10) / 100); i += 1) {
            tempBBData.push({ avg: avg.toFixed(2) });
          }
          // if (tempBBData && tempBBData.length < 64) {
          //   tempBBData.push({ avg: avg.toFixed(2) }, { avg: avg.toFixed(2) });
          // } else {
          //   tempBBData.push(
          //     { avg: avg.toFixed(2) },
          //     { avg: avg.toFixed(2) },
          //     { avg: avg.toFixed(2) },
          //     { avg: avg.toFixed(2) },
          //     { avg: avg.toFixed(2) },
          //   );
          // }
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
              tempRevenueData.push({
                value2: resData.revenue,
                label2: resData.revenue !== null ? resData.revenue : '0.00',
              });
              tempTrafficData.push({
                value2: resData.traffic,
                label2: resData.traffic !== null ? resData.traffic : '0.00',
              });
              tempUnitsSoldData.push({
                value2: resData.units_sold,
                label2:
                  resData.units_sold !== null ? resData.units_sold : '0.00',
              });
              tempConversionData.push({
                value2: resData.conversion,
                label2:
                  resData.conversion !== null ? resData.conversion : '0.00',
              });
            });
            // conversionTotal.previousConversionTotal /=
            //   res.data.daily_facts.previous.length;
          }
          if (
            res.data.daily_facts.current &&
            res.data.daily_facts.current.length
          ) {
            let actualCount = 1;
            res.data.daily_facts.current.forEach((resData, index) => {
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
                tempRevenueData[index].value1 = resData.revenue;
                tempUnitsSoldData[index].value1 = resData.units_sold;
                tempTrafficData[index].value1 = resData.traffic;
                tempConversionData[index].value1 = resData.conversion;

                if (index > 0) {
                  tempRevenueData[index - 1].dashLength =
                    resData.revenue === null ? 8 : null;
                  tempUnitsSoldData[index - 1].dashLength =
                    resData.units_sold === null ? 8 : null;
                  tempTrafficData[index - 1].dashLength =
                    resData.traffic === null ? 8 : null;
                  tempConversionData[index - 1].dashLength =
                    resData.conversion === null ? 8 : null;
                }

                tempRevenueData[index].dashLength =
                  resData.revenue === null ? 8 : null;
                tempUnitsSoldData[index].dashLength =
                  resData.units_sold === null ? 8 : null;
                tempTrafficData[index].dashLength =
                  resData.traffic === null ? 8 : null;
                tempConversionData[index].dashLength =
                  resData.conversion === null ? 8 : null;

                tempRevenueData[index].label1 =
                  resData.revenue !== null ? resData.revenue : '0.00';
                tempUnitsSoldData[index].label1 =
                  resData.units_sold !== null ? resData.units_sold : '0.00';
                tempTrafficData[index].label1 =
                  resData.traffic !== null ? resData.traffic : '0.00';
                tempConversionData[index].label1 =
                  resData.conversion !== null ? resData.conversion : '0.00';

                if (resData.revenue !== null) {
                  actualCount = index + 1;
                  conversionTotal.previousConversionTotal +=
                    res.data.daily_facts.previous[index].conversion;
                  revenueTotal.previousRevenueTotal +=
                    res.data.daily_facts.previous[index].revenue;
                  unitsTotal.previousUnitsTotal +=
                    res.data.daily_facts.previous[index].units_sold;
                  trafficTotal.previousTrafficTotal +=
                    res.data.daily_facts.previous[index].traffic;
                }
              } else {
                tempRevenueData.push({
                  name: dayDate,
                  value1: resData.revenue,
                  label1: resData.revenue !== null ? resData.revenue : '0.00',
                  label2: '0.00',
                });
                tempTrafficData.push({
                  name: dayDate,
                  value1: resData.traffic,
                  label1: resData.traffic !== null ? resData.traffic : '0.00',
                  label2: '0.00',
                });
                tempUnitsSoldData.push({
                  name: dayDate,
                  value1: resData.units_sold,
                  label1:
                    resData.units_sold !== null ? resData.units_sold : '0.00',
                  label2: '0.00',
                });
                tempConversionData.push({
                  name: dayDate,
                  value1: resData.conversion,
                  label1:
                    resData.conversion !== null ? resData.conversion : '0.00',
                  label2: '0.00',
                });
              }
            });
            conversionTotal.currentConversionTotal /= actualCount;
            conversionTotal.previousConversionTotal /= actualCount;
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
          // setLineChartData(tempRevenueData);
          setRevenueData(tempRevenueData);
          setUnitsSoldData(tempUnitsSoldData);
          setTrafficData(tempTrafficData);
          setConversionData(tempConversionData);
          setIsApiSuccess(true);
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

  // when click on any one from revenue, nuit sold, traffic and conversion then set the graph data
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

  // set the greybox of BB% and value for that
  const CustomizedLabel = (data) => {
    const dataLength = bBChartData.length - 1;
    if (
      data &&
      data.index === dataLength &&
      bBChartData &&
      data.y !== null &&
      !Number.isNaN(data.y)
    ) {
      return (
        <g className="mb-3">
          {bBChartData && bBChartData[0].avg ? (
            <rect
              x={data.x - 25}
              y={data.y - 27}
              fill="#BFC5D2"
              width={50}
              height={28}
            />
          ) : null}

          <text
            className="cust-label-avg"
            x={data.x} // {dataLength === 0 ? data.x : data.x * dataLength}
            y={data.y}
            dy={-10}
            fontSize={14}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black">
            {bBChartData[0].avg}%
          </text>
        </g>
      );
    }
    return null;
  };

  const getDays = (startDate, endDate) => {
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // logic to set radio button(daily, weekly, monthly), so add filter and get data accordingly.
  // function call only when selected option is 'year to date' or custom
  const checkDifferenceBetweenDates = (
    startDate,
    endDate,
    flag = null,
    marketplace = selectedAmazonValue,
  ) => {
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
      getData(flag, temp, marketplace, sd, ed);
    } else {
      // flag==='year
      getData(flag, temp, marketplace);
    }
  };

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropdownIndicator,
    };
  };

  // set group by filter when selected option is, week, month or 30 days
  const setGropuByFilter = (value) => {
    switch (value) {
      case 'week':
        setFilters({ daily: true, weekly: false, month: false });
        setGroupBy('daily');
        getData(value, 'daily', selectedAmazonValue);
        break;

      case 'month':
        setFilters({ daily: true, weekly: false, month: false });
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

  const handleDailyFact = (event) => {
    const { value } = event;
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

  const handleBBDailyFact = (event) => {
    const { value } = event;
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
        event.value,
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

  const BBCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      if (payload.length === 2) {
        return (
          <div className="custom-tooltip">
            <p className="label-1">{payload[0].payload.date}</p>
            {/* <p className="label-2">{payload[0].payload.avg}%</p> */}
            <p className="label-2">{payload[1].payload.value}%</p>
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

  const bindValues = (value, name = null) => {
    const decimal = _.split(value, '.', 2);
    if (decimal[1] !== undefined) {
      return (
        <span style={{ fontSize: '26px' }}>
          {name === 'revenue' ? currencySymbol : null}
          {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          <span style={{ fontSize: '16px' }}>.{decimal[1].slice(0, 2)}</span>
        </span>
      );
    }
    return (
      <span style={{ fontSize: '26px' }}>
        {name === 'revenue' ? currencySymbol : null}
        {decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        <span style={{ fontSize: '16px' }}>.00</span>
      </span>
    );
  };

  const customTicks = () => {
    if (bBChartData && bBChartData.length) {
      const { avg } = bBChartData[0];
      if (avg === '0.00') {
        return [-1, parseFloat(avg), 1];
      }
      return [0, parseFloat(avg), parseFloat(avg) * 2];
    }
    return [];
  };

  const renderMarketplaceDropDown = () => {
    return (
      <div className="row">
        <div className="col-12 mb-3">
          {/* {DropDown(
            'cursor',
            amazonOptions,
            amazonOptions && amazonOptions[0] && amazonOptions[0].label,
            DropdownIndicator,
            amazonOptions && amazonOptions[0],
            handleAmazonOptions,
          )} */}

          <DropDownSelect className="cursor ">
            <Select
              classNamePrefix="react-select"
              className="active"
              components={DropdownIndicator}
              options={amazonOptions}
              defaultValue={amazonOptions && amazonOptions[0]}
              onChange={(event) => handleAmazonOptions(event)}
              placeholder={
                amazonOptions && amazonOptions[0] && amazonOptions[0].label
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

  const renderFilterDropDown = () => {
    return (
      <div className="col-md-6 col-sm1-12  mb-3">
        {DropDown(
          'days-performance',
          dateOptions,
          null,
          getSelectComponents,
          dateOptions[0],
          handleDailyFact,
        )}
        {/* <DropDownSelect className="days-performance ">
          <Select
            classNamePrefix="react-select"
            className="active"
            components={getSelectComponents()}
            options={dateOptions}
            defaultValue={dateOptions[0]}
            onChange={(event) => handleDailyFact(event.value)}
          />
        </DropDownSelect>{' '} */}
        <div className="clear-fix" />
      </div>
    );
  };

  const rednerSaleGroupBy = () => {
    return (
      <div className="row mt-4">
        <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
          <ul className="rechart-item">
            <li>
              <div className="weeks">
                <span className="orange block" />
                <span>Recent</span>
              </div>
            </li>
            {selectedValue !== 'custom' ? (
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

              <li className={filters.weekly === false ? 'disabled-tab' : ''}>
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
    );
  };

  const renderSalesBox = (name, className) => {
    let currentTotal = 0;
    let previousTotal = 0;
    let difference = 0;
    let theCurrency = null;
    if (name === 'revenue') {
      currentTotal =
        allSalesTotal && allSalesTotal.revenue
          ? allSalesTotal.revenue.currentRevenueTotal
          : 0;
      previousTotal =
        allSalesTotal && allSalesTotal.revenue
          ? allSalesTotal.revenue.previousRevenueTotal
          : 0;
      difference =
        allSalesTotal &&
        allSalesTotal.revenue &&
        allSalesTotal.revenue.difference
          ? allSalesTotal.revenue.difference
          : 0;
      theCurrency = currency !== null ? `(${currency})` : null;
    } else if (name === 'units sold') {
      currentTotal =
        allSalesTotal && allSalesTotal.units
          ? allSalesTotal.units.currentUnitsTotal
          : 0;
      previousTotal =
        allSalesTotal && allSalesTotal.units
          ? allSalesTotal.units.previousUnitsTotal
          : 0;
      difference =
        allSalesTotal && allSalesTotal.units && allSalesTotal.units.difference
          ? allSalesTotal.units.difference
          : 0;
      theCurrency = ``;
    } else if (name === 'traffic') {
      currentTotal =
        allSalesTotal && allSalesTotal.traffic
          ? allSalesTotal.traffic.currentTrafficTotal
          : 0;
      previousTotal =
        allSalesTotal && allSalesTotal.traffic
          ? allSalesTotal.traffic.previousTrafficTotal
          : 0;
      difference =
        allSalesTotal &&
        allSalesTotal.traffic &&
        allSalesTotal.traffic.difference
          ? allSalesTotal.traffic.difference
          : 0;
      theCurrency = ``;
    } else if (name === 'conversion') {
      currentTotal =
        allSalesTotal && allSalesTotal.conversion
          ? allSalesTotal.conversion.currentConversionTotal
          : 0;
      previousTotal =
        allSalesTotal && allSalesTotal.conversion
          ? allSalesTotal.conversion.previousConversionTotal
          : 0;
      difference =
        allSalesTotal &&
        allSalesTotal.conversion &&
        allSalesTotal.conversion.difference
          ? allSalesTotal.conversion.difference
          : 0;
      theCurrency = ``;
    }
    return (
      <div className={className}>
        <div
          className={
            activeSales === name
              ? 'order-chart-box active fix-height '
              : 'order-chart-box fix-height '
          }
          onClick={() => setChartData(name)}
          role="presentation">
          {' '}
          <div className="chart-name">
            {name.toUpperCase()} {theCurrency}
          </div>
          <div className="number-rate">
            {name === 'conversion'
              ? `${currentTotal.toFixed(2)}%`
              : bindValues(currentTotal, name)}
          </div>
          <div className="vs">
            {' '}
            vs{' '}
            {name === 'conversion'
              ? `${previousTotal.toFixed(2)}%`
              : name === 'revenue'
              ? `${
                  currencySymbol !== null ? currencySymbol : ''
                }${previousTotal
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
              : previousTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
          <div
            className={
              difference > 0
                ? 'perentage-value mt-3 pt-1'
                : 'perentage-value down mt-3 pt-1'
            }>
            {!Number.isNaN(difference) && difference > 0 ? (
              <img className="green-arrow" src={ArrowUpIcon} alt="arrow-up" />
            ) : !Number.isNaN(difference) && difference < 0 ? (
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-down" />
            ) : (
              ''
            )}
            {difference !== 'N/A'
              ? `${difference.toString().replace('-', '')}%`
              : 'N/A'}
          </div>
        </div>
      </div>
    );
  };
  const renderSalePerformancePanel = () => {
    return (
      <WhiteCard>
        <div className="row">
          <div className="col-md-6 col-sm1-12">
            {' '}
            <p className="black-heading-title mt-2 mb-4"> Sales Performance</p>
          </div>
          {renderFilterDropDown()}
          {/* <div className="col-12 text-right mb-3" /> */}
        </div>

        <div className="row mr-1 ml-1">
          {renderSalesBox('revenue', 'col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3')}
          {renderSalesBox(
            'units sold',
            'col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3',
          )}
          {renderSalesBox('traffic', 'col-lg-3 col-md-3 pr-1 pl-1  col-6 mb-3')}
          {renderSalesBox(
            'conversion',
            'col-lg-3 col-md-3 pl-1 pr-0 col-6 mb-3',
          )}
        </div>
        {rednerSaleGroupBy()}
        <div className="clear-fix" />
        {/* render sale graph */}
        <div id="chartdiv" style={{ width: '100%', height: '500px' }} />
      </WhiteCard>
    );
  };

  const renderDSPSpendPanel = () => {
    return (
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
    );
  };

  const renderPositiveFeedbackPanel = () => {
    return (
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
    );
  };

  const renderOrderIssuesPanel = () => {
    return (
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
            {dspData && dspData.policy_issues ? dspData.policy_issues : 'N/A'}
          </div>
          <div className="seller-update mb-5">Policy Violations</div>
          <div className="last-update ">
            Last updated: {dspData && dspData.latest_date}
          </div>
        </WhiteCard>
      </div>
    );
  };

  const renderInventoryScorePanel = () => {
    return (
      <div className="col-md-4 col-sm-12 mb-3">
        <WhiteCard className="fix-height">
          <p className="black-heading-title mt-0 mb-4">Inventory Score (IPI)</p>
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
    );
  };

  const renderBBgraph = () => {
    return (
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
          <YAxis tickCount={3} ticks={customTicks()} hide />
          <Tooltip content={<BBCustomTooltip />} />
          <Legend />
          <Line dataKey="avg" dot={false} stroke="#BFC5D2" activeDot={false}>
            <LabelList content={<CustomizedLabel />} />
          </Line>
          <Line
            dataKey="value"
            dot={false}
            stroke="BLACK"
            strokeWidth={2}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderBBPercentGraphPanel = () => {
    return (
      <div className="col-md-8 col-sm-12 mb-3 ">
        <WhiteCard className="fix-height">
          <div className="row">
            <div className="col-6 ">
              {' '}
              <p className="black-heading-title mt-2 mb-4"> Buy Box %</p>
            </div>
            <div className="col-6 text-right mb-1">
              {DropDown(
                'days-performance',
                dateOptions,
                null,
                // getSelectComponents,
                null,
                dateOptions[0],
                handleBBDailyFact,
              )}
              {/* <DropDownSelect className="days-performance ">
                <Select
                  classNamePrefix="react-select"
                  className="active"
                  components={getSelectComponents()}
                  options={dateOptions}
                  defaultValue={dateOptions[0]}
                  onChange={(event) => handleBBDailyFact(event.value)}
                />
              </DropDownSelect>{' '} */}
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
          {bBChartData && bBChartData.length > 1 ? renderBBgraph() : null}
          <br />
          <br />
          <div className="last-update ">
            Last updated: {dspData && dspData.latest_date}
          </div>
        </WhiteCard>
      </div>
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
      {renderMarketplaceDropDown()}
      {renderSalePerformancePanel()}
      <div className="row mt-3">
        {renderDSPSpendPanel()}
        {renderPositiveFeedbackPanel()}
        {renderOrderIssuesPanel()}
      </div>
      <div className="row ">
        {renderInventoryScorePanel()}
        {renderBBPercentGraphPanel()}
      </div>
      {renderSPCustomDateModal()}
      {renderBBCustomDateModal()}
    </>
  );
}

PerformanceReport.propTypes = {
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
