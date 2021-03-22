/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useCallback } from 'react';
// import { useMediaQuery } from 'react-responsive';

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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Select, { components } from 'react-select';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { getPerformance } from '../../api';

import {
  // CopyLinkIcon,
  // InfoIcons,
  // ExternalLink,

  ArrowUpIcon,
  ArrowDownIcon,
  CaretUp,
} from '../../theme/images/index';
import { DropDownSelect } from '../../common';
import { WhiteCard } from '../../theme/Global';
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

  const pieData = [{ name: 'Group A', value: 15 }];
  const COLORS = ['#407B00'];
  const [customDateValue, setCustomDateValue] = useState([
    new Date(),
    new Date(),
  ]);

  const [revenueData, setRevenueData] = useState([{}]);
  const [unitsSoldData, setUnitsSoldData] = useState([{}]);
  const [trafficData, setTrafficData] = useState([{}]);
  const [conversionData, setConversionData] = useState([{}]);
  const [allSalesTotal, setAllSalesTotal] = useState({});

  const reportOptions = [
    { value: 'week', label: 'This Week', sub: 'vs last week' },
    { value: 'month', label: 'This Month', sub: 'vs last month' },
    { value: '30days', label: 'Last 30 Days', sub: 'vs previous 30 days' },
    { value: 'yeartoDate', label: 'Year to Date', sub: 'vs previous year' },
    {
      value: 'custom',
      label: 'Custom Range',
      sub: 'Select start and end dates',
    },
  ];

  const yAxisTicks = [
    0,
    1000,
    2000,
    3000,
    4000,
    5000,
    6000,
    7000,
    8000,
    9000,
    10000,
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
    return parseFloat(
      (((currentTotal - previousTotal) * 100) / currentTotal).toFixed(2),
    );
  };

  const getData = useCallback(
    (marketplace, startDate = null, endDate = null) => {
      // setIsLoading({ loader: true, type: 'button' });
      getPerformance(
        id,
        selectedValue,
        groupBy,
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
                .reverse()
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
          }
          if (
            res.data.daily_facts.current &&
            res.data.daily_facts.current.length
          ) {
            res.data.daily_facts.current.forEach(function (resData, index) {
              const key = ' $';
              revenueTotal.currentRevenueTotal += resData.revenue;
              unitsTotal.currentUnitsTotal += resData.units_sold;
              trafficTotal.currentTrafficTotal += resData.traffic;
              conversionTotal.currentConversionTotal += resData.conversion;
              if (index < res.data.daily_facts.previous.length) {
                // tempData[index][key] = resData.revenue;
                tempRevenueData[index][key] = resData.revenue;
                tempUnitsSoldData[index][key] = resData.units_sold;
                tempTrafficData[index][key] = resData.traffic;
                tempConversionData[index][key] = resData.conversion;
              } else {
                const dayDate = new Date(resData.report_date)
                  .toLocaleDateString('us', {
                    month: 'short',
                    day: 'numeric',
                  })
                  .split(' ')
                  .reverse()
                  .join(' ');
                // tempData.push({
                //   name: dayDate,
                //   ' $': resData.revenue,
                // });
                tempRevenueData.push({
                  name: dayDate,
                  'vs $': resData.revenue,
                });
                tempTrafficData.push({
                  name: dayDate,
                  'vs $': resData.traffic,
                });
                tempUnitsSoldData.push({
                  name: dayDate,
                  'vs $': resData.units_sold,
                });
                tempConversionData.push({
                  name: dayDate,
                  'vs $': resData.conversion,
                });
              }
            });
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
    [id, selectedValue, groupBy],
  );

  const setChartData = (value) => {
    if (value === 'traffic') {
      setLineChartData(trafficData);
    }
    if (value === 'units sold') {
      setLineChartData(unitsSoldData);
    }
    if (value === 'conversion') {
      setLineChartData(conversionData);
    }
    if (value === 'revenue') {
      setLineChartData(revenueData);
    }
  };

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropdownIndicator,
    };
  };

  const handleDailyFact = (value) => {
    setSelectedValue(value);
    // if (value !== 'custom') {
    //   getData(value, selectedAmazonValue);
    // }
  };

  const handleAmazonOptions = (event) => {
    setSelectedAmazonValue(event.label.toLowerCase());
    getData(event.label.toLowerCase());
  };

  const handleGroupBy = (value) => {
    setGroupBy(value);
    // getData(selectedAmazonValue);
  };

  const onChangeCustomDate = (event) => {
    if (event !== null) {
      const startDate = `${event[0].getDate()}-${
        event[0].getMonth() + 1
      }-${event[0].getFullYear()}`;
      const endDate = `${event[1].getDate()}-${
        event[1].getMonth() + 1
      }-${event[1].getFullYear()}`;

      setCustomDateValue([startDate, endDate]);
      getData(selectedAmazonValue, startDate, endDate);
    } else {
      setCustomDateValue([new Date(), new Date()]);
    }
  };

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
    getData(list[0].label);
  }, [
    agreement.additional_marketplaces,
    agreement.primary_marketplace,
    agreement,
    getData,
  ]);

  useEffect(() => {
    // getData(selectedAmazonValue);
  }, []);

  return (
    <>
      <div className="col-lg-8 col-12">
        <div className="row">
          <div className="col-12 mb-3">
            <DropDownSelect>
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
                    neutral50: '#1A1A1A', // Placeholder color
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
            <div className="col-6 ">
              {' '}
              <p className="black-heading-title mt-0 mb-4">
                {' '}
                Sales Performance
              </p>
            </div>
            <div className="col-6  mb-3">
              <DropDownSelect className="days-performance">
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
            <div className="col-12 text-right mb-3">
              {selectedValue === 'custom' ? (
                <DateRangePicker
                  onChange={(event) => onChangeCustomDate(event)}
                  value={customDateValue}
                  maxDate={new Date()}
                  // format="dd-MM-yyyy"
                />
              ) : null}
            </div>
          </div>

          <div className="row mr-1 ml-1">
            <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
              <div
                className="order-chart-box"
                onClick={() => setChartData('revenue')}
                role="presentation">
                {' '}
                <div className="chart-name">Revenue</div>
                <div className="number-rate">
                  $
                  {allSalesTotal && allSalesTotal.revenue
                    ? allSalesTotal.revenue.currentRevenueTotal.toFixed(2)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs ${' '}
                  {allSalesTotal && allSalesTotal.revenue
                    ? allSalesTotal.revenue.previousRevenueTotal.toFixed(2)
                    : 0}
                </div>
                <div className="perentage-value">
                  <img src={ArrowUpIcon} alt="arrow-up" />
                  {allSalesTotal && allSalesTotal.revenue
                    ? `${allSalesTotal.revenue.difference} %`
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 pr-1 pl-1 col-6 mb-3">
              <div
                className="order-chart-box"
                onClick={() => setChartData('units sold')}
                role="presentation">
                <div className="chart-name">Units Sold</div>
                <div className="number-rate">
                  $
                  {allSalesTotal && allSalesTotal.units
                    ? allSalesTotal.units.currentUnitsTotal.toFixed(2)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs ${' '}
                  {allSalesTotal && allSalesTotal.units
                    ? allSalesTotal.units.previousUnitsTotal.toFixed(2)
                    : 0}
                </div>
                <div className="perentage-value">
                  <img src={ArrowUpIcon} alt="arrow-up" />{' '}
                  {allSalesTotal && allSalesTotal.units
                    ? `${allSalesTotal.units.difference} %`
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-3 pr-1 pl-1  col-6 mb-3
             ">
              <div
                className="order-chart-box"
                onClick={() => setChartData('traffic')}
                role="presentation">
                <div className="chart-name">Traffic</div>
                <div className="number-rate">
                  $
                  {allSalesTotal && allSalesTotal.trafic
                    ? allSalesTotal.traffic.currentTrafficTotal.toFixed(2)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs ${' '}
                  {allSalesTotal && allSalesTotal.traffic
                    ? allSalesTotal.traffic.previousTrafficTotal.toFixed(2)
                    : 0}
                </div>
                <div className="perentage-value down">
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-up"
                  />
                  {allSalesTotal && allSalesTotal.traffic
                    ? `${allSalesTotal.traffic.difference} %`
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 pl-1 pr-0 col-6">
              <div
                className="order-chart-box"
                onClick={() => setChartData('conversion')}
                role="presentation">
                <div className="chart-name">Conversion</div>
                <div className="number-rate">
                  $
                  {allSalesTotal && allSalesTotal.conversion
                    ? allSalesTotal.conversion.currentConversionTotal.toFixed(2)
                    : 0}
                </div>
                <div className="vs">
                  {' '}
                  vs $
                  {allSalesTotal && allSalesTotal.conversion
                    ? allSalesTotal.conversion.previousConversionTotal.toFixed(
                        2,
                      )
                    : 0}
                </div>
                <div className="perentage-value">
                  <img src={ArrowUpIcon} alt="arrow-up" />
                  {allSalesTotal && allSalesTotal.conversion
                    ? `${allSalesTotal.conversion.difference} %`
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
              <li className={selectedValue === 'custom' ? 'disabled' : ''}>
                {' '}
                <input
                  className="d-none"
                  type="radio"
                  defaultChecked={
                    selectedValue === 'week' ||
                    selectedValue === null ||
                    selectedValue !== 'custom'
                  }
                  id="daysCheck"
                  name="flexRadioDefault"
                  onClick={() => handleGroupBy('daily')}
                />
                <label htmlFor="daysCheck">Daily</label>
              </li>
              <li
                className={
                  selectedValue === 'week' ||
                  selectedValue === null ||
                  selectedValue === 'custom'
                    ? 'disabled'
                    : ''
                }>
                <input
                  className="d-none"
                  type="radio"
                  value=""
                  id="weeklyCheck"
                  name="flexRadioDefault"
                  onClick={() => handleGroupBy('weekly')}
                />
                <label htmlFor="weeklyCheck">Weekly</label>
              </li>
              <li
                className={
                  selectedValue === 'week' ||
                  selectedValue === null ||
                  selectedValue === 'month' ||
                  selectedValue === '30days' ||
                  selectedValue === 'custom'
                    ? 'disabled'
                    : ''
                }>
                <input
                  className=" d-none"
                  type="radio"
                  value=""
                  id="monthlyCheck"
                  name="flexRadioDefault"
                  onClick={() => handleGroupBy('monthly')}
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
          <LineChart
            width={700}
            height={300}
            data={lineChartData}
            margin={{
              top: 40,
              right: 30,
              left: 0,
              bottom: 0,
            }}>
            <CartesianGrid strokeDasharray="none" />
            <XAxis dataKey="name" />
            <YAxis type="number" ticks={yAxisTicks} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey=" $"
              stroke="#FF5933"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="vs $" stroke="#BFC5D2" />
          </LineChart>
          {/* </ResponsiveContainer>
            </div>
          </div> */}
        </WhiteCard>

        <div className="row mt-3">
          <div className="col-md-4 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">DSP Spend</p>
              <div className="speed-rate">$0</div>
              <div className="last-update">Last updated: N/A</div>
            </WhiteCard>{' '}
          </div>
          <div className="col-md-4 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">Positive Feedback</p>
              <div className="seller-health positive">
                {dspData && dspData.feedback_30
                  ? `${dspData && dspData.feedback_30} %`
                  : 'N/A'}
              </div>
              <div className="seller-update mb-3">Last 30 days</div>
              <div className="seller-health positive ">
                {dspData && dspData.feedback_365
                  ? `${dspData && dspData.feedback_365} %`
                  : 'N/A'}
              </div>
              <div className="seller-update mb-5">Last 12 months</div>
              <div className="last-update ">
                Last updated: {dspData && dspData.latest_date}
              </div>
            </WhiteCard>
          </div>
          <div className="col-md-4 col-sm-12 ">
            <WhiteCard className="fix-height">
              {' '}
              <p className="black-heading-title mt-0 mb-4">Order Issues</p>
              <div className="seller-health">
                {dspData && dspData.policy_issues
                  ? `${dspData && dspData.policy_issues} %`
                  : 'N/A'}
              </div>
              <div className="seller-update mb-3">Order Defect Rate</div>
              <div className="seller-health  ">
                {dspData && dspData.order_defect_fba
                  ? `${dspData && dspData.order_defect_fba} %`
                  : 'N/A'}
              </div>
              <div className="seller-update mb-5">Policy Violations</div>
              <div className="last-update ">
                Last updated: {dspData && dspData.latest_date}
              </div>
              {/* <div className="seller-health mt-3">0.01%</div>
              <div className="last-update">Policy Violations</div> */}
            </WhiteCard>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 col-sm-4 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">
                Inventory Score (IPI)
              </p>
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
                width={450}
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
        </div>
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
