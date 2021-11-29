/* eslint-disable func-names */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { string, arrayOf, shape } from 'prop-types';

am4core.useTheme(am4themes_animated);
function DspPacingBarGraph({ chartId, chartData, currencySymbol }) {
  console.log('chartData', chartData);

  const chart = useRef(null);
  const createDspPacingBarGraph = useCallback(() => {
    const getDate = new Date();
    const currentMonthYear = dayjs(getDate).format('MMM YY');

    chart.current = am4core.create(chartId, am4charts.XYChart);
    chart.current.data = chartData;
    chart.current.logo.disabled = true;
    chart.current.padding(0, 30, 0, 0);
    chart.current.responsive.enabled = true;
    chart.current.zoomOutButton.disabled = true;

    // chart.current.data = [
    //   {
    //     monthYear: 'Jan 21',
    //     invoiceAmount: 150000,
    //     carryOver: 50000,
    //     totalInitialBudget: 200000,
    //     actualSpent: 110000,
    //     dspPacingFlag: -1,
    //     colorCode: '#d6a307',
    //   },
    //   {
    //     monthYear: 'Feb 21',
    //     invoiceAmount: 70000,
    //     carryOver: 40000,
    //     totalInitialBudget: 110000,
    //     actualSpent: 130000,
    //     dspPacingFlag: 1,
    //     colorCode: '#d63649',
    //   },
    //   {
    //     monthYear: 'Mar 21',
    //     invoiceAmount: 150000,
    //     carryOver: 50000,
    //     totalInitialBudget: 200000,
    //     actualSpent: 100000,
    //     dspPacingFlag: -1,
    //     colorCode: '#d6a307',
    //   },
    //   {
    //     monthYear: 'Apr 21',
    //     invoiceAmount: 70000,
    //     carryOver: -40000,
    //     totalInitialBudget: 110000,
    //     actualSpent: 90000,
    //     dspPacingFlag: -1,
    //     colorCode: '#d6a307',
    //   },
    //   {
    //     monthYear: 'May 21',
    //     invoiceAmount: 120000,
    //     carryOver: 70000,
    //     totalInitialBudget: 190000,
    //     actualSpent: 130000,
    //     dspPacingFlag: -1,
    //     colorCode: '#d6a307',
    //   },
    //   {
    //     monthYear: 'Jun 21',
    //     invoiceAmount: 100000,
    //     carryOver: 60000,
    //     totalInitialBudget: 160000,
    //     actualSpent: 180000,
    //     dspPacingFlag: 1,
    //     colorCode: '#d63649',
    //   },
    //   {
    //     monthYear: 'Jul 21',
    //     invoiceAmount: 50000,
    //     carryOver: -30000,
    //     totalInitialBudget: 80000,
    //     actualSpent: 40000,
    //     dspPacingFlag: -1,
    //     colorCode: '#d6a307',
    //   },
    //   {
    //     monthYear: 'Aug 21',
    //     invoiceAmount: 70000,
    //     carryOver: -40000,
    //     totalInitialBudget: 110000,
    //     actualSpent: 120000,
    //     dspPacingFlag: 1,
    //     colorCode: '#d63649',
    //   },
    //   {
    //     monthYear: 'Sep 21',
    //     invoiceAmount: 120000,
    //     carryOver: 50000,
    //     totalInitialBudget: 170000,
    //     actualSpent: 180000,
    //     dspPacingFlag: 1,
    //     colorCode: '#d63649',
    //   },
    //   {
    //     monthYear: 'Oct 21',
    //     invoiceAmount: 70000,
    //     carryOver: 40000,
    //     totalInitialBudget: 110000,
    //     actualSpent: 70000,
    //     dspPacingFlag: -1,
    //     colorCode: '#d6a307',
    //   },
    //   {
    //     monthYear: 'Nov 21',
    //     invoiceAmount: 120000,
    //     carryOver: 50000,
    //     totalInitialBudget: 170000,
    //     actualSpent: 150000,
    //     dspPacingFlag: -1,
    //     colorCode: '#d6a307',
    //   },
    //   {
    //     monthYear: 'Dec 21',
    //     invoiceAmount: 150000,
    //     carryOver: 0,
    //     totalInitialBudget: 150000,
    //     actualSpent: null,
    //     dspPacingFlag: null,
    //     colorCode: '#d63649',
    //   },
    //   {
    //     monthYear: 'Jan 22',
    //     invoiceAmount: 100000,
    //     carryOver: 50000,
    //     totalInitialBudget: 150000,
    //     actualSpent: null,
    //     dspPacingFlag: null,
    //     colorCode: '#d63649',
    //   },
    //   {
    //     monthYear: 'Feb 22',
    //     invoiceAmount: 100000,
    //     carryOver: 30000,
    //     actualSpent: null,
    //     totalInitialBudget: 130000,
    //     dspPacingFlag: null,
    //     colorCode: '#d63649',
    //   },
    //   {
    //     monthYear: 'Mar 22',
    //     invoiceAmount: 150000,
    //     carryOver: 50000,
    //     totalInitialBudget: 200000,
    //     actualSpent: null,
    //     dspPacingFlag: null,
    //   },
    //   {
    //     monthYear: 'Apr 22',
    //     invoiceAmount: 70000,
    //     carryOver: 20000,
    //     totalInitialBudget: 90000,
    //     actualSpent: null,
    //     dspPacingFlag: null,
    //     colorCode: '#d63649',
    //   },
    // ];

    // Enable chart cursor
    chart.current.cursor = new am4charts.XYCursor();
    chart.current.cursor.lineY.disabled = true;
    chart.current.cursor.lineX.disabled = true;
    chart.current.cursor.behavior = 'none';
    // custom tooltipHTML
    function renderTooltipHTML() {
      const tooltipHTML = `<div style="width:230px; padding:5px 5px 10px 5px"> 
        <div style="padding:5px 0 10px 0;"><strong>{categoryY}</strong></div>
        <ul style="padding:5px 0; margin:0; list-style-type:none;">
          <li style="display:inline;">
            <div style="display:inline-block; background-color:#8798ad; border: 1px solid white; border-radius:50%;
            width:10px; height:10px;"></div>
          </li>
          <li style="display:inline; color:#ffffff !important; font-size:11px; font-weight:400; text-transform: uppercase;
            padding:0 0 0 5px">INVOICE AMOUNT</li>
          <li style="display:inline; float: right; font-size:14px;">${currencySymbol}{invoiceAmount}</li>
          <li style="clear:both"></li>
        </ul>

        <ul style="padding:5px 0; margin:0; list-style-type:none;">
          <li style="display:inline;">
            <div style="display:inline-block; background-color:#30a8bd; border: 1px solid white; border-radius:50%;
            width:10px; height:10px;"></div>
          </li>
          <li style="display:inline; color:#ffffff !important; font-size:11px; font-weight:400; text-transform: uppercase;
            padding:0 0 0 5px">CARRY-OVER</li>
          <li style="display:inline; float: right; font-size:14px;">${currencySymbol}{carryOver}</li>
          <li style="clear:both"></li>          
        </ul>

        <ul style="padding:5px 0; margin:0; list-style-type:none;">
          <li style="display:inline;">
            <div style="display:inline-block; background-color:#2E384D; border: 0px; border-radius:50%;
            width:10px; height:10px;"></div>
          </li>
          <li style="display:inline; color:#ffffff !important; font-size:11px; font-weight:bold; text-transform: uppercase;
            padding:0 0 0 5px">INITIAL TOTAL BUDGET</li>
          <li style="display:inline; float: right; font-size:14px; font-weight:bold;">${currencySymbol}{totalInitialBudget}</li>
          <li style="clear:both"></li>          
        </ul>
        ${
          `{actualSpent}` !== null
            ? `<hr style="height:1px !important; background-color:#ffffff; font-weight:400; opacity:0.5" />
        <ul style="padding:5px 0; margin:0; list-style-type:none; width:100%;">
          <li style="display:inline; color:#ffffff !important;  border-left:2px solid #ffffff; font-size:11px;
              font-weight:bold; text-transform: uppercase; padding: 3px 10px; margin-left:5px">ACTUAL SPENT</li>
          <li style="display:inline; float: right; font-size:14px; font-weight:bold;">${currencySymbol}{actualSpent}</li>
          <li style="clear:both"></li>
        </ul>`
            : ''
        }
      </div>`;

      return tooltipHTML;
    }
    // create category axis
    const categoryAxis = chart.current.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = 'monthYear';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.labels.template.fill = am4core.color('#556178');
    categoryAxis.renderer.labels.template.padding(15, 40, 15, 20);
    categoryAxis.renderer.labels.template.location = 0.5;
    // create value axis
    const valueAxis = chart.current.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0.1;
    valueAxis.renderer.opposite = true;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.grid.template.stroke = am4core.color('#f1f1f5');
    valueAxis.renderer.grid.template.strokeWidth = 1;
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.minGridDistance = 100;
    valueAxis.renderer.labels.template.dy = -5;
    valueAxis.renderer.labels.template.fill = am4core.color('#556178');
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    // valueAxis.numberFormatter.numberFormat = `${currencySymbol}#,###.##`;
    valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;

    const series1 = chart.current.series.push(new am4charts.ColumnSeries());
    series1.columns.template.height = am4core.percent(20);
    series1.name = 'Series 1';
    series1.dataFields.categoryY = 'monthYear';
    series1.dataFields.valueX = 'invoiceAmount';
    series1.stacked = true;
    series1.columns.template.fill = am4core.color('#8798ad');
    series1.columns.template.column.cornerRadius(0, 10, 0, 10);
    series1.columns.template.strokeWidth = 0;
    series1.tooltipHTML = renderTooltipHTML();
    series1.tooltip.getFillFromObject = false;
    series1.tooltip.background.fill = am4core.color('#2E384D');
    series1.tooltip.background.fillOpacity = 1;
    series1.tooltip.background.strokeWidth = 0;
    series1.tooltip.background.filters.clear();
    series1.tooltip.background.cornerRadius = 10;

    const series2 = chart.current.series.push(new am4charts.ColumnSeries());
    series2.columns.template.height = am4core.percent(20);
    series2.name = 'Series 2';
    series2.dataFields.categoryY = 'monthYear';
    series2.dataFields.valueX = 'carryOver';
    series2.stacked = true;
    series2.columns.template.fill = am4core.color('#30a8bd');
    series2.columns.template.column.cornerRadius(10, 10, 10, 10);
    series2.columns.template.strokeWidth = 0;

    const series3 = chart.current.series.push(new am4charts.ColumnSeries());
    series3.columns.template.height = am4core.percent(80);
    series3.name = 'Series 3';
    series3.dataFields.categoryY = 'monthYear';
    series3.dataFields.valueX = 'actualSpent';
    series3.stacked = false;
    series3.clustered = false;
    series3.columns.template.propertyFields.fill = 'colorCode';
    series3.columns.template.fillOpacity = 0.1;
    series3.columns.template.strokeWidth = 0;

    // color bullets for series 3
    const valueLabel = series3.columns.template.createChild(am4core.Label);
    valueLabel.text = '';
    valueLabel.width = 2;
    valueLabel.height = am4core.percent(100);
    valueLabel.align = 'right';
    valueLabel.valign = 'middle';
    valueLabel.background.propertyFields.fill = 'colorCode';
    valueLabel.fillOpacity = 1;

    const dateRange = categoryAxis.axisRanges.create();
    dateRange.category = currentMonthYear;
    dateRange.endCategory = currentMonthYear;
    dateRange.label.fontWeight = 'bold';
    dateRange.label.horizontalCenter = 'center';
    dateRange.label.verticalCenter = 'middle';
    // dateRange.label.fill = am4core.color('#000000');
    dateRange.label.isMeasured = true;
    dateRange.label.background.fill = am4core.color('#f4f6fc');
    dateRange.axisFill.fill = am4core.color('#f4f6fc');
    dateRange.axisFill.fillOpacity = 1;
    dateRange.grid.disabled = true;
    dateRange.label.background.adapter.add('cornerRadius', function () {
      return '10, 10,10, 10';
    });
    // Set cell size in pixels
    const cellSize = 50;
    chart.current.events.on('datavalidated', function (ev) {
      // Get objects of interest
      const chartObj = ev.target;
      const categoryAxisNew = chartObj.yAxes.getIndex(0);
      // Calculate how we need to adjust chart height
      const adjustHeight =
        chartObj.data.length * cellSize - categoryAxisNew.pixelHeight;
      // get current chart height
      const targetHeight = chartObj.pixelHeight + adjustHeight;
      // Set it on chart's container
      chartObj.svgContainer.htmlElement.style.height = `${targetHeight}px`;
    });
  }, [chartData, chartId, currencySymbol]);

  useEffect(() => {
    createDspPacingBarGraph();
    return () => chart.current && chart.current.dispose();
  }, [createDspPacingBarGraph]);

  return <ChartDiv id={chartId} style={{ width: '100%' }} />;
}

export default DspPacingBarGraph;
DspPacingBarGraph.defaultProps = {
  chartData: [],
  currencySymbol: '',
};
DspPacingBarGraph.propTypes = {
  chartId: string.isRequired,
  chartData: arrayOf(shape({})),
  currencySymbol: string,
};
const ChartDiv = styled.div`
  margin: 20px 0px;
`;
