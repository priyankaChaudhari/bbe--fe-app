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
  //     adConversionCurrent: 5000,
  //     adConversionPrevious: 2500,
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
  //     adConversionCurrent: 7000,
  //     adConversionPrevious: 5500,
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
  //     adConversionCurrent: 5000,
  //     adConversionPrevious: 2500,
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
  //     adConversionCurrent: 6700,
  //     adConversionPrevious: 2800,
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
  //     adConversionCurrent: 3000,
  //     adConversionPrevious: 6500,
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
        valueAxis.numberFormatter.numberFormat = `#%`;
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
        tooltipValue = `${tooltipValue} [${
          colorSet[item]
        }]● [/]${item.toUpperCase()}: {${item}Current}\n`;
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
        circleBullet.fillOpacity = 0;
        circleBullet.strokeOpacity = 0;
        const bulletState2 = circleBullet.states.create('hover');
        bulletState2.properties.fillOpacity = 1;
        bulletState2.properties.strokeOpacity = 1;

        snapToSeries.push(series);
        return '';
      });
      chart.current.cursor.snapToSeries = snapToSeries;
    }
    // else {
    //   console.log('many', _.keys(selectedBox));
    //   var snapToSeries = [];
    //   var tooltipValue = '';
    //   _.keys(selectedBox).map((item) => {
    //     console.log('key:',item);
    //     console.log('color:',colorSet[item]);
    //     const currentValue = `${item}Current`;
    //     tooltipValue = `${tooltipValue} [${colorSet[item]}]● [/]${item.toUpperCase()}: {${currentValue}}\n`;
    //   });

    //   if (Object.prototype.hasOwnProperty.call(selectedBox, 'adSales')) {
    //     const adSalesSeries = chart.current.series.push(
    //       new am4charts.LineSeries(),
    //     );
    //     adSalesSeries.dataFields.valueY = 'adSalesCurrent';
    //     adSalesSeries.dataFields.dateX = 'date';
    //     adSalesSeries.name = 'adSalesCurrent';
    //     adSalesSeries.strokeWidth = 2;
    //     // adSalesSeries.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    //     adSalesSeries.tooltipText = tooltipValue;
    //     adSalesSeries.stroke = am4core.color(colorSet['adSales']);
    //     adSalesSeries.fill = am4core.color('#2e384d');

    //     const circleBullet = adSalesSeries.bullets.push(
    //       new am4charts.CircleBullet(),
    //     );
    //     circleBullet.circle.fill = am4core.color(colorSet['adSales']);
    //     circleBullet.circle.strokeWidth = 1;
    //     circleBullet.circle.radius = 3;
    //     // circleBullet.fillOpacity = 0;
    //     // circleBullet.strokeOpacity = 0;
    //     // var bulletState2 = circleBullet.states.create('hover');
    //     // bulletState2.properties.fillOpacity = 1;
    //     // bulletState2.properties.strokeOpacity = 1;

    //     // chart.current.cursor.snapToSeries = [adSalesSeries];
    //     snapToSeries.push(adSalesSeries);
    //   }
    //   if (Object.prototype.hasOwnProperty.call(selectedBox, 'adSpend')) {
    //     const adSpendSeries = chart.current.series.push(
    //       new am4charts.LineSeries(),
    //     );
    //     adSpendSeries.dataFields.valueY = 'adSpendCurrent';
    //     adSpendSeries.dataFields.dateX = 'date';
    //     adSpendSeries.name = 'adSpendCurrent';
    //     adSpendSeries.strokeWidth = 2;
    //     // adSpendSeries.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    //     adSpendSeries.tooltipText = tooltipValue;
    //     adSpendSeries.stroke = am4core.color(colorSet['adSpend']);
    //     adSpendSeries.fill = am4core.color('#2e384d');

    //     const circleBullet = adSpendSeries.bullets.push(
    //       new am4charts.CircleBullet(),
    //     );
    //     circleBullet.circle.fill = am4core.color(colorSet['adSpend']);
    //     circleBullet.circle.strokeWidth = 1;
    //     circleBullet.circle.radius = 3;
    //     // circleBullet.fillOpacity = 0;
    //     // circleBullet.strokeOpacity = 0;
    //     // var bulletState2 = circleBullet.states.create('hover');
    //     // bulletState2.properties.fillOpacity = 1;
    //     // bulletState2.properties.strokeOpacity = 1;

    //     // chart.current.cursor.snapToSeries = [adSpendSeries];
    //     snapToSeries.push(adSpendSeries);
    //   }
    //   if (Object.prototype.hasOwnProperty.call(selectedBox, 'adConversion')) {
    //     const adConversionSeries = chart.current.series.push(
    //       new am4charts.LineSeries(),
    //     );
    //     adConversionSeries.dataFields.valueY = 'adConversionCurrent';
    //     adConversionSeries.dataFields.dateX = 'date';
    //     adConversionSeries.name = 'adConversionCurrent';
    //     adConversionSeries.strokeWidth = 2;
    //     // adConversionSeries.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    //     adConversionSeries.tooltipText = tooltipValue;
    //     adConversionSeries.stroke = am4core.color(colorSet['adConversion']);
    //     adConversionSeries.fill = am4core.color('#2e384d');

    //     const circleBullet = adConversionSeries.bullets.push(
    //       new am4charts.CircleBullet(),
    //     );
    //     circleBullet.circle.fill = am4core.color(colorSet['adConversion']);
    //     circleBullet.circle.strokeWidth = 1;
    //     circleBullet.circle.radius = 3;
    //     // circleBullet.fillOpacity = 0;
    //     // circleBullet.strokeOpacity = 0;
    //     // var bulletState2 = circleBullet.states.create('hover');
    //     // bulletState2.properties.fillOpacity = 1;
    //     // bulletState2.properties.strokeOpacity = 1;

    //     // chart.current.cursor.snapToSeries = [adConversionSeries];
    //     snapToSeries.push(adConversionSeries);
    //   }
    //   if (Object.prototype.hasOwnProperty.call(selectedBox, 'impressions')) {
    //     const impressionsSeries = chart.current.series.push(
    //       new am4charts.LineSeries(),
    //     );
    //     impressionsSeries.dataFields.valueY = 'impressionsCurrent';
    //     impressionsSeries.dataFields.dateX = 'date';
    //     impressionsSeries.name = 'impressionsCurrent';
    //     impressionsSeries.strokeWidth = 2;
    //     // impressionsSeries.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    //     impressionsSeries.tooltipText = tooltipValue;
    //     impressionsSeries.stroke = am4core.color(colorSet['impressions']);
    //     impressionsSeries.fill = am4core.color('#2e384d');

    //     const circleBullet = impressionsSeries.bullets.push(
    //       new am4charts.CircleBullet(),
    //     );
    //     circleBullet.circle.fill = am4core.color(colorSet['impressions']);
    //     circleBullet.circle.strokeWidth = 1;
    //     circleBullet.circle.radius = 3;
    //     // circleBullet.fillOpacity = 0;
    //     // circleBullet.strokeOpacity = 0;
    //     // var bulletState2 = circleBullet.states.create('hover');
    //     // bulletState2.properties.fillOpacity = 1;
    //     // bulletState2.properties.strokeOpacity = 1;

    //     // chart.current.cursor.snapToSeries = [impressionsSeries];
    //     snapToSeries.push(impressionsSeries);
    //   }
    //   if (Object.prototype.hasOwnProperty.call(selectedBox, 'adCos')) {
    //     const adCosSeries = chart.current.series.push(
    //       new am4charts.LineSeries(),
    //     );
    //     adCosSeries.dataFields.valueY = 'adCosCurrent';
    //     adCosSeries.dataFields.dateX = 'date';
    //     adCosSeries.name = 'adCosCurrent';
    //     adCosSeries.strokeWidth = 2;
    //     // adCosSeries.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    //     adCosSeries.tooltipText = tooltipValue;
    //     adCosSeries.stroke = am4core.color(colorSet['adCos']);
    //     adCosSeries.fill = am4core.color('#2e384d');

    //     const circleBullet = adCosSeries.bullets.push(
    //       new am4charts.CircleBullet(),
    //     );
    //     circleBullet.circle.fill = am4core.color(colorSet['adCos']);
    //     circleBullet.circle.strokeWidth = 1;
    //     circleBullet.circle.radius = 3;
    //     // circleBullet.fillOpacity = 0;
    //     // circleBullet.strokeOpacity = 0;
    //     // var bulletState2 = circleBullet.states.create('hover');
    //     // bulletState2.properties.fillOpacity = 1;
    //     // bulletState2.properties.strokeOpacity = 1;

    //     // chart.current.cursor.snapToSeries = [adCosSeries];
    //     snapToSeries.push(adCosSeries);
    //   }
    //   if (Object.prototype.hasOwnProperty.call(selectedBox, 'adRoas')) {
    //     const adRoasSeries = chart.current.series.push(
    //       new am4charts.LineSeries(),
    //     );
    //     adRoasSeries.dataFields.valueY = 'adRoasCurrent';
    //     adRoasSeries.dataFields.dateX = 'date';
    //     adRoasSeries.name = 'adRoasCurrent';
    //     adRoasSeries.strokeWidth = 2;
    //     // adRoasSeries.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    //     adRoasSeries.tooltipText = tooltipValue;
    //     adRoasSeries.stroke = am4core.color(colorSet['adRoas']);
    //     adRoasSeries.fill = am4core.color('#2e384d');

    //     const circleBullet = adRoasSeries.bullets.push(
    //       new am4charts.CircleBullet(),
    //     );
    //     circleBullet.circle.fill = am4core.color(colorSet['adRoas']);
    //     circleBullet.circle.strokeWidth = 1;
    //     circleBullet.circle.radius = 3;
    //     // circleBullet.fillOpacity = 0;
    //     // circleBullet.strokeOpacity = 0;
    //     // var bulletState2 = circleBullet.states.create('hover');
    //     // bulletState2.properties.fillOpacity = 1;
    //     // bulletState2.properties.strokeOpacity = 1;

    //     // chart.current.cursor.snapToSeries = [adRoasSeries];
    //     snapToSeries.push(adRoasSeries);
    //   }
    //   if (Object.prototype.hasOwnProperty.call(selectedBox, 'adClicks')) {
    //     const adClicksSeries = chart.current.series.push(
    //       new am4charts.LineSeries(),
    //     );
    //     adClicksSeries.dataFields.valueY = 'adClicksCurrent';
    //     adClicksSeries.dataFields.dateX = 'date';
    //     adClicksSeries.name = 'adClicksCurrent';
    //     adClicksSeries.strokeWidth = 2;
    //     // adClicksSeries.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    //     adClicksSeries.tooltipText = tooltipValue;
    //     adClicksSeries.stroke = am4core.color(colorSet['adClicks']);
    //     adClicksSeries.fill = am4core.color('#2e384d');

    //     const circleBullet = adClicksSeries.bullets.push(
    //       new am4charts.CircleBullet(),
    //     );
    //     circleBullet.circle.fill = am4core.color(colorSet['adClicks']);
    //     circleBullet.circle.strokeWidth = 1;
    //     circleBullet.circle.radius = 3;
    //     // circleBullet.fillOpacity = 0;
    //     // circleBullet.strokeOpacity = 0;
    //     // var bulletState2 = circleBullet.states.create('hover');
    //     // bulletState2.properties.fillOpacity = 1;
    //     // bulletState2.properties.strokeOpacity = 1;

    //     // chart.current.cursor.snapToSeries = [adClicksSeries];
    //     snapToSeries.push(adClicksSeries);
    //   }
    //   if (Object.prototype.hasOwnProperty.call(selectedBox, 'adClickRate')) {
    //     const adClickRateSeries = chart.current.series.push(
    //       new am4charts.LineSeries(),
    //     );
    //     adClickRateSeries.dataFields.valueY = 'adClickRateCurrent';
    //     adClickRateSeries.dataFields.dateX = 'date';
    //     adClickRateSeries.name = 'adClickRateCurrent';
    //     adClickRateSeries.strokeWidth = 2;
    //     // adClickRateSeries.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    //     adClickRateSeries.tooltipText = tooltipValue;
    //     adClickRateSeries.stroke = am4core.color(colorSet['adClickRate']);
    //     adClickRateSeries.fill = am4core.color('#2e384d');

    //     const circleBullet = adClickRateSeries.bullets.push(
    //       new am4charts.CircleBullet(),
    //     );
    //     circleBullet.circle.fill = am4core.color(colorSet['adClickRate']);
    //     circleBullet.circle.strokeWidth = 1;
    //     circleBullet.circle.radius = 3;
    //     // circleBullet.fillOpacity = 0;
    //     // circleBullet.strokeOpacity = 0;
    //     // var bulletState2 = circleBullet.states.create('hover');
    //     // bulletState2.properties.fillOpacity = 1;
    //     // bulletState2.properties.strokeOpacity = 1;

    //     // chart.current.cursor.snapToSeries = [adClickRateSeries];
    //     snapToSeries.push(adClickRateSeries);
    //   }
    //   chart.current.cursor.snapToSeries = snapToSeries;
    // }

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
