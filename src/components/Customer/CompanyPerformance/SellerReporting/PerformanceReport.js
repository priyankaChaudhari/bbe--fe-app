/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';
import Select from 'react-select';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import { instanceOf, shape, string } from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import SalesPerformancePanel from './SalesPerformancePanel';
import BuyBoxPercentPanel from './BuyBoxPercentPanel';
import Theme from '../../../../theme/Theme';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getPerformance, getBuyBoxChartData } from '../../../../api';
import {
  DropDownSelect,
  WhiteCard,
  CustomDateModal,
  DropDownIndicator,
} from '../../../../common';

const _ = require('lodash');
const getSymbolFromCurrency = require('currency-symbol-map');

am4core.useTheme(am4themes_dataviz);
export default function PerformanceReport({ marketplaceChoices, id }) {
  const [bBChartData, setBBChartData] = useState([{}]);
  const [dspData, setDspData] = useState(null);
  const [isSPCustomDateApply, setIsSPCustomDateApply] = useState(false);
  const [isBBCustomDateApply, setIsBBCustomDateApply] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [pieData, setPieData] = useState([
    { name: 'Inventory', value: 'N/A' },
    { name: 'Total', value: 1000 },
  ]);
  const COLORS = ['#97ca61', '#EAEFF2'];
  const [marketplaceDefaultValue, setMarketplaceDefaultValue] = useState();
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  const [state, setState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'selection',
    },
  ]);
  const [customDate, setCustomDate] = useState({
    startDate: currentDate,
    endDate: currentDate,
  });
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
  const [selectedValue, setSelectedValue] = useState({
    value: 'week',
    label: 'Recent 7 days',
    sub: 'vs Previous 7 days',
  });
  const [bBDailyFact, setBBDailyFact] = useState({
    value: 'week',
    label: 'Recent 7 days',
  });
  const [selectedAmazonValue, setSelectedAmazonValue] = useState(null);
  const [organicSale, setOrganicSale] = useState(0);
  const [inorganicSale, setInorganicSale] = useState(0);
  const [salesCurrentTotal, setSalesCurrentTotal] = useState({});
  const [salesPreviousTotal, setSalesPreviousTotal] = useState({});
  const [salesDifference, setSalesDifference] = useState({});
  const [filters, setFilters] = useState({
    daily: true,
    weekly: false,
    month: false,
  });
  const [salesGraphLoader, setSalesGraphLoader] = useState(false);
  const [bBGraphLoader, setBbGraphLoader] = useState(false);

  const [isApiCall, setIsApiCall] = useState(false);
  const [activeSales, setActiveSales] = useState({ revenue: true });

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
            item.units_sold !== null ? item.units_sold.toFixed(0) : '0',
          trafficPreviousLabel:
            item.traffic !== null ? item.traffic.toFixed(0) : '0',
          conversionPreviousLabel:
            item.conversion !== null ? item.conversion.toFixed(2) : '0',
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
            item.units_sold !== null ? item.units_sold.toFixed(0) : '0';
          tempData[index].trafficCurrentLabel =
            item.traffic !== null ? item.traffic.toFixed(0) : '0';
          tempData[index].conversionCurrentLabel =
            item.conversion !== null ? item.conversion.toFixed(2) : '0';

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
              item.units_sold !== null ? item.units_sold.toFixed(0) : '0',
            trafficCurrentLabel:
              item.traffic !== null ? item.traffic.toFixed(0) : '0',
            conversionCurrentLabel:
              item.conversion !== null ? item.conversion.toFixed(2) : '0',

            revenuePreviousLabel: '0.00',
            unitsSoldPreviousLabel: '0',
            trafficPreviousLabel: '0',
            conversionPreviousLabel: '0',
          });
        }
      });
    }

    // filterout the dsp current total, previous total, and diffrence
    if (response.daily_facts && response.daily_facts.current_sum) {
      setSalesCurrentTotal(response.daily_facts.current_sum);
    } else {
      setSalesCurrentTotal({});
    }
    if (response.daily_facts && response.daily_facts.previous_sum) {
      setSalesPreviousTotal(response.daily_facts.previous_sum);
    } else {
      setSalesPreviousTotal({});
    }
    if (response.daily_facts && response.daily_facts.difference_data) {
      setSalesDifference(response.daily_facts.difference_data);
    } else {
      setSalesDifference({});
    }
    return tempData;
  };

  const getBBData = useCallback(
    (marketplace, BBdailyFact, bBGroupBy, startDate = null, endDate = null) => {
      setIsApiCall(true);
      setBbGraphLoader(true);
      getBuyBoxChartData(
        id,
        marketplace,
        BBdailyFact,
        bBGroupBy,
        startDate,
        endDate,
      ).then((res) => {
        if (res && res.status === 400) {
          setIsApiCall(false);
          setBbGraphLoader(false);
        }
        if (res && res.status === 200 && res.data && res.data.bbep) {
          const avg =
            res.data.bbep
              .filter((record) => record.bbep)
              .reduce((acc, record) => acc + record.bbep, 0) /
              res.data.bbep.length || 0;

          const tempBBData = res.data.bbep.map((data) => {
            return {
              date: dayjs(data.report_date).format('MMM D YYYY'),
              value: data.bbep,
              avg: avg.toFixed(2),
            };
          });
          const total = tempBBData && tempBBData.length ? tempBBData.length : 0;
          for (let i = 0; i <= Math.floor((total * 10) / 100); i += 1) {
            tempBBData.push({ avg: avg.toFixed(2) });
          }
          setBBChartData(tempBBData);
          setIsApiCall(false);
          setBbGraphLoader(false);
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
      setIsApiCall(true);
      setSalesGraphLoader(true);
      getPerformance(
        id,
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        startDate,
        endDate,
      ).then((res) => {
        if (res && res.status === 400) {
          setIsApiCall(false);
          setSalesGraphLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.daily_facts) {
            const salesGraphData = bindSalesResponseData(res.data);
            setSalesChartData(salesGraphData);

            // brekdown tooltip values
            if (res.data.daily_facts && res.data.daily_facts.inorganic_sale) {
              setInorganicSale(res.data.daily_facts.inorganic_sale);
            }

            if (res.data.daily_facts && res.data.daily_facts.organic_sale) {
              setOrganicSale(res.data.daily_facts.organic_sale);
            }
            if (res.data.pf_oi_is && res.data.pf_oi_is.length) {
              const lastUpdated = res.data.pf_oi_is[0].latest_date;
              res.data.pf_oi_is[0].latest_date = dayjs(lastUpdated).format(
                'MMM DD YYYY',
              );

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
          setSalesGraphLoader(false);
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
    setAmazonOptions(list);

    if (responseId === null && list.length && list[0].value !== null) {
      let marketplace = list[0];
      marketplace = list.filter((op) => op.value === 'Amazon.com');
      if (marketplace.length === 0) {
        marketplace[0] = _.nth(list, 0);
      }

      setMarketplaceDefaultValue(marketplace);
      setSelectedAmazonValue(marketplace[0].value);
      setCurrency(marketplace[0].currency);
      setCurrencySymbol(getSymbolFromCurrency(marketplace[0].currency));
      getData(selectedValue.value, groupBy, marketplace[0].value);
      getBBData(marketplace[0].value, bBDailyFact.value, 'daily');
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

  const renderCustomDateSubLabel = (props, flag) => {
    if (flag === 'sp') {
      if (selectedValue.value === 'custom' && isSPCustomDateApply) {
        return `From- ${dayjs(state[0].startDate).format(
          'MMM D, YYYY',
        )}  To- ${dayjs(state[0].endDate).format('MMM D, YYYY')}`;
      }
    } else if (bBDailyFact.value === 'custom' && isBBCustomDateApply) {
      return `From- ${dayjs(BBstate[0].startDate).format(
        'MMM D, YYYY',
      )}  To- ${dayjs(BBstate[0].endDate).format('MMM D, YYYY')}`;
    }

    return props.data.sub;
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
      setFilters({ daily: true, weekly: true, month: false });
      setGroupBy('daily');
    } else if (diffDays > 30 && diffDays <= 60) {
      temp = 'daily';
      setFilters({ daily: true, weekly: true, month: true });
      setGroupBy('daily');
    } else if (diffDays > 60) {
      temp = 'weekly';
      setFilters({ daily: false, weekly: true, month: true });
      setGroupBy('weekly');
    }

    if (flag === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;

      setCustomDate({ startDate: sd, endDate: ed });
      getData(flag, temp, marketplace, sd, ed);
    } else {
      // flag==='year
      getData(flag, temp, marketplace);
    }
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
        setFilters({ daily: true, weekly: true, month: false });
        setGroupBy('daily');
        getData(value, 'daily', selectedAmazonValue);
        break;

      case '30days':
        setFilters({ daily: true, weekly: true, month: false });
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
    setSelectedValue(event);
    if (value !== 'custom') {
      setIsSPCustomDateApply(false);
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
    }

    if (value === 'custom') {
      setShowCustomDateModal(true);
    } else {
      setGropuByFilter(value);
    }
  };

  const handleBBDailyFact = (event) => {
    const { value } = event;
    setBBDailyFact(event);

    if (value !== 'custom') {
      setIsBBCustomDateApply(false);
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
    if (selectedValue.value === 'custom') {
      checkDifferenceBetweenDates(
        state[0].startDate,
        state[0].endDate,
        'custom',
        event.value,
      );
    } else {
      getData(selectedValue.value, groupBy, event.value);
      getBBData(event.value, bBDailyFact.value, BBGroupBy);
    }
  };

  const handleGroupBy = (value) => {
    if (value !== groupBy) {
      setGroupBy(value);
      if (selectedValue.value === 'custom') {
        getData(
          selectedValue.value,
          value,
          selectedAmazonValue,
          customDate.startDate,
          customDate.endDate,
        );
      } else {
        getData(selectedValue.value, value, selectedAmazonValue);
      }
    }
  };

  const applyCustomDate = (flag) => {
    if (flag === 'BBDate') {
      BBYearAndCustomDateFilter(
        BBstate[0].startDate,
        BBstate[0].endDate,
        'custom',
      );
      setShowBBCustomDateModal(false);
      setIsBBCustomDateApply(true);
    } else {
      checkDifferenceBetweenDates(
        state[0].startDate,
        state[0].endDate,
        'custom',
      );
      setShowCustomDateModal(false);
      setIsSPCustomDateApply(true);
    }
  };

  const renderMarketplaceDropDown = () => {
    return (
      <WhiteCard className="mb-3">
        <ViewData>
          <div className="row">
            <div className="col-md-4  col-sm-12 ">
              <div className="view-data-for mt-4 ">View data for</div>{' '}
            </div>
            <div className="col-md-4 col-sm-6 mt-2 pt-1 pl-0"> </div>
            <div className="col-md-4 col-sm-6  mt-2 pt-1 pl-0">
              {' '}
              <DropDownSelect
                id="BT-salesperformancedata-countryfilter"
                className={isApiCall ? `cursor  disabled` : 'cursor '}>
                <Select
                  classNamePrefix="react-select"
                  className="active"
                  components={DropDownIndicator}
                  options={amazonOptions}
                  defaultValue={
                    // amazonOptions && amazonOptions[0]
                    marketplaceDefaultValue && marketplaceDefaultValue[0]
                  }
                  onChange={(event) => handleAmazonOptions(event)}
                  placeholder={
                    marketplaceDefaultValue &&
                    marketplaceDefaultValue[0] &&
                    marketplaceDefaultValue[0].label
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
        </ViewData>
      </WhiteCard>
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

  console.log('pieData', pieData);
  const renderInventoryScorePanel = () => {
    return (
      <div className="col-md-4 col-sm-12 mb-3">
        <WhiteCard className="fix-height ">
          <p className="black-heading-title mt-0 mb-4">Inventory Score (IPI)</p>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx={72}
                cy={100}
                startAngle={170}
                marginBottom={40}
                endAngle={10}
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

  return (
    <>
      {renderMarketplaceDropDown()}
      <SalesPerformancePanel
        renderCustomDateSubLabel={renderCustomDateSubLabel}
        activeSales={activeSales}
        currencySymbol={currencySymbol}
        setActiveSales={setActiveSales}
        handleDailyFact={handleDailyFact}
        isApiCall={isApiCall}
        selectedValue={selectedValue}
        showCustomDateModal={showCustomDateModal}
        state={state}
        setShowCustomDateModal={setShowCustomDateModal}
        setState={setState}
        currentDate={currentDate}
        applyCustomDate={applyCustomDate}
        filters={filters}
        handleGroupBy={handleGroupBy}
        groupBy={groupBy}
        salesCurrentTotal={salesCurrentTotal}
        salesDifference={salesDifference}
        salesPreviousTotal={salesPreviousTotal}
        currency={currency}
        salesGraphLoader={salesGraphLoader}
        salesChartData={salesChartData}
        organicSale={organicSale}
        inorganicSale={inorganicSale}
      />
      <div className="row mt-3">
        {renderInventoryScorePanel()}
        {renderPositiveFeedbackPanel()}
        {renderOrderIssuesPanel()}
      </div>
      <BuyBoxPercentPanel
        bBChartData={bBChartData}
        bBGraphLoader={bBGraphLoader}
        bBDailyFact={bBDailyFact}
        handleBBDailyFact={handleBBDailyFact}
        isApiCall={isApiCall}
        setShowBBCustomDateModal={setShowBBCustomDateModal}
        dspData={dspData}
        showBBCustomDateModal={showBBCustomDateModal}
        BBstate={BBstate}
        setBBState={setBBState}
        applyCustomDate={applyCustomDate}
        currentDate={currentDate}
        renderCustomDateSubLabel={renderCustomDateSubLabel}
      />
      {/* custom date modal for sale performance graph */}
      <CustomDateModal
        id="BT-performancereport-daterange-SPdate"
        isOpen={showCustomDateModal}
        ranges={state}
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
        onChange={(item) => {
          setState([item.selection]);
        }}
        onApply={() => applyCustomDate('SPDate')}
        currentDate={currentDate}
      />
    </>
  );
}

PerformanceReport.defaultProps = {
  marketplaceChoices: {},
  id: '',
  data: {},
};

PerformanceReport.propTypes = {
  marketplaceChoices: instanceOf(Object),
  id: string,
  data: shape({}),
};
const ViewData = styled.div`
  .view-data-for {
    margin-right: 60px;
    font-weight: normal;
    color: ${Theme.black};
    font-size: ${Theme.extraMedium};
    font-family: ${Theme.baseFontFamily};
    width: 100%;
  }

  @media only screen and (max-width: 767px) {
    .view-data-for {
      text-align: center;
      padding-bottom: 10px;
    }
  }
`;
