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

export default function DSPPerformanceChart({
  chartId,
  chartData,
  currencySymbol,
  selectedBox,
  selectedDF,
}) {
  const chart = useRef(null);
  useEffect(() => {
    const colorSet = {
      dspImpressions: '#0045B4',
      dspSpend: '#8C54FF',
      dspTotalProductSales: '#30A8BD',
      dspTotalRoas: '#D6A307',
      dspTotalDpvr: '#E05D37',
      dspTtlNewBrandPurchases: '#89A43C',
      dspProductSales: '#C84EC6',
      dspRoas: '#A04848',
    };

    const tooltipNames = {
      dspImpressions: 'IMPRESSIONS',
      dspSpend: 'DSP SPEND',
      dspTotalProductSales: 'TOTAL PRODUCT SALES',
      dspTotalRoas: 'TOTAL ROAS',
      dspTotalDpvr: 'TOTAL DPVR',
      dspTtlNewBrandPurchases: 'TTL NEW BRAND PURCHASES',
      dspProductSales: 'PRODUCT SALES',
      dspRoas: 'ROAS',
    };

    // const tooltipDate =
    //   '<div style="color: white; font-size: 16px;">{date}</div>';
    chart.current = am4core.create(chartId, am4charts.XYChart);
    chart.current.data = chartData;
    // chart.current.data = [];
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
      // console.log('item', item);
      let format = '';
      if (
        item === 'dspSpend' ||
        item === 'dspTotalProductSales' ||
        item === 'dspProductSales'
      ) {
        format = `${currencySymbol}#.#a`;
      } else if (
        item === 'dspTtlNewBrandPurchases' ||
        item === 'dspTotalDpvr'
      ) {
        format = `#.#'%'`;
      } else if (item === 'dspTotalRoas') {
        format = `#.#a`;
      } else {
        format = `#.#a`;
      }
      // console.log('format', format);
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
        tooltipValue = `${tooltipValue} ${_.startCase(
          _.lowerCase(tooltipNames[item]),
        )}`;
        if (
          item === 'dspSpend' ||
          item === 'dspTotalProductSales' ||
          item === 'dspProductSales'
        ) {
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
          item === 'dspTtlNewBrandPurchases' ||
          item === 'dspTotalDpvr'
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
        } else if (item === 'dspImpressions') {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            'Recent',
            colorSet[item],
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
          if (item === 'dspSpend' || item === 'dspProductSales') {
            firstAxis = 'currency';
          }
        }
        if (index === 1) {
          if (
            firstAxis === 'currency' &&
            (item === 'dspSpend' || item === 'dspProductSales')
          ) {
            series.yAxis = valueAxis;
            series2.yAxis = valueAxis;
          } else {
            valueAxis2 = chart.current.yAxes.push(new am4charts.ValueAxis());
            valueAxis2.renderer.grid.template.disabled = true;
            valueAxis2.cursorTooltipEnabled = false;
            valueAxis2.numberFormatter = new am4core.NumberFormatter();
            // valueAxis2.numberFormatter.numberFormat = `#.#a`;
            valueAxis2.numberFormatter.bigNumberPrefixes = [
              { number: 1e3, suffix: 'K' },
              { number: 1e6, suffix: 'M' },
              { number: 1e9, suffix: 'B' },
            ];
            valueAxis2.numberFormatter.smallNumberPrefixes = [];

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
      // valueAxis2.numberFormatter.numberFormat = `#.#a`;
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
      // valueAxis3.numberFormatter.numberFormat = `#.#a`;
      valueAxis3.numberFormatter.bigNumberPrefixes = [
        { number: 1e3, suffix: 'K' },
        { number: 1e6, suffix: 'M' },
        { number: 1e9, suffix: 'B' },
      ];
      valueAxis3.numberFormatter.smallNumberPrefixes = [];

      // create object of 4th value axis
      const valueAxis4 = chart.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis4.renderer.grid.template.disabled = true;
      valueAxis4.cursorTooltipEnabled = false;
      valueAxis4.numberFormatter = new am4core.NumberFormatter();
      // valueAxis4.numberFormatter.numberFormat = `#.#a`;
      valueAxis4.numberFormatter.bigNumberPrefixes = [
        { number: 1e3, suffix: 'K' },
        { number: 1e6, suffix: 'M' },
        { number: 1e9, suffix: 'B' },
      ];
      valueAxis4.numberFormatter.smallNumberPrefixes = [];

      const snapToSeries = [];
      let tooltipValue = '';

      // loop for genearate tooltip
      _.keys(selectedBox).map((item) => {
        const value = `${item}CurrentLabel`;
        // const currentLabel = `${_.keys(selectedBox)[0]}CurrentLabel`;

        if (
          item === 'dspSpend' ||
          item === 'dspTotalProductSales' ||
          item === 'dspProductSales'
        ) {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            tooltipNames[item],
            colorSet[item],
            value,
            currencySymbol,
            null,
            null,
          )}`;
        } else if (
          item === 'dspTtlNewBrandPurchases' ||
          item === 'dspTotalDpvr'
        ) {
          tooltipValue = `${tooltipValue} ${renderTooltip(
            tooltipNames[item],
            colorSet[item],
            value,
            null,
            '%',
            null,
          )}`;
        } else if (item === 'dspImpressions') {
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

        if (item === 'dspSpend' || item === 'dspProductSales') {
          if (firstAxis === null || firstAxis === 'currency') {
            // console.log('dspSpend if', item);
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
            // console.log('third axis not null/currency');
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
            // console.log('dsp 4th acis');
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
          // console.log('index  0 if');
          series.yAxis = valueAxis;
          valueAxis.numberFormatter.numberFormat = bindValueAxisFormatter(item);
          firstAxis = 'others';
        } else if (index === 1) {
          // console.log('index last else 1');
          series.yAxis = valueAxis2;
          valueAxis2.renderer.opposite = true;
          valueAxis2.numberFormatter.numberFormat = bindValueAxisFormatter(
            item,
          );
          secondAxis = 'other';
        } else if (index === 2) {
          // console.log('index 2 else');
          if (secondAxis === null) {
            // console.log('index 2 else 2nd null');
            series.yAxis = valueAxis2;
            valueAxis2.renderer.opposite = true;
            valueAxis2.numberFormatter.numberFormat = bindValueAxisFormatter(
              item,
            );
            secondAxis = 'other';
          } else {
            // console.log('index 2 else secons else');
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
          // console.log('index  3 if');
          if (thirdAxis === null) {
            // console.log('index  3 if 3rd null');
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
            // console.log('index  3 if 3rd else');
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
  }, [chartId, chartData, currencySymbol, selectedDF, selectedBox]);

  return <div id={chartId} style={{ width: '100%', height: '500px' }} />;
}

DSPPerformanceChart.defaultProps = {
  chartData: [],
  currencySymbol: '',
  selectedDF: '',
  selectedBox: {},
};

DSPPerformanceChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.object),
  currencySymbol: PropTypes.string,
  selectedDF: PropTypes.string,
  selectedBox: PropTypes.shape(PropTypes.object),
};
