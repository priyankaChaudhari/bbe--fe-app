/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useCallback } from 'react';
// import { useMediaQuery } from 'react-responsive';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  LineChart,
  // ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  // PieChart,
  // Pie,
  // Cell,
} from 'recharts';
import Modal from 'react-modal';
import Select, { components } from 'react-select';
// import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { parseInt } from 'lodash';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import { getPerformance } from '../../api';

import {
  // CopyLinkIcon,
  // InfoIcons,
  // ExternalLink,

  ArrowUpIcon,
  ArrowDownIcon,
  CaretUp,
  CloseIcon,
} from '../../theme/images/index';
import { DropDownSelect, ModalBox, Button } from '../../common';
import { WhiteCard } from '../../theme/Global';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { fn } from 'jquery';

export default function CompanyPerformance({ agreement, id }) {
  // const isDesktop = useMediaQuery({ minWidth: 1601, maxWidth: 1920 });
  // const isDesktopMedium = useMediaQuery({ minWidth: 1201, maxWidth: 1600 });
  // const isDesktopView = useMediaQuery({ minWidth: 992, maxWidth: 1200 });
  // const isTablet = useMediaQuery({ minWidth: 858, maxWidth: 991 });
  // const isTableMedium = useMediaQuery({ minWidth: 730, maxWidth: 857 });
  // const isMobileView = useMediaQuery({ minWidth: 630, maxWidth: 731 });
  // const isMobileMedium = useMediaQuery({ minWidth: 500, maxWidth: 629 });
  // const isMobileSmall = useMediaQuery({ minWidth: 401, maxWidth: 499 });
  // const isMobileXtraSmall = useMediaQuery({ minWidth: 320, maxWidth: 400 });

  // const giveWidth = () => {
  //   if (isDesktop) {
  //     return 870;
  //   }
  //   if (isDesktopMedium) {
  //     return 750;
  //   }
  //   if (isDesktopView) {
  //     return 600;
  //   }
  //   if (isTablet) {
  //     return 830;
  //   }
  //   if (isTableMedium) {
  //     return 700;
  //   }
  //   if (isMobileView) {
  //     return 580;
  //   }

  //   if (isMobileMedium) {
  //     return 480;
  //   }
  //   if (isMobileSmall) {
  //     return 380;
  //   }
  //   if (isMobileXtraSmall) {
  //     return 300;
  //   }
  //   return 700;
  // };

  const { Option, SingleValue } = components;
  const [amazonOptions, setAmazonOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('week');
  const [selectedAmazonValue, setSelectedAmazonValue] = useState(null);
  const [lineChartData, setLineChartData] = useState([{}]);
  const [dspData, setDspData] = useState(null);
  const [groupBy, setGroupBy] = useState('daily');
  const [responseId, setResponseId] = useState(null);

  // const pieData = [{ name: 'Group A', value: 15 }];
  // const COLORS = ['#407B00'];
  // const [customDateValue, setCustomDateValue] = useState([
  //   new Date(),
  //   new Date(),
  // ]);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  const [state, setState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'selection',
    },
  ]);

  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

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
      minHeight: '560px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const reportOptions = [
    { value: 'week', label: 'This Week', sub: 'vs last week' },
    { value: 'monthly', label: 'This Month', sub: 'vs last month' },
    { value: '30days', label: 'Last 30 Days', sub: 'vs previous 30 days' },
    { value: 'year', label: 'Year to Date', sub: 'vs previous year' },
    // {
    //   value: 'custom',
    //   label: 'Custom Range',
    //   sub: 'Select start and end dates',
    // },
  ];

  // const yAxisTicks = [...Array(20)].map((_, i) => 1000 + i * 1000);

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
          // const tempData = [];
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
            res.data.daily_facts.previous.forEach(function (resData) {
              revenueTotal.previousRevenueTotal += resData.revenue;
              unitsTotal.previousUnitsTotal += resData.units_sold;
              trafficTotal.previousTrafficTotal += resData.traffic;
              conversionTotal.previousConversionTotal += resData.conversion;
              const dayDate = new Date(resData.report_date)
                .toLocaleDateString('us', { month: 'short', day: 'numeric' })
                .split(' ')
                .join(' ');
              // tempData.push({
              //   name: dayDate,
              //   'vs $': resData.revenue,
              // });
              tempRevenueData.push({ name: dayDate, 'vs $': resData.revenue });
              tempTrafficData.push({ name: dayDate, 'vs $': resData.traffic });
              tempUnitsSoldData.push({
                name: dayDate,
                'vs $': resData.units_sold,
              });
              tempConversionData.push({
                name: dayDate,
                'vs $': resData.conversion,
              });
            });
            conversionTotal.previousConversionTotal /=
              res.data.daily_facts.previous.length;
          }
          if (
            res.data.daily_facts.current &&
            res.data.daily_facts.current.length
          ) {
            res.data.daily_facts.current.forEach(function (resData, index) {
              // const key = ' $';
              revenueTotal.currentRevenueTotal += resData.revenue;
              unitsTotal.currentUnitsTotal += resData.units_sold;
              trafficTotal.currentTrafficTotal += resData.traffic;
              conversionTotal.currentConversionTotal += resData.conversion;
              if (index < res.data.daily_facts.previous.length) {
                // tempData[index][key] = resData.revenue;
                tempRevenueData[index][' $'] = resData.revenue;
                tempUnitsSoldData[index][' $'] = resData.units_sold;
                tempTrafficData[index][' $'] = resData.traffic;
                tempConversionData[index][' $'] = resData.conversion;
              } else {
                const dayDate = new Date(resData.report_date)
                  .toLocaleDateString('us', {
                    month: 'short',
                    day: 'numeric',
                  })
                  .split(' ')
                  .join(' ');
                // tempData.push({
                //   name: dayDate,
                //   ' $': resData.revenue,
                // });
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
            res.data.pf_oi_is[0].latest_date = new Date(lastUpdated)
              .toDateString()
              .substr(new Date(lastUpdated).toDateString().indexOf(' ') + 1);
            setDspData(res.data.pf_oi_is[0]);
            // setPieChartData([
            //   {
            //     name: 'Inventory',
            //     value: res.data.pf_oi_is.inventory_performance_index,
            //   },
            // ]);
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

  const DataFormater = (number) => {
    if (number > 1000000000) {
      return `$${parseInt(number / 1000000000).toString()}B`;
    }
    if (number > 1000000) {
      return `$${parseInt(number / 1000000).toString()}M`;
    }
    if (number > 1000) {
      return `$${parseInt(number / 1000).toString()}K`;
    }
    return `$${parseInt(number).toString()}`;
  };

  const checkDifferenceBetweenDates = (startDate, endDate, flag = null) => {
    let temp = '';
    let sd = startDate;
    let ed = endDate;
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

      case 'monthly':
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

  const handleDailyFact = (value) => {
    setSelectedValue(value);
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

  const handleAmazonOptions = (event) => {
    setSelectedAmazonValue(event.label);
    if (selectedValue === 'custom') {
      checkDifferenceBetweenDates(
        state[0].startDate,
        state[0].endDate,
        'custom',
      );
    } else {
      getData(selectedValue, groupBy, event.label);
    }
  };

  const handleGroupBy = (value) => {
    if (value !== groupBy) {
      setGroupBy(value);
      getData(selectedValue, value, selectedAmazonValue);
    }
  };

  const applyCustomeDate = () => {
    checkDifferenceBetweenDates(state[0].startDate, state[0].endDate, 'custom');
    setShowCustomDateModal(false);
  };

  const renderLegendText = (value, entry) => {
    const { color } = entry;
    if (value === ' $') {
      return <span style={{ color }}>Current</span>;
    }
    if (value === 'vs $') {
      return <span style={{ color }}>Past</span>;
    }
    return null;
  };

  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     if (payload.length === 2) {
  //       return (
  //         <div className="custom-tooltip">
  //           <p className="label">{activeSales}</p>
  //           <p className="label">{`$ : ${payload[0].value}`}</p>
  //           <p className="label">{`vs $ : ${payload[1].value}`}</p>
  //         </div>
  //       );
  //     }
  //     if (payload.length === 1 && payload[0].dataKey === ' $') {
  //       return (
  //         <div className="custom-tooltip">
  //           <p className="label">{activeSales}</p>
  //           <p className="label">{`$ : ${payload[0].value}`}</p>
  //         </div>
  //       );
  //     }
  //     if (payload.length === 1 && payload[0].dataKey === 'vs $') {
  //       return (
  //         <div className="custom-tooltip">
  //           <p className="label">{activeSales}</p>
  //           <p className="label">{`$ : ${payload[0].value}`}</p>
  //         </div>
  //       );
  //     }
  //   }
  //   return null;
  // };

  useEffect(() => {
    const list = [];
    list.push({
      value:
        agreement &&
        agreement.primary_marketplace &&
        agreement.primary_marketplace.id,
      label:
        agreement &&
        agreement.primary_marketplace &&
        agreement.primary_marketplace.name,
    });
    if (agreement && agreement.additional_marketplaces)
      for (const option of agreement.additional_marketplaces) {
        list.push({ value: option.id, label: option.name });
      }
    setAmazonOptions(list);

    if (responseId === null && list[0].label !== null) {
      setSelectedAmazonValue(list[0].label);
      getData(selectedValue, groupBy, list[0].label);
      setResponseId('12345');
    }
  }, [
    agreement.additional_marketplaces,
    agreement.primary_marketplace,
    agreement,
    getData,
    responseId,
    groupBy,
    selectedValue,
    selectedAmazonValue,
  ]);

  const calculateDataMin = (dataMin) => {
    if (dataMin !== Infinity) {
      return dataMin - (dataMin * 10) / 100;
    }
    return 0;
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

                    // Placeholder color
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
                    ? 'order-chart-box active'
                    : 'order-chart-box'
                }
                onClick={() => setChartData('revenue')}
                role="presentation">
                {' '}
                <div className="chart-name">Revenue</div>
                <div className="number-rate">
                  {allSalesTotal && allSalesTotal.revenue
                    ? allSalesTotal.revenue.currentRevenueTotal.toFixed(2)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs{' '}
                  {allSalesTotal && allSalesTotal.revenue
                    ? allSalesTotal.revenue.previousRevenueTotal.toFixed(2)
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
                    <img src={ArrowUpIcon} alt="arrow-up" />
                  ) : allSalesTotal &&
                    allSalesTotal.revenue &&
                    allSalesTotal.revenue.difference &&
                    !Number.isNaN(allSalesTotal.revenue.difference) &&
                    allSalesTotal.revenue.difference < 0 ? (
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
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
                    ? 'order-chart-box active'
                    : 'order-chart-box'
                }
                onClick={() => setChartData('units sold')}
                role="presentation">
                <div className="chart-name">Units Sold</div>
                <div className="number-rate">
                  {allSalesTotal && allSalesTotal.units
                    ? allSalesTotal.units.currentUnitsTotal.toFixed(2)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs{' '}
                  {allSalesTotal && allSalesTotal.units
                    ? allSalesTotal.units.previousUnitsTotal.toFixed(2)
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
                    <img src={ArrowUpIcon} alt="arrow-up" />
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
                    ? 'order-chart-box active'
                    : 'order-chart-box'
                }
                onClick={() => setChartData('traffic')}
                role="presentation">
                <div className="chart-name">Traffic</div>
                <div className="number-rate">
                  {allSalesTotal && allSalesTotal.traffic
                    ? allSalesTotal.traffic.currentTrafficTotal.toFixed(2)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs{' '}
                  {allSalesTotal && allSalesTotal.traffic
                    ? allSalesTotal.traffic.previousTrafficTotal.toFixed(2)
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
                    <img src={ArrowUpIcon} alt="arrow-up" />
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
            <div className="col-lg-3 col-md-3 pl-1 pr-0 col-6">
              <div
                className={
                  activeSales === 'conversion'
                    ? 'order-chart-box active'
                    : 'order-chart-box'
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
                    <img src={ArrowUpIcon} alt="arrow-up" />
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

          {/* <li>
              <div className="chart-name">Revenue</div>
              <div className="number-rate">$22,147.52</div>
              <div className="vs"> vs $21,114.90</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" />
                4.75%
              </div>
            </li> */}

          <div className="days-container mt-4">
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

            {/* <ul className="days-tab">
              <li>
                {' '}
                <input
                  className="form-check-input "
                  type="radio"
                  id="weeklyCheck"
                  name="flexRadioDefault"
                />
                <label htmlFor="weeklyCheck">Daily</label>
                <input
                  className="form-check-input "
                  type="radio"
                  value=""
                  name="flexRadioDefault"
                  id="weeklyCheck1"
                />
                <label htmlFor="weeklyCheck1">Weekly</label>
                <input
                  className="form-check-input "
                  type="radio"
                  value=""
                  name="flexRadioDefault"
                  id="weeklyCheck2"
                />
                <label htmlFor="weeklyCheck2">Monthly</label>
              </li>
            </ul> */}
          </div>
          <div className="clear-fix" />
          {/* <div style={{ height: '400px', width: '1000px' }}>
            <div style={{ height: '100%', width: '60%' }}>
              <ResponsiveContainer width={'79%'} height={'30%'}> */}
          <div className="performance-graph">
            <LineChart
              width={900}
              height={300}
              data={lineChartData}
              margin={{
                top: 40,
                right: 30,
                left: 0,
                bottom: 0,
              }}>
              <CartesianGrid strokeDasharray="none" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} dy={20} />
              <YAxis
                type="number"
                // domain={[0, 'dataMax']}
                axisLine={false}
                tickLine={false}
                tickFormatter={DataFormater}
                dx={-20}
                domain={[
                  (dataMin) => calculateDataMin(dataMin),
                  (dataMax) => (dataMax * 10) / 100 + dataMax,
                ]}
              />

              <Tooltip />
              <Legend formatter={renderLegendText} />
              <Line dataKey=" $" stroke="#FF5933" />
              <Line dataKey="vs $" stroke="#BFC5D2" />
            </LineChart>
            {/* </ResponsiveContainer>
            </div>
          </div> */}
          </div>
        </WhiteCard>

        <div className="row mt-3">
          {/* <div className="col-md-4 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">DSP Spend</p>
              <div className="speed-rate">$0</div>
              <div className="last-update">Last updated: N/A</div>
            </WhiteCard>{' '}
          </div> */}
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
        {/* <div className="row mt-3">
          <div className="col-md-4 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">
                Inventory Score (IPI)
              </p>
              <PiechartResponsive>
                <PieChart width={250} height={150}>
                  <Pie
                    data={pieData}
                    cx={90}
                    cy={100}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884D8"
                    paddingAngle={6}
                    dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </PiechartResponsive>
              <div className="last-update ">Last updated: Dec 31 2020</div>
            </WhiteCard>
          </div>
          <div className="col-md-8 col-sm-12">
            <WhiteCard className="fix-height">
              <div className="row">
                <div className="col-6 ">
                  {' '}
                  <p className="black-heading-title mt-0 mb-4"> Buy Box %</p>
                </div>
                <div className="col-6 text-right mb-4">
                  <DropDownSelect className="days-performance">
                    <Select classNamePrefix="react-select" className="active" />
                  </DropDownSelect>{' '}
                </div>
              </div>
              <LineChart
                width={300}
                height={200}
                data={lineChartData}
                margin={{
                  top: 30,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}>
                <CartesianGrid strokeDasharray="none" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#FF5933"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="uv" stroke="#BFC5D2" />
              </LineChart>
              <div className="last-update ">Last updated: Dec 31 2020</div>
            </WhiteCard>
          </div>
        </div> */}

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

              {/* <DateRangePicker
                isOpen={true}
                onChange={(event) => onChangeCustomDate(event)}
                value={customDateValue}
                maxDate={new Date()}

              /> */}
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
                rangeColors={['#FF5933', 'green']}
                weekdayDisplayFormat="EEEEE"
                locale={enGB}
              />
              <div
                className="text-center  "
                style={{
                  bottom: '20px',
                  position: 'absolute',
                  width: '85%',
                }}>
                <Button
                  onClick={() => applyCustomeDate()}
                  type="button"
                  className="btn-primary on-boarding  mr-2 pb-2 mb-1 w-100">
                  Apply
                </Button>
              </div>
            </div>
          </ModalBox>
        </Modal>
      </div>
    </>
  );
}

CompanyPerformance.propTypes = {
  id: PropTypes.string.isRequired,
  agreement: PropTypes.shape({
    id: PropTypes.string,
    additional_marketplaces: PropTypes.arrayOf(PropTypes.object),
    primary_marketplace: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
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
