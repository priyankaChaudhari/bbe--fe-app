/* eslint-disable func-names */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import styled from 'styled-components';
import { string, arrayOf, shape } from 'prop-types';

am4core.useTheme(am4themes_animated);
function DspPacingBarGraph({ chartId, chartData, currencySymbol }) {
  console.log('chartData', chartData);
  //
  //   const currentDate = 'Nov 18 2021';
  const chart = useRef(null);
  const createDspPacingBarGraph = useCallback(() => {
    chart.current = am4core.create(chartId, am4charts.XYChart);
    chart.current.data = chartData;
    chart.current.logo.disabled = true;
    chart.current.padding(0, 30, 0, 0);
    //   chart.current.dateFormatter.dateFormat = 'yyyy-MM-dd';

    //   chart.current.data = [
    //     {
    //       date: 'Jul 2021',
    //       invoiceAmount: 15000,
    //       carryOver: 5000,
    //       actualSpent: 0,
    //     },
    //     {
    //       date: 'Aug 2021',
    //       invoiceAmount: 7000,
    //       carryOver: 4000,
    //       actualSpent: 0,
    //     },
    //     {
    //       date: 'Sep 2021',
    //       invoiceAmount: 15000,
    //       carryOver: 5000,
    //       actualSpent: 0,
    //     },
    //     {
    //       date: 'Oct 2021',
    //       invoiceAmount: 7000,
    //       carryOver: 4000,
    //       actualSpent: 0,
    //     },
    //     {
    //       date: 'Nov 2021',
    //       invoiceAmount: 20000,
    //       carryOver: 5000,
    //       actualSpent: 15000,
    //     },
    //     {
    //       date: 'Dec 2021',
    //       invoiceAmount: 15000,
    //       carryOver: 0,
    //       actualSpent: 20000,
    //     },
    //     {
    //       date: 'Jan 2022',
    //       invoiceAmount: 10000,
    //       carryOver: 5000,
    //       actualSpent: 8000,
    //     },
    //     {
    //       date: 'Feb 2022',
    //       invoiceAmount: 12000,
    //       carryOver: 3000,
    //       actualSpent: 10000,
    //     },
    //     {
    //       date: 'Mar 2022',
    //       invoiceAmount: 15000,
    //       carryOver: 5000,
    //       actualSpent: 10000,
    //     },
    //     {
    //       date: 'Apr 2022',
    //       invoiceAmount: 7000,
    //       carryOver: 2000,
    //       actualSpent: 12000,
    //     },
    //     {
    //       date: 'May 2022',
    //       invoiceAmount: 15000,
    //       carryOver: 15000,
    //       actualSpent: 20000,
    //     },
    //     {
    //       date: 'Jun 2022',
    //       invoiceAmount: 20000,
    //       carryOver: 5000,
    //       actualSpent: 15000,
    //     },
    //     {
    //       date: 'Jul 2022',
    //       invoiceAmount: 15000,
    //       carryOver: 5000,
    //       actualSpent: 10000,
    //     },
    //     {
    //       date: 'Aug 2022',
    //       invoiceAmount: 7000,
    //       carryOver: 4000,
    //       actualSpent: 3000,
    //     },
    //     {
    //       date: 'Sep 2022',
    //       invoiceAmount: 15000,
    //       carryOver: 5000,
    //       actualSpent: 10000,
    //     },
    //     {
    //       date: 'Oct 2022',
    //       invoiceAmount: 7000,
    //       carryOver: 4000,
    //       actualSpent: 9000,
    //     },
    //     {
    //       date: 'Nov 2022',
    //       invoiceAmount: 20000,
    //       carryOver: 5000,
    //       actualSpent: 15000,
    //     },
    //     {
    //       date: 'Dec 2022',
    //       invoiceAmount: 15000,
    //       carryOver: 0,
    //       actualSpent: 20000,
    //     },
    // {
    //   date: 'Jan 2023',
    //   invoiceAmount: 10000,
    //   carryOver: 5000,
    //   actualSpent: 8000,
    // },
    // {
    //   date: 'Feb 2023',
    //   invoiceAmount: 12000,
    //   carryOver: 3000,
    //   actualSpent: 10000,
    // },
    // {
    //   date: 'Mar 2023',
    //   invoiceAmount: 15000,
    //   carryOver: 5000,
    //   actualSpent: 10000,
    // },
    // {
    //   date: 'Apr 2023',
    //   invoiceAmount: 7000,
    //   carryOver: 2000,
    //   actualSpent: 12000,
    // },
    // {
    //   date: 'May 2023',
    //   invoiceAmount: 15000,
    //   carryOver: 15000,
    //   actualSpent: 20000,
    // },
    // {
    //   date: 'Jun 2023',
    //   invoiceAmount: 20000,
    //   carryOver: 5000,
    //   actualSpent: 15000,
    // },
    //   ];

    // Enable chart cursor
    chart.current.cursor = new am4charts.XYCursor();
    chart.current.cursor.lineY.disabled = true;
    chart.current.cursor.lineX.disabled = true;
    chart.current.cursor.behavior = 'none';
    // create category axis
    const categoryAxis = chart.current.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = 'monthYear';
    categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.inversed = true;
    //   categoryAxis.dateFormatter = new am4core.DateFormatter();
    //   categoryAxis.dateFormatter.dateFormat = 'MMM dd';
    // categoryAxis.dateFormats.setKey('day', 'MMM dd');
    // categoryAxis.periodChangeDateFormats.setKey('day', 'dd MMM');
    // categoryAxis.renderer.labels.template.padding(0, 40, 0, 10);
    categoryAxis.renderer.labels.template.fill = am4core.color('#556178');
    categoryAxis.renderer.labels.template.paddingLeft = 20;
    categoryAxis.renderer.labels.template.paddingRight = 40;
    categoryAxis.renderer.labels.template.location = 0.5;
    // categoryAxis.renderer.labels.template.dx = -20;

    // const dateAxis = chart.current.yAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.grid.template.disabled = true;
    // dateAxis.renderer.grid.template.location = 0;
    // dateAxis.renderer.minGridDistance = 30;
    // dateAxis.cursorTooltipEnabled = false;
    // dateAxis.dataFields.date = 'date';
    // dateAxis.renderer.inversed = true;
    // dateAxis.renderer.grid.template.location = 0;
    // // dateAxis.dateFormatter = new am4core.DateFormatter();
    // dateAxis.dateFormats.setKey('day', 'MMM dd');
    // // dateAxis.dateFormats.setKey('day', 'MMMM dt');
    // // dateAxis.periodChangeDateFormats.setKey('month', 'MMM');
    // dateAxis.renderer.labels.template.fill = am4core.color('#556178');
    // dateAxis.renderer.labels.template.paddingLeft = 20;
    // dateAxis.renderer.labels.template.paddingRight = 40;
    // // dateAxis.renderer.labels.template.dx = -20;
    // // dateAxis.renderer.cellStartLocation = 0.1;
    // // dateAxis.renderer.cellEndLocation = 1;

    const valueAxis = chart.current.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.opposite = true;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.grid.template.stroke = am4core.color('#f1f1f5');
    valueAxis.renderer.grid.template.strokeWidth = 1;
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.minGridDistance = 50;
    valueAxis.renderer.labels.template.dy = -5;
    valueAxis.renderer.labels.template.fill = am4core.color('#556178');
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = `${currencySymbol}#,###.##`;
    // valueAxis.numberFormatter.numberFormat = `${currencySymbol}#.#a`;
    // custom tooltipHTML
    const actualSpent = 1;

    const tooltipHTML = `<div style="width:250px; padding:5px 5px 10px 5px"> 
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
          <li style="display:inline; float: right; font-size:14px; font-weight:bold;">${currencySymbol}20,000</li>
          <li style="clear:both"></li>          
        </ul>
        ${
          actualSpent !== 0
            ? `<hr style="height:1px !important; font-weight:400; opacity:0.5" />
        <ul style="padding:5px 0; margin:0; list-style-type:none; width:100%;">
          <li style="display:inline; color:#ffffff !important;  border-left:2px solid #ffffff; font-size:11px;
              font-weight:bold; text-transform: uppercase; padding: 3px 10px; margin-left:5px">ACTUAL SPENT</li>
          <li style="display:inline; float: right; font-size:14px; font-weight:bold;">${currencySymbol}{actualSpent}</li>
          <li style="clear:both"></li>
        </ul>`
            : ''
        }
    </div>`;

    const series1 = chart.current.series.push(new am4charts.ColumnSeries());
    series1.columns.template.height = am4core.percent(20);
    series1.name = 'Series 1';
    // series1.dataFields.dateY = 'date';
    series1.dataFields.categoryY = 'monthDate';
    series1.dataFields.valueX = 'invoiceAmount';
    series1.stacked = true;
    series1.columns.template.fill = am4core.color('#8798ad');
    series1.columns.template.column.cornerRadius(0, 10, 0, 10);
    series1.tooltipHTML = tooltipHTML;
    series1.tooltip.getFillFromObject = false;
    series1.tooltip.background.fill = am4core.color('#2E384D');
    series1.tooltip.background.fillOpacity = 1;
    series1.tooltip.background.strokeWidth = 0;
    series1.tooltip.background.filters.clear();
    series1.tooltip.background.cornerRadius = 10;

    const series2 = chart.current.series.push(new am4charts.ColumnSeries());
    series2.columns.template.height = am4core.percent(20);
    series2.name = 'Series 2';
    // series2.dataFields.dateY = 'date';
    series2.dataFields.categoryY = 'monthDate';
    series2.dataFields.valueX = 'carryOver';
    series2.stacked = true;
    series2.columns.template.fill = am4core.color('#30a8bd');
    series2.columns.template.column.cornerRadius(10, 10, 10, 10);

    const series3 = chart.current.series.push(new am4charts.ColumnSeries());
    series3.columns.template.height = am4core.percent(80);
    series3.name = 'Series 3';
    // series3.dataFields.dateY = 'date';
    series3.dataFields.categoryY = 'monthDate';
    series3.dataFields.valueX = 'actualSpent';
    series3.stacked = false;
    series3.clustered = false;
    series3.columns.template.fill = am4core.color('#ff0000');
    series3.columns.template.fillOpacity = 0.1;
    series3.columns.template.strokeOpacity = 0;
    // color marker for series 3
    const valueLabel = series3.columns.template.createChild(am4core.Label);
    valueLabel.text = '';
    valueLabel.width = 2;
    valueLabel.height = am4core.percent(100);
    valueLabel.align = 'right';
    valueLabel.valign = 'middle';
    valueLabel.background.fill = am4core.color('#d73941');
    valueLabel.fillOpacity = 1;

    const dateRange = categoryAxis.axisRanges.create();
    // const dateRange = dateAxis.axisRanges.create();
    dateRange.category = 'Nov 2021';
    dateRange.endCategory = 'Nov 2021';
    // dateRange.date = new Date(2021, 10, 18);
    // dateRange.endDate = new Date(2021, 11, 18, 24);
    dateRange.label.fontWeight = 'bold';
    dateRange.label.fill = am4core.color('#000000');
    dateRange.label.isMeasured = true;
    // dateRange.label.dx = 0;
    dateRange.label.background.fill = am4core.color('#f4f6fc');
    dateRange.grid.disabled = true;
    dateRange.axisFill.fill = am4core.color('#f4f6fc');
    dateRange.axisFill.fillOpacity = 1;

    // Set cell size in pixels
    const cellSize = 40;
    chart.current.events.on('datavalidated', function (ev) {
      // Get objects of interest
      const chart2 = ev.target;
      const categoryAxis2 = chart2.yAxes.getIndex(0);
      // Calculate how we need to adjust chart height
      const adjustHeight =
        chart2.data.length * cellSize - categoryAxis2.pixelHeight;
      // get current chart height
      const targetHeight = chart2.pixelHeight + adjustHeight;
      // Set it on chart's container
      chart2.svgContainer.htmlElement.style.height = `${targetHeight}px`;
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
