/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import styled from 'styled-components';
import { string, arrayOf, shape } from 'prop-types';

am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);
am4core.color('red');
function BbPercentChart({ chartId, chartData }) {
  const chart = useRef(null);
  const averageValue = chartData && chartData[0].avg;

  const getValueAxisMaxValue = useCallback(() => {
    let valueAxisMaxValue = {};
    if (averageValue > 50) {
      valueAxisMaxValue = averageValue * 2;
      return valueAxisMaxValue;
    }
    valueAxisMaxValue = 110;
    return valueAxisMaxValue;
  }, [averageValue]);

  const createBbPercentChart = useCallback(() => {
    chart.current = am4core.create(chartId, am4charts.XYChart);
    chart.current.padding(20, 10, 20, 0);
    chart.current.data = chartData;
    chart.current.logo.disabled = true;
    // Enable chart cursor
    chart.current.cursor = new am4charts.XYCursor();
    chart.current.cursor.lineY.disabled = true;
    chart.current.cursor.lineX.stroke = am4core.color('#396478');
    chart.current.cursor.lineX.strokeWidth = 1;
    chart.current.cursor.lineX.strokeOpacity = 1;
    chart.current.cursor.lineX.strokeDasharray = '';
    chart.current.cursor.behavior = 'none';
    // Create Y axes
    const valueAxis = chart.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.minGridDistance = 10;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.opposite = true;
    valueAxis.min = 0;
    valueAxis.max = getValueAxisMaxValue();
    valueAxis.strictMinMax = true;
    //  Create X axes
    const dateAxis = chart.current.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.labels.template.disabled = true;
    dateAxis.cursorTooltipEnabled = false;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 1;
    // custom tooltip
    const tooltipHTML = `<div style="width: 100px; height:45px; border:none !important; font-size:16px">
          {date}<br/><span style="color:#ffffff">{valueY}%</span>
        </div>`;
    // Create series
    const series = chart.current.series.push(new am4charts.LineSeries());
    series.name = 'Buy Box Percentage series';
    series.stroke = am4core.color('#000000');
    series.fill = am4core.color('#000000');
    series.strokeWidth = 2;
    series.tensionX = 1;
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.tooltipHTML = tooltipHTML;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color('#2E384D');
    series.tooltip.background.fillOpacity = 1;
    series.tooltip.background.strokeWidth = 0;
    series.tooltip.label.fontSize = 14;
    series.tooltip.label.fill = am4core.color('#ffffff');
    series.tooltip.background.filters.clear();
    // Create saverage line
    const range = valueAxis.axisRanges.create();
    range.value = averageValue;
    range.grid.stroke = am4core.color('#BFC5D2');
    range.grid.strokeWidth = 1.5;
    range.grid.strokeOpacity = 1;
    range.label.background.fill = am4core.color('#BFC5d2');
    range.label.text = `${averageValue}%`;
    range.label.padding(8, 5, 5, 5);
    range.label.verticalCenter = 'bottom';
  }, [chartId, chartData, getValueAxisMaxValue, averageValue]);

  useEffect(() => {
    createBbPercentChart();
    getValueAxisMaxValue();
    return () => chart.current && chart.current.dispose();
  }, [createBbPercentChart, getValueAxisMaxValue]);
  return <ChartDiv id={chartId} style={{ width: '100%', height: '200px' }} />;
}

export default BbPercentChart;
BbPercentChart.defaultProps = {
  chartData: [],
};
BbPercentChart.propTypes = {
  chartId: string.isRequired,
  chartData: arrayOf(shape({})),
};

const ChartDiv = styled.div`
  margin: 20px 0px;
`;
