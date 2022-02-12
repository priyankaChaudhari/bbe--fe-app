import React, { useEffect, useRef } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesDataviz from '@amcharts/amcharts4/themes/dataviz';
import { arrayOf, shape, string } from 'prop-types';

import Theme from '../../theme/Theme';

am4core.useTheme(am4themesDataviz);

const BBEGoalChart = ({ data, CHART_ID, selectedMonthYear }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = am4core.create(CHART_ID, am4charts.XYChart);
    chartRef.current = chart;
    chart.logo.disabled = true; // disable amchart logo
    chart.data = data?.reverse();

    // Add X Axis
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = 'month_year';
    xAxis.renderer.inversed = true;
    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.labels.template.disabled = true;
    xAxis.renderer.baseGrid.disabled = true;
    xAxis.cursorTooltipEnabled = false;

    // Add Y Axis
    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.labels.template.disabled = true;
    yAxis.renderer.baseGrid.disabled = true;
    xAxis.cursorTooltipEnabled = false;

    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'rev_share';
    series.dataFields.categoryX = 'month_year';
    series.name = 'rev_share';
    series.fillOpacity = 1;
    series.columns.template.column.adapter.add('fill', (fill, target) => {
      const valueX = target.dataItem.categories.categoryX;
      if (valueX === selectedMonthYear) {
        return am4core.color(Theme.orange);
      }
      return am4core.color(Theme.gray45);
    });
    series.strokeWidth = 0;
    series.columns.template.width = am4core.percent(70);
    series.columns.template.column.cornerRadiusTopLeft = 6;
    series.columns.template.column.cornerRadiusTopRight = 6;
    series.columns.template.column.cornerRadiusBottomLeft = 6;
    series.columns.template.column.cornerRadiusBottomRight = 6;

    // Series tooltip
    series.columns.template.column.tooltipX = am4core.percent(50);
    series.columns.template.column.tooltipY = am4core.percent(0);

    series.columns.template.column.tooltipText = `[font-size: 10px]{categoryX.replace('-','')} REVENUE[/]\n[bold ${Theme.gray6} font-size: 20px margin-botton:5px]\${valueY}[/]`;

    series.columns.template.column.adapter.add(
      'tooltipText',
      (fill, target) => {
        const month = target.dataItem.categoryX.split('-');
        return `[font-size: 10px]${month[0].toUpperCase()} REVENUE[/]\n[bold ${
          Theme.gray6
        } font-size: 20px margin-botton:5px]\${valueY}[/]`;
      },
    );

    series.tooltip.dy = -5;
    series.tooltip.getFillFromObject = false;
    series.tooltip.pointerOrientation = 'down';
    series.tooltip.ignoreBounds = true;
    series.tooltip.background.fill = am4core.color(Theme.darkBlue);
    series.tooltip.background.stroke = am4core.color(Theme.darkBlue);
    // series.tooltip.label.maxWidth = 150;
    series.tooltip.label.wrap = true;
    series.tooltip.background.cornerRadius = 10;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.maxTooltipDistance = -1;

    // Disable axis lines
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    // Disable axis tooltips
    xAxis.cursorTooltipEnabled = false;
    yAxis.cursorTooltipEnabled = false;

    // Disable zoom
    chart.cursor.behavior = 'none';

    return () => {
      chart.dispose();
    };
  }, [CHART_ID, data, selectedMonthYear]);

  return <div id={CHART_ID} style={{ width: '100%' }} />;
};

export default BBEGoalChart;

BBEGoalChart.defaultProps = {
  data: null,
};
BBEGoalChart.propTypes = {
  data: arrayOf(shape({})),
  CHART_ID: string.isRequired,
  selectedMonthYear: string.isRequired,
};
