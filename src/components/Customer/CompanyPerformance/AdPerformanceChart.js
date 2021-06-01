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
  selectedDF,
}) {
  const chart = useRef(null);
  useEffect(() => {
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

    const tooltipDate =
      '<div style="color: white; font-size: 16px;">{date}</div>';

    chart.current = am4core.create(chartId, am4charts.XYChart);
    chart.current.data = chartData;
    chart.current.paddingRight = 20;
    chart.current.logo.disabled = true; // disable amchart logo
    // render X axis
    const dateAxis = chart.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.renderer.labels.template.location = 0.5;
    dateAxis.dy = 10;
    dateAxis.cursorTooltipEnabled = false;

    // create object of first value axis
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

    function bindValueAxisFormatter(item) {
      let format = '';
      if (item === 'adSales' || item === 'adSpend') {
        format = `${currencySymbol}#.#a`;
      } else if (
        item === 'adConversion' ||
        item === 'adClickRate' ||
        item === 'adCos'
      ) {
        format = `#.#'%'`;
      } else if (item === 'adRoas') {
        format = `${currencySymbol}#.#`;
      } else {
        format = `#.#a`;
      }
      return format;
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
        selectedKey === 'adRoas'
      ) {
        if (selectedKey === 'adRoas') {
          valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#`;
        } else {
          valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
        }
        tooltipCurrent = renderTooltip(
          'Recent',
          '#FF5933',
          currentLabel,
          currencySymbol,
          null,
          null,
        );
        if (selectedDF !== 'custom') {
          tooltipPrevious = renderTooltip(
            'Previous',
            '#BFC5D2',
            previousLabel,
            currencySymbol,
            null,
            null,
          );
        }
      } else if (
        selectedKey === 'adConversion' ||
        selectedKey === 'adClickRate' ||
        selectedKey === 'adCos'
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
        if (selectedDF !== 'custom') {
          tooltipPrevious = renderTooltip(
            'Previous',
            '#BFC5D2',
            previousLabel,
            null,
            '%',
            null,
          );
        }
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
        if (selectedDF !== 'custom') {
          tooltipPrevious = renderTooltip(
            'Previous',
            '#BFC5D2',
            previousLabel,
            null,
            null,
            '#.#a',
          );
        }
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
        if (selectedDF !== 'custom') {
          tooltipPrevious = renderTooltip(
            'Previous',
            '#BFC5D2',
            previousLabel,
            null,
            null,
            null,
          );
        }
      }

      // Create series for previous data
      const series = chart.current.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = previousValue;
      series.name = previousValue;
      series.dataFields.dateX = 'date';
      series.strokeWidth = 2;
      series.stroke = am4core.color('#BFC5D2');
      series.tooltipHTML = `${tooltipDate} ${tooltipCurrent} ${tooltipPrevious}`;
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
      series2.tooltipHTML = `${tooltipDate}${tooltipCurrent} ${tooltipPrevious}`;
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

      // create object of 2nd value axis
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

      // create object of 3rd value axis
      const valueAxis3 = chart.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis3.renderer.grid.template.disabled = true;
      valueAxis3.cursorTooltipEnabled = false;
      valueAxis3.numberFormatter = new am4core.NumberFormatter();
      valueAxis3.numberFormatter.numberFormat = `#.#a`;

      // create object of 4th value axis
      const valueAxis4 = chart.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis4.renderer.grid.template.disabled = true;
      valueAxis4.cursorTooltipEnabled = false;
      valueAxis4.numberFormatter = new am4core.NumberFormatter();
      valueAxis4.numberFormatter.numberFormat = `#.#a`;
      const snapToSeries = [];
      let tooltipValue = '';

      // loop for genearate tooltip
      _.keys(selectedBox).map((item) => {
        const value = `${item}CurrentLabel`;
        // const currentLabel = `${_.keys(selectedBox)[0]}CurrentLabel`;

        if (item === 'adSales' || item === 'adSpend' || item === 'adRoas') {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            tooltipNames[item],
            colorSet[item],
            value,
            currencySymbol,
            null,
            null,
          )}`;
        } else if (
          item === 'adConversion' ||
          item === 'adClickRate' ||
          item === 'adCos'
        ) {
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

      _.keys(selectedBox).map((item, index) => {
        const series = chart.current.series.push(new am4charts.LineSeries());
        if (index === 0) {
          series.yAxis = valueAxis;
          valueAxis.numberFormatter.numberFormat = bindValueAxisFormatter(item);
        }
        if (index === 1) {
          series.yAxis = valueAxis2;
          valueAxis2.renderer.opposite = true;
          valueAxis2.numberFormatter.numberFormat = bindValueAxisFormatter(
            item,
          );
        } else if (index === 2) {
          series.yAxis = valueAxis3;
          valueAxis3.renderer.opposite = true;
          valueAxis3.numberFormatter.numberFormat = bindValueAxisFormatter(
            item,
          );
          valueAxis.renderer.line.strokeOpacity = 0;
          valueAxis2.renderer.line.strokeOpacity = 0;
          valueAxis3.renderer.line.strokeOpacity = 0;
          valueAxis.renderer.labels.template.disabled = true;
          valueAxis2.renderer.labels.template.disabled = true;
          valueAxis3.renderer.labels.template.disabled = true;
        }
        if (index === 3) {
          series.yAxis = valueAxis4;
          valueAxis3.numberFormatter.numberFormat = bindValueAxisFormatter(
            item,
          );
          valueAxis4.renderer.line.strokeOpacity = 0;
          valueAxis4.renderer.labels.template.disabled = true;
        }

        const currentValue = `${item}Current`;
        const seriesName = `${item}Series`;

        series.dataFields.valueY = currentValue;
        series.dataFields.dateX = 'date';
        series.name = seriesName;
        series.strokeWidth = 2;
        series.tooltipHTML = `${tooltipDate}${tooltipValue}`;
        series.stroke = am4core.color(colorSet[item]);
        series.fill = am4core.color('#2e384d');

        const circleBullet = series.bullets.push(new am4charts.CircleBullet());
        circleBullet.circle.fill = am4core.color(colorSet[item]);
        circleBullet.circle.strokeWidth = 1;
        circleBullet.circle.radius = 3;

        snapToSeries.push(series);
        return '';
      });

      chart.current.cursor.snapToSeries = snapToSeries;
    }

    return () => chart.current && chart.current.dispose();
  }, [chartId, chartData, currencySymbol, selectedBox, selectedDF]);

  return <div id={chartId} style={{ width: '100%', height: '500px' }} />;
}

AdPerformanceChart.defaultProps = {
  chartData: [],
  currencySymbol: '',
  selectedBox: {},
  selectedDF: '',
};

AdPerformanceChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.object),
  currencySymbol: PropTypes.string,
  selectedBox: PropTypes.shape(PropTypes.object),
  selectedDF: PropTypes.string,
};
