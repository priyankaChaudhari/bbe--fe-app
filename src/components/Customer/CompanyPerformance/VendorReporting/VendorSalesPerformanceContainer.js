import React, { useEffect, useState, useCallback } from 'react';

import dayjs from 'dayjs';

import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line camelcase
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import { components } from 'react-select';
import { func, instanceOf, shape, string } from 'prop-types';

import VendorSalesPerformancePanel from './VendorSalesPerformancePanel';
import VendorSalesPerformanceFilters from './VendorSalesPerformanceFilters';

import { dateOptionsWithYear } from '../../../../constants';
import { getPerformance } from '../../../../api';
import { CustomDateModal, DropDownIndicator } from '../../../../common';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

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
  const [isSPCustomDateApply, setIsSPCustomDateApply] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [selectedVendorMetricsType, setSelectedVendorMetricsType] = useState({
    value: 'OrderedRevenue',
    label: 'Ordered Revenue',
  });
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
  const [salesChartData, setSalesChartData] = useState([]);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [groupBy, setGroupBy] = useState('daily');
  const [amazonOptions, setAmazonOptions] = useState([]);
  const [selectedSalesDF, setSelectedValue] = useState({
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
      getData(selectedSalesDF.value, groupBy, marketplace[0].value);

      setResponseId('12345');
    }
  }, [
    marketplaceChoices,
    getData,
    responseId,
    groupBy,
    selectedSalesDF,
    selectedAmazonValue,
  ]);

  const renderCustomDateSubLabel = (props, flag) => {
    if (flag === 'sp') {
      if (selectedSalesDF.value === 'custom' && isSPCustomDateApply) {
        return `From- ${dayjs(state[0].startDate).format(
          'MMM D, YYYY',
        )}  To- ${dayjs(state[0].endDate).format('MMM D, YYYY')}`;
      }
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
    if (diffDays <= 7) {
      temp = 'daily';
      setFilters({ daily: true, weekly: false, month: false });
      setGroupBy('daily');
    } else if (diffDays <= 30) {
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

  const singleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>
        {renderCustomDateSubLabel(props)}
      </div>
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

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropDownIndicator,
    };
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

  const handleMetricsType = (event) => {
    const { value } = event;
    setSelectedVendorMetricsType(event);

    if (selectedVendorMetricsType.value === 'custom') {
      checkDifferenceBetweenDates(
        state[0].startDate,
        state[0].endDate,
        'custom',
        selectedAmazonValue.value,
        value,
      );
    } else {
      getData(
        selectedSalesDF.value,
        selectedVendorMetricsType.value,
        groupBy,
        selectedAmazonValue,
      );
    }
  };

  const handleAmazonOptions = (event) => {
    setSelectedAmazonValue(event.value);
    setCurrency(event.currency);
    setCurrencySymbol(getSymbolFromCurrency(event.currency));
    if (selectedSalesDF.value === 'custom') {
      checkDifferenceBetweenDates(
        state[0].startDate,
        state[0].endDate,
        'custom',
        event.value,
      );
    } else {
      getData(selectedSalesDF.value, groupBy, event.value);
    }
  };

  // const handleMarketplaceOptions = (event) => {
  //   setSelectedMarketplace(event.value);
  //   setCurrency(event.currency);
  //   setCurrencySymbol(getSymbolFromCurrency(event.currency));
  //   getDSPPacing(event.value);
  //   if (selectedAdDF.value === 'custom') {
  //     ADYearAndCustomDateFilter(
  //       adState[0].startDate,
  //       adState[0].endDate,
  //       'custom',
  //       event.value,
  //       selectedAdType.value,
  //     );

  //     DSPYearAndCustomDateFilter(
  //       adState[0].startDate,
  //       adState[0].endDate,
  //       'custom',
  //       event.value,
  //     );
  //   } else {
  //     getAdData(
  //       selectedAdType.value,
  //       selectedAdDF.value,
  //       adGroupBy,
  //       event.value,
  //     );
  //     getDSPData(selectedAdDF.value, dspGroupBy, event.value);
  //   }
  // };

  const handleGroupBy = (value) => {
    if (value !== groupBy) {
      setGroupBy(value);
      getData(selectedSalesDF.value, value, selectedAmazonValue);
    }
  };

  const applyCustomDate = () => {
    checkDifferenceBetweenDates(state[0].startDate, state[0].endDate, 'custom');
    setShowCustomDateModal(false);
    setIsSPCustomDateApply(true);
  };

  return (
    <>
      <VendorSalesPerformanceFilters
        viewComponent={viewComponent}
        setViewComponent={setViewComponent}
        marketplaceDefaultValue={marketplaceDefaultValue}
        marketplaceOptions={amazonOptions}
        handleMarketplaceOptions={handleAmazonOptions}
        dateOptions={dateOptionsWithYear}
        getSelectComponents={getSelectComponents}
        DropDownIndicator={DropDownIndicator}
        selectedSalesDF={selectedSalesDF}
        handleDailyFact={handleDailyFact}
        isApiCall={isApiCall}
      />

      <VendorSalesPerformancePanel
        renderCustomDateSubLabel={renderCustomDateSubLabel}
        activeSales={activeSales}
        currencySymbol={currencySymbol}
        setActiveSales={setActiveSales}
        handleMetricsType={handleMetricsType}
        isApiCall={isApiCall}
        selectedValue={selectedSalesDF}
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
        metricsType={selectedVendorMetricsType}
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
        onApply={() => applyCustomDate()}
        currentDate={currentDate}
      />
    </>
  );
}

PerformanceReport.defaultProps = {
  marketplaceChoices: {},
  id: '',
  viewComponent: '',
  data: {},
  setViewComponent: () => {},
};

PerformanceReport.propTypes = {
  marketplaceChoices: instanceOf(Object),
  id: string,
  viewComponent: string,
  data: shape({}),
  setViewComponent: func,
};
