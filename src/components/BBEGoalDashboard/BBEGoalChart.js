import React, { useEffect, useRef } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesDataviz from '@amcharts/amcharts4/themes/dataviz';
import { arrayOf, shape, string } from 'prop-types';

import Theme from '../../theme/Theme';

am4core.useTheme(am4themesDataviz);

const BBEGoalChart = ({ data, CHART_ID }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
    }

    return () => {
      chartRef.current.dispose();
    };
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = am4core.create(CHART_ID, am4charts.XYChart);

      chartRef.current.data = data;

      chartRef.current.logo.disabled = true; // disable amchart logo

      // Add X Axis
      const xAxis = chartRef.current.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = 'month';
      xAxis.renderer.inversed = true;
      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.labels.template.disabled = true;
      xAxis.renderer.baseGrid.disabled = true;
      xAxis.cursorTooltipEnabled = false;

      // Add Y Axis
      const yAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.labels.template.disabled = true;
      yAxis.renderer.baseGrid.disabled = true;
      xAxis.cursorTooltipEnabled = false;

      // Create series
      const series = chartRef.current.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = 'revenue';
      series.dataFields.categoryX = 'month';
      series.name = 'revenue';
      series.fillOpacity = 1;
      series.columns.template.column.adapter.add('fill', (fill, target) => {
        const valueX = target.dataItem.categories.categoryX;
        if (valueX === 'JANUARY') {
          return am4core.color(Theme.orange);
        }
        return am4core.color(Theme.gray45);
      });
      series.strokeWidth = 0;
      series.columns.template.width = 25;
      series.columns.template.column.cornerRadiusTopLeft = 6;
      series.columns.template.column.cornerRadiusTopRight = 6;
      series.columns.template.column.cornerRadiusBottomLeft = 6;
      series.columns.template.column.cornerRadiusBottomRight = 6;

      // Series tooltip
      series.columns.template.column.tooltipX = am4core.percent(50);
      series.columns.template.column.tooltipY = am4core.percent(0);

      series.columns.template.column.tooltipText = `[font-size: 10px]{categoryX} REVENUE[/]\n[bold ${Theme.gray6} font-size: 20px margin-botton:5px]\${valueY}[/]`;
      series.tooltip.dy = -5;
      series.tooltip.getFillFromObject = false;
      series.tooltip.pointerOrientation = 'down';
      series.tooltip.background.fill = am4core.color(Theme.darkBlue);
      series.tooltip.background.stroke = am4core.color(Theme.darkBlue);
      // series.tooltip.label.maxWidth = 150;
      series.tooltip.label.wrap = true;
      series.tooltip.background.cornerRadius = 10;

      // Add cursor
      chartRef.current.cursor = new am4charts.XYCursor();
      chartRef.current.cursor.maxTooltipDistance = -1;

      // Disable axis lines
      chartRef.current.cursor.lineX.disabled = true;
      chartRef.current.cursor.lineY.disabled = true;

      // Disable axis tooltips
      xAxis.cursorTooltipEnabled = false;
      yAxis.cursorTooltipEnabled = false;

      // Disable zoom
      chartRef.current.cursor.behavior = 'none';
    }
  }, [CHART_ID, data]);

  return <div id={CHART_ID} style={{ width: '100%' }} />;
};

export default BBEGoalChart;

BBEGoalChart.defaultProps = {
  data: null,
};
BBEGoalChart.propTypes = {
  data: arrayOf(shape({})),
  CHART_ID: string.isRequired,
};
