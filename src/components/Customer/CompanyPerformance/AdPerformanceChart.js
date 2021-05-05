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
  //     adClickRateCurrent: 6000,
  //     adClickRatePrevious: 4500,
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
  //     adClickRateCurrent: 9000,
  //     adClickRatePrevious: 4200,
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
  //     adClickRateCurrent: 3400,
  //     adClickRatePrevious: 6000,
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
  //     adClickRateCurrent: 1000,
  //     adClickRatePrevious: 9500,
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
  //     adClickRateCurrent: 4000,
  //     adClickRatePrevious: 2500,
  //     previousDate: new Date(2019, 5, 9),
  //   },
  // ];

  useEffect(() => {
    // var selectedKeys = _.keys(selectedBox);
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

    // // render y axis
    const valueAxis = chart.current.yAxes.push(new am4charts.ValueAxis());
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
    valueAxis.numberFormatter.numberFormat = `#.#a`;

    // Add cursor
    chart.current.cursor = new am4charts.XYCursor();
    chart.current.cursor.lineY.disabled = true;
    chart.current.cursor.lineX.disabled = true;
    chart.current.cursor.behavior = 'none';

    if (_.size(selectedBox) === 1) {
      const selectedKey = _.keys(selectedBox)[0];
      const previousValue = `${_.keys(selectedBox)[0]}Previous`;
      const currentValue = `${_.keys(selectedBox)[0]}Current`;
      const tooltipHeader = '[bold]{dateX}[/]\n';
      let tooltipCurrent = '';
      let tooltipPrevious = '';
      if (
        selectedKey === 'adSales' ||
        selectedKey === 'adSpend' ||
        selectedKey === 'adCos'
      ) {
        valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
        tooltipCurrent = `[#2e384d]● [/]Recent [/]${currencySymbol}{${currentValue}}\n`;
        tooltipPrevious = `[#BFC5D2]● [/]Previous [/]${currencySymbol}{${previousValue}}`;
      } else if (
        selectedKey === 'adConversion' ||
        selectedKey === 'adClickRate'
      ) {
        valueAxis.numberFormatter.numberFormat = `#.#`;
        tooltipCurrent = `[#2e384d]● [/]Recent [/]: {${currentValue}}%\n`;
        tooltipPrevious = `[#BFC5D2]● [/]Previous [/]: {${previousValue}}%`;
      } else {
        valueAxis.numberFormatter.numberFormat = `#.#a`;
        tooltipCurrent = `[#2e384d]● [/]Recent [/]: {${currentValue}}\n`;
        tooltipPrevious = `[#BFC5D2]● [/]Previous [/]: {${previousValue}}`;
      }

      // const tooltipHeader = '[bold]{dateX}[/]\n';
      // const tooltipCurrent = `[#2e384d]● [/]Recent [/]${currencySymbol}{${currentValue}}\n`;
      // const tooltipPrevious = `[#BFC5D2]● [/]Previous [/]${currencySymbol}{${previousValue}}`;

      // Create series for previous data
      const series = chart.current.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = previousValue;
      series.name = previousValue;
      series.dataFields.dateX = 'date';
      series.strokeWidth = 2;
      series.stroke = am4core.color('#BFC5D2');
      series.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
      series.fill = am4core.color('#2e384d');
      // series.propertyFields.strokeDasharray = 'dashLength';

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
      series2.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
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
      const snapToSeries = [];
      let tooltipValue = '';
      _.keys(selectedBox).map((item) => {
        tooltipValue = `${tooltipValue} [${colorSet[item]}]● [/]${tooltipNames[item]}:\t{${item}Current}\n`;
        return '';
      });
      _.keys(selectedBox).map((item) => {
        const currentValue = `${item}Current`;
        const seriesName = `${item}Series`;
        const series = chart.current.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = currentValue;
        series.dataFields.dateX = 'date';
        series.name = seriesName;
        series.strokeWidth = 2;
        series.tooltipText = tooltipValue;
        series.stroke = am4core.color(colorSet[item]);
        series.fill = am4core.color('#2e384d');

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
