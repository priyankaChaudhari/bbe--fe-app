import React, { useEffect, useState, useCallback } from 'react';

import dayjs from 'dayjs';
import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line camelcase
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import { components } from 'react-select';
import { instanceOf, shape, string } from 'prop-types';

import VendorSalesPerformancePanel from './VendorSalesPerformancePanel';
import VendorSalesPerformanceFilters from './VendorSalesPerformanceFilters';
import { dateOptionsWithYear } from '../../../../constants';
import { getVendorReportingData } from '../../../../api';
import { CustomDateModal, DropDownIndicator } from '../../../../common';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const _ = require('lodash');
const getSymbolFromCurrency = require('currency-symbol-map');

am4core.useTheme(am4themes_dataviz);
export default function PerformanceReport({ marketplaceChoices, id }) {
  const { Option, SingleValue } = components;
  const [isSPCustomDateApply, setIsSPCustomDateApply] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [selectedVendorMetricsType, setSelectedVendorMetricsType] = useState({
    value: 'orderedRevenue',
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
    sub: 'vs Previous 7 days',
  });
  const [selectedAmazonValue, setSelectedAmazonValue] = useState(null);
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
  const [activeSales, setActiveSales] = useState({ orderedRevenue: true });

  const bindSalesResponseData = (response, selectedMetrics) => {
    const tempData = [];
    // filterout previous data in one temporary object.
    if (
      response.result &&
      response.result.previous &&
      response.result.previous.length
    ) {
      response.result.previous.forEach((item) => {
        const previousDate = dayjs(item.report_date).format('MMM D YYYY');
        if (selectedMetrics === 'orderedRevenue') {
          tempData.push({
            orderedRevenuePrevious: item.ordered_revenue,
            glanceViewsPrevious: item.glance_views,
            conversionRatePrevious: item.conversion_rate,
            orderedUnitsPrevious: item.ordered_units,
            previousDate,

            orderedRevenuePreviousLabel:
              item.ordered_revenue !== null
                ? item.ordered_revenue.toFixed(2)
                : '0.00',
            glanceViewsPreviousLabel:
              item.glance_views !== null ? item.glance_views.toFixed(0) : '0',
            orderedUnitsPreviousLabel:
              item.ordered_units !== null ? item.ordered_units.toFixed(0) : '0',
            conversionRatePreviousLabel:
              item.conversion_rate !== null
                ? item.conversion_rate.toFixed(2)
                : '0',
          });
        } else {
          tempData.push({
            shippedCOGsPrevious: item.shipped_cogs,
            glanceViewsPrevious: item.glance_views,
            conversionRatePrevious: item.conversion_rate,
            shippedUnitsPrevious: item.shipped_units,
            previousDate,

            shippedCOGsPreviousLabel:
              item.shipped_cogs !== null
                ? item.shipped_cogs.toFixed(2)
                : '0.00',
            glanceViewsPreviousLabel:
              item.glance_views !== null ? item.glance_views.toFixed(0) : '0',
            shippedUnitsPreviousLabel:
              item.shipped_units !== null ? item.shipped_units.toFixed(0) : '0',
            conversionRatePreviousLabel:
              item.conversion_rate !== null
                ? item.conversion_rate.toFixed(2)
                : '0',
          });
        }
      });
    }

    // filterout current data in one temporary object.
    if (
      response.result &&
      response.result.current &&
      response.result.current.length
    ) {
      response.result.current.forEach((item, index) => {
        const currentReportDate = dayjs(item.report_date).format('MMM D YYYY');
        // let indexNumber = index;
        // add the current data at same index of prevoius in temporary object
        if (
          response.result.previous &&
          index < response.result.previous.length
        ) {
          if (selectedMetrics === 'orderedRevenue') {
            tempData[index].date = currentReportDate;
            tempData[index].orderedRevenueCurrent = item.ordered_revenue;
            tempData[index].glanceViewsCurrent = item.glance_views;
            tempData[index].orderedUnitsCurrent = item.ordered_units;
            tempData[index].conversionRateCurrent = item.conversion_rate;

            tempData[index].orderedRevenueCurrentLabel =
              item.ordered_revenue !== null
                ? item.ordered_revenue.toFixed(2)
                : '0.00';
            tempData[index].glanceViewsCurrentLabel =
              item.glance_views !== null ? item.glance_views.toFixed(0) : '0';
            tempData[index].orderedUnitsCurrentLabel =
              item.ordered_units !== null ? item.ordered_units.toFixed(0) : '0';
            tempData[index].conversionRateCurrentLabel =
              item.conversion_rate !== null
                ? item.conversion_rate.toFixed(2)
                : '0';
          } else {
            tempData[index].date = currentReportDate;
            tempData[index].shippedCOGsCurrent = item.shipped_cogs;
            tempData[index].glanceViewsCurrent = item.glance_views;
            tempData[index].shippedUnitsCurrent = item.shipped_units;
            tempData[index].conversionRateCurrent = item.conversion_rate;

            tempData[index].shippedCOGsCurrentLabel =
              item.shipped_cogs !== null
                ? item.shipped_cogs.toFixed(2)
                : '0.00';
            tempData[index].glanceViewsCurrentLabel =
              item.glance_views !== null ? item.glance_views.toFixed(0) : '0';
            tempData[index].shippedUnitsCurrentLabel =
              item.shipped_units !== null ? item.shipped_units.toFixed(0) : '0';
            tempData[index].conversionRateCurrentLabel =
              item.conversion_rate !== null
                ? item.conversion_rate.toFixed(2)
                : '0';
          }
        } else if (selectedMetrics === 'orderedRevenue') {
          // if current data count is larger than previous count then
          // generate separate key for current data and defien previous value null and previous label 0

          tempData.push({
            orderedRevenueCurrent: item.ordered_revenue,
            glanceViewsCurrent: item.glance_views,
            orderedUnitsCurrent: item.ordered_units,
            conversionRateCurrent: item.conversion_rate,
            date: currentReportDate,

            orderedRevenuePrevious: null,
            glanceViewsPrevious: null,
            orderedUnitsPrevious: null,
            conversionRatePrevious: null,

            orderedRevenueCurrentLabel:
              item.ordered_revenue !== null
                ? item.ordered_revenue.toFixed(2)
                : '0.00',
            glanceViewsCurrentLabel:
              item.glance_views !== null ? item.glance_views.toFixed(0) : '0',
            orderedUnitsCurrentLabel:
              item.ordered_units !== null ? item.ordered_units.toFixed(0) : '0',
            conversionRateCurrentLabel:
              item.conversion_rate !== null
                ? item.conversion_rate.toFixed(2)
                : '0',

            orderedRevenuePreviousLabel: '0.00',
            glanceViewsPreviousLabel: '0',
            orderedUnitsPreviousLabel: '0',
            conversionRatePreviousLabel: '0',
          });
        } else {
          tempData.push({
            shippedCOGsCurrent: item.shipped_cogs,
            glanceViewsCurrent: item.glance_views,
            shippedUnitsCurrent: item.shipped_units,
            conversionRateCurrent: item.conversion_rate,
            date: currentReportDate,

            shippedCOGsPrevious: null,
            glanceViewsPrevious: null,
            shippedUnitsPrevious: null,
            conversionRatePrevious: null,

            shippedCOGsCurrentLabel:
              item.shipped_cogs !== null
                ? item.shipped_cogs.toFixed(2)
                : '0.00',
            glanceViewsCurrentLabel:
              item.glance_views !== null ? item.glance_views.toFixed(0) : '0',
            shippedUnitsCurrentLabel:
              item.shipped_units !== null ? item.shipped_units.toFixed(0) : '0',
            conversionRateCurrentLabel:
              item.conversion_rate !== null
                ? item.conversion_rate.toFixed(2)
                : '0',

            shippedCOGsPreviousLabel: '0.00',
            glanceViewsPreviousLabel: '0',
            shippedUnitsPreviousLabel: '0',
            conversionRatePreviousLabel: '0',
          });
        }
      });
    }

    // filterout the dsp current total, previous total, and diffrence
    if (response.result && response.result.current_sum) {
      setSalesCurrentTotal(response.result.current_sum);
    } else {
      setSalesCurrentTotal({});
    }
    if (response.result && response.result.previous_sum) {
      setSalesPreviousTotal(response.result.previous_sum);
    } else {
      setSalesPreviousTotal({});
    }
    if (response.result && response.result.difference_data) {
      setSalesDifference(response.result.difference_data);
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
      metricsType,
      startDate = null,
      endDate = null,
    ) => {
      setIsApiCall(true);
      setSalesGraphLoader(true);
      getVendorReportingData(
        id,
        selectedDailyFact,
        selectedGroupBy,
        marketplace,
        startDate,
        endDate,
        metricsType,
      ).then((res) => {
        if (res?.status === 400 || res.status === 500) {
          setIsApiCall(false);
          setSalesGraphLoader(false);
        }
        if (res?.status === 200) {
          if (res?.data?.result) {
            const salesGraphData = bindSalesResponseData(res.data, metricsType);
            setSalesChartData(salesGraphData);
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
      getData(
        selectedSalesDF.value,
        groupBy,
        marketplace[0].value,
        selectedVendorMetricsType.value,
      );

      setResponseId('12345');
    }
  }, [
    marketplaceChoices,
    getData,
    responseId,
    groupBy,
    selectedSalesDF,
    selectedAmazonValue,
    selectedVendorMetricsType,
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
    metricsType = selectedVendorMetricsType.value,
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
      getData(flag, temp, marketplace, metricsType, sd, ed);
    } else {
      // flag==='year
      getData(flag, temp, marketplace, metricsType);
    }
  };

  // set group by filter when selected option is, week, month or 60 days
  const setGropuByFilter = (value) => {
    switch (value) {
      case 'week':
        setFilters({ daily: true, weekly: false, month: false });
        setGroupBy('daily');
        getData(
          value,
          'daily',
          selectedAmazonValue,
          selectedVendorMetricsType.value,
        );
        break;

      case 'month':
        setFilters({ daily: true, weekly: true, month: false });
        setGroupBy('daily');
        getData(
          value,
          'daily',
          selectedAmazonValue,
          selectedVendorMetricsType.value,
        );
        break;

      case '30days':
        setFilters({ daily: true, weekly: true, month: false });
        setGroupBy('daily');
        getData(
          value,
          'daily',
          selectedAmazonValue,
          selectedVendorMetricsType.value,
        );
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
        {renderCustomDateSubLabel(props, 'sp')}
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

    if (value === 'orderedRevenue') {
      setActiveSales({ orderedRevenue: true });
      setSelectedVendorMetricsType({
        value: 'orderedRevenue',
        label: 'Ordered Revenue',
      });
    } else {
      setActiveSales({ shippedCOGs: true });
      setSelectedVendorMetricsType({
        value: 'shippedCOGS',
        label: 'Shipped COGS',
      });
    }

    if (selectedSalesDF.value === 'custom') {
      checkDifferenceBetweenDates(
        state[0].startDate,
        state[0].endDate,
        'custom',
        selectedAmazonValue,
        value,
      );
    } else {
      getData(selectedSalesDF.value, groupBy, selectedAmazonValue, value);
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
      getData(
        selectedSalesDF.value,
        groupBy,
        event.value,
        selectedVendorMetricsType.value,
      );
    }
  };

  const handleGroupBy = (value) => {
    if (value !== groupBy) {
      setGroupBy(value);
      getData(
        selectedSalesDF.value,
        value,
        selectedAmazonValue,
        selectedVendorMetricsType.value,
      );
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
        organicSale={null}
        inorganicSale={null}
        metricsType={selectedVendorMetricsType}
      />

      {/* custom date modal for sale performance graph */}
      <CustomDateModal
        id="BT-vendorPerformanceReport-daterange-SPdate"
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
  id: '',
  data: {},
  marketplaceChoices: {},
};

PerformanceReport.propTypes = {
  id: string,
  data: shape({}),
  marketplaceChoices: instanceOf(Object),
};
