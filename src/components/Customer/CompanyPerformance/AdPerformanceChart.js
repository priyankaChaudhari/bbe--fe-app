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
  // const adGraphData = [
  //   {
  //     date: new Date(2019, 5, 12),
  //     value1: 5000,
  //     value2: 4800,
  //     previousDate: new Date(2019, 5, 5),
  //   },
  //   {
  //     date: new Date(2019, 5, 13),
  //     value1: 5300,
  //     value2: 5100,
  //     previousDate: new Date(2019, 5, 6),
  //   },
  //   {
  //     date: new Date(2019, 5, 14),
  //     value1: 5600,
  //     value2: 5800,
  //     previousDate: new Date(2019, 5, 7),
  //   },
  //   {
  //     date: new Date(2019, 5, 15),
  //     value1: 5200,
  //     value2: 5300,
  //     previousDate: new Date(2019, 5, 8),
  //   },
  //   {
  //     date: new Date(2019, 5, 16),
  //     value1: 4800,
  //     value2: 4400,
  //     previousDate: new Date(2019, 5, 9),
  //   },
  //   {
  //     date: new Date(2019, 5, 17),
  //     value1: 4700,
  //     value2: 4200,
  //     previousDate: new Date(2019, 5, 10),
  //   },
  //   {
  //     date: new Date(2019, 5, 18),
  //     value1: 5900,
  //     value2: 5500,
  //     previousDate: new Date(2019, 5, 11),
  //   },

  //   {
  //     date: new Date(2019, 5, 19),
  //     value1: 5000,
  //     value2: 4800,
  //     previousDate: new Date(2019, 5, 12),
  //   },
  //   {
  //     date: new Date(2019, 5, 20),
  //     value1: 5300,
  //     value2: 5100,
  //     previousDate: new Date(2019, 5, 13),
  //   },
  //   {
  //     date: new Date(2019, 5, 21),
  //     value1: 5600,
  //     value2: 5800,
  //     previousDate: new Date(2019, 5, 14),
  //   },
  //   {
  //     date: new Date(2019, 5, 22),
  //     value1: 5020,
  //     value2: 5300,
  //     previousDate: new Date(2019, 5, 15),
  //   },
  //   {
  //     date: new Date(2019, 5, 23),
  //     value1: 4800,
  //     value2: 4400,
  //     previousDate: new Date(2019, 5, 16),
  //   },
  //   {
  //     date: new Date(2019, 5, 24),
  //     value1: 4070,
  //     value2: 4200,
  //     previousDate: new Date(2019, 5, 17),
  //   },
  //   {
  //     date: new Date(2019, 5, 25),
  //     value1: 5900,
  //     value2: 5500,
  //     previousDate: new Date(2019, 5, 18),
  //   },

  //   {
  //     date: new Date(2019, 5, 26),
  //     value1: 5000,
  //     value2: 4800,
  //     previousDate: new Date(2019, 5, 19),
  //   },
  //   {
  //     date: new Date(2019, 5, 27),
  //     value1: 5030,
  //     value2: 5100,
  //     previousDate: new Date(2019, 5, 20),
  //   },
  //   {
  //     date: new Date(2019, 5, 28),
  //     value1: 5600,
  //     value2: 5800,
  //     previousDate: new Date(2019, 5, 21),
  //   },
  //   {
  //     date: new Date(2019, 5, 29),
  //     value1: 5200,
  //     value2: null,
  //     previousDate: new Date(2019, 5, 22),
  //   },
  //   {
  //     date: new Date(2019, 5, 30),
  //     value1: 4800,
  //     value2: 4400,
  //     previousDate: new Date(2019, 5, 23),
  //   },
  //   {
  //     date: new Date(2019, 6, 1),
  //     value1: 4700,
  //     value2: null,
  //     previousDate: new Date(2019, 5, 24),
  //   },
  //   {
  //     date: new Date(2019, 6, 2),
  //     value1: 5900,
  //     value2: 5500,
  //     previousDate: new Date(2019, 5, 25),
  //   },
  // ];
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
  // ];

  useEffect(() => {
    // var selectedKeys = _.keys(selectedBox);

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
    valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;

    // Add cursor
    chart.current.cursor = new am4charts.XYCursor();
    chart.current.cursor.lineY.disabled = true;
    chart.current.cursor.lineX.disabled = true;
    chart.current.cursor.behavior = 'none';

    if (_.size(selectedBox) === 1) {
      const previousValue = `${_.keys(selectedBox)[0]}Previous`;
      const currentValue = `${_.keys(selectedBox)[0]}Current`;
      const tooltipHeader = '[bold]{dateX}[/]\n';
      const tooltipCurrent = `[#2e384d]● [/]Recent [/]${currencySymbol}{${currentValue}}\n`;
      const tooltipPrevious = `[#BFC5D2]● [/]Previous [/]${currencySymbol}{${previousValue}}`;

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
      // console.log('many', _.keys(selectedBox));
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
