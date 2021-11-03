/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import styled from 'styled-components';
import { string, arrayOf, shape } from 'prop-types';

import { WhiteCard } from '../../../../common';
// Themes begin

function am4themes_colorTheme(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [am4core.color('#97ca61'), am4core.color('#eaeff2')];
  }
}
am4core.useTheme(am4themes_colorTheme);
am4core.useTheme(am4themes_animated);
function InventoryScoreGraph({ chartId, pieData, dspData }) {
  const chart = useRef(null);
  const createInventoryScoreGraph = useCallback(() => {
    chart.current = am4core.create(chartId, am4charts.PieChart);
    chart.current.data = pieData;
    chart.current.resizable = true;
    chart.current.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.current.radius = am4core.percent(100);
    chart.current.innerRadius = am4core.percent(70);
    chart.current.startAngle = 180;
    chart.current.endAngle = 360;
    chart.current.logo.disabled = true;
    // create Pie series chart
    const pieSeries = chart.current.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';
    pieSeries.alignLabels = false;
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 7;
    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.startAngle = 90;
    pieSeries.hiddenState.properties.endAngle = 90;
    // Disable ticks and labels
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    // Disable tooltips
    pieSeries.slices.template.tooltipText = '';
    // Disable sliding out of slices
    pieSeries.slices.template.states.getKey(
      'active',
    ).properties.shiftRadius = 0;
    pieSeries.slices.template.states.getKey('hover').properties.shiftRadius = 0;
    pieSeries.slices.template.states.getKey('hover').properties.scale = 1;

    const customLabelHTML = `[font-size:36px; color:#000000]${
      pieData && pieData.length && !Number.isNaN(pieData[0].value)
        ? pieData[0].value
        : 'N/A'
    }\n[font-size:14px; color:#556178;]Out of 1000`;

    const label = chart.current.seriesContainer.createChild(am4core.Label);
    label.textAlign = 'middle';
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    label.text = customLabelHTML;
    // label.fill = am4core.color('#556178');
  }, [chartId, pieData]);

  useEffect(() => {
    createInventoryScoreGraph();
    return () => chart.current && chart.current.dispose();
  }, [createInventoryScoreGraph]);

  return (
    <div className="col-md-4 col-sm-12 mb-3">
      <WhiteCard className="fix-height ">
        <p className="black-heading-title mt-0 mb-4">Inventory Score (IPI)</p>
        <PieChartDiv id={chartId} />
        {/* <div className="average">
          {pieData && pieData.length && !Number.isNaN(pieData[0].value)
            ? pieData[0].value
            : 'N/A'}
          <div className="out-off">Out of 1000</div>
        </div> */}
        <br />
        <div className="last-update mt-3 ">
          Last updated: {dspData && dspData.latest_date}
        </div>
      </WhiteCard>
    </div>
  );
}

export default InventoryScoreGraph;

InventoryScoreGraph.defaultProps = {
  pieData: [],
  dspData: [],
};
InventoryScoreGraph.propTypes = {
  chartId: string.isRequired,
  pieData: arrayOf(shape({})),
  dspData: arrayOf(shape({})),
};

const PieChartDiv = styled.div`
  max-width: 170px;
  width: 100%;
  height: 140px;
  margin: 0 auto 50px 0;
`;
