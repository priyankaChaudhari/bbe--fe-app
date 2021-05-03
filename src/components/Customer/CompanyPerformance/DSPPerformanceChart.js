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

export default function DSPPerformanceChart({ chartId, chartData }) {
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
  useEffect(() => {
    // if (!chart.current) {
    chart.current = am4core.create(chartId, am4charts.XYChart);
    chart.current.data = chartData; // bind th data
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
    valueAxis.numberFormatter.bigNumberPrefixes = [
      { number: 1e3, suffix: 'K' },
      { number: 1e6, suffix: 'M' },
      { number: 1e9, suffix: 'B' },
    ];
    valueAxis.numberFormatter.smallNumberPrefixes = [];
    valueAxis.min = 0;
    valueAxis.numberFormatter.numberFormat = `#.#a`;

    const tooltipHeader = '[bold]{dateX}[/]\n';
    const tooltipCurrent = '[#2e384d]● [/]Recent [/]{label1}\n';
    const tooltipPrevious = '[#BFC5D2]● [/]Previous [/]{label2}';
    // Create series for previous data
    const series = chart.current.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value2';
    series.name = 'Previous';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 2;
    series.stroke = am4core.color('#BFC5D2');
    series.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    series.fill = am4core.color('#2e384d');
    series.propertyFields.strokeDasharray = 'dashLength';

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
    series2.dataFields.valueY = 'value1';
    series2.dataFields.dateX = 'date';
    series2.name = 'Recent';
    series2.strokeWidth = 2;
    // series2.minBulletDistance = 10;
    series2.tooltipText = `${tooltipHeader}${tooltipCurrent}${tooltipPrevious}`; // render tooltip
    series2.stroke = am4core.color('#2e384d');
    series2.fill = am4core.color('#2e384d');

    const circleBullet = series2.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.fill = am4core.color('#2e384d');
    circleBullet.circle.strokeWidth = 1;
    circleBullet.circle.radius = 3;
    // circleBullet.fillOpacity = 0;
    // circleBullet.strokeOpacity = 0;
    // var bulletState2 = circleBullet.states.create('hover');
    // bulletState2.properties.fillOpacity = 1;
    // bulletState2.properties.strokeOpacity = 1;

    // Add cursor
    chart.current.cursor = new am4charts.XYCursor();
    chart.current.cursor.lineY.disabled = true;
    chart.current.cursor.lineX.disabled = true;
    chart.current.cursor.snapToSeries = [series, series2];
    chart.current.cursor.behavior = 'none'; // disable zoom-in func.
    // }

    return () => chart.current && chart.current.dispose();
  }, [chartId, chartData]);

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
};

DSPPerformanceChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.object),
};
