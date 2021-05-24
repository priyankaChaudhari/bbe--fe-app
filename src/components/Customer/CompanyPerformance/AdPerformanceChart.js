/* eslint-disable camelcase */
import React, { useEffect, useRef } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import PropTypes from 'prop-types';

am4core.useTheme(am4themes_dataviz);
// am4core.useTheme(am4themes_animated);
am4core.color('red');
const _ = require('lodash');

export default function AdPerformanceChart({
  chartId,
  chartData,
  currencySymbol,
  selectedBox,
}) {
  const chart = useRef(null);
  // const adGraphData = [
  //   {
  //     date: new Date(2019, 5, 12),
  //     adSalesCurrent: 5000,
  //     adSalesPrevious: 4800,
  //     adSpendCurrent: 4000,
  //     adSpendPrevious: 3000,
  //     adConversionCurrent: 50,
  //     adConversionPrevious: 25,
  //     impressionsCurrent: 9000,
  //     impressionsPrevious: 1200,
  //     adCosCurrent: 4500,
  //     adCosPrevious: 7000,
  //     adRoasCurrent: 2100,
  //     adRoasPrevious: 3400,
  //     adClicksCurrent: 7300,
  //     adClicksPrevious: 4000,
  //     adClickRateCurrent: 60,
  //     adClickRatePrevious: 45,
  //     previousDate: new Date(2019, 5, 5),
  //   },
  //   {
  //     date: new Date(2019, 5, 13),
  //     adSalesCurrent: 1100,
  //     adSalesPrevious: 800,
  //     adSpendCurrent: 4700,
  //     adSpendPrevious: 3900,
  //     adConversionCurrent: 70,
  //     adConversionPrevious: 55,
  //     impressionsCurrent: 6000,
  //     impressionsPrevious: 8200,
  //     adCosCurrent: 4600,
  //     adCosPrevious: 7000,
  //     adRoasCurrent: 9800,
  //     adRoasPrevious: 7200,
  //     adClicksCurrent: 1200,
  //     adClicksPrevious: 3000,
  //     adClickRateCurrent: 90,
  //     adClickRatePrevious: 42,
  //     previousDate: new Date(2019, 5, 6),
  //   },
  //   {
  //     date: new Date(2019, 5, 14),
  //     adSalesCurrent: 500,
  //     adSalesPrevious: 4810,
  //     adSpendCurrent: 4801,
  //     adSpendPrevious: 3011,
  //     adConversionCurrent: 50,
  //     adConversionPrevious: 25,
  //     impressionsCurrent: 9000,
  //     impressionsPrevious: 1200,
  //     adCosCurrent: 4700,
  //     adCosPrevious: 2000,
  //     adRoasCurrent: 6100,
  //     adRoasPrevious: 6000,
  //     adClicksCurrent: 1200,
  //     adClicksPrevious: 4430,
  //     adClickRateCurrent: 34,
  //     adClickRatePrevious: 60,
  //     previousDate: new Date(2019, 5, 7),
  //   },
  //   {
  //     date: new Date(2019, 5, 15),
  //     adSalesCurrent: 7300,
  //     adSalesPrevious: 1200,
  //     adSpendCurrent: 8760,
  //     adSpendPrevious: 4500,
  //     adConversionCurrent: 67,
  //     adConversionPrevious: 28,
  //     impressionsCurrent: 7000,
  //     impressionsPrevious: 4500,
  //     adCosCurrent: 8120,
  //     adCosPrevious: 4800,
  //     adRoasCurrent: 9300,
  //     adRoasPrevious: 7300,
  //     adClicksCurrent: 6200,
  //     adClicksPrevious: 1000,
  //     adClickRateCurrent: 10,
  //     adClickRatePrevious: 95,
  //     previousDate: new Date(2019, 5, 8),
  //   },
  //   {
  //     date: new Date(2019, 5, 16),
  //     adSalesCurrent: 1100,
  //     adSalesPrevious: 8300,
  //     adSpendCurrent: 2600,
  //     adSpendPrevious: 9200,
  //     adConversionCurrent: 30,
  //     adConversionPrevious: 65,
  //     impressionsCurrent: 2600,
  //     impressionsPrevious: 5700,
  //     adCosCurrent: 9100,
  //     adCosPrevious: 2700,
  //     adRoasCurrent: 6600,
  //     adRoasPrevious: 4400,
  //     adClicksCurrent: 8700,
  //     adClicksPrevious: 7200,
  //     adClickRateCurrent: 40,
  //     adClickRatePrevious: 25,
  //     previousDate: new Date(2019, 5, 9),
  //   },
  //   {
  //     date: new Date(2019, 5, 17),
  //     adSalesCurrent: 1000,
  //     adSalesPrevious: 1800,
  //     adSpendCurrent: 8000,
  //     adSpendPrevious: 1000,
  //     adConversionCurrent: 30,
  //     adConversionPrevious: 95,
  //     impressionsCurrent: 3000,
  //     impressionsPrevious: 6200,
  //     adCosCurrent: 4700,
  //     adCosPrevious: 3000,
  //     adRoasCurrent: 8100,
  //     adRoasPrevious: 1400,
  //     adClicksCurrent: 6300,
  //     adClicksPrevious: 9000,
  //     adClickRateCurrent: 10,
  //     adClickRatePrevious: 35,
  //     previousDate: new Date(2019, 5, 5),
  //   },
  // {
  //   date: new Date(2019, 5, 18),
  //   adSalesCurrent: 2100,
  //   adSalesPrevious: 700,
  //   adSpendCurrent: 2700,
  //   adSpendPrevious: 8900,
  //   adConversionCurrent: 20,
  //   adConversionPrevious: 15,
  //   impressionsCurrent: 7000,
  //   impressionsPrevious: 8200,
  //   adCosCurrent: 8600,
  //   adCosPrevious: 2000,
  //   adRoasCurrent: 7800,
  //   adRoasPrevious: 8200,
  //   adClicksCurrent: 2200,
  //   adClicksPrevious: 8000,
  //   adClickRateCurrent: 30,
  //   adClickRatePrevious: 62,
  //   previousDate: new Date(2019, 5, 6),
  // },
  // {
  //   date: new Date(2019, 5, 19),
  //   adSalesCurrent: 300,
  //   adSalesPrevious: 7810,
  //   adSpendCurrent: 3801,
  //   adSpendPrevious: 9011,
  //   adConversionCurrent: 20,
  //   adConversionPrevious: 75,
  //   impressionsCurrent: 5000,
  //   impressionsPrevious: 7200,
  //   adCosCurrent: 9700,
  //   adCosPrevious: 5400,
  //   adRoasCurrent: 9100,
  //   adRoasPrevious: 8000,
  //   adClicksCurrent: 1200,
  //   adClicksPrevious: 5430,
  //   adClickRateCurrent: 14,
  //   adClickRatePrevious: 90,
  //   previousDate: new Date(2019, 5, 7),
  // },
  // {
  //   date: new Date(2019, 5, 20),
  //   adSalesCurrent: 1300,
  //   adSalesPrevious: 3200,
  //   adSpendCurrent: 2060,
  //   adSpendPrevious: 8500,
  //   adConversionCurrent: 17,
  //   adConversionPrevious: 58,
  //   impressionsCurrent: 9000,
  //   impressionsPrevious: 1500,
  //   adCosCurrent: 4120,
  //   adCosPrevious: 1800,
  //   adRoasCurrent: 2300,
  //   adRoasPrevious: 5300,
  //   adClicksCurrent: 1200,
  //   adClicksPrevious: 9000,
  //   adClickRateCurrent: 10,
  //   adClickRatePrevious: 95,
  //   previousDate: new Date(2019, 5, 8),
  // },
  // {
  //   date: new Date(2019, 5, 21),
  //   adSalesCurrent: 5100,
  //   adSalesPrevious: 2300,
  //   adSpendCurrent: 4600,
  //   adSpendPrevious: 1200,
  //   adConversionCurrent: 60,
  //   adConversionPrevious: 15,
  //   impressionsCurrent: 8600,
  //   impressionsPrevious: 1700,
  //   adCosCurrent: 2100,
  //   adCosPrevious: 6700,
  //   adRoasCurrent: 1600,
  //   adRoasPrevious: 8400,
  //   adClicksCurrent: 1700,
  //   adClicksPrevious: 9200,
  //   adClickRateCurrent: 20,
  //   adClickRatePrevious: 45,
  //   previousDate: new Date(2019, 5, 9),
  // },
  // {
  //   date: new Date(2019, 5, 22),
  //   adSalesCurrent: 1000,
  //   adSalesPrevious: 2800,
  //   adSpendCurrent: 8000,
  //   adSpendPrevious: 3000,
  //   adConversionCurrent: 20,
  //   adConversionPrevious: 85,
  //   impressionsCurrent: 5000,
  //   impressionsPrevious: 5200,
  //   adCosCurrent: 9500,
  //   adCosPrevious: 2000,
  //   adRoasCurrent: 5100,
  //   adRoasPrevious: 1400,
  //   adClicksCurrent: 8300,
  //   adClicksPrevious: 1000,
  //   adClickRateCurrent: 10,
  //   adClickRatePrevious: 35,
  //   previousDate: new Date(2019, 5, 5),
  // },
  // {
  //   date: new Date(2019, 5, 23),
  //   adSalesCurrent: 1800,
  //   adSalesPrevious: 400,
  //   adSpendCurrent: 7700,
  //   adSpendPrevious: 1900,
  //   adConversionCurrent: 10,
  //   adConversionPrevious: 95,
  //   impressionsCurrent: 3000,
  //   impressionsPrevious: 9200,
  //   adCosCurrent: 2600,
  //   adCosPrevious: 9000,
  //   adRoasCurrent: 2800,
  //   adRoasPrevious: 4200,
  //   adClicksCurrent: 5200,
  //   adClicksPrevious: 7000,
  //   adClickRateCurrent: 70,
  //   adClickRatePrevious: 42,
  //   previousDate: new Date(2019, 5, 6),
  // },
  // {
  //   date: new Date(2019, 5, 24),
  //   adSalesCurrent: 500,
  //   adSalesPrevious: 4810,
  //   adSpendCurrent: 4801,
  //   adSpendPrevious: 3011,
  //   adConversionCurrent: 50,
  //   adConversionPrevious: 25,
  //   impressionsCurrent: 9000,
  //   impressionsPrevious: 1200,
  //   adCosCurrent: 4700,
  //   adCosPrevious: 2000,
  //   adRoasCurrent: 6100,
  //   adRoasPrevious: 6000,
  //   adClicksCurrent: 1200,
  //   adClicksPrevious: 4430,
  //   adClickRateCurrent: 34,
  //   adClickRatePrevious: 60,
  //   previousDate: new Date(2019, 5, 7),
  // },
  // {
  //   date: new Date(2019, 5, 25),
  //   adSalesCurrent: 7300,
  //   adSalesPrevious: 1200,
  //   adSpendCurrent: 8760,
  //   adSpendPrevious: 4500,
  //   adConversionCurrent: 67,
  //   adConversionPrevious: 28,
  //   impressionsCurrent: 7000,
  //   impressionsPrevious: 4500,
  //   adCosCurrent: 8120,
  //   adCosPrevious: 4800,
  //   adRoasCurrent: 9300,
  //   adRoasPrevious: 7300,
  //   adClicksCurrent: 6200,
  //   adClicksPrevious: 1000,
  //   adClickRateCurrent: 10,
  //   adClickRatePrevious: 95,
  //   previousDate: new Date(2019, 5, 8),
  // },
  // {
  //   date: new Date(2019, 5, 26),
  //   adSalesCurrent: 1100,
  //   adSalesPrevious: 8300,
  //   adSpendCurrent: 2600,
  //   adSpendPrevious: 9200,
  //   adConversionCurrent: 30,
  //   adConversionPrevious: 65,
  //   impressionsCurrent: 2600,
  //   impressionsPrevious: 5700,
  //   adCosCurrent: 9100,
  //   adCosPrevious: 2700,
  //   adRoasCurrent: 6600,
  //   adRoasPrevious: 4400,
  //   adClicksCurrent: 8700,
  //   adClicksPrevious: 7200,
  //   adClickRateCurrent: 40,
  //   adClickRatePrevious: 25,
  //   previousDate: new Date(2019, 5, 9),
  // },
  // {
  //   date: new Date(2019, 5, 27),
  //   adSalesCurrent: 5000,
  //   adSalesPrevious: 4800,
  //   adSpendCurrent: 4000,
  //   adSpendPrevious: 3000,
  //   adConversionCurrent: 50,
  //   adConversionPrevious: 25,
  //   impressionsCurrent: 9000,
  //   impressionsPrevious: 1200,
  //   adCosCurrent: 4500,
  //   adCosPrevious: 7000,
  //   adRoasCurrent: 2100,
  //   adRoasPrevious: 3400,
  //   adClicksCurrent: 7300,
  //   adClicksPrevious: 4000,
  //   adClickRateCurrent: 60,
  //   adClickRatePrevious: 45,
  //   previousDate: new Date(2019, 5, 5),
  // },
  // {
  //   date: new Date(2019, 5, 28),
  //   adSalesCurrent: 1100,
  //   adSalesPrevious: 800,
  //   adSpendCurrent: 4700,
  //   adSpendPrevious: 3900,
  //   adConversionCurrent: 70,
  //   adConversionPrevious: 55,
  //   impressionsCurrent: 6000,
  //   impressionsPrevious: 8200,
  //   adCosCurrent: 4600,
  //   adCosPrevious: 7000,
  //   adRoasCurrent: 9800,
  //   adRoasPrevious: 7200,
  //   adClicksCurrent: 1200,
  //   adClicksPrevious: 3000,
  //   adClickRateCurrent: 90,
  //   adClickRatePrevious: 42,
  //   previousDate: new Date(2019, 5, 6),
  // },
  // {
  //   date: new Date(2019, 5, 29),
  //   adSalesCurrent: 500,
  //   adSalesPrevious: 4810,
  //   adSpendCurrent: 4801,
  //   adSpendPrevious: 3011,
  //   adConversionCurrent: 50,
  //   adConversionPrevious: 25,
  //   impressionsCurrent: 9000,
  //   impressionsPrevious: 1200,
  //   adCosCurrent: 4700,
  //   adCosPrevious: 2000,
  //   adRoasCurrent: 6100,
  //   adRoasPrevious: 6000,
  //   adClicksCurrent: 1200,
  //   adClicksPrevious: 4430,
  //   adClickRateCurrent: 34,
  //   adClickRatePrevious: 60,
  //   previousDate: new Date(2019, 5, 7),
  // },
  // {
  //   date: new Date(2019, 5, 30),
  //   adSalesCurrent: 7300,
  //   adSalesPrevious: 1200,
  //   adSpendCurrent: 8760,
  //   adSpendPrevious: 4500,
  //   adConversionCurrent: 67,
  //   adConversionPrevious: 28,
  //   impressionsCurrent: 7000,
  //   impressionsPrevious: 4500,
  //   adCosCurrent: 8120,
  //   adCosPrevious: 4800,
  //   adRoasCurrent: 9300,
  //   adRoasPrevious: 7300,
  //   adClicksCurrent: 6200,
  //   adClicksPrevious: 1000,
  //   adClickRateCurrent: 10,
  //   adClickRatePrevious: 95,
  //   previousDate: new Date(2019, 5, 8),
  // },
  // {
  //   date: new Date(2019, 5, 31),
  //   adSalesCurrent: 1100,
  //   adSalesPrevious: 8300,
  //   adSpendCurrent: 2600,
  //   adSpendPrevious: 9200,
  //   adConversionCurrent: 30,
  //   adConversionPrevious: 65,
  //   impressionsCurrent: 2600,
  //   impressionsPrevious: 5700,
  //   adCosCurrent: 9100,
  //   adCosPrevious: 2700,
  //   adRoasCurrent: 6600,
  //   adRoasPrevious: 4400,
  //   adClicksCurrent: 8700,
  //   adClicksPrevious: 7200,
  //   adClickRateCurrent: 40,
  //   adClickRatePrevious: 25,
  //   previousDate: new Date(2019, 5, 9),
  // },
  // ];

  useEffect(() => {
    // const adGraphData = [
    //   {
    //     date: new Date(2019, 5, 12),
    //     adSalesCurrent: 5000,
    //     adSalesPrevious: 4800,
    //     adSpendCurrent: 4000,
    //     adSpendPrevious: 3000,
    //     adConversionCurrent: 50,
    //     adConversionPrevious: 25,
    //     impressionsCurrent: 9000,
    //     impressionsPrevious: 1200,
    //     adCosCurrent: 4500,
    //     adCosPrevious: 7000,
    //     adRoasCurrent: 2100,
    //     adRoasPrevious: 3400,
    //     adClicksCurrent: 7300,
    //     adClicksPrevious: 4000,
    //     adClickRateCurrent: 60,
    //     adClickRatePrevious: 45,
    //     previousDate: new Date(2019, 5, 5),
    //   },
    //   {
    //     date: new Date(2019, 5, 13),
    //     adSalesCurrent: 1100,
    //     adSalesPrevious: 800,
    //     adSpendCurrent: 4700,
    //     adSpendPrevious: 3900,
    //     adConversionCurrent: 70,
    //     adConversionPrevious: 55,
    //     impressionsCurrent: 6000,
    //     impressionsPrevious: 8200,
    //     adCosCurrent: 4600,
    //     adCosPrevious: 7000,
    //     adRoasCurrent: 9800,
    //     adRoasPrevious: 7200,
    //     adClicksCurrent: 1200,
    //     adClicksPrevious: 3000,
    //     adClickRateCurrent: 90,
    //     adClickRatePrevious: 42,
    //     previousDate: new Date(2019, 5, 6),
    //   },
    //   {
    //     date: new Date(2019, 5, 14),
    //     adSalesCurrent: 500,
    //     adSalesPrevious: 4810,
    //     adSpendCurrent: 4801,
    //     adSpendPrevious: 3011,
    //     adConversionCurrent: 50,
    //     adConversionPrevious: 25,
    //     impressionsCurrent: 9000,
    //     impressionsPrevious: 1200,
    //     adCosCurrent: 4700,
    //     adCosPrevious: 2000,
    //     adRoasCurrent: 6100,
    //     adRoasPrevious: 6000,
    //     adClicksCurrent: 1200,
    //     adClicksPrevious: 4430,
    //     adClickRateCurrent: 34,
    //     adClickRatePrevious: 60,
    //     previousDate: new Date(2019, 5, 7),
    //   },
    //   {
    //     date: new Date(2019, 5, 15),
    //     adSalesCurrent: 7300,
    //     adSalesPrevious: 1200,
    //     adSpendCurrent: 8760,
    //     adSpendPrevious: 4500,
    //     adConversionCurrent: 67,
    //     adConversionPrevious: 28,
    //     impressionsCurrent: 7000,
    //     impressionsPrevious: 4500,
    //     adCosCurrent: 8120,
    //     adCosPrevious: 4800,
    //     adRoasCurrent: 9300,
    //     adRoasPrevious: 7300,
    //     adClicksCurrent: 6200,
    //     adClicksPrevious: 1000,
    //     adClickRateCurrent: 10,
    //     adClickRatePrevious: 95,
    //     previousDate: new Date(2019, 5, 8),
    //   },
    //   {
    //     date: new Date(2019, 5, 16),
    //     adSalesCurrent: 1100,
    //     adSalesPrevious: 8300,
    //     adSpendCurrent: 2600,
    //     adSpendPrevious: 9200,
    //     adConversionCurrent: 30,
    //     adConversionPrevious: 65,
    //     impressionsCurrent: 2600,
    //     impressionsPrevious: 5700,
    //     adCosCurrent: 9100,
    //     adCosPrevious: 2700,
    //     adRoasCurrent: 6600,
    //     adRoasPrevious: 4400,
    //     adClicksCurrent: 8700,
    //     adClicksPrevious: 7200,
    //     adClickRateCurrent: 40,
    //     adClickRatePrevious: 25,
    //     previousDate: new Date(2019, 5, 9),
    //   },
    //   {
    //     date: new Date(2019, 5, 17),
    //     adSalesCurrent: 1000,
    //     adSalesPrevious: 1800,
    //     adSpendCurrent: 8000,
    //     adSpendPrevious: 1000,
    //     adConversionCurrent: 30,
    //     adConversionPrevious: 95,
    //     impressionsCurrent: 3000,
    //     impressionsPrevious: 6200,
    //     adCosCurrent: 4700,
    //     adCosPrevious: 3000,
    //     adRoasCurrent: 8100,
    //     adRoasPrevious: 1400,
    //     adClicksCurrent: 6300,
    //     adClicksPrevious: 9000,
    //     adClickRateCurrent: 10,
    //     adClickRatePrevious: 35,
    //     previousDate: new Date(2019, 5, 5),
    //   },
    //   {
    //     date: new Date(2019, 5, 18),
    //     adSalesCurrent: 2100,
    //     adSalesPrevious: 700,
    //     adSpendCurrent: 2700,
    //     adSpendPrevious: 8900,
    //     adConversionCurrent: 20,
    //     adConversionPrevious: 15,
    //     impressionsCurrent: 7000,
    //     impressionsPrevious: 8200,
    //     adCosCurrent: 8600,
    //     adCosPrevious: 2000,
    //     adRoasCurrent: 7800,
    //     adRoasPrevious: 8200,
    //     adClicksCurrent: 2200,
    //     adClicksPrevious: 8000,
    //     adClickRateCurrent: 30,
    //     adClickRatePrevious: 62,
    //     previousDate: new Date(2019, 5, 6),
    //   },
    // ];
    const colorSet = {
      adSales: '#0045B4',
      adSpend: '#8C54FF',
      adConversion: '#30A8BD',
      impressions: '#D6A307',
      adCos: '#E05D37',
      adRoas: '#89A43C',
      adClicks: '#C84EC6',
      adClickRate: '#A04848',
    };

    const tooltipNames = {
      adSales: 'AD SALES',
      adSpend: 'AD SPEND',
      adConversion: 'AD CONVERSION RATE',
      impressions: 'IMPRESSIONS',
      adCos: 'ACOS',
      adRoas: 'ROAS',
      adClicks: 'CLICKS',
      adClickRate: 'CLICK THROUGH RATE',
    };

    let firstAxis = null;
    let secondAxis = null;

    chart.current = am4core.create(chartId, am4charts.XYChart);
    // chart.current.data = adGraphData; // bind th data
    chart.current.data = chartData;
    chart.current.paddingRight = 20;
    chart.current.logo.disabled = true; // disable amchart logo
    // render X axis
    const dateAxis = chart.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dy = 10;
    dateAxis.cursorTooltipEnabled = false;

    // render y axis
    const valueAxis = chart.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    // series.yAxis = valueAxis;
    valueAxis.numberFormatter.bigNumberPrefixes = [
      { number: 1e3, suffix: 'K' },
      { number: 1e6, suffix: 'M' },
      { number: 1e9, suffix: 'B' },
    ];
    valueAxis.numberFormatter.smallNumberPrefixes = [];
    valueAxis.min = 0;
    valueAxis.numberFormatter.numberFormat = `#.#a`;

    // Add cursor
    chart.current.cursor = new am4charts.XYCursor();
    chart.current.cursor.lineY.disabled = true;
    chart.current.cursor.lineX.disabled = true;
    chart.current.cursor.behavior = 'none';

    function renderTooltip(name, color, value, currency, percent, formatter) {
      const tooltipText = ` <ul style="padding:0; margin: 0 0 4px 0; max-width: 240px;">
      <li style="display: inline-block;">
        {' '}
        <div style="background-color: ${color};
        border: 1px solid white;
        border-radius: 100%;
        width: 10px;
        height: 10px;" />
      </li>
      <li style="display: inline-block;">
        <div style="color: #f4f6fc;
        text-transform: uppercase;
        font-size: 11px;
        padding-left: 5px;">${name} </div>
      </li>
      <li style="display: inline-block; float: right; margin-left: 25px;">
        <div style=" color: white;
        font-size: 16px; text-align: right;
       
        ">${currency !== null ? currency : ''}${
        formatter !== null
          ? `{${value}.formatNumber('${formatter}')}`
          : `{${value}}`
      }${percent !== null ? percent : ''}
      </div>
      </li>
    </ul>
  
    `;

      return tooltipText;
    }

    // when only one metrics selected
    if (_.size(selectedBox) === 1) {
      const selectedKey = _.keys(selectedBox)[0];
      const previousValue = `${_.keys(selectedBox)[0]}Previous`;
      const currentValue = `${_.keys(selectedBox)[0]}Current`;
      const currentLabel = `${_.keys(selectedBox)[0]}CurrentLabel`;
      const previousLabel = `${_.keys(selectedBox)[0]}PreviousLabel`;
      const dashLine = `${_.keys(selectedBox)[0]}DashLength`;
      let tooltipCurrent = ``;
      let tooltipPrevious = '';

      if (
        selectedKey === 'adSales' ||
        selectedKey === 'adSpend' ||
        selectedKey === 'adCos' ||
        selectedKey === 'adRoas'
      ) {
        if (selectedKey === 'adRoas') {
          valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.####`;
        } else {
          valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
        }
        // valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
        tooltipCurrent = renderTooltip(
          'Recent',
          '#FF5933',
          currentLabel,
          currencySymbol,
          null,
          null,
        );
        tooltipPrevious = renderTooltip(
          'Previous',
          '#BFC5D2',
          previousLabel,
          currencySymbol,
          null,
          null,
        );
      } else if (
        selectedKey === 'adConversion' ||
        selectedKey === 'adClickRate'
      ) {
        valueAxis.numberFormatter.numberFormat = `#.#'%'`;
        tooltipCurrent = renderTooltip(
          'Recent',
          '#FF5933',
          currentLabel,
          null,
          '%',
          null,
        );
        tooltipPrevious = renderTooltip(
          'Previous',
          '#BFC5D2',
          previousLabel,
          null,
          '%',
          null,
        );
      } else if (selectedKey === 'impressions') {
        valueAxis.numberFormatter.numberFormat = `#.#a`;
        tooltipCurrent = renderTooltip(
          'Recent',
          '#FF5933',
          currentLabel,
          null,
          null,
          '#.#a',
        );
        tooltipPrevious = renderTooltip(
          'Previous',
          '#BFC5D2',
          previousLabel,
          null,
          null,
          '#.#a',
        );
      } else {
        valueAxis.numberFormatter.numberFormat = `#.##a`;
        tooltipCurrent = renderTooltip(
          'Recent',
          '#FF5933',
          currentLabel,
          null,
          null,
          null,
        );
        tooltipPrevious = renderTooltip(
          'Previous',
          '#BFC5D2',
          previousLabel,
          null,
          null,
          null,
        );
      }

      // Create series for previous data
      const series = chart.current.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = previousValue;
      series.name = previousValue;
      series.dataFields.dateX = 'date';
      series.strokeWidth = 2;
      series.stroke = am4core.color('#BFC5D2');
      series.tooltipHTML = `${tooltipCurrent} ${tooltipPrevious}`;
      series.fill = am4core.color('#2e384d');

      series.propertyFields.strokeDasharray = dashLine;

      // add bullet for
      const circleBullet2 = series.bullets.push(new am4charts.CircleBullet());
      circleBullet2.circle.fill = am4core.color('#BFC5D2');
      circleBullet2.circle.strokeWidth = 1;
      circleBullet2.circle.radius = 3;

      // circleBullet2.fillOpacity = 0;
      // circleBullet2.strokeOpacity = 0;
      // var bulletState = circleBullet2.states.create('hover');
      // bulletState.properties.fillOpacity = 1;
      // bulletState.properties.strokeOpacity = 1;

      // series for current data
      const series2 = chart.current.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = currentValue;
      series2.dataFields.dateX = 'date';
      series2.name = currentValue;
      series2.strokeWidth = 2;
      series2.tooltipHTML = `${tooltipCurrent} ${tooltipPrevious}`;
      series2.stroke = am4core.color('#FF5933');
      series2.fill = am4core.color('#2e384d');

      const circleBullet = series2.bullets.push(new am4charts.CircleBullet());
      circleBullet.circle.fill = am4core.color('#FF5933');
      circleBullet.circle.strokeWidth = 1;
      circleBullet.circle.radius = 3;
      // circleBullet.fillOpacity = 0;
      // circleBullet.strokeOpacity = 0;
      // var bulletState2 = circleBullet.states.create('hover');
      // bulletState2.properties.fillOpacity = 1;
      // bulletState2.properties.strokeOpacity = 1;

      chart.current.cursor.snapToSeries = [series, series2];
    } else {
      // else part- for multiple metrics selected

      const valueAxis2 = chart.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.renderer.grid.template.disabled = true;
      valueAxis2.cursorTooltipEnabled = false;
      valueAxis2.numberFormatter = new am4core.NumberFormatter();
      valueAxis2.numberFormatter.numberFormat = `#.#a`;
      valueAxis2.numberFormatter.bigNumberPrefixes = [
        { number: 1e3, suffix: 'K' },
        { number: 1e6, suffix: 'M' },
        { number: 1e9, suffix: 'B' },
      ];
      valueAxis2.numberFormatter.smallNumberPrefixes = [];

      const valueAxis3 = chart.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis3.renderer.grid.template.disabled = true;
      valueAxis3.cursorTooltipEnabled = false;
      valueAxis3.numberFormatter = new am4core.NumberFormatter();
      valueAxis3.numberFormatter.numberFormat = `#.#a`;

      const snapToSeries = [];
      let tooltipValue = '';

      // loop for genearate tooltip
      _.keys(selectedBox).map((item) => {
        const value = `${item}Current`;
        if (
          item === 'adSales' ||
          item === 'adSpend' ||
          item === 'adCos' ||
          item === 'adRoas'
        ) {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            tooltipNames[item],
            colorSet[item],
            value,
            currencySymbol,
            null,
            null,
          )}`;
        } else if (item === 'adConversion' || item === 'adClickRate') {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            tooltipNames[item],
            colorSet[item],
            value,
            null,
            '%',
            null,
          )}`;
        } else if (item === 'impressions') {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            tooltipNames[item],
            colorSet[item],
            value,
            null,
            null,
            '#.#a',
          )}`;
        } else {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            tooltipNames[item],
            colorSet[item],
            value,
            null,
            null,
            null,
          )}`;
        }
        return '';
      });

      // render series
      _.keys(selectedBox).map((item, index) => {
        const series = chart.current.series.push(new am4charts.LineSeries());
        // console.log('item=',item);
        if (index === 0) {
          if (item === 'adSales' || item === 'adSpend' || item === 'adCos') {
            // console.log('index 0 adSales');
            series.yAxis = valueAxis;
            valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
            firstAxis = 'currency';
          } else if (item === 'adConversion' || item === 'adClickRate') {
            // console.log('index 0 adConversion');
            series.yAxis = valueAxis;
            valueAxis.numberFormatter.numberFormat = `#.#'%'`;
            firstAxis = 'percentage';
          }
          /// / seperate out roas //
          // else if (item === 'adRoas') {
          //   valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.####`;
          //   series.yAxis = valueAxis;
          //   firstAxis = 'adRoas';
          // }
          else {
            // console.log('index 0 else');
            series.yAxis = valueAxis;
            valueAxis.numberFormatter.numberFormat = `#.####`;
            firstAxis = 'unit';
          }
          // valueAxis.renderer.line.strokeOpacity = 1;
        } else if (
          item === 'adSales' ||
          item === 'adSpend' ||
          item === 'adCos'
        ) {
          if (firstAxis === 'currency') {
            // console.log('currency');
            series.yAxis = valueAxis;
            // valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
          } else if (secondAxis === null || secondAxis === 'currency') {
            // console.log('not currency, second axis null currency')
            series.yAxis = valueAxis2;
            valueAxis2.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
            valueAxis2.renderer.opposite = true;
            // valueAxis2.renderer.line.strokeOpacity = 1;
            secondAxis = 'currency';
          } else {
            // console.log('second axis not null currency');
            series.yAxis = valueAxis3;
            valueAxis3.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
            valueAxis3.renderer.opposite = true;

            valueAxis.renderer.line.strokeOpacity = 0;
            valueAxis2.renderer.line.strokeOpacity = 0;
            valueAxis3.renderer.line.strokeOpacity = 0;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis2.renderer.labels.template.disabled = true;
            valueAxis3.renderer.labels.template.disabled = true;
          }
        } else if (item === 'adConversion' || item === 'adClickRate') {
          // console.log('adConversion');
          if (firstAxis === 'percentage') {
            // console.log('percentage');
            series.yAxis = valueAxis;
            // valueAxis.numberFormatter.numberFormat = `#.#a`;
          } else if (secondAxis === null || secondAxis === 'percentage') {
            // console.log(' not percentage, second axis null percentage');
            series.yAxis = valueAxis2;
            valueAxis2.numberFormatter.numberFormat = `#.#'%'`;
            valueAxis2.renderer.opposite = true;
            // valueAxis2.renderer.line.strokeOpacity = 1;
            secondAxis = 'percentage';
          } else {
            // console.log('second axis not null percentage');
            series.yAxis = valueAxis3;
            valueAxis3.numberFormatter.numberFormat = `#.#'%'`;
            valueAxis3.renderer.opposite = true;

            valueAxis.renderer.line.strokeOpacity = 0;
            valueAxis2.renderer.line.strokeOpacity = 0;
            valueAxis3.renderer.line.strokeOpacity = 0;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis2.renderer.labels.template.disabled = true;
            valueAxis3.renderer.labels.template.disabled = true;
          }
        }

        // seperate out roas //
        // else if (item === 'adRoas') {
        //   if (secondAxis === null) {
        //     series.yAxis = valueAxis2;
        //     valueAxis2.numberFormatter.numberFormat = `${currencySymbol}#.####`;
        //     valueAxis2.renderer.opposite = true;
        //     secondAxis = 'adRoas';
        //   } else {
        //     series.yAxis = valueAxis3;
        //     valueAxis3.numberFormatter.numberFormat = `#.####`;
        //     valueAxis3.renderer.opposite = true;

        //     valueAxis.renderer.line.strokeOpacity = 0;
        //     valueAxis2.renderer.line.strokeOpacity = 0;
        //     valueAxis3.renderer.line.strokeOpacity = 0;
        //     valueAxis.renderer.labels.template.disabled = true;
        //     valueAxis2.renderer.labels.template.disabled = true;
        //     valueAxis3.renderer.labels.template.disabled = true;
        //   }
        // }
        else if (firstAxis === 'unit') {
          // console.log('unit');
          series.yAxis = valueAxis;
          valueAxis.numberFormatter.numberFormat = `#.#a`;
        } else if (secondAxis === null || secondAxis === 'unit') {
          // console.log('not unit, second axis null unit');
          series.yAxis = valueAxis2;
          valueAxis2.numberFormatter.numberFormat = `#.#a`;
          valueAxis2.renderer.opposite = true;
          // valueAxis2.renderer.line.strokeOpacity = 1;
          secondAxis = 'unit';
        } else {
          // console.log('second axis not null unit');
          series.yAxis = valueAxis3;
          valueAxis3.numberFormatter.numberFormat = `#.#a`;
          valueAxis3.renderer.opposite = true;

          valueAxis.renderer.line.strokeOpacity = 0;
          valueAxis2.renderer.line.strokeOpacity = 0;
          valueAxis3.renderer.line.strokeOpacity = 0;
          valueAxis.renderer.labels.template.disabled = true;
          valueAxis2.renderer.labels.template.disabled = true;
          valueAxis3.renderer.labels.template.disabled = true;
        }
        const currentValue = `${item}Current`;
        const seriesName = `${item}Series`;

        series.dataFields.valueY = currentValue;
        series.dataFields.dateX = 'date';
        series.name = seriesName;
        series.strokeWidth = 2;
        // series.tooltipText = tooltipValue;
        series.tooltipHTML = tooltipValue;
        series.stroke = am4core.color(colorSet[item]);
        series.fill = am4core.color('#2e384d');

        // valueAxis.renderer.labels.template.fill = series.stroke;
        // valueAxis.renderer.line.strokeWidth = 2;

        const circleBullet = series.bullets.push(new am4charts.CircleBullet());
        circleBullet.circle.fill = am4core.color(colorSet[item]);
        circleBullet.circle.strokeWidth = 1;
        circleBullet.circle.radius = 3;
        // circleBullet.fillOpacity = 0;
        // circleBullet.strokeOpacity = 0;

        // const bulletState2 = circleBullet.states.create('hover');
        // bulletState2.properties.fillOpacity = 1;
        // bulletState2.properties.strokeOpacity = 1;

        snapToSeries.push(series);
        return '';
      });
      chart.current.cursor.snapToSeries = snapToSeries;
    }

    return () => chart.current && chart.current.dispose();
  }, [chartId, chartData, currencySymbol, selectedBox]);

  return <div id={chartId} style={{ width: '100%', height: '500px' }} />;
}

AdPerformanceChart.defaultProps = {
  chartData: [],
  currencySymbol: '',
  selectedBox: {},
};

AdPerformanceChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.object),
  currencySymbol: PropTypes.string,
  selectedBox: PropTypes.shape(PropTypes.object),
};
