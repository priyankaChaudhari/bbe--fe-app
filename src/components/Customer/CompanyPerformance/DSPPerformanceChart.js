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

export default function DSPPerformanceChart({
  chartId,
  chartData,
  currencySymbol,
}) {
  const chart = useRef(null);
  useEffect(() => {
    // const adGraphData = [
    //   {
    //     date: new Date(2019, 5, 12),
    //     value1: 5000,
    //     value2: 4800,
    //     previousDate: new Date(2019, 5, 5),
    //   },
    //   {
    //     date: new Date(2019, 5, 13),
    //     value1: 1300,
    //     value2: 5100,
    //     previousDate: new Date(2019, 5, 6),
    //   },
    //   {
    //     date: new Date(2019, 5, 14),
    //     value1: 2600,
    //     value2: 1800,
    //     previousDate: new Date(2019, 5, 7),
    //   },
    //   {
    //     date: new Date(2019, 5, 15),
    //     value1: 900,
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
    //     value2: 3200,
    //     previousDate: new Date(2019, 5, 10),
    //   },
    // ];
    // if (!chart.current) {
    chart.current = am4core.create(chartId, am4charts.XYChart);
    chart.current.data = chartData; // bind th data
    // console.log('chartData', chartData);
    // chart.current.data = adGraphData; // bind th data
    chart.current.paddingRight = 20;
    chart.current.logo.disabled = true; // disable amchart logo

    // render X axis
    const dateAxis = chart.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dy = 10;
    dateAxis.cursorTooltipEnabled = false;

    function renderTooltip(name, color, value, currency) {
      const tooltipText = `<ul style="padding:0; margin: 0 0 4px 0;">
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
        padding-left: 5px;">${name}</div>
      </li>
      <li style="display: inline-block;float: right; margin-left: 25px;">
        <div style=" color: white;
        font-size: 16px;">${currency}{${value}}</div>
      </li>
    </ul>
    `;
      return tooltipText;
    }

    // render y axis
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

    // const tooltipCurrent = `[#2e384d]● [/]Recent [/]${currencySymbol}{label1}\n`;
    // const tooltipPrevious = `[#BFC5D2]● [/]Previous [/]${currencySymbol}{label2}`;
    let tooltipCurrent = ``;
    let tooltipPrevious = ``;
    tooltipCurrent = renderTooltip(
      'Recent',
      '#2e384d',
      'DspCurrentLabel',
      currencySymbol,
    );
    tooltipPrevious = renderTooltip(
      'Previous',
      '#BFC5D2',
      'DspPreviousLabel',
      currencySymbol,
    );
    // Create series for previous data
    const series = chart.current.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'DspPrevious';
    series.name = 'Previous';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 2;
    series.stroke = am4core.color('#BFC5D2');
    // series.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    series.tooltipHTML = `${tooltipCurrent} ${tooltipPrevious}`;
    series.fill = am4core.color('#2e384d');
    series.propertyFields.strokeDasharray = 'DspdashLength';

    // add bullet for
    const circleBullet2 = series.bullets.push(new am4charts.CircleBullet());
    circleBullet2.circle.fill = am4core.color('#BFC5D2');
    circleBullet2.circle.strokeWidth = 1;
    circleBullet2.circle.radius = 3;

    // series for current data
    const series2 = chart.current.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = 'DspCurrent';
    series2.dataFields.dateX = 'date';
    series2.name = 'Recent';
    series2.strokeWidth = 2;
    // series2.minBulletDistance = 10;
    series2.tooltipHTML = `${tooltipCurrent} ${tooltipPrevious}`;

    series2.stroke = am4core.color('#2e384d');
    series2.fill = am4core.color('#2e384d');

    const circleBullet = series2.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.fill = am4core.color('#2e384d');
    circleBullet.circle.strokeWidth = 1;
    circleBullet.circle.radius = 3;

    // Add cursor
    chart.current.cursor = new am4charts.XYCursor();
    chart.current.cursor.lineY.disabled = true;
    chart.current.cursor.lineX.disabled = true;
    chart.current.cursor.snapToSeries = [series, series2];
    chart.current.cursor.behavior = 'none'; // disable zoom-in func.
    // }

    return () => chart.current && chart.current.dispose();
  }, [chartId, chartData, currencySymbol]);

  // useEffect(() => {
  //   if (chart.current) {
  //     chart.current.data = chartData;
  //   }
  // }, [chartData]);

  // useEffect(() => {
  //   return () => {
  //     chart.current && chart.current.dispose();
  //   };
  // }, []);
  return <div id={chartId} style={{ width: '100%', height: '500px' }} />;
}

DSPPerformanceChart.defaultProps = {
  chartData: [],
  currencySymbol: '',
};

DSPPerformanceChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.object),
  currencySymbol: PropTypes.string,
};
