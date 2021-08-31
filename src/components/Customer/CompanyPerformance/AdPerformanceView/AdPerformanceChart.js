/* eslint-disable camelcase */
import React, { useEffect, useRef } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import PropTypes, { instanceOf } from 'prop-types';

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

    // const tooltipDate =
    //   '<div style="color: white; font-size: 16px;">{date}</div>';

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
    valueAxis.extraMax = 0.005;
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
        border-radius: ${name === 'Previous' ? '2px' : '100%'};
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

    const selectedMatricsFlag = _.size(selectedBox) <= 2;

    if (selectedMatricsFlag) {
      // create object of 2nd value axis
      let valueAxis2;
      const snapToSeries = [];
      let tooltipValue = '';
      const dashLine = ``;
      let firstAxis = '';

      // loop for genearate tooltip
      _.keys(selectedBox).map((item) => {
        const currentLabel = `${item}CurrentLabel`;
        const previousLabel = `${item}PreviousLabel`;
        const colorCode = colorSet[item];
        tooltipValue = `${tooltipValue} ${_.startCase(item)}`;
        if (item === 'adSales' || item === 'adSpend' || item === 'adRoas') {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            'Recent',
            colorCode,
            currentLabel,
            currencySymbol,
            null,
            null,
          )}`;
          if (selectedDF !== 'custom') {
            tooltipValue = `${tooltipValue} ${renderTooltip(
              'Previous',
              colorCode,
              previousLabel,
              currencySymbol,
              null,
              null,
            )}`;
          }
        } else if (
          item === 'adConversion' ||
          item === 'adClickRate' ||
          item === 'adCos'
        ) {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            'Recent',
            colorCode,
            currentLabel,
            null,
            '%',
            null,
          )}`;
          if (selectedDF !== 'custom') {
            tooltipValue = `${tooltipValue} ${renderTooltip(
              'Previous',
              colorCode,
              previousLabel,
              null,
              '%',
              null,
            )}`;
          }
        } else if (item === 'impressions') {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            'Recent',
            colorCode,
            currentLabel,
            null,
            null,
            '#.#a',
          )}`;
          if (selectedDF !== 'custom') {
            tooltipValue = `${tooltipValue} ${renderTooltip(
              'Previous',
              colorCode,
              previousLabel,
              null,
              null,
              '#.#a',
            )}`;
          }
        } else {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            'Recent',
            colorCode,
            currentLabel,
            null,
            null,
            null,
          )}`;
          if (selectedDF !== 'custom') {
            tooltipValue = `${tooltipValue} ${renderTooltip(
              'Previous',
              colorCode,
              previousLabel,
              null,
              null,
              null,
            )}`;
          }
        }
        return '';
      });

      _.keys(selectedBox).map((item, index) => {
        const series = chart.current.series.push(new am4charts.LineSeries());
        const series2 = chart.current.series.push(new am4charts.LineSeries());
        const currentValue = `${item}Current`;
        const previousValue = `${item}Previous`;
        const seriesName = `${item}Series`;
        const colorCode = colorSet[item];

        if (index === 0) {
          series.yAxis = valueAxis;
          series2.yAxis = valueAxis;
          valueAxis.numberFormatter.numberFormat = bindValueAxisFormatter(item);
          if (item === 'adSales' || item === 'adSpend') {
            firstAxis = 'currency';
          }
        }
        if (index === 1) {
          if (
            firstAxis === 'currency' &&
            (item === 'adSales' || item === 'adSpend')
          ) {
            series.yAxis = valueAxis;
            series2.yAxis = valueAxis;
          } else {
            valueAxis2 = chart.current.yAxes.push(new am4charts.ValueAxis());
            valueAxis2.renderer.grid.template.disabled = true;
            valueAxis2.cursorTooltipEnabled = false;
            valueAxis2.numberFormatter = new am4core.NumberFormatter();
            valueAxis2.numberFormatter.numberFormat = `#.#a`;
            valueAxis2.extraMax = 0.005;
            valueAxis2.numberFormatter.bigNumberPrefixes = [
              { number: 1e3, suffix: 'K' },
              { number: 1e6, suffix: 'M' },
              { number: 1e9, suffix: 'B' },
            ];
            valueAxis2.numberFormatter.smallNumberPrefixes = [];
            valueAxis2.min = 0;
            series.yAxis = valueAxis2;
            series2.yAxis = valueAxis2;
            valueAxis2.renderer.opposite = true;
            valueAxis2.numberFormatter.numberFormat = bindValueAxisFormatter(
              item,
            );
          }
        }

        series.dataFields.valueY = currentValue;
        series.dataFields.dateX = 'date';
        series.name = seriesName;
        series.strokeWidth = 2;
        series.tooltipHTML = `${tooltipValue}`;
        series.stroke = am4core.color(colorCode);
        series.fill = am4core.color('#2e384d');

        const circleBullet = series.bullets.push(new am4charts.CircleBullet());
        circleBullet.circle.fill = am4core.color(colorCode);
        circleBullet.circle.strokeWidth = 1;
        circleBullet.circle.radius = 5;

        series2.dataFields.valueY = previousValue;
        series2.name = previousValue;
        series2.dataFields.dateX = 'date';
        series2.strokeWidth = 2;
        series2.stroke = am4core.color(colorCode);
        series2.tooltipHTML = `${tooltipValue}`;
        series2.fill = am4core.color('#2e384d');
        series2.strokeDasharray = '8,4';
        series2.propertyFields.strokeDasharray = dashLine;

        const bullet = series2.bullets.push(new am4charts.Bullet());
        const square = bullet.createChild(am4core.Rectangle);
        square.fill = am4core.color(colorCode);
        square.width = 8;
        square.height = 8;
        square.horizontalCenter = 'middle';
        square.verticalCenter = 'middle';

        snapToSeries.push(series);
        snapToSeries.push(series2);
        return '';
      });

      chart.current.cursor.snapToSeries = snapToSeries;
    } else {
      // else part- for multiple metrics selected

      // create object of 2nd value axis
      let firstAxis = null;
      let secondAxis = null;
      let thirdAxis = null;

      const valueAxis2 = chart.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.renderer.grid.template.disabled = true;
      valueAxis2.cursorTooltipEnabled = false;
      valueAxis2.numberFormatter = new am4core.NumberFormatter();
      valueAxis2.numberFormatter.numberFormat = `#.#a`;
      valueAxis2.extraMax = 0.005;
      valueAxis2.numberFormatter.bigNumberPrefixes = [
        { number: 1e3, suffix: 'K' },
        { number: 1e6, suffix: 'M' },
        { number: 1e9, suffix: 'B' },
      ];
      valueAxis2.min = 0;
      valueAxis2.numberFormatter.smallNumberPrefixes = [];

      // create object of 3rd value axis
      const valueAxis3 = chart.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis3.renderer.grid.template.disabled = true;
      valueAxis3.cursorTooltipEnabled = false;
      valueAxis3.numberFormatter = new am4core.NumberFormatter();
      valueAxis3.numberFormatter.numberFormat = `#.#a`;
      valueAxis3.extraMax = 0.005;
      valueAxis3.numberFormatter.bigNumberPrefixes = [
        { number: 1e3, suffix: 'K' },
        { number: 1e6, suffix: 'M' },
        { number: 1e9, suffix: 'B' },
      ];
      valueAxis3.numberFormatter.smallNumberPrefixes = [];
      valueAxis3.min = 0;
      // create object of 4th value axis
      const valueAxis4 = chart.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis4.renderer.grid.template.disabled = true;
      valueAxis4.cursorTooltipEnabled = false;
      valueAxis4.numberFormatter = new am4core.NumberFormatter();
      valueAxis4.numberFormatter.numberFormat = `#.#a`;
      valueAxis4.extraMax = 0.005;
      valueAxis4.numberFormatter.bigNumberPrefixes = [
        { number: 1e3, suffix: 'K' },
        { number: 1e6, suffix: 'M' },
        { number: 1e9, suffix: 'B' },
      ];
      valueAxis4.numberFormatter.smallNumberPrefixes = [];
      valueAxis4.min = 0;
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

        if (item === 'adSales' || item === 'adSpend') {
          if (firstAxis === null || firstAxis === 'currency') {
            // console.log('if currency');
            series.yAxis = valueAxis;
            firstAxis = 'currency';
            valueAxis.numberFormatter.numberFormat = bindValueAxisFormatter(
              item,
            );
          } else if (secondAxis === null || secondAxis === 'currency') {
            // console.log('second axis null/currency');
            series.yAxis = valueAxis2;
            valueAxis2.numberFormatter.numberFormat = bindValueAxisFormatter(
              item,
            );
            valueAxis2.renderer.opposite = true;
            secondAxis = 'currency';
          } else if (thirdAxis === null || thirdAxis === 'currency') {
            // console.log('second axis not null/currency');
            series.yAxis = valueAxis3;
            valueAxis3.numberFormatter.numberFormat = bindValueAxisFormatter(
              item,
            );
            valueAxis3.renderer.opposite = true;

            valueAxis.renderer.line.strokeOpacity = 0;
            valueAxis2.renderer.line.strokeOpacity = 0;
            valueAxis3.renderer.line.strokeOpacity = 0;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis2.renderer.labels.template.disabled = true;
            valueAxis3.renderer.labels.template.disabled = true;
            thirdAxis = 'currency';
          } else {
            series.yAxis = valueAxis4;
            valueAxis4.renderer.opposite = true;
            valueAxis4.numberFormatter.numberFormat = bindValueAxisFormatter(
              item,
            );

            valueAxis.renderer.line.strokeOpacity = 0;
            valueAxis2.renderer.line.strokeOpacity = 0;
            valueAxis3.renderer.line.strokeOpacity = 0;
            valueAxis4.renderer.line.strokeOpacity = 0;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis2.renderer.labels.template.disabled = true;
            valueAxis3.renderer.labels.template.disabled = true;
            valueAxis4.renderer.labels.template.disabled = true;
          }
        } else if (index === 0) {
          series.yAxis = valueAxis;
          valueAxis.numberFormatter.numberFormat = bindValueAxisFormatter(item);
          firstAxis = 'others';
        } else if (index === 1) {
          series.yAxis = valueAxis2;
          valueAxis2.renderer.opposite = true;
          valueAxis2.numberFormatter.numberFormat = bindValueAxisFormatter(
            item,
          );
          secondAxis = 'other';
        } else if (index === 2) {
          if (secondAxis === null) {
            series.yAxis = valueAxis2;
            valueAxis2.renderer.opposite = true;
            valueAxis2.numberFormatter.numberFormat = bindValueAxisFormatter(
              item,
            );
            secondAxis = 'other';
          } else {
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
            thirdAxis = 'others';
          }
        } else if (index === 3) {
          // console.log('index last else 3');
          if (thirdAxis === null) {
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
            thirdAxis = 'others';
          } else {
            series.yAxis = valueAxis4;
            valueAxis4.renderer.opposite = true;
            valueAxis4.numberFormatter.numberFormat = bindValueAxisFormatter(
              item,
            );

            valueAxis.renderer.line.strokeOpacity = 0;
            valueAxis2.renderer.line.strokeOpacity = 0;
            valueAxis3.renderer.line.strokeOpacity = 0;
            valueAxis4.renderer.line.strokeOpacity = 0;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis2.renderer.labels.template.disabled = true;
            valueAxis3.renderer.labels.template.disabled = true;
            valueAxis4.renderer.labels.template.disabled = true;
          }
        }

        const currentValue = `${item}Current`;
        const seriesName = `${item}Series`;

        series.dataFields.valueY = currentValue;
        series.dataFields.dateX = 'date';
        series.name = seriesName;
        series.strokeWidth = 2;
        series.tooltipHTML = `${tooltipValue}`;
        series.stroke = am4core.color(colorSet[item]);
        series.fill = am4core.color('#2e384d');

        const circleBullet = series.bullets.push(new am4charts.CircleBullet());
        circleBullet.circle.fill = am4core.color(colorSet[item]);
        circleBullet.circle.strokeWidth = 1;
        circleBullet.circle.radius = 5;

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
  selectedBox: instanceOf(Object),
  selectedDF: PropTypes.string,
};
