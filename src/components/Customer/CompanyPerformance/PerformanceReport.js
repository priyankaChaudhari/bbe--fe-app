/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, {
  useEffect,
  useState,
  useCallback,
  // useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import * as am4core from '@amcharts/amcharts4/core';
// import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import Select, { components } from 'react-select';
import styled from 'styled-components';
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
import SalesPerformanceChart from './SalePerformanceChart';
import Theme from '../../../theme/Theme';

const _ = require('lodash');
const getSymbolFromCurrency = require('currency-symbol-map');

am4core.useTheme(am4themes_dataviz);
export default function PerformanceReport({
  marketplaceChoices,
  id,
  viewComponent,
  setViewComponent,
}) {
  const { Option, SingleValue } = components;
  // const [lineChartData, setLineChartData] = useState([{}]);
  const [bBChartData, setBBChartData] = useState([{}]);
  const [dspData, setDspData] = useState(null);
  // const [dspSpend, setDspSpend] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [pieData, setPieData] = useState([
    { name: 'Inventory', value: 'N/A' },
    { name: 'Total', value: 1000 },
  ]);
  // const [isApiSuccess, setIsApiSuccess] = useState(false);
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
  const [salesChartData, setSalesChartData] = useState([]);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [showBBCustomDateModal, setShowBBCustomDateModal] = useState(false);
  const [groupBy, setGroupBy] = useState('daily');
  const [BBGroupBy, setBBGroupBy] = useState('daily');
  const [amazonOptions, setAmazonOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('week');
  const [bBDailyFact, setBBDailyFact] = useState('week');
  const [selectedAmazonValue, setSelectedAmazonValue] = useState(null);

  const [salesCurrentTotal, setSalesCurrentTotal] = useState([]);
  const [salesPreviousTotal, setSalesPreviousTotal] = useState([]);
  const [salesDifference, setSalesDifference] = useState([]);
  const [filters, setFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });
  const [isApiCall, setIsApiCall] = useState(false);
  const [activeSales, setActiveSales] = useState({ revenue: true });
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
  const noDataMessage =
    'We are not pulling data for this dashboard. If we should, please file a help desk ticket and \n we will resolve this issue as soon as possible.';

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

  const bindSalesResponseData = (response) => {
    const tempData = [];

    // filterout previous data in one temporary object.
    if (response.daily_facts.previous && response.daily_facts.previous.length) {
      response.daily_facts.previous.forEach((item) => {
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
    if (response.daily_facts.current && response.daily_facts.current.length) {
      response.daily_facts.current.forEach((item, index) => {
        const currentReportDate = dayjs(item.report_date).format('MMM D YYYY');
        let indexNumber = index;
        // add the current data at same index of prevoius in temporary object
        if (
          response.daily_facts.previous &&
          index < response.daily_facts.previous.length
        ) {
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
    if (response.daily_facts && response.daily_facts.current_sum) {
      setSalesCurrentTotal(response.daily_facts.current_sum);
    } else {
      setSalesCurrentTotal([]);
    }
    if (response.daily_facts && response.daily_facts.previous_sum) {
      setSalesPreviousTotal(response.daily_facts.previous_sum);
    } else {
      setSalesPreviousTotal([]);
    }
    if (response.daily_facts && response.daily_facts.difference_data) {
      setSalesDifference(response.daily_facts.difference_data);
    } else {
      setSalesDifference([]);
    }
    return tempData;
  };

  const getBBData = useCallback(
    (marketplace, BBdailyFact, bBGroupBy, startDate = null, endDate = null) => {
      // setIsLoading({ loader: true, type: 'button' });
      setIsApiCall(true);
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
          setIsApiCall(false);
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
          setIsApiCall(false);
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
      setIsApiCall(true);
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
          setIsApiCall(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.daily_facts) {
            const salesGraphData = bindSalesResponseData(res.data);
            setSalesChartData(salesGraphData);

            if (res.data.pf_oi_is && res.data.pf_oi_is.length) {
              const lastUpdated = res.data.pf_oi_is[0].latest_date;
              res.data.pf_oi_is[0].latest_date = dayjs(lastUpdated).format(
                'MMM DD YYYY',
              );
              // if (res.data.dsp_spend && res.data.dsp_spend.length) {
              //   setDspSpend({
              //     value: res.data.dsp_spend[0].monthly_spend.toFixed(2),
              //     date: dayjs(res.data.dsp_spend[0].report_date).format(
              //       'MMM DD YYYY',
              //     ),
              //   });
              // }
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
          } else {
            setSalesChartData([]);
          }
          setIsApiCall(false);
        }
      });
    },
    [id],
  );

  const setSalesBoxClass = (name, classValue) => {
    let selectedClass = '';
    if (Object.prototype.hasOwnProperty.call(activeSales, name)) {
      // if (_.size(selectedAdBox) === 1) {
      //   selectedClass = 'order-chart-box active fix-height';
      // } else {
      selectedClass = `order-chart-box ${classValue} fix-height`;
      // }
    } else if (_.size(activeSales) === 4) {
      selectedClass = 'order-chart-box fix-height disabled';
    } else {
      selectedClass = 'order-chart-box fix-height';
    }
    return selectedClass;
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
    if (diffDays <= 60) {
      temp = 'daily';
      setFilters({ daily: true, weekly: false, month: false });
      setGroupBy('daily');
    } else if (diffDays > 60 && diffDays <= 180) {
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

  // set group by filter when selected option is, week, month or 60 days
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

    if (diffDays <= 60) {
      temp = 'daily';
      setBBGroupBy('daily');
    } else if (diffDays > 60 && diffDays <= 180) {
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
        {/* <span style={{ fontSize: '16px' }}>.00</span> */}
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

  const setBoxToggle = (name) => {
    if (
      Object.prototype.hasOwnProperty.call(activeSales, name) &&
      _.size(activeSales) > 1
    ) {
      setActiveSales(_.omit(activeSales, [name]));
    } else if (_.size(activeSales) < 4) {
      setActiveSales(_.omit(_.assign(activeSales, { [name]: true })));
    }
  };

  const renderMarketplaceDropDown = () => {
    return (
      <Tab className="mb-3">
        <WhiteCard>
          <ul className="tabs">
            <li
              className={viewComponent === 'salePerformance' ? 'active' : ''}
              onClick={() => setViewComponent('salePerformance')}
              role="presentation">
              Sales Performance
            </li>
            <li
              className={viewComponent === 'adPerformance' ? 'active' : ''}
              onClick={() => setViewComponent('adPerformance')}
              role="presentation">
              Ad Performance
            </li>
          </ul>
          <div className="row">
            <div className="col-md-4  col-sm-12 ">
              <div className="view-data-for mt-4 ">View data for</div>{' '}
            </div>
            <div className="col-md-4 col-sm-6 mt-2 pt-1 pl-0"> </div>
            <div className="col-md-4 col-sm-6  mt-2 pt-1 pl-0">
              {' '}
              <DropDownSelect
                className={isApiCall ? `cursor  disabled` : 'cursor '}>
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
        </WhiteCard>
      </Tab>
    );
    // return (
    //   <div className="row">
    //     <div className="col-12 mb-3">
    //       {/* {DropDown(
    //         'cursor',
    //         amazonOptions,
    //         amazonOptions && amazonOptions[0] && amazonOptions[0].label,
    //         DropdownIndicator,
    //         amazonOptions && amazonOptions[0],
    //         handleAmazonOptions,
    //       )} */}

    // <DropDownSelect className="cursor ">
    //   <Select
    //     classNamePrefix="react-select"
    //     className="active"
    //     components={DropdownIndicator}
    //     options={amazonOptions}
    //     defaultValue={amazonOptions && amazonOptions[0]}
    //     onChange={(event) => handleAmazonOptions(event)}
    //     placeholder={
    //       amazonOptions && amazonOptions[0] && amazonOptions[0].label
    //     }
    //     theme={(theme) => ({
    //       ...theme,
    //       colors: {
    //         ...theme.colors,
    //         neutral50: '#1A1A1A',
    //       },
    //     })}
    //   />
    // </DropDownSelect>
    //     </div>
    //   </div>
    // );
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
          isApiCall,
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
      <div className="row mt-4 mb-3">
        {_.size(activeSales) <= 2 ? (
          <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
            <ul className="rechart-item">
              <li>
                <div className="weeks">
                  <span
                    // className="orange block"
                    className={
                      _.size(activeSales) === 1
                        ? `${_.keys(activeSales)[0]} adSales circle`
                        : 'darkGray circle'
                    }
                  />
                  <span>Recent</span>
                </div>
              </li>
              {selectedValue !== 'custom' ? (
                <li>
                  <div className="weeks">
                    <ul className="dashed-line">
                      <li
                        className={
                          _.size(activeSales) === 1
                            ? `${_.keys(activeSales)[0]} block `
                            : 'darkGray block '
                        }
                      />
                      <li
                        className={
                          _.size(activeSales) === 1
                            ? `${_.keys(activeSales)[0]} block  `
                            : 'darkGray block '
                        }
                      />
                    </ul>

                    <span>Previous</span>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
        ) : (
          <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2" />
        )}
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

  const renderSalesBox = (matricsName, className) => {
    let currentTotal = 0;
    let previousTotal = 0;
    let difference = 0;
    let theCurrency = null;
    let boxActiveClass = '';
    const name = matricsName;
    let displayMatricsName;

    if (name === 'revenue') {
      currentTotal =
        salesCurrentTotal && salesCurrentTotal.revenue
          ? salesCurrentTotal.revenue
          : 0;
      previousTotal =
        salesPreviousTotal && salesPreviousTotal.revenue
          ? salesPreviousTotal.revenue
          : 0;
      difference =
        salesDifference && salesDifference.revenue
          ? salesDifference.revenue
          : 'N/A';
      theCurrency = currency !== null ? `(${currency})` : null;
      boxActiveClass = 'ad-sales-active';
      displayMatricsName = matricsName;
    } else if (name === 'unitsSold') {
      currentTotal =
        salesCurrentTotal && salesCurrentTotal.units_sold
          ? salesCurrentTotal.units_sold
          : 0;
      previousTotal =
        salesPreviousTotal && salesPreviousTotal.units_sold
          ? salesPreviousTotal.units_sold
          : 0;
      difference =
        salesDifference && salesDifference.units_sold
          ? salesDifference.units_sold
          : 'N/A';
      theCurrency = ``;
      boxActiveClass = 'ad-spend-active';
      displayMatricsName = 'Units sold';
    } else if (name === 'traffic') {
      currentTotal =
        salesCurrentTotal && salesCurrentTotal.traffic
          ? salesCurrentTotal.traffic
          : 0;
      previousTotal =
        salesPreviousTotal && salesPreviousTotal.traffic
          ? salesPreviousTotal.traffic
          : 0;
      difference =
        salesDifference && salesDifference.traffic
          ? salesDifference.traffic
          : 'N/A';
      theCurrency = ``;
      boxActiveClass = 'ad-conversion-active';
      displayMatricsName = matricsName;
    } else if (name === 'conversion') {
      currentTotal =
        salesCurrentTotal && salesCurrentTotal.conversion
          ? salesCurrentTotal.conversion
          : 0;
      previousTotal =
        salesPreviousTotal && salesPreviousTotal.conversion
          ? salesPreviousTotal.conversion
          : 0;
      difference =
        salesDifference && salesDifference.conversion
          ? salesDifference.conversion
          : 'N/A';
      theCurrency = ``;
      boxActiveClass = 'impression-active';
      displayMatricsName = matricsName;
    }
    // if (name === 'revenue') {
    //   currentTotal =
    //     allSalesTotal && allSalesTotal.revenue
    //       ? allSalesTotal.revenue.currentRevenueTotal
    //       : 0;
    //   previousTotal =
    //     allSalesTotal && allSalesTotal.revenue
    //       ? allSalesTotal.revenue.previousRevenueTotal
    //       : 0;
    //   difference =
    //     allSalesTotal &&
    //     allSalesTotal.revenue &&
    //     allSalesTotal.revenue.difference
    //       ? allSalesTotal.revenue.difference
    //       : 0;
    //   theCurrency = currency !== null ? `(${currency})` : null;
    //   boxActiveClass = 'ad-sales-active';
    // } else if (name === 'unitsSold') {
    //   currentTotal =
    //     allSalesTotal && allSalesTotal.units
    //       ? allSalesTotal.units.currentUnitsTotal
    //       : 0;
    //   previousTotal =
    //     allSalesTotal && allSalesTotal.units
    //       ? allSalesTotal.units.previousUnitsTotal
    //       : 0;
    //   difference =
    //     allSalesTotal && allSalesTotal.units && allSalesTotal.units.difference
    //       ? allSalesTotal.units.difference
    //       : 0;
    //   theCurrency = ``;
    //   boxActiveClass = 'ad-spend-active';
    // } else if (name === 'traffic') {
    //   currentTotal =
    //     allSalesTotal && allSalesTotal.traffic
    //       ? allSalesTotal.traffic.currentTrafficTotal
    //       : 0;
    //   previousTotal =
    //     allSalesTotal && allSalesTotal.traffic
    //       ? allSalesTotal.traffic.previousTrafficTotal
    //       : 0;
    //   difference =
    //     allSalesTotal &&
    //     allSalesTotal.traffic &&
    //     allSalesTotal.traffic.difference
    //       ? allSalesTotal.traffic.difference
    //       : 0;
    //   theCurrency = ``;
    //   boxActiveClass = 'ad-conversion-active';
    // } else if (name === 'conversion') {
    //   currentTotal =
    //     allSalesTotal && allSalesTotal.conversion
    //       ? allSalesTotal.conversion.currentConversionTotal
    //       : 0;
    //   previousTotal =
    //     allSalesTotal && allSalesTotal.conversion
    //       ? allSalesTotal.conversion.previousConversionTotal
    //       : 0;
    //   difference =
    //     allSalesTotal &&
    //     allSalesTotal.conversion &&
    //     allSalesTotal.conversion.difference
    //       ? allSalesTotal.conversion.difference
    //       : 0;
    //   theCurrency = ``;
    //   boxActiveClass = 'impression-active';
    // }
    return (
      <div className={className}>
        <div
          className={setSalesBoxClass(name, boxActiveClass)}
          onClick={() => setBoxToggle(name)}
          role="presentation">
          {' '}
          <div className="chart-name">
            {displayMatricsName.toUpperCase()} {theCurrency}
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
              : previousTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
            'unitsSold',
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
        {/* <div id="chartdiv" style={{ width: '100%', height: '500px' }} /> */}
        {salesChartData.length !== 0 ? (
          <SalesPerformanceChart
            chartId="chartdiv"
            chartData={salesChartData}
            currencySymbol={currencySymbol}
            selectedBox={activeSales}
            selectedDF={selectedValue}
          />
        ) : (
          <NoData>{noDataMessage}</NoData>
        )}
      </WhiteCard>
    );
  };

  // const renderDSPSpendPanel = () => {
  //   return (
  //     <div className="col-md-4 col-sm-12 mb-3">
  //       <WhiteCard className="fix-height">
  //         <p className="black-heading-title mt-0 mb-4">DSP Spend</p>
  //         <div className="speed-rate">
  //           {dspSpend && dspSpend.value
  //             ? `${currencySymbol}${dspSpend.value
  //                 .toString()
  //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  //             : 'N/A'}
  //         </div>
  //         <div className="last-update">
  //           Last updated: {dspSpend && dspSpend.date}
  //         </div>
  //       </WhiteCard>{' '}
  //     </div>
  //   );
  // };

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
        <WhiteCard className="fix-height ">
          <p className="black-heading-title mt-0 mb-4">Inventory Score (IPI)</p>
          {/* <PiechartResponsive> */}
          <ResponsiveContainer width="99%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx={75}
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
      <div className="col-sm-12 mb-3 ">
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
                isApiCall,
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
          {bBChartData && bBChartData.length > 1 ? (
            renderBBgraph()
          ) : (
            <NoData>{noDataMessage}</NoData>
          )}
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
        {/* {renderDSPSpendPanel()} */}
        {renderInventoryScorePanel()}
        {renderPositiveFeedbackPanel()}
        {renderOrderIssuesPanel()}
      </div>
      <div className="row ">{renderBBPercentGraphPanel()}</div>
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

const Tab = styled.div`
  .tabs {
    list-style-type: none;
    position: relative;
    text-align: left;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid ${Theme.gray11};

    li {
      display: inline-block;
      margin-right: 60px;
      padding-bottom: 15px;
      font-weight: normal;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-family: ${Theme.baseFontFamily};
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &.a {
        text-decoration: none;
      }

      &.active {
        padding-bottom: 16px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
  .view-data-for {
    margin-right: 60px;
    font-weight: normal;
    color: ${Theme.black};
    font-size: ${Theme.extraMedium};
    font-family: ${Theme.baseFontFamily};
    width: 100%;
  }

  @media only screen and (max-width: 767px) {
    .tabs {
      li {
        font-size: 14px;
        margin-right: 25px;
      }
    }
    .view-data-for {
      text-align: center;
      padding-bottom: 10px;
  }
`;

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
